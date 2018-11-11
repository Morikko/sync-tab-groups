import TabManager from '../core/tabmanager/tabManager'
import OptionManager from '../core/optionmanager'
import TabHidden from '../core/tabhidden'
import Utils from '../utils/utils'

const TabsEvents = {};

TabsEvents.initTabsEventListener = function() {
  browser.tabs.onActivated.addListener(async(activeInfo) => {
    // Necessary for Chrome, this event is fired before the onRemovedWindow event
    // Else the group is finally updated with empty tabs.
    setTimeout(async function updateGroupWhenTabActivated() {
      TabManager.updateTabsInGroup(activeInfo.windowId);
    }, 300);
  });
  browser.tabs.onCreated.addListener(async(tab) => {
    await TabManager.updateTabsInGroup(tab.windowId);
  });
  browser.tabs.onRemoved.addListener(async(tabId, removeInfo) => {
    /* Bug: onRemoved is fired before the tab is really close
     * Workaround: keep a delay
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
     */
    setTimeout(async function updateGroupWhenTabRemoved() {
      if (!removeInfo.isWindowClosing) {
        await TabManager.updateTabsInGroup(removeInfo.windowId);
      }
    }, 300);
    if (Utils.hasHideFunction() && OptionManager.isClosingHidden()) {
      TabHidden.changeHiddenStateForTab(tabId);
    }
  });
  browser.tabs.onMoved.addListener(async(tabId, moveInfo) => {
    await TabManager.updateTabsInGroup(moveInfo.windowId);
  });
  browser.tabs.onUpdated.addListener(async(tabId, changeInfo, tab) => {
    await TabManager.updateTabsInGroup(tab.windowId);
  });
  browser.tabs.onAttached.addListener(async(tabId, attachInfo) => {
    await TabManager.updateTabsInGroup(attachInfo.newWindowId);
  });
  browser.tabs.onDetached.addListener(async(tabId, detachInfo) => {
    await TabManager.updateTabsInGroup(detachInfo.oldWindowId);
  });
}

export default TabsEvents