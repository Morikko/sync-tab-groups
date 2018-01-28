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
        browser.i18n.getMessage("options_settings")
      ),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("state_new_normal_window"),
        tooltip: React.createElement(
          "div",
          null,
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_help_title_invisible")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_help_invisible")
              )
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_help_title_visible")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_help_visible_new")
              )
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_help_change_visibility")
            )
          )
        ),
        content: React.createElement(
          "div",
          { className: "double-buttons" },
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_help_title_visible"),
            onClick: this.clickOnVisible,
            enabled: this.props.options.groups.syncNewWindow
          }),
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_help_title_invisible"),
            onClick: this.clickOnInvisible,
            enabled: !this.props.options.groups.syncNewWindow
          })
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("pinned_tabs_title"),
        tooltip: React.createElement(
          "div",
          null,
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_pinned_excluded")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_pinned_excluded_notpart")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_pinned_excluded_switching")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_pinned_excluded_usecase")
              )
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_pinned_included")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_pinned_included_part")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_pinned_included_switching")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_pinned_included_usecase")
              )
            )
          )
        ),
        content: React.createElement(
          "div",
          { className: "double-buttons" },
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_pinned_excluded"),
            onClick: this.clickOnExcluded,
            key: "pinned-excluded",
            enabled: !this.props.options.pinnedTab.sync
          }),
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_pinned_included"),
            onClick: this.clickOnIncluded,
            key: "pinned-included",
            enabled: this.props.options.pinnedTab.sync
          })
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("options_behaviors_tabsopening"),
        tooltip: React.createElement(
          "div",
          null,
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_tabsopening_discarded")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_tabsopening_discarded_lighter")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_tabsopening_discarded_notfullyloaded")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_tabsopening_discarded_loadedclick")
              )
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_tabsopening_full")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_tabsopening_full_loadedopening")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_tabsopening_full_heavier")
              )
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_tabsopening_limits")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_tabsopening_limits_history")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_tabsopening_limits_temporary")
              )
            )
          )
        ),
        content: React.createElement(
          "div",
          { className: "double-buttons" },
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_tabsopening_discarded"),
            onClick: this.clickOnOpenDiscarded.bind(this),
            enabled: this.props.options.groups.discardedOpen,
            key: "opening-tab-discarded"
          }),
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_tabsopening_full"),
            onClick: this.clickOnOpenFull.bind(this),
            enabled: !this.props.options.groups.discardedOpen,
            key: "opening-tab-full"
          })
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("private_window_title"),
        tooltip: React.createElement(
          "div",
          null,
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_private")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_private_visible")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_private_groups")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_private_notsaved")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_private_autoremoved")
              ),
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_private_restart")
              )
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_private_invisible")
            ),
            React.createElement(
              "ul",
              null,
              React.createElement(
                "li",
                null,
                browser.i18n.getMessage("options_behaviors_private_invisible_creation")
              )
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_behaviors_private_changestate")
            )
          )
        ),
        content: React.createElement(
          "div",
          { className: "double-buttons" },
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_private"),
            onClick: this.clickOnPrivate,
            enabled: this.props.options.privateWindow.sync,
            key: "private-window-private"
          }),
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_behaviors_private_invisible"),
            onClick: this.clickOnPrivateInvisible,
            enabled: !this.props.options.privateWindow.sync,
            key: "private-window-invisible"
          })
        )
      }),
      React.createElement(
        "h2",
        null,
        browser.i18n.getMessage("options_settings_others")
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