import TAB_CONSTANTS from '../core/TAB_CONSTANTS'

//const browser.windows.WINDOW_ID_NONE = browser.windows.WINDOW_ID_NONE;
const Utils = {};
window.Utils = Utils;

/**
 * Show GroupId, Index, WindowId, Position in as group hover in menu
 * Show messages
 */
Utils.DEBUG_MODE=!process.env.IS_PROD;
Utils.UTILS_SHOW_MESSAGES = Utils.DEBUG_MODE;
Utils.PRIV_PAGE_URL = "/tabpages/privileged-tab/privileged-tab.html";
Utils.LAZY_PAGE_URL = "/tabpages/lazytab/lazytab.html";
Utils.SELECTOR_PAGE_URL = "tabpages/selector-groups/selector-groups.html";

Utils.setObjectPropertiesWith = function(obj, val)  {
  let obj2 = Utils.getCopy(obj);
  for (let pro in obj2)
    obj2[pro] = val;
  return obj2;
}

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
    if (typeof ref_object[pro] === "object") {
      Utils.mergeObject(object[pro], ref_object[pro]);
    }
  }
  return object;
}

/**
 * Return a deep copy object of obj
 * @returns {Array<Group>}
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
        32: "/share/icons/tabspace-light-32.png",
      },
    });
  } else if (icon_type === false) { // Black
    browser.browserAction.setIcon({
      path: {
        16: "/share/icons/tabspace-16.png",
        32: "/share/icons/tabspace-32.png",
      },
    });
  }
}

/**
 * Parse the get parameters from the URL, return the value of name
 * @param {string} name - the value to return
 * @param {string} url - string to analyse, if not given, take the one from the web page
 * @returns {string} the value found or '' if nothing
 */
Utils.getParameterByName = function(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return '';
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Set webpage icon, works only in web page
 * @param {string} icon_url
 */
Utils.setIcon = function(icon_url) {
  let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
  link.type = 'image/x-icon';
  link.rel = 'shortcut icon';
  link.href = icon_url;
  document.getElementsByTagName('head')[0].appendChild(link);
};

/**
 * Set text in the clipboard, works only in web page
 * @param {string} text
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
 * @param {string} title
 * @param {string} keywords
 * @returns {boolean}
 */
Utils.search = function(title, keywords) {
  const removeAccents = function(txt) { return txt.normalize('NFD').replace(/[\u0300-\u036f]/g, "")};

  let title_normalize = removeAccents(title.toLowerCase());

  const results = keywords.split(' ').map((word) => {
    return title_normalize.includes(
      removeAccents(word.toLowerCase())
    );
  });

  return results.reduce(
    (accu, result,) => (accu && result),
    true
  );
}


/**
 * Promise is resolved after time ms
 * @param {number} time - in ms
 */
Utils.wait = async function(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time, time);
  });
}


Utils.isFirefox = () => browser.runtime.getBrowserInfo != null;
Utils.isChrome = () => !Utils.isFirefox();


Utils.hasDiscardFunction = () => browser.tabs.discard != null;
Utils.hasSessionWindowValue = () => browser.sessions.getWindowValue != null;
Utils.hasWindowTitlePreface = () => Utils.isFirefox();
Utils.hasHideFunction = () =>  browser.tabs.hide != null;

/**
 * Return true if the browser is Chrome
 * @returns {boolean}
 * @deprecated
 */
Utils.isChrome = function() {
  if (browser.sessions.getWindowValue == null &&
    browser.tabs.discard != null) {
    return true;
  }
  return false;
}

/**
 * Return true if the browser is FF57 or above
 * @returns {boolean}
 * @deprecated
 */
Utils.isFF57 = function() {
  if (browser.sessions.getWindowValue !== undefined) {
    return true;
  }
  return false;
}


/**
 * Return the url in parameter for privileged-tab.html pages
 * This URL is the real normal url page.
 * @param {string} url
 * @returns {string} new_url
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
  return new_url===""?TAB_CONSTANTS.NEW_TAB:new_url;
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
  if (url === TAB_CONSTANTS.NEW_TAB || url === "about:blank" || url.includes("chrome://newtab")) {
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
  if (url === TAB_CONSTANTS.NEW_TAB || url === "about:blank" || url.includes("chrome://newtab"))
    return false;
  if (url.startsWith("data:image")) return false

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
 * @param {string} _task - goal of the message
 * @param {Object} _params - variables sent for achieving the goals
 */
