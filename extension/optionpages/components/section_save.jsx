class SaveSection extends React.Component {
  render() {
    return (
      <div className={"option-section " + (this.props.selected==="groups"?
        "visible":"invisible")}>
        <h1 className="section-title">
          {browser.i18n.getMessage("options_groups")}
        </h1>
        {this.getImportExportSection()}
        {this.getBackUpSection()}
        {this.getBackUpDownloadSection()}
        {this.getCleaningSection()}
      </div>
    );
  }

  createCheckBoxesForTimers() {
    let checkboxes = [];
    for(let time in OptionManager.TIMERS()) {
      checkboxes.push(
        <NiceCheckbox
          checked= {this.props.options.backup.download.time[time]}
          label= {browser.i18n.getMessage("options_groups_backup_every")
                  + browser.i18n.getMessage("options_groups_backup_"+time)}
          onCheckChange= {this.props.onOptionChange}
          id={"backup-download-time-"+time}
          disabled={!this.props.options.backup.download.enable}
          key={time}
        />
      );
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

  getImportExportSection(){
    return (
      <SubSection
        title={browser.i18n.getMessage("import_export_title")}
        tooltip={
          <ul>
            <li>{browser.i18n.getMessage("import_export_help_added")}</li>
            <li>{browser.i18n.getMessage("import_export_help_support")}</li>
          </ul>
        }
        content = {
          <div className="double-column-buttons">
            <OptionButton
              title= {browser.i18n.getMessage("export_groups")}
              onClick= {this.props.onExportClick}
              enabled={true}
            />
            <ButtonFile
              title= {browser.i18n.getMessage("import_groups")}
              id= {"import-groups"}
              onFileSelected= {this.props.onImportClick}
            />
          </div>
        }
      />
    );
  }

  getBackUpSection(){
    return (
      <SubSection
        title={browser.i18n.getMessage("options_groups_backup")}
        tooltip={
          <ul>
            <li>{browser.i18n.getMessage("options_groups_backup_behavior")}</li>
            <ul>
              <li>{browser.i18n.getMessage("options_groups_backup_behavior_download")}</li>
            </ul>
          </ul>
        }
        content = {
          <div>
            <div className="double-buttons">
              <OptionButton
                title= {browser.i18n.getMessage("options_button_enable")}
                onClick= {this.onEnableBackUp.bind(this)}
                enabled={this.props.options.backup.local.enable}
              />
              <OptionButton
                title= {browser.i18n.getMessage("options_button_disable")}
                onClick= {this.onDisableBackUp.bind(this)}
                enabled={!this.props.options.backup.local.enable}
              />
            </div>
            <div>
            <TextInput
              label="Interval time"
              help="Examples: 1, 0.5 (30 mins), 24 (1 day)..."
              id="backup-local-intervalTime"
              onChange={this.props.onOptionChange}
              name={this.props.options.backup.local.intervalTime}
            />
            <TextInput
              label="Max backup"
              id="backup-local-maxSave"
              onChange={this.props.onOptionChange}
              name={this.props.options.backup.local.maxSave}
            />
            </div>
          </div>
        }
      />
    );
  }

  getBackUpDownloadSection(){
    return (
      <SubSection
        title={browser.i18n.getMessage("options_groups_backup")}
        tooltip={
          <ul>
            <li>{browser.i18n.getMessage("options_groups_backup_behavior")}</li>
            <ul>
              <li>{browser.i18n.getMessage("options_groups_backup_behavior_download")}</li>
              <li>{browser.i18n.getMessage("options_groups_backup_behavior_invisible")}</li>
              <li>{browser.i18n.getMessage("options_groups_backup_behavior_distinctfile")}</li>
              <li>{browser.i18n.getMessage("options_groups_backup_behavior_overwritten")}</li>
            </ul>
            <li>{browser.i18n.getMessage("options_groups_backup_location")}</li>
            <ul>
              <li>{browser.i18n.getMessage("options_groups_backup_location_subfolder", StorageManager.Backup.LOCATION)}</li>
              <li>{browser.i18n.getMessage("options_groups_backup_location_restiction")}</li>
            </ul>
            <li>{browser.i18n.getMessage("options_groups_backup_timer")}</li>
            <ul>
              <li>{browser.i18n.getMessage("options_groups_backup_timer_start")}</li>
              <li>{browser.i18n.getMessage("options_groups_backup_timer_done")}</li>
              <li>{browser.i18n.getMessage("options_groups_backup_timer_reset")}</li>
            </ul>
            <li>{browser.i18n.getMessage("options_groups_backup_manual")}</li>
            <ul>
              <li>{browser.i18n.getMessage("options_groups_backup_manual_button")}</li>
              <li>{browser.i18n.getMessage("options_groups_backup_manual_file")}</li>
            </ul>
          </ul>
        }
        content = {
          <div>
            <div className="double-buttons">
              <OptionButton
                title= {browser.i18n.getMessage("options_button_enable")}
                onClick= {this.onEnableBackUp.bind(this)}
                enabled={this.props.options.backup.download.enable}
              />
              <OptionButton
                title= {browser.i18n.getMessage("options_button_disable")}
                onClick= {this.onDisableBackUp.bind(this)}
                enabled={!this.props.options.backup.download.enable}
              />
            </div>
            {this.createCheckBoxesForTimers()}
          </div>
        }
      />
    );
  }

  getCleaningSection(){
    return (
      <SubSection
        title={browser.i18n.getMessage("options_groups_cleaning")}
        tooltip={
          <ul>
            <li>{browser.i18n.getMessage("options_groups_cleaning_removeall")}</li>
            <ul>
              <li>{browser.i18n.getMessage("options_groups_cleaning_removeall_warning")}</li>
            </ul>
          </ul>
        }
        content = {
          <div className="dangerous-zone">
            <OptionButton
              title= {"Remove all groups"}
              onClick= {this.handleClickOnRemoveAllGroups.bind(this)}
              enabled={true}
            />
            {/*
            <OptionButton
              title= {"Reload your groups"}
              onClick= {this.handleClickOnReloadGroups.bind(this)}
              enabled={true}
            />
            */}
          </div>
        }
      />
    );
  }
};

SaveSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  onImportClick: PropTypes.func,
  onExportClick: PropTypes.func,
  onDeleteAllGroups: PropTypes.func,
  onReloadGroups: PropTypes.func,
  selected: PropTypes.string,
};
