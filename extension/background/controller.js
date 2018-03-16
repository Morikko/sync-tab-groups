/**
 * Entry Point of the Extension
 * Init the Data -> Events
 * Manage the messages with all the extensive parts of the Extension

 Sender:
 - refreshOptionsUI
 - refreshUi

 Receiver:
 - onOpenGroupInNewWindow
 - onGroupAdd
 - onGroupAddWithTab
 - onGroupClose
 - onGroupRemove
 - onGroupRename
 - onGroupSelect
 - onTabSelect
 - onMoveTabToGroup
 - onBookmarkSave
 - onOpenSettings
 - changeSynchronizationStateOfWindow
 - onTabClose
 - onTabOpen
 - onImportGroups
 - onExportGroups
 - onGroupChangePosition
 - onTabChangePin
 - onChangeExpand

 - init
 */

TaskManager.fromUI = {
  [TaskManager.CLOSE_REFERENCE]: new TaskManager.DelayedTask(),
  [TaskManager.REMOVE_REFERENCE]: new TaskManager.DelayedTask()
}

/**
 * Only read groups data, never write directly
 */
var Controller = Controller || {};
Controller.updateNotificationId = "UPDATE_NOTIFICATION";

Controller.init = async function() {
  await OptionManager.init();
  await GroupManager.init();

  Controller.initDataEventListener();
  Controller.initTabsEventListener();
  Controller.initWindowsEventListener();
  Controller.initCommandsEventListener();

  browser.runtime.onMessage.addListener(Controller.popupMessenger);
  browser.runtime.onMessage.addListener(Controller.optionMessenger);
  browser.runtime.onMessage.addListener((message)=>{
    if (Utils.UTILS_SHOW_MESSAGES) {
      console.log(message);
    }
  });

  StorageManager.Backup.init();

  Utils.setBrowserActionIcon(OptionManager.options.popup.whiteTheme);

  Controller.prepareExtensionForUpdate(
    Controller.lastVersion,
    (browser.runtime.getManifest()).version);

  Controller.refreshUi();
  Controller.refreshOptionsUI();

  Controller.install = false;
};

Controller.refreshOptionsUI = function() {
  Utils.sendMessage("Option:Changed", {
    options: OptionManager.options,
  });
};

Controller.refreshBackupListUI = async function() {
  Utils.sendMessage("BackupList:Changed", {
    backupList: await StorageManager.Local.getBackUpList(),
  });
};

Controller.refreshUi = function() {
  Utils.sendMessage("Groups:Changed", {
    groups: GroupManager.groups,
    delayedTasks: TaskManager.fromUI
  });
};

Controller.onOpenGroupInNewWindow = function({groupId}) {
  WindowManager.selectGroup(groupId, {newWindow: true});
};

Controller.onOpenGuide = function() {
  Utils.openUrlOncePerWindow(
    "https://morikko.github.io/synctabgroups/#guide"
  );
}

Controller.onGroupAdd = function({title}) {
  try {
    GroupManager.addGroup({title: title});
  } catch (e) {
    console.error("Controller - onGroupAdd failed: " + e);
  }
};

Controller.onGroupAddWithTab = function({
  title,
  sourceGroupId,
  tabIndex,
}) {
  TabManager.moveTabToNewGroup(
    sourceGroupId,
    tabIndex,
    title,
  );
};

Controller.onGroupClose = function({
  groupId,
  taskRef
}) {
  var delayedFunction = async () => {
    try {
      await WindowManager.closeGroup(
        groupId,
        {close_window: false}
      );
      Controller.refreshUi();
      return "Controller.onGroupClose done!";
    } catch (e) {
      let msg = "Controller.onGroupClose failed; " + e;
      console.error(msg);
      return msg;
    }
  };

  TaskManager.fromUI[TaskManager.CLOSE_REFERENCE].manage(
    taskRef,
    delayedFunction,
    groupId,
  );
};

Controller.onGroupRemove = async function({
  groupId,
  taskRef
}) {
  return new Promise((resolve, reject)=>{
    let delayedFunction = async () => {
      await WindowManager.removeGroup(
        groupId
      );
      resolve();
    };

    TaskManager.fromUI[TaskManager.REMOVE_REFERENCE].manage(
      taskRef,
      delayedFunction,
      groupId,
    );
  })
};

