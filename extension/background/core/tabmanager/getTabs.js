 /*
 - getTabsInWindowId
 - updateTabsInGroup
 */
const TabManager = {};

/**
 * Return all the tabs in the window with windowId
 * Pinned tabs are inlcuded/excluded depending options.pinnedTab.sync
 * If the window doesn't exist return an empty array 
 * @param {Number} windowId
 * @return {Array[Tab]} tabs
 */
TabManager.getTabsInWindowId = async function(windowId, {
  withoutRealUrl = true,
  withPinned = OptionManager.options.pinnedTab.sync,
  hidden = (Utils.hasHideFunction() ? false : undefined)
}={}) {
  let selector = {
    windowId
  };


  if ( hidden !== undefined ) {
    selector["hidden"] = hidden;
  }

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

    let groupId = GroupManager.getGroupIdInWindow(windowId, {error: false});
    if(groupId === -1) return false;
    const tabs = await TabManager.getTabsInWindowId(windowId);

    // In case of delay
    if (WindowManager.WINDOW_CURRENTLY_CLOSING[windowId]) {
      return "Doesn't update the groups as the window is going to close."
    }

    GroupManager.setTabsInGroupId(groupId, tabs);
    return "TabManager.updateTabsInGroup done on window id " + windowId;

  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

export default TabManager