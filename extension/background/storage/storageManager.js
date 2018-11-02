import BookmarkStorage from './bookmarkstorage'
import LocalStorage from './localstorage'
import FileStorage from './filestorage'
import BackupStorage from './backup'

const StorageManager = {
  Bookmark: BookmarkStorage,
  Local: LocalStorage,
  File: FileStorage,
  Storage: BackupStorage,
}

export default StorageManager