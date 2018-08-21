var Event = Event || {};
Event.Windows = Event.Windows || {};

Event.Windows.initWindowsEventListener = function() {
  browser.windows.onCreated.addListener((window) => {
    if (Utils.DEBUG_MODE) console.log("Window Created: " + window.id)
    if ( !OptionManager.options.privateWindow.sync
          && window.incognito) {
              return; // Don't lose time
    }

    // Let time for opening well and be sure it is a new one
    setTimeout(async function integrationWindowWhenCreated(){
      if ( !WindowManager.WINDOW_EXCLUDED[window.id] ) {
        try {
          await WindowManager.integrateWindow(window.id);
        } catch (e) {
          LogManager.error(e, {window});
        }
      }
    }, 300); // Below 400, it can fail
  });

  browser.windows.onRemoved.addListener(function(windowId) {
    if (Utils.DEBUG_MODE) console.log("Window removed: " + windowId)
    WindowManager.WINDOW_CURRENTLY_CLOSING[windowId] = true;
    Selector.wasClosedGroupsSelector(windowId);

    setTimeout(()=>{
      delete WindowManager.WINDOW_CURRENTLY_CLOSING[windowId];
    }, 5000);

    GroupManager.detachWindow(windowId);
  });
  /* TODO: doenst update context menu well if right click on a tab from another window
   */
  browser.windows.onFocusChanged.addListener(async function(windowId){
    Background.refreshUi();

    try {
      const w = await browser.windows.getLastFocused();
      await ContextMenu.updateMoveFocus(w.id);

      if ( windowId >= 0 ) {
        let groupId = GroupManager.getGroupIdInWindow(windowId, {error: false});
        if (groupId >= 0) { // Only grouped window
          GroupManager.setLastAccessed(groupId, Date.now());
        }
      }
    } catch (e) {
      LogManager.error(e, {arguments});
    }
  });
}
