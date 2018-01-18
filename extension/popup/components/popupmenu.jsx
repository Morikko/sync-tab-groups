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
            onSearchChange={this.onSearchChange.bind(this)} />
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
      <ul className={menuClasses}>
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
              options= {this.props.options}
              currentWindowId= {this.props.currentWindowId}
              delayedTasks= {this.props.delayedTasks}
              /*** Options ***/
              id="popup"
              searchfilter= {this.state.searchfilter}
              allowClickSwitch={true}
              stateless={false}
              width={width}
              /*** actions ***/
              forceExpand={false}
              forceReduce={false}
            />
          <li>
            <GroupAddButton
                onClick= {this.props.onGroupAddClick}
                onDrop= {this.props.onGroupAddDrop}
                currentlySearching= {this.state.searchfilter.length > 0}
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
    /* TODO: window not focus by default
    var body = document.querySelector('body');

    // Give the document focus
    window.focus();

    // Remove focus from any focused element
    if (document.activeElement) {
        document.activeElement.blur();
    }

    document.querySelector('#search-input').focus();

    body.onkeydown = function(e) {
      if (!e.metaKey) {
        e.preventDefault();
      }

      console.log("Key from body");

      // Add new group
      if (e.keyCode === 45) { // Insert
        document.querySelector('.addButton').click();
      }
      // From Tab: Up tab Or group if first
      // From Group: Up Group Or last tab
      if (e.keyCode === 38) { // Up
        document.querySelector('.addButton');
      }
      // From Tab: Down tab Or next group if last
      // From Group: Down Group or first tab
      if (e.keyCode === 40) { // Down
        document.querySelector('body');
      }
      // Only up group
      if (e.keyCode === 33) { // Page up
        document.querySelector('body');
      }

      // Only down group
      if (e.keyCode === 33) { // Page down
        document.querySelector('body');
      }

      // Go first group
      if (e.keyCode === 36) { // Home (First)
        document.querySelector('body');
      }

      // Go last group
      if (e.keyCode === 35) { // End
        document.querySelector('body');
      }

      // Focus the search bar
      if ( e.ctrlKey && e.keyCode === 70 ) { // Ctrl + F
        document.querySelector('#search-input').focus();
      }

    };
    */
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
      groups: state.get("tabgroups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options")
    };
  }, ActionCreators)(PopupMenuStandAlone)})();
