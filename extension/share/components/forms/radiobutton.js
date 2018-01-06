class RadioButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasIconLeft: props.iconLeft !== undefined && props.iconLeft.length > 0,
      hasIconRight: props.iconRight !== undefined && props.iconRight.length > 0
    };
    this.onRightClick = this.onRightClick.bind(this);
    this.onLeftClick = this.onLeftClick.bind(this);
  }

  render() {
    return React.createElement(
      "div",
      { className: "radio-button" },
      React.createElement(
        "span",
        { className: "left " + (this.props.left ? "highlight" : ""),
          onClick: this.onLeftClick },
        this.props.labelLeft,
        this.state.hasIconLeft && React.createElement("i", { className: "fa fa-fw fa-" + this.props.iconLeft })
      ),
      React.createElement(
        "span",
        { className: "right " + (!this.props.left ? "highlight" : ""),
          onClick: this.onRightClick },
        this.state.hasIconRight && React.createElement("i", { className: "fa fa-fw fa-" + this.props.iconRight }),
        this.props.labelRight
      )
    );
  }

  onRightClick(event) {
    event.stopPropagation();
    this.props.getActivatedState(false);
  }

  onLeftClick(event) {
    event.stopPropagation();
    this.props.getActivatedState(true);
  }
}

RadioButton.propTypes = {
  labelLeft: PropTypes.string,
  iconLeft: PropTypes.string,
  labelRight: PropTypes.string,
  iconRight: PropTypes.string,
  left: PropTypes.bool, // State:: Left: true; Right: false
  getActivatedState: PropTypes.func
};