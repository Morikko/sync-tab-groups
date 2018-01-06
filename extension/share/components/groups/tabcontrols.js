class TabControls extends React.Component {
  render() {
    let controls = React.createElement("i", {
      title: browser.i18n.getMessage("close_tab"),
      className: "tab-edit fa fa-fw fa-times",
      onClick: this.props.onCloseTab
    });

    return React.createElement(
      "span",
      { className: "tab-controls" },
      controls
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
};

TabControls.propTypes = {
  opened: PropTypes.bool.isRequired,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func
};