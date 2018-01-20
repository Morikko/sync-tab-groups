class SettingsSection extends React.Component {
  constructor(props) {
    super(props);

    this.clickOnVisible = this.clickOnVisible.bind(this);
    this.clickOnInvisible = this.clickOnInvisible.bind(this);
    this.clickOnExcluded = this.clickOnExcluded.bind(this);
    this.clickOnIncluded = this.clickOnIncluded.bind(this);
    this.clickOnPrivate = this.clickOnPrivate.bind(this);
    this.clickOnPrivateInvisible = this.clickOnPrivateInvisible.bind(this);
  }
  render() {
    return React.createElement(
      "div",
      {
        className: "option-section " + (this.props.selected === "settings" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        "Settings"
      ),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("state_new_normal_window"),
        tooltip: React.createElement(
          "div",
          null,
          React.createElement(
            "h2",
            null,
            "Window Help:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Invisible"
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                "New windows created without the Extension are Invisible."
              )
            ),
            React.createElement(
              "li",
              null,
              "Visible"
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                "New windows created without the Extension are Visible as a new unnamed group."
              )
            ),
            React.createElement(
              "li",
              null,
              "Any window can be changed to visible/invisible from the Menu."
            )
          )
        ),
        content: React.createElement(
          "div",
          null,
          React.createElement(OptionButton, {
            title: "Visible",
            onClick: this.clickOnVisible,
            enabled: this.props.options.groups.syncNewWindow
          }),
          React.createElement(OptionButton, {
            title: "Invisible",
            onClick: this.clickOnInvisible,
            enabled: !this.props.options.groups.syncNewWindow
          })
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("pinned_tabs_title"),
        tooltip: [React.createElement(
          "h2",
          { key: "help_pinned_title" },
          "Pinned Tabs Help:"
        ), React.createElement(
          "ul",
          { key: "help_pinned_content" },
          React.createElement(
            "li",
            null,
            "Excluded"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Pinned tabs are not part of any groups."
            ),
            React.createElement(
              "li",
              null,
              "Switching/closing actions don't impact the pinned tabs."
            ),
            React.createElement(
              "li",
              null,
              "Use case: Global Tabs (Mail tab, Music tab...)"
            )
          ),
          React.createElement(
            "li",
            null,
            "Included"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Pinned tabs are part of the group in the window."
            ),
            React.createElement(
              "li",
              null,
              "Switching/closing actions close and save the pinned tabs in the group."
            ),
            React.createElement(
              "li",
              null,
              "Use case: Important tabs for the group."
            )
          )
        )],
        content: [React.createElement(OptionButton, {
          title: "Excluded",
          onClick: this.clickOnExcluded,
          key: "pinned-excluded",
          enabled: !this.props.options.pinnedTab.sync
        }), React.createElement(OptionButton, {
          title: "Included",
          onClick: this.clickOnIncluded,
          key: "pinned-included",
          enabled: this.props.options.pinnedTab.sync
        })]
      }),
      React.createElement(SubSection, {
        title: "Tab Opening Behavior",
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Discarded (Faster and Lighter)"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Tabs are not fully loaded on opening."
            ),
            React.createElement(
              "li",
              null,
              "The tabs are only loaded once you click on it. After, they stay loaded."
            )
          ),
          React.createElement(
            "li",
            null,
            "Full"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Tabs are completely loaded on opening."
            ),
            React.createElement(
              "li",
              null,
              "Consume more memory and network data."
            )
          ),
          React.createElement(
            "li",
            null,
            "Limits (In both cases)"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Tabs History are not restored. (Limited by the browser)"
            ),
            React.createElement(
              "li",
              null,
              "Temporary data (forms...) added before tabs were closed are lost. (Limited by the browser)"
            )
          )
        ),
        content: [React.createElement(OptionButton, {
          title: "Discarded",
          onClick: this.clickOnOpenDiscarded.bind(this),
          enabled: this.props.options.groups.discardedOpen,
          key: "opening-tab-discarded"
        }), React.createElement(OptionButton, {
          title: "Full",
          onClick: this.clickOnOpenFull.bind(this),
          enabled: !this.props.options.groups.discardedOpen,
          key: "opening-tab-full"
        })]
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("private_window_title"),
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Private (Respect the private behavior)"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "New private windows are visible as a new private groups"
            ),
            React.createElement(
              "li",
              null,
              "Groups opened in private windows are private as well."
            ),
            React.createElement(
              "li",
              null,
              "Private groups are not saved on the disk"
            ),
            React.createElement(
              "li",
              null,
              "A private group closed is automatically deleted."
            ),
            React.createElement(
              "li",
              null,
              "A restart of the browser will closed and deleted all the private groups."
            )
          ),
          React.createElement(
            "li",
            null,
            "Invisible"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "New private windows are visible as a new private groups"
            )
          ),
          React.createElement(
            "li",
            null,
            "Any private window can be changed from private/invisible from the Menu."
          )
        ),
        content: [React.createElement(OptionButton, {
          title: "Private",
          onClick: this.clickOnPrivate,
          enabled: this.props.options.privateWindow.sync,
          key: "private-window-private"
        }), React.createElement(OptionButton, {
          title: "Invisible",
          onClick: this.clickOnPrivateInvisible,
          enabled: !this.props.options.privateWindow.sync,
          key: "private-window-invisible"
        })]
      }),
      React.createElement(
        "h2",
        null,
        "Others"
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.groups.removeEmptyGroup,
        label: browser.i18n.getMessage("remove_empty_groups"),
        onCheckChange: this.props.onOptionChange,
        id: "groups-removeEmptyGroup"
      })
    );
  }

  clickOnVisible() {
    this.props.onOptionChange("groups-syncNewWindow", true);
  }

  clickOnInvisible() {
    this.props.onOptionChange("groups-syncNewWindow", false);
  }

  clickOnExcluded() {
    this.props.onOptionChange("pinnedTab-sync", false);
  }

  clickOnIncluded() {
    this.props.onOptionChange("pinnedTab-sync", true);
  }

  clickOnPrivate() {
    this.props.onOptionChange("privateWindow-sync", true);
  }

  clickOnPrivateInvisible() {
    this.props.onOptionChange("privateWindow-sync", false);
  }

  clickOnOpenFull() {
    this.props.onOptionChange("groups-discardedOpen", false);
  }

  clickOnOpenDiscarded() {
    this.props.onOptionChange("groups-discardedOpen", true);
  }
};

SettingsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string
};