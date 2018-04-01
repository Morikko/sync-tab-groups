var TabHidden = TabHidden || {};

/**
 * @param {Number} tabId
 * @param {Number} windowId
 * @param {Number} index
 * @return {Boolean} is tab shown
 */
TabHidden.showTab = async function(tabId, windowId, index=-1) {
  try {
    await browser.tabs.move(tabId, {windowId, index});
    await browser.tabs.show(tabId);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * @param {Number} tabId
 * @return {Boolean} is tab hidden
 */
TabHidden.hideTab = async function(tabId) {
  const result = await browser.tabs.hide(tabId);
  return result.length !== 0;
}
