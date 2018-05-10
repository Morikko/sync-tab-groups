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
        <div className="row-about">
          <div>
            <h3>{browser.i18n.getMessage("options_about_start_title")}</h3>
            <p>{browser.i18n.getMessage("options_about_start")}</p>
          </div>
          <div>
            <h3>{browser.i18n.getMessage("options_about_enjoy_title")}</h3>
            <p>{browser.i18n.getMessage("options_about_enjoy")}</p>
          </div>
          <div>
            <h3>{browser.i18n.getMessage("options_about_contribute_title")}</h3>
            <p>{browser.i18n.getMessage("options_about_contribute")}</p>
          </div>
          <div>
            <h3>{browser.i18n.getMessage("options_about_dev_title")}</h3>
            <p>{browser.i18n.getMessage("options_about_dev")}</p>
          </div>
        </div>
        <div className="row-about-center">
          <a href="https://chrome.google.com/webstore/detail/sync-tab-groups/gbkddinkjahdfhaiifploahejhmaaeoa"
          title="Chrome Add-On page">
            <img src="/share/icons/chrome.png" alt=""/>
          </a>
          <a href="https://morikko.github.io/synctabgroups"
          title="Sync Tab Groups website">
            <img src="/share/icons/sync-tab-groups.png" alt="extension icon"/>
          </a>
          <a href="https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/"
          title="Firefox Add-On page">
            <img src="/share/icons/firefox.png" alt=""/>
          </a>
        </div>
        <h2>
          Release Notes (0.6.8)
        </h2>
        <ul>
          <li>Add: Automatic Error Log</li>
          <li>Check <a href="https://github.com/Morikko/sync-tab-groups/wiki/How-to-help-me-solve-bugs">the wiki page</a> to know how you can help me solved extensions bugs.</li>
          <li>Add: Notification when an error happened, so you can restore your groups and save the log</li>
          <li>Add: Error management in popup, avoid the "empty bubble"</li>
        </ul>
        <h2>
          Release Notes (0.6.7)
        </h2>
        <ul>
          <li>Add: search in tab urls (hostname only)</li>
          <li>Fix: Groups are renamed in tab move menu on tabbar #103</li>
          <li>Add: [OPEN] information in tab move menu on tabbar</li>
          <li>Add: Tabs number in exporting/importing menu #105</li>
        </ul>
        <h2>
          Release Notes (0.6.6)
        </h2>
        <ul>
          <li>Change UI</li>
          <li>Hiding support in progress <a href="https://github.com/Morikko/sync-tab-groups/issues/64">#64</a></li>
        </ul>
        <h2>
          Release Notes (0.6.5)
        </h2>
        <ul>
          <li>Fix: Tabs number not appearing #100</li>
          <li>Add: Translation to Taiwanese Mandarin (thanks @rzfang)</li>
        </ul>
        <h2>
          Release Notes (0.6.4)
        </h2>
        <ul>
          <li>Fix: Ordering the groups by position in UI</li>
          <li>Fix: Too much recursion on prepareGroups #98</li>
          <li>Fix: Tab.isArticle was undefined on discarded tab</li>
          <li>Update: French Translation to v0.6.4</li>
        </ul>
        <h2>
          Release Notes (0.6.3)
        </h2>
        <ul>
          <li>Add Local Back-Up</li>
          <ul>
            <li>Saved in the extension, without a download popup</li>
            <li>Choose the interval time & the max number of back-ups</li>
            <li>See all your back-ups and import, export or remove them</li>
          </ul>
          <li>Add: Groups Selector on Import/Export</li>
          <li>Fix: Move Tab between groups</li>
          <ul>
            <li>Sometimes a wrong tab was moved (due to a duplicate id with closed tabs)</li>
            <li>A tab moved on the same group at the last index was not working properly</li>
          </ul>
          <li>Fix: Tree Style Tab support #26 (partially)</li>
          <li>Add: Unlimited Storage permission: allow extension storage bigger than 5MB (if you use a lot of back-ups with big groups). In any case, your browser is secured, it won't allow to fill the disk entirely.</li>
        </ul>
        <h2>
          Release Notes (0.6.2)
        </h2>
          <ul>
            <li>Fix: Mouse middle click on Chrome</li>
            <li>Fix: Move Tab menu on Tab bar improved</li>
            <li>Fix: Re-edit on group title, provided the old name</li>
            <li>Add: Escape close window popup on Chrome</li>
            <li>Fix: Tab Actions Menu is better placed for not overflowing</li>
            <li>Fix: Extract URL on Lazy tab with no value (Issue 82)</li>
            <li>Update: French Translation</li>
          </ul>
          <h2>
            Release Notes (0.6.1)
          </h2>
          <ul>
            <li>Improve download backup (work on Chrome and clear data after usage) #79</li>
            <li>Fix: Close windows from the cross in the titlebar remove the tabs in the group (Chrome only) #80</li>
          </ul>
          <h2>
            Release Notes (0.6.0)
          </h2>
          <ul>
            <li>Add Chrome compatibility (63+)</li>
            <li>Improve closing function for avoiding switching recursively</li>
            <li>Fix: Groups are reduced when search is ended in Groups Manager</li>
            <li>Fix: Preferences automatically opened when the browser restarted</li>
            <li>Update German translation (thanks @bitkleberAST)</li>
            <li>Fix: Tabs order with pin tabs included (Issue: #68)</li>
            <li>Add Navigation Shortcuts (see Shorcuts section in Preferences)</li>
            <li>Change extra actions menu on tab (Context -> Tooltip)</li>
          </ul>
          <h2>
            Release Notes (0.5.1)
          </h2>
          <ul>
            <li>Fix: Popup always displayed on backup (FF58)</li>
            <li>On update:</li>
            <ul>
              <li>Only open the about tab (without focus)</li>
              <li>Show a notification with the new version number</li>
              <li>A click on the notification focuses the opened about tab</li>
            </ul>
          </ul>
          <h2>
            Release Notes (0.5.0)
          </h2>
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

};

AboutSection.propTypes = {
  selected: PropTypes.string,
}
