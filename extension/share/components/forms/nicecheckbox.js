class NiceCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
      disabled: this.props.disabled || false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.checked,
      disabled: nextProps.disabled || false
    });
  }

  render() {

    let indeterminate = this.props.indeterminate !== undefined ? this.props.indeterminate.toString() : "false";

    return React.createElement(
      "label",
      {
        onMouseUp: e => e.stopPropagation(),
        className: classNames({
          "control": true,
          "control--checkbox": true,
          "disabled": this.state.disabled
        }),
        htmlFor: this.props.id },
      React.createElement("input", {
        type: "checkbox",
        disabled: this.state.disabled,
        checked: this.state.checked,
        id: this.props.id,
        onClick: this.handleClick,
        onMouseUp: e => e.stopPropagation(),
        onChange: e => e.stopPropagation(),
        indeterminate: indeterminate
      }),
      React.createElement("div", { className: "control__indicator" }),
      React.createElement(
        "span",
        null,
        this.props.label
      )
    );
  }

  handleClick(event) {
    event.stopPropagation();
    this.props.onCheckChange(this.props.id, !this.state.checked);

    this.setState({
      checked: !this.state.checked
    });
  }
};

NiceCheckbox.propTypes = {
  onCheckChange: PropTypes.func,
  checked: PropTypes.bool,
  id: PropTypes.string,
  label: PropTypes.string,
  disabled: PropTypes.bool
};