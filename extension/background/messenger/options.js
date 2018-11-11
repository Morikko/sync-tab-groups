import BackgroundHelper from '../core/backgroundHelper'
import OptionManager from '../core/optionmanager'
import TabManager from '../core/tabmanager/tabManager'

const OptionsMessenger = {};

OptionsMessenger.optionMessenger = function(message) {
  switch (message.task) {
  case "Option:Ask":
    BackgroundHelper.refreshOptionsUI();
    break;
  case "BackupList:Ask":
    BackgroundHelper.refreshBackupListUI();
    break;
  case "Option:Change":
    OptionManager.updateOption(message.params.optionName, message.params.optionValue);
    BackgroundHelper.refreshOptionsUI();
    break;
  case "Option:BackUp":
    BackgroundHelper.onBookmarkSave();
    break;
  case "Option:Import":
    BackgroundHelper.onImportGroups(message.params);
    BackgroundHelper.refreshUi();
    break;
  case "Option:Export":
    BackgroundHelper.onExportGroups();
    break;
  case "Option:DeleteAllGroups":
    BackgroundHelper.onRemoveAllGroups();
    break;
  case "Option:ReloadGroups":
    BackgroundHelper.onReloadGroups();
    break;
  case "Option:OpenGuide":
    BackgroundHelper.onOpenGuide();
    break;
  case "Option:UndiscardLazyTabs":
    TabManager.undiscardAll();
    break;
    /*   case "Option:CloseAllHiddenTabs":
    TabHidden.removeAllHiddenTabs();
    break; */
  case "Option:RemoveBackUp":
    BackgroundHelper.onRemoveBackUp(message.params.id);
    break;
  case "Option:ImportBackUp" :
    BackgroundHelper.onImportBackUp(message.params.id);
    break;
  case "Option:ExportBackUp" :
    BackgroundHelper.onExportBackUp(message.params.id);
    break;
  }
}

export default OptionsMessenger