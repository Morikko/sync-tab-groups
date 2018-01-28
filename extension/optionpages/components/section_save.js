class SaveSection extends React.Component {
  render() {
    return React.createElement(
      "div",
      { className: "option-section " + (this.props.selected === "groups" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        browser.i18n.getMessage("options_groups")
      ),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("import_export_title"),
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("import_export_help_added")
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("import_export_help_support")
          )
        ),
        content: React.createElement(
          "div",
          { className: "double-column-buttons" },
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("export_groups"),
            onClick: this.props.onExportClick,
            enabled: true
          }),
          React.createElement(ButtonFile, {
            title: browser.i18n.getMessage("import_groups"),
            id: "import-groups",
            onFileSelected: this.props.onImportClick
          })
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("options_groups_backup"),
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_groups_backup_behavior")
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_behavior_download")
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_behavior_invisible")
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_behavior_distinctfile")
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_behavior_overwritten")
            )
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_groups_backup_location")
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_location_subfolder", StorageManager.Backup.LOCATION)
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_location_restiction")
            )
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_groups_backup_timer")
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_timer_start")
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_timer_done")
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_timer_reset")
            )
          ),
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_groups_backup_manual")
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_manual_button")
            ),
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_backup_manual_file")
            )
          )
        ),
        content: React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "double-buttons" },
            React.createElement(OptionButton, {
              title: browser.i18n.getMessage("options_button_enable"),
              onClick: this.onEnableBackUp.bind(this),
              enabled: this.props.options.backup.enable
            }),
            React.createElement(OptionButton, {
              title: browser.i18n.getMessage("options_button_disable"),
              onClick: this.onDisableBackUp.bind(this),
              enabled: !this.props.options.backup.enable
            })
          ),
          this.createCheckBoxesForTimers()
        )
      }),
      React.createElement(SubSection, {
        title: browser.i18n.getMessage("options_groups_cleaning"),
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            browser.i18n.getMessage("options_groups_cleaning_removeall")
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              browser.i18n.getMessage("options_groups_cleaning_removeall_warning")
            )
          )
        ),
        content: React.createElement(
          "div",
          { className: "dangerous-zone" },
          React.createElement(OptionButton, {
            title: "Remove all groups",
            onClick: this.handleClickOnRemoveAllGroups.bind(this),
            enabled: true
          })
        )
      })
    );
    /* TODO: end of bookmark auto-save
    React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("bookmarks_title")
      }),
      React.DOM.span({},
        React.DOM.ul({},[
          React.DOM.li({},browser.i18n.getMessage("bookmarks_weak_help")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_folder")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_moving")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_session")),
          React.DOM.li({},browser.i18n.getMessage("bookmark_help_precaution")),
      ])),
      React.createElement(OptionInput, {
        label: browser.i18n.getMessage("name_session"),
        help: browser.i18n.getMessage("examples_session"),
        name: this.props.options.folder,
        onChange: this.props.onOptionChange,
        id: this.prefix + "-folder",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.sync,
        label: browser.i18n.getMessage("save_bookmarks_automatically"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(OptionButton, {
        title: browser.i18n.getMessage("save_now"),
        onClick: this.props.onBackUpClick
      }),
    ])*/
  }

  createCheckBoxesForTimers() {
    let checkboxes = [];
    for (let time in OptionManager.TIMERS()) {
      checkboxes.push(React.createElement(NiceCheckbox, {
        checked: this.props.options.backup.time[time],
        label: browser.i18n.getMessage("options_groups_backup_every") + browser.i18n.getMessage("options_groups_backup_" + time),
        onCheckChange: this.props.onOptionChange,
        id: "backup-time-" + time,
        disabled: !this.props.options.backup.enable,
        key: time
      }));
    }
    return checkboxes;
  }

  onEnableBackUp() {
    this.props.onOptionChange("backup-enable", true);
  }

  onDisableBackUp() {
    this.props.onOptionChange("backup-enable", false);
  }

  handleClickOnRemoveAllGroups() {
    if (confirm("Are you sure you want to remove all the groups?")) {
      this.props.onDeleteAllGroups();
    }
  }

  handleClickOnReloadGroups() {
    if (confirm("Are you sure you want to reload your groups from the disk?")) {
      this.props.onReloadGroups();
    }
  }
};

SaveSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  onImportClick: PropTypes.func,
  onExportClick: PropTypes.func,
  onDeleteAllGroups: PropTypes.func,
  onReloadGroups: PropTypes.func,
  selected: PropTypes.string
};