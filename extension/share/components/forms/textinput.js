class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name
    });
  }

  render() {
    let help_section = [];
    if (this.props.help !== undefined) {
      help_section = React.createElement(
        "span",
        { className: "option-input-text-help" },
        this.props.help
      );
    }

    return React.createElement(
      "div",
      { className: "option-input-text" },
      React.createElement(
        "div",
        { style: {
            display: "flex",
            justifyContent: "space-between"
          } },
        React.createElement(
          "span",
          {
            className: "option-input-text-label",
            "for": this.props.id },
          this.props.label
        ),
        React.createElement("input", {
          type: "text",
          value: this.state.name,
          id: this.props.id,
          onBlur: (event => {
            this.props.onChange(this.props.id, event.target.value);
            this.setState({
              name: event.target.value
            });
          }).bind(this),
          onChange: (event => {
            this.setState({
              name: event.target.value
            });
          }).bind(this)
        })
      ),
      help_section
    );
  }
};

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  help: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string
};