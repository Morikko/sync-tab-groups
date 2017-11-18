/**
 * Functions that update the windows in browser
 * All are insynchronous functions
 * ALL functions HAVE TO return a new Promises that is resolved when everything is done
 * Have direct access (R/W) to the data
 */

var WindowManager = WindowManager || {};

WindowManager.WINDOW_GROUPID = "GROUPID";

/**
 * Close all the current tabs and open the tabs from the selected group
 * in the window with windowId
 * The active tab will be the last one active
 * @param {Number} oldGroupId - the group id opened
 * @param {Number} newGroupId - the group id to open
 * @returns {Promise} - the remove tabs promise (last)
 * Asynchronous
 */
WindowManager.changeGroupInWindow = function(oldGroupId, newGroupId) {
  return new Promise((resolve, reject) => {
    var newGroupIndex, oldGroupIndex, windowId;
    try {
      newGroupIndex = GroupManager.getGroupIndexFromGroupId(
        newGroupId
      );
      oldGroupIndex = GroupManager.getGroupIndexFromGroupId(
        oldGroupId
      );
      windowId = GroupManager.getWindowIdFromGroupId(
        oldGroupId
      );
    } catch (e) {
      let msg = "WindowManager.changeGroupInWindow failed; " + e.message;
      console.error(msg);
      reject(msg);
    }

    TabManager.removeTabsWithUnallowedURL(oldGroupId).then(() => {
      browser.tabs.query({
        windowId: windowId
      }).then((tabs) => {
        // 1. Prepare tabs to open and remove
        var tabsToRemove = [];
        tabs.map((tab) => {
          tabsToRemove.push(tab.id);
        });

        var tabsToOpen = GroupManager.groups[newGroupIndex].tabs;
        // Switch window associated
        GroupManager.groups[oldGroupIndex].windowId = browser.windows.WINDOW_ID_NONE;
        GroupManager.groups[newGroupIndex].windowId = windowId;

        // 2. Open new group tabs
        TabManager.openListOfTabs(tabsToOpen, windowId, false, true).then(() => {

          // 3. Remove old ones (Wait first tab to be loaded in order to avoid the window to close)
          browser.tabs.remove(tabsToRemove).then(() => {
            var lastPromise = WindowManager.associateGroupIdToWindow(windowId, newGroupId);
            resolve(lastPromise);
          });
        });
      });
    });
  });
}


/**
 * Selects a given group, with the tab active was the last one before closing.
 * If not open, switch to it
 * If open is another window, switch to that window
 * Asynchronous
 * @param {Number} newGroupId - the group id
 * @return {Promise} - last asynchronous promise called
 */
WindowManager.selectGroup = function(newGroupId) {
  return new Promise((resolve, reject) => {
    let newGroupIndex;
    try {
      newGroupIndex = GroupManager.getGroupIndexFromGroupId(
        newGroupId
      );
    } catch (e) {
      let msg = "WindowManager.selectGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }
    // Case 1: Another window
    if (GroupManager.isGroupIndexInOpenWindow(newGroupIndex)) {
      var lastPromise = browser.windows.update(
        GroupManager.groups[newGroupIndex].windowId, {
          focused: true
        }
      );
      resolve(lastPromise);
    }
    // Case 2: switch group
    else {
      // So that the user can change the window without disturbing
      browser.windows.getCurrent().then((currentWindow) => {
        let currentGroupId;
        try {
          currentGroupId = GroupManager.getGroupIdInWindow(
            currentWindow.id
          );
        } catch (e) {
          let msg = "WindowManager.selectGroup failed; " + e.message;
          console.error(msg);
          reject(msg);
        }
        WindowManager.changeGroupInWindow(currentGroupId, newGroupId).then(() => {
          resolve("End of WindowManager.selectGroup");
        });
      });
    }
  });

}

/**
 * Open the next group in the list that is not opened.
 * If no group available, create an empty one.
 * @param {Number} sourceGroupId -- group id ref
 * @return {Promise}
 */
WindowManager.selectNextGroup = function(sourceGroupId) {
  return new Promise((resolve, reject) => {
    let nextGroupId = -1;
    let sourceGroupIndex;
    try {
      sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
        sourceGroupId
      );
    } catch (e) {
      let msg = "WindowManager.selectNextGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }

    // Search next unopened group
    for (let i = sourceGroupIndex; i < sourceGroupIndex + GroupManager.groups.length; i++) {
      let targetGroupIndex = (i) % GroupManager.groups.length;

      if (GroupManager.groups[targetGroupIndex].windowId === browser.windows.WINDOW_ID_NONE) {
        nextGroupId = GroupManager.groups[targetGroupIndex].id;
        break;
      }
    }

    // No group found, create one
    if (nextGroupId === -1) {
      try {
        nextGroupId = GroupManager.addGroup();
      } catch (e) {
        console.error("WindowManager.selectNextGroup failed; " + e);
        reject("WindowManager.selectNextGroup failed; " + e.message);
      }
    }

    var lastPromise = WindowManager.changeGroupInWindow(sourceGroupId, nextGroupId);

    resolve(lastPromise);
  });
}

/**
 * Close an open window and detach the group from it
 * @param {Number} groupID
 * @return {Promise}
 */
WindowManager.closeWindowFromGroupId = function(groupID) {
  return new Promise((resolve, reject) => {
    let windowId;
    try {
      windowId = GroupManager.getWindowIdFromGroupId(
        groupID
      );
    } catch (e) {
      let msg = "TabManager.closeWindowFromGroupId failed; " + e.message;
      console.error(msg);
      reject(msg);
    }
    var detachFunc = function() {
      GroupManager.detachWindow(windowId);
      resolve("WindowManager.closeWindowFromGroupId done on groupId " + groupID);
    }

    // Clean windowId in success or fail
    browser.windows.remove(windowId).then(detachFunc, detachFunc);
  });
}


/**
 * Closes a group and all attached tabs.
 * If group is in current window, open the next available group (WindowManager.selectNextGroup).
 * If group is in another window, close the window.
 * @param {Number} groupID
 * @return {Promise}
 */
WindowManager.closeGroup = function(groupID) {
  return new Promise((resolve, reject) => {
    let groupIndex, windowId;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        groupID
      );
      windowId = GroupManager.getWindowIdFromGroupId(
        groupID
      );
    } catch (e) {
      let msg = "WindowManager.closeGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }

    browser.windows.getCurrent().then((currentWindow) => {
      if (currentWindow.id === windowId)
        resolve(WindowManager.selectNextGroup(groupID));
      else
        resolve(WindowManager.closeWindowFromGroupId(groupID));
    });
  });
}

