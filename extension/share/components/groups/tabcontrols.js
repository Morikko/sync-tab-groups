class TabControls extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      top: false,
      show: false,
      panel: "main",
      waitFirstMount: false
    };
  }

  render() {
    let controls = [React.createElement(
      "i",
      {
        key: "tooltip",
        title: browser.i18n.getMessage("tab_show_actions_menu"),
        className: "tab-edit fa fa-fw fa-exchange tab-actions",
        onClick: this.handleOpenExtraActions.bind(this),
        onMouseLeave: this.handleMouseLeaveExtraActions.bind(this) },
      this.state.waitFirstMount && this.createExtraActionsMenu()
    ), React.createElement("i", {
      key: "close",
      title: browser.i18n.getMessage("close_tab"),
      className: "tab-edit fa fa-fw fa-times",
      onClick: this.props.onCloseTab
    })];

    return React.createElement(
      "span",
      { className: "tab-controls" },
      controls
    );
  }

  componentDidMount() {
    if (!this.state.waitFirstMount) {
      this.differedTimeOut = setTimeout((() => {
        this.setState({
          waitFirstMount: true
        });
      }).bind(this), 500);
    }
  }

  componentWillUnmount() {
    if (this.differedTimeOut) {
      clearTimeout(this.differedTimeOut);
    }
  }

  createExtraActionsMenu() {
    return React.createElement(
      "div",
      { className: classNames({
          "tab-actions-menu": true,
          "top": this.state.top,
          "bottom": !this.state.top,
          "show": this.state.show
        }) },
      this.createTabActionsPanel(),
      this.createMoveTabToGroupPanel()
    );
  }

  createTabActionsPanel() {
    return React.createElement(
      "div",
      { className: classNames({
          "tab-actions-panel": true,
          "hiddenBySearch": this.state.panel !== "main"
        }) },
      React.createElement(
        "span",
        {
          className: "row",
          onClick: this.handleSwitchToMoveTabToGroupPanel.bind(this) },
        React.createElement("img", { src: "/share/icons/tabspace-active-32.png" }),
        browser.i18n.getMessage("move_tab_group")
      ),
      React.createElement(
        "span",
        {
          className: "row",
          onClick: (() => {
            this.props.onOpenTab();
            this.closeExtraActions();
          }).bind(this) },
        React.createElement("i", { className: "fa fa-fw fa-plus" }),
        browser.i18n.getMessage("open_tab")
      ),
      React.createElement(
        "span",
        {
          className: "row",
          onClick: (() => {
            this.props.onPinChange();
            this.closeExtraActions();
          }).bind(this) },
        React.createElement("i", { className: "fa fa-fw fa-thumb-tack" }),
        browser.i18n.getMessage(this.props.isPinned ? "unpin_tab" : "pin_tab")
      )
    );
  }

  createMoveTabToGroupPanel() {
    let sortedIndex = GroupManager.getIndexSortByPosition(this.props.groups);
    let subMenusMoveTab = [];

    for (let i of sortedIndex) {
      let g = this.props.groups[i];
      subMenusMoveTab.push(React.createElement(
        "span",
        {
          key: this.props.tab.id + "-" + g.id,
          disabled: g.id === this.props.group.id,
          className: "?groupId=" + g.id + " row",
          onClick: (e => {
            this.props.handleOnMoveTabMenuClick(e);
            this.closeExtraActions();
          }).bind(this) },
        Utils.getGroupTitle(g)
      ));
    }

    return React.createElement(
      "div",
      { className: classNames({
          "tab-move-to-group-panel": true,
          "hiddenBySearch": this.state.panel !== "move"
        }),
        style: { maxHeight: window.innerHeight / 2 } },
      React.createElement(
        "span",
        {
          className: "row",
          onClick: this.handleSwitchToTabActionsPanel.bind(this) },
        React.createElement("i", { className: "fa fa-fw fa-chevron-left" }),
        "Back"
      ),
      React.createElement("span", { className: "separator" }),
      subMenusMoveTab,
      React.createElement("span", { className: "separator" }),
      React.createElement(
        "span",
        {
          className: "row",
          onClick: (e => {
            this.props.handleOnMoveTabNewMenuClick(e);
            this.closeExtraActions();
          }).bind(this) },
        React.createElement("i", { className: "fa fa-fw fa-plus" }),
        browser.i18n.getMessage("add_group")
      )
    );
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

    let onTop = !(event.pageY > window.innerHeight / 2);
    this.setState({
      top: onTop,
      show: !this.state.show,
      panel: "main"
    });
  }

  handleMouseLeaveExtraActions(event) {
    //return; // For debug
    this.closeExtraActions();
  }

  closeExtraActions() {
    this.setState({
      show: false,
      panel: "main"
    });
  }
};

TabControls.propTypes = {
  opened: PropTypes.bool.isRequired,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func
};