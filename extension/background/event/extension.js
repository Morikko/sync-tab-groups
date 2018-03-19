/**
 * Events specific to the extension
 */
var Event = Event || {};
Event.Extension = Event.Extension || {};

Event.Extension.initDataEventListener = function() {
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
