class ManageBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement(
      "div",
      { id: "menu" },
      React.createElement(
        "a",
        { className: "logo" },
        React.createElement(
          "span",
          null,
          React.createElement("img", { src: "/share/icons/tabspace-active-64.png", alt: "", height: "32" })
        )
      ),
      React.createElement(
        "span",
        { className: "title" },
        "Manage Groups"
      ),
      React.createElement(
        "div",
        { className: "right-buttons" },
        React.createElement(RadioButton, {
          labelLeft: "Single",
          iconLeft: "square-o",
          labelRight: "Doubles",
          iconRight: "columns",
          left: this.props.singleMode,
          getActivatedState: this.props.changeColumnDisplay
        })
      )
    );
  }
}

ManageBar.propTypes = {
  singleMode: PropTypes.bool,
  changeColumnDisplay: PropTypes.func
};