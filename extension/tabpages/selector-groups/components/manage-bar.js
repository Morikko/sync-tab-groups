class ManageBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement(
      "div",
      { id: "menu" },
      React.createElement(
        "div",
        { className: "title" },
        React.createElement("img", { src: "/share/icons/tabspace-active-64.png", alt: "", height: "32" }),
        React.createElement(
          "span",
          null,
          browser.i18n.getMessage("group_manager")
        )
      ),
      React.createElement(
        "div",
        { className: "right-buttons" },
        React.createElement(RadioButton, {
          labelLeft: browser.i18n.getMessage("group_manager_single_button"),
          iconLeft: "square-o",
          labelRight: browser.i18n.getMessage("group_manager_split_button"),
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