/**
 * Functions that update the tabs in browser
 * All are insynchronous functions
 * ALL functions HAVE TO return a new Promises that is resolved when everything is done
 * Have direct access (R/W) to the data
 */
var TabManager = TabManager || {};

TabManager.removedPinnedTabs = function(tabs) {
  for (let i = tabs.length - 1; i >= 0; i--) {
    if (tabs[i].pinned) {
      tabs.splice(i, 1);
    }
  }
}

/**
 * Take the current tabs on the desire window and set it as the tabs
 * for the group
 * @param {Number} window id
 * @return {Promise}
 */
TabManager.updateTabsInGroup = async function(windowId) {
  try {
    const window = await browser.windows.get(windowId);
    // Private Window sync
    if (!OptionManager.options.privateWindow.sync &&
      window.incognito) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because private window are not synchronized";
    }

    var groupId = GroupManager.getGroupIdInWindow(windowId);
    const tabs = await browser.tabs.query({
      windowId: windowId
    });

    // Pinned tab
    if (!OptionManager.options.pinnedTab.sync) {
      TabManager.removedPinnedTabs(tabs);
    }

    GroupManager.setTabsInGroupId(groupId, tabs);
    return "TabManager.updateTabsInGroup done on window id " + windowId;

  } catch (e) {
    let msg = "TabManager.updateTabsInGroup failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Open all the tabs in tabsToOpen
 * @param {array[Tab]} tabsToOpen
 * @param {Number} windowId
 * @param {Boolean} inLastPos (optional) - if true the tabs are opened in last index
 * @param {Boolean} openAtLeastOne (optional) - if true and tabsToOpen is empty, open at least a new tab
 * @return {Proise{Array[Tab]} - created tab
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
        tabsToOpen.push({
          url: "about:newtab",
          active: true,
          pinned: false
        });
      } else {
        return "TabManager.openListOfTabs: tabsToOpen was empty, no tab to open";
      }
    }

    let createdTabs = [];

    // Always open in last pos
    let indexTabOffset = 0,
      indexPinnedOffset = 0;
    if (inLastPos || !OptionManager.options.pinnedTab.sync) {
      const tabs = await browser.tabs.query({
        windowId: windowId
      });

      // Count pinned tabs
      indexPinnedOffset = tabs.reduce((count, tab) => {
        if (tab.pinned)
          count++;
        return count;
      }, 0);
      indexTabOffset = indexPinnedOffset;

      if (inLastPos) {
        indexTabOffset = indexTabOffset + tabs.length;
      }
    }
    let index = 0;
    for (let tab of tabsToOpen) {
      tab.url = (tab.url === "about:privatebrowsing") ? "about:newtab" : tab.url;
      if (!Utils.isPrivilegedURL(tab.url)) {
        // Create a tab to tab.url or to newtab
        createdTabs[index] = await browser.tabs.create({
          url: (tab.url === "about:newtab") ? null : tab.url,
          active: tab.active,
          pinned: tab.pinned,
          index: (tab.pinned) ? indexPinnedOffset : indexTabOffset,
          windowId: windowId
        });
        if (tab.pinned) {
          indexPinnedOffset++;
        }
        indexTabOffset++;
        index++;
      }
    }

    return (createdTabs);

  } catch (e) {
    let msg = "TabManager.openListOfTabs failed; " + e;
    console.error(msg);
    return msg;
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
 * Move a tab opened between two open windows
 * The tab is put at the last position for pinned and normal tabs
 * in the targeted window.
 * @param {Tab} tab
 * @param {Number} windowId
 */
TabManager.moveOpenTabToGroup = async function(tab, windowId) {
  const pinned_tabs = await browser.tabs.query({
    windowId: windowId,
    pinned: true
  });
  await browser.tabs.move(
    tab.id, {
      index: tab.pinned ? pinned_tabs.length : -1,
      windowId: windowId
    }
  );
}

/**
 * Move tab beetwen groups already created (closed or opened)
 * @param {Number} sourceGroupID
 * @param {Number} tabIndex
 * @param {Number} targetGroupID
 * @return {Promise}
 */
TabManager.moveTabBetweenGroups = async function(sourceGroupID, tabIndex, targetGroupID) {
  try {
    // Case 1: same group
    if (sourceGroupID === targetGroupID) {
      return "TabManager.moveTabBetweenGroups done!";
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

    // Case 5: Open Group -> Open Group
    if (isSourceGroupOpen && isTargetGroupOpen) {
      TabManager.moveOpenTabToGroup(tab, GroupManager.groups[targetGroupIndex].windowId);
    }
    // Case 2: Closed Group -> Closed Group
    // Case 3: Open Group -> Closed Groups
    // Case 4: Closed Group -> Open Group
    else {
      await GroupManager.addTabInGroupId(targetGroupID, tab);
      await GroupManager.removeTabFromIndexInGroupId(sourceGroupID, tabIndex);
    }
    return "TabManager.moveTabBetweenGroups done!";

  } catch (e) {
    let msg = "TabManager.moveTabBetweenGroups failed; " + e;
    console.error(msg);
    return msg;
  }
}

TabManager.moveTabToGroup = async function(tabId, targetGroupId) {
  try {
    let sourceGroupId = GroupManager.getGroupIdFromTabId(tabId);
    if (sourceGroupId >= 0) { // Is in groups
      let sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
        sourceGroupId
      );
      let tabIndex = GroupManager.getTabIndexFromTabId(tabId, sourceGroupIndex, true);
      TabManager.moveTabBetweenGroups(
        sourceGroupId,
        tabIndex,
        targetGroupId
      );
    } else { // Unsync window
      let targetGroupIndex = GroupManager.getGroupIndexFromGroupId(
        targetGroupId
      );
      let isTargetGroupOpen = GroupManager.isGroupIndexInOpenWindow(targetGroupIndex);
      const tab = await browser.tabs.get(tabId);
      if (isTargetGroupOpen) { // To open group
        TabManager.moveOpenTabToGroup(tab, GroupManager.groups[targetGroupIndex].windowId);
      } else { // To close group
        await GroupManager.addTabInGroupId(targetGroupId, tab);
        await browser.tabs.remove(tabId);
      }
    }
    return "TabManager.moveTabToGroup done!";

  } catch (e) {
    let msg = "TabManager.moveTabToGroup failed; " + e;
    console.error(msg);
    return msg;
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

    await GroupManager.removeTabFromIndexInGroupId(sourceGroupID, tabIndex);

    return "TabManager.moveTabToNewGroup done!";
  } catch (e) {
    let msg = "TabManager.moveTabToNewGroup failed; " + e;
    console.error(msg);
    return msg;
  }
}

TabManager.moveUnSyncTabToNewGroup = async function(tabId) {
  try {
    const tab = await browser.tabs.get(tabId);

    GroupManager.addGroupWithTab([tab]);
    await browser.tabs.remove(tabId);

    return "TabManager.moveTabToNewGroup done!";
  } catch (e) {
    let msg = "TabManager.moveTabToNewGroup failed; " + e;
    console.error(msg);
    return msg;
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
      await TabManager.openListOfTabs([], windowId, true, true);
    }

    // Remove them
    await browser.tabs.remove(tabsIds);

    return "TabManager.removeTabsWithUnallowedURL done!";

  } catch (e) {
    let msg = "TabManager.removeTabsWithUnallowedURL failed; " + e;
    console.error(msg);
    return msg;
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
    let msg = "TabManager.selectTab failed; " + e;
    console.error(msg);
    return msg;
  }
}
