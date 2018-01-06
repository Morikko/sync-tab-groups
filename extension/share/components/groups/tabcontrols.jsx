class TabControls extends React.Component{
  render() {
    let controls = (
      <i
        title={browser.i18n.getMessage("close_tab")}
        className="tab-edit fa fa-fw fa-times"
        onClick={this.props.onCloseTab}
      ></i>
    );

    return (<span className="tab-controls">
              {controls}
            </span>);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
};

TabControls.propTypes = {
  opened: PropTypes.bool.isRequired,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
}
