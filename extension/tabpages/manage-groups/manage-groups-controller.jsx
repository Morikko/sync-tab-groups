document.addEventListener("DOMContentLoaded", () => {
  // Set tab title
  document.title = browser.i18n.getMessage("group_manager");
  // Set tab icon
  Utils.setIcon("/share/icons/tabspace-active-64.png");

  ReactDOM.render(
    <ReactRedux.Provider store={store}>
      <ManageWrapper
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
      />
    </ReactRedux.Provider>
    , document.getElementById("content"));

});
