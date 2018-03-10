var StorageManager = StorageManager || {};

StorageManager.Local = StorageManager.Local || {};

/**
 * Save the groups as JSON object in the local storage (this computer, this session)
 * @param {Array[Group]} groups
 */
StorageManager.Local.saveGroups = async function(groups) {
  let export_groups = GroupManager.getGroupsWithoutPrivate(groups);
  try {
    await browser.storage.local.set({
     groups: export_groups
   });
 } catch(e) {
   let msg = "StorageManager.Local.saveGroups failed :" + e;
   console.error(msg);
   return msg;
 }
}

/**
 * Load the groups from the local storage (this computer, this session) and return it as a javascript object
 * If no groups array was saved, return an empty array
 * @return {Array[Group]} groups
 */
StorageManager.Local.loadGroups = async function( ) {
  try {
    return (await browser.storage.local.get({
      "groups": []
    })).groups;
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
    return (await browser.storage.local.get({
      "options": OptionManager.TEMPLATE()
    })).options;
  } catch ( e ) {
    return "StorageManager.Local.loadOptions failed... " + e ;
  }
}

/**
 * Remove the saved options from the local storage (this computer, this session, this extension)
 */
StorageManager.Local.cleanOptions = async function() {
  return browser.storage.local.remove("options");
}

StorageManager.Local.addBackup = async function(groups=GroupManager.groups) {
  // Get list
  let backupList = await StorageManager.Local.getBackUpList();

  // Add list
  let date = new Date(),
      id = "backup-" + date.getTime();
  backupList[id] = {
    date: date.getTime()
  };

  // Save list
  await StorageManager.Local.setBackUpList(backupList);

  // save groups
  let export_groups = GroupManager.getGroupsWithoutPrivate(groups);
  await browser.storage.local.set({
    [id]: export_groups
  });

  return id;
}

StorageManager.Local.removeBackup = async function(id) {
  // Get list
  let backupList = await StorageManager.Local.getBackUpList();

  // Remove list
  delete backupList[id];

  // Save list
  await StorageManager.Local.setBackUpList(backupList);

  // Remove groups
  await browser.storage.local.remove(id);
}

StorageManager.Local.getBackUpList = async function() {
  // Get List
  return (await browser.storage.local.get({
    backupList: {}
  })).backupList;
}

StorageManager.Local.setBackUpList = async function(backupList={}) {
  return browser.storage.local.set({
    backupList: backupList
  });
}

StorageManager.Local.getBackUp = async function(id) {
  // Get Groups
  return (await browser.storage.local.get(id))[id];
}

StorageManager.Local.clearBackups = async function() {
  const backupList = await StorageManager.Local.getBackUpList();

  for (let backup in backupList ) {
    await browser.storage.local.remove(backup);
  }
  await StorageManager.Local.setBackUpList();
}
