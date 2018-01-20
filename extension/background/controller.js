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

Controller.init = async function() {
  await OptionManager.init();
  await GroupManager.init();

  Controller.initDataEventListener();
  Controller.initTabsEventListener();
  Controller.initWindowsEventListener();
  Controller.initCommandsEventListener();

  browser.runtime.onMessage.addListener(Controller.popupMessenger);
  browser.runtime.onMessage.addListener(Controller.optionMessenger);

  Utils.setBrowserActionIcon(OptionManager.options.popup.whiteTheme);
};

Controller.refreshOptionsUI = function() {
  Utils.sendMessage("Option:Changed", {
    options: OptionManager.options,
  });
};

Controller.refreshUi = function() {
  Utils.sendMessage("Groups:Changed", {
    groups: GroupManager.groups,
    delayedTasks: TaskManager.fromUI
  });
};

Controller.onOpenGroupInNewWindow = function(params) {
  WindowManager.openGroupInNewWindow(params.groupId);
};

Controller.onGroupAdd = function(params) {
  try {
    GroupManager.addGroup(params.title || '');
  } catch (e) {
    console.error("Controller - onGroupAdd failed: " + e);
  }
};

Controller.onGroupAddWithTab = function(params) {
  TabManager.moveTabToNewGroup(
    params.title || '',
    params.sourceGroupId,
    params.tabIndex
  );
};

Controller.onGroupClose = function(params) {
  var delayedFunction = async () => {
    try {
      await WindowManager.closeGroup(
        params.groupId,
        false
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
    params.taskRef,
    delayedFunction,
    params.groupId,
  );
};

Controller.onGroupRemove = function(params) {
  var delayedFunction = () => {
    WindowManager.removeGroup(
      params.groupId
    );
  };

  TaskManager.fromUI[TaskManager.REMOVE_REFERENCE].manage(
    params.taskRef,
    delayedFunction,
    params.groupId,
  );
};

Controller.onGroupRename = function(params) {
  GroupManager.renameGroup(
    GroupManager.getGroupIndexFromGroupId(params.groupId),
    params.title
  );
};

Controller.onGroupSelect = function(params) {
  WindowManager.selectGroup(
    params.groupId
  );
};

Controller.onTabSelect = function(params) {
  TabManager.selectTab(
    params.tabIndex,
    params.groupId
  );
};

Controller.onMoveTabToGroup = function(params) {
  TabManager.moveTabBetweenGroups(
    params.sourceGroupId,
    params.sourceTabIndex,
    params.targetGroupId,
    params.targetTabIndex,
  );
};

Controller.onBookmarkSave = function() {
  StorageManager.Bookmark.backUp(GroupManager.getCopy(), true);
};

Controller.onOpenSettings = function() {
  browser.runtime.openOptionsPage();
};

Controller.changeSynchronizationStateOfWindow = function(params) {
  if (params.isSync) {
    WindowManager.integrateWindow(params.windowId, true);
  } else {
    try {
      let currentGroupId = GroupManager.getGroupIdInWindow(
        params.windowId
      );
      GroupManager.removeGroupFromId(currentGroupId);
    } catch (e) {
      let msg = "synchronizeWindowManager failed; " + e;
      console.error(msg);
      return msg;
    }
  }
};

Controller.onTabClose = async function(params) {
  try {
    await GroupManager.removeTabFromIndexInGroupId(
      params.groupId,
      params.tabIndex
    );
  } catch (e) {
    let msg = "Controller.onTabClose failed; " + e;
    console.error(msg);
    return msg;
  }
};

Controller.onTabOpen = async function(params) {
  try {
    const currentWindow = await browser.windows.getCurrent();
    await TabManager.openListOfTabs(
      [params.tab],
      currentWindow.id,
      true,
      false,
    )
  } catch (e) {
    let msg = "Controller.onTabOpen failed; " + e;
    console.error(msg);
    return msg;
  }
};

Controller.onImportGroups = function(params) {
  try {
    let groups = StorageManager.File.importGroups(params.content_file);
    GroupManager.addGroups(groups);

    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": "Import Groups succeeded",
      "message": groups.length + " groups imported.",
      "eventTime": 4000,
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

Controller.onGroupChangePosition = function(params) {
  GroupManager.changeGroupPosition(
    params.groupId,
    params.position
  );
};

Controller.onTabChangePin = function(params) {
  TabManager.changePinState(
    params.groupId,
    params.tabIndex,
  );
};

Controller.onChangeExpand = function(params) {
  GroupManager.changeExpandState(
    params.groupId,
    params.expand,
  );
};

// START of the extension
Controller.init();

// Event from: popup
Controller.popupMessenger = function(message) {
  if (Utils.UTILS_SHOW_MESSAGES) {
    console.log(message);
  }
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
  if (Utils.UTILS_SHOW_MESSAGES) {
    console.log(message);
  }
  switch (message.task) {
    case "Option:Ask":
      Controller.refreshOptionsUI();
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
  }
}




/**** Update *****/
Controller.initDataEventListener = function() {
  GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
    () => {
      Controller.refreshUi();
    });

  OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
    () => {
      Controller.refreshOptionsUI();
    });
}


/**** Event about tabs *****/
Controller.initTabsEventListener = function() {
  browser.tabs.onActivated.addListener(async (activeInfo) => {
    TabManager.updateTabsInGroup(activeInfo.windowId);
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
      // TODO: do not fire if window doesn't exist
      TabManager.updateTabsInGroup(removeInfo.windowId);
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
      if ( !WindowManager.WINDOW_CURRENTLY_SWITCHING[window.id] ) {
        WindowManager.integrateWindow(window.id);
      }
    }, 400); // Below 400, it can fail
  });
  browser.windows.onRemoved.addListener((windowId) => {
    GroupManager.detachWindow(windowId);
  });
  /* TODO: doenst update context menu well if right click on a tab from another window
   */
  browser.windows.onFocusChanged.addListener(async (windowId) => {
    Controller.refreshUi();

    try {
      const w = await browser.windows.getLastFocused({
        windowTypes: ['normal'],
      });
      ContextMenu.MoveTabMenuIds.map((id) => {
        let order = id.substring(ContextMenu.MoveTabMenu_ID.length, id.length);
        let groupId = parseInt(order);
        if (groupId >= 0) {
          let groupIndex = GroupManager.getGroupIndexFromGroupId(groupId, false);
          browser.contextMenus.update(
            id, {
              enabled: w.id !== GroupManager.groups[groupIndex].windowId
            });
        }
      });

      let groupId = GroupManager.getGroupIdInWindow(windowId, false);
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
          WindowManager.selectNextGroup(1, false);
          break;
        case "swtich_previous_group":
          WindowManager.selectNextGroup(-1, false);
          break;
        case "create_group_swtich":
          let newGroupId = GroupManager.addGroup();
          WindowManager.selectGroup(newGroupId);
          break;
        case "focus_next_group":
          WindowManager.selectNextGroup(1, true);
          break;
        case "focus_previous_group":
          WindowManager.selectNextGroup(-1, true);
          break;
        case "remove_group_swtich":
          await WindowManager.removeGroup();
          WindowManager.selectNextGroup(1, false);
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
  console.log(details);
  if(details.temporary) {
    Utils.openUrlOncePerWindow(
      browser.extension.getURL("/tests/test-page/test-page.html")
    );
  }
});
