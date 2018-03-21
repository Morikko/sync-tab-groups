/*
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/

class PopupMenuStandAlone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      maximized: this.props.options.popup.maximized,
      searchfilter: '',
    };

    this.onClickMaximize = this.onClickMaximize.bind(this);
    this.handleAllChangeExpand = this.handleAllChangeExpand.bind(this);
  }

  // When a component got new props, use this to update
  componentWillReceiveProps(nextProps) {
    if(nextProps.options.popup.maximized !== this.state.maximized ) {
      this.setState({
        maximized: nextProps.options.popup.maximized,
      });
    }
  }

  render() {
    let isWindowSync = false, isIncognito = false;

    let searchbar = [];
    if (this.props.options.popup.showSearchBar) {
      searchbar = (
        <SearchBar
            onSearchChange={this.onSearchChange.bind(this)}
            hotkeysEnable={this.props.options.shortcuts.navigation}/>
      );
    }

    for (let i = 0; i < this.props.groups.length; i++) {
      if (this.props.groups[i].windowId === this.props.currentWindowId) {
        isWindowSync = true;
        isIncognito = this.props.groups[i].incognito;
      }
    }

    let menuClasses = classNames({
      "menu-maximized": this.state.maximized,
      "menu-minimized": !this.state.maximized,
    });

    let width = this.state.maximized?800:450;
    return (
      <ul
        id="popup-menu"
        className={menuClasses}>
        <li>
          {searchbar}
        </li>
        <GroupList
          /*** Functions ***/
          onMoveTabToNewGroup= {this.props.onGroupAddDrop}
          onGroupCloseClick= {this.props.onGroupCloseClick}
          onGroupRemoveClick= {this.props.onGroupRemoveClick}
          onGroupTitleChange= {this.props.onGroupTitleChange}
          onTabClick= {this.props.onTabClick}
          onOpenInNewWindowClick= {this.props.onOpenInNewWindowClick}
          onCloseTab= {this.props.onCloseTab}
          onOpenTab= {this.props.onOpenTab}
          onGroupClick= {this.props.onGroupClick}
          onGroupDrop= {this.props.onGroupDrop}
          onGroupChangePosition= {this.props.onGroupChangePosition}
          onChangePinState= {this.props.onChangePinState}
          onChangeExpand= {this.props.onChangeExpand}
          /*** Data ***/
          groups= {this.props.groups}
          currentWindowId= {this.props.currentWindowId}
          delayedTasks= {this.props.delayedTasks}
          /*** Options ***/
          id="popup"
          searchfilter= {this.state.searchfilter}
          allowClickSwitch={true}
          hotkeysEnable={this.props.options.shortcuts.navigation}
          stateless={false}
          width={width}
          showTabsNumber= {this.props.options.popup.showTabsNumber}
          groupDraggable= {this.props.options.groups.sortingType === OptionManager.SORT_CUSTOM}
          draggable={true}
          hoverStyle={true}
          controlsEnable={true}
          /*** actions ***/
          forceExpand={false}
          forceReduce={false}
            />
          <li>
            <GroupAddButton
                onClick= {this.props.onGroupAddClick}
                onDrop= {this.props.onGroupAddDrop}
                currentlySearching= {this.state.searchfilter.length > 0}
                hotkeysEnable={this.props.options.shortcuts.navigation}
            />
          </li>
          <MainBar
            onChangeWindowSync= {this.props.onChangeWindowSync}
            onClickPref= {this.props.onClickPref}
            isSync= {isWindowSync}
            isIncognito={isIncognito}
            currentWindowId= {this.props.currentWindowId}
            maximized= {this.state.maximized}
            onClickMaximize= {this.onClickMaximize}
            handleAllChangeExpand= {this.handleAllChangeExpand}
          />
        </ul>
    );
  }

  handleAllChangeExpand(value) {
    let groupIds = [];
    this.props.groups.map((group) => {
      groupIds.push(group.id);
    });

    this.props.onChangeExpand(groupIds, value);
  }

  // Change window size
  onClickMaximize() {
    this.props.onOptionChange("popup-maximized", !this.state.maximized);
    this.setState({
      maximized: !this.state.maximized,
    });
  }

  onSearchChange(searchValue) {
    this.setState({
      searchfilter: searchValue,
    });
  }

  componentDidMount() {
    //document.querySelector('#search-input').focus();

    Navigation.setTarget(document.getElementById("popup-menu"));

    if ( this.props.options.shortcuts.navigation ) {
      document.body.addEventListener("keydown", generalNavigationListener);
      document.body.addEventListener("keydown", popupSpecialNavigationListener);
    }
  }

  componentWillUnmount() {
    if ( this.props.options.shortcuts.navigation ) {
      document.body.removeEventListener("keydown", generalNavigationListener);
      document.body.removeEventListener("keydown", popupSpecialNavigationListener);
    }
  }

};

PopupMenuStandAlone.propTypes = {
  onGroupAddClick: PropTypes.func,
  onGroupAddDrop: PropTypes.func,
  onGroupClick: PropTypes.func,
  onGroupDrop: PropTypes.func,
  onGroupCloseClick: PropTypes.func,
  onGroupRemoveClick: PropTypes.func,
  onGroupTitleChange: PropTypes.func,
  onTabClick: PropTypes.func,
  onOpenInNewWindowClick: PropTypes.func,
  onChangeWindowSync: PropTypes.func,
  onClickPref: PropTypes.func,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
  onOptionChange: PropTypes.func,
  onGroupChangePosition: PropTypes.func,
  onChangePinState: PropTypes.func,
  onChangeExpand: PropTypes.func,
};

const PopupMenu = (() =>{
  return ReactRedux.connect((state) => {
    return {
      groups: state.get("groups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options")
    };
  }, ActionCreators)(PopupMenuStandAlone)})();
