class NiceCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.checked,
      disabled: this.props.disabled || false,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      checked: nextProps.checked,
      disabled: nextProps.disabled || false,
    })
  }

  render() {
    return (
      <label
      className={classNames({
        "control": true,
        "control--checkbox": true,
        "disabled": this.state.disabled,
      })}
      htmlFor={this.props.id}>
        <span>{this.props.label}</span>
        <input
          type="checkbox"
          disabled={this.state.disabled}
          checked={this.state.checked}
          id={this.props.id}
          onClick={this.handleClick}
          onChange={(e)=>e.stopPropagation()}
        />
        <div className="control__indicator"></div>
      </label>);
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
  disabled: PropTypes.bool,
};
