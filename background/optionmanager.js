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

OptionManager.delaytask = new DelayedTasks.DelayedTasks(500);


OptionManager.updateOption = function ( optionName, optionValue){
  optionName.split('-').reduce((a,b, index, array)=>{
    if ( index === array.length-1 )
      a[b] = optionValue;
    return a[b];
  }, OptionManager.options);
  OptionManager.eventlistener.fire( OptionManager.EVENT_CHANGE );
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
    return "OptionManager.init failed: " + e;
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
      },
      DelayedTasks.LIMITED_MODE,
    )
  });
