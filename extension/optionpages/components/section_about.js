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
      developper: []
    }];

    return React.createElement(
      "div",
      {
        className: "option-section about " + (this.props.selected === "about" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        browser.i18n.getMessage("options_about")
      ),
      React.createElement(
        "h2",
        null,
        "Sync Tab Groups"
      ),
      React.createElement(
        "div",
        { className: "row-about" },
        React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            browser.i18n.getMessage("options_about_start_title")
          ),
          React.createElement(
            "p",
            null,
            browser.i18n.getMessage("options_about_start")
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            browser.i18n.getMessage("options_about_enjoy_title")
          ),
          React.createElement(
            "p",
            null,
            browser.i18n.getMessage("options_about_enjoy")
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            browser.i18n.getMessage("options_about_contribute_title")
          ),
          React.createElement(
            "p",
            null,
            browser.i18n.getMessage("options_about_contribute")
          )
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "h3",
            null,
            browser.i18n.getMessage("options_about_dev_title")
          ),
          React.createElement(
            "p",
            null,
            browser.i18n.getMessage("options_about_dev")
          )
        )
      ),
      React.createElement(
        "div",
        { className: "row-about-center" },
        React.createElement(
          "a",
          { href: "https://chrome.google.com/webstore/detail/sync-tab-groups/gbkddinkjahdfhaiifploahejhmaaeoa",
            title: "Chrome Add-On page" },
          React.createElement("img", { src: "/share/icons/chrome.png", alt: "" })
        ),
        React.createElement(
          "a",
          { href: "https://morikko.github.io/synctabgroups",
            title: "Sync Tab Groups website" },
          React.createElement("img", { src: "/share/icons/sync-tab-groups.png", alt: "extension icon" })
        ),
        React.createElement(
          "a",
          { href: "https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/",
            title: "Firefox Add-On page" },
          React.createElement("img", { src: "/share/icons/firefox.png", alt: "" })
        )
      ),
      React.createElement(
        "h2",
        null,
        "Release Notes (0.6.1)"
      ),
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          "Improve download backup (work on Chrome and clear data after usage) #79"
        ),
        React.createElement(
          "li",
          null,
          "Fix: Close windows from the cross in the titlebar remove the tabs in the group (Chrome only) #80"
        )
      ),
      React.createElement(
        "h2",
        null,
        "Release Notes (0.6.0)"
      ),
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          "Add Chrome compatibility (63+)"
        ),
        React.createElement(
          "li",
          null,
          "Improve closing function for avoiding switching recursively"
        ),
        React.createElement(
          "li",
          null,
          "Fix: Groups are reduced when search is ended in Groups Manager"
        ),
        React.createElement(
          "li",
          null,
          "Fix: Preferences automatically opened when the browser restarted"
        ),
        React.createElement(
          "li",
          null,
          "Update German translation (thanks @bitkleberAST)"
        ),
        React.createElement(
          "li",
          null,
          "Fix: Tabs order with pin tabs included (Issue: #68)"
        ),
        React.createElement(
          "li",
          null,
          "Add Navigation Shortcuts (see Shorcuts section in Preferences)"
        ),
        React.createElement(
          "li",
          null,
          "Change extra actions menu on tab (Context -> Tooltip)"
        )
      ),
      React.createElement(
        "h2",
        null,
        "Release Notes (0.5.1)"
      ),
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          "Fix: Popup always displayed on backup (FF58)"
        ),
        React.createElement(
          "li",
          null,
          "On update:"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Only open the about tab (without focus)"
          ),
          React.createElement(
            "li",
            null,
            "Show a notification with the new version number"
          ),
          React.createElement(
            "li",
            null,
            "A click on the notification focuses the opened about tab"
          )
        )
      ),
      React.createElement(
        "h2",
        null,
        "Release Notes (0.5.0)"
      ),
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          "Groups Interface"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Improve search"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Fix wrong results"
            ),
            React.createElement(
              "li",
              null,
              "Add Highlight"
            ),
            React.createElement(
              "li",
              null,
              "Search groups \"g/search_groups/\", tabs \"search_tabs\" or both \"g/search_groups/search_tabs\""
            )
          ),
          React.createElement(
            "li",
            null,
            "New Interface"
          ),
          React.createElement(
            "li",
            null,
            "Optimize Displaying Performance"
          ),
          React.createElement(
            "li",
            null,
            "Show message if no group"
          ),
          React.createElement(
            "li",
            null,
            "Mouse Middle Click on"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Group: Open the group in a new window"
            ),
            React.createElement(
              "li",
              null,
              "Tab: Open the group in a new window with the selected tab as active"
            )
          )
        ),
        React.createElement(
          "li",
          null,
          "Menu"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Main Bar at the bottom"
          ),
          React.createElement(
            "li",
            null,
            "Remember visible tabs"
          ),
          React.createElement(
            "li",
            null,
            "Add actions:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Show the tabs of all your groups"
            ),
            React.createElement(
              "li",
              null,
              "Hide the tabs of all your groups"
            ),
            React.createElement(
              "li",
              null,
              "Open Groups Manager"
            )
          )
        ),
        React.createElement(
          "li",
          null,
          "Options"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "New Interface split into different sections"
          ),
          React.createElement(
            "li",
            null,
            "Add help messages for the different options"
          ),
          React.createElement(
            "li",
            null,
            "Fix: Select element was badly displayed on Windows"
          ),
          React.createElement(
            "li",
            null,
            "Add button: Remove all groups"
          ),
          React.createElement(
            "li",
            null,
            "Add options:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Managing the back up"
            ),
            React.createElement(
              "li",
              null,
              "Selecting the tabs opening method (full or discarded)"
            )
          )
        ),
        React.createElement(
          "li",
          null,
          "Groups Manager"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Show your groups in a specific tab"
          ),
          React.createElement(
            "li",
            null,
            "Single or Double columns"
          ),
          React.createElement(
            "li",
            null,
            "Differences with the Menu:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Groups don't remember visible tabs state"
            ),
            React.createElement(
              "li",
              null,
              "A click on:"
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                "Group: Show/Hide tabs"
              ),
              React.createElement(
                "li",
                null,
                "Tabs: Nothing"
              )
            )
          ),
          React.createElement(
            "li",
            null,
            "Actions:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Hide/Show tabs of all groups"
            ),
            React.createElement(
              "li",
              null,
              "Search Bar (same function as in Menu)"
            )
          )
        ),
        React.createElement(
          "li",
          null,
          "Groups Behaviors"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Homemade discarded mode for opening tabs"
          ),
          React.createElement(
            "li",
            null,
            "Fix: Privileged URLs opened by the extension are not closed anymore when the extension is restarted"
          ),
          React.createElement(
            "li",
            null,
            "Extension Tabs (Manager, Preferences) are not reopened if already opened in the window (change focus)"
          ),
          React.createElement(
            "li",
            null,
            "Private Window Behavior:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Private Windows can be invisible (To set in Preferences)"
            ),
            React.createElement(
              "li",
              null,
              "Never Export or Save on the Disk"
            ),
            React.createElement(
              "li",
              null,
              "Are removed when closed or when the browser exits"
            )
          ),
          React.createElement(
            "li",
            null,
            "Fix: Tab Selection with pinned tabs not in the group"
          ),
          React.createElement(
            "li",
            null,
            "Optimize Performance for Event Listeners"
          ),
          React.createElement(
            "li",
            null,
            "Optimize Open/Close tabs"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Avoid closing/opening New Tab multiple times"
            ),
            React.createElement(
              "li",
              null,
              "Open active tab first, and next the other ones"
            ),
            React.createElement(
              "li",
              null,
              "Select tab, change active before opening group (so only one tab is loaded in discarded mode)"
            )
          ),
          React.createElement(
            "li",
            null,
            "Check data corruption and try to restore automatically"
          ),
          React.createElement(
            "li",
            null,
            "Back Up:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "All your groups (except private)"
            ),
            React.createElement(
              "li",
              null,
              "In your download folder"
            ),
            React.createElement(
              "li",
              null,
              "Automatic: To set in the Preferences (section Groups)"
            ),
            React.createElement(
              "li",
              null,
              "Manual: button on right click on the extension icon"
            )
          ),
          React.createElement(
            "li",
            null,
            "Alternative method for binding groups on load (cf  FF56)"
          )
        ),
        React.createElement(
          "li",
          null,
          "Shortcuts:"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Shortcut for \"creating a new group and switching\" has been removed"
          ),
          React.createElement(
            "li",
            null,
            "Change Open Menu: Alt+Shift+Space -> Ctrl+Shift+Space"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Done with only one hand"
            ),
            React.createElement(
              "li",
              null,
              "Better compatibility with Windows"
            )
          )
        ),
        React.createElement(
          "li",
          null,
          "Languages:"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "German: thanks bitkleberAST (0.4.1)"
          ),
          React.createElement(
            "li",
            null,
            "Spanish: thanks lucas-mancini (0.4.1)"
          ),
          React.createElement(
            "li",
            null,
            "Russian: thanks \u0410\u043B\u0435\u043A\u0441\u0430\u043D\u0434\u0440 (0.4.1)"
          )
        ),
        React.createElement(
          "li",
          null,
          "Firefox 56 compatibility"
        ),
        React.createElement(
          "li",
          null,
          "For Developers:"
        ),
        React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Update to React 16 and switch to React JSX"
          ),
          React.createElement(
            "li",
            null,
            "Makefile Improvement: compile jsx files, compile production extensions"
          ),
          React.createElement(
            "li",
            null,
            "Change Folder Structure"
          ),
          React.createElement(
            "li",
            null,
            "Group components are shared"
          ),
          React.createElement(
            "li",
            null,
            "Tests"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Add Jasmine library"
            ),
            React.createElement(
              "li",
              null,
              "Unit Tests"
            ),
            React.createElement(
              "li",
              null,
              "Integration Tests"
            )
          )
        )
      )
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
  selected: PropTypes.string
};