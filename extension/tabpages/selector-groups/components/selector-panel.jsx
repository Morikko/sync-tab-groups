class Panel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftsearchfilter: '',
      leftForceExpand: false,
      leftForceReduce: false,
    };
    this.update = this.update.bind(this);
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
    if ( this.state.leftForceExpand ) {
      this.setState({
        leftForceExpand: false
      });
    }
    if ( this.state.leftForceReduce ) {
      this.setState({
        leftForceReduce: false
      });
    }
  }


  render() {
    let width = this.props.singleMode ? window.innerWidth - 28 : window.innerWidth / 2 - 28;

    return (
      <ul id="manage-panel">
        <li className="group-lists">
          <div className={classNames({
            "left-list": true,
          "half": !this.props.singleMode,})}>
            <div className="group-action left">
              <i
                className="app-pref fa fa-fw fa-angle-double-down expand-groups"
                title={browser.i18n.getMessage("expand_all_groups")}
                onClick={this.handleLeftForceExpand.bind(this)}
              />
              <i
                className="app-pref fa fa-fw fa-angle-double-up reduce-groups"
                title={browser.i18n.getMessage("reduce_all_groups")}
                onClick={this.handleLeftForceReduce.bind(this)}
              />
              {
                <SearchBar
                  onSearchChange={this.onSearchLeftChange.bind(this)}
                  hotkeysEnable={false/*this.props.options.shortcuts.navigation*/}/>
              }
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
              searchfilter= {this.state.leftsearchfilter}
              allowClickSwitch={false}
              stateless={true}
              width={width}
              hotkeysEnable={false/*this.props.options.shortcuts.navigation*/}
              showTabsNumber= {false}
              groupDraggable= {false}
              draggable={false}
              hoverStyle={false}
              controlsEnable={false}
              /*** actions ***/
              forceExpand={this.state.leftForceExpand}
              forceReduce={this.state.leftForceReduce}
            />
          </div>
        </li>
      </ul>
    );
  }

  onSearchLeftChange(searchValue) {
    let stateToUpdate = {
      leftsearchfilter: searchValue,
    };
    if ( this.state.leftsearchfilter.length && !searchValue.length) {
      stateToUpdate.leftForceReduce = true;
    }
    this.setState(stateToUpdate);
  }

  handleLeftForceExpand(event) {
    event.stopPropagation();
    this.setState({
      leftForceExpand: true,
    });
  }

  handleLeftForceReduce(event) {
    event.stopPropagation();
    this.setState({
      leftForceReduce: true,
    });
  }
}
