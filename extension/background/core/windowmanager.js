import Utils from '../utils/utils'
import LogManager from '../error/logmanager'
import GroupManager from '../core/groupmanager'
import TabManager from '../core/tabmanager/tabManager'
import OptionManager from '../core/optionmanager'
import getGroupIndexSortedByPosition from './getGroupIndexSortedByPosition'

const WindowManager = {};
window.WindowManager = WindowManager;

WindowManager.WINDOW_GROUPID = "groupId";

WindowManager.WINDOW_CURRENTLY_SWITCHING = {};
WindowManager.GROUP_CURRENTLY_SWITCHING = {};
WindowManager.WINDOW_CURRENTLY_CLOSING = {};
// Window ids not taken in account when a new window is created
WindowManager.WINDOW_EXCLUDED = {};

/**
 * Close all the current tabs and open the tabs from the selected group
 * in the window with windowId
 * The active tab will be the last one active in the opened group
 * Never use directly, prefer switchGroupInCurrentWindow
 * @param {number} newGroupId - the group id to open
 * @param {number} windowId - the window id where to do it
 * @returns {Promise}
 */
WindowManager.openGroupInWindow = async function(newGroupId, windowId, {
  forceClosing = false,
}={}) {
  try {
    let newGroupIndex = GroupManager.getGroupIndexFromGroupId(
      newGroupId
    );

    //let blank_tab = await TabManager.removeTabsInWindow(windowId);

    await TabManager.openListOfTabs(
      GroupManager.groups[newGroupIndex].tabs, windowId, {
        openAtLeastOne: true,
        pendingTab: true, // for compatibility
        forceClosing,
      });

    await GroupManager.attachWindowWithGroupId(newGroupId, windowId);

    return "WindowManager.openGroupInWindow done!";

  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

/**
 * Wrap the function for acting only if the targeted window is available
 * Release the Semaphore even in case of error
 * Return the value of func executed
 *
 */
WindowManager.decoratorCurrentlyChanging = function(func) {
  return async function() {
    let result, currentWindow, previousGroupId;
    try {
      currentWindow = await browser.windows.getLastFocused();
      if (WindowManager.WINDOW_CURRENTLY_SWITCHING.hasOwnProperty(
        currentWindow.id
      )) {
        browser.notifications.create({
          "type": "basic",
          "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
          "title": "Can't change Group now",
          "message": "Reason: the current window has not finished to switch to a group.",
          "eventTime": 4000,
        });
        return func.name + " not done because the current window has not finished to switch to a group.";
      }
      WindowManager.WINDOW_CURRENTLY_SWITCHING[currentWindow.id] = true;
      previousGroupId = GroupManager.getGroupIdInWindow(
        currentWindow.id, {
          error: false,
        });

      if (previousGroupId != null && previousGroupId>-1) {
        WindowManager.GROUP_CURRENTLY_SWITCHING[previousGroupId] = true;
      }

      // Do your job
      result = await func.apply(this, arguments);

    } catch (e) {
      LogManager.error(e, {args: arguments});
    } finally { // Clean
      const windowShouldBeClear = WindowManager.WINDOW_CURRENTLY_SWITCHING
        .hasOwnProperty(currentWindow.id);
      if (windowShouldBeClear) {
        delete WindowManager.WINDOW_CURRENTLY_SWITCHING[currentWindow.id];
      }

      if (previousGroupId != null && previousGroupId>-1) {
        const windowShouldBeClear = WindowManager.GROUP_CURRENTLY_SWITCHING
          .hasOwnProperty(previousGroupId);
        if (windowShouldBeClear) {
          delete WindowManager.GROUP_CURRENTLY_SWITCHING[previousGroupId];
        }
      }
    }
    return result;

  };
}


// Verify that the snap(s) are still present in the groups and with the right number of tabs
// Verufy also by title
function checkGroupMatchSnap(snapGroup, {
  groups=GroupManager.groups,
}={}) {
  let actualGroup;
  function reportFalse(msg) {
    LogManager.error(
      msg,
      {
        snapGroup,
        actualGroup,
      }
    )
  }

  if (snapGroup == null) return reportFalse("Snap doesn't exist.");
  actualGroup = GroupManager.getGroupFromGroupId(snapGroup.id, {
    groups,
    error: false,
  });
  if (actualGroup == null) return reportFalse("Group has disappeared.");

  if (actualGroup.title !== snapGroup.title) return reportFalse("Title has changed.");

  const emptyGroupSetWithNewTab = snapGroup.tabsLength === 0
    && actualGroup.tabs.length === 1;
  if (actualGroup.tabs.length !== snapGroup.tabsLength
    && !emptyGroupSetWithNewTab) {
    return reportFalse("Tabs length has changed.");
  }

  return true;
}

// Keep only the id / number of tabs / title
function makeSnapOfGroup(group) {
  return {
    title: group.title,
    id: group.id,
    tabsLength: group.tabs.length,
  }
}


/**
 * Open newGroupId in current window, close the previous group if has
 * Secure: don't switch a window if it is already switching
 * @param {number} newGroupId
 * @returns {Promise<number>} windowId
 */
WindowManager.switchGroupInCurrentWindow = async function(newGroupId) {
  let snapNewGroup;
  let snapOldGroup;
  try {
    const currentWindow = await browser.windows.getLastFocused();
    let forceClosing = true;
    snapNewGroup = makeSnapOfGroup(
      GroupManager.getGroupFromGroupId(newGroupId)
    );

    if (GroupManager.isWindowAlreadyRegistered(currentWindow.id)) {
      snapOldGroup = makeSnapOfGroup(
        GroupManager.getGroupFromGroupId(
          GroupManager.getGroupIdInWindow(currentWindow.id)
        )
      );
      await GroupManager.detachWindow(currentWindow.id, {fireEvent: false});
      forceClosing = false;
    }
    await WindowManager.openGroupInWindow(newGroupId, currentWindow.id, {forceClosing});

    checkGroupMatchSnap(snapNewGroup);
    if (snapOldGroup) checkGroupMatchSnap(snapOldGroup);

    return currentWindow.id;
  } catch (e) {
    LogManager.error(e, {
      args: arguments,
      snapNewGroup,
      snapOldGroup,
    });
  }
}
WindowManager.switchGroupInCurrentWindow = WindowManager.decoratorCurrentlyChanging(WindowManager.switchGroupInCurrentWindow);

/**
 * Close an open window and detach the group from it
 * @param {number} groupId
 * @returns {Promise}
 */
WindowManager.closeWindowFromGroupId = async function(groupId) {
  try {
    let windowId = GroupManager.getWindowIdFromGroupId(
      groupId
    );

    try {
      await browser.windows.remove(windowId);
    } finally {
      await GroupManager.detachWindow(windowId);
    }

  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

/**
 * Closes a group and all attached tabs.
 * Close Window false - Let a new tab and the pinned tabs if not synchronized
 * Close Window true - Move the pinned tabs if not synchronized before closing
 * @param {number} groupId
 * @returns {Promise}
 */
WindowManager.closeGroup = async function(groupId, {close_window = false}={}) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );
    if (!GroupManager.isGroupIndexInOpenWindow(groupIndex)) { // Security
      return;
    }
    let windowId = GroupManager.getWindowIdFromGroupId(
      groupId
    );
    const currentWindow = await browser.windows.getLastFocused();
    close_window = close_window || currentWindow.id !== windowId;

    if (close_window) {
      // Move pinned from windowId to currentWindow.id
      if (!OptionManager.options.pinnedTab.sync) {
        const tabs = await browser.tabs.query({
          windowId: windowId,
          pinned: true,
        });
        let pinnedTabsIds = tabs.map(tab => tab.id);
        if (pinnedTabsIds.length) {
          // Start at 0, don't take risk
          await browser.tabs.move(pinnedTabsIds, {
            windowId: currentWindow.id,
            index: 0,
          });
        }
      }
      await WindowManager.closeWindowFromGroupId(groupId);
    } else {
      await GroupManager.detachWindowFromGroupId(groupId);
      await TabManager.removeTabsInWindow(windowId, {
        openBlankTab: true,
      });
    }

    return "WindowManager.closeGroup done!";

  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}


/**
 * Selects a given group, with the tab active was the last one before closing.
 * If not open, switch to it
 * If open is another window, switch to that window
 * @param {number} newGroupId - the group id
 * @returns {Promise<number>} windowId
 */
WindowManager.selectGroup = async function(newGroupId, {newWindow=false}={}) {
  try {
    let newGroupIndex = GroupManager.getGroupIndexFromGroupId(
      newGroupId
    );

    let windowId;

    // Case 1: Another window
    if (GroupManager.isGroupIndexInOpenWindow(newGroupIndex)) {
      windowId = GroupManager.groups[newGroupIndex].windowId;
      await browser.windows.update(
        windowId, {
          focused: true,
        });
    // Case 2: switch group
    } else {
      if (newWindow) {
        windowId = await WindowManager.openGroupInNewWindow(newGroupId);
      } else {
        windowId = await WindowManager.switchGroupInCurrentWindow(newGroupId);
      }
    }
    return windowId;
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

/**
 * Open the next group in the list that is not opened.
 * If direction = 1 -> Next
 * If direction = -1 -> Previous
 * If no group available, show a notification
 * @param {Object} parameter
 * @param {number} parameter.refGroupId -- group id ref
 * @param {number} parameter.direction -- default:1
 * @returns {Promise}
 */
WindowManager.selectNextGroup = async function({
  direction = 1,
  open = false,
  refGroupId = -1,
}={}) {
  try {
    let nextGroupId = -1;
    let sourceGroupIndex;

    if (refGroupId === -1) { // Current window
      const currentWindow = await browser.windows.getLastFocused();

      if (GroupManager.isWindowAlreadyRegistered(currentWindow.id)) {
        refGroupId = GroupManager.getGroupIdInWindow(currentWindow.id);
        sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
          refGroupId
        );
      } else { // Unsync window
        sourceGroupIndex = direction > 0 ? -1 : 0;
      }
    } else {
      sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
        refGroupId
      );
    }

    // Search next unopened group
    let sortedIndex = getGroupIndexSortedByPosition(GroupManager.groups);
    let roundIndex = sortedIndex.indexOf(sourceGroupIndex);
    for (let i = 0; i < sortedIndex.length - 1; i++) {
      roundIndex = (roundIndex + sortedIndex.length + direction) % sortedIndex.length;

      let targetGroupIndex = sortedIndex[roundIndex];

      if (GroupManager.groups[targetGroupIndex].windowId === browser.windows.WINDOW_ID_NONE &&
        !open) {
        nextGroupId = GroupManager.groups[targetGroupIndex].id;
        break;
      }
      if (GroupManager.groups[targetGroupIndex].windowId !== browser.windows.WINDOW_ID_NONE &&
        open) {
        nextGroupId = GroupManager.groups[targetGroupIndex].id;
        break;
      }
    }

    // No group found
    if (nextGroupId === -1) {
      let title = "Can't " + (open > 0 ? "focus" : "switch") + " to " + (direction > 0 ? "next" : "previous") + " Group";
      let msg = "Reason: there is no other " + (open > 0 ? "opened" : "closed") + " groups";
      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
        "title": title,
        "message": msg,
        "eventTime": 4000,
      });
      return "WindowManager.selectNextGroup not done because " + msg;
    }

    await WindowManager.selectGroup(nextGroupId);

    return nextGroupId;
  } catch (e) {
    LogManager.error(e, {args: arguments});
    return -1;
  }
}

