class ManagePanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(GroupList, null),
      React.createElement(GroupList, null)
    );
  }
}