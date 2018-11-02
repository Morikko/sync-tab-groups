const OptionsMessenger = OptionsMessenger || {};

OptionsMessenger.optionMessenger = function(message) {
  switch (message.task) {
    case "Option:Ask":
      Background.refreshOptionsUI();
      break;
    case "BackupList:Ask":
      Background.refreshBackupListUI();
      break;
    case "Option:Change":
      OptionManager.updateOption(message.params.optionName, message.params.optionValue);
      Background.refreshOptionsUI();
      break;
    case "Option:BackUp":
      Background.onBookmarkSave();
      break;
    case "Option:Import":
      Background.onImportGroups(message.params);
      Background.refreshUi();
      break;
    case "Option:Export":
      Background.onExportGroups();
      break;
    case "Option:DeleteAllGroups":
      Background.onRemoveAllGroups();
      break;
    case "Option:ReloadGroups":
      Background.onReloadGroups();
      break;
    case "Option:OpenGuide":
      Background.onOpenGuide();
      break;
    case "Option:UndiscardLazyTabs":
      TabManager.undiscardAll();
      break;
    case "Option:CloseAllHiddenTabs":
      TabHidden.removeAllHiddenTabs();
      break;
    case "Option:RemoveBackUp":
      Background.onRemoveBackUp(message.params.id);
    break;
    case "Option:ImportBackUp" :
      Background.onImportBackUp(message.params.id);
      break;
    case "Option:ExportBackUp" :
      Background.onExportBackUp(message.params.id);
      break;
  }
}

export default OptionsMessenger