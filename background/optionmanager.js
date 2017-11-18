/**
 * Settings of the extension
 */

var OptionManager = OptionManager || {};

OptionManager.EVENT_CHANGE = 'options-change';
OptionManager.DELAYED_TASK = 'delayed-options';

OptionManager.options = OptionManager.TEMPLATE();
OptionManager.eventlistener = new EventListener();


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
OptionManager.init = function() {
  return new Promise((resolve, reject) => {
    StorageManager.Local.loadOptions( ).then((options) => {
      OptionManager.options = options;
      resolve("OptionManager.init done");
      OptionManager.eventlistener.fire( OptionManager.EVENT_CHANGE );
    }).catch(() => {
      reject("OptionManager.init failed");
    });
  });
}

/**
 * Save options
 * In local storage
 */
OptionManager.store = function() {
  StorageManager.Local.saveOptions( OptionManager.options );
}

OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
  () => {
    OptionManager.store();
  });
