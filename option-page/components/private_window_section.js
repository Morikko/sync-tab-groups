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
        title: browser.i18n.getMessage("private_window_title")
      }),
      React.createElement(NiceCheckbox, {
        disabled: !this.props.isSync,
        checked: this.props.options.sync,
        label: browser.i18n.getMessage("new_private_window"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-sync",
      }),
      React.createElement(NiceCheckbox, {
        checked: this.props.options.removeOnClose,
        label: browser.i18n.getMessage("close_private_window"),
        onCheckChange: this.props.onOptionChange,
        id: this.prefix + "-removeOnClose",
      }),
    ]);
  },

});
