var StorageManager = StorageManager || {};

StorageManager.Local = StorageManager.Local || {};
StorageManager.Local.BACKUP_TIMEOUT;

StorageManager.Local.BACKUP_CHANGE = "backup-change";
StorageManager.Local.eventlistener = new EventListener();
// For test
StorageManager.Local.BACKUP_TIMEOUT_PROMISE = Promise.resolve();

/**
 * Save the groups as JSON object in the local storage (this computer, this session)
 * @param {Array[Group]} groups
 */
StorageManager.Local.saveGroups = async function(groups) {
  let export_groups = GroupManager.getGroupsWithoutPrivate(groups);
  try {
    await browser.storage.local.set({groups: export_groups});
  } catch (e) {
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
StorageManager.Local.loadGroups = async function() {
  try {
    return (await browser.storage.local.get({"groups": []})).groups;
  } catch (e) {
    return "StorageManager.Local.loadGroups failed... " + e;
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
  return browser.storage.local.set({options: options});
}

/**
 * Load the options from the local storage (this computer, this session) and return it as a javascript object
 * If no options were saved, return the template options (see utils.js)
 * @return {Object} options
 */
StorageManager.Local.loadOptions = async function() {
  try {
    return (await browser.storage.local.get({"options": OptionManager.TEMPLATE()})).options;
  } catch (e) {
    return "StorageManager.Local.loadOptions failed... " + e;
  }
}

/**
 * Remove the saved options from the local storage (this computer, this session, this extension)
 */
StorageManager.Local.cleanOptions = async function() {
  return browser.storage.local.remove("options");
}

StorageManager.Local.abortBackUp = function() {
  if (StorageManager.Local.BACKUP_TIMEOUT) {
    clearTimeout(StorageManager.Local.BACKUP_TIMEOUT);
    StorageManager.Local.BACKUP_TIMEOUT = undefined;
    StorageManager.Local.BACKUP_TIMEOUT_PROMISE = Promise.resolve();
  }
}

/**
 * Do a back up right now if last one if > intervalTime
 * Else plan a timeout to reach intervalTime
 * Local Back Up Entry Point
 */
StorageManager.Local.planBackUp = async function(
  groups=GroupManager.groups,
  intervalTime=Math.floor(
    OptionManager.options.backup.local.intervalTime * 3600 * 1000
  ) // ms
) {
  // If not enable exit
  if (!OptionManager.options.backup.local.enable) {
    return;
  }

  let id;

  // Abort previous pending back up...
  StorageManager.Local.abortBackUp();

  // Get last back up date
  const backupList = await StorageManager.Local.getBackUpList();
  // undefined if no back up
  let lastTime = Object.values(backupList).map(d => d.date).sort().reverse()[0]

  // Compare date
  let diffTime = lastTime
    ? Date.now() - lastTime
    : intervalTime;

  // Do it now
  if (diffTime >= intervalTime) {
    id = await StorageManager.Local.addBackup({groups});
    diffTime = 0;
  }

  // Or set specific timer
  //StorageManager.Local.planBackUp();
  StorageManager.Local.BACKUP_TIMEOUT_PROMISE = new Promise((resolve, reject)=>{
    StorageManager.Local.BACKUP_TIMEOUT = setTimeout(async () => {
      await StorageManager.Local.addBackup({groups});
      await StorageManager.Local.planBackUp(groups);
      resolve();
    }, intervalTime-diffTime);
  });

  return id;
}

StorageManager.Local.getBackUpList = async function() {
  // Get List
  return (await browser.storage.local.get({backupList: {}})).backupList;
}

StorageManager.Local.setBackUpList = async function(backupList = {}, {
  fireEvent=true,
}={}) {
  await browser.storage.local.set({backupList: backupList});

  if( fireEvent ) {
    StorageManager.Local.eventlistener.fire(
      StorageManager.Local.BACKUP_CHANGE
    );
  }
}

StorageManager.Local.getBackUp = async function(id) {
  // Get Groups
  return (await browser.storage.local.get(id))[id];
}

StorageManager.Local.addBackup = async function({
  groups = GroupManager.groups,
  time = (new Date()).getTime(),
  fireEvent=true,
}={}) {
  // Get list
  let backupList = await StorageManager.Local.getBackUpList();

  // Add list
    id = "backup-" + time;
  backupList[id] = {
    date: time
  };

  // Save list
  await StorageManager.Local.setBackUpList(backupList, {
    fireEvent: false,
  });

  // save groups
  let export_groups = GroupManager.getGroupsWithoutPrivate(groups);
  await browser.storage.local.set({[id]: export_groups});

  await StorageManager.Local.respectMaxBackUp({
    fireEvent: false,
  });

  if( fireEvent ) {
    StorageManager.Local.eventlistener.fire(
      StorageManager.Local.BACKUP_CHANGE
    );
  }

  return id;
}

StorageManager.Local.respectMaxBackUp = async function({
  maxSave=OptionManager.options.backup.local.maxSave,
  fireEvent=true,
}={}){
  const outnumbering = Object.entries( await StorageManager.Local.getBackUpList())
                            // Desc: recent first
                            .sort((a,b) => b[1].date - a[1].date)
                            // Too much
                            .filter((el, index)=> index>=maxSave);

  // Sequential remove
  let queue = Promise.resolve();
  await Promise.all(
    outnumbering.map((el) => queue = queue.then((res)=>{
        return StorageManager.Local.removeBackup(el[0], {
          fireEvent: false,
        })
      })
    )
  );

  if( fireEvent ) {
    StorageManager.Local.eventlistener.fire(
      StorageManager.Local.BACKUP_CHANGE
    );
  }
}

StorageManager.Local.removeBackup = async function(ids, {
  fireEvent=true,
}={}) {

  if ( !Array.isArray(ids) ) {
    ids = [ids];
  }

  // Get list
  let backupList = await StorageManager.Local.getBackUpList();

  for (let id of ids) {
    if ( backupList.hasOwnProperty(id) ) {
      // Remove list
      delete backupList[id];

    }
    // Remove groups
    await browser.storage.local.remove(id);
  }

  // Save list
  await StorageManager.Local.setBackUpList(backupList, {
    fireEvent: false,
  });

  if( fireEvent ) {
    StorageManager.Local.eventlistener.fire(
      StorageManager.Local.BACKUP_CHANGE
    );
  }
}

StorageManager.Local.clearBackups = async function({
  fireEvent=true,
}={}) {
  const backupList = await StorageManager.Local.getBackUpList();

  for (let backup in backupList) {
    await browser.storage.local.remove(backup);
  }
  await StorageManager.Local.setBackUpList({}, {
    fireEvent: false,
  });

  if( fireEvent ) {
    StorageManager.Local.eventlistener.fire(
      StorageManager.Local.BACKUP_CHANGE
    );
  }
}

StorageManager.Local.getBackUpDate = function(id) {
  if ( id  && id.length ) {
    let dateString = id.split('-')[1];
    if ( dateString  && dateString.length ) {
      let dateInt = parseInt(dateString)
      if ( !isNaN(dateInt) ) {
        return (new Date(dateInt)).toString();
      }
    }
  }
  return "Unknown date";
}
