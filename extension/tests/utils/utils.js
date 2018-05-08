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
 - clearWindow
 - openWindow

*/

/**
 Put the window on the left of the screen
 If TestManager.DOUBLE_MONITORS is true, the screen is not the first one but the second one (the one the more on the right)
**/
var TestManager = TestManager || {};

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
    LogManager.error(e, {arguments}, {logs: null});
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
    LogManager.error(e, {arguments}, {logs: null});
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
    LogManager.error(e, {arguments}, {logs: null});
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


/**
 * @param {Number} start
 * @param {Number} end
 * @return {Number} - random number btw start and end included
 */
TestManager.getRandom = function (start, end){
  return Math.floor((Math.random() * (end+1-start)) + start);
}

TestManager.getRandomIndex = function (
  tabs, inPlace=true, pinned=false
){
  return TestManager.getRandom(
    pinned?0:tabs.filter(tab=>tab.pinned).length,
    pinned?(tabs.filter(tab=>tab.pinned).length)-inPlace:(tabs.length)-inPlace
  );
};


TestManager.waitAllTabsToBeLoadedInWindowId = async function ( windowId ) {
  let WAIT_SECOND=10, LIMIT =WAIT_SECOND*2;
  let i;
  while( await hasLoadingTabs(windowId) ) {

    await Utils.wait(500);
    i++;

    // Waited too much
    if (i === LIMIT) {
      LogManager.warning("TestManager.waitAllTabsToBeLoadedInWindowId: Waited too much...");
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

TestManager.waitWindowToBeFocused = async function(windowId, {
  maxLoop=20,
  waitPerLoop=50 //ms
}={}){
  for (let i = 0; i < maxLoop; i++) {
    if ( (await browser.windows.get(windowId)).focused ) {
      break;
    }
    await Utils.wait(waitPerLoop);
  }
}

TestManager.waitWindowToBeClosed = async function(windowId, {
  maxLoop=20,
  waitPerLoop=50 //ms
}={}){
  for (let i = 0; i < maxLoop; i++) {
    if ( (await browser.windows.getAll())
            .filter(w=>w.id===windowId) === 0 ) {
      break;
    }
    await Utils.wait(waitPerLoop);
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

TestManager.openWindow = async function({
  focused=true,
  url=null,
  split=true,
}={}) {
  const w = await browser.windows.create({
    url,
  });
  if (split)  {
    await TestManager.splitOnHalfScreen(w.id);
  }
  await browser.windows.update(w.id,{
    focused
  });
  return w.id;
}

TestManager.openTwoWindows = async function({
  focused=true,
  url=null,
  split=true,
}={}) {
  let windowId, windowId_bis;
  windowId = await TestManager.openWindow({
    focused,
    url,
    split,
  });
  TestManager.splitOnHalfTopScreen(windowId);

  windowId_bis = await TestManager.openWindow({
    focused,
    url,
    split,
  });
  TestManager.splitOnHalfBottomScreen(windowId_bis);

  return [windowId, windowId_bis];
}

TestManager.focusedWindow = async function (windowId){
  await browser.windows.update(windowId,{
    focused: true,
  });
  await TestManager.waitWindowToBeFocused(windowId);
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
        LogManager.error(e, {arguments}, {logs: null});
      }
    }
  }
}

TestManager.getRandomGroupId = function(groups) {
  let index = TestManager.getRandom(0, groups.length-1);

  if (!groups[index]) {
    LogManager.warning("Index not found: " + index, null, {logs: null});
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
    await Background.onGroupChangePosition({
      groupId: TestManager.getRandomGroupId(groups),
      position: TestManager.getRandomGroupPosition(groups),
    })
  },
  async (groups) =>{
    if (!groups.length) return;
    let sourceGroupId = TestManager.getRandomGroupId(groups);
    let targetGroupId = TestManager.getRandomGroupId(groups);
    await Background.onMoveTabToGroup({
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
      Session.getFakeTab(),
      TestManager.getRandomTabIndex(groups, groupId)
    );
  },
  async (groups) =>{
    if (!groups.length) return;
    let groupId = TestManager.getRandomGroupId(groups);
    await Background.onTabClose({
      groupId: groupId,
      tabIndex: TestManager.getRandomTabIndex(groups, groupId),
    })
  },
  async (groups) =>{
    if (!groups.length) return;
    let groupId = TestManager.getRandomGroupId(groups);
    await Background.onTabChangePin({
      groupId: groupId,
      tabIndex: TestManager.getRandomTabIndex(groups, groupId),
    })
  },
  // GROUP CHANGE
  async (groups) =>{
    if (!groups.length) return;
    await Background.onGroupRemove({
      groupId: TestManager.getRandomGroupId(groups),
      taskRef: TaskManager.FORCE,
    })
  },
  async (groups) =>{
    let tabs = [];
    for(let i=0; i<TestManager.getRandom(1,15); i++) {
      tabs.push(Session.getFakeTab());
    }
    GroupManager.addGroupWithTab(
      tabs, {
        title: Date.now().toString()
    });
  },
  async (groups) =>{
    if (!groups.length) return;
    await Background.onGroupRename({
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


TestManager.clearWindow = async function(windowId){
  // Clear the window
  await TabManager.removeTabsInWindow(
    windowId,{
      openBlankTab: true,
      remove_pinned: true,
    });
  await TestManager.waitAllTabsToBeLoadedInWindowId(windowId);
}
