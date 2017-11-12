/**
 * Save the groups as bookmarks for having a back up
 * In : Other bookmarks / StorageManager.Bookmark.ROOT /
 */
var StorageManager = StorageManager || {};

StorageManager.Bookmark = StorageManager.Bookmark || {};

StorageManager.Bookmark.TIME_OUT;

StorageManager.Bookmark.ROOT = "SyncTabGroups";
StorageManager.Bookmark.BACKUP = "Groups [Back Up]";
StorageManager.Bookmark.BACKUP_OLD = StorageManager.Bookmark.BACKUP + " (old)";

StorageManager.Bookmark.ROOT_ID;

/**
 * Save the groups as bookmarks for having a back up.
 * In : Other bookmarks / StorageManager.Bookmark.ROOT /
 * First create new back up and if succeeded, delete the old backup
 * Use a time out, in order to avoid too many writing in paralel that makes the function not working.
 * Delay: 500ms without updating
 * @param {Array[Group]} groups
 */
StorageManager.Bookmark.backUp = function(groups) {
  if (StorageManager.Bookmark.TIME_OUT !== undefined) {
    clearTimeout(StorageManager.Bookmark.TIME_OUT);
  }

  StorageManager.Bookmark.TIME_OUT = setTimeout(() => {
    return new Promise((resolve, reject) => {
      StorageManager.Bookmark.RenamePreviousBackUp().then(() => {
        StorageManager.Bookmark.saveGroups(groups).then(() => {
          resolve(StorageManager.Bookmark.cleanGroups());
        }).catch((reason) => {
          reject("StorageManager.Bookmark.backUp failed: " + reason);
        });
      }).catch((reason) => {
        reject("StorageManager.Bookmark.backUp failed: " + reason);
      });
    });
  }, 500);
}

/**
 * Save the groups as back up bookmarks
 * Format: Other bookmarks / StorageManager.Bookmark.ROOT / StorageManager.Bookmark.BACKUP / Group Title / Each tabs
 *
 * In  browser.bookmarks.create, index doesn't work: https://bugzilla.mozilla.org/show_bug.cgi?id=1416573
 * @param {Array[Group]} groups
 */
StorageManager.Bookmark.saveGroups = function(groups) {
  return new Promise((resolve, reject) => {
    var rootId;
    // 1. Create root
    browser.bookmarks.create({
      title: StorageManager.Bookmark.BACKUP,
      parentId: StorageManager.Bookmark.ROOT_ID
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
          resolve(lastPromise);
        }).catch((reason) => {
          reject("StorageManager.Bookmark.saveGroups failed: " + reason);
        });
      });
    }).catch((reason) => {
      reject("StorageManager.Bookmark.saveGroups failed: " + reason);
    });
  });
}

/**
 * Rename Previous back up in Other bookmarks / StorageManager.Bookmark.ROOT /
 * Change: StorageManager.Bookmark.BACKUP -> StorageManager.Bookmark.BACKUP_OLD
 */
StorageManager.Bookmark.RenamePreviousBackUp = function() {
  return new Promise((resolve, reject) => {
    browser.bookmarks.search({
      title: StorageManager.Bookmark.BACKUP
    }).then((searchResults) => {
      var lastPromise = Promise.resolve("In case...");

      searchResults.map((searchResult) => {
        lastPromise = browser.bookmarks.update(
          searchResult.id, {
            title: StorageManager.Bookmark.BACKUP_OLD
          });
      });
      resolve(lastPromise);
    }).catch((reason) => {
      reject("StorageManager.Bookmark.RenamePreviousBackUp failed: " + reason);
    });
  });
}

/**
 * Clean the old back up bookmarks in Other bookmarks / StorageManager.Bookmark.ROOT /
 * Delete: StorageManager.Bookmark.BACKUP_OLD
 */
StorageManager.Bookmark.cleanGroups = function(title = StorageManager.Bookmark.BACKUP_OLD) {
  return new Promise((resolve, reject) => {
    browser.bookmarks.search({
      title: title
    }).then((searchResults) => {
      var lastPromise = Promise.resolve("In case...");

      searchResults.map((searchResult) => {
        lastPromise = browser.bookmarks.removeTree(searchResult.id);
      });
      resolve(lastPromise);
    }).catch((reason) => {
      reject("StorageManager.Bookmark.cleanGroups failed: " + reason);
    });
  });
}

/**
 * Create Other bookmarks / StorageManager.Bookmark.ROOT / if doesn't exist.
 * Save the id of this bookmark (StorageManager.Bookmark.ROOT_ID) in order to do the backup inside later.
 */
StorageManager.Bookmark.init = function() {
  return new Promise((resolve, reject) => {
    browser.bookmarks.search({
      title: StorageManager.Bookmark.ROOT
    }).then((searchResults) => {
      var lastPromise = Promise.resolve("StorageManager.Bookmark.init done");
      if (searchResults.length === 0) {
        lastPromise = browser.bookmarks.create({
          title: StorageManager.Bookmark.ROOT
        }).then((folder) => {
          StorageManager.Bookmark.ROOT_ID = folder.id;
        });
      } else {
        StorageManager.Bookmark.ROOT_ID = searchResults[0].id;
      }
      resolve(lastPromise);
    }).catch((reason) => {
      reject("StorageManager.Bookmark.cleanGroups failed: " + reason);
    });
  });
}

StorageManager.Bookmark.init();
