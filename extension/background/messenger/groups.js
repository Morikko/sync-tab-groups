import BackgroundHelper from '../core/backgroundHelper'
const GroupsMessenger = {};

// Event from: popup
GroupsMessenger.popupMessenger = function(message) {
  switch (message.task) {
  case "Group:Add":
    BackgroundHelper.onGroupAdd(message.params);
    break;
  case "Group:AddWithTab":
    BackgroundHelper.onGroupAddWithTab(message.params);
    break;
  case "Group:Close":
    BackgroundHelper.onGroupClose(message.params);
    break;
  case "Group:ChangePosition":
    BackgroundHelper.onGroupChangePosition(message.params);
    break;
  case "Group:Remove":
    BackgroundHelper.onGroupRemove(message.params);
    break;
  case "Group:Rename":
    BackgroundHelper.onGroupRename(message.params);
    break;
  case "Group:Select":
    BackgroundHelper.onGroupSelect(message.params);
    break;
  case "Group:MoveTab":
    BackgroundHelper.onMoveTabToGroup(message.params);
    break;
  case "Tab:Select":
    BackgroundHelper.onTabSelect(message.params);
    break;
  case "Group:OpenGroupInNewWindow":
    BackgroundHelper.onOpenGroupInNewWindow(message.params);
    break;
  case "Data:Ask":
    BackgroundHelper.refreshData(message.params);
    break;
  case "App:OpenSettings":
    BackgroundHelper.onOpenSettings();
    break;
  case "Window:Sync":
    BackgroundHelper.changeSynchronizationStateOfWindow(message.params);
    break;
  case "Tab:Open":
    BackgroundHelper.onTabOpen(message.params);
    break;
  case "Tab:Close":
    BackgroundHelper.onTabClose(message.params);
    break;
  case "Tab:ChangePin":
    BackgroundHelper.onTabChangePin(message.params);
    break;
  case "Group:Expand":
    BackgroundHelper.onChangeExpand(message.params);
    break;
  case "Tab:RemoveHiddenTab":
    BackgroundHelper.onRemoveHiddenTab(message.params);
    break;
  case "Group:RemoveHiddenTabsInGroup":
    BackgroundHelper.onRemoveHiddenTabsInGroup(message.params);
    break;
  }
}

export default GroupsMessenger