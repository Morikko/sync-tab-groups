const OptionCheckBox = React.createClass({
  propTypes: {
    checked: React.PropTypes.bool,
    label: React.PropTypes.string,
    onCheckChange: React.PropTypes.func,
    id: React.PropTypes.string,
  },

  render: function() {
    return React.DOM.div({
      className: "option-checkbox"
    }, [
      React.DOM.input({
        type: "checkbox",
        checked: this.props.checked,
        id: this.props.id,
        onClick: this.handleClick,
      }),
      React.DOM.label({
        for: this.props.id
      }, this.props.label)
    ]);
  },

  handleClick: function(event) {
    event.stopPropagation();
    this.props.checked = !this.props.checked

    this.props.onCheckChange(this.props.id, this.props.checked);
  }

});
