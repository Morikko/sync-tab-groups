const PinnedTabSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
  },

  prefix: "pinnedTab",

  render: function() {
    return React.DOM.ul({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: 'Pinned Tab'
      }),
      React.createElement(OptionCheckBox, {
        checked: this.props.options.sync,
        label: "Synchronize the pinned tabs in groups.",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
    ]);
  },

});
