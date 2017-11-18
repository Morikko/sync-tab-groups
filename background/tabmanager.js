/**
 * Functions that update the tabs in browser
 * All are insynchronous functions
 * ALL functions HAVE TO return a new Promises that is resolved when everything is done
 * Have direct access (R/W) to the data
 */
var TabManager = TabManager || {};

/**
 * Take the current tabs on the desire window and set it as the tabs
 * for the group
 * Asynchronous
 * @param {Number} window id
 * @return {Promise}
 */
TabManager.updateTabsInGroup = async function(windowId) {
  try {
    var groupId = GroupManager.getGroupIdInWindow(windowId);
    const tabs = await browser.tabs.query({
      windowId: windowId
    });
    GroupManager.setTabsInGroupId(groupId, tabs);
    return "TabManager.updateTabsInGroup done on window id " + windowId;

  } catch (e) {
    return "TabManager.updateTabsInGroup failed; " + e;
  }
}

/**
 * Open all the tabs in tabsToOpen
 * @param {array[Tab]} tabsToOpen
 * @param {Number} windowId
 * @param {Boolean} inLastPos (optional) - if true the tabs are opened in last index
 * @param {Boolean} openAtLeastOne (optional) - if true and tabsToOpen is empty, open at least a new tab
 * @return {Promise}
 */
TabManager.openListOfTabs = async function(
  tabsToOpen,
  windowId,
  inLastPos = false,
  openAtLeastOne = false) {
  try {
    // Look if has Tab in tabs
    if (tabsToOpen.length === 0) {
      if (openAtLeastOne) {
        if (tabsToOpen.length === 0) {
          tabsToOpen.push({
            url: "about:newtab",
            active: true,
            pinned: false
          });
        }
      } else {
        return "TabManager.openListOfTabs: tabsToOpen was empty, no tab to open";
      }
    }

    // Always open in last pos
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      GroupManager.getGroupIdInWindow(windowId)
    );
    let indexOffset = 0;
    if (inLastPos) {
      indexOffset = GroupManager.groups[groupIndex].tabs.length;
    }

    await Promise.all(tabsToOpen.map(async (tab, index) => {
      tab.url = (tab.url === "about:privatebrowsing") ? "about:newtab" : tab.url;
      if (!Utils.isPrivilegedURL(tab.url)) {
        // Create a tab to tab.url or to newtab
        await browser.tabs.create({
          url: (tab.url === "about:newtab") ? null : tab.url,
          active: tab.active,
          pinned: tab.pinned,
          index: indexOffset + index,
          windowId: windowId
        });
      }
    }));
    return ("TabManager.openListOfTabs done!");

  } catch (e) {
    return "TabManager.openListOfTabs failed; " + e;
  }
}

/**
 * Go to the tab specified with tabId
 * The tab needs to be in an open window
 * @param {Number} tabIndex - the tab index
 * @return {Promise}
 */
TabManager.activeTabInWindow = async function(windowId, tabIndex) {
  try {
    const tabs = await browser.tabs.query({
      windowId: windowId
    });
    for (let tab of tabs) {
      if (tab.index === tabIndex) {
        await browser.tabs.update(tab.id, {
          active: true
        });
      }
    }
    return "TabManager.activeTabInWindow done!";

  } catch (e) {
    return "TabManager.activeTabInWindow: tab " + tabIndex + " in window " + windowId + " not found. " + e;
  }
}

/**
 * Move tab beetwen groups already created (closed or opened)
 * @param {Number} sourceGroupID
 * @param {Number} tabIndex
 * @param {Number} targetGroupID
 * @return {Promise}
 */
