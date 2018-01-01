const OptionsPanel = React.createClass({
  propTypes: {
    onOptionChange: React.PropTypes.func,
    onBackUpClick: React.PropTypes.func,
    onImportClick: React.PropTypes.func,
    onExportClick: React.PropTypes.func,
    selected: React.PropTypes.string,
  },

  render: function() {
    return (
      <div id="panel">
        <SettingsSection
          options={this.props.options} onOptionChange={this.props.onOptionChange}
          selected={this.props.selected}/>
        {/*<AdvSettingsSection
          options={this.props.options.groups} onOptionChange={this.props.onOptionChange}
          selected={this.props.selected}/>
        */}
        <ShortcutsSection
          options={this.props.options} onOptionChange={this.props.onOptionChange}
        selected={this.props.selected}/>
        <InterfaceSection
          options={this.props.options} onOptionChange={this.props.onOptionChange}
        selected={this.props.selected}/>
        <SaveSection
          options={this.props.options} onOptionChange={this.props.onOptionChange}
          onImportClick={this.props.onImportClick}
          onExportClick={this.props.onExportClick}
          selected={this.props.selected}
         /* TODO: end of bookmark auto-save
         onBackUpClick: this.props.onBackUpClick*//>
        <AboutSection
        selected={this.props.selected}/>
        <HelpSection
        selected={this.props.selected}/>
      </div>
    );
  }
});
