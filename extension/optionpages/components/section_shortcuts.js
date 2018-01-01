const ShortcutsSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
  },

  prefix: "shortcuts",

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("shortcuts")
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.allowGlobal,
        label: browser.i18n.getMessage("allow_global_shortcuts"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-allowGlobal",
      }),
    ]);
  },

});
