const GroupActions = {
  addGroup: function(title="") {
    Utils.sendMessage("Group:Add", {
      title: title
    });
  },

  // Drag & Drop tab on create button
  addGroupWithTab: function(title="", sourceGroupId, tabIndex) {
    Utils.sendMessage("Group:AddWithTab", {
      title: title,
      sourceGroupId: sourceGroupId,
      tabIndex: tabIndex
    });
  },

  OpenGroupInNewWindow: function(groupId) {
    Utils.sendMessage("Group:OpenGroupInNewWindow", {
      groupId: groupId,
    });
  },

  closeGroup: function(taskRef, groupId) {
    Utils.sendMessage("Group:Close", {
      taskRef: taskRef,
      groupId: groupId
    });
  },

  removeGroup: function(taskRef, groupId) {
    Utils.sendMessage("Group:Remove", {
      taskRef: taskRef,
      groupId: groupId
    });
  },

  renameGroup: function(groupId, title) {
    Utils.sendMessage("Group:Rename", {
      groupId: groupId,
      title: title
    });
  },

  selectGroup: function(groupId) {
    Utils.sendMessage("Group:Select", {
      groupId: groupId
    });
  },

  changeGroupPosition: function(groupId, position) {
    Utils.sendMessage("Group:ChangePosition", {
      groupId: groupId,
      position: position,
    });
  },

  moveTabToGroup: function(sourceGroupId, sourceTabIndex, targetGroupId, targetTabIndex=-1) {
    Utils.sendMessage("Group:MoveTab", {
      sourceGroupId: sourceGroupId,
      sourceTabIndex: sourceTabIndex,
      targetGroupId: targetGroupId,
      targetTabIndex: targetTabIndex,
    });
  },

  selectTab: function(groupId, tabIndex, newWindow) {
    Utils.sendMessage("Tab:Select", {
      groupId: groupId,
      tabIndex: tabIndex,
      newWindow: newWindow,
    });
  },

  askData: function() {
    Utils.sendMessage("Data:Ask", {});
  },

  openSettings: function() {
    Utils.sendMessage("App:OpenSettings", {});
  },

  onChangeWindowSync: function(windowId, value) {
    Utils.sendMessage("Window:Sync", {
      windowId: windowId,
      isSync: value,
    });
  },

  onCloseTab: function(tabId, groupId, tabIndex) {
    Utils.sendMessage("Tab:Close", {
      tabId: tabId,
      groupId: groupId,
      tabIndex: tabIndex
    });
  },

  onOpenTab: function(tab) {
    Utils.sendMessage("Tab:Open", {
      tab: tab
    });
  },

  onChangeExpand: function(groupId, value) {
    Utils.sendMessage("Group:Expand", {
      groupId: groupId,
      expand: value,
    });
  },

  onOptionChange: function(name, value) {
    Utils.sendMessage("Option:Change", {
      optionName: name,
      optionValue: value
    });
  },

  onChangePinState: function(groupId, tabIndex) {
    Utils.sendMessage("Tab:ChangePin", {
      groupId: groupId,
      tabIndex: tabIndex
    });
  },

  onRemoveHiddenTab: function(tabId) {
    Utils.sendMessage("Tab:RemoveHiddenTab", {
      tabId
    });
  },

  onRemoveHiddenTabsInGroup: function(groupId) {
    Utils.sendMessage("Group:RemoveHiddenTabsInGroup", {
      groupId
    });
  },
};


var popupMessenger = function(message) {
  switch (message.task) {
    case "Groups:Changed":
      store.dispatch(ActionCreators.setGroups(message.params.groups));
      store.dispatch(ActionCreators.setDelayedTask(message.params.delayedTasks));
      browser.windows.getLastFocused({
        windowTypes: ['normal']
      }).then((w) => {
        store.dispatch(ActionCreators.setCurrentWindowId(w.id));
      });
      break;
    case "Option:Changed":
      store.dispatch(ActionCreators.setOptions(message.params.options));
      break;
  }
}

browser.runtime.onMessage.addListener(popupMessenger);


var tabspaceBackground = browser.runtime.getBackgroundPage();

/*
 * Access to the groups and show them
 */
function init() {
  GroupActions.askData();
  browser.windows.getLastFocused({
    windowTypes: ['normal']
  }).then((w) => {
    store.dispatch(ActionCreators.setCurrentWindowId(w.id));
  });
}

// Don't wait the page is loaded
init();
