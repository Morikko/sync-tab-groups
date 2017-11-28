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

StorageManager.File.importGroups = function(file){
  let groups = [];

  return groups;
}

StorageManager.File.getFile = function () {
  let file = "";

  return file;
}


StorageManager.File.importSyncTabGroups = function( data_imported ){
  let groups = [];

  return groups;
}

/**
 *
 * legacy
 */
StorageManager.File.importTabGroups = function( data_imported ){
  let groups = [];

  return groups;
}
