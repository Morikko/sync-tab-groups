const PrivateWindowSection = React.createClass({
  propTypes: {
    options: React.PropTypes.object.isRequired,
    onOptionChange: React.PropTypes.func,
  },

  prefix: "privateWindow",

  componentWillReceiveProps: function(nextProps) {
    this.setState({
    })
  },

  render: function() {
    return React.DOM.ul({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: 'Private Window'
      }),
      React.createElement(OptionCheckBox, {
        checked: this.props.options.sync,
        label: "Synchronize the private windows as groups.",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(OptionCheckBox, {
        checked: this.props.options.removeOnClose,
        label: "Remove the groups in the private windows when those windows are closed.",
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-removeOnClose",
      }),
    ]);
  },

});