/**
 * Remove a group
 * If group is opened, close it (WindowManager.closeGroup)
 * @param {Number} groupID
 * @return {Promise}
 */
WindowManager.removeGroup = function(groupID) {
  return new Promise((resolve, reject) => {
    let groupIndex;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        groupID
      );
    } catch (e) {
      let msg = "WindowManager.removeGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }
    // Is open
    if ( GroupManager.isGroupIndexInOpenWindow(groupIndex) ) {
      WindowManager.closeGroup( groupID ).then(()=>{
        GroupManager.removeGroupFromId(groupID);
        resolve("WindowManager.removeGroup done on groupId " + groupID);
      });
    // Is close
    } else {
      GroupManager.removeGroupFromId(groupID);
      resolve("WindowManager.removeGroup done on groupId " + groupID);
    }
  });
}

/**
 * Open a group in a new window directly
 * @param {Number} groupID
 * @return {Promise}
 */
WindowManager.openGroupInNewWindow = function(groupID) {
  return new Promise((resolve, reject) => {
    let groupIndex;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        groupID
      );
    } catch (e) {
      let msg = "WindowManager.openGroupInNewWindow failed; " + e.message;
      console.error(msg);
      reject(msg);
    }
    browser.windows.create({
      state: "maximized",
    }).then((w) => {
      GroupManager.groups[groupIndex].windowId = w.id;
      WindowManager.associateGroupIdToWindow(w.id, groupID);

      TabManager.openListOfTabs(GroupManager.groups[groupIndex].tabs, w.id,false,true).then(()=>{
        // Remove first new tab open with window
        resolve(browser.tabs.remove([w.tabs[0].id]));
      });
    });
  });
}

/**
 * Use sessions tools to associate the groupid to window.
 * If window is restored, even if windowId change, the value is still associated with the window.
 * @param {Number} windowId
 * @param {Number} groupId
 * @return {Promise}
 */
WindowManager.associateGroupIdToWindow = function(windowId, groupId) {
  return browser.sessions.setWindowValue(
    windowId, // integer
    WindowManager.WINDOW_GROUPID, // string
    groupId.toString()
  );
}

/**
 * Take the tabs from a current opened window and create a new group
 * @param {Number} windowId
 * @return {Promise}
 */
WindowManager.addGroupFromWindow = function(windowId) {
  return new Promise((resolve, reject) => {
    browser.tabs.query({
      windowId: windowId
    }).then((tabs) => {
      try {
        var newGroupId = GroupManager.addGroupWithTab(tabs, windowId);
        var lastPromise = WindowManager.associateGroupIdToWindow(
          windowId,
          newGroupId
        );
        resolve(lastPromise);
      } catch (e) {
        console.error("WindowManager.integrateWindow failed on New Window with window " + windowId + " and " + e);
        reject("WindowManager.integrateWindow failed for windowId " + windowId);
      }

    }).catch(() => {
      reject("WindowManager.integrateWindow on Get tabs in Window failed for windowId " + windowId);
    });
  });
}

/**
 * Link an existing window to the groups
 * 1. If already linked, update the link
 * 2. If new window, add group
 * @param {Number} windowId
 * @return {Promise}
 */
WindowManager.integrateWindow = function(windowId) {
  return new Promise((resolve, reject) => {
    browser.sessions.getWindowValue(
      windowId, // integer
      WindowManager.WINDOW_GROUPID // string
    ).then((key) => {
      // New Window
      if (key === undefined) {
        var lastPromise = WindowManager.addGroupFromWindow(windowId);
        resolve(lastPromise);
        // Update Group
      } else {
        let groupIndex;
        try {
          groupIndex = GroupManager.getGroupIndexFromGroupId(
            parseInt(key, 10)
          );
          GroupManager.groups[groupIndex].windowId = windowId;
          resolve("WindowManager.integrateWindow done on window " + windowId);
        } catch (e) {
          // Has a key but a wrong, start from 0
          var lastPromise = WindowManager.addGroupFromWindow(windowId);
          resolve(lastPromise);
        }
      }
    }).catch((msg) => {
      reject("WindowManager.integrateWindow failed on Get Key Value for windowId " + windowId + "\n Error msg: " + msg);
    });
  });
}