Controller.onGroupRename = function({
  groupId,
  title
}) {
  GroupManager.renameGroup(
    GroupManager.getGroupIndexFromGroupId(groupId),
    title
  );
};

Controller.onGroupSelect = function({groupId}) {
  WindowManager.selectGroup(
    groupId,
    {newWindow: false}
  );
};

Controller.onTabSelect = function({
  tabIndex,
  groupId,
  newWindow,
}) {
  TabManager.selectTab(
    tabIndex,
    groupId,
    newWindow,
  );
};

Controller.onMoveTabToGroup = async function({
  sourceGroupId,
  sourceTabIndex,
  targetGroupId,
  targetTabIndex,
}) {
  await TabManager.moveTabBetweenGroups(
    sourceGroupId,
    sourceTabIndex,
    targetGroupId,
    targetTabIndex,
  );
};

Controller.onBookmarkSave = function() {
  StorageManager.Bookmark.backUp(GroupManager.getCopy(), true);
};

Controller.onOpenSettings = function(active=true) {
  Utils.openUrlOncePerWindow(browser.extension.getURL(
    "/optionpages/option-page.html"
  ), active);
};

Controller.onRemoveAllGroups = function() {
  GroupManager.removeAllGroups();
};

Controller.onReloadGroups = function() {
  GroupManager.reloadGroupsFromDisk();
};

Controller.changeSynchronizationStateOfWindow = function({
  isSync,
  windowId
}) {
  if (isSync) {
    WindowManager.integrateWindow(windowId, {even_new_one: true});
  } else {
    try {
      let currentGroupId = GroupManager.getGroupIdInWindow(
        windowId
      );
      GroupManager.removeGroupFromId(currentGroupId);
    } catch (e) {
      let msg = "synchronizeWindowManager failed; " + e;
      console.error(msg);
      return msg;
    }
  }
};

Controller.onTabClose = async function({
  groupId,
  tabIndex,
}) {
  try {
    await GroupManager.removeTabFromIndexInGroupId(
      groupId,
      tabIndex
    );
  } catch (e) {
    let msg = "Controller.onTabClose failed; " + e;
    console.error(msg);
    return msg;
  }
};

Controller.onTabOpen = async function({
  tab,
}) {
  try {
    const currentWindow = await browser.windows.getLastFocused();
    await TabManager.openListOfTabs(
      [tab],
      currentWindow.id, {
        inLastPos: true,
    })
  } catch (e) {
    let msg = "Controller.onTabOpen failed; " + e;
    console.error(msg);
    return msg;
  }
};

Controller.onImportGroups = function({
  content_file
}) {
  try {
    let groups = StorageManager.File.importGroupsFromFile(content_file);
    GroupManager.addGroups(groups, {
      showNotification: true,
    });
  } catch (e) {
    console.error(e);
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": "Import Groups failed",
      "message": e.message,
      "eventTime": 4000,
    });
  }
};

Controller.onExportGroups = function() {
  StorageManager.File.exportGroups(GroupManager.getCopy());
};

Controller.onExportBackUp = async function(id) {
  let groups = await StorageManager.Local.getBackUp(id);
  if ( groups ) {
    StorageManager.File.exportGroups(groups);
  } else {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": "Import Back Up Groups",
      "message": "Back up is empty, no group to import.",
      "eventTime": 4000,
    });
  }
};

Controller.onImportBackUp = async function(id) {
  let groups = await StorageManager.Local.getBackUp(id);
  if ( groups ) {
    GroupManager.addGroups(groups, {
      showNotification: true,
    });
  } else {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": "Import Back Up Groups",
      "message": "Back up is empty, no group to import.",
      "eventTime": 4000,
    });
  }
};

Controller.onRemoveBackUp = async function(ids) {
  await StorageManager.Local.removeBackup(ids);
};

Controller.onGroupChangePosition = async function({
  groupId,
  position,
}) {
  await GroupManager.changeGroupPosition(
    groupId,
    position
  );
};

