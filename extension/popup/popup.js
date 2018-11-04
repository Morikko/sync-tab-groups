import ReactDOM from 'react-dom'
import React from 'react'
import * as ReactRedux from 'react-redux'

import PopupMenu from './components/popupmenu'
import GroupActions from '../share/components/groups/wrapper/group-actions'
import store from '../share/components/groups/wrapper/store'

document.addEventListener("DOMContentLoaded", () => {
  ReactDOM.render(
    React.createElement(
      ReactRedux.Provider, {
        store: store,
      },
      React.createElement(PopupMenu, {
        onGroupAddClick: GroupActions.addGroup,
        onGroupAddDrop: GroupActions.addGroupWithTab,
        onGroupClick: GroupActions.selectGroup,
        onGroupDrop: GroupActions.moveTabToGroup,
        onGroupCloseClick: GroupActions.closeGroup,
        onGroupRemoveClick: GroupActions.removeGroup,
        onGroupTitleChange: GroupActions.renameGroup,
        onTabClick: GroupActions.selectTab,
        onOpenInNewWindowClick: GroupActions.OpenGroupInNewWindow,
        onChangeWindowSync: GroupActions.onChangeWindowSync,
        onClickPref: GroupActions.openSettings,
        onCloseTab: GroupActions.onCloseTab,
        onOpenTab: GroupActions.onOpenTab,
        onOptionChange: GroupActions.onOptionChange,
        onGroupChangePosition: GroupActions.changeGroupPosition,
        onChangePinState: GroupActions.onChangePinState,
        onChangeExpand: GroupActions.onChangeExpand,
        onRemoveHiddenTabsInGroup: GroupActions.onRemoveHiddenTabsInGroup,
        onRemoveHiddenTab: GroupActions.onRemoveHiddenTab,
      })
    ),
    document.getElementById("content")
  );
});