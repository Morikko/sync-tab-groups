class ManagePanelStandAlone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maximized: this.props.options.popup.maximized,
      leftsearchfilter: '',
      rightsearchfilter: '',
      leftForceExpand: false,
      leftForceReduce: false,
      rightForceExpand: false,
      rightForceReduce: false
    };
    this.update = this.update.bind(this);
  }

  update() {
    this.forceUpdate();
  }

  componentDidMount() {
    window.addEventListener("resize", this.update);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.update);
  }

  componentDidUpdate() {
    if (this.state.leftForceExpand) {
      this.setState({
        leftForceExpand: false
      });
    }
    if (this.state.leftForceReduce) {
      this.setState({
        leftForceReduce: false
      });
    }
    if (this.state.rightForceExpand) {
      this.setState({
        rightForceExpand: false
      });
    }
    if (this.state.rightForceReduce) {
      this.setState({
        rightForceReduce: false
      });
    }
  }

  render() {
    let width = this.props.singleMode ? window.innerWidth - 28 : window.innerWidth / 2 - 28;

    return React.createElement(
      'ul',
      { id: 'manage-panel' },
      React.createElement(
        'li',
        { className: 'group-lists' },
        React.createElement(
          'div',
          { className: classNames({
              "left-list": true,
              "half": !this.props.singleMode }) },
          React.createElement(
            'div',
            { className: 'group-action left' },
            React.createElement('i', {
              className: 'app-pref fa fa-fw fa-angle-double-down',
              title: browser.i18n.getMessage("expand_all_groups"),
              onClick: this.handleLeftForceExpand.bind(this)
            }),
            React.createElement('i', {
              className: 'app-pref fa fa-fw fa-angle-double-up',
              title: browser.i18n.getMessage("reduce_all_groups"),
              onClick: this.handleLeftForceReduce.bind(this)
            }),
            React.createElement(SearchBar, {
              onSearchChange: this.onSearchLeftChange.bind(this) })
          ),
          React.createElement(GroupList
          /*** Functions ***/
          , { onMoveTabToNewGroup: this.props.onGroupAddDrop,
            onGroupCloseClick: this.props.onGroupCloseClick,
            onGroupRemoveClick: this.props.onGroupRemoveClick,
            onGroupTitleChange: this.props.onGroupTitleChange,
            onTabClick: this.props.onTabClick,
            onOpenInNewWindowClick: this.props.onOpenInNewWindowClick,
            onCloseTab: this.props.onCloseTab,
            onOpenTab: this.props.onOpenTab,
            onGroupClick: this.props.onGroupClick,
            onGroupDrop: this.props.onGroupDrop,
            onGroupChangePosition: this.props.onGroupChangePosition,
            onChangePinState: this.props.onChangePinState,
            onChangeExpand: this.props.onChangeExpand
            /*** Data ***/
            , groups: this.props.groups,
            options: this.props.options,
            currentWindowId: this.props.currentWindowId,
            delayedTasks: this.props.delayedTasks
            /*** Options ***/
            , id: 'manage-left',
            searchfilter: this.state.leftsearchfilter,
            allowClickSwitch: false,
            stateless: true,
            width: width
            /*** actions ***/
            , forceExpand: this.state.leftForceExpand,
            forceReduce: this.state.leftForceReduce
          })
        ),
        React.createElement(
          'div',
          { className: classNames({
              "right-list": true,
              "half": true,
              "invisible": this.props.singleMode }) },
          React.createElement(
            'div',
            { className: 'group-action right' },
            React.createElement(SearchBar, {
              onSearchChange: this.onSearchRightChange.bind(this) }),
            React.createElement('i', {
              className: 'app-pref fa fa-fw fa-angle-double-down',
              title: browser.i18n.getMessage("expand_all_groups"),
              onClick: this.handleRightForceExpand.bind(this)
            }),
            React.createElement('i', {
              className: 'app-pref fa fa-fw fa-angle-double-up',
              title: browser.i18n.getMessage("reduce_all_groups"),
              onClick: this.handleRightForceReduce.bind(this)
            })
          ),
          React.createElement(GroupList
          /*** Functions ***/
          , { onMoveTabToNewGroup: this.props.onGroupAddDrop,
            onGroupCloseClick: this.props.onGroupCloseClick,
            onGroupRemoveClick: this.props.onGroupRemoveClick,
            onGroupTitleChange: this.props.onGroupTitleChange,
            onTabClick: this.props.onTabClick,
            onOpenInNewWindowClick: this.props.onOpenInNewWindowClick,
            onCloseTab: this.props.onCloseTab,
            onOpenTab: this.props.onOpenTab,
            onGroupClick: this.props.onGroupClick,
            onGroupDrop: this.props.onGroupDrop,
            onGroupChangePosition: this.props.onGroupChangePosition,
            onChangePinState: this.props.onChangePinState,
            onChangeExpand: this.props.onChangeExpand
            /*** Data ***/
            , groups: this.props.groups,
            options: this.props.options,
            currentWindowId: this.props.currentWindowId,
            delayedTasks: this.props.delayedTasks
            /*** Options ***/
            , id: 'manage-right',
            searchfilter: this.state.rightsearchfilter,
            allowClickSwitch: false,
            stateless: true,
            width: width
            /*** actions ***/
            , forceExpand: this.state.rightForceExpand,
            forceReduce: this.state.rightForceReduce
          })
        )
      ),
      React.createElement(
        'li',
        null,
        React.createElement(
          'div',
          { className: 'belowActions' },
          React.createElement(GroupAddButton, {
            onClick: this.props.onGroupAddClick,
            onDrop: this.props.onGroupAddDrop,
            currentlySearching: false
          })
        )
      )
    );
  }

  onSearchLeftChange(searchValue) {
    this.setState({
      leftsearchfilter: searchValue
    });
  }

  onSearchRightChange(searchValue) {
    this.setState({
      rightsearchfilter: searchValue
    });
  }

  handleLeftForceExpand(event) {
    event.stopPropagation();
    this.setState({
      leftForceExpand: true
    });
  }

  handleLeftForceReduce(event) {
    event.stopPropagation();
    this.setState({
      leftForceReduce: true
    });
  }

  handleRightForceExpand(event) {
    event.stopPropagation();
    this.setState({
      rightForceExpand: true
    });
  }

  handleRightForceReduce(event) {
    event.stopPropagation();
    this.setState({
      rightForceReduce: true
    });
  }
}

const ManagePanel = (() => {
  return ReactRedux.connect(state => {
    return {
      groups: state.get("tabgroups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options")
    };
  }, ActionCreators)(ManagePanelStandAlone);
})();