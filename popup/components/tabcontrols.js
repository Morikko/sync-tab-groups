const TabControls = React.createClass({
  propTypes: {
    opened: React.PropTypes.bool.isRequired,
    onCloseTab: React.PropTypes.func,
    onOpenTab: React.PropTypes.func,
    onCloseTab: React.PropTypes.func,
    onOpenTab: React.PropTypes.func,
  },

  render: function() {
    let controls = [];

    if (!this.props.opened) {
      controls.push(
        React.DOM.i({
          className: "tab-edit fa fa-fw fa-plus",
          title: browser.i18n.getMessage("open_tab"),
          onClick: this.props.onOpenTab
        })
      );
    }

    controls.push(
      React.DOM.i({
        title: browser.i18n.getMessage("close_tab"),
        className: "tab-edit fa fa-fw fa-times",
        onClick: this.props.onCloseTab
      })
    );

    return React.DOM.span({
        className: "tab-controls"
      },
      controls,
    );
  }
});
