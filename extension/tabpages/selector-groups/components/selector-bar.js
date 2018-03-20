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
        { className: "bar-buttons" },
        React.createElement(OptionButton, {
          title: "Selection" /*browser.i18n.getMessage("options_behaviors_help_title_invisible")*/,
          onClick: this.clickOnInvisible,
          highlight: true
        }),
        React.createElement(OptionButton, {
          title: "Type",
          onClick: this.clickOnInvisible,
          highlight: false,
          disabled: true
        }),
        React.createElement(OptionButton, {
          title: "Go",
          onClick: this.clickOnInvisible,
          highlight: false,
          disabled: true
        })
      )
    );
  }
}

ManageBar.propTypes = {
  singleMode: PropTypes.bool,
  changeColumnDisplay: PropTypes.func
};