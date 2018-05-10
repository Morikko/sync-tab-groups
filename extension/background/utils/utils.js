/**
 * Useful code shared in all the apps UI and background
 * Shared variables definition
 Tools:
 - search
 - extractSearchValue
 - sendMessage
 - getCopy
 - wait
Array:
 - shuffleArray
 - range
Objects:
 - mergeObject
 - setObjectPropertiesWith
 - objectHasUndefined
 - isDeadObject
 - checkCorruptedObject

 Browser type:
 - isChrome
 - isFF57
 - isBeforeFF57

 URLs
 - extractTabUrl
 - getPrivilegedURL
 - getDiscardedURL
 - isPrivilegedURL
 - openUrlOncePerWindow

 HTML Page:
 - getParameterByName
 - setIcon
 - copyToTheClipBoard

 - getGroupTitle
 - setBrowserActionIcon
 - StorageManager.File.readJsonFile
 - GroupManager.getIndexSortByPosition
 - createGroupsJsonFile

 */
const WINDOW_ID_NONE = browser.windows.WINDOW_ID_NONE;
var Utils = Utils || {};
var TabManager = TabManager || {};
var Selector = Selector || {};

/**
 * Show GroupId, Index, WindowId, Position in as group hover in menu
 * Show messages
 */
Utils.DEBUG_MODE=true;
Utils.UTILS_SHOW_MESSAGES = Utils.DEBUG_MODE;
Utils.PRIV_PAGE_URL = "/tabpages/privileged-tab/privileged-tab.html";
Utils.LAZY_PAGE_URL = "/tabpages/lazytab/lazytab.html";
Utils.SELECTOR_PAGE_URL = "tabpages/selector-groups/selector-groups.html";

var StorageManager = StorageManager || {};
StorageManager.Backup = StorageManager.Backup || {};
StorageManager.Backup.LOCATION = "synctabgroups-backup/";

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
OptionManager.TIMERS = function() {
  return {
    t_5mins: 5*60*1000,
    t_1h: 60*60*1000,
    t_4h: 4*60*60*1000,
    t_1d: 24*60*60*1000,
    t_1w: 7*24*60*60*1000
  }
}

OptionManager.TEMPLATE = function() {
  return {
    version: 0.1,
    privateWindow: {
      sync: true,
      removeOnClose: true
    },
    pinnedTab: {
      sync: false,
    },
    bookmarks: {
      sync: false,
      folder: "Default"
    },
    groups: {
      syncNewWindow: true,
      removeEmptyGroup: false,
      showGroupTitleInWindow: false,
      sortingType: OptionManager.SORT_LAST_ACCESSED,
      discardedOpen: true
    },
    popup: {
      maximized: false,
      whiteTheme: false,
      showTabsNumber: true,
      showSearchBar: true
    },
    shortcuts: {
      allowGlobal: false,
      navigation: true,
    },
    backup: {
      download: {
        enable: false,
        time: Utils.setObjectPropertiesWith(OptionManager.TIMERS(), true)
      },
      local: {
        enable: true,
        intervalTime: 1,
        maxSave: 48,
      }
    },
    log: {
      enable: true,
    }
  };
};

Selector.TYPE = Object.freeze({
  EXPORT: "Export",
  IMPORT: "Import",
});

Utils.setObjectPropertiesWith = function(obj, val)  {
  let obj2 = Utils.getCopy(obj);
  for(let pro in obj2 )
    obj2[pro] = val;
  return obj2;
}

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
      if (sortedIndex.indexOf(i) === -1) {
        sortedIndex.push(i);
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
  return object;
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
 * @return {String} the value found or '' if nothing
 */
Utils.getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return '';
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
  removeAccents = function(txt) { return txt.normalize('NFD').replace(/[\u0300-\u036f]/g, "")};

  let title_normalize = removeAccents(title.toLowerCase());

  results = keywords.split(' ').map((word) => {
    return title_normalize.includes(
      removeAccents(word.toLowerCase())
    );
  });

  return results.reduce(
    (accu, result, ) => (accu && result),
    true
  );
}


/**
 * Promise is resolved after time ms
 * @param {Number} time - in ms
 */
