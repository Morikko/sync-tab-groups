// TODO: legacy ??
var TabAlive = TabAlive || {};

TabAlive.WINDOW_ID = browser.windows.WINDOW_ID_NONE;

TabAlive.init = async function() {
  if (OptionManager.options.groups.closingState === OptionManager.CLOSE_ALIVE) {
    await TabAlive.start();
  } else {
    await TabAlive.stop();
  }
}

// TODO
TabAlive.start = async function() {
  if (await Utils.windowExists(TabAlive.WINDOW_ID)) {
    return;
  }
  // How to find the window back

  // Create new one
  await TabAlive.createWindow();

  // Check windows close
  browser.windows.onRemoved.addListener(TabAlive.keepWindowOpened);
}

// TODO
TabAlive.stop = async function() {
  // ...
  browser.windows.onRemoved.removeListener(TabAlive.keepWindowOpened);

  // Close the window
  if (await Utils.windowExists(TabAlive.WINDOW_ID)) {
    await browser.windows.remove(TabAlive.WINDOW_ID);
  }
}

// TODO
TabAlive.createWindow = async function() {
  let newWindow = await browser.windows.create({
    state: "minimized",
  });

  TabAlive.WINDOW_ID = newWindow.id;
}

// TODO
TabAlive.keepWindowOpened = async function(windowId) {

}

// TODO
TabAlive.sleepTab = async function(tabId) {
  await TabAlive.start();

  // Move
  let newTab = await browser.tabs.move(tabId, {
    windowId: TabAlive.WINDOW_ID,
    index: -1,
  });

  if (newTab.length) {
    newTab = newTab[0];
  }

  let groupId = GroupManager.getGroupIdFromTabId(tabId);
  let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);

  GroupManager.groups[groupIndex].tabs.forEach((tabInGroup)=>{
    if (tabInGroup.id === tabId) {
      tabInGroup.id = newTab.id;
    }
  });
}

TabAlive.containTab = async function(tab) {
  // Search tabId
  try {
    let fetchedTab = await browser.tabs.get(tab.id);
    if (fetchedTab.windowId === TabAlive.WINDOW_ID) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

// TODO
TabAlive.wakeupTab = async function(tab, targetWindowId, targetIndex) {
  // Move back
  let newTab = await browser.tabs.move(tab.id, {
    windowId: targetWindowId,
    index: targetIndex,
  });

  if (newTab.length) {
    newTab = newTab[0];
  }

  let groupId = GroupManager.getGroupIdFromTabId(tab.id);
  let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);

  GroupManager.groups[groupIndex].tabs.forEach((tabInGroup)=>{
    if (tabInGroup.id === tab.id) {
      tabInGroup.id = newTab.id;
    }
  });

  return newTab;
}
