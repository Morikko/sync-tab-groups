/**
 * Events specific to the extension
 */
const ExtensionEvents = ExtensionEvents || {};

ExtensionEvents.initSendDataEventListener = function() {
  GroupManager.eventlistener.on(GroupManager.EVENT_CHANGE,
    () => {
      Background.refreshUi();
    }
  );
  OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
    () => {
      Background.refreshOptionsUI();
    }
  );
  StorageManager.Local.eventlistener.on(StorageManager.Local.BACKUP_CHANGE,
    ()=>{
        Background.refreshBackupListUI();
    }
  );
}

export default ExtensionEvents