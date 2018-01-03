class OptionsMenu extends React.Component {

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
      React.createElement("input", { type: "checkbox", id: "show-menu", role: "button" }),
      React.createElement(
        "label",
        { htmlFor: "show-menu", className: "show-menu" },
        React.createElement("i", { className: "fa fa-bars" })
      ),
      React.createElement(
        "nav",
        { className: "tabs" },
        this.props.tabs.map(tab => {
          return React.createElement(
            "a",
            {
              key: tab.href,
              href: "#" + tab.href,
              className: "tab " + (tab.href === this.props.selected ? "selected" : "") },
            tab.title
          );
        })
      )
    );
  }
};

OptionsMenu.propTypes = {
  tabs: PropTypes.object,
  selected: PropTypes.string,
  onClick: PropTypes.func
};