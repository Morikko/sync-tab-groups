var Utils = Utils || {};

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
    });
}

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
