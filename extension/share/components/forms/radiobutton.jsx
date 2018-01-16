class RadioButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasIconLeft: props.iconLeft !== undefined && props.iconLeft.length > 0,
      hasIconRight: props.iconRight !== undefined && props.iconRight.length > 0,
    }
    this.onRightClick = this.onRightClick.bind(this);
    this.onLeftClick = this.onLeftClick.bind(this);
  }

  render() {
    return (
      <div className="radio-button">
        <span className={"left "+(this.props.left?"highlight":"")}
          onClick={this.onLeftClick}>
          <span>{this.props.labelLeft}</span>
          {this.state.hasIconLeft && <i className={"fa fa-fw fa-" + this.props.iconLeft}></i>}
        </span>
        <span className={"right "+(!this.props.left?"highlight":"")}
          onClick={this.onRightClick}>
          {this.state.hasIconRight && <i className={"fa fa-fw fa-" + this.props.iconRight}></i>}
          <span>{this.props.labelRight}</span>
        </span>
      </div>
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
  getActivatedState: PropTypes.func,
}
