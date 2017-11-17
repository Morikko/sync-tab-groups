const store = Redux.createStore(Reducer);

const Actions = {
  askOptions: function() {
    Utils.sendMessage("Option:Ask", {});
  }
};

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider, {
        store: store
      },
      React.createElement(OptionsPanel, {
        /*
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
        onOpenInNewWindowClick: Actions.OpenGroupInNewWindow
        */
      })
    ),
    document.getElementById("content")
  );
});

var optionMessenger = function(message) {
  switch (message.task) {
    case "Option:Changed":
      store.dispatch(ActionCreators.setOptions(message.params.options));
      break;
  }
}

browser.runtime.onMessage.addListener(optionMessenger);

/*
 * Access to the groups and show them
 */
function init() {
  Actions.askOptions();
}

init();
