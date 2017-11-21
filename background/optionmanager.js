/**
 * Settings of the extension
 *
 * Event: EVENT_CHANGE
 * DelayedTask: store() (Limited mode)
 */

var OptionManager = OptionManager || {};

OptionManager.EVENT_CHANGE = 'options-change';

OptionManager.options = OptionManager.TEMPLATE();
OptionManager.eventlistener = new EventListener();

OptionManager.delaytask = new DelayedTasks.DelayedTasks(1000, DelayedTasks.DONE_ONCE_PER_TIME);

/**
 * Change option value
 * @param {String} state - each part is separated with '-'
 * @param {Object} optionValue - the value to set
 */
OptionManager.updateOption = function ( optionName, optionValue){
  optionName.split('-').reduce((a,b, index, array)=>{
    if ( index === array.length-1 )
      a[b] = optionValue;
    return a[b];
  }, OptionManager.options);
  OptionManager.eventlistener.fire( OptionManager.EVENT_CHANGE );

  switch( optionName ) {
    case "privateWindow-sync":
      OptionManager.onPrivateWindowSyncChange( optionValue );
      break;
    case "pinnedTab-sync":
      OptionManager.onPinnedTabSyncChange( );
      break;
  }
}

/**
 * Adapt groups when option change
 * state: true -> sync private window already opened
 * state: false -> remove groups in private window open
 * @param {boolean} state
 */
OptionManager.onPrivateWindowSyncChange = async function ( state ) {
  try {
    if ( state ) {
      await GroupManager.integrateAllOpenedWindows();
    } else {
      await GroupManager.removeGroupsInPrivateWindow();
    }
    return "OptionManager.onPrivateWindowSyncChange done!";
  } catch ( e ) {
    let msg = "OptionManager.onPrivateWindowSyncChange failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Refresh opened groups to add/remove pinned tabs
 * Pinned tabs in closed groups are not removed
 */
OptionManager.onPinnedTabSyncChange = async function ( ) {
  try {
    await GroupManager.updateAllOpenedGroups();
    return "OptionManager.onPrivateWindowSyncChange done!";
  } catch ( e ) {
    let msg = "OptionManager.onPrivateWindowSyncChange failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Asynchronous function
 * Get the saved options if exist else set template options
 * @return {Promise}
 */
OptionManager.init = async function() {
  try {
    const options = await StorageManager.Local.loadOptions( );
    OptionManager.options = options;
    OptionManager.eventlistener.fire( OptionManager.EVENT_CHANGE );
    return "OptionManager.init done";
  } catch (e) {
    let msg = "OptionManager.init failed: " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Save options
 * In local storage
 * Asynchronous
 * @return {Promise}
 */
OptionManager.store = function() {
  return StorageManager.Local.saveOptions( OptionManager.options );
}

OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
  () => {
    OptionManager.delaytask.addDelayedTask(
      ()=>{
        OptionManager.store();
      }
    )
  });
