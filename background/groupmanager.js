/**
 * Model of the Groups
 * Functions that read/write the data
 * All are synchronous functions
 */
var GroupManager = GroupManager || {};

GroupManager.Group = function(id,
  title = "",
  tabs = [],
  windowId = browser.windows.WINDOW_ID_NONE) {
  this.title = title;
  this.tabs = tabs;
  this.id = id; // Unique in all group
  this.windowId = windowId;
}

GroupManager.groups = [];

/**
 * Return the group id displayed in the window with windowId
 * If no group found: throw Error
 * @param {Number} - windowId
 * @returns {Number} - group id
 */
GroupManager.getGroupIdInWindow = function(windowId) {
  for (group of GroupManager.groups) {
    if (group.windowId === windowId)
      return group.id;
  }

  throw Error("getGroupIdInWindow: Failed to find group in window " + windowId);
}

/**
 * Return the group index for a specific group
 * If no index found: throw Error
 * @param {Number} - group id
 * @returns {Number} - group index
 */
GroupManager.getGroupIndexFromGroupId = function(groupId) {
  for (let i = 0; i < GroupManager.groups.length; i++) {
    if (GroupManager.groups[i].id === groupId)
      return i;
  }

  throw Error("GroupManager.getGroupIndexFromGroupId: Failed to find group index for id:  " + groupId);
}

/**
 * @param {Number} groupID
 * @returns {boolean}
 */
GroupManager.isGroupInOpenWindow = function(groupID) {
  if (GroupManager.groups[groupID].windowId !== browser.windows.WINDOW_ID_NONE)
    return true;
  else
    return false;
}

/**
 * Remove the windowId associated to a group
 * @param {Number} windowId
 */
GroupManager.detachWindow = function(windowId) {
  for (g of GroupManager.groups) {
    if (g.windowId === windowId)
      g.windowId = browser.windows.WINDOW_ID_NONE;
  }
}

GroupManager.isWindowAlreadyRegistered = function(windowId) {
  if (windowId === browser.windows.WINDOW_ID_NONE)
    return false;
  for (g of GroupManager.groups) {
    if (g.windowId === windowId)
      return true;
  }
  return false;
}

/**
 * Renames a given group.
 *
 * @param {Number} groupID - the groupID
 * @param {String} title - the new title
 */
GroupManager.renameGroup = function(groupID, title) {
  GroupManager.groups[groupID].title = title;
}

/**
 * Add a new group with one tab: "newtab"
 * No window is associated with this group
 * @param {String} title - kept blank if not given
 * @param {Number} windowId
 */
GroupManager.addGroup = function(title = "",
  windowId = browser.windows.WINDOW_ID_NONE) {
  if (GroupManager.isWindowAlreadyRegistered(windowId))
    return;

  let tabs = [];

  try {
    GroupManager.groups.push(new GroupManager.Group(GroupManager.createUniqueGroupId(),
      title,
      tabs,
      windowId
    ));
  } catch (e) {
    throw Error("addGroup: Group not created because " + e.message);
  }
}

/**
 * Adds a group with associated tab.
 * Error Throwable
 * @param {Array[Tab]} tabs - the tabs to place into the new group
 * @param {String} title - the name to give to that group
 */
GroupManager.addGroupWithTab = function(tabs,
  title = "") {
  if (tabs.length === 0) {
    return GroupManager.addGroup(title);
  }
  let windowId = tabs[0].windowId;

  try {
    let uniqueGroupId = GroupManager.createUniqueGroupId();
    GroupManager.groups.push(new GroupManager.Group(uniqueGroupId, title, tabs, tabs[0].windowId));
    return uniqueGroupId;
  } catch (e) {
    // Propagate Error
    throw Error("addGroupWithTab: Group not created because " + e.message);
  }
}

/**
 * Find an Id that is not used in the groups
 * @return {Number} uniqueGroupId
 */
GroupManager.createUniqueGroupId = function() {
  var uniqueGroupId = GroupManager.groups.length - 1;
  let isUnique = true,
    count = 0;

  do {
    uniqueGroupId++;
    count++;
    isUnique = true;
    for (g of GroupManager.groups) {
      isUnique = isUnique && g.id !== uniqueGroupId;
    }

    if (count > 100000)
      throw Error("createUniqueGroupId: Can't find an unique group Id");

  } while (!isUnique);

  return uniqueGroupId;
}

/**
 * Set all windowIds to browser.windows.WINDOW_ID_NONE
 */
GroupManager.resetAssociatedWindows = function ( ) {
  for ( g of GroupManager.groups ) {
    g.windowId = browser.windows.WINDOW_ID_NONE;
  }
}

/**
 * Asynchronous function
 * Get the saved groups if exist else set empty array
 * @return {Promise}
 */
GroupManager.init = function() {
  return new Promise((resolve, reject) => {
    StorageManager.Local.loadGroups( ).then((groups) => {
      GroupManager.groups = groups;
      GroupManager.resetAssociatedWindows();
      resolve("GroupManager.init done");
    }).catch(() => {
      reject("GroupManager.init failed");
    });
  });
}
/**
 * Save groups
 */
GroupManager.store = function() {
  StorageManager.Local.saveGroups( GroupManager.groups );
}

/**
 * Sort the groups to be in alphabetical order
 * Change the groups var directly
 * TODO
 */
GroupManager.sortGroups = function() {
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
