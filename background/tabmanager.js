/**
 * Functions that update the tabs/windows in browser
 * All are insynchronous functions
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
  let groupId = GroupManager.getGroupIdInWindow(windowId);
  if (groupId === -1) {
    console.log("Group not found for window: " + windowId);
    return;
  }

  return browser.tabs.query({
    windowId: windowId
  }).then((tabs) => {
    GroupManager.groups[groupId].tabs = tabs;
  });
}

/**
 * Open all the tabs in tabsToOpen
 * Asynchronous
 * @param {array[Tab]} tabsToOpen
 * @return {Promise} - last open tab
 */
TabManager.openListOfTabs = function(tabsToOpen) {
  if ( tabsToOpen.length === 0 )
    return Promise.resolve("openListOfTabs done!");

  return new Promise( (resolve, reject) =>{
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

  return new Promise( (resolve, reject) => {
    browser.tabs.query({
      windowId: windowId
    }).then((tabs) => {
      // 1. Prepare tabs to open and remove
      var tabsToRemove = [];
      tabs.map((tab) => {
        tabsToRemove.push(tab.id);
      });
      var tabsToOpen = GroupManager.groups[newGroupId].tabs;
      // Switch window associated
      GroupManager.groups[oldGroupId].windowId = browser.windows.WINDOW_ID_NONE;
      GroupManager.groups[newGroupId].windowId = windowId;


      // 2. Open new group tabs
      if (tabsToOpen.length === 0) {
        tabsToOpen.push({
          url: "about:newtab",
          active: true,
          pinned: false
        });
      }
      TabManager.openListOfTabs(tabsToOpen).then( ()=> {


        // 3. Remove old ones (Wait first tab to be loaded in order to avoid the window to close)
        // Var will be deprecated
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
 * TODO: need to handle cases separatly and fix case 5
 */
TabManager.moveTabToGroup = function(sourceGroupID, tabIndex, targetGroupID) {
  // Case 1: same group
  if (sourceGroupID === targetGroupID) {
    return;
  }

  let tab = GroupManager.groups[sourceGroupID].tabs[tabIndex];

  // Case 2: Closed Group -> Closed Group
  GroupManager.groups[targetGroupID].tabs.push(tab);
  GroupManager.groups[sourceGroupID].tabs.splice(tabIndex, 1);

  // Case 3: Open Group -> Closed Group
  GroupManager.groups[targetGroupID].tabs.push(tab);
  browser.tabs.remove([tab.id]);

  // Case 4: Closed Group -> Open Group
  browser.tabs.create([tab.id]);
  GroupManager.groups[sourceGroupID].tabs.splice(tabIndex, 1);

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
  GroupManager.groups[groupID].tabs.map((tab) => {
    if (Utils.isPrivilegedURL(tab.url))
      tabsIds.push(tab.id);
  });

  // Remove them
  return new Promise ( (resolve, reject) => {
    browser.tabs.remove(tabsIds).then(() => {
      // Update data
      browser.tabs.query({
        windowId: GroupManager.groups[groupID].windowId
      }).then((tabs) => {
        GroupManager.groups[groupID].tabs = tabs;
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
 * @param {Number} groupID - the groupID
 * @return {Promise} - last asynchronous promise called
 */
TabManager.selectGroup = function(groupID) {
  // Case 1: Another window
  if (GroupManager.isGroupInOpenWindow(groupID)) {
    return browser.windows.update(
      GroupManager.groups[groupID].windowId, {
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
        let currentGroupIndex = GroupManager.getGroupIdInWindow(
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
    let windowId = GroupManager.groups[groupID].windowId;
    TabManager.activeTabInWindow(windowId, tabIndex);
  });
}

/**
 * Selects the next or previous group in the list
 * direction>0, go to the next groups OR direction<0, go to the previous groups
 * @param {Number} direction
 */
TabManager.selectNextPrevGroup = function(sourceGroupId, direction) {
  // Should never happen
  if (GroupManager.groups.length == 0) {
    console.log("selectNextPrevGroup can't go to the next group as there is no other one.");
    return;
  }

  targetGroupID = (currentGroupIndex + direction + GroupManager.groups.length) % GroupManager.groups.length;

  TabManager.selectGroup(targetGroupID);
}

/**
 * Closes a group and all attached tabs
 *
 * @param {Number} groupID - the groupID
 */
TabManager.removeGroup = function(groupID) {
  // Switch group
  if (currentGroupIndex == groupID) {
    if (GroupManager.groups.length === 0)
      GroupManager.addGroup();
    TabManager.selectNextPrevGroup(groupID, 1);
  }
  GroupManager.groups.splice(groupID, 1);
}


TabManager.openGroupInNewWindow = function( groupID ) {
  for (g of GroupManager.groups) {
    if ( g.id === groupID ) {
      // list of urls to open
      let urls = [];
      GroupManager.groups[groupID].tabs.forEach((t)=>{urls.push(t.url);})
      return browser.windows.create({
        state: "maximized",
        url: urls
      }).then((w)=>{
        GroupManager.groups[groupID].windowId = w.id;
      });
    }
  }
}
