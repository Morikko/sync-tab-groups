import BookmarkStorage from './bookmarkstorage'
import LocalStorage from './localstorage'
import FileStorage from './filestorage'
import BackupStorage from './backup'

const ExtensionStorageManager = {
  Bookmark: BookmarkStorage,
  Local: LocalStorage,
  File: FileStorage,
  Backup: BackupStorage,
}

export default ExtensionStorageManager