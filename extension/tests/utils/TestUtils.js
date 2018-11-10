/**
 Put the window on the left of the screen
 If TestManager.DOUBLE_MONITORS is true, the screen is not the first one but the second one (the one the more on the right)
**/
import Utils from '../../background/utils/utils'
import Session from '../examples/session'
import TASKMANAGER_CONSTANTS from '../../background/utils/TASKMANAGER_CONSTANTS'

const TestUtils = {};

TestUtils.splitOnHalfScreen = async function(windowId) {
  try {
    return browser.windows.update(windowId, {
      left: TestUtils.DOUBLE_MONITORS?window.screen.width:0,
      top: 3,
      width: Math.round(window.screen.width/2),
      height: window.screen.height,
      state: "normal",
    });
  } catch (e) {
    window.Background.LogManager.error(e, {args: arguments}, {logs: null});
  }
}

TestUtils.splitOnHalfTopScreen = async function(windowId) {
  try {
    return browser.windows.update(windowId, {
      left: TestUtils.DOUBLE_MONITORS?window.screen.width:0,
      top: 1,
      width: Math.round(window.screen.width/2),
      height: Math.round(screen.width/2),
    });
  } catch (e) {
    window.Background.LogManager.error(e, {args: arguments}, {logs: null});
  }
}

TestUtils.splitOnHalfBottomScreen = async function(windowId) {
  try {
    return browser.windows.update(windowId, {
      left: TestUtils.DOUBLE_MONITORS?window.screen.width:0,
      top: Math.round(screen.width/2),
      width: Math.round(window.screen.width/2),
      height: Math.round(screen.width/2),
    });
  } catch (e) {
    window.Background.LogManager.error(e, {args: arguments}, {logs: null});
  }
}

/**
 * DEPRECATED
 * Get group from the previous test structure when an object kept a ref on the group Indexes
 * Use TestManager.getGroup instead, more general, more robust
 */
TestUtils.getGroupDeprecated = (groups, id)=>{
  return window.Background.GroupManager.groups[groups[id].groupIndex];
};

TestUtils.getGroup = (groups, id)=>{
  let index = window.Background.GroupManager.getGroupIndexFromGroupId(id, {
    error: true,
    groups: groups,
  });
  return groups[index];
};

TestUtils.countDiscardedTabs = function(tabs) {
  return tabs.filter((tab)=>{
    if (tab.discarded || tab.url.includes(Utils.LAZY_PAGE_URL)) {
      return true;
    }
    return false;
  }).length;
}

TestUtils.setActiveProperties = function(tabs, tabIndex) {
  tabs.forEach((tab, index)=>{
    if (tabIndex === index) {
      tab.active = true;
    } else {
      tab.active = false;
    }
  });
}

/**
 * Set all active states to false
 */
TestUtils.resetActiveProperties = function(tabs) {
  tabs.forEach((tab)=>{
    tab.active = false;
  });
}

/**
 * Set all index states with the value of the index in the array (start from 0)
 */
TestUtils.resetIndexProperties = function(tabs) {
  tabs.forEach((tab, index)=>{
    tab.index = index;
  });
}


/**
 * @param {number} start
 * @param {number} end
 * @returns {number} - random number btw start and end included
 */
TestUtils.getRandom = function(start, end) {
  return Math.floor((Math.random() * (end+1-start)) + start);
}

TestUtils.getRandomIndex = function(
  tabs, inPlace=true, pinned=false
) {
  return TestUtils.getRandom(
    pinned?0:tabs.filter(tab=>tab.pinned).length,
    pinned?(tabs.filter(tab=>tab.pinned).length)-inPlace:(tabs.length)-inPlace
  );
};

async function hasLoadingTabs(windowId) {
  // Get all tabs
  let tabs = await window.Background.TabManager.getTabsInWindowId(windowId, {
    withPinned: true,
  });
  return tabs.filter(tab => tab.status === "loading").length > 0;
}

TestUtils.waitAllTabsToBeLoadedInWindowId = async function(windowId) {

  let WAIT_SECOND=10, LIMIT =WAIT_SECOND*2;
  let i;
  while (await hasLoadingTabs(windowId)) {

    await Utils.wait(500);
    i++;

    // Waited too much
    if (i === LIMIT) {
      window.Background.LogManager.warning("TestManager.waitAllTabsToBeLoadedInWindowId: Waited too much...");
      break;
    }
  }
}

