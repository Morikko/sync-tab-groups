class SaveSection extends React.Component {
  render() {
    return React.createElement(
      "div",
      { className: "option-section " + (this.props.selected === "save" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        "Groups"
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
          null,
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
        title: "Back Up",
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Behaviors"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Back Up is an automatic download of a file with all your groups."
            ),
            React.createElement(
              "li",
              null,
              "The download is visible in the download history (it can't be hidden)"
            ),
            React.createElement(
              "li",
              null,
              "Each specific timer is saved in a distinct file."
            ),
            React.createElement(
              "li",
              null,
              "However the same timer will overwrite its previous back up."
            )
          ),
          React.createElement(
            "li",
            null,
            "Back Up Location"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Back Up is done in the subfolder '" + StorageManager.Backup.LOCATION + "' in your browser download folder."
            ),
            React.createElement(
              "li",
              null,
              "The browser restricts it to be inside the browser download folder, so you can change the location."
            )
          ),
          React.createElement(
            "li",
            null,
            "Timer explanation"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Timers are started when the extension is launched."
            ),
            React.createElement(
              "li",
              null,
              "Timers are reset to 0, when you restart the browser or disable the extension."
            )
          ),
          React.createElement(
            "li",
            null,
            "Manual Back Up"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "From the shortcuts menu (Right click on the extension icon)."
            ),
            React.createElement(
              "li",
              null,
              "The back up is in a distinct file but the behaviors are the same."
            )
          )
        ),
        content: React.createElement(
          "div",
          null,
          React.createElement(OptionButton, {
            title: "Enable",
            onClick: this.onEnableBackUp.bind(this),
            enabled: this.props.options.backup.enable
          }),
          React.createElement(OptionButton, {
            title: "Disable",
            onClick: this.onDisableBackUp.bind(this),
            enabled: !this.props.options.backup.enable
          }),
          this.createCheckBoxesForTimers()
        )
      }),
      React.createElement(SubSection, {
        title: "Cleaning (Dangerous)",
        tooltip: React.createElement(
          "ul",
          null,
          React.createElement(
            "li",
            null,
            "Remove all groups:"
          ),
          React.createElement(
            "ul",
            null,
            React.createElement(
              "li",
              null,
              "Once done, you can't recover your groups if you don't have export them manually."
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
    for (let time in OptionManager.TIMERS) {
      checkboxes.push(React.createElement(NiceCheckbox, {
        checked: this.props.options.backup.time[time],
        label: "Back up every " + time,
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