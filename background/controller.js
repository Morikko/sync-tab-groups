var Tabspace = Tabspace || {};

/*
 *
 *
 */
Tabspace.workspace = {




}

var Tabspace = function( title, tabs ) {
    this.title = title;
    this.tabs = tabs;
}

var WorkSpace = function ( windowId, tabSpace ) {
    this.windowId = windowId;
    this.tabSpace = tabSpace;
}

var workspaces = [];


/*
 * Return an array of Tab of the current window.
 */
function getCurrentWindowOpenTabs(){
    browser.tabs.query({currentWindow: true}).then( (tabs) => {
        return tabs;
    });
}

/** Init **/
browser.windows.getAll( {populate:true,
      windowTypes:["normal"]}).then(
      (win) => {
        for ( winInfo of win ){
          workspaces.push(new WorkSpace( winInfo.id,
            new Tabspace( "Window "+ winInfo.id, winInfo.tabs))
          );
        }
      });
