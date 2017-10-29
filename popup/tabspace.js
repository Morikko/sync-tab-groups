var tabspaceBackground = browser.runtime.getBackgroundPage();
var workspaces;

function createTabspaceHeader( title ){

    return React.createElement('div', {className: 'tabspace_header', key:'0'}, title);
}

/*
 * Show tabspaces in the popup
 */
function showTabspaces(){
    var tabspace_list = workspaces.map( (workspace) => {

      /* Header */
      var header = createTabspaceHeader( workspace.tabSpace.title );

      /* Content tabs */
      var list_tabs = workspace.tabSpace.tabs.map( (tab) => {
        return React.createElement('li', {key: tab.id}, tab.title);
      });
      var content_tabs = React.createElement('ul', {className: 'tabspace_content', key:'1'}, list_tabs)

      /* Wrapper */
      return React.createElement('div', {className: 'tabspace_wrap', key: workspace.windowId.toString()}, [header, content_tabs]);
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