TestUtils.waitWindowToBeFocused = async function(windowId, {
  maxLoop=20,
  waitPerLoop=50, //ms
}={}) {
  for (let i = 0; i < maxLoop; i++) {
    if ((await browser.windows.get(windowId)).focused) {
      break;
    }
    await Utils.wait(waitPerLoop);
  }
}

TestUtils.waitWindowToBeClosed = async function(windowId, {
  maxLoop=20,
  waitPerLoop=50, //ms
}={}) {
  for (let i = 0; i < maxLoop; i++) {
    if ((await browser.windows.getAll())
      .filter(w=>w.id===windowId) === 0) {
      break;
    }
    await Utils.wait(waitPerLoop);
  }
}

/**
 * Close all windows
 * Accept one id or an array
 */
TestUtils.closeWindows = async function(windowIds) {
  if (!Array.isArray(windowIds)) {
    windowIds = [windowIds]
  }

  for (let windowId of windowIds) {
    if (windowId >= 0) {
      try {
        await browser.windows.remove(windowId);
      } catch (e) {
        // Window might not exist...
      }
    }
  }
}

/**
 * @returns {Integer} windowId
 */
TestUtils.openWindow = async function({
  focused=true,
  url=null,
  split=true,
}={}) {
  const w = await browser.windows.create({
    url,
  });
  if (split)  {
    await TestUtils.splitOnHalfScreen(w.id);
  }
  await browser.windows.update(w.id,{
    focused,
  });
  return w.id;
}

TestUtils.openTwoWindows = async function({
  focused=true,
  url=null,
  split=true,
}={}) {
  let windowId, windowId_bis;
  windowId = await TestUtils.openWindow({
    focused,
    url,
    split,
  });
  TestUtils.splitOnHalfTopScreen(windowId);

  windowId_bis = await TestUtils.openWindow({
    focused,
    url,
    split,
  });
  TestUtils.splitOnHalfBottomScreen(windowId_bis);

  return [windowId, windowId_bis];
}

TestUtils.focusedWindow = async function(windowId) {
  await browser.windows.update(windowId,{
    focused: true,
  });
  await TestUtils.waitWindowToBeFocused(windowId);
}


// Remove groups
TestUtils.removeGroups = async function(groupIds) {
  if (!groupIds.length) {
    groupIds = [groupIds]
  }

  for (let groupId of groupIds) {
    if (window.Background.GroupManager.getGroupIndexFromGroupId(groupId, {error: false}) >= 0) {
      try {
        await window.Background.GroupManager.removeGroupFromId(groupId);
      } catch (e) {
        window.Background.LogManager.error(e, {args: arguments}, {logs: null});
      }
    }
  }
}

TestUtils.getRandomGroupId = function(groups) {
  let index = TestUtils.getRandom(0, groups.length-1);

  if (!groups[index]) {
    window.Background.LogManager.warning("Index not found: " + index, null, {logs: null});
  }
  return groups[
    index
  ].id;
}

TestUtils.getRandomTabIndex = function(
  groups,
  groupId=TestUtils.getRandomGroupId(groups)) {
  let groupIndex = window.Background.GroupManager.getGroupIndexFromGroupId(groupId, {groups: groups});
  return TestUtils.getRandom(0, groups[groupIndex].tabs.length-1);
}

TestUtils.getRandomGroupPosition = function(groups) {
  return groups[
    TestUtils.getRandom(0, groups.length-1)
  ].position;
}

