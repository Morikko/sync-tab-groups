var StorageManager = StorageManager || {};

StorageManager.Bookmark = StorageManager.Bookmark || {};

StorageManager.Bookmark.ROOT = "SyncTabGroups";

/**
 * Save the groups as back up bookmarks
 * Format: Other bookmarks / StorageManager.Bookmark.ROOT / Group Title / Each tabs
 * First create and if success, delete the old backup
 *
 * In  browser.bookmarks.create, index doesn't work: https://bugzilla.mozilla.org/show_bug.cgi?id=1416573
 * @param {Array[Group]} groups
 */
StorageManager.Bookmark.saveGroups = function(groups) {
  return new Promise((resolve, reject) => {
    var rootId;
    // 1. Create root
    browser.bookmarks.create({
      title: StorageManager.Bookmark.ROOT
    }).then((bmRoot) => {
      rootId = bmRoot.id;
      // For each group
      groups.map((g) => {

        // 2. Create Group folder
        browser.bookmarks.create({
          title: Utils.getGroupTitle(g),
          parentId: bmRoot.id
        }).then((bmGroup) => {
          var lastPromise = Promise.resolve("In case...");
          g.tabs.map((tab) => {
            
            // 3. Create Tabs bookmarks
            lastPromise = browser.bookmarks.create({
              title: tab.title,
              index: tab.index,
              url: tab.url,
              parentId: bmGroup.id
            });
          });
          lastPromise.then(() => {

            // 4. Clean
            resolve(StorageManager.Bookmark.cleanGroups([rootId]));

          }).catch((reason) => {
            reject("StorageManager.Bookmark.cleanGroups saveGroups: " + reason);
          });
        }).catch((reason) => {
          reject("StorageManager.Bookmark.cleanGroups saveGroups: " + reason);
        });
      });
    }).catch((reason) => {
      reject("StorageManager.Bookmark.cleanGroups saveGroups: " + reason);
    });
  });
}

/**
 * Clean the back up bookmarks that are not excepted
 * @param {Array[Number]} exceptId (optional) - array of id to not remove
 */
StorageManager.Bookmark.cleanGroups = function(exceptIds = []) {
  return new Promise((resolve, reject) => {
    browser.bookmarks.search({
      title: StorageManager.Bookmark.ROOT
    }).then((searchResults) => {
      var lastPromise = Promise.resolve("In case...");
      searchResults.map((searchResult) => {
        if (exceptIds.indexOf(searchResult.id) === -1)
          lastPromise = browser.bookmarks.removeTree(searchResult.id);
      });
      resolve(lastPromise);
    }).catch((reason) => {
      reject("StorageManager.Bookmark.cleanGroups failed: " + reason);
    });
  });
}