Utils.wait = async function(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time, time);
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
 * Return true if the browser is FF57 or above
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
Utils.extractTabUrl = function(url="") {
  let new_url = url;
  if (new_url.includes(Utils.LAZY_PAGE_URL)) {
    new_url = Utils.getParameterByName('url', new_url)
  }
  if (new_url.includes(Utils.PRIV_PAGE_URL)) {
    new_url = Utils.getParameterByName('url', new_url)
  }
  // If new_url failed return a new tab
  return new_url===""?TabManager.NEW_TAB:new_url;
}

Utils.extractLazyUrl = function(url="") {
  let new_url = url;
  if (new_url.includes(Utils.LAZY_PAGE_URL)) {
    new_url = Utils.getParameterByName('url', new_url)
  }
  return new_url;
}

Utils.getPrivilegedURL = function(title, url, favIconUrl) {
  return browser.extension.getURL(Utils.PRIV_PAGE_URL) + "?" +
    "title=" + encodeURIComponent(title|| "") +
    "&url=" + encodeURIComponent(url) +
    "&favIconUrl=" + encodeURIComponent(favIconUrl|| "");
}

Utils.getDiscardedURL = function(title, url, favIconUrl) {
  if (url === TabManager.NEW_TAB || url === "about:blank" || url.includes("chrome://newtab")) {
    return url;
  } else {
    return browser.extension.getURL(Utils.LAZY_PAGE_URL) + "?" +
      "title=" + encodeURIComponent(title|| "") +
      "&url=" + encodeURIComponent(url) +
      "&favIconUrl=" + encodeURIComponent(favIconUrl|| "");
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
  if (url === TabManager.NEW_TAB || url === "about:blank" || url.includes("chrome://newtab"))
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
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 * Source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
 */
Utils.shuffleArray = function(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

/**
 * Check if an url is already open in the focused window, if so it focuses the tab else it opens it
 * @param {String} url
 */
Utils.openUrlOncePerWindow = async function(url, active=true) {
  try {
    const currentWindowId = (await browser.windows.getLastFocused({
      windowTypes: ['normal'],
    })).id;

    let urlWithoutHash = url,
        hasHash = urlWithoutHash.lastIndexOf("#") > -1;
    if ( hasHash )
      urlWithoutHash = urlWithoutHash.substring(0,urlWithoutHash.lastIndexOf("#"))

    const tabs = await browser.tabs.query({
      windowId: currentWindowId,
      url: urlWithoutHash,
    });

    if (tabs.length) { // if tab is found
      let params = {
        active: active,
      }
      if ( hasHash ) {
        params.url = url;
      }
      browser.tabs.update(tabs[0].id, params);
    } else {
      browser.tabs.create({
        active: active,
        url: url,
      });
    }
  } catch (e) {
    LogManager.error(e, {arguments});
  }
}

/**
  * Extract the value of search with this pattern:
    g/search in group/search in tabs
  * Search in group is optional
  * Search value returned are "" if nothing is found
  * @param {String} Search Value
  * @return {Array[groupSearch, tabSearch]}
  */
Utils.extractSearchValue = function (searchValue) {
  let groupSearch = "", tabSearch = "";
  if ( searchValue.startsWith("g/") ) {
    let last_separator = searchValue.lastIndexOf('/');
    groupSearch = searchValue.substring(
      2,
      last_separator>1?last_separator:searchValue.length
    );
    tabSearch = searchValue.substring(
      last_separator>1?last_separator+1:searchValue.length,
      searchValue.length
    );
  } else {
    tabSearch = searchValue;
  }
  return [groupSearch, tabSearch];
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

/**
 * Return true if at least the object or one of its properties is 
 * Go deep in the object
 * @return {Array[{Boolean} hasUndefined, {String} path to the undefined]}
 */
Utils.objectHasUndefined = function(object, name="default") {
  if ( object === undefined ) {
    return [true, name];
  }
  for (let pro in object) {
    if ( object[pro] === undefined ) {
      return [true, `${name}["${pro}"]`];
    }
    if ("object" === typeof object[pro]) {
      const result = Utils.objectHasUndefined(object[pro], `${name}["${pro}"]`)
      if ( result[0] ) {
        return result
      }
    }
  }
  return [false, name];
}

/**
 * Check that the main object and the properties are not undefined
 * @param {Object} object
 * @param {Array[String]} properties
 * @param {String} name
 * @return {Array[{Boolean} hasUndefined, {String} path to the undefined]}
 */
Utils.ojectPropertiesAreUndefined = function(
  object, properties, name="default"
) {
  if ( object === undefined ) {
    return [true, name + "(ALL)"];
  }
  let hasUndefined = false;
  const listMessage = [];

  for (let pro of properties) {
    if ( object[pro] === undefined ) {
      hasUndefined = true;
      listMessage.push(`${name}["${pro}"]`);
    }
  }
  return [hasUndefined, listMessage.join(',')];
}

/**
 * Return true if obj is a dead object
 */
Utils.isDeadObject = function (obj) {
  try {
    String(obj);
    return false;
  }
  catch (e) {
    LogManager.warning("Sync Tab Groups: " + obj + " is probably dead...");
    return true;
  }
}

/**
 * Check if obj contains at least
    1. One Dead Object
    2. One undefined
  * @param {Object} obj
  * @return {Boolean} corrupted state
  */
Utils.checkCorruptedObject = function( obj, name="default" ) {
  const corrupted = {
    is: false,
    msg: "",
  };
  try {
    const isDeadObject = Utils.isDeadObject(obj);
    if (isDeadObject) {
      corrupted.is = isDeadObject;
      corrupted.msg = "Dead Object";
      return corrupted;
    }
    const [isUndefined, pathObject] = Utils.objectHasUndefined(obj, name);
    if (isUndefined) {
      corrupted.is = isUndefined;
      corrupted.msg = "Undefined: " +  pathObject;
      return corrupted;
    }
  } catch (e) {
    corrupted.is = true;
    corrupted.msg = "Catch on error.";
  }

  return corrupted;
};

/**
 * Return an array with integer from 0 to N-1
 * @param {Number} N - Size of the array
 */
Utils.range = function(N) {
  return [...Array(N).keys()]
}

Utils.createGroupsJsonFile = function (groups=GroupManager.groups,{
  prettify=false
}={}) {
  return URL.createObjectURL(new Blob([
    JSON.stringify({
      version: ["syncTabGroups", 1],
      groups: groups,
    }, null, (prettify?2:0))
  ], {
    type: 'application/json'
  }))
}

/**
 * Wait download with downloadId to complete or fail within waitingTime seconds
 */
Utils.waitDownload = async function(downloadId, waitingTime=6){
  for(let i=0; i<waitingTime*4; i++) {
    if ( (await browser.downloads.search({id: downloadId}))[0].state !== "in_progress" ) {
      break;
    }
    await Utils.wait(250);
  }
}

Utils.timerDecorator = function(func, {
  name="Perf",
  times=1
}={}) {
  return async function() {

    let t0 = performance.now();
    for(let i=0; i<times; i++){
      await func.apply(this, arguments);
    }
    let t1 = performance.now();
    console.log(name + ": " + (t1 - t0)/times + " milliseconds.")
  };
}

Utils.getParentElement = function (el, className) {
  do {
    if ( el.classList.contains(className) ) {
      return el;
    }
    el = el.parentElement;
  } while(el !== undefined );

  throw Error("[Utils.getParentElement] Element nof found: " + className);
}

Utils.getOffset = function( el, ref=document.body ) {
  let top = 0;

  // Get offset of the current element
  let offsetEl = el;
  do {
      top += offsetEl.offsetTop;
      offsetEl = offsetEl.offsetParent;

  } while( offsetEl !== document.body && !isNaN( offsetEl.offsetTop ) );

  // Remove all the scroll offset from the parent
  let scrollEl = el;
  while( scrollEl && !isNaN( scrollEl.offsetTop ) ) {
    top -= scrollEl.scrollTop;
    scrollEl = scrollEl.parentElement;
  }

  return top;
}

Utils.doActivateHotkeys = function (listener, bool) {
  if (bool) {
    return listener;
  } else {
    return ()=>false;
  }
}

TabManager.NEW_TAB = (Utils.isChrome()?"chrome://newtab/":"about:newtab");
