const store = Redux.createStore(Reducer);

class SelectorActions {
  static getGroups() {
    Utils.sendMessage("Ask:SelectorGroups", {});
  }

  static finish({ filter }) {
    Utils.sendMessage("Selector:Finish", {
      type,
      filter
    });
  }
}

var selectorMessenger = function (message) {
  switch (message.task) {
    case "Selector:Groups":
      store.dispatch(ActionCreators.setGroups(message.params.groups));
      break;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  // Set tab title
  document.title = Utils.getParameterByName("title");
  // Set tab icon
  Utils.setIcon("/share/icons/tabspace-active-64.png");
  ReactDOM.render(React.createElement(
    ReactRedux.Provider,
    { store: store },
    React.createElement(Wrapper
    /*
    onGroupAddClick={GroupActions.addGroup}
    onGroupAddDrop={GroupActions.addGroupWithTab}
    onGroupClick={GroupActions.selectGroup}
    onGroupDrop={GroupActions.moveTabToGroup}
    onGroupCloseClick={GroupActions.closeGroup}
    onGroupRemoveClick={GroupActions.removeGroup}
    onGroupTitleChange={GroupActions.renameGroup}
    onTabClick={GroupActions.selectTab}
    onOpenInNewWindowClick={GroupActions.OpenGroupInNewWindow}
    onChangeWindowSync={GroupActions.onChangeWindowSync}
    onClickPref={GroupActions.openSettings}
    onCloseTab={GroupActions.onCloseTab}
    onOpenTab={GroupActions.onOpenTab}
    onOptionChange={GroupActions.onOptionChange}
    onGroupChangePosition={GroupActions.changeGroupPosition}
    onChangePinState={GroupActions.onChangePinState}
    onChangeExpand={GroupActions.onChangeExpand}
    */
    , null)
  ), document.getElementById("content"));
});

browser.runtime.onMessage.addListener(selectorMessenger);
SelectorActions.getGroups();