/**
 * Everything related to do automatic/manual backup
 */
const BackupStorage = {};

BackupStorage.TIMERS = Utils.setObjectPropertiesWith(OptionManager.TIMERS(), undefined);


BackupStorage.init = function () {
  if( !OptionManager.options.backup.download.enable ) {
    return;
  }

  // Start enable timers
  BackupStorage.TIMERS = {};
  for (let t in OptionManager.options.backup.download.time ) {
    if ( OptionManager.options.backup.download.time[t] ) {
      BackupStorage.startTimer(t);
    } else {
      BackupStorage.TIMERS[t] = undefined
    }
  }
}


BackupStorage.stopAll = function () {
  // Stop all timers
  for (let time in BackupStorage.TIMERS ) {
    BackupStorage.stopTimer(time);
  }
}

// Stop a specific timer
BackupStorage.stopTimer = function (timer) {
  if ( BackupStorage.TIMERS[timer] ) {
    clearInterval(BackupStorage.TIMERS[timer]);
  }
  BackupStorage.TIMERS[timer] = undefined;
}

/**
  * Start a specific timer
  * Stop previous one if there was
  */
BackupStorage.startTimer = function (timer) {
  BackupStorage.stopTimer(timer);
  BackupStorage.TIMERS[timer] = setInterval(function(){
    BackupStorage.backup(timer.substring(2));
  }, OptionManager.TIMERS()[timer]);
}



/**
 *  Save the groups in a json file in BackupStorage.LOCATION subfolder in the browser download folder.
 * The file name is "synctabgroups-backup-" with time variable as a suffix.
 * Every new back up overwrites the previous one.
 * A download is immediately removed from the history.
 */
BackupStorage.backup = async function (time, groups=GroupManager.groups) {
  try {
    // Avoid corrupted backup
    if ( GroupManager.checkCorruptedGroups(groups) ) {
      return;
    }

    let url = Utils.createGroupsJsonFile(
      GroupManager.getGroupsWithoutPrivate(groups)
    );

    let id = await browser.downloads.download({
      url: url,
      filename: BackupStorage.LOCATION + "synctabgroups-backup-" + time + ".json",
      conflictAction: "overwrite",
      saveAs: false,
    });

    // Wait complete download for Chrome
    await Utils.waitDownload(id);

    await browser.downloads.erase({
      id:id
    });
    URL.revokeObjectURL(url);
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}
export default BackupStorage