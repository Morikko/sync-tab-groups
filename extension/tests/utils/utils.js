/**

 - splitOnHalfScreen
 - splitOnHalfTopScreen
 - splitOnHalfBottomScreen

 - getGroup

 - countDiscardedTabs

 - resetActiveProperties
 - resetIndexProperties
 - waitAllTabsToBeLoadedInWindowId

 - swapOptions

 - getRandom

 - removeGroups
 - closeWindows

*/


/**
 Put the window on the left of the screen
 If TestManager.DOUBLE_MONITORS is true, the screen is not the first one but the second one (the one the more on the right)
**/
TestManager.DOUBLE_MONITORS = true;

TestManager.splitOnHalfScreen = async function(windowId){
  try {
    return browser.windows.update(windowId, {
        left: TestManager.DOUBLE_MONITORS?window.screen.width:0,
        top: 3,
        width: Math.round(window.screen.width/2),
        height: window.screen.height,
    });
  } catch (e) {
    let msg = "TestManager.splitOnHalfScreen failed on window " + windowId + " and " + e;
    console.error(msg);
    return msg;
  }
}

TestManager.splitOnHalfTopScreen = async function(windowId){
  try {
    return browser.windows.update(windowId, {
        left: TestManager.DOUBLE_MONITORS?window.screen.width:0,
        top: 1,
        width: Math.round(window.screen.width/2),
        height: Math.round(screen.width/2),
    });
  } catch (e) {
    let msg = "TestManager.splitOnHalfTopScreen failed on window " + windowId + " and " + e;
    console.error(msg);
    return msg;
  }
}

TestManager.splitOnHalfBottomScreen = async function(windowId){
  try {
    return browser.windows.update(windowId, {
        left: TestManager.DOUBLE_MONITORS?window.screen.width:0,
        top: Math.round(screen.width/2),
        width: Math.round(window.screen.width/2),
        height: Math.round(screen.width/2),
    });
  } catch (e) {
    let msg = "TestManager.splitOnHalfBottomScreen failed on window " + windowId + " and " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * DEPRECATED
 * Get group from the previous test structure when an object kept a ref on the group Indexes
 * Use TestManager.getGroup instead, more general, more robust
 */
TestManager.getGroupDeprecated = (groups, id)=>{
  return GroupManager.groups[groups[id].groupIndex];
};

TestManager.getGroup = (groups, id)=>{
  let index = GroupManager.getGroupIndexFromGroupId(id, true, groups);
  return groups[index];
};

TestManager.countDiscardedTabs = function (tabs) {
  return tabs.filter((tab)=>{
      if ( tab.discarded || tab.url.includes(Utils.LAZY_PAGE_URL) ) {
        return true;
      }
      return false;
  }).length;
}

TestManager.setActiveProperties = function (tabs, tabIndex) {
  tabs.forEach((tab, index)=>{
    if ( tabIndex === index) {
      tab.active = true;
    } else {
      tab.active = false;
    }
  });
}

/**
 * Set all active states to false
 */
TestManager.resetActiveProperties = function (tabs) {
  tabs.forEach((tab)=>{
    tab.active = false;
  });
}

/**
 * Set all index states with the value of the index in the array (start from 0)
 */
TestManager.resetIndexProperties = function (tabs) {
  tabs.forEach((tab, index)=>{
    tab.index = index;
  });
}

TestManager.swapOptions = function (params) {
  let previousValues = {};
  for (let p in params ) {
    previousValues[p] = OptionManager.getOptionValue(p);
    OptionManager.updateOption(p, params[p]);
  }
  return previousValues;
}

/**
 * @param {Number} start
 * @param {Number} end
 * @return {Number} - random number btw start and end included
 */
TestManager.getRandom = function (start, end){
  return Math.floor((Math.random() * (end+1-start)) + start);
}


TestManager.waitAllTabsToBeLoadedInWindowId = async function ( windowId ) {
  let WAIT_SECOND=10, LIMIT =WAIT_SECOND*2;
  let i;
  while( await hasLoadingTabs(windowId) ) {

    await Utils.wait(500);
    i++;

    // Waited too much
    if (i === LIMIT) {
      console.error("TestManager.waitAllTabsToBeLoadedInWindowId: Waited too much...");
      break;
    }
  }

  async function hasLoadingTabs(windowId) {
    // Get all tabs
    let tabs = await TabManager.getTabsInWindowId(windowId, true, true);
    return tabs.filter(tab => tab.status === "loading").length > 0;
  }
}

// Close all windows
TestManager.closeWindows = async function(windowIds) {
  if (!windowIds.length) {
    windowIds = [windowIds]
  }

  for (let windowId of windowIds) {
    if ( windowId >= 0 ) {
      try {
        await browser.windows.remove(windowId);
      } catch(e) {
        // Window might not exist...
      }
    }
  }
}

// Remove groups
TestManager.removeGroups = async function(groupIds) {
  if (!groupIds.length) {
    groupIds = [groupIds]
  }

  for (let groupId of groupIds) {
    if ( GroupManager.getGroupIndexFromGroupId(groupId, false) >= 0 ) {
      try {
        await GroupManager.removeGroupFromId(groupId);
      } catch(e) {
        console.error(e);
        console.error(`An error happened on id: ${groupId} in function TestManager.removeGroups`);
      }
    }
  }
}
