import LogManager from '../../error/logmanager'
import GroupManager from '../../core/groupmanager'
import WindowManager from '../../core/windowmanager'
import {getTabsInWindowId} from './getTabs'

/**
 * Go to the tab specified with tabId
 * The tab needs to be in an open window
 * @param {number} windowId
 * @param {number} tabIndex - the tab index
 * @returns {Promise}
 */
async function activeTabInWindow(windowId, tabIndex) {
  try {
    // Filter pinned if necessary
    const tabs = await getTabsInWindowId(windowId, {
      withoutRealUrl: false,
    });
    let tabId = tabs.filter((tab, index) => index === tabIndex).map((tab) => tab.id);

    if (tabId.length) {
      await browser.tabs.update(tabId[0], {active: true});
    }

    return "activeTabInWindow done!";
  } catch (e) {
    LogManager.error(e, {
      args: {
        windowId,
        tabIndex,
      },
    });
  }
}

/**
 * Selects a given tab.
 * Switch to another group if necessary
 * @param {number} tabIndex - the tabs index
 * @param {number} groupId - the tabs groupId
 * @returns {Promise}
 */
async function selectTab(tabIndex, groupId, newWindow=false) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);

    // 1. Change active tab
    if (GroupManager.isGroupIndexInOpenWindow(groupIndex)) {
      let windowId = GroupManager.groups[groupIndex].windowId;
      await activeTabInWindow(windowId, tabIndex);
    } else {
      GroupManager.groups[groupIndex].tabs.forEach((tab)=>{
        tab.active = false;
      });
      GroupManager.groups[groupIndex].tabs[tabIndex].active = true;
    }

    // 2. Open the group
    if (newWindow && !GroupManager.isGroupIndexInOpenWindow(groupIndex)) {
      await WindowManager.openGroupInNewWindow(groupId);
    } else {
      await WindowManager.selectGroup(groupId);
    }

    return "selectTab done!";
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

async function changePinState(groupId, tabIndex) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);

    let tab = GroupManager.groups[groupIndex].tabs[tabIndex];

    if (GroupManager.isGroupIndexInOpenWindow(groupIndex)) { // Open group
      await browser.tabs.update(tab.id, {
        pinned: !tab.pinned,
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
    return "changePinState done!";
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

export {
  activeTabInWindow,
  changePinState,
  selectTab,
}