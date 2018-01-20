/**
 * Settings of the extension
 Change:
 - updateOption

 Reactions:
 - onShowGroupTitleInWindowChange
 - onPopupThemeChange
 - onPrivateWindowSyncChange
 - onPinnedTabSyncChange
 - onRemoveEmptyGroupChange

 Initialization:
 - init
 - initEventListener
 - store
 - check_integrity

 * Event: EVENT_CHANGE
 * DelayedTask: store() (Limited mode)
 */

var OptionManager = OptionManager || {};

OptionManager.EVENT_CHANGE = 'options-change';

//OptionManager.options = OptionManager.TEMPLATE();
OptionManager.eventlistener = new EventListener();

OptionManager.repeatedtask = new TaskManager.RepeatedTask(1000);

/**
 * Change option value
 * @param {String} state - each part is separated with '-'
 * @param {Object} optionValue - the value to set
 */
OptionManager.updateOption = function(optionName, optionValue) {
  optionName.split('-').reduce((a, b, index, array) => {
    if (index === array.length - 1)
      a[b] = optionValue;
    return a[b];
  }, OptionManager.options);
  OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);

  switch (optionName) {
    case "privateWindow-sync":
      // TODO: do the changes for privates w ?
      //OptionManager.onPrivateWindowSyncChange(optionValue);
      break;
    case "pinnedTab-sync":
      OptionManager.onPinnedTabSyncChange();
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
  }
}

/**
 * Add/Remove title prefix in window
 * @param {boolean} addTitle
 */
OptionManager.onShowGroupTitleInWindowChange = function(addTitle) {
  if ( Utils.isChrome() ) { // Chrome Incompatibility: doesn't handle title preface
    return;
  }
  for (let g of GroupManager.groups) {
    if (g.windowId !== browser.windows.WINDOW_ID_NONE) {
      if (addTitle) {
        WindowManager.setWindowPrefixGroupTitle(g.windowId, g);
      } else {
        browser.windows.update(
          g.windowId, {
            titlePreface: " "
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
    let msg = "OptionManager.onPrivateWindowSyncChange failed; " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Refresh opened groups to add/remove pinned tabs
 * Pinned tabs in closed groups are not removed
 */
OptionManager.onPinnedTabSyncChange = async function() {
  try {
    await GroupManager.updateAllOpenedGroups();
    return "OptionManager.onPinnedTabSyncChange done!";
  } catch (e) {
    let msg = "OptionManager.onPinnedTabSyncChange failed; " + e;
    console.error(msg);
    return msg;
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
 * @return {Promise}
 */
OptionManager.init = async function() {
  try {
    let options = await StorageManager.Local.loadOptions();
    OptionManager.options = OptionManager.check_integrity(options);
    OptionManager.initEventListener();
    OptionManager.eventlistener.fire(OptionManager.EVENT_CHANGE);
    return "OptionManager.init done";
  } catch (e) {
    let msg = "OptionManager.init failed: " + e;
    console.error(msg);
    return msg;
  }
}

/**
 * Check that options object has all the good propreties
 * @param {Object} options
 * @return {Object} options - verified
 */
OptionManager.check_integrity = function(options) {
  var ref_options = OptionManager.TEMPLATE();
  Utils.mergeObject(options, ref_options);
  return options;
}

/**
 * Save options
 * In local storage
 * Asynchronous
 * @return {Promise}
 */
OptionManager.store = function() {
  return StorageManager.Local.saveOptions(OptionManager.options);
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
}
