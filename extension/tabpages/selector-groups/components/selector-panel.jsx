class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchfilter: '',
      forceExpand: false,
      forceReduce: false,
    };
    this.update = this.update.bind(this);
    this.handleSelectNone = this.handleSelectNone.bind(this);
    this.handleSelectAll = this.handleSelectAll.bind(this);
    this.handleForceExpand = this.handleForceExpand.bind(this);
    this.handleForceReduce = this.handleForceReduce.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  update() {
    this.forceUpdate();
  }

  componentDidMount() {
    window.addEventListener("resize", this.update);

    /*
    Navigation.setTarget(document.querySelector('.left-list'));
    if ( this.props.options.shortcuts.navigation ) {
      document.body.addEventListener("keydown", generalNavigationListener);
    }
    */
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.update);

    /*
    if ( this.props.options.shortcuts.navigation ) {
      document.body.removeEventListener("keydown", generalNavigationListener);
    }
    */
  }

  componentDidUpdate() {
    if ( this.state.forceExpand ) {
      this.setState({
        forceExpand: false
      });
    }
    if ( this.state.forceReduce ) {
      this.setState({
        forceReduce: false
      });
    }
  }


  render() {
    let width = window.innerWidth - 28;

    return (
      <ul id="manage-panel">
        <li className="group-lists">
          <div className="group-action">
            <i
              className="app-pref fa fa-fw fa-check-square-o select-all"
              title={browser.i18n.getMessage("selector_select_all")}
              onClick={this.handleSelectAll}
            />
            <i
              className="app-pref fa fa-fw fa-square-o select-none"
              title={browser.i18n.getMessage("selector_select_none")}
              onClick={this.handleSelectNone}
            />
            {
              <SearchBar
                onSearchChange={this.onSearchChange}
                hotkeysEnable={false/*this.props.options.shortcuts.navigation*/}/>
            }
            <i
              className="app-pref fa fa-fw fa-angle-double-down expand-action expand-groups"
              title={browser.i18n.getMessage("expand_all_groups")}
              onClick={this.handleForceExpand}
            />
            <i
              className="app-pref fa fa-fw fa-angle-double-up expand-action reduce-groups"
              title={browser.i18n.getMessage("reduce_all_groups")}
              onClick={this.handleForceReduce}
            />
          </div>
          <GroupList
            /*** Functions ***/
            onGroupClick= {this.props.changeGroupSelectionFilter}
            onTabClick= {this.props.changeTabSelectionFilter}

            onMoveTabToNewGroup= {this.props.onGroupAddDrop}
            onGroupCloseClick= {this.props.onGroupCloseClick}
            onGroupRemoveClick= {this.props.onGroupRemoveClick}
            onGroupTitleChange= {this.props.onGroupTitleChange}
            onOpenInNewWindowClick= {this.props.onOpenInNewWindowClick}
            onCloseTab= {this.props.onCloseTab}
            onOpenTab= {this.props.onOpenTab}
            onGroupDrop= {this.props.onGroupDrop}
            onGroupChangePosition= {this.props.onGroupChangePosition}
            onChangePinState= {this.props.onChangePinState}
            onChangeExpand= {this.props.onChangeExpand}
            /*** Data ***/
            groups= {this.props.groups}
            selectionFilter={this.props.selectionFilter}
            /*** Options ***/
            id="manage-left"
            searchfilter= {this.state.searchfilter}
            allowClickSwitch={false}
            stateless={true}
            width={width}
            hotkeysEnable={false}
            showTabsNumber= {false}
            groupDraggable= {false}
            draggable={false}
            hoverStyle={false}
            controlsEnable={false}
            /*** actions ***/
            forceExpand={this.state.forceExpand}
            forceReduce={this.state.forceReduce}
          />
        </li>
      </ul>
    );
  }

  onSearchChange(searchValue) {
    let stateToUpdate = {
      searchfilter: searchValue,
    };
    if ( this.state.searchfilter.length && !searchValue.length) {
      stateToUpdate.forceReduce = true;
    }
    this.setState(stateToUpdate);
  }

  handleForceExpand(event) {
    event.stopPropagation();
    this.setState({
      forceExpand: true,
    });
  }

  handleForceReduce(event) {
    event.stopPropagation();
    this.setState({
      forceReduce: true,
    });
  }

  handleSelectAll(event) {
    event.stopPropagation();
    this.props.selectAllInSelectionFilter();
  }
  handleSelectNone(event) {
    event.stopPropagation();
    this.props.selectNoneInSelectionFilter();
  }
}
