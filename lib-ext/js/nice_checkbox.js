const NiceCheckbox = React.createClass({
  propTypes: {
    onCheckChange: React.PropTypes.func,
    checked: React.PropTypes.bool,
    id: React.PropTypes.string,
    label: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      checked: this.props.checked,
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      checked: nextProps.checked
    })
  },

  render: function() {
    return React.DOM.label({
        className: "control control--checkbox",
        for: this.props.id
      }, [
        this.props.label,
        React.DOM.input({
          type: "checkbox",
          checked: this.state.checked,
          id: this.props.id,
          onClick: this.handleClick,
        }),
        React.DOM.div({
          className: "control__indicator"
        })
      ]);
  },

  handleClick: function(event) {
    event.stopPropagation();
    this.props.onCheckChange(!this.state.checked);

    this.setState({
      checked: !this.state.checked
    });
  },
});