Utils.sendMessage = function(_task, _params) {
  browser.runtime.sendMessage({
    task: _task,
    params: _params,
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
 * @param {string} url
 */
Utils.openUrlOncePerWindow = async function(url, active=true) {
  const currentWindowId = (await browser.windows.getLastFocused()).id;

  let urlWithoutHash = url,
    hasHash = urlWithoutHash.lastIndexOf("#") > -1;
  if (hasHash)
    urlWithoutHash = urlWithoutHash.substring(0,urlWithoutHash.lastIndexOf("#"))

  const tabs = await browser.tabs.query({
    windowId: currentWindowId,
    url: urlWithoutHash,
  });

  if (tabs.length) { // if tab is found
    let params = {
      active: active,
    }
    if (hasHash) {
      params.url = url;
    }
    browser.tabs.update(tabs[0].id, params);
  } else {
    browser.tabs.create({
      active: active,
      url: url,
    });
  }
}

/**
  * Extract the value of search with this pattern:
    g/search in group/search in tabs
  * Search in group is optional
  * Search value returned are "" if nothing is found
  * @param {string} searchValue Value
  * @returns {Array<groupSearch, tabSearch>}
  */
Utils.extractSearchValue = function(searchValue) {
  let groupSearch = "", tabSearch = "";
  if (searchValue.startsWith("g/")) {
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
 * @param {Group} group
 * @returns {string} Group title
 */
Utils.getGroupTitle = function(group) {
  return group.title || (
    browser.i18n.getMessage("unnamed_group") + " " + group.id
  );
};

/**
 * Return true if at least the object or one of its properties is
 * Go deep in the object
 * @returns {Array[{Boolean} hasUndefined, {String} path to the undefined]}
 */
Utils.objectHasUndefined = function(object, name="default") {
  if (object === undefined) {
    return [true, name];
  }
  for (let pro in object) {
    if (object[pro] === undefined) {
      return [true, `${name}["${pro}"]`];
    }
    if (typeof object[pro] === "object") {
      const result = Utils.objectHasUndefined(object[pro], `${name}["${pro}"]`)
      if (result[0]) {
        return result
      }
    }
  }
  return [false, name];
}

/**
 * Check that the main object and the properties are not undefined
 * @param {Object} object
 * @param {Object[key] = replaceValue} properties if replaceValue is null, it is critical
 * @param {string} name
 * @returns {Array[{Boolean} hasUndefined, {String} path to the undefined]}
 */
Utils.ojectPropertiesAreUndefined = function(
  object, properties, name="default"
) {
  if (object == null) {
    return [true, [name]];
  }
  let isCritical = false;
  const listMessages = [];

  for (let pro in properties) {
    if (object[pro] == null) {
      if (properties[pro] == null) {
        isCritical = true;
      } else {
        object[pro] = properties[pro]
      }
      listMessages.push(`${name}["${pro}"]`);
    }
  }
  return [isCritical, listMessages];
}

/**
 * Return true if obj is a dead object
 */
Utils.isDeadObject = function(obj) {
  try {
    String(obj);
    return false;
  } catch (e) {
    // "Sync Tab Groups: " + obj + " is probably dead..."
    return true;
  }
}

/**
 * Check if obj contains at least
    1. One Dead Object
    2. One undefined
  * @param {Object} obj
  * @returns {boolean} corrupted state
  */
Utils.checkCorruptedObject = function(obj, name="default") {
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
 * @param {number} N - Size of the array
 */
Utils.range = function(N) {
  return [...Array(N).keys()]
}

Utils.createGroupsJsonFile = function(groups,{
  prettify=false,
}={}) {
  return URL.createObjectURL(new Blob([
    JSON.stringify({
      version: ["syncTabGroups", 1],
      groups: groups,
    }, null, (prettify?2:0)),
  ], {
    type: 'application/json',
  }))
}

/**
 * Wait download with downloadId to complete or fail within waitingTime seconds
 */
Utils.waitDownload = async function(downloadId, waitingTime=6) {
  for (let i=0; i<waitingTime*4; i++) {
    if ((await browser.downloads.search({id: downloadId}))[0].state !== "in_progress") {
      break;
    }
    await Utils.wait(250);
  }
}

/*
 * Return true if the windowId is in an opened window
 */
Utils.windowExists = async function(windowId) {
  if (windowId === browser.windows.WINDOW_ID_NONE || windowId < 0) {
    return false
  }
  return (await browser.windows.getAll()).length > 0;
}

Utils.timerDecorator = function(func, {
  name="Perf",
  times=1,
}={}) {
  return async function() {

    let t0 = performance.now();
    for (let i=0; i<times; i++) {
      await func.apply(this, arguments);
    }
    let t1 = performance.now();
    console.log(name + ": " + (t1 - t0)/times + " milliseconds.")
  };
}

Utils.getParentElement = function(el, className) {
  do {
    if (el.classList.contains(className)) {
      return el;
    }
    el = el.parentElement;
  } while (el !== undefined);

  throw Error("[Utils.getParentElement] Element nof found: " + className);
}


/**
 * Compute the offset of the element (el) from the top of the page (remove scroll)
 */
Utils.getOffset = function(el, ref=document.body) {
  let top = 0;

  // Get offset of the current element
  let offsetEl = el;
  do {
    top += offsetEl.offsetTop;
    offsetEl = offsetEl.offsetParent;

  } while (offsetEl !== document.body && !isNaN(offsetEl.offsetTop));

  // Remove all the scroll offset from the parent
  let scrollEl = el;
  while (scrollEl && !isNaN(scrollEl.offsetTop)) {
    top -= scrollEl.scrollTop;
    scrollEl = scrollEl.parentElement;
  }

  return top;
}

/**
 * Return the lister if bool is true
 * Else return an useless function
 */
Utils.doActivateHotkeys = function(listener, bool) {
  if (bool) {
    return listener;
  } else {
    return ()=>false;
  }
}

export default Utils