/**
 * Functions that update the tabs/windows in browser
 * All are insynchronous functions
 * ALL functions HAVE TO return a new Promises that is resolved when everything is done
 * Have direct access (R/W) to the data
 */
var TabManager = TabManager || {};

TabManager.WINDOW_GROUPID = "GROUPID";

/**
 * Take the current tabs on the desire window and set it as the tabs
 * for the group
 * Asynchronous
 * @param {Number} window id
 * @return {Promise} - last asynchronous tasks
 */
TabManager.updateGroup = function(windowId) {
  return new Promise((resolve, reject) => {
    var groupIndex;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        GroupManager.getGroupIdInWindow(windowId)
      );
    } catch (e) {
      let msg = "TabManager.updateGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }

    browser.tabs.query({
      windowId: windowId
    }).then((tabs) => {
      GroupManager.groups[groupIndex].tabs = tabs;
      resolve("TabManager.updateGroup done on window id " + windowId)
    });
  });
}

/**
 * Open all the tabs in tabsToOpen
 * Asynchronous
 * @param {array[Tab]} tabsToOpen
 * @return {Promise} - last open tab
 * TODO: Add window id to create
 */
TabManager.openListOfTabs = function(tabsToOpen) {
  return new Promise((resolve, reject) => {
    if (tabsToOpen.length === 0) {
      resolve("TabManager.openListOfTabs: tabsToOpen was empty, no tab to open");
    }
    var lastPromise;
    tabsToOpen.map((tab, index) => {
      if (!Utils.isPrivilegedURL(tab.url)) {
        // Create a tab to tab.url or to newtab
        lastPromise = browser.tabs.create({
          url: (tab.url === "about:newtab") ? null : tab.url,
          active: tab.active,
          pinned: tab.pinned,
          index: index
        });
      }
    });
    resolve(lastPromise);
  });
}

/**
 * Close all the current tabs and open the tabs from the selected group
 * in the window with windowId
 * The active tab will be the last one active
 * @param {Number} groupId - the group index
 * @returns {Promise} - the remove tabs promise (last)
 * Asynchronous
 */
TabManager.changeGroupTo = function(windowId, oldGroupId, newGroupId) {
  return new Promise((resolve, reject) => {
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
        let msg = "TabManager.changeGroupTo failed; " + e.message;
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
          var lastPromise = TabManager.associateGroupIdToWindow (windowId, newGroupId);
          resolve(lastPromise);
        });
      });
    });
  });
}

/**
 * Go to the tab specified with tabId
 * The tab needs to be in the window
 * @param {Number} tabIndex - the tab index
 * @return {Promise}
 */
TabManager.activeTabInWindow = function(windowId, tabIndex) {
  return new Promise((resolve, reject) => {
    browser.tabs.query({
      windowId: windowId
    }).then((tabs) => {
      for (var tab of tabs) {
        if (tab.index === tabIndex) {
          var lastPromise = browser.tabs.update(tab.id, {
            active: true
          });
          resolve(lastPromise);
        }
      }
      reject("TabManager.activeTabInWindow: tab " + tabIndex + " in window " + windowId + " not found.");
    });
  });
}

/**
 * Move tab beetwen groups
 * @param {Number} sourceGroupID
 * @param {Number} tabIndex
 * @param {Number} targetGroupID
 * @return {Promise}
 * TODO: need to handle cases separatly and fix case 5, add promises
 */
