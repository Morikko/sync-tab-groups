class ShortcutsSection extends React.Component {
  render() {
    return (
      <div className={"option-section " + (this.props.selected==="shortcuts"?
        "visible":"invisible")}>
        <h1 className="section-title">
          {browser.i18n.getMessage("shortcuts")}
        </h1>
        <h2>
          Global Shortcuts
        </h2>
        <NiceCheckbox
          checked= {this.props.options.shortcuts.allowGlobal}
          label= {browser.i18n.getMessage("allow_global_shortcuts")}
          onCheckChange= {this.props.onOptionChange}
          id= {"shortcuts-allowGlobal"}
        />
      </div>
    );
  }
};

ShortcutsSection.propTypes = {
  options: PropTypes.object.isRequired,
  onOptionChange: PropTypes.func,
  selected: PropTypes.string,
};