TabManager.moveTabToGroup = async function(sourceGroupID, tabIndex, targetGroupID) {
  try {
    // Case 1: same group
    if (sourceGroupID === targetGroupID) {
      resolve("TabManager.moveTabToGroup done!");
    }

    let targetGroupIndex = GroupManager.getGroupIndexFromGroupId(
      targetGroupID
    );
    let sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
      sourceGroupID
    );

    let tab = GroupManager.groups[sourceGroupIndex].tabs[tabIndex];

    let isSourceGroupOpen = GroupManager.isGroupIndexInOpenWindow(sourceGroupIndex);
    let isTargetGroupOpen = GroupManager.isGroupIndexInOpenWindow(targetGroupIndex);
    // TODO
    // Case 2: Closed Group -> Closed Group
    if (!isSourceGroupOpen && !isTargetGroupOpen) {
      GroupManager.groups[targetGroupIndex].tabs.push(tab);
      GroupManager.groups[sourceGroupIndex].tabs.splice(tabIndex, 1);
    }
    // Case 3: Open Group -> Closed Groups
    else if (isSourceGroupOpen && !isTargetGroupOpen) {
      GroupManager.groups[targetGroupIndex].tabs.push(tab);
      await browser.tabs.remove([tab.id]);
    }
    // Case 4: Closed Group -> Open Group
    else if (!isSourceGroupOpen && isTargetGroupOpen) {
      GroupManager.groups[sourceGroupIndex].tabs.splice(tabIndex, 1);
      await TabManager.openListOfTabs(
        [tab],
        GroupManager.groups[targetGroupIndex].windowId,
        true,
        false);
    }
    // Case 5: Open Group -> Open Group
    else {
      await browser.tabs.move(
        tab.id, {
          index: tab.pinned ? 0 : -1,
          windowId: GroupManager.groups[targetGroupIndex].windowId
        }
      );
    }
    return "TabManager.moveTabToGroup done!";

  } catch (e) {
    return "TabManager.moveTabToGroup failed; " + e;
  }
}

/**
 * Move a tab to a new group
 * @param {Number} sourceGroupID
 * @param {Number} tabIndex
 * @return {Promise}
 */
TabManager.moveTabToNewGroup = async function(sourceGroupID, tabIndex) {
  try {
    var sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
      sourceGroupID);

    let tab = GroupManager.groups[sourceGroupIndex].tabs[tabIndex];
    GroupManager.addGroupWithTab([tab]);

    let isSourceGroupOpen = GroupManager.isGroupIndexInOpenWindow(sourceGroupIndex);

    if (isSourceGroupOpen) {
      return browser.tabs.remove([tab.id]);
    } else {
      // TODO
      GroupManager.groups[sourceGroupIndex].tabs.splice(tabIndex, 1);
      return "TabManager.moveTabToNewGroup done!";
    }
  } catch (e) {
    return "TabManager.moveTabToNewGroup failed; " + e;
  }
}

/**
 * Close the tabs that are privileged URL
 * Privileged url: chrome: URLs, javascript: URLs,
                    data: URLs, file: URLs, about: URLs
 * Non-privileged URLs: about:blank, about:newtab ( should be
 * replaced by null ), all the other ones
 * Asynchronous
 * @return {Promise}
 */
TabManager.removeTabsWithUnallowedURL = async function(groupID) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupID
    );
    let windowId = GroupManager.getWindowIdFromGroupId(
      groupID
    );

    // Get not supported link tab id
    var tabsIds = [];
    GroupManager.groups[groupIndex].tabs.map((tab) => {
      if (Utils.isPrivilegedURL(tab.url))
        tabsIds.push(tab.id);
    });

    // Don't let empty window
    if (GroupManager.groups[groupIndex].tabs.length === tabsIds.length) {
      await TabManager.openListOfTabs([], windowId, false, true);
    }

    // Remove them
    await browser.tabs.remove(tabsIds);

    // Update data
    const tabs = await browser.tabs.query({
      windowId: windowId
    });

    GroupManager.setTabsInGroupId(groupID, tabs);
    return "TabManager.removeTabsWithUnallowedURL done!";

  } catch (e) {
    return "TabManager.removeTabsWithUnallowedURL failed; " + e;
  }
}


/**
 * Selects a given tab.
 * Switch to another group if necessary
 * @param {Number} tabIndex - the tabs index
 * @param {Number} groupID - the tabs groupID
 * @return {Promise}
 */
TabManager.selectTab = async function(tabIndex, groupID) {
  try {
    await WindowManager.selectGroup(groupID);
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupID
    );
    let windowId = GroupManager.groups[groupIndex].windowId;
    await TabManager.activeTabInWindow(windowId, tabIndex);
    return "TabManager.selectTab done!";

  } catch (e) {
    return "TabManager.selectTab failed; " + e;
  }
}
