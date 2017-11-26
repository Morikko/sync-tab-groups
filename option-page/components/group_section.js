const GroupSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
  },

  prefix: "groups",

  componentWillReceiveProps: function(nextProps) {
    this.setState({
    })
  },

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: 'Group'
      }),
      React.createElement(OptionCheckBox, {
        checked: this.props.options.syncNewWindow,
        label: "Synchronize each new window as a new group.",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-syncNewWindow",
      }),
      React.createElement(OptionCheckBox, {
        checked: this.props.options.removeEmptyGroup,
        label: "Remove the groups with no tab.",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-removeEmptyGroup",
      }),
    ]);
  },

});
