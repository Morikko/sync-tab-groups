/**
 * Model of the Groups
 * Functions getter: that handle error case (else get directly the information)
 * Functions writer: always trhough the API to fire event
 * Event: EVENT_CHANGE
 * DelayedTask: store() (Limited mode)
 */
var GroupManager = GroupManager || {};

GroupManager.EVENT_CHANGE = 'groups-change';
GroupManager.eventlistener = new EventListener();

GroupManager.delaytask = new DelayedTasks.DelayedTasks(500);



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
 * Return the group index for a specific window
 * If no index found: throw Error
 * @param {Number} - window id
 * @returns {Number} - group index
 */
GroupManager.getGroupIndexFromWindowId = function(windowId) {
  for (let i = 0; i < GroupManager.groups.length; i++) {
    if (GroupManager.groups[i].windowId === windowId)
      return i;
  }

  throw Error("GroupManager.getGroupIndexFromWindowId: Failed to find group index for id:  " + windowId);
}

/**
 * Return the windowId for a specific group
 * If no window opened: throw Error
 * @param {Number} - group id
 * @returns {Number} - windowId
 */
GroupManager.getWindowIdFromGroupId = function(groupId) {
  for (let i = 0; i < GroupManager.groups.length; i++) {
    if (GroupManager.groups[i].id === groupId) {
      if (GroupManager.groups[i].windowId !== browser.windows.WINDOW_ID_NONE)
        return GroupManager.groups[i].windowId;
    }
  }

  throw Error("GroupManager.getWindowIdFromGroupId: Failed to find opened window for id:  " + groupId);
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

/******** SETTER *********/

/**
 * Change tabs in group with groupId
 * @param {Number} groupId
 * @param {Array[Tab]} tabs
 */
GroupManager.setTabsInGroupId = function(groupId, tabs) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );
    GroupManager.groups[groupIndex].tabs = tabs;
    GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
  } catch (e) {
    let msg = "GroupManager.detachWindow failed; " + e.message;
    console.error(msg);
  }
}

GroupManager.attachWindowWithGroupId = async function( groupId, windowId) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromWindowId(
      windowId
    );

    GroupManager.groups[groupIndex].windowId = windowId;
    await WindowManager.associateGroupIdToWindow(w.id, groupID);

    GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);

  } catch (e) {
    let msg = "GroupManager.attachWindowWithGroupId failed; " + e.message;
    console.error(msg);
    return;
  }
}

/**
 * Remove the windowId associated to a group
 * @param {Number} windowId
 */
GroupManager.detachWindowFromGroupId = function(groupId) {
  let groupIndex;
  try {
    windowId = GroupManager.getWindowIdFromGroupId(
      groupId
    );

    GroupManager.detachWindow( windowId );

  } catch (e) {
    let msg = "GroupManager.detachWindowFromGroupId failed; " + e.message;
    console.error(msg);
    return;
  }
}

/**
 * Remove the windowId associated to a group
 * @param {Number} windowId
 */
GroupManager.detachWindow = function(windowId) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromWindowId(
      windowId
    );

    GroupManager.groups[groupIndex].windowId = browser.windows.WINDOW_ID_NONE;
    // Remove group from private window if set
    if (g.tabs.length > 0 &&
      g.tabs[0].incognito &&
      OptionManager.options.privateWindow.removeOnClose) {
      GroupManager.removeGroupFromId(GroupManager.groups[groupIndex].id);
    }
    GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);

  } catch (e) {
    let msg = "GroupManager.detachWindow failed; " + e.message;
    console.error(msg);
    return;
  }
}

GroupManager.removeGroupFromId = function(groupId) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );
  } catch (e) {
    let msg = "GroupManager.removeGroupFromId done because group " + groupId + " was already removed.";
    console.error(msg);
    return;
  }

  GroupManager.groups.splice(groupIndex, 1);
  GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
}

GroupManager.removeTabFromIndexInGroupId = async function(groupId, tabIndex, changeBrowser = true) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );
    if (GroupManager.groups[groupIndex].tabs.length <= tabIndex) {
      throw Error("GroupManager.removeTabFromIndexInGroupId impossible");
    }

    if ( GroupManager.isGroupIndexInOpenWindow(groupIndex) && changeBrowser ) {
      await browser.tabs.remove([GroupManager.groups[groupIndex].tabs[tabIndex].id]);
    } else {
      GroupManager.groups[groupIndex].tabs.splice(tabIndex, 1);
    }

    GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);

    return "GroupManager.removeTabFromIndexInGroupId done!";

  } catch (e) {
    return "GroupManager.removeTabFromIndexInGroupId done because group " + groupId + " was already removed.";
  }

}

