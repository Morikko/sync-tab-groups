const PopupSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
  },

  prefix: "popup",

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("toolbar_menu")
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.whiteTheme,
        label: browser.i18n.getMessage("icon_option"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-whiteTheme",
      }),
    ]);
  },

});
