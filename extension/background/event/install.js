/**
 *
- isVersionBelow
- prepareExtensionForUpdate
- updateFromBelow_0_6_2
 */
import BackgroundHelper from '../core/backgroundHelper'
import OptionManager from '../core/optionmanager'

const InstallEvents = {};

InstallEvents.DEV_TABS = [
  //"/tests/test-page/unit.html",
  //"/tests/test-page/integration.html",
  "/options/option-page.html#settings",
  //"/tests/test-page/integration.html?spec=Selector%20-%20",
]

InstallEvents.onDevelopmentInstall = function() {
  InstallEvents.DEV_TABS.forEach((url)=>{
    browser.tabs.create({
      active: false,
      url: browser.extension.getURL(url),
    });
  });

  /*** Add extra code you want to be done in Development ***/
  //Selector.onOpenGroupsSelector({force: true});
}


InstallEvents.onNewInstall = function() {
  BackgroundHelper.install = true;
  BackgroundHelper.onOpenSettings(false);
}

InstallEvents.onUpdate = function(previousVersion) {
  BackgroundHelper.lastVersion = previousVersion;
  // Focus Settings if click on notification
  browser.notifications.onClicked.addListener((notificationId)=>{
    if (notificationId === BackgroundHelper.updateNotificationId) {
      BackgroundHelper.onOpenSettings(true);
    }
  });
  // Generic message
  browser.notifications.create(BackgroundHelper.updateNotificationId, {
    "type": "basic",
    "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
    "title": browser.i18n.getMessage("notification_update_title") + " " + browser.runtime.getManifest().version,
    "message": browser.i18n.getMessage("notification_update_message"),
  });
}

InstallEvents.isVersionBelow = function(version, reference) {
  let splitVersion = version.split('.').map(n => parseInt(n,10)),
    splitReference = reference.split('.').map(n => parseInt(n,10));

  if (splitVersion[0] < splitReference[0]) {
    return true;
  }
  if (splitVersion[0] > splitReference[0]) {
    return false;
  }

  if (splitVersion[1] < splitReference[1]) {
    return true;
  }
  if (splitVersion[1] > splitReference[1]) {
    return false;
  }

  if (splitVersion[2] < splitReference[2]) {
    return true;
  }
  if (splitVersion[2] > splitReference[2]) {
    return false;
  }
  // Equal
  return true;
}

/**
 * Recpect order version increasing
 */
InstallEvents.prepareExtensionForUpdate = function(lastVersion, newVersion) {
  if (!lastVersion) {
    return;
  }

  if (InstallEvents.isVersionBelow(lastVersion, "0.6.2")
        && !InstallEvents.isVersionBelow(newVersion, "0.6.2")) {
    InstallEvents.updateFromBelow_0_6_2();
  }
}

InstallEvents.updateFromBelow_0_6_2 = function(options=OptionManager.options) {
  // Move OptionManager.options.backup -> OptionManager.options.backup.download
  if (options.hasOwnProperty("backup")) {
    if (!options.backup.hasOwnProperty("download")) {
      options.backup.download = {};
    }
    if (options.backup.hasOwnProperty("enable")) {
      options.backup.download["enable"] = options.backup.enable;
      delete options.backup.enable;
    }
    if (options.backup.hasOwnProperty("time")) {
      options.backup.download["time"] = options.backup.time;
      delete options.backup.time;
    }
  }
}

export default InstallEvents