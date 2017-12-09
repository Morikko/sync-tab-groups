const OptionSelect = React.createClass({
  propTypes: {
    onValueChange: React.PropTypes.func,
    selected: React.PropTypes.bool,
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    choices: React.PropTypes.object, // [{value, label}]
  },

  render: function() {
    return React.DOM.div({
      className: "select",
      for: this.props.id
    }, [
      React.DOM.select({
          id: this.props.id,
          onChange: this.handleChange,
        },
        this.props.choices.map((choice) => {
          return React.DOM.option({
            value: choice.value,
            selected: choice.value === this.props.selected,
          }, choice.label)
        })),
      React.DOM.div({
        className: "select__arrow"
      }),
      this.props.label,
    ]);
  },

  handleChange: function(event) {
    event.stopPropagation();

    let selectedValue = parseInt(event.target.options[event.target.selectedIndex].value, 10)

    this.props.onValueChange(this.props.id, selectedValue);

  },
});
