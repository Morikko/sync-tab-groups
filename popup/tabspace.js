var tabspaceBackground = browser.runtime.getBackgroundPage();
var workspaces;

/*
 * Show tabspaces in the popup
 */
function showTabspaces(){
    var tabspace_list = workspaces.map( (workspace) => {

      /* Header */
      var header = React.createElement('div', {key:'0'}, workspace.tabSpace.title);

      /* Content tabs */
      var list_tabs = workspace.tabSpace.tabs.map( (tab) => {
        return React.createElement('li', {key: tab.id}, tab.title);
      });
      var content_tabs = React.createElement('ul', {key:'1'}, list_tabs)

      /* Wrapper */
      return React.createElement('div', {key: workspace.windowId.toString()}, [header, content_tabs]);
    });

    // Show
    ReactDOM.render(
      tabspace_list,
      document.getElementById('content')
    );
}

/*
 * Access to the tabspaces and show them
 */
function init() {
  tabspaceBackground.then( (page) => {
    workspaces = page.workspaces;
    showTabspaces();
  });
}

// Wait page is loaded
var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        init();
    }
}, 10);
