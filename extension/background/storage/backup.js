/**
 * Everything related to do automatic/manual backup
 */
var StorageManager = StorageManager || {};
StorageManager.Backup = StorageManager.Backup || {};

StorageManager.Backup.TIMERS = Utils.setObjectPropertiesWith(OptionManager.TIMERS(), undefined);


StorageManager.Backup.init = function () {
  if( !OptionManager.options.backup.download.enable ) {
    return;
  }

  // Start enable timers
  StorageManager.Backup.TIMERS = {};
  for (let t in OptionManager.options.backup.download.time ) {
    if ( OptionManager.options.backup.download.time[t] ) {
      StorageManager.Backup.startTimer(t);
    } else {
      StorageManager.Backup.TIMERS[t] = undefined
    }
  }
}


StorageManager.Backup.stopAll = function () {
  // Stop all timers
  for (let time in StorageManager.Backup.TIMERS ) {
    StorageManager.Backup.stopTimer(time);
  }
}

// Stop a specific timer
StorageManager.Backup.stopTimer = function (timer) {
  if ( StorageManager.Backup.TIMERS[timer] ) {
    clearInterval(StorageManager.Backup.TIMERS[timer]);
  }
  StorageManager.Backup.TIMERS[timer] = undefined;
}

/**
  * Start a specific timer
  * Stop previous one if there was
  */
StorageManager.Backup.startTimer = function (timer) {
  StorageManager.Backup.stopTimer(timer);
  StorageManager.Backup.TIMERS[timer] = setInterval(function(){
    StorageManager.Backup.backup(timer.substring(2));
  }, OptionManager.TIMERS()[timer]);
}



/**
 *  Save the groups in a json file in StorageManager.Backup.LOCATION subfolder in the browser download folder.
 * The file name is "synctabgroups-backup-" with time variable as a suffix.
 * Every new back up overwrites the previous one.
 * A download is immediately removed from the history.
 */
StorageManager.Backup.backup = async function (time, groups=GroupManager.groups) {
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
      filename: StorageManager.Backup.LOCATION + "synctabgroups-backup-" + time + ".json",
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
    console.error("StorageManager.Backup.backup: " + e);
  }
}
