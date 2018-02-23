class TabControls extends React.Component{
  render() {
    let controls = ([
      <i
        key="tooltip"
        title={"Tooltip"}
        className="tab-edit fa fa-fw fa-exchange tooltip"
        onClick={
          (e)=>{
            let onTop = !(e.pageY > window.innerHeight/2);
            e.target.querySelector('.tooltipmenu').classList.toggle('bottom', !onTop);
            e.target.querySelector('.tooltipmenu').classList.toggle('top', onTop);
            e.target.querySelector('.tooltipmenu').classList.toggle('show');
          }
        }
        onMouseLeave={
          (e)=>{
            e.target.querySelector('.tooltipmenu').classList.toggle('show', false)
          }
        }
        >
          <div className="tooltipmenu">
            <span
              className="row"
              onClick={this.props.onPinChange}>
              <i className="pinned-icon fa fa-fw fa-thumb-tack" />
              {browser.i18n.getMessage(this.props.isPinned ? "unpin_tab" : "pin_tab")}
            </span>
            <span
              className="row"
              onClick={this.props.onOpenTab}>
              <i className="pinned-icon fa fa-fw fa-plus" />
              {browser.i18n.getMessage("open_tab")}
            </span>
          </div>
      </i>,
      <i
        key="close"
        title={browser.i18n.getMessage("close_tab")}
        className="tab-edit fa fa-fw fa-times"
        onClick={this.props.onCloseTab}
      ></i>
    ]);

    return (<span className="tab-controls">
              {controls}
            </span>);
  }
  /*
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
  */
};

TabControls.propTypes = {
  opened: PropTypes.bool.isRequired,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
}