GroupManager.addTabInGroupId = async function(groupId, tab, changeBrowser = true) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );

    if ( GroupManager.isGroupIndexInOpenWindow(groupIndex) && changeBrowser ) {
      await TabManager.openListOfTabs(
        [tab],
        GroupManager.groups[groupIndex].windowId,
        true,
        false);
    } else {
      GroupManager.groups[groupIndex].tabs.push(tab);
    }

    GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);

    return "GroupManager.addTabFromIndexInGroupId done!";

  } catch (e) {
    return "GroupManager.addTabFromIndexInGroupId done because group " + groupId + " doesn't exist.";
  }

}

/**
 * Renames a given group.
 *
 * @param {Number} groupIndex
 * @param {String} title - the new title
 */
GroupManager.renameGroup = function(groupIndex, title) {
  GroupManager.groups[groupIndex].title = title;
  GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
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
  let uniqueGroupId;
  try {
    uniqueGroupId = GroupManager.createUniqueGroupId();
    GroupManager.groups.push(new GroupManager.Group(uniqueGroupId,
      title,
      tabs,
      windowId
    ));
  } catch (e) {
    throw Error("addGroup: Group not created because " + e.message);
  }

  GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
  return uniqueGroupId;
}

/**
 * Adds a group with associated tab.
 * Error Throwable
 * @param {Array[Tab]} tabs - the tabs to place into the new group
 * @param {String} title - the name to give to that group
 */
GroupManager.addGroupWithTab = function(tabs,
  windowId = browser.windows.WINDOW_ID_NONE,
  title = "") {
  if (tabs.length === 0) {
    return GroupManager.addGroup(title);
  }

  let uniqueGroupId;
  try {
    uniqueGroupId = GroupManager.createUniqueGroupId();
    GroupManager.groups.push(new GroupManager.Group(uniqueGroupId, title, tabs, windowId));
  } catch (e) {
    // Propagate Error
    throw Error("addGroupWithTab: Group not created because " + e.message);
  }

  GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
  return uniqueGroupId;
}

/**
 * Set all windowIds to browser.windows.WINDOW_ID_NONE
 */
GroupManager.resetAssociatedWindows = function() {
  for (g of GroupManager.groups) {
    g.windowId = browser.windows.WINDOW_ID_NONE;
  }
  GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
}

/******** OTHER *********/

/**
 * @param {Number} groupIndex
 * @returns {boolean}
 */
GroupManager.isGroupIndexInOpenWindow = function(groupIndex) {
  if (GroupManager.groups[groupIndex].windowId !== browser.windows.WINDOW_ID_NONE)
    return true;
  else
    return false;
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
 * Asynchronous function
 * Get the saved groups if exist else set empty array
 * @return {Promise}
 */
GroupManager.init = async function() {
  try {
    // 1. Set the data
    const groups = await StorageManager.Local.loadGroups();
    GroupManager.groups = groups;
    GroupManager.resetAssociatedWindows();

    // 2. Integrate open windows
    const windowInfoArray = await browser.windows.getAll({
      windowTypes: ['normal']
    });
    for (windowInfo of windowInfoArray) {
      await WindowManager.integrateWindow(windowInfo.id);
    }
    return "GroupManager.init done";
  } catch (e) {
    return "GroupManager.init failed: " + e;
  }
}
/**
 * Save groups
 * In local storage
 * Do back up in bookmarks
 */
GroupManager.store = function() {
  StorageManager.Local.saveGroups(GroupManager.groups);
  StorageManager.Bookmark.backUp(GroupManager.groups);
}

GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    GroupManager.delaytask.addDelayedTask(
      () => {
        GroupManager.store();
      },
      DelayedTasks.LIMITED_MODE,
    )
  });

/**
 * Sort the groups to be in alphabetical order
 * Change the groups var directly
 * TODO
 */
GroupManager.sortGroups = function() {
  console.log("sortGroups not implemented: WONT WORK");
  return;
  /*
  if (sort) {
    retGroups.sort((a, b) => {
      if (a.title.toLowerCase() == b.title.toLowerCase()) {
        return 0;
      }

      return a.title.toLowerCase() < b.title.toLowerCase() ? -1 : 1;
    });
  }

  return retGroups;
  */
}
