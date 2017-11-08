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
 * Clean the local storage (this computer, this session, this extension)
 */
StorageManager.Local.cleanGroups = function() {
  return browser.storage.local.clear();
}
