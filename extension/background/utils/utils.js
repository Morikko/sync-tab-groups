/**
 * Useful code shared in all the apps UI and background
 */
var Utils = Utils || {};
/**
 * Show GroupId, Index, WindowId, Position in as group hover in menu
 * Show messages
 */
// If change the line, update makefile
Utils.DEGUG_MODE = true;
Utils.UTILS_SHOW_MESSAGES = Utils.DEGUG_MODE;

var TaskManager = TaskManager || {};
TaskManager.ASK = "ASK";
TaskManager.CANCEL = "CANCEL";
TaskManager.FORCE = "FORCE";
TaskManager.CLOSE_REFERENCE = "close";
TaskManager.REMOVE_REFERENCE = "remove";

var OptionManager = OptionManager || {};
OptionManager.SORT_OLD_RECENT = 0;
OptionManager.SORT_RECENT_OLD = 1;
OptionManager.SORT_ALPHABETICAL = 2;
OptionManager.SORT_LAST_ACCESSED = 3;
OptionManager.SORT_CUSTOM = 4;
OptionManager.TEMPLATE = function() {
  return {
    version: 0.1,
    privateWindow: {
      sync: true,
      removeOnClose: false,
    },
    pinnedTab: {
      sync: true
    },
    bookmarks: {
      sync: false,
      folder: "Default"
    },
    groups: {
      syncNewWindow: true,
      removeEmptyGroup: false,
      showGroupTitleInWindow: false,
      sortingType: OptionManager.SORT_OLD_RECENT,
      discardedOpen: true,
    },
    popup: {
      maximized: false,
      whiteTheme: false,
      showTabsNumber: true,
      showSearchBar: true,
    },
    shortcuts: {
      allowGlobal: false,
    }
  };
};

var GroupManager = GroupManager || {};

/**
 * Return the index of the groups sorted by the display position
 * @param {Array[Group]} groups
 * @return {Array[Number]} sortedIndex
 */
GroupManager.getIndexSortByPosition = function(groups) {
  let sortedIndex = [];
  for (let pos = 0; pos < groups.length; pos++) {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].position === pos) {
        sortedIndex.push(groups[i].index);
      }
    }
  }
  // Add them in the order of the array at the end
  if (sortedIndex.length < groups.length) { // Wrong position
    for (let i = 0; i < groups.length; i++) {
      if (!sortedIndex[groups[i].index]) {
        sortedIndex.push(groups[i].index);
      }
    }
  }
  return sortedIndex;
};

/**
 * Modify object to have all the fields of ref_object
 * TODO: extra field from object should be removed
 * Already present fields keep the initial value in object
 * @param {Object} object
 * @param {Object} ref_object
 */
Utils.mergeObject = function(object, ref_object) {
  for (let pro in ref_object) {
    if (!object.hasOwnProperty(pro)) {
      object[pro] = ref_object[pro];
    }
    if ("object" === typeof ref_object[pro]) {
      Utils.mergeObject(object[pro], ref_object[pro]);
    }
  }
}

/**
 * Return a deep copy object of obj
 * @return {Array[Group]}
 */