/**
 * Remove a group
 * If group is opened, close it (WindowManager.closeGroup)
 * If group id is -1, remove the group in the current window
 * @param {number} groupId (deafault=-1)
 * @returns {Promise}
 */
WindowManager.removeGroup = async function(groupId = -1) {
  try {
    if (groupId === -1) {
      const currentWindow = await browser.windows.getLastFocused();

      if (!GroupManager.isWindowAlreadyRegistered(currentWindow.id)) { // From sync window
        browser.notifications.create({
          "type": "basic",
          "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
          "title": "No group removed.",
          "message": "Reason: there is no group in your current window",
          "eventTime": 4000,
        });
        return "WindowManager.removeGroup done because there is no group in current window.";
      }
      groupId = GroupManager.getGroupIdInWindow(
        currentWindow.id
      );
    }

    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );

    // Is open
    if (GroupManager.isGroupIndexInOpenWindow(groupIndex)) {
      await WindowManager.closeGroup(groupId);
    }
    await GroupManager.removeGroupFromId(groupId);
    return "WindowManager.removeGroup done on groupId " + groupId;

  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

/**
 * Open a group in a new window directly
 * @param {number} groupId
 * @returns {Promise} with window_id
 */
WindowManager.openGroupInNewWindow = async function(groupId) {
  let w;
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );
    w = await browser.windows.create({
      state: "maximized",
      incognito: GroupManager.groups[groupIndex].incognito,
    });
    WindowManager.WINDOW_EXCLUDED[w.id] = true;

    // TODO: security: might not be necessary

    let count = 0;
    while (!(await browser.windows.get(w.id)).focused) {
      if (count > 50) {
        throw Error("WindowManager.openGroupInNewWindow was unable to focus the window.");
      }
      count++;
      await Utils.wait(100);
    }

    await WindowManager.switchGroupInCurrentWindow(groupId);
    delete WindowManager.WINDOW_EXCLUDED[w.id];
    return w.id;

  } catch (e) {
    LogManager.error(e, {args: arguments});
    delete WindowManager.WINDOW_EXCLUDED[w.id];
  } finally {
    //delete WindowManager.WINDOW_EXCLUDED[w.id];
  }
}

