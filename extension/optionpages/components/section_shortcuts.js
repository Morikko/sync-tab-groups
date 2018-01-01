const ShortcutsSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    selected: React.PropTypes.string
  },

  prefix: "shortcuts",

  render: function () {
    return React.createElement(
      "div",
      { className: "option-section " + (this.props.selected === "shortcuts" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        browser.i18n.getMessage("shortcuts")
      ),
      React.createElement(
        "h2",
        null,
        "Global Shortcuts"
      ),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.shortcuts.allowGlobal,
        label: browser.i18n.getMessage("allow_global_shortcuts"),
        onCheckChange: this.props.onOptionChange,
        id: "shortcuts-allowGlobal"
      })
    );
  }

});