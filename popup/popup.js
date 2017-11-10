const store = Redux.createStore(Reducer);

const Actions = {
  addGroup: function() {
    Utils.sendMessage("Group:Add", {});
  },

  // TODO: Drag & Drop tab on create button
  addGroupWithTab: function(sourceGroupID, tabIndex) {
    console.log("addGroupWithTab in popup doesn't work");
    return;
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

  dragTab: function(groupID, tabIndex) {
    Utils.sendMessage("Tab:Drag", {
      groupID: groupID,
      tabIndex: tabIndex
    });
  },

  dragTabStart: function(groupID, tabIndex) {
    Utils.sendMessage("Tab:DragStart", {
      groupID: groupID,
      tabIndex: tabIndex
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
        onGroupTitleChange: Actions.renameGroup,
        onTabClick: Actions.selectTab,
        onTabDrag: Actions.dragTab,
        onTabDragStart: Actions.dragTabStart,
        onOpenInNewWindowClick: Actions.OpenGroupInNewWindow
      })
    ),
    document.getElementById("content")
  );
});

var popupMessenger = function(message) {
  switch (message.task) {
    case "Groups:Changed":
      store.dispatch(ActionCreators.setTabgroups(message.params.groups));
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
  tabspaceBackground.then((page) => {
    store.dispatch(ActionCreators.setTabgroups(page.GroupManager.groups));
  });
  browser.windows.getLastFocused({
    windowTypes: ['normal']
  }).then((w) => {
    store.dispatch(ActionCreators.setCurrentWindowId(w.id));
  });
}

// Wait popup to be completely loaded
var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    init();
  }
}, 10);
