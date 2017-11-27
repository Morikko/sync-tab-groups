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
StorageManager.Local.loadGroups = async function( ) {
  try {
    const local = await browser.storage.local.get(
      "groups"
    );
    if ( local.groups === undefined )
      return [];
    else
      return local.groups;
  } catch ( e ) {
    return "StorageManager.Local.loadGroups failed... " + e ;
  }
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
StorageManager.Local.loadOptions = async function( ) {
  try {
    const local = await browser.storage.local.get(
      "options"
    );
    if ( local.options === undefined )
      return OptionManager.TEMPLATE();
    else
      return local.options;
  } catch ( e ) {
    return "StorageManager.Local.loadOptions failed... " + e ;
  }
}


/**
 * Remove the saved options from the local storage (this computer, this session, this extension)
 */
StorageManager.Local.cleanOptions = function() {
  return browser.storage.local.remove("options");
}