Utils.getCopy = function(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Change the popup icon (Black or White)
 * @param {boolean} icon_type
 * White: true
 * Black: false
 */
Utils.setBrowserActionIcon = function(icon_type) {
  if (icon_type === true) { // White
    browser.browserAction.setIcon({
      path: {
        16: "/share/icons/tabspace-light-16.png",
        32: "/share/icons/tabspace-light-32.png"
      }
    });
  } else if (icon_type === false) { // Black
    browser.browserAction.setIcon({
      path: {
        16: "/share/icons/tabspace-16.png",
        32: "/share/icons/tabspace-32.png"
      }
    });
  }
}


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
 * Parse the get parameters from the URL, return the value of name
 * @param {String} name - the value to return
 * @param {String} url - string to analyse, if not given, take the one from the web page
 */
Utils.getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Set webpage icon, works only in web page
 * @param {String} icon_url
 */
Utils.setIcon = function(icon_url) {
  var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = icon_url;
  document.getElementsByTagName('head')[0].appendChild(link);
};

/**
 * Set text in the clipboard, works only in web page
 * @param {String} text
 */
Utils.copyToTheClipBoard = function(text) {
  let input = document.createElement('input');
  input.value = text;

  document.body.appendChild(input);
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
}

/**
 * Search the keywords in title. Keywords are separated with space
 * Not case sensitive
 * Return true if all keywords are in title
 * @param {String} title
 * @param {String} keywords
 * @return {boolean}
 */
Utils.search = function(title, keywords) {
  results = keywords.split(' ').map((word) => {
    return title.toLowerCase().includes(word.toLowerCase());
  });
  return results.reduce(
    (accu, result, ) => (accu && result),
    true
  );
}
/*
[
Utils.search("Computer", "com"),
Utils.search("Computer", "com pu"),
Utils.search("Computer", "Com"),
Utils.search("Computer", "Cm"),
Utils.search("Computer", "Cm pu"),
].map((t)=>console.log(t))
*/
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
 * Return true if the browser is Chrome
 * @return {Boolean}
 */
Utils.isChrome = function() {
  if (browser.sessions.getWindowValue === undefined &&
    browser.tabs.discard !== undefined) {
    return true;
  }
  return false;
}

/**
 * Return true if the browser is FF57
 * @return {Boolean}
 */
Utils.isFF57 = function() {
  if (browser.sessions.getWindowValue !== undefined) {
    return true;
  }
  return false;
}

/**
 * Return true if the browser is FF56 and -
 * @return {Boolean}
 */
Utils.isBeforeFF57 = function() {
  if (browser.sessions.getWindowValue === undefined &&
    browser.tabs.discard === undefined) {
    return true;
  }
  return false;
}

/**
 * Return the url in parameter for privileged-tab.html pages
 * This URL is the real normal url page.
 * @param {String} url
 * @return {String} new_url
 */
Utils.extractTabUrl = function(url) {
  let new_url = url;
  if (new_url.includes("lazytab/lazytab.html")) {
    new_url = Utils.getParameterByName('url', new_url)
  }
  if (new_url.includes("/privileged-tab/privileged-tab.html")) {
    new_url = Utils.getParameterByName('url', new_url)
  }
  return new_url;
}

Utils.getPrivilegedURL = function(title, url, favIconUrl) {
  return browser.extension.getURL("/tabpages/privileged-tab/privileged-tab.html") + "?" +
    "title=" + encodeURIComponent(title) +
    "&url=" + encodeURIComponent(url) +
    "&favIconUrl=" + encodeURIComponent(favIconUrl);
}

Utils.getDiscardedURL = function(title, url, favIconUrl) {
  if (url === "about:newtab" || url === "about:blank" || url.includes("chrome://newtab")) {
    return url;
  } else {
    return browser.extension.getURL("/tabpages/lazytab/lazytab.html") + "?" +
      "title=" + encodeURIComponent(title) +
      "&url=" + encodeURIComponent(url) +
      "&favIconUrl=" + encodeURIComponent(favIconUrl);
  }
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
  if (url === "about:newtab" || url === "about:blank" || url.includes("chrome://newtab"))
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
 * Check if an url is already open in the focused window, if so it focuses the tab else it opens it
 * @param {String} url
 */
Utils.openUrlOncePerWindow = async function(url) {
  const currentWindowId = (await browser.windows.getLastFocused({
    windowTypes: ['normal'],
  })).id;
  const tabs = await browser.tabs.query({
    windowId: currentWindowId,
    url: url,
  });

  if (tabs.length) { // if manage tab is found
    browser.tabs.update(tabs[0].id, {
      active: true,
    });
  } else {
    browser.tabs.create({
      active: true,
      url: url,
    });
  }
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
};
