var Group = function(id,
  title = "",
  tabs = [],
  windowId = browser.windows.WINDOW_ID_NONE) {
  this.title = title;
  this.tabs = tabs;
  this.id = id; // Equal to index in array groups
  this.windowId = windowId;
}

var groups = [];
var currentGroupIndex = 0;

var TabManager = TabManager || {};

/**
 * Return the groupId displayed in the window with windowId
 * If no group found: return -1
 * @param {Number} - windowId
 * @returns {Number} - group index
 */
TabManager.getGroupIdInWindow = function(windowId) {
  for (group of groups) {
    if (group.windowId === windowId)
      return group.id;
  }
  // Should never occur !!
  return -1;
}

/**
 * Take the current tabs on the desire window and set it as the tabs
 * for the group
 * Asynchronous
 * @param {Number} window id
 */
TabManager.updateGroup = function(windowId) {
  let groupId = TabManager.getGroupIdInWindow(windowId);
  if (groupId === -1) {
    console.log("Group not found for window: " + windowId);
    return;
  }

  browser.tabs.query({
    windowId: windowId
  }).then((tabs) => {
    groups[groupId].tabs = tabs;
  });
}

/**
 * Return true if the url is privileged
 * Privileged url: chrome: URLs, javascript: URLs,
                    data: URLs, file: URLs, about: URLs
 * Non-privileged URLs: about:blank, about:newtab ( should be
 * replaced by null ), all the other ones
 * @param {string} url
 * @returns {boolean}
 */
TabManager.isPrivilegedURL = function(url) {
  if (url === "about:newtab")
    return false;
  if (url.startsWith("chrome:") ||
    url.startsWith("javascript:") ||
    url.startsWith("data:") ||
    url.startsWith("file:") ||
    url.startsWith("about:"))
    return true;

  return false;
}

/**
 * Sort the groups to be in alphabetical order
 * Change the groups var directly
 * TODO
 */
TabManager.sortGroups = function() {
  console.log("sortGroups not implemented: WONT WORK");
  return;

  if (sort) {
    retGroups.sort((a, b) => {
      if (a.title.toLowerCase() == b.title.toLowerCase()) {
        return 0;
      }

      return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
    });
  }

  return retGroups;
}

/**
 * Open all the tabs in tabsToOpen
 * Asynchronous
 * @param {array[Tab]} tabsToOpen
 * @return {Promise} - last open tab
 */