/**
 * Change the prefix of the window with the group title
 * @param {number} windowId
 * @param {Group} group
 */
WindowManager.setWindowPrefixGroupTitle = async function(windowId, group) {
  if (!Utils.hasWindowTitlePreface()) {
    return;
  }
  try {
    if (windowId === browser.windows.WINDOW_ID_NONE) {
      return;
    }
    await browser.windows.update(
      windowId, {
        titlePreface: "[" +
          Utils.getGroupTitle(group) +
          "] ",
      }
    );
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
};

/**
 * Use sessions tools to associate the groupId to window.
 * If window is restored, even if windowId change, the value is still associated with the window.
 * @param {number} windowId
 * @param {number} groupId
 * @returns {Promise}
 */
WindowManager.associateGroupIdToWindow = async function(windowId, groupId) {
  try {
    GroupManager.setLastAccessed(groupId, Date.now());
    if (Utils.hasWindowTitlePreface()) {
      if (OptionManager.options.groups.showGroupTitleInWindow) {
        let group = GroupManager.groups[
          GroupManager.getGroupIndexFromGroupId(
            groupId, {error: false}
          )
        ];
        WindowManager.setWindowPrefixGroupTitle(windowId, group);
      }
    }
    if (Utils.hasSessionWindowValue()) {
      await browser.sessions.setWindowValue(
        windowId, // integer
        WindowManager.WINDOW_GROUPID, // string
        groupId.toString()
      );
    }
    return "WindowManager.associateGroupIdToWindow done";
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

WindowManager.isWindowIdOpen = async function(windowId) {
  try {
    const windows = await browser.windows.getAll();
    return windows.filter(w => w.id === windowId).length>0;

  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

/**
 * Remove groupId stored with the window
 * @param {number} windowId
 * @returns {Promise}
 */
WindowManager.desassociateGroupIdToWindow = async function(windowId) {
  try {
    if (!(await WindowManager.isWindowIdOpen(windowId))) {
      return;
    }
    if (Utils.hasWindowTitlePreface()) {
      if (OptionManager.options.groups.showGroupTitleInWindow) {
        browser.windows.update(
          windowId, {
            titlePreface: " ",
          }
        );
      }
    }
    if (Utils.hasSessionWindowValue()) {
      await browser.sessions.removeWindowValue(
        windowId, // integer
        WindowManager.WINDOW_GROUPID, // string
      );
    }
    return "WindowManager.desassociateGroupIdToWindow done";
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

/**
 * Take the tabs from a current opened window and create a new group
 * @param {number} windowId
 * @returns {number} groupId created
 */
WindowManager.addGroupFromWindow = async function(windowId) {
  const tabs = await TabManager.getTabsInWindowId(windowId);
  const w = await browser.windows.get(windowId);

  let newGroupId = GroupManager.addGroupWithTab(tabs, {
    windowId,
    incognito: w.incognito,
  });
  await WindowManager.associateGroupIdToWindow(
    windowId,
    newGroupId
  );
  return newGroupId;
}

/**
  * @returns {number} groupId matched or -1
  */
WindowManager.integrateWindowWithTabsComparaison = async function(windowId, {
  even_new_one = OptionManager.options.groups.syncNewWindow,
}={}) {
  // Get tabs
  const tabs = await TabManager.getTabsInWindowId(windowId);

  // Compare to all groups
  let bestId = GroupManager.bestMatchGroup(tabs);

  let id = -1;
  if (bestId > 0) { // Keep the best result
    await GroupManager.attachWindowWithGroupId(bestId, windowId);
    id = bestId;
  }
  return id;
}

/**
  * @returns {number} groupId matched or -1
  */
WindowManager.integrateWindowWithSession = async function(windowId, {
  even_new_one = OptionManager.options.groups.syncNewWindow,
}={}) {
  const key = await browser.sessions.getWindowValue(
    windowId, // integer
    WindowManager.WINDOW_GROUPID // string
  );

  let id = -1;
  if (key !== undefined && GroupManager.getGroupIndexFromGroupId(parseInt(key, 10), {error: false}) !== -1) { // Update Group
    await GroupManager.attachWindowWithGroupId(parseInt(key, 10), windowId);
    id = parseInt(key, 10);
  }
  return id;
}
/**
 * Link an existing window to the groups
 * 1. If already linked, update the link
 * 2. If new window, add group
 * @param {number} windowId
 * @param {boolean} even_new_one - Normally user preference, if true window will be created for sure, if false won't
 * @returns {number} groupId created or -1
 */
WindowManager.integrateWindow = async function(windowId, {
  even_new_one = OptionManager.options.groups.syncNewWindow,
}={}) {
  try {
    const window = await browser.windows.get(windowId);

    if (window.type !== 'normal') {
      //WindowManager.integrateWindow not done for windowId " + windowId + " because window is not normal
      return -1;
    }

    // Private Window sync
    if (!OptionManager.options.privateWindow.sync &&
      window.incognito && !even_new_one) {
      // WindowManager.integrateWindow not done for windowId " + windowId + " because private window are not synchronized
      return -1;
    }

    let id;
    if (Utils.hasSessionWindowValue()) {
      id = await WindowManager.integrateWindowWithSession(
        windowId,
        {even_new_one}
      )
    } else { // Others
      id = await WindowManager.integrateWindowWithTabsComparaison(
        windowId,
        {even_new_one}
      )
    }

    if (id === -1) { // No match
      if (even_new_one ||
        (OptionManager.options.privateWindow.sync &&
          window.incognito)) {
        id = await WindowManager.addGroupFromWindow(windowId);
      }
    }

    return id;
  } catch (e) {
    if (WindowManager.isErrorWindowNotExists(e, windowId)) {
      return -1;
    } else {
      throw e;
    }
  }
}

WindowManager.isErrorWindowNotExists = function(err, windowId) {
  if (err.message.includes("No window with id") // Chrome
      || err.message.includes("Invalid window ID") // Firefox
  ) {
    LogManager.warning("The window to integrate doesn't exist any more.",
      {windowId}
    );
    return true;
  } else {
    return false;
  }
}

export default WindowManager