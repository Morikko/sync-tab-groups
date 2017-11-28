/**
 * Everything related to save file on the disk (Not through firefox API)
 */
var StorageManager = StorageManager || {};
StorageManager.File = StorageManager.File || {};

StorageManager.File.exportGroups = function(groups) {
  // TODO remove it in all app
  // Clean tabs
  for ( g of groups ) {
    for ( let it=0; it < g.tabs.length; it++ ) {
      g.tabs[it] = {
        title: g.tabs[it].title||"New Tab",
        url: g.tabs[it].url||"about:newtab",
        pinned: g.tabs[it].pinned||false,
        active: g.tabs[it].active||false,
        discarded: g.tabs[it].discarded||false,
        favIconUrl: g.tabs[it].favIconUrl||"chrome://branding/content/icon32.png",
      };
    }
  }

  let d = new Date();
  let url = URL.createObjectURL(new Blob([
    JSON.stringify({
    version: ["syncTabGroups", 1],
    groups: groups,
  })], {
    type: 'application/json'
  })),
   filename = "syncTabGroups" + "-" + "manual" + "-" + d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2) + "-" + ("0" + d.getHours()).slice(-2) + ("0" + d.getMinutes()).slice(-2) + ("0" + d.getSeconds()).slice(-2) + ".json";

  browser.downloads.download({
    url: url,
    filename: filename,
    saveAs: true
  });
}

StorageManager.File.importGroups = function(content_file) {
  if (!content_file.hasOwnProperty('version')) {
    throw Error("ImportGroups: Content file is not in a supported format.");
  }
  let groups = [];

  if (content_file['version'][0] === "tabGroups") {
    groups = StorageManager.File.importTabGroups(content_file);
  } else if (content_file['version'][0] === "syncTabGroups") {
    groups = StorageManager.File.importSyncTabGroups(content_file);
  } else {
    throw Error("ImportGroups: Content file is not in a supported format.");
  }

  console.log(groups);

  return groups;
}


StorageManager.File.importSyncTabGroups = function(content_file) {
  if (!content_file.hasOwnProperty('version') ||
    !content_file.hasOwnProperty('groups') ||
    content_file['version'][0] !== "syncTabGroups") {
    throw Error("SyncTabGroups importation: Content file is not readable.")
  }

  let groups = [];

  for (g of content_file['groups']) {
    groups.push(new GroupManager.Group(
      -1,
      g.title || "",
      g.tabs || [],
    ));
  }

  return groups;
}

/**
 *
 * legacy
 */
StorageManager.File.importTabGroups = function(content_file) {
  if (!content_file.hasOwnProperty('version') ||
    content_file['version'][0] !== "tabGroups" ||
    !content_file.hasOwnProperty('windows')) {
    throw Error("TabGroups importation: Content file is not readable.");
  }
  let groups = [];

  for (w of content_file['windows']) {
    let cross_ref = {},
      index = 0,
      tmp_groups = [];

    // Create groups
    if (!w.hasOwnProperty('extData') ||
      !w['extData'].hasOwnProperty('tabview-group')) {
      throw Error("TabGroups importation: Content file is not readable..");
    }
    let tabviewgroup = JSON.parse(w['extData']['tabview-group']);
    for (let i in tabviewgroup) {
      let g = tabviewgroup[i];
      if (g !== undefined) {
        tmp_groups.push(new GroupManager.Group(-1,
          g.title || "", [],
        ));
        cross_ref[g.id] = index;
        index++;
      }
    }

    if (!w.hasOwnProperty('tabs')) {
      throw Error("TabGroups importation: Content file is not readable...");
    }

    for (t of w['tabs']) {
      if (!t.hasOwnProperty('extData') ||
        !t['extData'].hasOwnProperty('tabview-tab') ||
        !JSON.parse(t['extData']['tabview-tab']).hasOwnProperty('groupID') ||
        !t.hasOwnProperty('entries') ||
        !t['entries'][0].hasOwnProperty('title') ||
        !t['entries'][0].hasOwnProperty('url')) {
        continue;
      }
      let i = cross_ref[JSON.parse(t['extData']['tabview-tab'])['groupID']];

      tmp_groups[i].tabs.push({
        title: t['entries'][0]['title'],
        url: t['entries'][0]['url'],
        pinned: false,
        active: false,
      });
    }

    for (g of tmp_groups) {
      groups.push(g);
    }
  }





  return groups;
}
