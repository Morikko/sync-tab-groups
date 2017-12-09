/**
 * Model of the Groups
 * Functions getter: that handle error case (else get directly the information)
 * Functions writer: always trhough the API to fire event
 * Event: EVENT_CHANGE
 * DelayedTask: store() (Limited mode)
 */
var GroupManager = GroupManager || {};

// Done after a group modification to assure integrity
GroupManager.EVENT_PREPARE = 'groups-prepare';
// Done after a group modification when groups are safe
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
  this.index = -1; // Position of this Group in an Array
  this.position = -1; // Position of this Group when displaying
  this.lastAccessed = 0;
}

GroupManager.groups = [];

/**
 * Return the group id displayed in the window with windowId
 * If no group found: throw Error
 * @param {Number} - windowId
 * @returns {Number} - group id
 */
GroupManager.getGroupIdInWindow = function(windowId, error = true) {
  if (windowId !== browser.windows.WINDOW_ID_NONE) {
    for (let group of GroupManager.groups) {
      if (group.windowId === windowId)
        return group.id;
    }
  }

  if (error) {
    throw Error("getGroupIdInWindow: Failed to find group in window " + windowId);
  } else {
    return -1;
  }

}

/**
 * Return the group index for a specific group
 * If no index found: throw Error or -1
 * @param {Number} - group id
 * @param {Boolean} - error: if true raise error else return -1
 * @param {Array[Group]} - array on which looking for groupId
 * @returns {Number} - group index
 */
GroupManager.getGroupIndexFromGroupId = function(
  groupId,
  error = true,
  groups = GroupManager.groups) {
  for (let i = 0; i < groups.length; i++) {
    if (groups[i].id === groupId)
      return i;
  }
  if (error) {
    throw Error("GroupManager.getGroupIndexFromGroupId: Failed to find group index for id:  " + groupId);
  } else {
    return -1;
  }

}

/**
 * Return the group index for a specific window
 * If no index found: throw Error
 * @param {Number} - window id
 * @returns {Number} - group index
 */
GroupManager.getGroupIndexFromWindowId = function(windowId, error = true) {
  for (let i = 0; i < GroupManager.groups.length; i++) {
    if (GroupManager.groups[i].windowId === windowId)
      return i;
  }

  if (error) {
    throw Error("GroupManager.getGroupIndexFromWindowId: Failed to find group index for id:  " + windowId);
  } else {
    return -1;
  }

}

/**
 * Return the group id for a specific tab
 * If no id found return -1/ Error
 * @param {Number} - tab id
 * @returns {Number} - group id
 */
GroupManager.getGroupIdFromTabId = function(tabId, error = false) {
  for (let i = 0; i < GroupManager.groups.length; i++) {
    for (let j = 0; j < GroupManager.groups[i].tabs.length; j++) {
      if (GroupManager.groups[i].tabs[j].id === tabId)
        return GroupManager.groups[i].id;
    }
  }

  if (error) {
    throw Error("GroupManager.getGroupIdFromTabId: Failed to find group id for tab id:  " + tabId);
  } else {
    return -1;
  }
}

/**
 * Return the tab index for a specific tab in a group
 * If no id found return -1
 * @param {Number} - tab id
 * @param {Number} - groupe index
 * @returns {Number} - group id
 */
