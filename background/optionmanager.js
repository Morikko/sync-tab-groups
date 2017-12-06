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

OptionManager.repeatedtask = new TaskManager.RepeatedTask(1000);

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
    case "groups-removeEmptyGroup":
      OptionManager.onRemoveEmptyGroupChange( );
      break;
    case "popup-whiteTheme":
      OptionManager.onPopupThemeChange(optionValue);
      break;
  }
}

/**
 * Change the popup icon according to the preferences
 * @param {boolean} theme - color to apply
 */
OptionManager.onPopupThemeChange = function( theme ) {
  Utils.setBrowserActionIcon(theme);
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

OptionManager.onRemoveEmptyGroupChange = function ( ) {
  if ( OptionManager.options.groups.removeEmptyGroup ) {
    GroupManager.removeEmptyGroup();
  }
}

/**
 * Asynchronous function
 * Get the saved options if exist else set template options
 * @return {Promise}
 */
OptionManager.init = async function() {
  try {
    let options = await StorageManager.Local.loadOptions( );
    OptionManager.options = OptionManager.check_integrity(options);
    OptionManager.eventlistener.fire( OptionManager.EVENT_CHANGE );
    return "OptionManager.init done";
  } catch (e) {
    let msg = "OptionManager.init failed: " + e;
    console.error(msg);
    return msg;
  }
}

OptionManager.mergeOptions = function (ref_options, options) {
  for ( let pro in ref_options ) {
    if ( !options.hasOwnProperty(pro) ) {
      options[pro] = ref_options[pro];
    }
    if ( "object" === typeof ref_options[pro] ) {
      OptionManager.mergeOptions(ref_options[pro], options[pro]);
    }
  }
}

/**
 * Check that options object has all the good propreties
 * @param {Object} options
 * @return {Object} options - verified
 */
OptionManager.check_integrity = function( options ) {
  var ref_options = OptionManager.TEMPLATE();
  OptionManager.mergeOptions(ref_options, options);
  return options;
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
    OptionManager.repeatedtask.add(
      ()=>{
        OptionManager.store();
      }
    )
  });
