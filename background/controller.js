// Portage help from SDK/XUL to Web extension
// https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Comparison_with_the_Add-on_SDK
// hotkeys -> commands
// sdk/simple-prefs -> storage and options_ui

TaskManager.fromUI = {
  [TaskManager.CLOSE_REFERENCE]: new TaskManager.DelayedTask(),
  [TaskManager.REMOVE_REFERENCE]: new TaskManager.DelayedTask()
}

/**
 * Only read groups data, never write directly
 */
function Controller() {
  this._hotkeyOpen = null;
  this._hotkeyNextGroup = null;
  this._hotkeyPrevGroup = null;

  this.init();
}

Controller.prototype = {
  init: async function() {
  await OptionManager.init();
  await GroupManager.init();
  },

  /* TODO DO I still need the binding
  bindEvents: function() {
    this.bindHotkeyPreference();
    this.bindGroupPreference();
    this.bindPanelButtonEvents();
    this.bindPanelEvents();
    this.bindTabEvents();
  },
  */

  /* TODO adapt pref and hotkey
  createOpenHotkey: function() {
    if (!Prefs.prefs.bindPanoramaShortcut) {
      return;
    }

    /**
     * Note: since this is intended to be released after 1222490 has landed,
     * it is perfectly save to assume accel-shift-e is not used by anything
     * else.
     *
    this._hotkeyOpen = Hotkey({
      combo: "accel-shift-e",
      onPress: () => {
        if (this._groupsPanel.isShowing) {
          this._groupsPanel.hide();
        } else {
          this._groupsPanel.show({position: this._panelButton});
          this._panelButton.state("window", {checked: true});
        }
      }
    });
  },
  */

  /* TODO adapt pref and hotkey
  createNavigationHotkey: function() {
    if (!Prefs.prefs.bindNavigationShortcut) {
      return;
    }

    this._hotkeyNextGroup = Hotkey({
      combo: "accel-`",
      onPress: () => {
        WindowManager.selectNextPrevGroup(
          this._getWindow(),
          this._getTabBrowser(),
          1
        );
      }
    });
    this._hotkeyPrevGroup = Hotkey({
      combo: "accel-shift-`",
      onPress: () => {
        WindowManager.selectNextPrevGroup(
          this._getWindow(),
          this._getTabBrowser(),
          -1
        );
      }
    });
  },
  */

  /* TODO adapt pref and hotkey
  bindHotkeyPreference: function() {
    if (Prefs.prefs.bindPanoramaShortcut) {
      this.createOpenHotkey();
    }

    if (Prefs.prefs.bindNavigationShortcut) {
      this.createNavigationHotkey();
    }

    Prefs.on("bindPanoramaShortcut", () => {
      if (Prefs.prefs.bindPanoramaShortcut) {
        if (!this._hotkeyOpen) {
          this.createOpenHotkey();
        }
      } else if (this._hotkeyOpen) {
        this._hotkeyOpen.destroy();
        this._hotkeyOpen = null;
      }
    });

    Prefs.on("bindNavigationShortcut", () => {
      if (Prefs.prefs.bindNavigationShortcut) {
        if (!this._hotkeyNextGroup) {
          this.createNavigationHotkey();
        }
      } else {
        if (this._hotkeyNextGroup) {
          this._hotkeyNextGroup.destroy();
          this._hotkeyNextGroup = null;
        }
        if (this._hotkeyPrevGroup) {
          this._hotkeyPrevGroup.destroy();
          this._hotkeyPrevGroup = null;
        }
      }
    });
  },
  */

  /* TODO To study
  bindGroupPreference: function() {
    let emitCloseTimeoutChange = () => {
      this._groupsPanel.port.emit("Groups:CloseTimeoutChanged", Prefs.prefs.groupCloseTimeout);
    };

    Prefs.on("groupCloseTimeout", emitCloseTimeoutChange);

    emitCloseTimeoutChange();
  },
  */

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
    var delayedFunction = () => {
      WindowManager.closeGroup(
        params.groupID
      );
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
    TabManager.moveTabToGroup(
      params.sourceGroupID,
      params.tabIndex,
      params.targetGroupID
    );
  },

  onBookmarkSave: function() {
    StorageManager.Bookmark.backUp(GroupManager.getCopy(), true);
  }
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
      break;
  }
}

// Event from: popup
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
browser.windows.onFocusChanged.addListener((windowId) => {
  controller.refreshUi();
});
