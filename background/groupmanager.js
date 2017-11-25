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

GroupManager.repeatedtask = new TaskManager.RepeatedTask(1000);

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

/**
 * Return a deep copy object of GroupManager.groups
 * @return {Array[Group]}
 */
GroupManager.getCopy = function() {
  return JSON.parse(JSON.stringify(GroupManager.groups));
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

GroupManager.attachWindowWithGroupId = async function(groupId, windowId) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );

    GroupManager.groups[groupIndex].windowId = windowId;
    await WindowManager.associateGroupIdToWindow(windowId, groupId);

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

    GroupManager.detachWindow(windowId);

  } catch (e) {
    let msg = "GroupManager.detachWindowFromGroupId failed; " + e.message;
    console.error(msg);
    return;
  }
}

/**
 * Remove the windowId associated to a group (windows was closed)
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
    if (GroupManager.groups[groupIndex].tabs.length > 0 &&
      GroupManager.groups[groupIndex].tabs[0].incognito &&
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

/**
 * Remove all groups that are in private window
 */
GroupManager.removeGroupsInPrivateWindow = async function() {
  try {
    for (let i = GroupManager.groups.length - 1; i >= 0; i--) {
      // Remove group from private window if set
      if (GroupManager.groups[i].tabs.length > 0 &&
        GroupManager.groups[i].tabs[0].incognito &&
        !OptionManager.options.privateWindow.sync) {
        if (GroupManager.groups[i].windowId !== browser.windows.WINDOW_ID_NONE) {
          await WindowManager.desassociateGroupIdToWindow(GroupManager.groups[i].windowId);
        }
        GroupManager.removeGroupFromId(GroupManager.groups[i].id);
      }
    }
    return "GroupManager.removeGroupsInPrivateWindow done!";
  } catch (e) {
    let msg = "GroupManager.removeGroupsInPrivateWindow failed; " + e;
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

    if (GroupManager.isGroupIndexInOpenWindow(groupIndex) && changeBrowser) {
      await browser.tabs.remove([GroupManager.groups[groupIndex].tabs[tabIndex].id]);
    } else {
      GroupManager.groups[groupIndex].tabs.splice(tabIndex, 1);
    }

    GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);

    return "GroupManager.removeTabFromIndexInGroupId done!";

  } catch (e) {
    let msg = "GroupManager.removeTabFromIndexInGroupId done because group " + groupId + " was already removed.";
    console.error(msg);
    return msg;
  }

}

GroupManager.addTabInGroupId = async function(groupId, tab, changeBrowser = true) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );

    if (GroupManager.isGroupIndexInOpenWindow(groupIndex) && changeBrowser) {
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
    let msg = "GroupManager.addTabFromIndexInGroupId done because group " + groupId + " doesn't exist.";
    console.error(msg);
    return msg;
  }

}

GroupManager.updateAllOpenedGroups = async function() {
  for (let g of GroupManager.groups) {
    if (g.windowId !== browser.windows.WINDOW_ID_NONE) {
      await TabManager.updateTabsInGroup(g.windowId);
    }
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
    throw Error("addGroup: Group not created because " + e);
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

/**
 *
 */
GroupManager.removeUnopenGroups = function() {
  for ( let i=GroupManager.groups.length-1; i>=0; i-- ) {
    if ( GroupManager.groups[i].windowId === browser.windows.WINDOW_ID_NONE ){
      GroupManager.groups.splice(i, 1);
    }
  }
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
    await GroupManager.integrateAllOpenedWindows();
    return "GroupManager.init done";
  } catch (e) {
    return "GroupManager.init failed: " + e;
  }
}

/**
 * Integrate all windows
 */
GroupManager.integrateAllOpenedWindows = async function() {
  const windowInfoArray = await browser.windows.getAll({
    windowTypes: ['normal']
  });
  for (windowInfo of windowInfoArray) {
    await WindowManager.integrateWindow(windowInfo.id);
  }
}

/**
 * Save groups
 * In local storage
 * Do back up in bookmarks
 */
GroupManager.store = function() {
  StorageManager.Local.saveGroups(GroupManager.getCopy());
  StorageManager.Bookmark.backUp(GroupManager.getCopy());
}


GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    GroupManager.repeatedtask.add(
      () => {
        GroupManager.store();
      }
    )
  });

// TODO: Currently Not implemented
GroupManager.setGroups = async function(groups, opened, focus) {
  return "Currently Not implemented";
  // 1. Close all window except one
  const windows = await browser.windows.getAll();
  for (let i=1; i<windows.length; i++ ) {
    await browser.windows.close(windows[i].id);
  }

  let initial_size = GroupManager.groups.length;

  // 2. Add groups
  for (g of groups ) {
    GroupManager.groups.push(g);
  }

  // 3. Switch one group
  WindowManager.selectGroup(
    params.opened[0]
  );

  // 4. Open new ones

  // 5. Focus desire

}

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
