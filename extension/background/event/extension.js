/**
 * Events specific to the extension
 */
import GroupManager from '../core/groupmanager'
import BackgroundHelper from '../core/backgroundHelper'
import OptionManager from '../core/optionmanager'

import ExtensionStorageManager from '../storage/storageManager'

const ExtensionEvents = {};

ExtensionEvents.initSendDataEventListener = function() {
  GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
    () => {
      BackgroundHelper.refreshUi();
    }
  );
  OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
    () => {
      BackgroundHelper.refreshOptionsUI();
    }
  );
  ExtensionStorageManager.Local.eventlistener.on(ExtensionStorageManager.Local.BACKUP_CHANGE,
    ()=>{
      BackgroundHelper.refreshBackupListUI();
    }
  );
}

export default ExtensionEvents