 /*
 - removeTabsInWindow
 - removeTabs
 */
const TabManager = {};

/**
 * Remove tabs
 * If can hide: hide
 * Else: close
 */
TabManager.removeTabs = async function(tabIdsToRemove, {
  forceClosing=false,
}={}) {
  try {
    let ids = Utils.getCopy(tabIdsToRemove);

    if ( OptionManager.isClosingAlived() && !forceClosing) {
      await Promise.all(
        tabIdsToRemove.map((tab)=>TabAlive.sleepTab(tab))
      );
    }

    if ( OptionManager.isClosingHidden() && !forceClosing) {
      const results = await Promise.all(
        ids.map(id => TabHidden.hideTab(id))
      );
      ids.filter((id, index) => results[index]).forEach((id) => GroupManager.setTabIsHidden(id, true));
      ids = ids.filter((id, index) => !results[index]);

      if ( ids.length === 0 ) {
        return;
      }
    }

    await browser.tabs.remove(ids);
    await TabManager.waitTabsToBeClosed(ids);
  } catch (e) {
    console.error("TabManager.removeTabs failed.");
    console.error(e);
  }
}

/**
 * Remove all the tabs in the windowId
 * Pinned are avoided except if there are synchronized or the option to force is set
 * @param {Number} groupId
 * @param {Boolean} if force to open a new tab for letting the window open
 * @param {Boolean} if force to close the Pinned Tabs, else take in account the option: pinnedTab.sync
 * @return {Promise} - The only tab saved (first one or blank), or nothing if pinned tabs are staying
 * @deprecated
 */
TabManager.removeTabsInWindow = async function(windowId, {
  openBlankTab = false,
  remove_pinned = OptionManager.options.pinnedTab.sync,
  forceClosing=false
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
    let tabsToRemove = tabs.filter(tab => remove_pinned || !tab.pinned);

    if ( OptionManager.options.groups.closingState === OptionManager.CLOSE_ALIVE
     && !forceClosing) {
      await Promise.all(
        tabsToRemove.map((tab)=>TabAlive.sleepTab(tab))
      );
    } else {
      tabsToRemove = tabsToRemove.map(tab => tab.id)
      await browser.tabs.remove(tabsToRemove);
      await TabManager.waitTabsToBeClosed(tabsToRemove);
    }

    return survivorTab;
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

export default TabManager