/**
 *
- isVersionBelow
- prepareExtensionForUpdate
- updateFromBelow_0_6_2
 */
var Event = Event || {};
Event.Install = Event.Install || {};

Event.Install.DEV_TABS = [
  "/tests/test-page/unit.html",
  "/tests/test-page/integration.html",
  "/tests/test-page/unit.html?spec=Comparator%3A%20%20toEqualTabs"
]

Event.Install.onDevelopmentInstall = function() {
  const testUrl = browser.extension.getURL("/tests/test-page/unit.html");

  Event.Install.DEV_TABS.forEach((url)=>{
    browser.tabs.create({
      active: false,
      url: browser.extension.getURL(url),
    });
  });

  /*** Add extra code you want to be done in Development ***/

}


Event.Install.onNewInstall = function() {
  Background.install = true;
  Background.onOpenSettings(false);
}

Event.Install.onUpdate = function() {
  Background.lastVersion = details.previousVersion;
  // Focus Settings if click on notification
  browser.notifications.onClicked.addListener((notificationId)=>{
    if ( notificationId === Background.updateNotificationId ) {
      Background.onOpenSettings(true);
    }
  });
  // Generic message
  browser.notifications.create(Background.updateNotificationId, {
    "type": "basic",
    "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
    "title": browser.i18n.getMessage("notification_update_title") + " " + browser.runtime.getManifest().version,
    "message": browser.i18n.getMessage("notification_update_message"),
  });
}

Event.Install.isVersionBelow = function(version, reference) {
  let splitVersion = version.split('.').map(n => parseInt(n,10)),
      splitReference = reference.split('.').map(n => parseInt(n,10));

  if ( splitVersion[0] < splitReference[0] ) {
    return true;
  }
  if ( splitVersion[0] > splitReference[0] ) {
    return false;
  }

  if ( splitVersion[1] < splitReference[1] ) {
    return true;
  }
  if ( splitVersion[1] > splitReference[1] ) {
    return false;
  }

  if ( splitVersion[2] < splitReference[2] ) {
    return true;
  }
  if ( splitVersion[2] > splitReference[2] ) {
    return false;
  }
  // Equal
  return true;
}

/**
 * Recpect order version increasing
 */
Event.Install.prepareExtensionForUpdate = function(lastVersion, newVersion) {
  if ( !lastVersion ) {
    return;
  }

  if (isVersionBelow(lastVersion, "0.6.2")
        && !isVersionBelow(newVersion, "0.6.2") ){
    Event.Install.updateFromBelow_0_6_2();
  }
}

Event.Install.updateFromBelow_0_6_2 = function (options=OptionManager.options) {
  // Move OptionManager.options.backup -> OptionManager.options.backup.download
  if (options.hasOwnProperty("backup")){
    if ( !options.backup.hasOwnProperty("download") ) {
      options.backup.download = {};
    }
    if ( options.backup.hasOwnProperty("enable")) {
        options.backup.download["enable"] = options.backup.enable;
        delete options.backup.enable;
    }
    if ( options.backup.hasOwnProperty("time")) {
        options.backup.download["time"] = options.backup.time;
        delete options.backup.time;
    }
  }
}
