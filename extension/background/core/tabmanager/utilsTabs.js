/**
 Tools:
 - countPinnedTabs
 - secureIndex
 - waitTabsToBeClosed
 */
var TabManager = TabManager || {};

// Return with all standard tab information
// Id are Index are set once in a group (see GroupManager.prepareGroups)
TabManager.getTabFactory = function(tab) {
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
 * Count the number of pinned tabs in tabs
 * @param {Array[Tab]} - tabs
 * @return {Number} - nbr of pinned tabs
 */
TabManager.countPinnedTabs = function(tabs) {
  return tabs.filter(tab => tab.pinned).length;
}

OptionManager.isClosingAlived = function() {
  //return OptionManager.options.groups.closingState === OptionManager.CLOSE_ALIVE;
  return false;
}

OptionManager.isClosingHidden = function() {
  return OptionManager.options.groups.closingState === OptionManager.CLOSE_HIDDEN;
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
 * Return true if tabs were closed in the waiting time.
 */
TabManager.waitTabsToBeClosed = async function(tabsIdsToRemove, {
  maxLoop=20,
  waitPerLoop=50 //ms
}={}){
  if (!Array.isArray(tabsIdsToRemove)) {
    tabsIdsToRemove = [tabsIdsToRemove]
  }

  for (let i = 0; i < maxLoop; i++) {
    await Utils.wait(waitPerLoop);

    const stillOpen = await Promise.all(
      tabsIdsToRemove.map(async (id) => {
        try {
          await browser.tabs.get(id);
          return true;
        } catch(e) {
          return false;
        }
    }));

    if ( stillOpen.filter(i => i).length === 0 ) {
      return true;
    }
  }
  return false;
}