GroupManager.getTabIndexFromTabId = function(tabId, groupIndex, error = false) {
  for (let j = 0; j < GroupManager.groups[groupIndex].tabs.length; j++) {
    if (GroupManager.groups[groupIndex].tabs[j].id === tabId)
      return j;
  }

  if (error) {
    throw Error("GroupManager.getTabIndexFromTabId: Failed to find tab index for tab id:  " + tabId + " in group id " + GroupManager.groups[groupIndex].id);
  } else {
    return -1;
  }
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
  for (let g of GroupManager.groups) {
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
 * Set the UI position variable for each group in groups
 * @param {Array[Group]} groups - (default: global groups)
 * @param {Number} sortingType - (default: the one set in option)
 */
GroupManager.setPosition = function(groups = GroupManager.groups, sortingType = OptionManager.options.groups.sortingType) {
  // Default: OptionManager.SORT_OLD_RECENT
  let positions = [...Array(groups.length).keys()];

  if (sortingType === OptionManager.SORT_RECENT_OLD) {
    positions = [...Array(groups.length).keys()].reverse();
  }
  if (sortingType === OptionManager.SORT_ALPHABETICAL) {
    positions = GroupManager.sortGroupsAlphabetically(groups);
  }
  if (sortingType === OptionManager.SORT_LAST_ACCESSED) {
    positions = GroupManager.sortGroupsLastAccessed(groups);
  }

  for (let i = 0; i < groups.length; i++) {
    groups[i].position = positions[i];
  }
}

/**
 * Set time to lastAccessed in group groupId
 * @param {Number} groupId
 * @param {Number} time
 */
GroupManager.setLastAccessed = function(groupId, time, groups = GroupManager.groups) {
  try {
    let groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId,
      true,
      groups,
    );
    groups[groupIndex].lastAccessed = time;
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
  } catch (e) {
    let msg = "GroupManager.setLastAccessed failed; " + e.message;
    console.error(msg);
  }
}

/**
 * Set the bigger last Accessed from the tab to the group
 * @param {Array[Group]} groups - (default: global groups)
 */
GroupManager.updateLastAccessed = function(groups = GroupManager.groups) {
  for (let g of groups) {
    let lastAccessed = g.lastAccessed;
    for (let tab of g.tabs) { // If no tab, keep the old value
      if (tab.lastAccessed > lastAccessed) {
        lastAccessed = tab.lastAccessed;
      }
    }
    g.lastAccessed = lastAccessed;
  }
}

/**
 * Set the index variable for each group in groups
 * @param {Array[Group]} groups - (default: global groups)
 */
GroupManager.setIndex = function(groups = GroupManager.groups) {
  let i = 0;
  for (let g of groups) {
    g.index = i;
    i++;
  }
}

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

    if (OptionManager.options.groups.removeEmptyGroup) {
      GroupManager.removeEmptyGroup();
    }

    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
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
 * Check that group objects in groups array have all the good propreties
 * @param {Array[GroupManager.Group]} groups
 * @return {Array[GroupManager.Group]} groups - verified
 */
GroupManager.check_integrity = function(groups) {
  var ref_group = new GroupManager.Group();
  for (let group of groups) {
    Utils.mergeObject(group, ref_group);
  }
  return groups;
}

/**
 * Remove the windowId associated to a group
 * @param {Number} windowId
 */
GroupManager.detachWindowFromGroupId = async function(groupId) {
  let groupIndex;
  try {
    windowId = GroupManager.getWindowIdFromGroupId(
      groupId
    );

    await GroupManager.detachWindow(windowId);

  } catch (e) {
    let msg = "GroupManager.detachWindowFromGroupId failed; " + e;
    console.error(msg);
    return;
  }
}

/**
 * Remove the windowId associated to a group (windows was closed)
 * @param {Number} windowId
 */
GroupManager.detachWindow = async function(windowId) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromWindowId(
      windowId,
      false
    );

    if (groupIndex === -1) {
      return "GroupManager.detachWindow done because no group was in window: " + windowId;
    }

    GroupManager.groups[groupIndex].windowId = browser.windows.WINDOW_ID_NONE;
    // Remove group from private window if set
    if (GroupManager.groups[groupIndex].tabs.length > 0 &&
      GroupManager.groups[groupIndex].tabs[0].incognito &&
      OptionManager.options.privateWindow.removeOnClose) {
      await GroupManager.removeGroupFromId(GroupManager.groups[groupIndex].id);
    } else {
      WindowManager.desassociateGroupIdToWindow(windowId);
    }

    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);

  } catch (e) {
    let msg = "GroupManager.detachWindow failed; " + e;
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

        await GroupManager.removeGroupFromId(GroupManager.groups[i].id);
      }
    }
    return "GroupManager.removeGroupsInPrivateWindow done!";
  } catch (e) {
    let msg = "GroupManager.removeGroupsInPrivateWindow failed; " + e;
    console.error(msg);
    return;
  }

}

/**
 * Remove a group
 * Also detach opened window
 */
