/**
 * Everything related to save file on the disk
 */
var StorageManager = StorageManager || {};
StorageManager.File = StorageManager.File || {};

StorageManager.File.downloadGroups = async function(groups) {
  try {
    let export_groups = GroupManager.getGroupsWithoutPrivate(groups);

    // Clean tabs
    export_groups = export_groups.map((group)=>{
      let export_group = Utils.getCopy(group);
      return export_group;
    });

    let d = new Date();
    let url = Utils.createGroupsJsonFile(export_groups, {prettify:true});
    let filename = "syncTabGroups" + "-" + "manual" + "-" + d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2) + ".json";

    let id = await browser.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });

    await Utils.waitDownload(id);

    URL.revokeObjectURL(url);
    return true;

  } catch (e) {
    LogManager.error(e, {arguments});
    return false;
  }
}

StorageManager.File.importGroupsFromFile = function(content_file) {
  try {
    if (!content_file.hasOwnProperty('version')) {
      throw Error("ImportGroups: Content file is not in a supported format.");
    }
    let groups = [];

    if (content_file['version'][0] === "tabGroups" ||
      content_file['version'][0] === "sessionrestore") {
      groups = StorageManager.File.importTabGroups(content_file);
    } else if (content_file['version'][0] === "syncTabGroups") {
      groups = StorageManager.File.importSyncTabGroups(content_file);
    } else {
      throw Error("ImportGroups: Content file is not in a supported format.");
    }

    GroupManager.prepareGroups(groups, {fireEvent:false});

    return groups;
  } catch(e) {
    browser.notifications.create({
      "type": "basic",
      "iconUrl": browser.extension.getURL("/share/icons/tabspace-active-64.png"),
      "title": "Impossible to read the file",
      "message": e.message,
      "eventTime": 4000,
    });
    LogManager.error(e, {arguments});
  }
}


StorageManager.File.importSyncTabGroups = function(content_file) {
  if (!content_file.hasOwnProperty('version') ||
    !content_file.hasOwnProperty('groups') ||
    content_file['version'][0] !== "syncTabGroups") {
    throw Error("SyncTabGroups importation: Content file is not readable.")
  }

  let groups = content_file['groups'].map((group, index)=>{
    return new GroupManager.Group({
      id: index,
      title: group.title || "",
      tabs: group.tabs || [],
    });
  });

  return groups;
}

/**
 *
 * legacy
 */
StorageManager.File.importTabGroups = function(content_file) {
  if (!content_file.hasOwnProperty('version') ||
    (content_file['version'][0] !== "tabGroups" &&
      content_file['version'][0] !== "sessionrestore") || !content_file.hasOwnProperty('windows')) {
    throw Error("TabGroups importation: Content file is not readable.");
  }
  let groups = [];

  let pinnedTabs = [];

  for (let w of content_file['windows']) {
    let cross_ref = {};

    // Create groups
    if (!w.hasOwnProperty('extData') ||
      !w['extData'].hasOwnProperty('tabview-group')) {
      throw Error("TabGroups importation: Content file is not readable..");
    }
    let tabviewgroup = JSON.parse(w['extData']['tabview-group']);
    for (let i in tabviewgroup) {
      let g = tabviewgroup[i];
      if (g !== undefined) {
        groups.push(new GroupManager.Group({
          id: groups.length,
          title: g.title || "",
          tabs: [],
        }));
        cross_ref[g.id] = groups.length-1;
      }
    }

    if (!w.hasOwnProperty('tabs')) {
      throw Error("TabGroups importation: Content file is not readable...");
    }

    for (let t of w['tabs']) {
      if (!t.hasOwnProperty('extData') ||
        !t['extData'].hasOwnProperty('tabview-tab') ||
        (JSON.parse(t['extData']['tabview-tab']) &&
          !JSON.parse(t['extData']['tabview-tab']).hasOwnProperty('groupID')) ||
        (!JSON.parse(t['extData']['tabview-tab']) &&
          !t.hasOwnProperty('pinned')) ||
        !t.hasOwnProperty('entries') ||
        !t['entries'][0].hasOwnProperty('title') ||
        !t['entries'][0].hasOwnProperty('url')) {
        continue;
      }

      let tab = {
        title: t['entries'][0]['title'],
        url: t['entries'][0]['url'],
        pinned: false,
        active: false,
      };
      if (t.hasOwnProperty('image')) {
        tab["favIconUrl"] = t['image'];
      }
      if (t.hasOwnProperty('lastAccessed')) {
        tab["lastAccessed"] = t['lastAccessed'];
      }


      if (JSON.parse(t['extData']['tabview-tab'])) { // Normal tab
        let i = cross_ref[JSON.parse(t['extData']['tabview-tab'])['groupID']];
        groups[i].tabs.push(TabManager.getTab(tab));
      } else { // Pinned tabs
        tab.pinned = true;
        pinnedTabs.push(tab);
      }
    }
  }

  // Add all pinned tabs in one group
  if (pinnedTabs.length > 0) {
    groups.push(new GroupManager.Group({
      id: groups.length,
      title: "Imported Pinned Tabs",
      tabs: pinnedTabs,
    }));
  }

  return groups;
}
