import LogManager from "../error/logmanager"
import Utils from '../utils/utils'
import TaskManager from '../utils/taskManager'
import ExtensionStorageManager from '../storage/storageManager'
import TabManager from './tabmanager/tabManager'
import OptionManager from './optionmanager'
import GroupManager from './groupmanager'
import WindowManager from './windowmanager'
import ImportSelector from './importSelector'
import SELECTOR_TYPE from './SELECTOR_TYPE'

const BackgroundHelper = {}

BackgroundHelper.refreshOptionsUI = function() {
  Utils.sendMessage("Option:Changed", {
    options: OptionManager.options,
  });
};

BackgroundHelper.refreshBackupListUI = async function() {
  Utils.sendMessage("BackupList:Changed", {
    backupList: await ExtensionStorageManager.Local.getBackUpList(),
  });
};

BackgroundHelper.refreshUi = function() {
  Utils.sendMessage("Groups:Changed", {
    groups: GroupManager.groups,
    delayedTasks: TaskManager.fromUI,
  });
};

/* Background.onRemoveHiddenTab = function({tabId}) {
  TabHidden.closeHiddenTabs(tabId);
};

Background.onRemoveHiddenTabsInGroup = function({groupId}) {
  const groupIndex = GroupManager.getGroupIndexFromGroupId(groupId);
  const tabIds = GroupManager.groups[groupIndex].tabs.map(({id}) => id);
  TabHidden.closeHiddenTabs(tabIds);
}; */

BackgroundHelper.onOpenGroupInNewWindow = function({groupId}) {
  WindowManager.selectGroup(groupId, {newWindow: true});
};

BackgroundHelper.onOpenGuide = function() {
  Utils.openUrlOncePerWindow(
    "https://morikko.github.io/synctabgroups/#guide"
  );
}

BackgroundHelper.onGroupAdd = function({title}) {
  try {
    GroupManager.addGroup({title});
  } catch (e) {
    LogManager.error(e);
  }
};

BackgroundHelper.onGroupAddWithTab = function({
  title,
  sourceGroupId,
  tabIndex,
}) {
  TabManager.moveTabToNewGroup(
    sourceGroupId,
    tabIndex,
    title,
  );
};

BackgroundHelper.onGroupClose = function({
  groupId,
  taskRef,
}) {
  let delayedFunction = async() => {
    try {
      await WindowManager.closeGroup(
        groupId,
        {close_window: false}
      );
      BackgroundHelper.refreshUi();
      return "Background.onGroupClose done!";
    } catch (e) {
      LogManager.error(e);
    }
  };

  TaskManager.fromUI[TaskManager.CLOSE_REFERENCE].manage(
    taskRef,
    delayedFunction,
    groupId,
  );
};

BackgroundHelper.onGroupRemove = async function({
  groupId,
  taskRef,
}) {
  return new Promise((resolve, reject)=>{
    let delayedFunction = async() => {
      await WindowManager.removeGroup(
        groupId
      );
      resolve();
    };

    TaskManager.fromUI[TaskManager.REMOVE_REFERENCE].manage(
      taskRef,
      delayedFunction,
      groupId,
    );
  })
};

BackgroundHelper.onGroupRename = function({
  groupId,
  title,
}) {
  GroupManager.renameGroup(
    GroupManager.getGroupIndexFromGroupId(groupId),
    title
  );
};

BackgroundHelper.onGroupSelect = function({groupId}) {
  WindowManager.selectGroup(
    groupId,
    {newWindow: false}
  );
};

BackgroundHelper.onTabSelect = function({
  tabIndex,
  groupId,
  newWindow,
}) {
  TabManager.selectTab(
    tabIndex,
    groupId,
    newWindow,
  );
};

BackgroundHelper.onMoveTabToGroup = async function({
  sourceGroupId,
  sourceTabIndex,
  targetGroupId,
  targetTabIndex,
}) {
  await TabManager.moveTabBetweenGroups(
    sourceGroupId,
    sourceTabIndex,
    targetGroupId,
    targetTabIndex,
  );
};

BackgroundHelper.onBookmarkSave = function() {
  ExtensionStorageManager.Bookmark.backUp(GroupManager.getCopy(), true);
};

BackgroundHelper.onOpenSettings = function(active=true) {
  Utils.openUrlOncePerWindow(browser.extension.getURL(
    "/optionpages/option-page.html"
  ), active);
};

