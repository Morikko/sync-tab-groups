class TabControls extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      menuPosition: TabControls.POSITION.MIDDLE,
      show: false,
      panel: "main",
      waitFirstMount: false,
      maxHeight: window.innerHeight/2,
    };

    this.closeMenuTimeout = undefined;
  }

  render() {
    let controls = [];

    if ( this.props.controlsEnable ) {
     controls = ([
       <i
         key="tooltip"
         title={browser.i18n.getMessage("tab_show_actions_menu")}
         className="tab-edit fa fa-fw fa-exchange tab-actions"
         onClick={this.handleOpenExtraActions.bind(this)}
         onMouseLeave={this.handleMouseLeaveExtraActions.bind(this)}
         onMouseEnter={this.handleMouseEnterExtraActions.bind(this)}>
         {this.state.waitFirstMount && this.createExtraActionsMenu()}
       </i>,
       <i
         key="close"
         title={browser.i18n.getMessage("close_tab")}
         className="tab-edit fa fa-fw fa-times"
         onClick={this.props.onCloseTab}
       ></i>
     ]);
    }


    return (<span className="tab-controls"
                  onMouseUp={(e)=>e.stopPropagation()}>
              {controls}
            </span>);
  }

  componentDidMount() {
    if ( !this.state.waitFirstMount ) {
      this.differedTimeOut = setTimeout(()=>{
        this.setState({
          waitFirstMount: true,
        });
      }, 500);
    }
  }

  componentWillUnmount() {
    if ( this.differedTimeOut ) {
      clearTimeout(this.differedTimeOut);
    }

    if ( this.closeMenuTimeout ) {
      clearTimeout(this.closeMenuTimeout);
    }
  }

  createExtraActionsMenu() {
    return (
      <div  className={classNames({
        "tab-actions-menu": true,
        "top": this.state.menuPosition === TabControls.POSITION.TOP,
        "bottom": this.state.menuPosition === TabControls.POSITION.BOTTOM,
        "middle": this.state.menuPosition === TabControls.POSITION.MIDDLE,
        "show": this.state.show,
      })}>
        {this.createTabActionsPanel()}
        {this.createMoveTabToGroupPanel()}
      </div>
    );
  }

  createTabActionsPanel() {
    const hiddenRemoveAction = this.props.tab.hidden 
     ? (
      <span
          className="row"
          onClick={((event)=>{
            if (event) {
              event.stopPropagation();
            }
            this.props.onRemoveHiddenTab(this.props.tab.id);
            this.closeExtraActions();
          }).bind(this)}>
          <i className="fa fa-fw fa-eye-slash" />
          {browser.i18n.getMessage("close_hidden_tab")}
      </span>
     )
     : null;
    
    return (
      <div className={classNames({
        "tab-actions-panel": true,
        "hiddenBySearch": this.state.panel !== "main",
      })}>
        <span
          className="row"
          onClick={this.handleSwitchToMoveTabToGroupPanel.bind(this)}>
          <img src="/share/icons/tabspace-active-32.png" />
          {browser.i18n.getMessage("move_tab_group")}
        </span>
        <span
          className="row"
          onClick={((event)=>{
            if (event) {
              event.stopPropagation();
            }
            this.props.onOpenTab();
            this.closeExtraActions();
          }).bind(this)}>
          <i className="fa fa-fw fa-plus" />
          {browser.i18n.getMessage("open_tab")}
        </span>
        <span
          className="row"
          onClick={((event)=>{
            if (event) {
              event.stopPropagation();
            }
            this.props.onPinChange();
            this.closeExtraActions();
          }).bind(this)}>
          <i className="fa fa-fw fa-thumb-tack" />
          {browser.i18n.getMessage(this.props.isPinned ? "unpin_tab" : "pin_tab")}
        </span>
        {hiddenRemoveAction}
      </div>
    )
  }

  createMoveTabToGroupPanel() {
    const sortedIndex = GroupManager.getIndexSortByPosition(this.props.groups);
    const subMenusMoveTab = [];

    for (let i of sortedIndex) {
      const g = this.props.groups[i];
      const prefix = g.windowId !== WINDOW_ID_NONE
        ? "[OPEN] "
        : "";
      subMenusMoveTab.push(
        <span
          key={this.props.tab.id+"-"+g.id}
          disabled={g.id === this.props.group.id}
          className={"?groupId=" + g.id + " row"}
          onClick={((e)=>{
            if (e) {
              e.stopPropagation();
            }
            this.props.handleOnMoveTabMenuClick(e);
            this.closeExtraActions();
          }).bind(this)}>
          {prefix + Utils.getGroupTitle(g)}
        </span>);
    }

    return (
      <div className={classNames({
        "tab-move-to-group-panel": true,
        "hiddenBySearch": this.state.panel !== "move",
      })}
      style={{maxHeight:this.state.maxHeight}}>
        <span
          className="row"
          onClick={this.handleSwitchToTabActionsPanel.bind(this)}>
          <i className="fa fa-fw fa-chevron-left" />
          {"Back"}
        </span>
        <span className="separator"></span>
          {subMenusMoveTab}
        <span className="separator"></span>
        <span
          className="row"
          onClick={((e)=>{
            if (e) {
              e.stopPropagation();
            }
            this.props.handleOnMoveTabNewMenuClick(e);
            this.closeExtraActions();
          }).bind(this)}>
          <i className="fa fa-fw fa-plus" />
          {browser.i18n.getMessage("add_group")}
        </span>
      </div>
    )
  }

  handleSwitchToMoveTabToGroupPanel(event) {
    if (event) {
      event.stopPropagation();
    }

    this.setState({
      panel: "move"
    });
  }

  handleSwitchToTabActionsPanel(event) {
    if (event) {
      event.stopPropagation();
    }

    this.setState({
      panel: "main"
    });
  }

  handleOpenExtraActions(event) {
    if (event) {
      event.stopPropagation();
    }

    let parentGroupList = Utils.getParentElement(event.target, "group-list");

    let pos = Utils.getOffset(event.target, parentGroupList),
      height = parentGroupList.clientHeight;

    let menuPosition = TabControls.POSITION.MIDDLE;

    if ( pos < (height/2 + 34) ) {
      menuPosition = TabControls.POSITION.TOP;
    } else {
      menuPosition = TabControls.POSITION.BOTTOM;
    }

    this.setState({
      menuPosition: menuPosition,
      show: !this.state.show,
      panel: "main",
      maxHeight: height/2,
    })
  }

  handleMouseLeaveExtraActions(event) {
    //return; // For debug
    this.closeMenuTimeout = setTimeout(()=>{
      this.closeExtraActions();
      this.closeMenuTimeout = undefined;
    }, 500);
  }

  handleMouseEnterExtraActions(event) {
    if ( this.closeMenuTimeout ) {
      clearTimeout(this.closeMenuTimeout);
    }
  }

  closeExtraActions() {
    this.setState({
      show: false,
      panel: "main",
    });
  }
};

TabControls.propTypes = {
  opened: PropTypes.bool.isRequired,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
}

TabControls.POSITION = Object.freeze({
  TOP: Symbol("TOP"),
  MIDDLE: Symbol("Middle"),
  BOTTOM: Symbol("BOTTOM"),
})
