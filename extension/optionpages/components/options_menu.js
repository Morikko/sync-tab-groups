OptionsMenu = React.createClass({
  propTypes: {
    tabs: React.PropTypes.object,
    selected: React.PropTypes.string,
    onClick: React.PropTypes.func
  },

  render: function () {
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
            { href: "#" + tab.href,
              className: "tab " + (tab.href === this.props.selected ? "selected" : "") },
            tab.title
          );
        })
      )
    );
  }
});