/*
 - openListOfTabs
 - openTab
 */
import Utils from '../../utils/utils'
import OptionManager from '../../core/optionmanager'
import LogManager from '../../error/logmanager'
import TAB_CONSTANTS from '../../core/TAB_CONSTANTS'

const TabManager = {};


/**
 * Open all the tabs in tabsToOpen
 * By default:
    1. Pinned Tabs are always open in last pinned postion
    2. Normal Tabs are always open in first Position
 * @param {Array<Tab>} tabsToOpen
 * @param {number} windowId
 * @param {Object} optional
 * @param {boolean} optional.inLastPos (optional) - if true the tabs are opened in last index
 * @param {boolean} optional.openAtLeastOne (optional) - if true and tabsToOpen is empty, open at least a new tab
 * @param {Tab} optional.pendingTab (optional) - A tab to close once the fist tab is open; At least one tab has to be open for closing it
 * @returns {Promise<Array<Tab>>} - created tab
 */
TabManager.openListOfTabs = async function(tabsToOpen, windowId, {
  inLastPos = false,
  openAtLeastOne = false,
  forceOpenNewTab = false, // Force to open a new tab even if already one
  pendingTab = undefined, // @deprecated
  remove_pinned = OptionManager.options.pinnedTab.sync,
  forceClosing = false,
}={}) {
  try {
    if (windowId == null) throw new Error("Impossible to compute openListOfTabs: windowId is null.")
    // Look if has Tab in tabs
    if (tabsToOpen.length === 0) {
      if (openAtLeastOne) {
        tabsToOpen.push({url: TAB_CONSTANTS.NEW_TAB,
          active: true,
          pinned: false});
      } else {
        // tabsToOpen was empty, no tab to open
        return [];
      }
    }

    const tabs = await TabManager.getTabsInWindowId(windowId, {
      withoutRealUrl: false,
      withPinned: true,
    });

    const isNewTab = (url) => url === TAB_CONSTANTS.NEW_TAB || url === "about:blank";

    // Don't Reopen only a new tab
    if (tabsToOpen.length === 1
      && isNewTab(tabsToOpen[0].url)
      && !forceOpenNewTab
    ) {
      // Else open new New Tab
      const notPinnedTabs = tabs.filter(tab => !tab.pinnded);
      if (notPinnedTabs.length === 1 && isNewTab(notPinnedTabs[0].url)) {
        // open only a new tab that was already open
        return tabs;
      }
    }

    let createdTabs = [];
    let tabIdsCrossRef = {};

    // Prepare index
    let indexTabOffset = 0,
      indexPinnedOffset = 0;

    indexPinnedOffset = remove_pinned
      ? 0
      : TabManager.countPinnedTabs(tabs);
    indexTabOffset = inLastPos
      ? tabs.length
      : indexPinnedOffset;

    let index = 0;

    // Extract active tab
    let activeIndex = tabsToOpen.reduce((accu, tab, index)=>{
      return tab.active ? index: accu;
    }, -1);

    // Prepare tabs to remove
    let tabsToRemove = tabs.filter(tab => remove_pinned || !tab.pinned);

    if (activeIndex >= 0) {
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
        if (tab.pinned) {
          await browser.tabs.move(tabIdsCrossRef[tab.id], {index: indexPinnedOffset});
        }
      }

      if (pendingTab) {
        /* TODO
        if ( OptionManager.options.groups.closingState === OPTION_CONSTANTS.CLOSE_ALIVE
          && GroupManager.getGroupIdFromTabId(pendingTab.id, false) >= 0) {
          await TabAlive.sleepTab(pendingTab);
        } else {
          await browser.tabs.remove(pendingTab.id);
        }
        */
        pendingTab = undefined;

        await TabManager.removeTabs(tabsToRemove.map(tab => tab.id), {forceClosing});
      }

      // Update current Index
      if (tab.pinned) {
        indexPinnedOffset++;
      }
      indexTabOffset++;
      index++;
    }

    // Update parentId for active tab
    if (activeIndex >= 0) {
      let tab = tabsToOpen[activeIndex];
      if (tab.hasOwnProperty("openerTabId")) {
        // Check tab is still present -> was not removed when group was closed
        // Parent tab has to be opened before children else it will be lost
        if (tabIdsCrossRef.hasOwnProperty(tab.openerTabId)) {
          // Set the new id of the parent Tab to the child
          browser.tabs.update(tabIdsCrossRef[tab.id], {
            openerTabId: tabIdsCrossRef[tab.openerTabId],
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
 * Open A Tab
 * @param {Tab} tab
 * @param {number} windowId
 * @param {number} index (tab)
  */
TabManager.openTab = async function(
  tab,
  windowId,
  index,
  tabIdsCrossRef=undefined
) {
/*   if (OptionManager.isClosingHidden()) {
    const wasShown = await TabHidden.showTab(tab.id, windowId, index);
    if (wasShown) {
      if (tab.active) await browser.tabs.update(tab.id, {active: true});
      return await browser.tabs.get(tab.id);
    }
  } */

  let url = tab.url;

  let incognitoAllowed = true;
  /*
   * TODO: Chrome seems to not be able to open extension pages in Incognito window
   * Is it the facts that the extension is not able to work in incognito ?
   */
  if (Utils.isChrome()) {
    incognitoAllowed = !(await browser.windows.get(windowId)).incognito;
  }

  if (Utils.isPrivilegedURL(url) && incognitoAllowed) {
    url = Utils.getPrivilegedURL(tab.title, url, tab.favIconUrl)
  }

  if (OptionManager.options.groups.discardedOpen && !tab.active
        && incognitoAllowed) {
    url = Utils.getDiscardedURL(tab.title, url, tab.favIconUrl)
  }

  if (url === "about:privatebrowsing" || url === TAB_CONSTANTS.NEW_TAB) {
    url = undefined;
  }

  // Create a tab to tab.url or to newtab
  let tabCreationProperties = {
    url: url,
    active: tab.active,
    pinned: tab.pinned,
    index: index,
    windowId: windowId,
  };


  if (tab.hasOwnProperty("openerTabId")
        && tabIdsCrossRef !== undefined) {
    // Check tab is still present -> was not removed when group was closed
    // Parent tab has to be opened before children else it will be lost
    if (tabIdsCrossRef.hasOwnProperty(tab.openerTabId)) {
      tabCreationProperties["openerTabId"] = tabIdsCrossRef[tab.openerTabId];
    }
  }

  return await browser.tabs.create(tabCreationProperties);
}

export default TabManager