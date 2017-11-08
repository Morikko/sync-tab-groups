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
  this.id = id; // Equal to index in array groups
  this.windowId = windowId;
}

GroupManager.groups = [];

/**
 * Return the groupId displayed in the window with windowId
 * If no group found: return -1
 * @param {Number} - windowId
 * @returns {Number} - group index
 */
GroupManager.getGroupIdInWindow = function(windowId) {
  for (group of GroupManager.groups) {
    if (group.windowId === windowId)
      return group.id;
  }
  // Should never occur !!
  return -1;
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
 * Add a new group with one tab: "newtab"
 * No window is associated with this group
 * @param {String} title - kept blank if not given
 * @param {Number} windowId
 */
GroupManager.addGroup = function(title = "",
  windowId = browser.windows.WINDOW_ID_NONE) {
  if ( GroupManager.isWindowAlreadyRegistered( windowId ) )
    return;

  let tabs = [];

  GroupManager.groups.push(new GroupManager.Group(GroupManager.groups.length,
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
GroupManager.addGroupWithTab = function(tabs,
  title = ""
) {
  if (tabs.length === 0) {
    GroupManager.addGroup(title);
    return;
  }
  let windowId = tabs[0].windowId;

  if ( GroupManager.isWindowAlreadyRegistered( windowId ) )
    return;

  GroupManager.groups.push(new GroupManager.Group(GroupManager.groups.length, title, tabs, tabs[0].windowId));
}

/**
 * Remove the windowId associated to a group
 * @param {Number} windowId
 */
GroupManager.detachWindow = function( windowId ) {
  for (g of GroupManager.groups) {
    if ( g.windowId === windowId )
      g.windowId = browser.windows.WINDOW_ID_NONE;
  }
}

GroupManager.isWindowAlreadyRegistered = function ( windowId ) {
  if ( windowId === browser.windows.WINDOW_ID_NONE )
    return false;
  for (g of GroupManager.groups) {
    if ( g.windowId === windowId )
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