TabManager.moveTabToGroup = function(sourceGroupID, tabIndex, targetGroupID) {
  return new Promise((resolve, reject) => {
    console.log("TabManager.moveTabToGroup not implemented yet.");
    reject("Not implemented");

    // Case 1: same group
    if (sourceGroupID === targetGroupID) {
      resolve("");
    }

    var targetGroupIndex, sourceGroupIndex;
    try {
      targetGroupIndex = GroupManager.getGroupIndexFromGroupId(
        targetGroupID
      );
      sourceGroupIndex = GroupManager.getGroupIndexFromGroupId(
        sourceGroupID
      );
    } catch (e) {
      let msg = "TabManager.moveTabToGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }

    let tab = GroupManager.groups[sourceGroupIndex].tabs[tabIndex];

    // Case 2: Closed Group -> Closed Group
    GroupManager.groups[targetGroupIndex].tabs.push(tab);
    GroupManager.groups[sourceGroupIndex].tabs.splice(tabIndex, 1);

    // Case 3: Open Group -> Closed Group
    GroupManager.groups[targetGroupIndex].tabs.push(tab);
    browser.tabs.remove([tab.id]);

    // Case 4: Closed Group -> Open Group
    browser.tabs.create([tab.id]);
    GroupManager.groups[sourceGroupIndex].tabs.splice(tabIndex, 1);

    // Case 5: Open Group -> Open Group
    browser.tabs.move();
  });
}

/**
 * Close the tabs that are privileged URL
 * Privileged url: chrome: URLs, javascript: URLs,
                    data: URLs, file: URLs, about: URLs
 * Non-privileged URLs: about:blank, about:newtab ( should be
 * replaced by null ), all the other ones
 * Asynchronous
 * @return {Promise} - the before last action
 */
TabManager.removeUnallowedURL = function(groupID) {
  return new Promise((resolve, reject) => {
    let groupIndex;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        groupID
      );
    } catch (e) {
      let msg = "TabManager.removeUnallowedURL failed; " + e.message;
      console.error(msg);
      reject(msg);
    }

    // Get not supported link tab id
    var tabsIds = [];
    GroupManager.groups[groupIndex].tabs.map((tab) => {
      if (Utils.isPrivilegedURL(tab.url))
        tabsIds.push(tab.id);
    });

    // Remove them
    browser.tabs.remove(tabsIds).then(() => {
      // Update data
      browser.tabs.query({
        windowId: GroupManager.groups[groupIndex].windowId
      }).then((tabs) => {
        GroupManager.groups[groupIndex].tabs = tabs;
        resolve("removeUnallowedURL done!")
      });
    });
  });
}

/**
 * Selects a given group, with the tab active was the last one
 * before closing.
 * If not open, switch to it
 * If open is another window, switch to that window
 * Asynchronous
 * @param {Number} newGroupId - the group id
 * @return {Promise} - last asynchronous promise called
 */
TabManager.selectGroup = function(newGroupId) {
  return new Promise((resolve, reject) => {
    // Case 1: Another window
    if (GroupManager.isGroupInOpenWindow(newGroupId)) {
      let newGroupIndex;
      try {
        newGroupIndex = GroupManager.getGroupIndexFromGroupId(
          newGroupId
        );
      } catch (e) {
        let msg = "TabManager.selectGroup failed; " + e.message;
        console.error(msg);
        reject(msg);
      }
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
          let msg = "TabManager.selectGroup failed; " + e.message;
          console.error(msg);
          reject(msg);
        }

        TabManager.removeUnallowedURL(currentGroupId).then(() => {

          TabManager.changeGroupTo(currentWindowId, currentGroupId, newGroupId).then(() => {
            resolve("End of TabManager.selectGroup");
          });

        });

      });
    }
  });

}

/**
 * Selects a given tab.
 * Switch to another group if necessary
 * @param {Number} tabIndex - the tabs index
 * @param {Number} groupID - the tabs groupID
 * @return {Promise}
 */
TabManager.selectTab = function(tabIndex, groupID) {
  return new Promise((resolve, reject) => {
    TabManager.selectGroup(groupID).then(() => {
      let groupIndex;
      try {
        groupIndex = GroupManager.getGroupIndexFromGroupId(
          groupID
        );
      } catch (e) {
        let msg = "TabManager.selectTab failed; " + e.message;
        console.error(msg);
        reject(msg);
      }
      let windowId = GroupManager.groups[groupIndex].windowId;
      var lastPromise = TabManager.activeTabInWindow(windowId, tabIndex);
      resolve(lastPromise);
    });
  });
}

