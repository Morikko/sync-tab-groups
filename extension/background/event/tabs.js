var Event = Event || {};
Event.Tabs = Event.Tabs || {};


Event.Tabs.initTabsEventListener = function() {
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    // Necessary for Chrome, this event is fired before the onRemovedWindow event
    // Else the group is finally updated with empty tabs.
    setTimeout(async function updateGroupWhenTabActivated () {
      TabManager.updateTabsInGroup(activeInfo.windowId);
    }, 300);
  });
  browser.tabs.onCreated.addListener((tab) => {
    TabManager.updateTabsInGroup(tab.windowId);
  });
  browser.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    /* Bug: onRemoved is fired before the tab is really close
     * Workaround: keep a delay
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
     */
    setTimeout(async function updateGroupWhenTabRemoved() {
      if ( !removeInfo.isWindowClosing ) {
        TabManager.updateTabsInGroup(removeInfo.windowId);
      }
    }, 300);
    if( Utils.hasHideFunction() && OptionManager.isClosingHidden() ) {
      TabHidden.changeHiddenStateForTab(tabId);
    }
  });
  browser.tabs.onMoved.addListener((tabId, moveInfo) => {
    TabManager.updateTabsInGroup(moveInfo.windowId);
  });
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    TabManager.updateTabsInGroup(tab.windowId);
  });
  browser.tabs.onAttached.addListener((tabId, attachInfo) => {
    TabManager.updateTabsInGroup(attachInfo.newWindowId);
  });
  browser.tabs.onDetached.addListener((tabId, detachInfo) => {
    TabManager.updateTabsInGroup(detachInfo.oldWindowId);
  });
}
