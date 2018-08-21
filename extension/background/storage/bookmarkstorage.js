/**
 * Save the groups as bookmarks for having a back up
 * In : Other bookmarks / StorageManager.Bookmark.ROOT /
 */
var StorageManager = StorageManager || {};

StorageManager.Bookmark = StorageManager.Bookmark || {};

StorageManager.Bookmark.ROOT = "SyncTabGroups";
StorageManager.Bookmark.ROOT_ID;

StorageManager.Bookmark.repeatedtask = new TaskManager.RepeatedTask(30000);


/**
 * Save the groups as bookmarks for having a back up.
 * In : Other bookmarks / StorageManager.Bookmark.ROOT /
 * First create new back up and if succeeded, delete the old backup
 * Use a time out, in order to avoid too many writing in paralel that makes the function not working.
 * @param {Array[Group]} groups
 */
StorageManager.Bookmark.backUp = function(groups, force=false) {
  // Never do it asynchronously or you can break Firefox
  StorageManager.Bookmark.repeatedtask.add(
    async() => {
      try {
        await StorageManager.Bookmark.init();
        await StorageManager.Bookmark.cleanGroups();
        await StorageManager.Bookmark.saveGroups(groups);

        return "StorageManager.Bookmark.backUp done!";
      } catch (e) {
        LogManager.error(e, {arguments});
      }
    },
  force)
}

/**
 * Save the groups as back up bookmarks
 * Format: Other bookmarks / StorageManager.Bookmark.ROOT / StorageManager.Bookmark.BACKUP / Group Title / Each tabs
 * @param {Array[Group]} groups
 */
StorageManager.Bookmark.saveGroups = async function(groups) {
  try {
    var rootId;

    // 1. Create root
    const bmRoot = await browser.bookmarks.create({
      title: OptionManager.options.bookmarks.folder === "" ? "Default" : OptionManager.options.bookmarks.folder,
      parentId: StorageManager.Bookmark.ROOT_ID
    });

    rootId = bmRoot.id;
    // For each group
    for (let g of groups) {

      // 2. Create Group folder
      const bmGroup = await browser.bookmarks.create({
        title: Utils.getGroupTitle(g),
        parentId: rootId
      });

      // 3. Create Tabs bookmarks (for is mandatory for keeping order)
      for (let tab of g.tabs) {
        await browser.bookmarks.create({
          title: tab.title,
          index: tab.index,
          url: tab.url,
          parentId: bmGroup.id
        });
      }

    }

    return "StorageManager.Bookmark.saveGroups done!";
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

/**
 * Delete the previous bookmarks backup folder in StorageManager.Bookmark.ROOT
 */
StorageManager.Bookmark.cleanGroups = async function(title = StorageManager.Bookmark.BACKUP_OLD) {
  try {
    const bookmarks_groups = await browser.bookmarks.getSubTree(
      StorageManager.Bookmark.ROOT_ID
    );

    for (let b of bookmarks_groups[0].children) {
      if (b.title === OptionManager.options.bookmarks.folder) {
        await browser.bookmarks.removeTree(b.id);
      }
    }

    return "StorageManager.Bookmark.cleanGroups done!";
  } catch (e) {
    LogManager.error(e, {arguments});
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
    return "StorageManager.Bookmark.init done!";
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}
