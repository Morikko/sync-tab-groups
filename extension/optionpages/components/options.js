Options = (() => {
  const OptionsStandalone = React.createClass({
    propTypes: {
      onOptionChange: React.PropTypes.func,
      onBackUpClick: React.PropTypes.func,
      onImportClick: React.PropTypes.func,
      onExportClick: React.PropTypes.func
    },

    render: function () {
      return React.createElement(
        "div",
        null,
        React.createElement(
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
            "label",
            { htmlFor: "show-menu", className: "show-menu" },
            "Show Menu"
          ),
          React.createElement("input", { type: "checkbox", id: "show-menu", role: "button" }),
          React.createElement(
            "nav",
            { className: "tabs" },
            React.createElement(
              "a",
              { className: "tab selected" },
              "Advanced Setup"
            ),
            React.createElement(
              "a",
              { className: "tab" },
              "Shortcuts"
            ),
            React.createElement(
              "a",
              { className: "tab" },
              "Save/Restore"
            ),
            React.createElement(
              "a",
              { className: "tab" },
              "Interface"
            ),
            React.createElement(
              "a",
              { className: "tab" },
              "About"
            ),
            React.createElement(
              "a",
              { className: "tab" },
              "Help"
            )
          )
        ),
        React.createElement(
          "div",
          { id: "panel" },
          React.createElement(OptionsPanel, this.props)
        )
      );
    }
  });
  return ReactRedux.connect(state => {
    return { options: state.get("options") };
  }, ActionCreators)(OptionsStandalone);
})();

