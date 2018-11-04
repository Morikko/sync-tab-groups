/**
 * Save the groups as bookmarks for having a back up
 * In : Other bookmarks / Bookmark.ROOT /
 */
// TODO: TaskManager
import TaskManager from '../utils/taskManager'
import Utils from '../utils/utils'
import LogManager from '../error/logmanager'
import OptionManager from '../core/optionmanager'

const BookmarkStorage = {};

BookmarkStorage.ROOT = "SyncTabGroups";
BookmarkStorage.ROOT_ID = null;

BookmarkStorage.repeatedtask = new TaskManager.RepeatedTask(30000);


/**
 * Save the groups as bookmarks for having a back up.
 * In : Other bookmarks / Bookmark.ROOT /
 * First create new back up and if succeeded, delete the old backup
 * Use a time out, in order to avoid too many writing in paralel that makes the function not working.
 * @param {Array<Group>} groups
 */
BookmarkStorage.backUp = function(groups, force=false) {
  // Never do it asynchronously or you can break Firefox
  BookmarkStorage.repeatedtask.add(
    async() => {
      try {
        await BookmarkStorage.init();
        await BookmarkStorage.cleanGroups();
        await BookmarkStorage.saveGroups(groups);

        return "Bookmark.backUp done!";
      } catch (e) {
        LogManager.error(e, {arguments});
      }
    },
    force)
}

/**
 * Save the groups as back up bookmarks
 * Format: Other bookmarks / Bookmark.ROOT / Bookmark.BACKUP / Group Title / Each tabs
 * @param {Array<Group>} groups
 */
BookmarkStorage.saveGroups = async function(groups) {
  try {
    let rootId;

    // 1. Create root
    const bmRoot = await browser.bookmarks.create({
      title: OptionManager.options.bookmarks.folder === "" ? "Default" : OptionManager.options.bookmarks.folder,
      parentId: BookmarkStorage.ROOT_ID,
    });

    rootId = bmRoot.id;
    // For each group
    for (let g of groups) {

      // 2. Create Group folder
      const bmGroup = await browser.bookmarks.create({
        title: Utils.getGroupTitle(g),
        parentId: rootId,
      });

      // 3. Create Tabs bookmarks (for is mandatory for keeping order)
      for (let tab of g.tabs) {
        await browser.bookmarks.create({
          title: tab.title,
          index: tab.index,
          url: tab.url,
          parentId: bmGroup.id,
        });
      }

    }

    return "Bookmark.saveGroups done!";
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

/**
 * Delete the previous bookmarks backup folder in Bookmark.ROOT
 */
BookmarkStorage.cleanGroups = async function(title = BookmarkStorage.BACKUP_OLD) {
  try {
    const bookmarks_groups = await browser.bookmarks.getSubTree(
      BookmarkStorage.ROOT_ID
    );

    for (let b of bookmarks_groups[0].children) {
      if (b.title === OptionManager.options.bookmarks.folder) {
        await browser.bookmarks.removeTree(b.id);
      }
    }

    return "Bookmark.cleanGroups done!";
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

/**
 * Create Other bookmarks / Bookmark.ROOT / if doesn't exist.
 * Save the id of this bookmark (Bookmark.ROOT_ID) in order to do the backup inside later.
 */
BookmarkStorage.init = async function() {
  try {
    const searchResults = await browser.bookmarks.search({
      title: BookmarkStorage.ROOT,
    });

    if (searchResults.length === 0) {
      const folder = await browser.bookmarks.create({
        title: BookmarkStorage.ROOT,
      });
      BookmarkStorage.ROOT_ID = folder.id;
    } else {
      BookmarkStorage.ROOT_ID = searchResults[0].id;
    }
    return "Bookmark.init done!";
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

export default BookmarkStorage
