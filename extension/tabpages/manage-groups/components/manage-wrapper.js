var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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
        changeColumnDisplay: this.onColumnChange }),
      React.createElement(ManagePanel, _extends({}, this.props, {
        singleMode: this.state.single
      }))
    );
  }

  onColumnChange(value) {
    this.setState({
      single: value
    });
  }
}