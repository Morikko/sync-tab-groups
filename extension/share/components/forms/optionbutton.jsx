class OptionButton extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (
      <button
      type="button"
      className={classNames({
        "option-button": true,
        "disabled": !this.props.enabled,
      })}
      onClick={this.handleClick}>
        {this.props.title}
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
