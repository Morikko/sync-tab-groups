var Group = function(id, title = "", tabs = []) {
  this.title = title;
  this.tabs = tabs;
  this.id = id;
}

var groups = [];
var currentGroupIndex = 0;

/*
function TabManager(storage) {
  //this._storage = storage;
}
*/

var TabManager = TabManager || {};

/*
 * Take the current tabs on the current frame and set it as the tabs
 * for the group: groupId
 */
TabManager.updateGroup = function(groupId) {
  browser.tabs.query({
    currentWindow: true
  }).then((tabs) => {
    groups[groupId].tabs = tabs;
  });
}

/*
 * Return true if the url is privileged
 * Privileged url: chrome: URLs, javascript: URLs,
                    data: URLs, file: URLs, about: URLs
 * Non-privileged URLs: about:blank, about:newtab ( should be
 * replaced by null ), all the other ones
 */
TabManager.filterPrivilegedURL = function(url) {
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
 * Returns all groups with their tabs.
 *
 * @param {boolean} sort
 * @returns {Object}
 */
TabManager.getGroups = function(sort) {

  let retGroups = groups.map((group, index) => {
    return Object.assign({}, group, {
      tabs: tabs
    });
  });

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
 * Open all the tabs
 * Return the last tab creation promise
 * Asynchronous
 */
TabManager.createListOfTabs = function(tabs) {
  tabs.map((tab, index) => {
    tab.url = (tab.url === "") ? null : tab.url;
    browser.tabs.create({
      url: tab.url,
      active: tab.active,
      pinned: tab.pinned,
      index: index
    });
  });
}

/**
 * Close all the current tabs and open the tabs from the selected group
 * The active tab will be the last one active
 * @param {Number} groupId - the group index
 * Return the last action promise
 * Asynchronous
 */
TabManager.changeGroupTo = function(groupId) {

  var tabsIds = [];
  return browser.tabs.query({
    currentWindow: true
  }).then((tabs) => {
    // 1. Save current tabs id for removing them after
    tabs.map((tab) => {
      tabsIds.push(tab.id);
    });

    // 2. Add new group tabs
    if (groups[groupId].tabs.length === 0) {
      groups[groupId].tabs.push({
        url: "about:newtab",
        active: true,
        pinned: false
      });
    }
    //createListOfTabs(groups[groupId].tabs);
    groups[groupId].tabs.map((tab, index) => {
      if (!TabManager.filterPrivilegedURL(tab.url)) {
        browser.tabs.create({
          url: (tab.url === "about:newtab") ? null : tab.url,
          active: tab.active,
          pinned: tab.pinned,
          index: index
        });
      }
    });

    // 3. Remove old ones (Wait first tab to be loaded in order to avoid the window to close)
    currentGroupIndex = groupId;
    return browser.tabs.remove(tabsIds);
  });
}

/**
 * Go to the tab specified with tabId
 * The tab needs to be in the window
 * @param {Number} tabId - the tab index
 */
TabManager.activeTabInWindow = function(tabId) {
  browser.tabs.query({
    currentWindow: true
  }).then((tabs) => {
    console.log(tabs);
    console.log(tabId);
    for (var tab of tabs) {
      if (tab.index === tabId) {
        console.log(tab.index);
        browser.tabs.update(tab.id, {
          active: true
        });
      }
    }
  });
}

/**
 * Move tab beetwen groups
 * TODO: Get sourceGroupID for handling all the cases
 * @param {Number} tabIndex - the tabs index
 * @param {Number} targetGroupID - target groupID (where to move tab)
 */
TabManager.moveTabToGroup = function(sourceGroupID, tabIndex, targetGroupID) {
  console.log("moveTabToGroup won't work")
  if (currentGroupIndex === targetGroupID) {
    return;
  }

  let tab = groups[currentGroupIndex].tabs[tabIndex];
  // Update groups
  groups[targetGroupID].tabs.push(tab);
  groups[currentGroupIndex].tabs.splice(tabIndex, 1);

  if (tab.active) {
    TabManager.changeGroupTo(groupID);
    TabManager.activeTabInWindow(tabIndex);
  }
}

/**
 * Return a promise on the last action
 * Asynchronous
 */
TabManager.removeUnallowedURL = function(groupID) {
  // Get not supported link tab id
  var tabsIds = [];
  groups[groupID].tabs.map((tab) => {
    if ( TabManager.filterPrivilegedURL(tab.url) )
      tabsIds.push(tab.id);
  });

  // Remove them
  browser.tabs.remove(tabsIds).then(() => {
    // Update data
    browser.tabs.query({
      currentWindow: true
    }).then((tabs) => {
      groups[groupID].tabs = tabs;
    });
  });

}

/**
 * Selects a given group.
 * @param {Number} groupID - the groupID
 * @param {Number} tabIndex - the tab to activate
 */
TabManager.selectGroup = function(groupID) {
  if (currentGroupIndex === groupID) {
    // API compatibility
    return Promise.resolve('Already the good group, nothing to do.');
  }

  TabManager.removeUnallowedURL(currentGroupIndex);

  var pr = TabManager.changeGroupTo(groupID).then( ()=>{
      TabManager.updateGroup(groupID);
  });
  return pr;
}

/**
 * Selects a given tab.
 * Switch to another group if necessary
 * @param {Number} index - the tabs index
 * @param {Number} groupID - the tabs groupID
 */
TabManager.selectTab = function(tabId, groupID) {
  TabManager.selectGroup(groupID).then(()=>{
    TabManager.activeTabInWindow(tabId);
  });
}

/**
 * Selects the next or previous group in the list
 * direction>0, go to the next groups OR direction<0, go to the previous groups
 * @param {Number} direction
 */
TabManager.selectNextPrevGroup = function(direction) {
  if (groups.length == 0) {
    return;
  }

  targetGroupID = (currentGroupIndex + direction + groups.length) % groups.length;

  TabManager.changeGroupTo(targetGroupID)
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
 * Adds a blank group
 * TODO: title, blanck tab ??
 */
TabManager.addGroup = function(title = "") {
  groups.push(new Group(groups.length));

}

/**
 * Adds a group with associated tab
 *
 * @param {Array[Tab]} tabs - the tabs to place into the new group
 * @param {String} title - the name to give to that group
 */
TabManager.addGroupWithTab = function(tabs, title = "") {
  groups.push(new Group(groups.length, title, tabs));
}

/**
 * Closes a group and all attached tabs
 *
 * @param {Number} groupID - the groupID
 */
TabManager.removeGroup = function(groupID) {
  // Switch group
  if (currentGroupIndex == groupID) {
    TabManager.selectNextPrevGroup(1);
  }
  groups.splice(groupID, 1);
}
