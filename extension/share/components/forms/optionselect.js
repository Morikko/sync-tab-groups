class OptionSelect extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  render() {
    return React.createElement(
      "div",
      {
        className: "select",
        htmlFor: this.props.id },
      React.createElement(
        "select",
        {
          id: this.props.id,
          onChange: this.handleChange,
          value: this.props.selected },
        this.props.choices.map(choice => {
          return React.createElement(
            "option",
            {
              key: choice.value,
              value: choice.value
              /*selected={choice.value===this.props.selected}*/ },
            choice.label
          );
        })
      ),
      React.createElement("div", { className: "select__arrow" }),
      React.createElement(
        "span",
        null,
        this.props.label
      )
    );
  }

  handleChange(event) {
    event.stopPropagation();

    let selectedValue = parseInt(event.target.options[event.target.selectedIndex].value, 10);

    this.props.onValueChange(this.props.id, selectedValue);
  }
};

OptionSelect.propTypes = {
  onValueChange: PropTypes.func,
  selected: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  choices: PropTypes.object // [{value, label}]
};