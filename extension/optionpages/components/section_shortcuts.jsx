const ShortcutsSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    selected: React.PropTypes.string,
  },

  prefix: "shortcuts",

  render: function() {
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
  },

});
