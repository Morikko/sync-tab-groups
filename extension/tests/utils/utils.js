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
        state: "normal",
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
  let index = GroupManager.getGroupIndexFromGroupId(id, {
    error: true,
    groups: groups
  });
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



TestManager.changeSomeOptions = async function (params) {
  let previousValues = {};
  for (let p in params ) {
    previousValues[p] = OptionManager.getOptionValue(p);
    await OptionManager.updateOption(p, params[p]);
  }
}

/**
 * Set new options as @params
 * return the previous ones
 */
TestManager.swapOptions = function (params=OptionManager.TEMPLATE()) {
  let options = OptionManager.options;
  OptionManager.options = params;
  return options;
}

/**
 * Set new groups as @params
 * return the previous ones
 */
TestManager.swapGroups = function (params=[]) {
  let groups = GroupManager.groups;
  GroupManager.groups = params;
  return groups;
}

TestManager.getWindows = async function() {
  return (await browser.windows.getAll()).map(w => w.id);
}

TestManager.clearWindows = async function(filter=[]) {
  const allWindows = (await browser.windows.getAll())
          .map(w => w.id)
          .filter(windowId => filter.indexOf(windowId) === -1);

  await Promise.all(
    allWindows.map((windowId)=> browser.windows.remove(windowId))
  )
}

TestManager.swapLocalStorage = async function (params={}) {
  let previousValues = await browser.storage.local.get(null);
  await browser.storage.local.clear();
  await browser.storage.local.set(params);
  return previousValues;
}

TestManager.initBeforeAll = async function(that){
  // Done at the rootest describe
  jasmine.addMatchers(tabGroupsMatchers);
  that.previousOptions = TestManager.swapOptions();
  that.previousGroups = TestManager.swapGroups();
  that.initialWindows = await TestManager.getWindows();
  that.initialStorage = await TestManager.swapLocalStorage();
  OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
  await Utils.wait(300);
}

TestManager.initAfterAll = async function(that){
  // Done at the rootest describe
  TestManager.swapOptions(that.previousOptions);
  TestManager.swapGroups(that.previousGroups);
  await TestManager.swapLocalStorage(that.initialStorage);
  OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
  GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
  await TestManager.clearWindows(that.initialWindows);
  await Utils.wait(300);
}

const TIME_OBJECTS = [
  "setTimeout",
  "setInterval",
  "clearTimeout",
  "clearInterval",
  "Date",
]

var savedTime = {};
TestManager.installFakeTime = function() {
  if (!Object.keys(savedTime).length) {
    jasmine.clock().install();
    jasmine.clock().mockDate();
    // Change setInterval and set this reference to the backgroung
    savedTime = {};
    TIME_OBJECTS.forEach((time)=>{
      savedTime[time] = bg[time];
      bg[time] = window[time];
    });
  }
}

// Done only is previously saved
TestManager.uninstallFakeTime = function() {
  if (Object.keys(savedTime).length) {
    jasmine.clock().uninstall();
    Object.assign(bg, savedTime);
    savedTime = {};
  }
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
    let tabs = await TabManager.getTabsInWindowId(windowId, {
      withPinned: true,
    });
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
    if ( GroupManager.getGroupIndexFromGroupId(groupId, {error: false}) >= 0 ) {
      try {
        await GroupManager.removeGroupFromId(groupId);
      } catch(e) {
        console.error(e);
        console.error(`An error happened on id: ${groupId} in function TestManager.removeGroups`);
      }
    }
  }
}

TestManager.getRandomGroupId = function(groups) {
  let index = TestManager.getRandom(0, groups.length-1);

  if (!groups[index]) {
    console.log(index);
  }
  return groups[
    index
  ].id;
}

TestManager.getRandomTabIndex = function(
  groups,
  groupId=TestManager.getRandomGroupId(groups))
{
  let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId, {groups: groups});
  return TestManager.getRandom(0, groups[groupIndex].tabs.length-1);
}

TestManager.getRandomGroupPosition = function(groups) {
  return groups[
    TestManager.getRandom(0, groups.length-1)
  ].position;
}

TestManager.getRandomAction = function() {
  return TestManager.getRandom(0, ACTIONS.length-1);
}

const ACTIONS = [
  // MOVE
  async (groups) =>{
    if (!groups.length) return;
    await Controller.onGroupChangePosition({
      groupId: TestManager.getRandomGroupId(groups),
      position: TestManager.getRandomGroupPosition(groups),
    })
  },
  async (groups) =>{
    if (!groups.length) return;
    let sourceGroupId = TestManager.getRandomGroupId(groups);
    let targetGroupId = TestManager.getRandomGroupId(groups);
    await Controller.onMoveTabToGroup({
      sourceGroupId: sourceGroupId,
      sourceTabIndex: TestManager.getRandomTabIndex(groups, sourceGroupId),
      targetGroupId: targetGroupId,
      targetTabIndex: TestManager.getRandomTabIndex(groups, targetGroupId),
    })
  },
  // TAB CHANGE
  async (groups) =>{
    if (!groups.length) return;
    let groupId = TestManager.getRandomGroupId(groups);
    await GroupManager.addTabInGroupId(
      groupId,
      Session.getRandomNormalTab(),
      TestManager.getRandomTabIndex(groups, groupId)
    );
  },
  async (groups) =>{
    if (!groups.length) return;
    let groupId = TestManager.getRandomGroupId(groups);
    await Controller.onTabClose({
      groupId: groupId,
      tabIndex: TestManager.getRandomTabIndex(groups, groupId),
    })
  },
  async (groups) =>{
    if (!groups.length) return;
    let groupId = TestManager.getRandomGroupId(groups);
    await Controller.onTabChangePin({
      groupId: groupId,
      tabIndex: TestManager.getRandomTabIndex(groups, groupId),
    })
  },
  // GROUP CHANGE
  async (groups) =>{
    if (!groups.length) return;
    await Controller.onGroupRemove({
      groupId: TestManager.getRandomGroupId(groups),
      taskRef: TaskManager.FORCE,
    })
  },
  async (groups) =>{
    let tabs = [];
    for(let i=0; i<TestManager.getRandom(1,15); i++) {
      tabs.push(Session.getRandomNormalTab());
    }
    GroupManager.addGroupWithTab(
      tabs, {
        title: Date.now().toString()
    });
  },
  async (groups) =>{
    if (!groups.length) return;
    await Controller.onGroupRename({
      groupId: TestManager.getRandomGroupId(groups),
      title: Date.now().toString(),
    });
  },
]

TestManager.changeGroups = async function(
  groups=GroupManager.groups,
  actionIndex=TestManager.getRandomAction())
{
  await ACTIONS[actionIndex](groups);
}
