import Utils from '../utils/utils'
import ImportSelector from '../core/importSelector'
import BackgroundHelper from '../core/backgroundHelper'
import GroupManager from '../core/groupmanager'
import SELECTOR_TYPE from '../core/SELECTOR_TYPE'
import ExtensionStorageManager from '../storage/storageManager'

const SelectorMessenger = {};

SelectorMessenger.selectorMessenger = function(message) {
  switch (message.task) {
  case "Ask:SelectorGroups":
    Utils.sendMessage("Selector:Groups", {
      groups: ImportSelector.groups,
    });
    break;
  case "Selector:Finish":
    SelectorMessenger.manageFinish(message.params);
    break;
  case "Ask:Options":
    BackgroundHelper.refreshOptionsUI();
    break;
  }
}

SelectorMessenger.manageFinish = async function({
  filter,
  importType,
}) {
  let done = false;
  if (ImportSelector.type === SELECTOR_TYPE.EXPORT) {
    done = await ExtensionStorageManager.File.downloadGroups(
      GroupManager.filterGroups(
        ImportSelector.groups,
        filter,
      )
    );
  } else {
    let ids = GroupManager.addGroups(
      GroupManager.filterGroups(
        ImportSelector.groups,
        filter,
      ), {
        showNotification: true,
      });
    done = ids.length>0;
  }

  // In case of success
  if (done) {
    await ImportSelector.closeGroupsSelector();
  }
}

export default SelectorMessenger