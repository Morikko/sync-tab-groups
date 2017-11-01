const store = Redux.createStore(Reducer);

var sendMessage = function(_task, _params) {
  browser.runtime.sendMessage({
    task: _task,
    params: _params
  });
}

const Actions = {
  addGroup: function() {
    sendMessage("Group:Add", {});
  },

  addGroupWithTab: function(sourceGroupID, tabIndex) {
    sendMessage("Group:AddWithTab", {
      sourceGroupID: sourceGroupID,
      tabIndex: tabIndex
    });
  },

  closeGroup: function(groupID) {
    sendMessage("Group:Close", {
      groupID: groupID
    });
  },

  uiHeightChanged: function() {
    /* TODO: no need anymore, panel is not manage anymore by controller.js
    sendMessage("UI:Resize", {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    });
    */
  },

  renameGroup: function(groupID, title) {
    sendMessage("Group:Rename", {
      groupID: groupID,
      title: title
    });
  },

  selectGroup: function(groupID) {
    sendMessage("Group:Select", {
      groupID: groupID
    });
  },

  moveTabToGroup: function(sourceGroupID, tabIndex, targetGroupID) {
    sendMessage("Group:MoveTab", {
      sourceGroupID: sourceGroupID,
      tabIndex: tabIndex,
      targetGroupID: targetGroupID
    });
  },

  selectTab: function(groupID, tabIndex) {
    sendMessage("Tab:Select", {
      groupID: groupID,
      tabIndex: tabIndex
    });
  },

  dragTab: function(groupID, tabIndex) {
    sendMessage("Tab:Drag", {
      groupID: groupID,
      tabIndex: tabIndex
    });
  },

  dragTabStart: function(groupID, tabIndex) {
    sendMessage("Tab:DragStart", {
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
        uiHeightChanged: Actions.uiHeightChanged
      })
    ),
    document.getElementById("content")
  );
});

var popupMessenger = function(message) {
  switch (message.task) {
    case "Groups:Changed":
      tabspaceBackground.then((page) => {
        store.dispatch(ActionCreators.setTabgroups(page.groups));
      });
      break;
    case "Groups:CloseTimeoutChanged":
      // TODO
      console.log(message);
      store.dispatch(ActionCreators.setGroupCloseTimeout(message.params.timeout));
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
    store.dispatch(ActionCreators.setTabgroups(page.groups));
  });
  store.dispatch(ActionCreators.setGroupCloseTimeout(5))
}


var readyStateCheckInterval = setInterval(function() {
  if (document.readyState === "complete") {
    clearInterval(readyStateCheckInterval);
    init();
  }
}, 10);
