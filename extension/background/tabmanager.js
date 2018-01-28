/**
 * Functions that update the tabs in browser

 Tools:
 - getTabsInWindowId
 - countPinnedTabs
 - secureIndex

 Getter:
 - updateTabsInGroup

 Setter:
 - openListOfTabs
 - removeTabsInWindow

 Update States
 - activeTabInWindow
 - changePinState
 - selectTab (Open/Close group)

 Moves:
 - moveOpenTabToGroup
 - moveTabBetweenGroups
 - moveUnFollowedTabToGroup
 - moveTabToNewGroup
 - moveUnFollowedTabToNewGroup

 - removeTabsWithUnallowedURL: deprecated
 */
var TabManager = TabManager || {};

/**
 * Return all the tabs in the window with windowId
 * Pinned tabs are inlcuded/excluded depending options.pinnedTab.sync
 * @param {Number} windowId
 * @return {Array[Tab]} tabs
 */
TabManager.getTabsInWindowId = async function(windowId, withoutRealUrl = true, withPinned = OptionManager.options.pinnedTab.sync) {
  try {
    let selector = {
      windowId: windowId
    };
    // Pinned tab
    if (!withPinned) {
      selector["pinned"] = false;
    }
    let tabs = await browser.tabs.query(selector);

    // Remove fancy pages
    if (withoutRealUrl) {
      tabs.forEach((tab) => {
        tab.url = Utils.extractTabUrl(tab.url);
      });
    }

    return tabs;

  } catch (e) {
    let msg = "TabManager.getTabsInWindowId failed on window " + windowId + " with " + e;
    console.error(msg);
    return msg;
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
    const allWindows = await browser.windows.getAll();

    if (WindowManager.WINDOW_CURRENTLY_SWITCHING[windowId]) {
      return "Doesn't update the groups while it is changed by the extension."
    }

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
    if (!OptionManager.options.privateWindow.sync && window.incognito) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because private windows are not synchronized";
    }

    if (!GroupManager.isWindowAlreadyRegistered(window.id)) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because window is not synchronized";
    }

    var groupId = GroupManager.getGroupIdInWindow(windowId);
    const tabs = await TabManager.getTabsInWindowId(windowId);

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
TabManager.countPinnedTabs = function(tabs) {
  return tabs.filter(tab => tab.pinned).length;
}

/**
 * Open A Tab
 * @param {Tab} tab
 * @param {Number} windowId
 * @param {Number} index (tab)
  */
TabManager.openTab = async function(tab, windowId, index) {
  let url = tab.url;

  let incognitoAllowed = true;
  if ( Utils.isChrome() ) {
    incognitoAllowed = !(await browser.windows.get(windowId)).incognito;
  }

  if (Utils.isPrivilegedURL(url) && incognitoAllowed) {
    url = Utils.getPrivilegedURL(tab.title, url, tab.favIconUrl)
  }

  if (OptionManager.options.groups.discardedOpen && !tab.active
        && incognitoAllowed ) {
    url = Utils.getDiscardedURL(tab.title, url, tab.favIconUrl)
  }

  if (url === "about:privatebrowsing" || url === "about:newtab") {
    url = undefined;
  }

  // Create a tab to tab.url or to newtab
  let tabCreationProperties = {
    url: url,
    active: tab.active,
    pinned: tab.pinned,
    index: index,
    windowId: windowId
  };

  return browser.tabs.create(tabCreationProperties);
}

/**
 * Open all the tabs in tabsToOpen
 * By default:
    1. Pinned Tabs are always open in last pinned postion
    2. Normal Tabs are always open in first Position
 * @param {array[Tab]} tabsToOpen
 * @param {Number} windowId
 * @param {Boolean} inLastPos (optional) - if true the tabs are opened in last index
 * @param {Boolean} openAtLeastOne (optional) - if true and tabsToOpen is empty, open at least a new tab
 * @param {Tab} pendingTab (optional) - A tab to close once the fist tab is open; At least one tab has to be open for closing it
 * @return {Proise{Array[Tab]} - created tab
 TODO: ParentId is not tested
 */
