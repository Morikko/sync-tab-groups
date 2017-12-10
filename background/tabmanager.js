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
 * @param {Number} window id
 * @return {Promise}
 */
TabManager.updateTabsInGroup = async function(windowId) {
  try {
    const allWindows = await browser.windows.getAll();

    let window;
    for (let w of allWindows) {
      if (w.id === windowId) {
        window = w;
        break;
      }
    }
    if (window === undefined) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because window has been closed";
    }

    // Private Window sync
    if (!OptionManager.options.privateWindow.sync &&
      window.incognito) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because private windows are not synchronized";
    }

    if (!GroupManager.isWindowAlreadyRegistered(window.id)) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because window is not synchronized";
    }

    var groupId = GroupManager.getGroupIdInWindow(windowId);
    let selector = {
      windowId: windowId
    };
    // Pinned tab
    if (!OptionManager.options.pinnedTab.sync) {
      selector["pinned"] = false;
    }
    const tabs = await browser.tabs.query(selector);

    // Remove fancy pages
    for (let tab of tabs) {
      if (tab.url.includes("priviledged-tab.html")) {
        tab.url = Utils.getParameterByName('url', tab.url)
      }
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
 * Count the number of pinned tabs in tabs
 * @param {Array[Tab]} - tabs
 * @return {Number} - nbr of pinned tabs
 */
TabManager.countPinnedTabs = function( tabs ) {
  return tabs.reduce((count, tab) => {
    if (tab.pinned)
      count++;
    return count;
  }, 0);
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
    let tabIdsCrossRef = {};

    // Always open in last pos
    let indexTabOffset = 0,
      indexPinnedOffset = 0;
    if (inLastPos || !OptionManager.options.pinnedTab.sync) {
      const tabs = await browser.tabs.query({
        windowId: windowId
      });

      indexPinnedOffset = TabManager.countPinnedTabs(tabs);
      indexTabOffset = indexPinnedOffset;

      if (inLastPos) {
        indexTabOffset = indexTabOffset + tabs.length;
      }
    }
    let index = 0;
    for (let tab of tabsToOpen) {
      let url = tab.url;
      url = (url === "about:privatebrowsing") ? "about:newtab" : url;
      if (Utils.isPrivilegedURL(url)) {
        url = "/pages/priviledged-tab/priviledged-tab.html?" +
          "title=" + tab.title.replace(' ', '+') +
          "&url=" + tab.url +
          "&favIconUrl=" + tab.favIconUrl;
      }
      // Create a tab to tab.url or to newtab
      let tabCreationProperties = {
        url: (url === "about:newtab") ? null : url,
        active: tab.active,
        pinned: tab.pinned,
        index: (tab.pinned) ? indexPinnedOffset : indexTabOffset,
        windowId: windowId
      };
      // Update parentId
      if (tab.hasOwnProperty("openerTabId")) {
        // Check tab is still present -> was not removed when group was closed
        // Parent tab has to be opened before children else it will be lost
        if (tabIdsCrossRef.hasOwnProperty(tab.openerTabId)) {
          let tabParentId = tabIdsCrossRef[tab.openerTabId];
          tabCreationProperties["openerTabId"] = tabParentId;
        }
      }
      createdTabs[index] = await browser.tabs.create(tabCreationProperties);
      tabIdsCrossRef[tab.id] = createdTabs[index].id;

      if (tab.pinned) {
        indexPinnedOffset++;
      }
      indexTabOffset++;
      index++;

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
 * Take an index and return the value for
 *   pinned tabs are always before normal tabs
 *   normal tabs are always after pinned tabs
 *   -1 value is replaced with the real last index value
 * @param {Number} index - index where to go
 * @param {Tab} tab - tab related
 * @param {Array[Tab]} tabs - targeted tabs
 * @return {Number} secureIndex
 */
TabManager.secureIndex = function(index, tab, tabs) {
  let realIndex = index;
  let pinnedTabsCount = TabManager.countPinnedTabs(tabs);
  if (tab.pinned) { // Pinned tabs are in targeted position and at least just behind last pinned tab
    realIndex = (realIndex>pinnedTabsCount||realIndex===-1)?pinnedTabsCount:realIndex;
  } else { // Normal tabs are in targeted position and never before pinned tabs
    realIndex = (realIndex<pinnedTabsCount&&realIndex>-1)?pinnedTabsCount:realIndex;
  }
  realIndex = (realIndex===-1)?tabs.length:realIndex;
  return realIndex;
}

/**
 * Move a tab opened between two open windows
 * The tab is put at the last position for pinned and normal tabs
 * in the targeted window.
 * @param {Tab} tab
 * @param {Number} windowId
 * @param {Number} targetIndex
 */
TabManager.moveOpenTabToGroup = async function(tab, windowId, targetIndex = -1) {
  const tabs = await browser.tabs.query({
    windowId: windowId
  });
  if(!OptionManager.options.pinnedTab.sync && targetIndex > -1) { // Add offset of unvisible unsync pinned tab
    targetIndex += TabManager.countPinnedTabs(tabs);
  }
  let realIndex = TabManager.secureIndex(targetIndex, tab, tabs);

  if ( tab.windowId === windowId &&
  realIndex > tab.index) { // The move will first removed the tab before the next place it will appear
    realIndex--;
  }

  await browser.tabs.move(
    tab.id, {
      index: realIndex,
      windowId: windowId
    }
  );
}

/**
 * Move tab beetwen groups already created (closed or opened)
 * If targetTabIndex is -1, put the tab at the end
 * @param {Number} sourceGroupId
 * @param {Number} sourceTabIndex
 * @param {Number} targetGroupId
 * @param {Number} targetTabIndex (default=-1)
 * @return {Promise}
 */
TabManager.moveTabBetweenGroups = async function(sourceGroupId, sourceTabIndex,
  targetGroupId, targetTabIndex = -1) {
  try {
    let targetGroupIndex = GroupManager.getGroupIndexFromGroupId(
      targetGroupId
    );
    let sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
      sourceGroupId
    );

    let tab = GroupManager.groups[sourceGroupIndex].tabs[sourceTabIndex];

    let isSourceGroupOpen = GroupManager.isGroupIndexInOpenWindow(sourceGroupIndex);
    let isTargetGroupOpen = GroupManager.isGroupIndexInOpenWindow(targetGroupIndex);

    // Case 1: same group TODO TEST
    if (sourceGroupId === targetGroupId && // Same group
      (sourceTabIndex === targetTabIndex || // Same index
        targetTabIndex === sourceTabIndex+1 || // After removing source, target are in the same place
        (sourceTabIndex === GroupManager.groups[sourceGroupIndex].tabs.length-1 && // Still same last index
          targetTabIndex === -1))) { // Nothing to do
      return "TabManager.moveTabBetweenGroups done!";
    }

    // Case 5: Open Group -> Open Group (Even the same)
    if ((isSourceGroupOpen && isTargetGroupOpen)) {
      //TODO: Update tab index -TEST
      TabManager.moveOpenTabToGroup(tab, GroupManager.groups[targetGroupIndex].windowId, targetTabIndex);
    }
    // Case 2: Closed Group -> Closed Group
    // Case 3: Open Group -> Closed Groups
    // Case 4: Closed Group -> Open Group
    else {
      //TODO: Update tab index
      if ( sourceGroupId === targetGroupId  ) { // Update index because tabs will change
        if (targetTabIndex< sourceTabIndex) sourceTabIndex++;
      }
      await GroupManager.addTabInGroupId(targetGroupId, tab, targetTabIndex);
      await GroupManager.removeTabFromIndexInGroupId(sourceGroupId, sourceTabIndex);
    }
    return "TabManager.moveTabBetweenGroups done!";

  } catch (e) {
    let msg = "TabManager.moveTabBetweenGroups failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Move a tab from a non followed window to a group
 * @param {Number} tabId
 * @param {Number} targetGroupId
 */
TabManager.moveUnFollowedTabToGroup = async function(tabId, targetGroupId) {
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
        TabManager.moveOpenTabToGroup(tab, GroupManager.groups[targetGroupIndex].windowId, -1);
      } else { // To close group
        await GroupManager.addTabInGroupId(targetGroupId, tab);
        await browser.tabs.remove(tabId);
      }
    }
    return "TabManager.moveUnFollowedTabToGroup done!";

  } catch (e) {
    let msg = "TabManager.moveUnFollowedTabToGroup failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Move a tab to a new group
 * @param {Number} sourceGroupId
 * @param {Number} tabIndex
 * @return {Promise}
 */
TabManager.moveTabToNewGroup = async function(title = "", sourceGroupId, tabIndex) {
  try {
    var sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
      sourceGroupId);

    let tab = GroupManager.groups[sourceGroupIndex].tabs[tabIndex];
    GroupManager.addGroupWithTab(
      [tab],
      browser.windows.WINDOW_ID_NONE,
      title);

    await GroupManager.removeTabFromIndexInGroupId(sourceGroupId, tabIndex);

    return "TabManager.moveTabToNewGroup done!";
  } catch (e) {
    let msg = "TabManager.moveTabToNewGroup failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Move a tab from a non followed window to a new group
 * @param {Number} tabId
 */
TabManager.moveUnFollowedTabToNewGroup = async function(tabId) {
  try {
    const tab = await browser.tabs.get(tabId);

    GroupManager.addGroupWithTab([tab]);
    await browser.tabs.remove(tabId);

    return "TabManager.moveUnFollowedTabToNewGroup done!";
  } catch (e) {
    let msg = "TabManager.moveUnFollowedTabToNewGroup failed; " + e;
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
TabManager.removeTabsWithUnallowedURL = async function(groupId) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );
    let windowId = GroupManager.getWindowIdFromGroupId(
      groupId
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
 * @param {Number} groupId - the tabs groupId
 * @return {Promise}
 */
TabManager.selectTab = async function(tabIndex, groupId) {
  try {
    await WindowManager.selectGroup(groupId);
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
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
