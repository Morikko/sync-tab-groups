class AboutSection extends React.Component {
  render() {
    let release_notes = [{
      version: "",
      date: "",
      note: "",
      new: [],
      removed: [],
      changed: [],
      bugfix: [],
      developper: [],
    }]

    return (
      <div
        className={"option-section about " + (this.props.selected==="about"?
            "visible":"invisible")}>
          <h1 className="section-title">
            {browser.i18n.getMessage("options_about")}
          </h1>
          <h2>
            Sync Tab Groups
          </h2>
          <p>
            {/* TODO: Add Guide */}
            {browser.i18n.getMessage("options_about_start")}
          </p>
          <p>
            {browser.i18n.getMessage("options_about_enjoy")}
            {this.createExtensionsLink()}
          </p>
          <p>
            {browser.i18n.getMessage("options_about_contribute")}
            {this.createContactLink()}
          </p>
          <p>
            {browser.i18n.getMessage("options_about_dev")}
          </p>
          <h2>
            Release Notes (0.5.0)
          </h2>
          {
            <ul>
              <li>Groups Interface</li>
              <ul>
                <li>Improve search</li>
                <ul>
                  <li>Fix wrong results</li>
                  <li>Add Highlight</li>
                  <li>Search groups "g/search_groups/", tabs "search_tabs" or both "g/search_groups/search_tabs"</li>
                </ul>
                <li>New Interface</li>
                <li>Optimize Displaying Performance</li>
                <li>Show message if no group</li>
                <li>Mouse Middle Click on</li>
                <ul>
                  <li>Group: Open the group in a new window</li>
                  <li>Tab: Open the group in a new window with the selected tab as active</li>
                </ul>
              </ul>
              <li>Menu</li>
              <ul>
                <li>Main Bar at the bottom</li>
                <li>Remember visible tabs</li>
                <li>Add actions:</li>
                <ul>
                  <li>Show the tabs of all your groups</li>
                  <li>Hide the tabs of all your groups</li>
                  <li>Open Groups Manager</li>
                </ul>
              </ul>
              <li>Options</li>
              <ul>
                <li>New Interface split into different sections</li>
                <li>Add help messages for the different options</li>
                <li>Fix: Select element was badly displayed on Windows</li>
                <li>Add button: Remove all groups</li>
                <li>Add options:</li>
                <ul>
                  <li>Managing the back up</li>
                  <li>Selecting the tabs opening method (full or discarded)</li>
                </ul>
              </ul>
              <li>Groups Manager</li>
              <ul>
                <li>Show your groups in a specific tab</li>
                <li>Single or Double columns</li>
                <li>Differences with the Menu:</li>
                <ul>
                  <li>Groups don't remember visible tabs state</li>
                  <li>A click on:</li>
                  <ul>
                    <li>Group: Show/Hide tabs</li>
                    <li>Tabs: Nothing</li>
                  </ul>
                </ul>
                <li>Actions:</li>
                <ul>
                  <li>Hide/Show tabs of all groups</li>
                  <li>Search Bar (same function as in Menu)</li>
                </ul>
              </ul>
              <li>Groups Behaviors</li>
              <ul>
                <li>Homemade discarded mode for opening tabs</li>
                <li>Fix: Privileged URLs opened by the extension are not closed anymore when the extension is restarted</li>
                <li>Extension Tabs (Manager, Preferences) are not reopened if already opened in the window (change focus)</li>
                <li>Private Window Behavior:</li>
                <ul>
                  <li>Private Windows can be invisible (To set in Preferences)</li>
                  <li>Never Export or Save on the Disk</li>
                  <li>Are removed when closed or when the browser exits</li>
                </ul>
                <li>Fix: Tab Selection with pinned tabs not in the group</li>
                <li>Optimize Performance for Event Listeners</li>
                <li>Optimize Open/Close tabs</li>
                <ul>
                  <li>Avoid closing/opening New Tab multiple times</li>
                  <li>Open active tab first, and next the other ones</li>
                  <li>Select tab, change active before opening group (so only one tab is loaded in discarded mode)</li>
                </ul>
                <li>Check data corruption and try to restore automatically</li>
                <li>Back Up:</li>
                <ul>
                  <li>All your groups (except private)</li>
                  <li>In your download folder</li>
                  <li>Automatic: To set in the Preferences (section Groups)</li>
                  <li>Manual: button on right click on the extension icon</li>
                </ul>
                <li>Alternative method for binding groups on load (cf  FF56)</li>
              </ul>
              <li>Shortcuts:</li>
              <ul>
                <li>Shortcut for "creating a new group and switching" has been removed</li>
                <li>Change Open Menu: Alt+Shift+Space -> Ctrl+Shift+Space</li>
                <ul>
                  <li>Done with only one hand</li>
                  <li>Better compatibility with Windows</li>
                </ul>
              </ul>
              <li>Languages:</li>
              <ul>
                <li>German: thanks bitkleberAST (0.4.1)</li>
                <li>Spanish: thanks lucas-mancini (0.4.1)</li>
                <li>Russian: thanks Александр (0.4.1)</li>
              </ul>
              <li>Firefox 56 compatibility</li>
              <li>For Developers:</li>
              <ul>
                <li>Update to React 16 and switch to React JSX</li>
                <li>Makefile Improvement: compile jsx files, compile production extensions</li>
                <li>Change Folder Structure</li>
                <li>Group components are shared</li>
                <li>Tests</li>
                <ul>
                  <li>Add Jasmine library</li>
                  <li>Unit Tests</li>
                  <li>Integration Tests</li>
                </ul>
              </ul>
            </ul>
          }
      </div>
    );
  }

  createContactLink() {
    return;
          /* TODO add Guide
          <span>
              {" ("}
              <a href="https://morikko.github.io/synctabgroups/#contact">
              Contact</a>
              {")"}
          </span>
          */
  }

  createExtensionsLink() {
    return <span>
                {" ("}
              <a href="https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/">Firefox</a>
              {")"}
          </span>
          /*
              <a href="https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/">Chrome</a>
              {"/"}
            </span>
          */
  }

};

AboutSection.propTypes = {
  selected: PropTypes.string,
}
