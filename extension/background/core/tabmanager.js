/**
 * Functions that update the tabs in browser

 Tools:
 - getTabsInWindowId
 - countPinnedTabs
 - secureIndex
 - undiscardAll

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

 */
var TabManager = TabManager || {};

// Return with all standard tab information (factory)
// Id are Index are set once in a group (see GroupManager.prepareGroups)
TabManager.getTab = function(tab) {
  return Object.assign({
    title: "New Tab",
    url: TabManager.NEW_TAB,
    favIconUrl: "chrome://branding/content/icon32.png",
    hidden: false,
    lastAccessed: 0,
    pinned: false,
    windowId: WINDOW_ID_NONE,
    discarded: false
  }, tab);
}

/**
 * Return all the tabs in the window with windowId
 * Pinned tabs are inlcuded/excluded depending options.pinnedTab.sync
 * @param {Number} windowId
 * @return {Array[Tab]} tabs
 */
TabManager.getTabsInWindowId = async function(windowId, {
  withoutRealUrl = true,
  withPinned = OptionManager.options.pinnedTab.sync
}={}) {
  try {
    let selector = {
      windowId: windowId
    };
    // Pinned tab
    if ( !withPinned ) {
      selector["pinned"] = false;
    }
    let tabs = await browser.tabs.query(selector);

    // Remove fancy pages
    if (withoutRealUrl) {
      tabs.forEach((tab) => {
        tab.url = Utils.extractTabUrl(tab.url);
        if ( tab.hasOwnProperty('isArticle') && tab.isArticle === undefined ) {
          tab.isArticle = false;
        }
      });
    }

    // Remove sharingState field that could be undefined
    tabs.forEach((tab) => {
      if(tab["sharingState"]) delete tab["sharingState"]
    })

    return tabs;

  } catch (e) {
    LogManager.error(e, {arguments});
    throw Error();
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

    if (WindowManager.WINDOW_CURRENTLY_SWITCHING[windowId]) {
      return "Doesn't update the groups while it is changed by the extension."
    }

    if (WindowManager.WINDOW_CURRENTLY_CLOSING[windowId]) {
      return "Doesn't update the groups as the window is going to close."
    }

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
    if (!OptionManager.options.privateWindow.sync && window.incognito) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because private windows are not synchronized";
    }

    if (!GroupManager.isWindowAlreadyRegistered(window.id)) {
      return "TabManager.updateTabsInGroup not done for windowId " + windowId + " because window is not synchronized";
    }

    let groupId = GroupManager.getGroupIdInWindow(windowId);
    const tabs = await TabManager.getTabsInWindowId(windowId);

    // In case of delay
    if (WindowManager.WINDOW_CURRENTLY_CLOSING[windowId]) {
      return "Doesn't update the groups as the window is going to close."
    }

    GroupManager.setTabsInGroupId(groupId, tabs);
    return "TabManager.updateTabsInGroup done on window id " + windowId;

  } catch (e) {
    LogManager.error(e);
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
TabManager.openTab = async function(
  tab,
  windowId,
  index,
  tabIdsCrossRef=undefined
) {
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

  if (url === "about:privatebrowsing" || url === TabManager.NEW_TAB) {
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

  if (tab.hasOwnProperty("openerTabId") && tabIdsCrossRef !== undefined) {
    // Check tab is still present -> was not removed when group was closed
    // Parent tab has to be opened before children else it will be lost
    if (tabIdsCrossRef.hasOwnProperty(tab.openerTabId)) {
      tabCreationProperties["openerTabId"] = tabIdsCrossRef[tab.openerTabId];
    }
  }

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
TabManager.openListOfTabs = async function(tabsToOpen, windowId, {
  inLastPos = false,
  openAtLeastOne = false,
  forceOpenNewTab = false, // Force to open a new tab even if already one
  pendingTab = undefined,
}={}) {
  try {
    // Look if has Tab in tabs
    if (tabsToOpen.length === 0) {
      if (openAtLeastOne) {
        tabsToOpen.push({url: TabManager.NEW_TAB, active: true, pinned: false});
      } else {
        // tabsToOpen was empty, no tab to open
        return [];
      }
    }

    const tabs = await TabManager.getTabsInWindowId(windowId, {
      withoutRealUrl: false,
      withPinned: true,
    });

    // Don't Reopen only a new tab
    if (tabsToOpen.length === 1
      && (tabsToOpen[0].url === TabManager.NEW_TAB
      && !forceOpenNewTab ) // Else open new New Tab
      ) {
      let notPinnedTabs = tabs.filter(tab => !tab.pinnded);
      if (notPinnedTabs.length === 1 && notPinnedTabs[0].url === TabManager.NEW_TAB) {
        // open only a new tab that was already open
        return tabs;
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

    // Correct bias due to keeping tab
    if (pendingTab) {
      if ( pendingTab.pinned ) {
        indexPinnedOffset--;
        indexTabOffset--;
      }
    }

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
        createdTabs[index] = await TabManager.openTab(tab, windowId, currentIndex, tabIdsCrossRef);
        tabIdsCrossRef[tab.id] = createdTabs[index].id;
      } else {
        // Special case: move active pinned tab
        if (tab.pinned){
          await browser.tabs.move(tabIdsCrossRef[tab.id], {index:indexPinnedOffset});
        }
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

    // Update parentId for active tab
    if ( activeIndex >= 0 ) {
      let tab = tabsToOpen[activeIndex];
      if (tab.hasOwnProperty("openerTabId")) {
        // Check tab is still present -> was not removed when group was closed
        // Parent tab has to be opened before children else it will be lost
        if (tabIdsCrossRef.hasOwnProperty(tab.openerTabId)) {
          let tabParentId = tabIdsCrossRef[tab.openerTabId];
          // Set the new id of the parent Tab to the child
          browser.tabs.update(tabIdsCrossRef[tab.id], {
            openerTabId: tabIdsCrossRef[tab.openerTabId]
          });
        }
      }
    }

    return createdTabs;

  } catch (e) {
    LogManager.error(e);
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
    const tabs = await TabManager.getTabsInWindowId(windowId, {
      withoutRealUrl: false,
    });
    let tabId = tabs.filter((tab, index) => index === tabIndex).map((tab) => tab.id);

    if (tabId.length) {
      await browser.tabs.update(tabId[0], {active: true});
    }

    return "TabManager.activeTabInWindow done!";
  } catch (e) {
    LogManager.error(e, {
      args: {
        windowId,
        tabIndex
      }
    });
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
    LogManager.error(e, {arguments});
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
    LogManager.error(e, {arguments});
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
        if (targetTabIndex > -1 && targetTabIndex < sourceTabIndex) {
          sourceTabIndex++;
        }
      }
      await GroupManager.moveTabBetweenGroups(tab, sourceGroupId, sourceTabIndex, targetGroupId, targetTabIndex);
    }
    return "TabManager.moveTabBetweenGroups done!";

  } catch (e) {
    LogManager.error(e, {arguments});
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
      let tabIndex = GroupManager.getTabIndexFromTabId(tabId, sourceGroupIndex, {error: true});
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
    LogManager.error(e, {arguments});
  }
}

/**
 * Move a tab to a new group
 * @param {Number} sourceGroupId
 * @param {Number} tabIndex
 * @return {Number} id of the created group or -1
 */
TabManager.moveTabToNewGroup = async function(sourceGroupId, tabIndex, title = "") {
  try {
    var sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(sourceGroupId);

    let tab = GroupManager.groups[sourceGroupIndex].tabs[tabIndex];
    let id = GroupManager.addGroupWithTab([tab], {
      title
    });

    await GroupManager.removeTabFromIndexInGroupId(sourceGroupId, tabIndex);

    return id;
  } catch (e) {
    LogManager.error(e, {arguments});
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
    LogManager.error(e, {arguments});
    return -1;
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
    LogManager.error(e, {arguments});
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
TabManager.removeTabsInWindow = async function(windowId, {
  openBlankTab = false,
  remove_pinned = OptionManager.options.pinnedTab.sync,
}={}) {
  try {
    let tabs = await TabManager.getTabsInWindowId(windowId, {
      withoutRealUrl: false,
      withPinned: true,
    });

    let survivorTab = undefined;

    if (openBlankTab
          && !(!remove_pinned
                && tabs[0].pinned)
    ) {
      // Opened or single blank...
      survivorTab = (await TabManager.openListOfTabs([], windowId, {
        inLastPos: true,
        openAtLeastOne: true,
      }))[0];
      // Already just a new tab, don't close anything
      if( tabs.length === 1
            && survivorTab.id === tabs[0].id ) {
        return survivorTab;
      }
    } else { // Keep a tab from previous session
      if (!remove_pinned && tabs[0].pinned) {
        // Kill all
        await browser.tabs.update(tabs[0].id, {active: true});
      } else {
        survivorTab = tabs.shift();
      }
    }

    if ( survivorTab !== undefined ) {
      await browser.tabs.update(survivorTab.id, {active: true});
    }

    // 2. Remove previous tabs in window
    let tabsToRemove = tabs.filter(tab => remove_pinned || !tab.pinned).map(tab => tab.id);
    await browser.tabs.remove(tabsToRemove);

    if (Utils.isChrome()) { // Chrome Incompatibility: doesn't wait that tabs are unloaded
      await TabManager.waitTabsToBeClosed(windowId, tabsToRemove);
    }

    return survivorTab;
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

/**
 *
 */
TabManager.waitTabsToBeClosed = async function(windowId, tabsIdsToRemove, {
  maxLoop=20,
  waitPerLoop=50 //ms
}={}){
  for (let i = 0; i < maxLoop; i++) {
    await Utils.wait(waitPerLoop);
    let tabs = await TabManager.getTabsInWindowId(windowId, {
      withoutRealUrl: false,
    });
    if (tabs.filter((tab) => {
            if (tabsIdsToRemove.indexOf(tab.id) >= 0) {
              return true;
            }
            return false;
            }
      ).length === 0
    ) {
      break;
    }
  }
}

/**
 * WARNING: this funtion is not working well on firefox
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1420681
 * Any tab with a beforeunload event set will not be discardable...
 */
TabManager.undiscardAll = async function (globalCount = 0, callbackAfterFirstUndiscard=undefined) {
  return new Promise(async function(resolve, reject){
    let queue = Promise.resolve();

    let hadDiscarded = false;

    //console.log("Clean: " + globalCount);
    let tabs = await browser.tabs.query({});
    tabs.forEach(async (tab)=>{
      queue = queue.then(async function(){
        //console.log(tab.url)
        if( tab.url.includes(Utils.LAZY_PAGE_URL)) {
          hadDiscarded = true;

          try {
            // Change
            await browser.tabs.update(tab.id, {
              url: Utils.extractTabUrl(tab.url)
            });
            //console.log("Update tab: " + tab.id);
            if ( callbackAfterFirstUndiscard ) { // For tests purpose
              callbackAfterFirstUndiscard();
              callbackAfterFirstUndiscard = undefined;
            }
            await Utils.wait(300);
            // Wait full loading
            let count = 0;
            while( ((await browser.tabs.get(tab.id)).status === "loading")
                && count < 30 ) { // Wait max ~ 10s
              await Utils.wait(300);
              count++;
            }

            // Discard but Check active (due to loading waiting)
            if ( (await browser.tabs.get(tab.id)).status === "complete") {
              await browser.tabs.discard(tab.id);
            }

          } catch ( e ) { // Tab has changed (closed, moved, actived...)
            // Do nothing but avoid a crash
            //console.log("Error in TabManager.undiscardAll: " + e)
          }

        }
        return;
        })
    });

    queue.then(function(lastResponse){
      if ( hadDiscarded
        && globalCount < 10 ) {
        resolve(TabManager.undiscardAll(++globalCount));
      } else {
        //browser.runtime.reload();
        resolve();
        //console.log("Done!");
      }
    });
  });
}
