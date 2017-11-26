const store = Redux.createStore(Reducer);

const Actions = {
  addGroup: function() {
    Utils.sendMessage("Group:Add", {});
  },

  // Drag & Drop tab on create button
  addGroupWithTab: function(sourceGroupID, tabIndex) {
    Utils.sendMessage("Group:AddWithTab", {
      sourceGroupID: sourceGroupID,
      tabIndex: tabIndex
    });
  },

  OpenGroupInNewWindow: function(groupID) {
    Utils.sendMessage("Group:OpenGroupInNewWindow", {
      groupID: groupID,
    });
  },

  closeGroup: function(taskRef, groupID) {
    Utils.sendMessage("Group:Close", {
      taskRef: taskRef,
      groupID: groupID
    });
  },

  removeGroup: function(taskRef, groupID) {
    Utils.sendMessage("Group:Remove", {
      taskRef: taskRef,
      groupID: groupID
    });
  },

  renameGroup: function(groupID, title) {
    Utils.sendMessage("Group:Rename", {
      groupID: groupID,
      title: title
    });
  },

  selectGroup: function(groupID) {
    Utils.sendMessage("Group:Select", {
      groupID: groupID
    });
  },

  moveTabToGroup: function(sourceGroupID, tabIndex, targetGroupID) {
    Utils.sendMessage("Group:MoveTab", {
      sourceGroupID: sourceGroupID,
      tabIndex: tabIndex,
      targetGroupID: targetGroupID
    });
  },

  selectTab: function(groupID, tabIndex) {
    Utils.sendMessage("Tab:Select", {
      groupID: groupID,
      tabIndex: tabIndex
    });
  },

  // TODO Unused
  dragTab: function(groupID, tabIndex) {
    Utils.sendMessage("Tab:Drag", {
      groupID: groupID,
      tabIndex: tabIndex
    });
  },

  // TODO Unused
  dragTabStart: function(groupID, tabIndex) {
    Utils.sendMessage("Tab:DragStart", {
      groupID: groupID,
      tabIndex: tabIndex
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

  onOpenTab: function(groupId, tab) {
    Utils.sendMessage("Tab:Open", {
      groupId: groupId,
      tab: tab
    });
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider, {
        store: store
      },
      React.createElement(App, {
        onGroupAddClick: Actions.addGroup,
        onGroupAddDrop: Actions.addGroupWithTab,
        onGroupClick: Actions.selectGroup,
        onGroupDrop: Actions.moveTabToGroup,
        onGroupCloseClick: Actions.closeGroup,
        onGroupRemoveClick: Actions.removeGroup,
        onGroupTitleChange: Actions.renameGroup,
        onTabClick: Actions.selectTab,
        onTabDrag: Actions.dragTab,
        onTabDragStart: Actions.dragTabStart,
        onOpenInNewWindowClick: Actions.OpenGroupInNewWindow,
        onChangeWindowSync: Actions.onChangeWindowSync,
        onClickPref: Actions.openSettings,
        onCloseTab: Actions.onCloseTab,
        onOpenTab: Actions.onOpenTab,
      })
    ),
    document.getElementById("content")
  );
});

var popupMessenger = function(message) {
  switch (message.task) {
    case "Groups:Changed":
      store.dispatch(ActionCreators.setTabgroups(message.params.groups));
      store.dispatch(ActionCreators.setDelayedTask(message.params.delayedTasks));
      browser.windows.getLastFocused({
        windowTypes: ['normal']
      }).then((w) => {
        store.dispatch(ActionCreators.setCurrentWindowId(w.id));
      });
      break;
  }
}

browser.runtime.onMessage.addListener(popupMessenger);

var tabspaceBackground = browser.runtime.getBackgroundPage();

/*
 * Access to the groups and show them
 */
function init() {
  Actions.askData();
  browser.windows.getLastFocused({
    windowTypes: ['normal']
  }).then((w) => {
    store.dispatch(ActionCreators.setCurrentWindowId(w.id));
  });
}

// Don't wait the page is loaded
init();

// Wait popup to be completely loaded
var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);

  }
}, 10);
