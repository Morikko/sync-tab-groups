class ManageWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      single: true
    };
    this.onColumnChange = this.onColumnChange.bind(this);
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(ManageBar, {
        singleMode: this.state.single,
        changeColumnDisplay: this.onColumnChange })
    );
  }

  onColumnChange(value) {
    this.setState({
      single: value
    });
  }
}