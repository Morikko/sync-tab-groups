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
 * @param {Number} groupId - the group index
 * @returns {Promise} - the remove tabs promise (last)
 * Asynchronous
 */
WindowManager.changeGroupInWindow = function(windowId, oldGroupId, newGroupId) {
  return new Promise((resolve, reject) => {
    TabManager.removeTabsWithUnallowedURL(oldGroupId).then(() => {
      browser.tabs.query({
        windowId: windowId
      }).then((tabs) => {
        // 1. Prepare tabs to open and remove
        var tabsToRemove = [];
        tabs.map((tab) => {
          tabsToRemove.push(tab.id);
        });

        var newGroupIndex, oldGroupIndex;
        try {
          newGroupIndex = GroupManager.getGroupIndexFromGroupId(
            newGroupId
          );
          oldGroupIndex = GroupManager.getGroupIndexFromGroupId(
            oldGroupId
          );
        } catch (e) {
          let msg = "WindowManager.changeGroupInWindow failed; " + e.message;
          console.error(msg);
          reject(msg);
        }

        var tabsToOpen = GroupManager.groups[newGroupIndex].tabs;
        // Switch window associated
        GroupManager.groups[oldGroupIndex].windowId = browser.windows.WINDOW_ID_NONE;
        GroupManager.groups[newGroupIndex].windowId = windowId;


        // 2. Open new group tabs
        if (tabsToOpen.length === 0) {
          tabsToOpen.push({
            url: "about:newtab",
            active: true,
            pinned: false
          });
        }
        TabManager.openListOfTabs(tabsToOpen).then(() => {

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
    if (GroupManager.isGroupInOpenWindow(newGroupIndex)) {
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
        let currentWindowId = currentWindow.id;
        let currentGroupId;
        try {
          currentGroupId = GroupManager.getGroupIdInWindow(
            currentWindowId
          );
        } catch (e) {
          let msg = "WindowManager.selectGroup failed; " + e.message;
          console.error(msg);
          reject(msg);
        }
        WindowManager.changeGroupInWindow(currentWindowId, currentGroupId, newGroupId).then(() => {
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
    for ( let i=sourceGroupIndex; i<sourceGroupIndex+GroupManager.groups.length; i++ ) {
      let targetGroupIndex = (i) % GroupManager.groups.length;

      if ( GroupManager.groups[targetGroupIndex].windowId !== browser.windows.WINDOW_ID_NONE ) {
        nextGroupId = GroupManager.groups[targetGroupIndex].id;
        break;
      }
    }

    // No group found, create one
    if (nextGroupId === -1) {
      try {
        nextGroupId = GroupManager.addGroup();
      } catch (e) {
        console.error("Controller - onGroupAdd failed: " + e);
      }
    }

    var lastPromise = WindowManager.changeGroupInWindow(GroupManager.groups[sourceGroupId].windowId,sourceGroupId, nextGroupId);

    resolve(lastPromise);
  });
}

/**
 * Closes a group and all attached tabs
 * TODO: split in 2 functions remove and close,  selectNextPrevGroup should handle any case for moving, Promise when all is done
 * @param {Number} groupID - the groupID
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
    // Switch group
    if (GroupManager.groups[groupIndex].windowId !== browser.windows.WINDOW_ID_NONE) {
      if (GroupManager.groups.length === 0) {
        //  TODO Handle Error
        GroupManager.addGroup();
      }
      WindowManager.selectNextGroup(groupID, 1);
    }
    GroupManager.groups.splice(groupIndex, 1);
    resolve("WindowManager.removeGroup done on groupid " + groupID);
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
    // list of urls to open
    let urls = [];
    GroupManager.groups[groupIndex].tabs.forEach((t) => {
      urls.push(t.url);
    })
    browser.windows.create({
      state: "maximized",
      url: urls
    }).then((w) => {
      GroupManager.groups[groupIndex].windowId = w.id;
      var lastPromise = WindowManager.associateGroupIdToWindow(w.id, groupID);
      resolve(lastPromise);
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
        var newGroupId = GroupManager.addGroupWithTab(tabs);
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
