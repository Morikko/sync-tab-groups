const PrivateWindowSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
    isSync: React.PropTypes.bool,
  },

  prefix: "privateWindow",

  componentWillReceiveProps: function(nextProps) {
    this.setState({
    })
  },

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: 'Private Window'
      }),
      React.createElement(NiceCheckbox, {
        disabled: !this.props.isSync,
        checked: this.props.options.sync,
        label: "Synchronize each new private window as a new group.",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.removeOnClose,
        label: "Remove the groups in the private windows when those windows are closed.",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-removeOnClose",
      }),
    ]);
  },

});