GroupManager.removeGroupFromId = async function(groupId) {
  let groupIndex;
  try {
    groupIndex = GroupManager.getGroupIndexFromGroupId(
      groupId
    );

    if (GroupManager.groups[groupIndex].windowId !== browser.windows.WINDOW_ID_NONE) {
      await WindowManager.desassociateGroupIdToWindow(GroupManager.groups[groupIndex].windowId);
    }

    GroupManager.groups.splice(groupIndex, 1);
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
  } catch (e) {
    let msg = "GroupManager.removeGroupFromId failed on " + groupId + " because " + e;
    console.error(msg);
    return msg;
  }
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

    if (OptionManager.options.groups.removeEmptyGroup) {
      GroupManager.removeEmptyGroup();
    }

    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);

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

  if (GroupManager.groups[groupIndex].windowId !== browser.windows.WINDOW_ID_NONE) {
    WindowManager.setWindowPrefixGroupTitle(
      GroupManager.groups[groupIndex].windowId,
      GroupManager.groups[groupIndex]);
  }

  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
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
  let tabs = [{
    url: "about:newtab",
    title: "New Tab",
    active: true
  }];
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

  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
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

  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
  return uniqueGroupId;
}

GroupManager.addGroups = function(groups) {
  for (let g of groups) {
    g.id = GroupManager.createUniqueGroupId();
    GroupManager.groups.push(g);
  }

  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
}

/**
 * Set all windowIds to browser.windows.WINDOW_ID_NONE
 */
GroupManager.resetAssociatedWindows = function() {
  for (let g of GroupManager.groups) {
    g.windowId = browser.windows.WINDOW_ID_NONE;
  }
  GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
}

/**
 *
 */
GroupManager.removeUnopenGroups = function() {
  for (let i = GroupManager.groups.length - 1; i >= 0; i--) {
    if (GroupManager.groups[i].windowId === browser.windows.WINDOW_ID_NONE) {
      GroupManager.groups.splice(i, 1);
    }
  }
  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
}


/**
 *
 */
GroupManager.removeEmptyGroup = function() {
  for (let i = GroupManager.groups.length - 1; i >= 0; i--) {
    if (GroupManager.groups[i].tabs.length === 0) {
      GroupManager.groups.splice(i, 1);
    }
  }
  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
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
    for (let g of GroupManager.groups) {
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
    GroupManager.groups = GroupManager.check_integrity(groups);
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
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
  for (let windowInfo of windowInfoArray) {
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
  if (OptionManager.options.bookmarks.sync) {
    StorageManager.Bookmark.backUp(GroupManager.getCopy());
  }
}

//
GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    GroupManager.repeatedtask.add(
      () => {
        GroupManager.store();
      }
    )
  });

// Done after a group modification to assure integrity
GroupManager.eventlistener.on(GroupManager.EVENT_PREPARE,
  () => {
    GroupManager.setIndex(GroupManager.groups);
    //GroupManager.updateLastAccessed(GroupManager.groups);
    GroupManager.setPosition(GroupManager.groups, OptionManager.options.groups.sortingType);
    GroupManager.eventlistener.fire(GroupManager.EVENT_CHANGE);
  });


/**
 * Sort the groups so the last accessed group first
 * @param {Array[Group]} - groups
 * @return {Array[number]} - array with the positions sort by groups index
 */
GroupManager.sortGroupsLastAccessed = function(groups) {

  let positions = [];
  let toSort = [];
  groups.map((group) => {
    toSort.push({
      lastAccessed: group.lastAccessed,
      id: group.id,
      title: group.title,
      index: group.index,
    });
  });

  toSort.sort((a, b) => {
    if (a.lastAccessed === b.lastAccessed) { // Same time; sort alphabetically
      if (a.title === "" && b.title === "") return a.id < b.id ? -1 : 1;
      if (a.title === b.title) return a.id < b.id ? -1 : 1;
      if (a.title === "") return 1;
      if (b.title === "") return -1;

      return a.title < b.title ? -1 : 1;
    }

    return a.lastAccessed < b.lastAccessed ? 1 : -1;
  });
  toSort.map((sorted, index) => {
    positions[sorted.index] = index;
  });

  return positions;
}


/**
 * Sort the groups to be in alphabetical order
 * @param {Array[Group]} - groups
 * @return {Array[number]} - array with the positions sort by groups index
 */
GroupManager.sortGroupsAlphabetically = function(groups) {

  let positions = [];
  let toSort = [];
  groups.map((group) => {
    toSort.push({
      title: group.title,
      id: group.id,
      index: group.index,
    });
  });

  toSort.sort((a, b) => {
    if (a.title === "" && b.title === "") return a.id < b.id ? -1 : 1;
    if (a.title === b.title) return a.id < b.id ? -1 : 1;
    if (a.title === "") return 1;
    if (b.title === "") return -1;

    return a.title < b.title ? -1 : 1;
  });

  toSort.map((sorted, index) => {
    positions[sorted.index] = index;
  });

  return positions;
}
