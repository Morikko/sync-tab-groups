var TabAlive = TabAlive || {};

TabAlive.WINDOW_ID = WINDOW_ID_NONE;



TabAlive.init = async function(){
  if ( OptionManager.options.groups.closingState === OptionManager.CLOSE_ALIVE) {
    await TabAlive.start();
  } else {
    await TabAlive.stop();
  }
}

// TODO
TabAlive.start = async function() {
  if ( await Utils.windowExists(TabAlive.WINDOW_ID) ) {
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
  if ( await Utils.windowExists(TabAlive.WINDOW_ID) ) {
      await browser.windows.remove(TabAlive.WINDOW_ID);
  }
}

// TODO
TabAlive.createWindow = async function(){
  TabAlive.WINDOW_ID = await browser.windows.create({
    state: "minimized",
  });
}

// TODO
TabAlive.keepWindowOpened = async function(windowId){

}

// TODO
TabAlive.sleepTab = async function(groupId, tabIndex) {
  // Get tab

  // Move

  // Update Id

}

TabAlive.containTab = async function(groupId, tabIndex) {
  // Search tabId

}

// TODO
TabAlive.wakeupTab = async function(groupId, tabIndex) {
  // Move back

  // Update Id

}
