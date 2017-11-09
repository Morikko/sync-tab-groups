/**
 * Functions that update the tabs in browser
 * All are insynchronous functions
 * ALL functions HAVE TO return a new Promises that is resolved when everything is done
 * Have direct access (R/W) to the data
 */
var TabManager = TabManager || {};

/**
 * Take the current tabs on the desire window and set it as the tabs
 * for the group
 * Asynchronous
 * @param {Number} window id
 * @return {Promise} - last asynchronous tasks
 */
TabManager.updateTabsInGroup = function(windowId) {
  return new Promise((resolve, reject) => {
    var groupIndex;
    try {
      groupIndex = GroupManager.getGroupIndexFromGroupId(
        GroupManager.getGroupIdInWindow(windowId)
      );
    } catch (e) {
      let msg = "TabManager.updateTabsInGroup failed; " + e.message;
      console.error(msg);
      reject(msg);
    }

    browser.tabs.query({
      windowId: windowId
    }).then((tabs) => {
      GroupManager.groups[groupIndex].tabs = tabs;
      resolve("TabManager.updateTabsInGroup done on window id " + windowId)
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
 * Go to the tab specified with tabId
 * The tab needs to be in an open window
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
TabManager.removeTabsWithUnallowedURL = function(groupID) {
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
      let msg = "TabManager.removeTabsWithUnallowedURL failed; " + e.message;
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
        windowId: windowId
      }).then((tabs) => {
        GroupManager.groups[groupIndex].tabs = tabs;
        resolve("removeUnallowedURL done!")
      });
    });
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
