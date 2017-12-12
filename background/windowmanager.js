/**
 * Functions that update the windows in browser
 * All are insynchronous functions
 * ALL functions HAVE TO return a new Promises that is resolved when everything is done
 * Have direct access (R/W) to the data
 */

var WindowManager = WindowManager || {};

WindowManager.WINDOW_GROUPID = "groupId";

WindowManager.WINDOW_CURRENTLY_SWITCHING = {

};

/**
 * Close all the current tabs and open the tabs from the selected group
 * in the window with windowId
 * The active tab will be the last one active in the opened group
 * @param {Number} newGroupId - the group id to open
 * @param {Number} windowId - the window id where to do it
 * @returns {Promise}
 */
WindowManager.openGroupInWindow = async function(newGroupId, windowId) {
  try {
    let newGroupIndex = GroupManager.getGroupIndexFromGroupId(
      newGroupId
    );

    const blank_tab = await WindowManager.removeTabsInWindow(windowId, false);

    await TabManager.openListOfTabs(
      GroupManager.groups[newGroupIndex].tabs, windowId, false, true);

    await browser.tabs.remove([blank_tab.id]);

    await GroupManager.attachWindowWithGroupId(newGroupId, windowId);

    return "WindowManager.openGroupInWindow done!";

  } catch (e) {
    let msg = "WindowManager.openGroupInWindow failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Close an open window and detach the group from it
 * @param {Number} groupId
 * @return {Promise}
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
      return "WindowManager.closeWindowFromGroupId done on groupId " + groupId;
    }

  } catch (e) {
    let msg = "TabManager.closeWindowFromGroupId failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Closes a group and all attached tabs.
 * Close Window false - Let a new tab and the pinned tabs if not synchronized
 * Close Window true - Move the pinned tabs if not synchronized before closing
 * @param {Number} groupId
 * @return {Promise}
 */
WindowManager.closeGroup = async function(groupId, close_window = false) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );
    let windowId = GroupManager.getWindowIdFromGroupId(
      groupId
    );
    const currentWindow = await browser.windows.getCurrent();
    close_window = close_window || currentWindow.id !== windowId;

    if (close_window) {
      // Move pinned from windowId to currentWindow.id
      if (!OptionManager.options.pinnedTab.sync) {
        const currentWindow = await browser.windows.getCurrent();
        let pinnedTabsIds = [];
        const tabs = await browser.tabs.query({
          windowId: windowId,
          pinned: true
        });
        tabs.forEach((tab) => {
          pinnedTabsIds.push(tab.id);
        });
        // Start at 0, don't take risk
        await browser.tabs.move(pinnedTabsIds, {
          windowId: currentWindow.id,
          index: 0
        });
      }
      await WindowManager.closeWindowFromGroupId(groupId);
    } else {
      await GroupManager.detachWindowFromGroupId(groupId);
      await WindowManager.removeTabsInWindow(windowId)
    }

    return "WindowManager.closeGroup done!";

  } catch (e) {
    let msg = "WindowManager.closeGroup failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Remove all the tabs in the windowId
 * Pinned are avoided except if there are synchronized or the option to force is set
 * @param {Number} groupId
 * @return {Promise} - the blank tab created
 */
WindowManager.removeTabsInWindow = async function(windowId, remove_pinned = false) {
  try {
    const tabs = await browser.tabs.query({
      windowId: windowId
    });

    // 1. Create blank tab: letting window open
    const blank_tab = await TabManager.openListOfTabs([], windowId, true, true);

    // 2. Remove previous tabs in window
    var tabsToRemove = [];
    tabs.map((tab) => {
      if ((OptionManager.options.pinnedTab.sync && tab.pinned) ||
        !tab.pinned ||
        remove_pinned) {
        tabsToRemove.push(tab.id);
      }
    });
    await browser.tabs.remove(tabsToRemove);

    return blank_tab[0];
  } catch (e) {
    let msg = "WindowManager.removeTabsInWindow failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Open newGroupId in current window, close the previous group if has
 * Secure: don't switch a window if it is already switching
 * @param {Number} newGroupId
 */
WindowManager.switchGroup = async function(newGroupId) {
  let currentWindow;
  try {
    currentWindow = await browser.windows.getCurrent();
    if (WindowManager.WINDOW_CURRENTLY_SWITCHING.hasOwnProperty(
        currentWindow.id
      )) {
      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/tabspace-active-64.png"),
        "title": "Can't change Group now",
        "message": "Reason: the current window has not finished to switch to a group.",
        "eventTime": 4000,
      });
      return "WindowManager.openGroupInWindow not done because the current window has not finished to switch to a group.";
    }
    WindowManager.WINDOW_CURRENTLY_SWITCHING[currentWindow.id] = true;

    if (GroupManager.isWindowAlreadyRegistered(currentWindow.id)) { // From sync window
      let currentGroupId = GroupManager.getGroupIdInWindow(
        currentWindow.id
      );
      await WindowManager.closeGroup(currentGroupId, false);
    }
    await WindowManager.openGroupInWindow(newGroupId, currentWindow.id);
    return "WindowManager.switchGroup done!";
  } catch (e) {
    let msg = "WindowManager.switchGroup failed: " + e;
    console.error(msg);
    return msg;
  } finally {
    if (WindowManager.WINDOW_CURRENTLY_SWITCHING.hasOwnProperty(
        currentWindow.id
      )) {
      const currentWindow = await browser.windows.getCurrent();
      delete WindowManager.WINDOW_CURRENTLY_SWITCHING[currentWindow.id];
    }
  }
}


/**
 * Selects a given group, with the tab active was the last one before closing.
 * If not open, switch to it
 * If open is another window, switch to that window
 * @param {Number} newGroupId - the group id
 * @return {Promise}
 */
WindowManager.selectGroup = async function(newGroupId) {
  try {
    let newGroupIndex = GroupManager.getGroupIndexFromGroupId(
      newGroupId
    );

    // Case 1: Another window
    if (GroupManager.isGroupIndexInOpenWindow(newGroupIndex)) {
      await browser.windows.update(
        GroupManager.groups[newGroupIndex].windowId, {
          focused: true
        });
    }
    // Case 2: switch group
    else {
      await WindowManager.switchGroup(newGroupId);
    }
    return "WindowManager.selectGroup done!";
  } catch (e) {
    let msg = "WindowManager.selectGroup failed: " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Open the next group in the list that is not opened.
 * If direction = 1 -> Next
 * If direction = -1 -> Previous
 * If no group available, create an empty one.
 * @param {Number} refGroupId -- group id ref
 * @param {Number} direction -- default:1
 * @return {Promise}
 */
WindowManager.selectNextGroup = async function(direction = 1, open = false, refGroupId = -1) {
  try {
    let nextGroupId = -1;
    let sourceGroupIndex;

    if (refGroupId === -1) { // Current window
      const currentWindow = await browser.windows.getCurrent();

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
    let roundIndex = sourceGroupIndex;
    let sortedIndex = GroupManager.getIndexSortByPosition(GroupManager.groups);
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

    // No group found, create one
    if (nextGroupId === -1) {
      let title = "Can't " + (open > 0 ? "focus" : "switch") + " to " + (direction > 0 ? "next" : "previous") + " Group";
      let msg = "Reason: there is no other " + (open > 0 ? "opened" : "closed") + " groups";
      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/tabspace-active-64.png"),
        "title": title,
        "message": msg,
        "eventTime": 4000,
      });
      return "WindowManager.selectNextGroup not done because " + msg;
    }

    await WindowManager.selectGroup(nextGroupId);

    return nextGroupId;
  } catch (e) {
    let msg = "WindowManager.selectNextGroup failed; " + e;
    console.error(msg);
    return -1;
  }
}

/**
 * Remove a group
 * If group is opened, close it (WindowManager.closeGroup)
 * If group id is -1, remove the group in the current window
 * @param {Number} groupId (deafault=-1)
 * @return {Promise}
 */
WindowManager.removeGroup = async function(groupId = -1) {
  try {
    if (groupId === -1) {
      const currentWindow = await browser.windows.getCurrent();

      if (!GroupManager.isWindowAlreadyRegistered(currentWindow.id)) { // From sync window
        browser.notifications.create({
          "type": "basic",
          "iconUrl": browser.extension.getURL("icons/tabspace-active-64.png"),
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
    GroupManager.removeGroupFromId(groupId);
    return "WindowManager.removeGroup done on groupId " + groupId;

  } catch (e) {
    let msg = "WindowManager.removeGroup failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Open a group in a new window directly
 * @param {Number} groupId
 * @return {Promise} with window_id
 */
WindowManager.openGroupInNewWindow = async function(groupId) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );

    const w = await browser.windows.create({
      state: "maximized",
    });

    await WindowManager.openGroupInWindow(groupId, w.id);
    return w.id;

  } catch (e) {
    let msg = "WindowManager.openGroupInNewWindow failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Change the prefix of the window with the group title
 * @param {Number} windowId
 * @param {Group} group
 */
WindowManager.setWindowPrefixGroupTitle = async function(windowId, group) {
  try {
    await browser.windows.update(
      windowId, {
        titlePreface: "[" +
          Utils.getGroupTitle(group) +
          "] "
      }
    );
  } catch (e) {
    let msg = "WindowManager.setWindowPrefixGroupTitle failed on New Window with window " + windowId + " and " + e;
    console.error(msg);
    return msg;
  }
};

/**
 * Use sessions tools to associate the groupId to window.
 * If window is restored, even if windowId change, the value is still associated with the window.
 * @param {Number} windowId
 * @param {Number} groupId
 * @return {Promise}
 */
WindowManager.associateGroupIdToWindow = async function(windowId, groupId) {
  if (OptionManager.options.groups.showGroupTitleInWindow) {
    let group = GroupManager.groups[
      GroupManager.getGroupIndexFromGroupId(
        groupId, false
      )
    ];
    WindowManager.setWindowPrefixGroupTitle(windowId, group);
  }
  GroupManager.setLastAccessed(groupId, Date.now());
  return browser.sessions.setWindowValue(
    windowId, // integer
    WindowManager.WINDOW_GROUPID, // string
    groupId.toString()
  );
}

/**
 * Remove groupId stored with the window
 * @param {Number} windowId
 * @return {Promise}
 */
WindowManager.desassociateGroupIdToWindow = async function(windowId) {
  if (OptionManager.options.groups.showGroupTitleInWindow) {
    browser.windows.update(
      windowId, {
        titlePreface: " "
      }
    );
  }
  return browser.sessions.removeWindowValue(
    windowId, // integer
    WindowManager.WINDOW_GROUPID, // string
  );
}

/**
 * Take the tabs from a current opened window and create a new group
 * @param {Number} windowId
 * @return {Promise}
 */
WindowManager.addGroupFromWindow = async function(windowId) {
  try {
    let selector = {
      windowId: windowId
    };
    if (!OptionManager.options.pinnedTab.sync) {
      selector["pinned"] = false;
    }
    const tabs = await browser.tabs.query(selector);

    var newGroupId = GroupManager.addGroupWithTab(tabs, windowId);
    await WindowManager.associateGroupIdToWindow(
      windowId,
      newGroupId
    );
    return "WindowManager.integrateWindow done on New Window with window " + windowId;

  } catch (e) {
    let msg = "WindowManager.integrateWindow failed on New Window with window " + windowId + " and " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Link an existing window to the groups
 * 1. If already linked, update the link
 * 2. If new window, add group
 * @param {Number} windowId
 * @return {Promise}
 */
WindowManager.integrateWindow = async function(windowId,
  even_new_one = OptionManager.options.groups.syncNewWindow) {
  try {
    const window = await browser.windows.get(windowId);

    if (window.type !== 'normal') {
      return "WindowManager.integrateWindow not done for windowId " + windowId + " because window is not normal";
    }

    // Private Window sync
    // TODO: only with no associated window, if user forced, should be set again
    if (!OptionManager.options.privateWindow.sync &&
      window.incognito) {
      return "WindowManager.integrateWindow not done for windowId " + windowId + " because private window are not synchronized";
    }

    const key = await browser.sessions.getWindowValue(
      windowId, // integer
      WindowManager.WINDOW_GROUPID // string
    );

    if (key === undefined || GroupManager.getGroupIndexFromGroupId(parseInt(key, 10), false) === -1) { // New Window
      if (even_new_one ||
        (OptionManager.options.privateWindow.sync &&
          window.incognito)) {
        await WindowManager.addGroupFromWindow(windowId);
      }
    } else { // Update Group
      await GroupManager.attachWindowWithGroupId(parseInt(key, 10), windowId);
    }
    return "WindowManager.integrateWindow done for windowId " + windowId;
  } catch (e) {
    let msg = "WindowManager.integrateWindow failed on Get Key Value for windowId " + windowId + "\n Error msg: " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Close all windows except one
 */
WindowManager.keepOneWindowOpen = async function() {
  try {
    const windows = await browser.windows.getAll();
    for (let i = 1; i < windows.length; i++) {
      await browser.windows.remove(windows[i].id);
    }
    return "WindowManager.keepOneWindowOpen done";
  } catch (e) {
    let msg = "WindowManager.keepOneWindowOpen failed " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Close all windows and open a new one with only a new tab
 */
WindowManager.OnlyOneNewWindow = async function(sync_window = true) {
  try {
    OptionManager.options.groups.syncNewWindow = sync_window;
    const windows = await browser.windows.getAll();

    const w = await browser.windows.create();

    if (sync_window) {
      await WindowManager.integrateWindow(w.id);
    }

    for (let i = 0; i < windows.length; i++) {
      await browser.windows.remove(windows[i].id);
    }

    return w.id;
  } catch (e) {
    let msg = "WindowManager.keepOneWindowOpen failed " + e;
    console.error(msg);
    return msg;
  }
}
