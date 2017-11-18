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

  StorageManager.Bookmark.TIME_OUT = setTimeout(async() => {
    try {
      await StorageManager.Bookmark.init();
      await StorageManager.Bookmark.RenamePreviousBackUp();
      await StorageManager.Bookmark.saveGroups(groups);
      await StorageManager.Bookmark.cleanGroups();

      return "StorageManager.Bookmark.backUp done!";
    } catch (e) {
      return "StorageManager.Bookmark.backUp failed: " + e;
    }
  }, 500);
}

/**
 * Save the groups as back up bookmarks
 * Format: Other bookmarks / StorageManager.Bookmark.ROOT / StorageManager.Bookmark.BACKUP / Group Title / Each tabs
 *
 * In  browser.bookmarks.create, index doesn't work: https://bugzilla.mozilla.org/show_bug.cgi?id=1416573
 * @param {Array[Group]} groups
 */
StorageManager.Bookmark.saveGroups = async function(groups) {
  try {
    var rootId;
    // 1. Create root
    const bmRoot = await browser.bookmarks.create({
      title: StorageManager.Bookmark.BACKUP,
      parentId: StorageManager.Bookmark.ROOT_ID
    });

    rootId = bmRoot.id;

    // For each group
    await Promise.all(groups.map(async(g) => {

      // 2. Create Group folder
      const bmGroup = await browser.bookmarks.create({
        title: Utils.getGroupTitle(g),
        parentId: bmRoot.id
      })

      // 3. Create Tabs bookmarks
      await Promise.all(g.tabs.map(async(tab) => {
        await browser.bookmarks.create({
          title: tab.title,
          index: tab.index,
          url: tab.url,
          parentId: bmGroup.id
        });
      }));
    }));

    return "StorageManager.Bookmark.saveGroups done!";
  } catch (e) {
    return "StorageManager.Bookmark.saveGroups failed: " + e;
  }
}

/**
 * Rename Previous back up in Other bookmarks / StorageManager.Bookmark.ROOT /
 * Change: StorageManager.Bookmark.BACKUP -> StorageManager.Bookmark.BACKUP_OLD
 TODO: search only in ROOT_ID
 */
StorageManager.Bookmark.RenamePreviousBackUp = async function() {
  try {
    const searchResults = await browser.bookmarks.search({
      title: StorageManager.Bookmark.BACKUP
    });

    await Promise.all(searchResults.map(async(searchResult) => {
      await browser.bookmarks.update(
        searchResult.id, {
          title: StorageManager.Bookmark.BACKUP_OLD
        });
    }));
    return "StorageManager.Bookmark.RenamePreviousBackUp done!";
  } catch (e) {
    return "StorageManager.Bookmark.RenamePreviousBackUp failed: " + e;
  }
}

/**
 * Clean the old back up bookmarks in Other bookmarks / StorageManager.Bookmark.ROOT /
 * Delete: StorageManager.Bookmark.BACKUP_OLD
 */
StorageManager.Bookmark.cleanGroups = async function(title = StorageManager.Bookmark.BACKUP_OLD) {
  try {
    const searchResults = await browser.bookmarks.search({
      title: title
    });

    await Promise.all(searchResults.map(async(searchResult) => {
      await browser.bookmarks.removeTree(searchResult.id);
    }));
    return "StorageManager.Bookmark.cleanGroups done!";
  } catch (e) {
    return "StorageManager.Bookmark.cleanGroups failed: " + e;
  }
}

/**
 * Create Other bookmarks / StorageManager.Bookmark.ROOT / if doesn't exist.
 * Save the id of this bookmark (StorageManager.Bookmark.ROOT_ID) in order to do the backup inside later.
 */
StorageManager.Bookmark.init = async function() {
  try {
    const searchResults = await browser.bookmarks.search({
      title: StorageManager.Bookmark.ROOT
    });

    if (searchResults.length === 0) {
      const folder = await browser.bookmarks.create({
        title: StorageManager.Bookmark.ROOT
      });
      StorageManager.Bookmark.ROOT_ID = folder.id;
    } else {
      StorageManager.Bookmark.ROOT_ID = searchResults[0].id;
    }
    return "StorageManager.Bookmark.cleanGroups done!";
  } catch (e) {
    return "StorageManager.Bookmark.cleanGroups failed: " + e;
  }
}
