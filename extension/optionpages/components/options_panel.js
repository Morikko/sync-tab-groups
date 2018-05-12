class OptionsPanel extends React.Component {
  render() {
    return React.createElement(
      "div",
      { id: "panel" },
      React.createElement(SettingsSection, {
        options: this.props.options,
        onOptionChange: this.props.onOptionChange,
        selected: this.props.selected,
        onUndiscardLazyTabs: this.props.onUndiscardLazyTabs,
        onCloseAllHiddenTabs: this.props.onCloseAllHiddenTabs,
        downloadErrorLog: this.props.downloadErrorLog
      }),
      React.createElement(ShortcutsSection, {
        options: this.props.options, onOptionChange: this.props.onOptionChange,
        selected: this.props.selected }),
      React.createElement(InterfaceSection, {
        options: this.props.options, onOptionChange: this.props.onOptionChange,
        selected: this.props.selected }),
      React.createElement(SaveSection, {
        options: this.props.options, onOptionChange: this.props.onOptionChange,
        onImportClick: this.props.onImportClick,
        onExportClick: this.props.onExportClick,
        onDeleteAllGroups: this.props.onDeleteAllGroups,
        onReloadGroups: this.props.onReloadGroups,
        selected: this.props.selected,
        onRemoveBackUp: this.props.onRemoveBackUp,
        onImportBackUp: this.props.onImportBackUp,
        onExportBackUp: this.props.onExportBackUp
        /* TODO: end of bookmark auto-save
        onBackUpClick: this.props.onBackUpClick*/ }),
      React.createElement(AboutSection, {
        selected: this.props.selected })
    );
  }
};

OptionsPanel.propTypes = {
  onOptionChange: PropTypes.func,
  onBackUpClick: PropTypes.func,
  onImportClick: PropTypes.func,
  onExportClick: PropTypes.func,
  onDeleteAllGroups: PropTypes.func,
  onReloadGroups: PropTypes.func,
  selected: PropTypes.string
};