class OptionButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <button
      type="button"
      disabled={this.props.disabled}
      className={classNames({
        "option-button": true,
        "highlight":  this.props.highlight,
        "dangerous":  this.props.dangerous,
      })}
      onClick={this.handleClick}>
        <span>{this.props.title}</span>
      </button>);
  }

  handleClick(event) {
    event.stopPropagation();
    this.props.onClick();
  }
};

OptionButton.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
  id: PropTypes.string,
};
