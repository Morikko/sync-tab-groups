const PinnedTabSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
  },

  prefix: "pinnedTab",

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: browser.i18n.getMessage("pinned_tabs_title")
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.sync,
        label: browser.i18n.getMessage("sync_pinned_tabs"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
    ]);
  },

});