BackgroundHelper.onRemoveAllGroups = function() {
  GroupManager.removeAllGroups();
};

BackgroundHelper.onReloadGroups = function() {
  GroupManager.reloadGroupsFromDisk();
};

BackgroundHelper.changeSynchronizationStateOfWindow = async function(args) {
  const {
    isSync,
    windowId,
  } = args
  try {
    if (isSync) {
      await WindowManager.integrateWindow(windowId, {even_new_one: true});
    } else {
      try {
        let currentGroupId = GroupManager.getGroupIdInWindow(
          windowId
        );
        GroupManager.removeGroupFromId(currentGroupId);
      } catch (e) {
        LogManager.error(e, {
          isSync,
          windowId,
        });
      }
    }
  } catch (e) {
    LogManager.error(e, {args: arguments});
  }
};

BackgroundHelper.onTabClose = async function({
  groupId,
  tabIndex,
}) {
  try {
    await GroupManager.removeTabFromIndexInGroupId(
      groupId,
      tabIndex
    );
  } catch (e) {
    LogManager.error(e);
  }
};

BackgroundHelper.onTabOpen = async function({
  tab,
}) {
  try {
    const currentWindow = await browser.windows.getLastFocused();
    await TabManager.openListOfTabs(
      [tab],
      currentWindow.id, {
        inLastPos: true,
      })
  } catch (e) {
    LogManager.error(e);
  }
};

BackgroundHelper.onImportGroups = function({
  content_file,
  filename,
}) {
  ImportSelector.onOpenGroupsSelector({
    title: 'From file: ' + filename,
    groups: ExtensionStorageManager.File.importGroupsFromFile(content_file),
    type: SELECTOR_TYPE.IMPORT,
  });
};

BackgroundHelper.onExportGroups = function() {
  ImportSelector.onOpenGroupsSelector({
    title: 'Current groups at ' + new Date(),
    groups: GroupManager.getCopy(),
    type: SELECTOR_TYPE.EXPORT,
  });
};

BackgroundHelper.onExportBackUp = async function(id) {
  ImportSelector.onOpenGroupsSelector({
    title: 'Back up: ' + ExtensionStorageManager.Local.getBackUpDate(id),
    groups: (await ExtensionStorageManager.Local.getBackUp(id)),
    type: SELECTOR_TYPE.EXPORT,
  });
};

BackgroundHelper.onImportBackUp = async function(id) {
  ImportSelector.onOpenGroupsSelector({
    title: 'Back up: ' + ExtensionStorageManager.Local.getBackUpDate(id),
    groups: (await ExtensionStorageManager.Local.getBackUp(id)),
    type: SELECTOR_TYPE.IMPORT,
  });
};

BackgroundHelper.onRemoveBackUp = async function(ids) {
  await ExtensionStorageManager.Local.removeBackup(ids);
};

BackgroundHelper.onGroupChangePosition = async function({
  groupId,
  position,
}) {
  await GroupManager.changeGroupPosition(
    groupId,
    position
  );
};

BackgroundHelper.onTabChangePin = async function({
  groupId,
  tabIndex,
}) {
  await TabManager.changePinState(
    groupId,
    tabIndex,
  );
};

BackgroundHelper.onChangeExpand = function({
  groupId,
  expand,
}) {
  GroupManager.changeExpandState(
    groupId,
    expand,
  );
};

BackgroundHelper.refreshData = function({
  all_tabs=false,
}={}) {
  if (all_tabs) {
    BackgroundHelper.sendAllTabs();
  } else {
    BackgroundHelper.refreshUi();
  }
  BackgroundHelper.refreshOptionsUI();
}

BackgroundHelper.sendAllTabs = async function() {
  const windows = await browser.windows.getAll({populate: true});
  const groups = windows.map((window, index) =>{
    return new GroupManager.Group({
      id: index,
      title: "Window " + window.id,
      tabs: window.tabs,
      windowId: window.id,
      incognito: window.incognito,
    })
  })
  Utils.sendMessage("Tabs:All", {
    groups,
  });
}

// TODO: Shared variables, do we like...
BackgroundHelper.updateNotificationId = "UPDATE_NOTIFICATION";
// When the extension updated, contains the previsou version
BackgroundHelper.lastVersion = null
// True when it is a new extension installation
BackgroundHelper.install = null

export default BackgroundHelper