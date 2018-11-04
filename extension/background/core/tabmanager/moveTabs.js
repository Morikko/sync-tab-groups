/*
 - moveOpenTabToGroup
 - moveTabBetweenGroups
 - moveUnFollowedTabToGroup
 - moveTabToNewGroup
 - moveUnFollowedTabToNewGroup
 */
import OptionManager from '../../core/optionmanager'
import LogManager from '../../error/logmanager'
import GroupManager from '../../core/groupmanager'
const TabManager = {};

/**
 * Move a tab opened between two open windows
 * The tab is put at the last position for pinned and normal tabs
 * in the targeted window.
 * @param {Tab} tab
 * @param {number} windowId
 * @param {number} targetIndex
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
      windowId: windowId,
    });
    return "TabManager.moveOpenTabToGroup done!";
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

/**
 * Move tab beetwen groups already created (closed or opened)
 * If targetTabIndex is -1, put the tab at the end
 * @param {number} sourceGroupId
 * @param {number} sourceTabIndex
 * @param {number} targetGroupId
 * @param {number} targetTabIndex (default=-1)
 * @returns {Promise}
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
 * @param {number} tabId
 * @param {number} targetGroupId
 */
TabManager.moveUnFollowedTabToGroup = async function(tabId, targetGroupId) {
  try {
    let sourceGroupId = GroupManager.getGroupIdFromTabId(tabId, false);
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
 * @param {number} sourceGroupId
 * @param {number} tabIndex
 * @returns {number} id of the created group or -1
 */
TabManager.moveTabToNewGroup = async function(sourceGroupId, tabIndex, title = "") {
  try {
    let sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(sourceGroupId);

    let tab = GroupManager.groups[sourceGroupIndex].tabs[tabIndex];
    let id = GroupManager.addGroupWithTab([tab], {
      title,
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
 * @param {number} tabId
 * @returns {number} id of the created group or -1
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

export default TabManager