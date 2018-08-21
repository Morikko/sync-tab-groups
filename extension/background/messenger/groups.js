var Messenger = Messenger || {};
Messenger.Groups = Messenger.Groups || {};

// Event from: popup
Messenger.Groups.popupMessenger = function(message) {
  switch (message.task) {
    case "Group:Add":
      Background.onGroupAdd(message.params);
      break;
    case "Group:AddWithTab":
      Background.onGroupAddWithTab(message.params);
      break;
    case "Group:Close":
      Background.onGroupClose(message.params);
      break;
    case "Group:ChangePosition":
      Background.onGroupChangePosition(message.params);
      break;
    case "Group:Remove":
      Background.onGroupRemove(message.params);
      break;
    case "Group:Rename":
      Background.onGroupRename(message.params);
      break;
    case "Group:Select":
      Background.onGroupSelect(message.params);
      break;
    case "Group:MoveTab":
      Background.onMoveTabToGroup(message.params);
      break;
    case "Tab:Select":
      Background.onTabSelect(message.params);
      break;
    case "Group:OpenGroupInNewWindow":
      Background.onOpenGroupInNewWindow(message.params);
      break;
    case "Data:Ask":
      Background.refreshData(message.params);
      break;
    case "App:OpenSettings":
      Background.onOpenSettings();
      break;
    case "Window:Sync":
      Background.changeSynchronizationStateOfWindow(message.params);
      break;
    case "Tab:Open":
      Background.onTabOpen(message.params);
      break;
    case "Tab:Close":
      Background.onTabClose(message.params);
      break;
    case "Tab:ChangePin":
      Background.onTabChangePin(message.params);
      break;
    case "Group:Expand":
      Background.onChangeExpand(message.params);
      break;
    case "Tab:RemoveHiddenTab":
      Background.onRemoveHiddenTab(message.params);
      break;
    case "Group:RemoveHiddenTabsInGroup":
      Background.onRemoveHiddenTabsInGroup(message.params);
      break;
  }
}
