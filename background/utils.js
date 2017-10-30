/**
 *
 */
var sendMessage = function(_task, _params) {
    browser.runtime.sendMessage({
      task: _task,
      params: _params
    });
}

/**
 * Returns an object of translated strings for the use in the frontend.
 *
 * @param {Array} keys - i18n keys
 * @returns {Object}
 */
var getI18nStrings = function(keys) {
  let returnStrings = {};

  for (let key of keys) {
    returnStrings[key] = browser.i18n.getMessage(key);
  }

  return returnStrings;
};

/* Since the current API doesn't provide an alternative, return always false.
 * TODO: find workaround
 */
function isDarkTheme() {
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
var themeSwitch = function(object) {
  return isDarkTheme() ? object.dark : object.light;
};
