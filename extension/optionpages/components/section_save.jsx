class SaveSectionStandalone extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backupSelected: [],
    };

    this.handleRemoveBackup = this.handleRemoveBackup.bind(this);
    this.handleImportBackup = this.handleImportBackup.bind(this);
    this.handleExportBackup = this.handleExportBackup.bind(this);
    this.handleBackupSelection = this.handleBackupSelection.bind(this);

  }

  componentWillReceiveProps(nextProps) {
    if ( this.props.backupList !== nextProps.backupList ) {
      this.setState({
        backupSelected: this.state.backupSelected.filter(
                backup => nextProps.backupList.hasOwnProperty(backup)
              )
      })
    }
  }

  render() {
    return (
      <div className={"option-section " + (this.props.selected==="groups"?
        "visible":"invisible")}>
        <h1 className="section-title">
          {browser.i18n.getMessage("options_groups")}
        </h1>
        {this.getImportExportSection()}
        {this.getBackUpLocalSection()}
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

  onEnableDownloadBackUp() {
    this.props.onOptionChange("backup-download-enable", true);
  }

  onDisableDownloadBackUp() {
    this.props.onOptionChange("backup-download-enable", false);
  }

  onEnableLocalBackUp() {
    this.props.onOptionChange("backup-local-enable", true);
  }

  onDisableLocalBackUp() {
    this.props.onOptionChange("backup-local-enable", false);
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
              highlight={true}
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

  getBackUpLocalSection(){
    let backups = [];

    let sortedBackupList = Object.entries( this.props.backupList )
                              // Desc: recent first
                              .sort((a,b) => b[1].date - a[1].date)

    for (let backup of sortedBackupList) {
      backups.push(
        <option value={backup[0]}
                key={backup[0]}>
          {(new Date(backup[1].date))
                  .toString()}
        </option>
      );
    }

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
                onClick= {this.onEnableLocalBackUp.bind(this)}
                highlight={this.props.options.backup.local.enable}
              />
              <OptionButton
                title= {browser.i18n.getMessage("options_button_disable")}
                onClick= {this.onDisableLocalBackUp.bind(this)}
                highlight={!this.props.options.backup.local.enable}
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
            <select size="6"
                    multiple
                    onChange={this.handleBackupSelection}
                    style={{
                      overflow: "auto",
                      width: "100%",
                      height: "300px",
                    }}>
              {backups}
            </select>
            <div className="double-buttons">
              <OptionButton
                title= {"Import"}
                onClick= {this.handleImportBackup}
                highlight={this.state.backupSelected.length===1}
                disabled={!(this.state.backupSelected.length===1)}
              />
              <OptionButton
                title= {"Export"}
                onClick= {this.handleExportBackup}
                highlight={this.state.backupSelected.length===1}
                disabled={!(this.state.backupSelected.length===1)}
              />
              <OptionButton
                title= {"Remove"}
                onClick= {this.handleRemoveBackup}
                highlight={this.state.backupSelected.length}
                disabled={!this.state.backupSelected.length}
                dangerous
              />
            </div>
          </div>
        }
      />
    );
  }

  handleRemoveBackup() {
    if (this.state.backupSelected.length ){
      this.props.onRemoveBackUp(this.state.backupSelected);
    }
  }

  handleImportBackup() {
    if (this.state.backupSelected.length===1 ){
      this.props.onImportBackUp(this.state.backupSelected[0]);
    }
  }

  handleExportBackup() {
    if (this.state.backupSelected.length===1 ){
      this.props.onExportBackUp(this.state.backupSelected[0]);
    }
  }

  handleBackupSelection(event) {
    event.stopPropagation();

    let selected = [], sel=event.target;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].selected) {
        selected.push(sel.options[i].value);
      }
    }
    this.setState({
      backupSelected: selected,
    });
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
                onClick= {this.onEnableDownloadBackUp.bind(this)}
                highlight={this.props.options.backup.download.enable}
              />
              <OptionButton
                title= {browser.i18n.getMessage("options_button_disable")}
                onClick= {this.onDisableDownloadBackUp.bind(this)}
                highlight={!this.props.options.backup.download.enable}
              />
            </div>
            {this.props.options.backup.download.enable &&
              this.createCheckBoxesForTimers()}
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
          <div>
            <OptionButton
              title= {"Remove all groups"}
              onClick= {this.handleClickOnRemoveAllGroups.bind(this)}
              highlight={true}
              dangerous
            />
            {/*
            <OptionButton
              title= {"Reload your groups"}
              onClick= {this.handleClickOnReloadGroups.bind(this)}
              highlight={true}
              dangerous
            />
            */}
          </div>
        }
      />
    );
  }
};

SaveSection = (() => {
  return ReactRedux.connect((state) => {
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
  selected: PropTypes.string,
};