Controller.onTabChangePin = async function({
  groupId,
  tabIndex,
}) {
  await TabManager.changePinState(
    groupId,
    tabIndex,
  );
};

Controller.onChangeExpand = function({
  groupId,
  expand,
}) {
  GroupManager.changeExpandState(
    groupId,
    expand,
  );
};

// START of the extension
Controller.init();

// Event from: popup
Controller.popupMessenger = function(message) {
  switch (message.task) {
    case "Group:Add":
      Controller.onGroupAdd(message.params);
      break;
    case "Group:AddWithTab":
      Controller.onGroupAddWithTab(message.params);
      break;
    case "Group:Close":
      Controller.onGroupClose(message.params);
      break;
    case "Group:ChangePosition":
      Controller.onGroupChangePosition(message.params);
      break;
    case "Group:Remove":
      Controller.onGroupRemove(message.params);
      break;
    case "Group:Rename":
      Controller.onGroupRename(message.params);
      break;
    case "Group:Select":
      Controller.onGroupSelect(message.params);
      break;
    case "Group:MoveTab":
      Controller.onMoveTabToGroup(message.params);
      break;
    case "Tab:Select":
      Controller.onTabSelect(message.params);
      break;
    case "Group:OpenGroupInNewWindow":
      Controller.onOpenGroupInNewWindow(message.params);
      break;
    case "Data:Ask":
      Controller.refreshUi();
      Controller.refreshOptionsUI();
      break;
    case "App:OpenSettings":
      Controller.onOpenSettings();
      break;
    case "Window:Sync":
      Controller.changeSynchronizationStateOfWindow(message.params);
      break;
    case "Tab:Open":
      Controller.onTabOpen(message.params);
      break;
    case "Tab:Close":
      Controller.onTabClose(message.params);
      break;
    case "Tab:ChangePin":
      Controller.onTabChangePin(message.params);
      break;
    case "Group:Expand":
      Controller.onChangeExpand(message.params);
      break;
  }
}

// Event from: option
Controller.optionMessenger = function(message) {
  switch (message.task) {
    case "Option:Ask":
      Controller.refreshOptionsUI();
      break;
    case "BackupList:Ask":
      Controller.refreshBackupListUI();
      break;
    case "Option:Change":
      OptionManager.updateOption(message.params.optionName, message.params.optionValue);
      Controller.refreshOptionsUI();
      break;
    case "Option:BackUp":
      Controller.onBookmarkSave();
      break;
    case "Option:Import":
      Controller.onImportGroups(message.params);
      Controller.refreshUi();
      break;
    case "Option:Export":
      Controller.onExportGroups();
      break;
    case "Option:DeleteAllGroups":
      Controller.onRemoveAllGroups();
      break;
    case "Option:ReloadGroups":
      Controller.onReloadGroups();
      break;
    case "Option:OpenGuide":
      Controller.onOpenGuide();
      break;
    case "Option:UndiscardLazyTabs":
      Controller.undiscardAll();
      break;
    case "Option:RemoveBackUp":
      Controller.onRemoveBackUp(message.params.id);
    break;
    case "Option:ImportBackUp" :
      Controller.onImportBackUp(message.params.id);
      break;
    case "Option:ExportBackUp" :
      Controller.onExportBackUp(message.params.id);
      break;
  }
}




/**** Update *****/
Controller.initDataEventListener = function() {
  GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
    () => {
      Controller.refreshUi();
    }
  );
  OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
    () => {
      Controller.refreshOptionsUI();
    }
  );
  StorageManager.Local.eventlistener.on(StorageManager.Local.BACKUP_CHANGE,
    ()=>{
        Controller.refreshBackupListUI();
    }
  );
}