TabManager.createListOfTabs = function(tabsToOpen) {
  if ( tabsToOpen.length === 0 )
    return Promise.resolve("createListOfTabs done!");

  return new Promise( (resolve, reject) =>{
    var lastPromise;
    tabsToOpen.map((tab, index) => {
      if (!TabManager.isPrivilegedURL(tab.url)) {
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


  return new Promise( (resolve, reject) => {
    browser.tabs.query({
      windowId: windowId
    }).then((tabs) => {
      // 1. Prepare tabs to open and remove
      var tabsToRemove = [];
      tabs.map((tab) => {
        tabsToRemove.push(tab.id);
      });
      var tabsToOpen = groups[newGroupId].tabs;
      // Switch window associated
      groups[oldGroupId].windowId = browser.windows.WINDOW_ID_NONE;
      groups[newGroupId].windowId = windowId;


      // 2. Open new group tabs
      if (tabsToOpen.length === 0) {
        tabsToOpen.push({
          url: "about:newtab",
          active: true,
          pinned: false
        });
      }
      TabManager.createListOfTabs(tabsToOpen).then( ()=> {


        // 3. Remove old ones (Wait first tab to be loaded in order to avoid the window to close)
        // Var will be deprecated
        currentGroupIndex = newGroupId;
        browser.tabs.remove(tabsToRemove).then( ()=> {
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
 * TODO
 */
TabManager.moveTabToGroup = function(sourceGroupID, tabIndex, targetGroupID) {
  // Case 1: same group
  if (currentGroupIndex === targetGroupID) {
    return;
  }

  let tab = groups[sourceGroupID].tabs[tabIndex];

  // Case 2: Closed Group -> Closed Group
  groups[targetGroupID].tabs.push(tab);
  groups[sourceGroupID].tabs.splice(tabIndex, 1);

  // Case 3: Open Group -> Closed Group
  groups[targetGroupID].tabs.push(tab);
  browser.tabs.remove([tab.id]);

  // Case 4: Closed Group -> Open Group
  browser.tabs.create([tab.id]);
  groups[sourceGroupID].tabs.splice(tabIndex, 1);

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
  // Get not supported link tab id
  var tabsIds = [];
  groups[groupID].tabs.map((tab) => {
    if (TabManager.isPrivilegedURL(tab.url))
      tabsIds.push(tab.id);
  });

  // Remove them
  return new Promise ( (resolve, reject) => {
    browser.tabs.remove(tabsIds).then(() => {
      // Update data
      browser.tabs.query({
        windowId: groups[groupID].windowId
      }).then((tabs) => {
        groups[groupID].tabs = tabs;
        resolve("removeUnallowedURL done!")
      });
    });
  });
}

/**
 * @param {Number} groupID
 * @returns {boolean}
 */
TabManager.isGroupInOpenWindow = function(groupID) {
  if (groups[groupID].windowId !== browser.windows.WINDOW_ID_NONE)
    return true;
  else
    return false;
}

/**
 * @param {Number} groupID
 * @returns {boolean}
 */
TabManager.isGroupInCurrentWindow = function(groupID) {
  if (groups[groupID].windowId === browser.windows.WINDOW_ID_CURRENT)
    return true;
  else
    return false;
}

/**
 * Selects a given group, with the tab active was the last one
 * before closing.
 * If not open, switch to it
 * If open is another window, switch to that window
 * Asynchronous
 * @param {Number} groupID - the groupID
 * @return {Promise} - last asynchronous promise called
 */
TabManager.selectGroup = function(groupID) {
  // Case 1: Another window
  if (TabManager.isGroupInOpenWindow(groupID)) {
    return browser.windows.update(
      groups[groupID].windowId, {
        focused: true
      }
    );
  }
  // Case 2: switch group
  else {
    return new Promise( (resolve, reject) => {
      // So that the user can change the window without disturbing
      browser.windows.getCurrent().then((currentWindow) => {
        let currentWindowId = currentWindow.id;
        let currentGroupIndex = TabManager.getGroupIdInWindow(
          currentWindowId
        );
        if (currentGroupIndex === -1) {
          console.log("TabManager.selectGroup: Failed to find group in current window " + currentWindowId);
        }

        TabManager.removeUnallowedURL(currentGroupIndex).then( ()=>{

          TabManager.changeGroupTo(currentWindowId, currentGroupIndex, groupID).then(()=>{
            resolve("End of Switch Group");
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
 */
TabManager.selectTab = function(tabIndex, groupID) {
  TabManager.selectGroup(groupID).then(() => {
    let windowId = groups[groupID].windowId;
    TabManager.activeTabInWindow(windowId, tabIndex);
  });
}

/**
 * Selects the next or previous group in the list
 * direction>0, go to the next groups OR direction<0, go to the previous groups
 * @param {Number} direction
 */
TabManager.selectNextPrevGroup = function(direction) {
  // Should never happen
  if (groups.length == 0) {
    console.log("selectNextPrevGroup can't go to the next group as there is no other one.");
    return;
  }

  targetGroupID = (currentGroupIndex + direction + groups.length) % groups.length;

  TabManager.selectGroup(targetGroupID);
}

/**
 * Renames a given group.
 *
 * @param {Number} groupID - the groupID
 * @param {String} title - the new title
 */
TabManager.renameGroup = function(groupID, title) {
  groups[groupID].title = title;
}

/**
 * Add a new group with one tab: "newtab"
 * No window is associated with this group
 * @param {String} title - kept blank if not given
 * @param {Number} windowId
 */
TabManager.addGroup = function(title = "",
  windowId = browser.windows.WINDOW_ID_NONE) {
  let tabs = [];
  tabs.push({
    url: "about:newtab",
    active: true,
    pinned: false
  });

  groups.push(new Group(groups.length,
    title,
    tabs,
    windowId
  ));
}

/**
 * Adds a group with associated tab.
 *
 * @param {Array[Tab]} tabs - the tabs to place into the new group
 * @param {String} title - the name to give to that group
 */
TabManager.addGroupWithTab = function(tabs,
  title = ""
) {
  if (tabs.length === 0) {
    TabManager.addGroup(title);
    return;
  }
  groups.push(new Group(groups.length, title, tabs, tabs[0].windowId));
}

/**
 * Closes a group and all attached tabs
 *
 * @param {Number} groupID - the groupID
 */
TabManager.removeGroup = function(groupID) {
  // Switch group
  if (currentGroupIndex == groupID) {
    if (groups.length === 0)
      TabManager.addGroup();
    TabManager.selectNextPrevGroup(1);
  }
  groups.splice(groupID, 1);
}
