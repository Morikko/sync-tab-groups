import Utils from '../utils/utils'
import LogManager from '../error/logmanager'
import GroupManager from '../core/groupmanager'
import TaskManager from '../utils/taskManager'
import EventListener from '../utils/eventlistener'
import WindowManager from './windowmanager'
import OPTION_CONSTANTS from './OPTION_CONSTANTS'
import TabHidden from '../core/tabhidden'
import ExtensionStorageManager from '../storage/storageManager'

const OptionManager = {};
window.OptionManager = OptionManager;

OptionManager.EVENT_CHANGE = 'options-change';

//OptionManager.options = OPTION_CONSTANTS.TEMPLATE();
OptionManager.eventlistener = new EventListener();
OptionManager.checkerInterval = undefined;

OptionManager.repeatedtask = new TaskManager.RepeatedTask(5000);

/**
 * Change option value
 * @param {string} optionName - each part is separated with '-'
 * @param {Object} optionValue - the value to set
 */
OptionManager.updateOption = async function(optionName, optionValue) {
  switch (optionName) {
  case "backup-local-intervalTime":
    optionValue = parseFloat(optionValue, 10);
    optionValue = Math.max(0.01, optionValue);
    break;
  case "backup-local-maxSave":
    optionValue = parseInt(optionValue, 10);
    optionValue = Math.max(1, optionValue);
    break;
  }
  if (optionValue === undefined || isNaN(optionValue)) {
    return;
  }

  optionName.split('-').reduce((a, b, index, array) => {
    if (index === array.length - 1)
      a[b] = optionValue;
    return a[b];
  }, OptionManager.options);

  switch (optionName) {
  case "privateWindow-sync":
    // TODO: do the changes for privates w ?
    //OptionManager.onPrivateWindowSyncChange(optionValue);
    break;
  case "pinnedTab-sync":
    OptionManager.onPinnedTabSyncChange(optionValue);
    break;
  case "groups-removeEmptyGroup":
    OptionManager.onRemoveEmptyGroupChange();
    break;
  case "popup-whiteTheme":
    OptionManager.onPopupThemeChange(optionValue);
    break;
  case "groups-showGroupTitleInWindow":
    OptionManager.onShowGroupTitleInWindowChange(optionValue);
    break;
  case "groups-sortingType":
    GroupManager.eventlistener.fire(GroupManager.EVENT_PREPARE);
    break;
  case "backup-download-enable":
    OptionManager.onDownloadBackUpEnableChange(optionValue);
    break;
  case "backup-local-enable":
    await OptionManager.onLocalBackUpEnableChange(optionValue);
    break;
  case "backup-local-intervalTime":
    await ExtensionStorageManager.Local.planBackUp();
    break;
  case "backup-local-maxSave":
    await ExtensionStorageManager.Local.respectMaxBackUp();
    break;
  case "groups-closingState":
    await OptionManager.onClosingStateChange(optionValue);
    break;
  case "groups-removeUnknownHiddenTabs":
    await OptionManager.onRemoveUnknownHiddenTabsChange(optionValue);
    break;
  }
  if (optionName.startsWith("backup-time-")) {
    OptionManager.onBackUpTimerChange(
      optionName.substring("backup-download-time-".length),
      optionValue);
  }

  OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
}

OptionManager.getOptionValue = function(optionName) {
  let optionValue = optionName.split('-').reduce((a, b, index, array) => {
    return a[b];
  }, OptionManager.options);
  return optionValue;
}

/**
  * Init or stop the automatic back up process
  */
OptionManager.onClosingStateChange = async function(value) {
  if (value === OPTION_CONSTANTS.CLOSE_NORMAL) {
    await TabHidden.closeAllHiddenTabsInGroups(GroupManager.groups);
  } else if (value === OPTION_CONSTANTS.CLOSE_HIDDEN) {
    await OptionManager.updateOption("pinnedTab-sync", false);
  }
}

OptionManager.onRemoveUnknownHiddenTabsChange = async function(value) {
  if (value) {
    await TabHidden.startCleaningUnknownHiddenTabsProcess({doItNow: true});
  } else {
    TabHidden.stopCleaningUnknownHiddenTabsProcess();
  }
}


/**
  * Init or stop the automatic back up process
  */
OptionManager.onDownloadBackUpEnableChange = function(value) {
  if (value) {
    ExtensionStorageManager.Backup.init();
  } else {
    ExtensionStorageManager.Backup.stopAll();
  }
}

OptionManager.onLocalBackUpEnableChange = async function(value) {
  if (value) {
    await ExtensionStorageManager.Local.planBackUp();
  } else {
    ExtensionStorageManager.Local.abortBackUp();
  }
}

/**
  * Init or stop the automatic back up process
  */
