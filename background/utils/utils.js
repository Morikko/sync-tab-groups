/**
 * Useful code shared in all the apps UI and background
 */
var Utils = Utils || {};

var TaskManager = TaskManager || {};
TaskManager.ASK = "ASK";
TaskManager.CANCEL = "CANCEL";
TaskManager.FORCE = "FORCE";
TaskManager.CLOSE_REFERENCE = "close";
TaskManager.REMOVE_REFERENCE = "remove";


var OptionManager = OptionManager || {};
OptionManager.TEMPLATE = function() {
  return {
    privateWindow: {
      sync: true,
      removeOnClose: false,
    },
    pinnedTab: {
      sync: true
    },
    bookmarks: {
      sync: true,
      folder: "Default"
    },
    groups: {
      syncNewWindow: true,
      removeEmptyGroup: false,
    }
  };
};

var StorageManager = StorageManager || {};
StorageManager.File = StorageManager.File || {};

StorageManager.File.readJsonFile = async function(file) {
  return new Promise((resolve, reject) => {
    let file_reader = new FileReader();
    file_reader.addEventListener('loadend', function(event) {
      try {
        resolve(JSON.parse(event.target.result));
      } catch (e) {
        reject("Impossible to read file: " + e);
      }
    });
    file_reader.addEventListener('error', function(error) {
      reject("Error when reading file: " + error);
    });
    file_reader.readAsText(file, 'utf-8');
  });
}

/**
 * Promise is resolved after time ms
 * @param {Number} time - in ms
 */
Utils.wait = async function(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time, 'one');
  });
}

/**
 * Return true if the url is privileged
 * Privileged url: chrome: URLs, javascript: URLs,
                    data: URLs, file: URLs, about: URLs
 * Non-privileged URLs: about:blank, about:newtab ( should be
 * replaced by null ), all the other ones
 * @param {string} url
 * @returns {boolean}
 */
Utils.isPrivilegedURL = function(url) {
  if (url === "about:newtab")
    return false;
  if (url.startsWith("chrome:") ||
    url.startsWith("javascript:") ||
    url.startsWith("data:") ||
    url.startsWith("file:") ||
    url.startsWith("about:"))
    return true;

  return false;
}

/**
 * Send a message to the other parts of the extension
 * @param {String} _task - goal of the message
 * @param {Object} _params - variables sent for achieving the goals
 */
Utils.sendMessage = function(_task, _params) {
  browser.runtime.sendMessage({
    task: _task,
    params: _params
    // Catch it to avoid Error msg when no receiver
  }).then((handleResponse, handleError) => {

  }).catch((onRejected) => {

  });
}

/**
 * Return group title or unnamed_group in the current language if title is empty
 * @param {Group}
 * @return {String} Group title
 */
Utils.getGroupTitle = function(group) {
    return group.title || (
      browser.i18n.getMessage("unnamed_group") + " " + group.id
    );
  },

  /* Since the current API doesn't provide an alternative, return always false.
   * TODO: find workaround
   */
  Utils.isDarkTheme = function() {
    return false;
  }

/**
 * TODO: Need to fix isDarkTheme first with new API
 * Doesn't work any more, always return dark
 * Used to switch stuff by the current design.
 *
 * @param {Object} object - object with .light and .dark
 * @returns {Object} input.dark if a dark theme is used, .light otherwise
 */
Utils.themeSwitch = function(object) {
  return Utils.isDarkTheme() ? object.dark : object.light;
};
