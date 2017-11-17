const store = Redux.createStore(Reducer);

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider, {
        store: store
      },
      React.createElement(App, {
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
