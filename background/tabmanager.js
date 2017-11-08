/**
 * Functions that update the tabs/windows in browser
 * All are insynchronous functions and return a Promises that signal
 * everything is done
 * Have direct access (R/W) to the data
 */
var TabManager = TabManager || {};

/**
 * Take the current tabs on the desire window and set it as the tabs
 * for the group
 * Asynchronous
 * @param {Number} window id
 * @return {Premise} - last asynchronous tasks
 */
TabManager.updateGroup = function(windowId) {
  var groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      GroupManager.getGroupIdInWindow(windowId)
    );
  } catch (e) {
    let msg = "TabManager.updateGroup failed; " + e.message;
    console.error(msg);
    return Promise.reject(msg);
  }

  return browser.tabs.query({
    windowId: windowId
  }).then((tabs) => {
    GroupManager.groups[groupIndex].tabs = tabs;
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
  if (tabsToOpen.length === 0)
    return Promise.resolve("openListOfTabs done!");

  return new Promise((resolve, reject) => {
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
          resolve("changeGroupTo done!");
        });
      });
    });
  });
}

/**
 * Go to the tab specified with tabId
 * The tab needs to be in the window
 * @param {Number} tabIndex - the tab index
 */
TabManager.activeTabInWindow = function(windowId, tabIndex) {
  browser.tabs.query({
    windowId: windowId
  }).then((tabs) => {
    for (var tab of tabs) {
      if (tab.index === tabIndex) {
        browser.tabs.update(tab.id, {
          active: true
        });
      }
    }
  });
}

/**
 * Move tab beetwen groups
 * @param {Number} sourceGroupID
 * @param {Number} tabIndex
 * @param {Number} targetGroupID
 * TODO: need to handle cases separatly and fix case 5
 */
TabManager.moveTabToGroup = function(sourceGroupID, tabIndex, targetGroupID) {
  // Case 1: same group
  if (sourceGroupID === targetGroupID) {
    return;
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
    return Promise.reject(msg);
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
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupID
    );
  } catch (e) {
    let msg = "TabManager.removeUnallowedURL failed; " + e.message;
    console.error(msg);
    return Promise.reject(msg);
  }

  // Get not supported link tab id
  var tabsIds = [];
  GroupManager.groups[groupIndex].tabs.map((tab) => {
    if (Utils.isPrivilegedURL(tab.url))
      tabsIds.push(tab.id);
  });

  // Remove them
  return new Promise((resolve, reject) => {
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
      return Promise.reject(msg);
    }
    return browser.windows.update(
      GroupManager.groups[newGroupIndex].windowId, {
        focused: true
      }
    );
  }
  // Case 2: switch group
  else {
    return new Promise((resolve, reject) => {
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
    });
  }
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
      TabManager.activeTabInWindow(windowId, tabIndex);
    });
  });
}

/**
 * Selects the next or previous group in the list
 * direction>0, go to the next groups OR direction<0, go to the previous groups
 * TODO: check next group is not already open
 * @param {Number} sourceGroupIndex -- group index reference
 * @param {Number} direction
 */
TabManager.selectNextPrevGroup = function(sourceGroupIndex, direction) {
  // Should never happen
  if (GroupManager.groups.length == 0) {
    console.log("selectNextPrevGroup can't go to the next group as there is no other one.");
    return;
  }

  let targetGroupIndex = (sourceGroupIndex + direction + GroupManager.groups.length) % GroupManager.groups.length;

  TabManager.selectGroup(GroupManager.groups[targetGroupIndex].id);
}

/**
 * Closes a group and all attached tabs
 *
 * @param {Number} groupID - the groupID
 */
TabManager.removeGroup = function(groupID) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupID
    );
  } catch (e) {
    let msg = "TabManager.removeGroup failed; " + e.message;
    console.error(msg);
    return Promise.reject(msg);
  }
  // Switch group
  if (GroupManager.groups[groupIndex].windowId !== browser.windows.WINDOW_ID_NONE) {
    if (GroupManager.groups.length === 0)
      GroupManager.addGroup();
    TabManager.selectNextPrevGroup(groupID, 1);
  }
  GroupManager.groups.splice(groupIndex, 1);
}


TabManager.openGroupInNewWindow = function(groupID) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupID
    );
  } catch (e) {
    let msg = "TabManager.openGroupInNewWindow failed; " + e.message;
    console.error(msg);
    return Promise.reject(msg);
  }
  // list of urls to open
  let urls = [];
  GroupManager.groups[groupIndex].tabs.forEach((t) => {
    urls.push(t.url);
  })
  return browser.windows.create({
    state: "maximized",
    url: urls
  }).then((w) => {
    GroupManager.groups[groupIndex].windowId = w.id;
  });
}