const ACTIONS = [
  // MOVE
  async(groups) =>{
    if (!groups.length) return;
    await window.Background.BackgroundHelper.onGroupChangePosition({
      groupId: TestUtils.getRandomGroupId(groups),
      position: TestUtils.getRandomGroupPosition(groups),
    })
  },
  async(groups) =>{
    if (!groups.length) return;
    let sourceGroupId = TestUtils.getRandomGroupId(groups);
    let targetGroupId = TestUtils.getRandomGroupId(groups);
    await window.Background.BackgroundHelper.onMoveTabToGroup({
      sourceGroupId: sourceGroupId,
      sourceTabIndex: TestUtils.getRandomTabIndex(groups, sourceGroupId),
      targetGroupId: targetGroupId,
      targetTabIndex: TestUtils.getRandomTabIndex(groups, targetGroupId),
    })
  },
  // TAB CHANGE
  async(groups) =>{
    if (!groups.length) return;
    let groupId = TestUtils.getRandomGroupId(groups);
    await window.Background.GroupManager.addTabInGroupId(
      groupId,
      Session.getFakeTab(),
      TestUtils.getRandomTabIndex(groups, groupId)
    );
  },
  async(groups) =>{
    if (!groups.length) return;
    let groupId = TestUtils.getRandomGroupId(groups);
    await window.Background.BackgroundHelper.onTabClose({
      groupId: groupId,
      tabIndex: TestUtils.getRandomTabIndex(groups, groupId),
    })
  },
  async(groups) =>{
    if (!groups.length) return;
    let groupId = TestUtils.getRandomGroupId(groups);
    await window.Background.BackgroundHelper.onTabChangePin({
      groupId: groupId,
      tabIndex: TestUtils.getRandomTabIndex(groups, groupId),
    })
  },
  // GROUP CHANGE
  async(groups) =>{
    if (!groups.length) return;
    await window.Background.BackgroundHelper.onGroupRemove({
      groupId: TestUtils.getRandomGroupId(groups),
      taskRef: TASKMANAGER_CONSTANTS.FORCE,
    })
  },
  async(groups) =>{
    let tabs = [];
    for (let i=0; i<TestUtils.getRandom(1,15); i++) {
      tabs.push(Session.getFakeTab());
    }
    window.Background.GroupManager.addGroupWithTab(
      tabs, {
        title: Date.now().toString(),
      });
  },
  async(groups) =>{
    if (!groups.length) return;
    await window.Background.BackgroundHelper.onGroupRename({
      groupId: TestUtils.getRandomGroupId(groups),
      title: Date.now().toString(),
    });
  },
]

TestUtils.changeGroups = async function(
  groups=window.Background.GroupManager.groups,
  actionIndex=TestUtils.getRandomAction()) {
  await ACTIONS[actionIndex](groups);
}


TestUtils.clearWindow = async function(windowId) {
  // Clear the window
  const tabs = await browser.tabs.query({windowId});

  await browser.tabs.create({
    windowId,
    url: null,
  });

  await browser.tabs.remove(tabs.map(tab => tab.id));
  await TestUtils.waitAllTabsToBeLoadedInWindowId(windowId);
}

/**
 * Open {tabs} in Window with {windowId} and remove all the tabs that were in the window before
 */
TestUtils.replaceTabs = async function(windowId, tabs) {
  const tabsToOpen = tabs.map(tab => {
    const setVal = (from, val, to) => {
      if (from[val] !== undefined) {
        to[val] = from[val];
      }
    }
    const newTab = {};
    setVal(tab, "active", newTab);
    setVal(tab, "index", newTab);
    setVal(tab, "openerTabId", newTab);
    setVal(tab, "openInReaderMode", newTab);
    setVal(tab, "pinned", newTab);
    setVal(tab, "cookieStoreId", newTab);
    setVal(tab, "url", newTab);
    newTab["windowId"] = windowId;

    return newTab;
  });

  const oldTabs = await browser.tabs.query({windowId});
  const openTabs = await Promise.all(
    tabsToOpen.map(tab => browser.tabs.create(tab))
  );
  await browser.tabs.remove(oldTabs.map(tab => tab.id));

  return openTabs;
}

TestUtils.removeTabs = async function(ids) {
  await browser.tabs.remove(ids);
  await window.Background.TabManager.waitTabsToBeClosed(ids);
}

TestUtils.countHiddenTabsInGroups = (groups) => {
  return groups.reduce((acc, group) => {
    acc += group.tabs.reduce((acc, tab) => {
      if (tab.hidden) {
        acc++;
      }
      return acc;
    }, 0);
    return acc;
  }, 0);
}

export default TestUtils