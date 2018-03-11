class TextInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      name: nextProps.name,
    })
  }

  render() {
    let help_section = [];
    if (this.props.help !== undefined) {
      help_section = (
        <span className="option-input-text-help">
          {this.props.help}
        </span>);
    }

    return (
      <div className="option-input-text">
        <div style={{
          display: "flex",
          justifyContent: "space-between"
        }}>
          <span
            className="option-input-text-label"
            for={this.props.id}>
              {this.props.label}
          </span>
          <input
            type="text"
            value={this.state.name}
            id={this.props.id}
            onBlur={((event) => {
              this.props.onChange(this.props.id, event.target.value);
              this.setState({
                name: event.target.value
              });
            }).bind(this)}
            onChange={((event) => {
              this.setState({
                name: event.target.value
              });
            }).bind(this)}
          />
        </div>
        {help_section}
      </div>);
  }
};

TextInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  help: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
}