TabManager.openListOfTabs = async function(tabsToOpen, windowId, inLastPos = false, openAtLeastOne = false, pendingTab=undefined) {
  try {

    // Look if has Tab in tabs
    if (tabsToOpen.length === 0) {
      if (openAtLeastOne) {
        tabsToOpen.push({url: "about:newtab", active: true, pinned: false});
      } else {
        // tabsToOpen was empty, no tab to open
        return [];
      }
    }

    const tabs = await TabManager.getTabsInWindowId(windowId, false, true);

    // Don't Reopen only a new tab
    if (tabsToOpen.length === 1 && tabsToOpen[0].url === "about:newtab") {
      let notPinnedTabs = tabs.filter(tab => !tab.pinnded);
      if (notPinnedTabs.length === 1 && notPinnedTabs[0].url === "about:newtab") {
        // open only a new tab that was already open
        return [];
      }
    }

    let createdTabs = [];
    let tabIdsCrossRef = {};

    // Prepare index
    let indexTabOffset = 0,
      indexPinnedOffset = 0;

    indexPinnedOffset = TabManager.countPinnedTabs(tabs);
    indexTabOffset = (
      inLastPos
      ? tabs.length
      : indexPinnedOffset);

    let index = 0;

    // Extract active tab
    let activeIndex = tabsToOpen.reduce((accu, tab, index)=>{
      return tab.active ? index: accu;
    }, -1);

    if ( activeIndex >= 0 ) {
      let activeTab = tabsToOpen[activeIndex];
      // Open active tab first
      createdTabs[activeIndex] = await TabManager.openTab(activeTab, windowId, indexTabOffset);
      tabIdsCrossRef[activeTab.id] = createdTabs[activeIndex].id;
    }

    // Open the tabs
    for (let tab of tabsToOpen) {

      // Open the tab
      if (index !== activeIndex) {
        let currentIndex = (tab.pinned)
          ? indexPinnedOffset
          : indexTabOffset;
        // Save results
        createdTabs[index] = await TabManager.openTab(tab, windowId, currentIndex);
        tabIdsCrossRef[tab.id] = createdTabs[index].id;
      }

      if ( pendingTab ) {
        await browser.tabs.remove(pendingTab.id);
        pendingTab = undefined;
      }

      // Update current Index
      if (tab.pinned) {
        indexPinnedOffset++;
      }
      indexTabOffset++;
      index++;
    }

    // Update parentId
    for (let tab of tabsToOpen) {
      if (tab.hasOwnProperty("openerTabId")) {
        // Check tab is still present -> was not removed when group was closed
        // Parent tab has to be opened before children else it will be lost
        if (tabIdsCrossRef.hasOwnProperty(tab.openerTabId)) {
          let tabParentId = tabIdsCrossRef[tab.openerTabId];
          // Set the new id of the parent Tab to the child
          browser.tabs.update(tabIdsCrossRef[tab.id], {
            openerTabId: tabIdsCrossRef[tab.openerTabId]
          })
          tabCreationProperties["openerTabId"] = tabParentId;
        }
      }
    }

    return createdTabs;

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
    // Filter pinned if necessary
    const tabs = await TabManager.getTabsInWindowId(windowId, false);
    let tabId = tabs.filter((tab, index) => index === tabIndex).map((tab) => tab.id);

    if (tabId.length) {
      await browser.tabs.update(tabId[0], {active: true});
    }

    return "TabManager.activeTabInWindow done!";
  } catch (e) {
    let msg = "TabManager.activeTabInWindow: tab " + tabIndex + " in window " + windowId + " not found. " + e;
    console.error(msg);
    return msg;
  }
}

