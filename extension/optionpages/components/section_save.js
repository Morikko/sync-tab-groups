class SaveSectionStandalone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backupSelected: []
    };

    this.getBackUpList = this.getBackUpList.bind(this);
    this.handleRemoveBackup = this.handleRemoveBackup.bind(this);
    this.handleImportBackup = this.handleImportBackup.bind(this);
    this.handleExportBackup = this.handleExportBackup.bind(this);
    this.handleBackupSelection = this.handleBackupSelection.bind(this);
  }

  async getBackUpList() {
    let bg = await browser.runtime.getBackgroundPage();

    this.setState({
      backupList: await bg.StorageManager.Local.getBackUpList()
    });
  }

  render() {
    return React.createElement(
      "div",
      { className: "option-section " + (this.props.selected === "groups" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        browser.i18n.getMessage("options_groups")
      ),
      this.getImportExportSection(),
      this.getBackUpLocalSection(),
      this.getBackUpDownloadSection(),
      this.getCleaningSection()
    );
  }

  createCheckBoxesForTimers() {
    let checkboxes = [];
    for (let time in OptionManager.TIMERS()) {
      checkboxes.push(React.createElement(NiceCheckbox, {
        checked: this.props.options.backup.download.time[time],
        label: browser.i18n.getMessage("options_groups_backup_every") + browser.i18n.getMessage("options_groups_backup_" + time),
        onCheckChange: this.props.onOptionChange,
        id: "backup-download-time-" + time,
        disabled: !this.props.options.backup.download.enable,
        key: time
      }));
    }
    return checkboxes;
  }

  onEnableBackUp() {
    this.props.onOptionChange("backup-download-enable", true);
  }

  onDisableBackUp() {
    this.props.onOptionChange("backup-download-enable", false);
  }

  handleClickOnRemoveAllGroups() {
    if (confirm(browser.i18n.getMessage("options_remove_groups_confirm"))) {
      this.props.onDeleteAllGroups();
    }
  }

  handleClickOnReloadGroups() {
    if (confirm("Are you sure you want to reload your groups from the disk?")) {
      this.props.onReloadGroups();
    }
  }

  getImportExportSection() {
    return React.createElement(SubSection, {
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
    });
  }

  getBackUpLocalSection() {
    let backups = [];

    let sortedBackupList = Object.entries(this.props.backupList)
    // Desc: recent first
    .sort((a, b) => b[1].date - a[1].date);

    for (let backup of sortedBackupList) {
      backups.push(React.createElement(
        "option",
        { value: backup[0],
          key: backup[0] },
        new Date(backup[1].date).toString()
      ));
    }

    return React.createElement(SubSection, {
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
            enabled: this.props.options.backup.local.enable
          }),
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_button_disable"),
            onClick: this.onDisableBackUp.bind(this),
            enabled: !this.props.options.backup.local.enable
          })
        ),
        React.createElement(
          "div",
          null,
          React.createElement(TextInput, {
            label: "Interval time",
            help: "Examples: 1, 0.5 (30 mins), 24 (1 day)...",
            id: "backup-local-intervalTime",
            onChange: this.props.onOptionChange,
            name: this.props.options.backup.local.intervalTime
          }),
          React.createElement(TextInput, {
            label: "Max backup",
            id: "backup-local-maxSave",
            onChange: this.props.onOptionChange,
            name: this.props.options.backup.local.maxSave
          })
        ),
        React.createElement(
          "select",
          { size: "6",
            multiple: true,
            onChange: this.handleBackupSelection,
            style: {
              overflow: "auto",
              width: "100%",
              height: "300px"
            } },
          backups
        ),
        React.createElement(
          "div",
          { className: "triple-buttons" },
          React.createElement(
            "div",
            { className: "dangerous-zone" },
            React.createElement(OptionButton, {
              title: "Remove",
              onClick: this.handleRemoveBackup,
              enabled: this.state.backupSelected.length
            })
          ),
          React.createElement(OptionButton, {
            title: "Import",
            onClick: this.handleImportBackup,
            enabled: this.state.backupSelected.length === 1
          }),
          React.createElement(OptionButton, {
            title: "Export",
            onClick: this.handleExportBackup,
            enabled: this.state.backupSelected.length === 1
          })
        )
      )
    });
  }

  handleRemoveBackup() {
    if (this.state.backupSelected.length) {
      this.props.onRemoveBackUp(this.state.backupSelected);
    }
  }

  handleImportBackup() {
    if (this.state.backupSelected.length === 1) {
      this.props.onImportBackUp(this.state.backupSelected[0]);
    }
  }

  handleExportBackup() {
    if (this.state.backupSelected.length === 1) {
      this.props.onExportBackUp(this.state.backupSelected[0]);
    }
  }

  handleBackupSelection(event) {
    event.stopPropagation();

    let selected = [],
        sel = event.target;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].selected) {
        selected.push(sel.options[i].value);
      }
    }
    this.setState({
      backupSelected: selected
    });
  }

  getBackUpDownloadSection() {
    return React.createElement(SubSection, {
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
            enabled: this.props.options.backup.download.enable
          }),
          React.createElement(OptionButton, {
            title: browser.i18n.getMessage("options_button_disable"),
            onClick: this.onDisableBackUp.bind(this),
            enabled: !this.props.options.backup.download.enable
          })
        ),
        this.createCheckBoxesForTimers()
      )
    });
  }

  getCleaningSection() {
    return React.createElement(SubSection, {
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
    });
  }
};

SaveSection = (() => {
  return ReactRedux.connect(state => {
    return {
      backupList: state.get("backupList")
    };
  }, ActionCreators)(SaveSectionStandalone);
})();

SaveSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  onImportClick: PropTypes.func,
  onExportClick: PropTypes.func,
  onDeleteAllGroups: PropTypes.func,
  onReloadGroups: PropTypes.func,
  selected: PropTypes.string
};