/**** Event about tabs *****/
Controller.initTabsEventListener = function() {
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    // Necessary for Chrome, this event is fired before the onRemovedWindow event
    // Else the group is finally updated with empty tabs.
    setTimeout(() => {
      TabManager.updateTabsInGroup(activeInfo.windowId);
    }, 300);
  });
  browser.tabs.onCreated.addListener((tab) => {
    TabManager.updateTabsInGroup(tab.windowId);
  });
  browser.tabs.onRemoved.addListener((tabId, removeInfo) => {
    /* Bug: onRemoved is fired before the tab is really close
     * Workaround: keep a delay
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
     */
    setTimeout(() => {
      if ( !removeInfo.isWindowClosing ) {
        TabManager.updateTabsInGroup(removeInfo.windowId);
      }
    }, 300);
  });
  browser.tabs.onMoved.addListener((tabId, moveInfo) => {
    TabManager.updateTabsInGroup(moveInfo.windowId);
  });
  browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    TabManager.updateTabsInGroup(tab.windowId);
  });
  browser.tabs.onAttached.addListener((tabId, attachInfo) => {
    TabManager.updateTabsInGroup(attachInfo.newWindowId);
  });
  browser.tabs.onDetached.addListener((tabId, detachInfo) => {
    TabManager.updateTabsInGroup(detachInfo.oldWindowId);
  });
}


/**** Event about windows *****/
Controller.initWindowsEventListener = function() {
  browser.windows.onCreated.addListener((window) => {
    if ( !OptionManager.options.privateWindow.sync
          && window.incognito) {
              return; // Don't lose time
    }

    // Let time for opening well and be sure it is a new one
    setTimeout(() => {
      if ( !WindowManager.WINDOW_EXCLUDED[window.id] ) {
        WindowManager.integrateWindow(window.id);
      }
    }, 300); // Below 400, it can fail
  });

  browser.windows.onRemoved.addListener((windowId) => {
    WindowManager.WINDOW_CURRENTLY_CLOSING[windowId] = true;

    setTimeout(()=>{
      delete WindowManager.WINDOW_CURRENTLY_CLOSING[windowId];
    }, 5000);

    GroupManager.detachWindow(windowId);
  });
  /* TODO: doenst update context menu well if right click on a tab from another window
   */
  browser.windows.onFocusChanged.addListener(async (windowId) => {
    Controller.refreshUi();

    try {
      const w = await browser.windows.getLastFocused();
      await ContextMenu.updateMoveFocus(w.id);

      let groupId = GroupManager.getGroupIdInWindow(windowId, {error: false});
      if (groupId >= 0) { // Only grouped window
        GroupManager.setLastAccessed(groupId, Date.now());
      }
    } catch (e) {
      let msg = "onFocusChanged.listener failed; " + e;
      console.error(msg);
      return msg;
    }
  });
}

Controller.initCommandsEventListener = function() {
  // Commands
  browser.commands.onCommand.addListener(async function(command) {
    try {
      if (!OptionManager.options.shortcuts.allowGlobal) { // disable by user
        return "";
      }
      switch (command) {
        case "swtich_next_group":
          WindowManager.selectNextGroup();
          break;
        case "swtich_previous_group":
          WindowManager.selectNextGroup({
            direction: -1,
          });
          break;
        case "create_group_swtich":
          let newGroupId = GroupManager.addGroup();
          WindowManager.selectGroup(newGroupId);
          break;
        case "focus_next_group":
          WindowManager.selectNextGroup({
            open: true,
          });
          break;
        case "focus_previous_group":
          WindowManager.selectNextGroup({
            direction: -1,
            open: true,
          });
          break;
        case "remove_group_swtich":
          await WindowManager.removeGroup();
          //WindowManager.selectNextGroup();
          break;
        default:
      }
    } catch (e) {
      let msg = "Commands.listener failed on " + command + " " + e;
      console.error(msg);
      return msg;
    }
  });
};

browser.runtime.onInstalled.addListener((details) => {
  // Only when the extension is installed for the first time
  if ( details.reason === "install" ) {
    Controller.install = true;
    Controller.onOpenSettings(false);
  }

  // Development mode detection
  if( (!Utils.isChrome() && details.temporary)  // FF
      || (Utils.isChrome() && details.reason === "update" && (browser.runtime.getManifest()).version === details.previousVersion)) { // Chrome
    Utils.openUrlOncePerWindow(
      browser.extension.getURL("/tests/test-page/test-page.html"),
      false,
    );
  }

  // Extension update detection
  if ( details.reason === "update"
      && (browser.runtime.getManifest()).version !== details.previousVersion ) {
    Controller.lastVersion = details.previousVersion;
    // Focus Settings if click on notification
    browser.notifications.onClicked.addListener((notificationId)=>{
      if ( notificationId === Controller.updateNotificationId ) {
        Controller.onOpenSettings(true);
      }
    });
    // Generic message
    browser.notifications.create(Controller.updateNotificationId, {
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": browser.i18n.getMessage("notification_update_title") + " " + browser.runtime.getManifest().version,
      "message": browser.i18n.getMessage("notification_update_message"),
    });
  }
});

