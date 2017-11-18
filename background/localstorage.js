var StorageManager = StorageManager || {};

StorageManager.Local = StorageManager.Local || {};

/**
 * Save the groups as JSON object in the local storage (this computer, this session)
 * @param {Array[Group]} groups
 */
StorageManager.Local.saveGroups = function(groups) {
  return browser.storage.local.set({
    groups: groups
  });
}

/**
 * Load the groups from the local storage (this computer, this session) and return it as a javascript object
 * If no groups array was saved, return an empty array
 * @return {Array[Group]} groups
 */
StorageManager.Local.loadGroups = function( ) {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(
      "groups"
    ).then((local) => {
      if ( local.groups === undefined )
        resolve([]);
      else
        resolve(local.groups);
      //resolve("StorageManager.Local.loadGroups loaded !");
    }).catch(() => {
      reject("StorageManager.Local.loadGroups failed...")
    });
  });
}

/**
 * Remove the saved groups from the local storage  (this computer, this session, this extension)
 */
StorageManager.Local.cleanGroups = function() {
  return browser.storage.local.remove("groups");
}

/**
 * Save the options as JSON object in the local storage (this computer, this session)
 * @param {Object} options
 */
StorageManager.Local.saveOptions = function(options) {
  return browser.storage.local.set({
    options: options
  });
}

/**
 * Load the options from the local storage (this computer, this session) and return it as a javascript object
 * If no options were saved, return the template options (see utils.js)
 * @return {Object} options
 */
StorageManager.Local.loadOptions = function( ) {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(
      "options"
    ).then((local) => {
      if ( local.options === undefined )
        resolve(OptionManager.TEMPLATE());
      else
        resolve(local.options);
      //resolve("StorageManager.Local.loadGroups loaded !");
    }).catch(() => {
      reject("StorageManager.Local.loadOptions failed...")
    });
  });
}


/**
 * Remove the saved options from the local storage (this computer, this session, this extension)
 */
StorageManager.Local.cleanOptions = function() {
  return browser.storage.local.remove("options");
}
