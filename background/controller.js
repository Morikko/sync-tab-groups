// Portage help from SDK/XUL to Web extension
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Comparison_with_the_Add-on_SDK

TaskManager.fromUI = {
  [TaskManager.CLOSE_REFERENCE]: new TaskManager.DelayedTask(),
  [TaskManager.REMOVE_REFERENCE]: new TaskManager.DelayedTask()
}

/**
 * Only read groups data, never write directly
 */
function Controller() {
  this.init();
}

Controller.prototype = {
  init: async function() {
    await OptionManager.init();
    await GroupManager.init();

    Utils.setBrowserActionIcon(OptionManager.options.popup.whiteTheme);
  },

  refreshOptionsUI: function() {
    Utils.sendMessage("Option:Changed", {
      options: OptionManager.options,
    });
  },

  refreshUi: function() {
    Utils.sendMessage("Groups:Changed", {
      groups: GroupManager.groups,
      delayedTasks: TaskManager.fromUI
    });
  },

  onOpenGroupInNewWindow: function(params) {
    WindowManager.openGroupInNewWindow(params.groupID);
  },

  onGroupAdd: function() {
    try {
      GroupManager.addGroup();
    } catch (e) {
      console.error("Controller - onGroupAdd failed: " + e);
    }
  },

  onGroupAddWithTab: function(params) {
    TabManager.moveTabToNewGroup(
      params.sourceGroupID,
      params.tabIndex
    );
  },

  onGroupClose: function(params) {
    var delayedFunction = async() => {
      try {
        await WindowManager.closeGroup(
          params.groupID,
          false
        );
        controller.refreshUi();
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
      params.groupID,
    );
  },

  onGroupRemove: function(params) {
    var delayedFunction = () => {
      WindowManager.removeGroup(
        params.groupID
      );
    };

    TaskManager.fromUI[TaskManager.REMOVE_REFERENCE].manage(
      params.taskRef,
      delayedFunction,
      params.groupID,
    );
  },

  onGroupRename: function(params) {
    GroupManager.renameGroup(
      GroupManager.getGroupIndexFromGroupId(params.groupID),
      params.title
    );
  },

  onGroupSelect: function(params) {
    WindowManager.selectGroup(
      params.groupID
    );
  },

  onTabSelect: function(params) {
    TabManager.selectTab(
      params.tabIndex,
      params.groupID
    );
  },

  onMoveTabToGroup: function(params) {
    TabManager.moveTabBetweenGroups(
      params.sourceGroupID,
      params.tabIndex,
      params.targetGroupID
    );
  },

  onBookmarkSave: function() {
    StorageManager.Bookmark.backUp(GroupManager.getCopy(), true);
  },

  onOpenSettings: function() {
    browser.runtime.openOptionsPage();
  },

  synchronizeWindowManager: function(params) {
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
  },

  onTabClose: async function(params) {
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
  },

  onTabOpen: async function(params) {
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
  },

  onImportGroups: function(params) {
    try {
      let groups = StorageManager.File.importGroups(params.content_file);
      GroupManager.addGroups(groups);

      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/tabspace-active-64.png"),
        "title": "Import Groups succeeded",
        "message": groups.length + " groups imported.",
        "eventTime": 4000,
      });
    } catch (e) {
      console.error(e);
      browser.notifications.create({
        "type": "basic",
        "iconUrl": browser.extension.getURL("icons/tabspace-active-64.png"),
        "title": "Import Groups failed",
        "message": e.message,
        "eventTime": 4000,
      });
    }
  },

  onExportGroups: function() {
    StorageManager.File.exportGroups(GroupManager.getCopy());
  },
};

// Event from: popup
var popupMessenger = function(message) {
  console.log(message);
  switch (message.task) {
    case "Group:Add":
      controller.onGroupAdd();
      break;
    case "Group:AddWithTab":
      controller.onGroupAddWithTab(message.params);
      break;
    case "Group:Close":
      controller.onGroupClose(message.params);
      break;
    case "Group:Remove":
      controller.onGroupRemove(message.params);
      break;
    case "Group:Rename":
      controller.onGroupRename(message.params);
      break;
    case "Group:Select":
      controller.onGroupSelect(message.params);
      break;
    case "Group:MoveTab":
      controller.onMoveTabToGroup(message.params);
      break;
    case "Tab:Select":
      controller.onTabSelect(message.params);
      break;
    case "Group:OpenGroupInNewWindow":
      controller.onOpenGroupInNewWindow(message.params);
      break;
    case "Data:Ask":
      controller.refreshUi();
      controller.refreshOptionsUI();
      break;
    case "App:OpenSettings":
      controller.onOpenSettings();
      break;
    case "Window:Sync":
      controller.synchronizeWindowManager(message.params);
      break;
    case "Tab:Open":
      controller.onTabOpen(message.params);
      break;
    case "Tab:Close":
      controller.onTabClose(message.params);
      break;
  }
}

// Event from: option
var optionMessenger = function(message) {
  console.log(message);
  switch (message.task) {
    case "Option:Ask":
      controller.refreshOptionsUI();
      break;
    case "Option:Change":
      OptionManager.updateOption(message.params.optionName, message.params.optionValue);
      controller.refreshOptionsUI();
      break;
    case "Option:BackUp":
      controller.onBookmarkSave();
      break;
    case "Option:Import":
      controller.onImportGroups(message.params);
      controller.refreshUi();
      break;
    case "Option:Export":
      controller.onExportGroups();
      break;
  }
}

var controller = new Controller();
browser.runtime.onMessage.addListener(popupMessenger);
browser.runtime.onMessage.addListener(optionMessenger);

/**** Update *****/

GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
  () => {
    controller.refreshUi();
  });

OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
  () => {
    controller.refreshOptionsUI();
  });

/**** Event about tabs *****/
browser.tabs.onActivated.addListener((activeInfo) => {
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

/**** Event about windows *****/
browser.windows.onCreated.addListener((window) => {
  // Let time for opening well and be sure it is a new one
  setTimeout(() => {
    WindowManager.integrateWindow(window.id);
  }, 1000);
});
browser.windows.onRemoved.addListener((windowId) => {
  GroupManager.detachWindow(windowId);
});
/* TODO: doenst update context menu well if right click on a tab from another window
 */
browser.windows.onFocusChanged.addListener(async(windowId) => {
  controller.refreshUi();

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

  } catch (e) {
    let msg = "onFocusChanged.listener failed; " + e;
    console.error(msg);
    return msg;
  }
});


// Commands
browser.commands.onCommand.addListener(async function(command) {
  try {
    switch (command) {
      case "swtich-next-group":
        WindowManager.selectNextGroup(1, false);
        break;
      case "swtich-previous-group":
        WindowManager.selectNextGroup(-1, false);
        break;
      case "create-group-swtich":
        let newGroupId = GroupManager.addGroup();
        WindowManager.selectGroup(newGroupId);
        break;
      case "focus-next-group":
        WindowManager.selectNextGroup(1, true);
        break;
      case "focus-previous-group":
        WindowManager.selectNextGroup(-1, true);
        break;
      case "remove-group-swtich":
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