TabManager.changePinState = async function(groupId, tabIndex) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);

    let tab = GroupManager.groups[groupIndex].tabs[tabIndex];

    if (GroupManager.isGroupIndexInOpenWindow(groupIndex)) { // Open group
      await browser.tabs.update(tab.id, {
        pinned: !tab.pinned
      });
    } else { // Close group
      tab.pinned = !tab.pinned;

      await GroupManager.removeTabFromIndexInGroupId(groupId, tabIndex);
      // Last position for pinned or first for normal
      await GroupManager.addTabInGroupId(
        groupId, tab, tab.pinned
        ? -1
        : 0);
    }
    return "TabManager.changePinState done!";
  } catch (e) {
    let msg = "TabManager.changePinState failed; " + e;
    console.error(msg);
    return msg;
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
    realIndex = (realIndex > pinnedTabsCount || realIndex === -1)
      ? pinnedTabsCount
      : realIndex;
  } else { // Normal tabs are in targeted position and never before pinned tabs
    realIndex = (realIndex < pinnedTabsCount && realIndex > -1)
      ? pinnedTabsCount
      : realIndex;
  }
  realIndex = (realIndex === -1)
    ? tabs.length
    : realIndex;
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
  try {
    const tabs = await browser.tabs.query({windowId: windowId});
    if (!OptionManager.options.pinnedTab.sync && targetIndex > -1) { // Add offset of unvisible unsync pinned tab
      targetIndex += TabManager.countPinnedTabs(tabs);
    }
    let realIndex = TabManager.secureIndex(targetIndex, tab, tabs);

    if (tab.windowId === windowId && realIndex > tab.index) { // The move will first removed the tab before the next place it will appear
      realIndex--;
    }

    await browser.tabs.move(tab.id, {
      index: realIndex,
      windowId: windowId
    });
    return "TabManager.moveOpenTabToGroup done!";
  } catch (e) {
    let msg = "TabManager.moveOpenTabToGroup failed; " + e;
    console.error(msg);
    return msg;
  }
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
TabManager.moveTabBetweenGroups = async function(sourceGroupId, sourceTabIndex, targetGroupId, targetTabIndex = -1) {
  try {
    let targetGroupIndex = GroupManager.getGroupIndexFromGroupId(targetGroupId);
    let sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(sourceGroupId);

    let tab = GroupManager.groups[sourceGroupIndex].tabs[sourceTabIndex];

    let isSourceGroupOpen = GroupManager.isGroupIndexInOpenWindow(sourceGroupIndex);
    let isTargetGroupOpen = GroupManager.isGroupIndexInOpenWindow(targetGroupIndex);

    // Case 1: same group same index
    if (sourceGroupId === targetGroupId && // Same group
    (sourceTabIndex === targetTabIndex || // Same index
        targetTabIndex === sourceTabIndex + 1 || // After removing source, target are in the same place
        (sourceTabIndex === GroupManager.groups[sourceGroupIndex].tabs.length - 1 && // Still same last index
        targetTabIndex === -1))) {
      // Nothing to do
      return "TabManager.moveTabBetweenGroups done!";
    }

    // Case 5: Open Group -> Open Group (Even the same)
    if ((isSourceGroupOpen && isTargetGroupOpen)) {
      await TabManager.moveOpenTabToGroup(tab, GroupManager.groups[targetGroupIndex].windowId, targetTabIndex);
      // Case 2: Closed Group -> Closed Group
      // Case 3: Open Group -> Closed Groups
      // Case 4: Closed Group -> Open Group
    } else {
      if (sourceGroupId === targetGroupId) { // Update index because tabs will change
        if (targetTabIndex < sourceTabIndex)
          sourceTabIndex++;
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
      let sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(sourceGroupId);
      let tabIndex = GroupManager.getTabIndexFromTabId(tabId, sourceGroupIndex, true);
      await TabManager.moveTabBetweenGroups(sourceGroupId, tabIndex, targetGroupId);
    } else { // Unsync window
      let targetGroupIndex = GroupManager.getGroupIndexFromGroupId(targetGroupId);
      let isTargetGroupOpen = GroupManager.isGroupIndexInOpenWindow(targetGroupIndex);
      const tab = await browser.tabs.get(tabId);
      if (isTargetGroupOpen) { // To open group
        await TabManager.moveOpenTabToGroup(tab, GroupManager.groups[targetGroupIndex].windowId, -1);
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
 * @return {Number} id of the created group or -1
 */
TabManager.moveTabToNewGroup = async function(title = "", sourceGroupId, tabIndex) {
  try {
    var sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(sourceGroupId);

    let tab = GroupManager.groups[sourceGroupIndex].tabs[tabIndex];
    let id = GroupManager.addGroupWithTab([tab], browser.windows.WINDOW_ID_NONE, title);

    await GroupManager.removeTabFromIndexInGroupId(sourceGroupId, tabIndex);

    return id;
  } catch (e) {
    let msg = "TabManager.moveTabToNewGroup failed; " + e;
    console.error(msg);
    return -1;
  }
}

/**
 * Move a tab from a non followed window to a new group
 * @param {Number} tabId
 * @return {Number} id of the created group or -1
 */
TabManager.moveUnFollowedTabToNewGroup = async function(tabId) {
  try {
    const tab = await browser.tabs.get(tabId);

    let id = GroupManager.addGroupWithTab([tab]);
    await browser.tabs.remove(tabId);

    return id;
  } catch (e) {
    let msg = "TabManager.moveUnFollowedTabToNewGroup failed; " + e;
    console.error(msg);
    return -1;
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
    let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);
    let windowId = GroupManager.getWindowIdFromGroupId(groupId);

    // Get not supported link tab id
    var tabsIds = [];
    GroupManager.groups[groupIndex].tabs.map((tab) => {
      if (Utils.isPrivilegedURL(tab.url))
        tabsIds.push(tab.id);
      }
    );

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
TabManager.selectTab = async function(tabIndex, groupId, newWindow=false) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);

    // 1. Change active tab
    if ( GroupManager.isGroupIndexInOpenWindow(groupIndex) ) {
      let windowId = GroupManager.groups[groupIndex].windowId;
      await TabManager.activeTabInWindow(windowId, tabIndex);
    } else {
      GroupManager.groups[groupIndex].tabs.forEach((tab)=>{
        tab.active = false;
      });
      GroupManager.groups[groupIndex].tabs[tabIndex].active = true;
    }

    // 2. Open the group
    if ( newWindow && !GroupManager.isGroupIndexInOpenWindow(groupIndex) ) {
      await WindowManager.openGroupInNewWindow(groupId);
    } else {
      await WindowManager.selectGroup(groupId);
    }

    return "TabManager.selectTab done!";
  } catch (e) {
    let msg = "TabManager.selectTab failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Remove all the tabs in the windowId
 * Pinned are avoided except if there are synchronized or the option to force is set
 * @param {Number} groupId
 * @param {Boolean} if force to open a new tab for letting the window open
 * @param {Boolean} if force to close the Pinned Tabs, else take in account the option: pinnedTab.sync
 * @return {Promise} - The only tab saved (first one or blank), or nothing if pinned tabs are staying
 */
TabManager.removeTabsInWindow = async function(windowId, openBlankTab = false, remove_pinned = OptionManager.options.pinnedTab.sync) {
  try {
    let tabs = await TabManager.getTabsInWindowId(windowId, false, true);

    let survivorTab;

    // 1. Save a tab for letting the window open and return this tab
    if (!OptionManager.options.pinnedTab.sync && tabs[0].pinned) {
      // Kill all
    } else {
      if (openBlankTab) {
        survivorTab = (await TabManager.openListOfTabs([], windowId, true, true))[0];
      } else {
        survivorTab = tabs.shift();
      }
    }

    // 2. Remove previous tabs in window
    let tabsToRemove = tabs.filter(tab => remove_pinned || !tab.pinned).map(tab => tab.id);
    await browser.tabs.remove(tabsToRemove);

    if (Utils.isChrome()) { // Chrome Incompatibility: doesn't wait that tabs are unloaded
      let i = 0
      for (i = 0; i < 20; i++) {
        await Utils.wait(50);
        let tabs = await TabManager.getTabsInWindowId(windowId, false);
        if (tabs.filter((tab) => {
          if (tabsToRemove.indexOf(tab.id) >= 0) {
            return true;
          }
          return false;
        }).length === 0)
          break;
        }
      }

    return survivorTab;
  } catch (e) {
    let msg = "TabManager.removeTabsInWindow failed; " + e;
    console.error(msg);
    return msg;
  }
}