/**
 * Selects the next or previous group in the list
 * direction>0, go to the next groups OR direction<0, go to the previous groups
 * TODO: check next group is not already open, if no group create one, add full Promise support
 * @param {Number} sourceGroupIndex -- group index reference
 * @param {Number} direction
 */
TabManager.selectNextPrevGroup = function(sourceGroupIndex, direction) {
  return new Promise((resolve, reject) => {
    console.log("TabManager.selectNextPrevGroup not implemented yet.");
    reject("Not implemented");

    // Should never happen
    if (GroupManager.groups.length == 0) {
      resolve("selectNextPrevGroup can't go to the next group as there is no other one.");
    }

    let targetGroupIndex = (sourceGroupIndex + direction + GroupManager.groups.length) % GroupManager.groups.length;

    TabManager.selectGroup(GroupManager.groups[targetGroupIndex].id);
  });
}

/**
 * Closes a group and all attached tabs
 * TODO: split in 2 functions remove and close,  selectNextPrevGroup should handle any case for moving, Promise when all is done
 * @param {Number} groupID - the groupID
 */
TabManager.removeGroup = function(groupID) {
  return new Promise((resolve, reject) => {
    let groupIndex;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        groupID
      );
    } catch (e) {
      let msg = "TabManager.removeGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }
    // Switch group
    if (GroupManager.groups[groupIndex].windowId !== browser.windows.WINDOW_ID_NONE) {
      if (GroupManager.groups.length === 0) {
        //  TODO Handle Error
        GroupManager.addGroup();
      }
      TabManager.selectNextPrevGroup(groupID, 1);
    }
    GroupManager.groups.splice(groupIndex, 1);
    resolve("TabManager.removeGroup done on groupid " + groupID);
  });
}


TabManager.openGroupInNewWindow = function(groupID) {
  return new Promise((resolve, reject) => {
    let groupIndex;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        groupID
      );
    } catch (e) {
      let msg = "TabManager.openGroupInNewWindow failed; " + e.message;
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
      var lastPromise = TabManager.associateGroupIdToWindow (w.id, groupID);
      resolve(lastPromise);
    });
  });
}

TabManager.associateGroupIdToWindow = function (windowId, groupId ) {
  return browser.sessions.setWindowValue(
    windowId, // integer
    TabManager.WINDOW_GROUPID, // string
    groupId.toString()
  );
}

TabManager.addGroupFromWindow = function(windowId) {
  return new Promise((resolve, reject) => {
    browser.tabs.query({
      windowId: windowId
    }).then((tabs) => {
      try {
        var newGroupId = GroupManager.addGroupWithTab(tabs);
        var lastPromise = TabManager.associateGroupIdToWindow(
          windowId,
          newGroupId
        );
        resolve(lastPromise);
      } catch (e) {
        console.error("TabManager.integrateWindow failed on New Window with window " + windowId + " and " + e);
        reject("TabManager.integrateWindow failed for windowId " + windowId);
      }

    }).catch(() => {
      reject("TabManager.integrateWindow on Get tabs in Window failed for windowId " + windowId);
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
TabManager.integrateWindow = function(windowId) {
  return new Promise((resolve, reject) => {
    browser.sessions.getWindowValue(
      windowId, // integer
      TabManager.WINDOW_GROUPID // string
    ).then((key) => {
      // New Window
      if (key === undefined) {
          var lastPromise = TabManager.addGroupFromWindow( windowId );
          resolve(lastPromise);
      // Update Group
      } else {
        let groupIndex;
        try {
          groupIndex = GroupManager.getGroupIndexFromGroupId(
            parseInt(key, 10)
          );
          GroupManager.groups[groupIndex].windowId = windowId;
          resolve("TabManager.integrateWindow done on window " + windowId);
        } catch (e) {
          // Has a key but a wrong, start from 0
          var lastPromise = TabManager.addGroupFromWindow( windowId );
          resolve(lastPromise);
        }
      }
    }).catch((msg) => {
      reject("TabManager.integrateWindow failed on Get Key Value for windowId " + windowId + "\n Error msg: " + msg);
    });
  });
}
