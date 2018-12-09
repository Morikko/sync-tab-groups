/**
 * Entry Point of the Extension
 * Init the Data -> Events
 * Manage the messages with all the extensive parts of the Extension
 */

import LogManager from "./error/logmanager"
import Utils from './utils/utils'
import TaskManager from './utils/taskManager'
import ExtensionStorageManager from './storage/storageManager'
import Events from './event/event'
import Messenger from './messenger/messenger'
import TabManager from './core/tabmanager/tabManager'
import OptionManager from './core/optionmanager'
import GroupManager from './core/groupmanager'
import ContextMenu from './core/contextmenus'
import BackgroundHelper from './core/backgroundHelper'

LogManager.LOCATION = LogManager.BACK

/**
 * Only read groups data, never write directly
 */
async function init() {
  LogManager.init();
  LogManager.information(LogManager.EXTENSION_START);

  await OptionManager.init();
  await GroupManager.init();

  Events.Install.prepareExtensionForUpdate(
    BackgroundHelper.lastVersion,
    (browser.runtime.getManifest()).version
  );

  Events.Extension.initSendDataEventListener();
  Events.Tabs.initTabsEventListener();
  Events.Windows.initWindowsEventListener();
  Events.Commands.initCommandsEventListener();
  ContextMenu.initContextMenus();

  browser.runtime.onMessage.addListener(Messenger.Groups.popupMessenger);
  browser.runtime.onMessage.addListener(Messenger.Options.optionMessenger);
  browser.runtime.onMessage.addListener(Messenger.Selector.selectorMessenger);
  browser.runtime.onMessage.addListener((message)=>{
    if (Utils.UTILS_SHOW_MESSAGES) {
      console.log(message);
    }
  });

  Utils.setBrowserActionIcon(OptionManager.options.popup.whiteTheme);

  BackgroundHelper.refreshUi();
  BackgroundHelper.refreshOptionsUI();

  await Utils.wait(2000);
  ExtensionStorageManager.Local.planBackUp();
  ExtensionStorageManager.Backup.init();
  BackgroundHelper.install = false;

  LogManager.information(LogManager.EXTENSION_INITIALIZED, {
    groups: GroupManager.groups.map((group) => ({
      id: group.id,
      tabsLength: group.tabs.length,
      windowId: group.windowId,
    })),
  });
}

/*** Init CRITICAL Event ***/
browser.runtime.onInstalled.addListener((details) => {
  // Only when the extension is installed for the first time
  if (details.reason === "install") {
    Events.Install.onNewInstall();
    LogManager.information(LogManager.EXTENSION_INSTALLED);
  // Development mode detection
  } else if ((Utils.isFirefox() && details.temporary)
      || (Utils.isChrome() && details.reason === "update" && (browser.runtime.getManifest()).version === details.previousVersion)) {

    Events.Install.onDevelopmentInstall();
  // Extension update detection
  } else if (details.reason === "update"
      && (browser.runtime.getManifest()).version !== details.previousVersion) {
    Events.Install.onUpdate(details.previousVersion);
    LogManager.information(LogManager.EXTENSION_UPDATED);
  }
});

if (Utils.isChrome()) { // Extension tabs are closed on update
  browser.runtime.onUpdateAvailable.addListener(TabManager.undiscardAll);
}

// START of the extension
init();