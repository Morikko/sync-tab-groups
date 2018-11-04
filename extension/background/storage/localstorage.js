import EventListener from '../event/event'
import GroupManager from '../core/groupmanager'
import OptionManager from '../core/optionmanager'
import LogManager from '../error/logmanager'

const LocalStorage = {};
LocalStorage.BACKUP_TIMEOUT = null;

LocalStorage.BACKUP_CHANGE = "backup-change";
LocalStorage.eventlistener = new EventListener();
// For test
LocalStorage.BACKUP_TIMEOUT_PROMISE = Promise.resolve();

/**
 * Save the groups as JSON object in the local storage (this computer, this session)
 * @param {Array<Group>} groups
 */
LocalStorage.saveGroups = async function(groups) {
  let export_groups = GroupManager.getGroupsWithoutPrivate(groups);
  try {
    await browser.storage.local.set({groups: export_groups});
    if (export_groups.length === 0) LogManager.information(`LocalStorage.saveGroups saved empty group.`)
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
}

/**
 * Load the groups from the local storage (this computer, this session) and return it as a javascript object
 * If no groups array was saved, return an empty array
 * @returns {Array<Group>} groups
 */
LocalStorage.loadGroups = async function() {
  try {
    const {groups} = await browser.storage.local.get({"groups": []})
    if (groups.length === 0) LogManager.information(`LocalStorage.loadGroups loaded empty group.`)
    return groups;
  } catch (e) {
    return "LocalStorage.loadGroups failed... " + e;
  }
}

/**
 * Remove the saved groups from the local storage  (this computer, this session, this extension)
 */
LocalStorage.cleanGroups = function() {
  return browser.storage.local.remove("groups");
}

/**
 * Save the options as JSON object in the local storage (this computer, this session)
 * @param {Object} options
 */
LocalStorage.saveOptions = function(options) {
  return browser.storage.local.set({options: options});
}

/**
 * Load the options from the local storage (this computer, this session) and return it as a javascript object
 * If no options were saved, return the template options (see utils.js)
 * @returns {Object} options
 */
LocalStorage.loadOptions = async function() {
  try {
    return (await browser.storage.local.get({"options": OptionManager.TEMPLATE()})).options;
  } catch (e) {
    return "LocalStorage.loadOptions failed... " + e;
  }
}

/**
 * Remove the saved options from the local storage (this computer, this session, this extension)
 */
LocalStorage.cleanOptions = async function() {
  return browser.storage.local.remove("options");
}

LocalStorage.abortBackUp = function() {
  if (LocalStorage.BACKUP_TIMEOUT) {
    clearTimeout(LocalStorage.BACKUP_TIMEOUT);
    LocalStorage.BACKUP_TIMEOUT = undefined;
    LocalStorage.BACKUP_TIMEOUT_PROMISE = Promise.resolve();
  }
}

/**
 * Do a back up right now if last one if > intervalTime
 * Else plan a timeout to reach intervalTime
 * Local Back Up Entry Point
 */
LocalStorage.planBackUp = async function(
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
  LocalStorage.abortBackUp();

  // Get last back up date
  const backupList = await LocalStorage.getBackUpList();
  // undefined if no back up
  let lastTime = Object.values(backupList).map(d => d.date).sort().reverse()[0]

  // Compare date
  let diffTime = lastTime
    ? Date.now() - lastTime
    : intervalTime;

  // Do it now
  if (diffTime >= intervalTime) {
    id = await LocalStorage.addBackup({groups});
    diffTime = 0;
  }

  // Or set specific timer
  //LocalStorage.planBackUp();
  LocalStorage.BACKUP_TIMEOUT_PROMISE = new Promise((resolve, reject)=>{
    LocalStorage.BACKUP_TIMEOUT = setTimeout(async function doBackUpAfterTimeout() {
      await LocalStorage.addBackup({groups});
      await LocalStorage.planBackUp(groups);
      resolve();
    }, intervalTime-diffTime);
  });

  return id;
}

LocalStorage.getBackUpList = async function() {
  // Get List
  return (await browser.storage.local.get({backupList: {}})).backupList;
}

LocalStorage.setBackUpList = async function(backupList = {}, {
  fireEvent=true,
}={}) {
  await browser.storage.local.set({backupList: backupList});

  if (fireEvent) {
    LocalStorage.eventlistener.fire(
      LocalStorage.BACKUP_CHANGE
    );
  }
}

LocalStorage.getBackUp = async function(id) {
  // Get Groups
  return (await browser.storage.local.get(id))[id];
}

LocalStorage.addBackup = async function({
  groups = GroupManager.groups,
  time = (new Date()).getTime(),
  fireEvent=true,
}={}) {
  // Get list
  let backupList = await LocalStorage.getBackUpList();

  // Add list
  const id = "backup-" + time;
  backupList[id] = {
    date: time,
  };

  // Save list
  await LocalStorage.setBackUpList(backupList, {
    fireEvent: false,
  });

  // save groups
  let export_groups = GroupManager.getGroupsWithoutPrivate(groups);
  await browser.storage.local.set({[id]: export_groups});

  await LocalStorage.respectMaxBackUp({
    fireEvent: false,
  });

  if (fireEvent) {
    LocalStorage.eventlistener.fire(
      LocalStorage.BACKUP_CHANGE
    );
  }

  return id;
}

LocalStorage.respectMaxBackUp = async function({
  maxSave=OptionManager.options.backup.local.maxSave,
  fireEvent=true,
}={}) {
  const outnumbering = Object.entries(
    await LocalStorage.getBackUpList()
  )
    // Desc: recent first
    .sort((a,b) => b[1].date - a[1].date)
    // Too much
    .filter((el, index)=> index>=maxSave);

  // Sequential remove
  let queue = Promise.resolve();
  await Promise.all(
    outnumbering.map((el) => queue = queue.then((res)=>{
      return LocalStorage.removeBackup(el[0], {
        fireEvent: false,
      })
    })
    )
  );

  if (fireEvent) {
    LocalStorage.eventlistener.fire(
      LocalStorage.BACKUP_CHANGE
    );
  }
}

LocalStorage.removeBackup = async function(ids, {
  fireEvent=true,
}={}) {

  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  // Get list
  let backupList = await LocalStorage.getBackUpList();

  for (let id of ids) {
    if (backupList.hasOwnProperty(id)) {
      // Remove list
      delete backupList[id];

    }
    // Remove groups
    await browser.storage.local.remove(id);
  }

  // Save list
  await LocalStorage.setBackUpList(backupList, {
    fireEvent: false,
  });

  if (fireEvent) {
    LocalStorage.eventlistener.fire(
      LocalStorage.BACKUP_CHANGE
    );
  }
}

LocalStorage.clearBackups = async function({
  fireEvent=true,
}={}) {
  const backupList = await LocalStorage.getBackUpList();

  for (let backup in backupList) {
    await browser.storage.local.remove(backup);
  }
  await LocalStorage.setBackUpList({}, {
    fireEvent: false,
  });

  if (fireEvent) {
    LocalStorage.eventlistener.fire(
      LocalStorage.BACKUP_CHANGE
    );
  }
}

LocalStorage.getBackUpDate = function(id) {
  if (id  && id.length) {
    let dateString = id.split('-')[1];
    if (dateString  && dateString.length) {
      let dateInt = parseInt(dateString)
      if (!isNaN(dateInt)) {
        return (new Date(dateInt)).toString();
      }
    }
  }
  return "Unknown date";
}

export default LocalStorage