if (Utils.isChrome()) {
  browser.runtime.onUpdateAvailable.addListener(Controller.undiscardAll);
}

Controller.isVersionBelow = function(version, reference) {
  let splitVersion = version.split('.').map(n => parseInt(n,10)),
      splitReference = reference.split('.').map(n => parseInt(n,10));

  if ( splitVersion[0] < splitReference[0] ) {
    return true;
  }
  if ( splitVersion[0] > splitReference[0] ) {
    return false;
  }

  if ( splitVersion[1] < splitReference[1] ) {
    return true;
  }
  if ( splitVersion[1] > splitReference[1] ) {
    return false;
  }

  if ( splitVersion[2] < splitReference[2] ) {
    return true;
  }
  if ( splitVersion[2] > splitReference[2] ) {
    return false;
  }
  // Equal
  return true;
}

/**
 * Recpect order version increasing
 */
Controller.prepareExtensionForUpdate = function(lastVersion, newVersion) {
  if ( !lastVersion ) {
    return;
  }

  if (isVersionBelow(lastVersion, "0.6.2")
        && !isVersionBelow(newVersion, "0.6.2") ){
    Controller.updateFromBelow_0_6_2();
  }
}

Controller.updateFromBelow_0_6_2 = function (options=OptionManager.options) {
  // Move OptionManager.options.backup -> OptionManager.options.backup.download
  if (options.hasOwnProperty("backup")){
    if ( !options.backup.hasOwnProperty("download") ) {
      options.backup.download = {};
    }
    if ( options.backup.hasOwnProperty("enable")) {
        options.backup.download["enable"] = options.backup.enable;
        delete options.backup.enable;
    }
    if ( options.backup.hasOwnProperty("time")) {
        options.backup.download["time"] = options.backup.time;
        delete options.backup.time;
    }
  }
}

/**
 * WARNING: this funtion is not working well on firefox
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1420681
 * Any tab with a beforeunload event set will not be discardable...
 */
Controller.undiscardAll = async function (globalCount = 0, callbackAfterFirstUndiscard=undefined) {
  return new Promise(async function(resolve, reject){
    let queue = Promise.resolve();

    let hadDiscarded = false;

    //console.log("Clean: " + globalCount);
    let tabs = await browser.tabs.query({});
    tabs.forEach(async (tab)=>{
      queue = queue.then(async function(){
        //console.log(tab.url)
        if( tab.url.includes(Utils.LAZY_PAGE_URL)) {
          hadDiscarded = true;

          try {
            // Change
            await browser.tabs.update(tab.id, {
              url: Utils.extractTabUrl(tab.url)
            });
            //console.log("Update tab: " + tab.id);
            if ( callbackAfterFirstUndiscard ) { // For tests purpose
              callbackAfterFirstUndiscard();
              callbackAfterFirstUndiscard = undefined;
            }
            await Utils.wait(300);
            // Wait full loading
            let count = 0;
            while( ((await browser.tabs.get(tab.id)).status === "loading")
                && count < 30 ) { // Wait max ~ 10s
              await Utils.wait(300);
              count++;
            }

            // Discard but Check active (due to loading waiting)
            if ( (await browser.tabs.get(tab.id)).status === "complete") {
              await browser.tabs.discard(tab.id);
            }

          } catch ( e ) { // Tab has changed (closed, moved, actived...)
            // Do nothing but avoid a crash
            //console.log("Error in Controller.undiscardAll: " + e)
          }

        }
        return;
        })
    });

    queue.then(function(lastResponse){
      if ( hadDiscarded
        && globalCount < 10 ) {
        resolve(Controller.undiscardAll(++globalCount));
      } else {
        //browser.runtime.reload();
        resolve();
        //console.log("Done!");
      }
    });
  });
}