OptionManager.onBackUpTimerChange = function(timer, value) {
  if (value) {
    ExtensionStorageManager.Backup.startTimer(timer);
  } else {
    ExtensionStorageManager.Backup.stopTimer(timer);
  }
}

/**
 * Add/Remove title prefix in window
 * @param {boolean} addTitle
 */
OptionManager.onShowGroupTitleInWindowChange = function(addTitle) {
  if (!Utils.hasWindowTitlePreface()) {
    return;
  }
  for (let g of GroupManager.groups) {
    if (g.windowId !== browser.windows.WINDOW_ID_NONE) {
      if (addTitle) {
        WindowManager.setWindowPrefixGroupTitle(g.windowId, g);
      } else {
        browser.windows.update(
          g.windowId, {
            titlePreface: " ",
          }
        );
      }
    }
  }
}

/**
 * Change the popup icon according to the preferences
 * @param {boolean} theme - color to apply
 */
OptionManager.onPopupThemeChange = function(theme) {
  Utils.setBrowserActionIcon(theme);
}

/**
 * Adapt groups when option change
 * state: true -> sync private window already opened
 * state: false -> remove groups in private window open
 * @param {boolean} state
 */
OptionManager.onPrivateWindowSyncChange = async function(state) {
  try {
    if (state) {
      await GroupManager.integrateAllOpenedWindows();
    } else {
      await GroupManager.removeGroupsInPrivateWindow();
    }
    return "OptionManager.onPrivateWindowSyncChange done!";
  } catch (e) {
    LogManager.error(e);
  }
}

/**
 * Refresh opened groups to add/remove pinned tabs
 * Pinned tabs in closed groups are not removed
 */
OptionManager.onPinnedTabSyncChange = async function(value) {
  if (value
    && OptionManager.options.groups.closingState === OPTION_CONSTANTS.CLOSE_HIDDEN) {
    await OptionManager.updateOption(
      "groups-closingState", OPTION_CONSTANTS.CLOSE_NORMAL
    );
  }
  try {
    await GroupManager.updateAllOpenedGroups();
    return "OptionManager.onPinnedTabSyncChange done!";
  } catch (e) {
    LogManager.error(e);
  }
}

OptionManager.onRemoveEmptyGroupChange = function() {
  if (OptionManager.options.groups.removeEmptyGroup) {
    GroupManager.removeEmptyGroup();
  }
}

/**
 * Asynchronous function
 * Get the saved options if exist else set template options
 * @returns {Promise}
 */
OptionManager.init = async function() {
  try {
    let options = await ExtensionStorageManager.Local.loadOptions();
    OptionManager.options = OptionManager.check_integrity(options);
    OptionManager.initEventListener();
    OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
    return "OptionManager.init done";
  } catch (e) {
    LogManager.error(e);
  }
}

/**
 * Check that options object has all the good properties
 * @param {Object} options
 * @returns {Object} options - verified
 */
OptionManager.check_integrity = function(options) {
  let ref_options = OPTION_CONSTANTS.TEMPLATE();
  Utils.mergeObject(options, ref_options);
  return options;
}

/**
 * Save options
 * In local storage
 * Asynchronous
 * @returns {Promise}
 */
OptionManager.store = function() {
  if (OptionManager.checkCorruptedOptions(OptionManager.options)) {
    return;
  }
  return ExtensionStorageManager.Local.saveOptions(OptionManager.options);
}

OptionManager.initEventListener = function() {
  OptionManager.eventlistener.on(OptionManager.EVENT_CHANGE,
    () => {
      OptionManager.repeatedtask.add(
        () => {
          OptionManager.store();
        }
      )
    });

  // Check options are not corrupted every 30s
  OptionManager.checkerInterval = setInterval(()=>{
    OptionManager.checkCorruptedOptions(OptionManager.options);
  }, 30000);
}

OptionManager.reloadOptionsFromDisk = async function() {
  OptionManager.options = await ExtensionStorageManager.Local.loadGroups();
}

OptionManager.checkCorruptedOptions = function(options=OptionManager.options) {
  const {is: isCorrupted, msg: corruptedMessage} = Utils.checkCorruptedObject(options, "options");
  if (isCorrupted) {
    LogManager.warning("OptionManager.checkCorruptedOptions has detected a corrupted options: " + corruptedMessage);
    // Don't fix data in debug mode for allowing to analyze
    if (!Utils.DEBUG_MODE) {
      OptionManager.reloadOptionsFromDisk();
    }
  }
  return isCorrupted;
}

OptionManager.isClosingAlived = function() {
  //return OptionManager.options.groups.closingState === OPTION_CONSTANTS.CLOSE_ALIVE;
  return false;
}

OptionManager.isClosingHidden = function() {
  return OptionManager.options.groups.closingState === OPTION_CONSTANTS.CLOSE_HIDDEN;
}

export default OptionManager