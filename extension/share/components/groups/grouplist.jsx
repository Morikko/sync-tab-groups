class GroupList extends React.Component {
    constructor(props) {
      super(props);
      let searchResults;
      if (this.props.searchfilter && this.props.searchfilter.length) {
        searchResults = this.applySearch(this.props.searchfilter);
      } else {
        searchResults = {
          searchGroupsResults: undefined,
          atLeastOneResult: true,
        }
      }
      this.state = {
        searchGroupsResults: searchResults.searchGroupsResults,
        atLeastOneResult: searchResults.atLeastOneResult,
      };
    }

    componentWillReceiveProps(nextProps) {

      // Update Search
      if ( this.props.searchfilter !== nextProps.searchfilter // Change search
      || // Currently Searching, Update: In case of change in groups
        (nextProps.searchfilter && nextProps.searchfilter.length)) {
        let searchResults;
        if (nextProps.searchfilter && nextProps.searchfilter.length) { // Search In progress
          searchResults = this.applySearch(nextProps.searchfilter);
        } else { // End Of Search
          this.unMarkSearch();
          searchResults = {
            searchGroupsResults: undefined,
            atLeastOneResult: true,
          }
        }
        this.setState({
          searchGroupsResults: searchResults.searchGroupsResults,
          atLeastOneResult: searchResults.atLeastOneResult,
        });
      }
    }

    componentDidUpdate() {
      // Mark Search
      if ( // Currently Searching, Update: In case of change in groups
        (this.props.searchfilter && this.props.searchfilter.length)) {
          let [groupSearchValue, tabSearchValue] = Utils.extractSearchValue(this.props.searchfilter);
          this.markSearch(groupSearchValue, tabSearchValue);
      }
    }

    // Return true if an action (close/remove) is pending on groupId
    isCurrently(action, groupId) {
      if ( !this.props.delayedTasks ) {
        return false;
      }

      if (this.props.delayedTasks[action] !== undefined) {
        return this.props.delayedTasks[action].delayedTasks[groupId] !== undefined;
      } else {
        return false;
      }
    }

    render() {
      let groupListClasses = classNames({
        "group-list": true,
      });

      let groups;
      if ( this.props.groups.length > 0 ) {
        groups = [];
        if (!this.state.atLeastOneResult) {
          groups.push(
            <div className="no-search-result"
              key={this.props.id+"-search"}>
              {'No search result for "'+ this.props.searchfilter + '".'}
            </div>);
        }
        let sortedIndex = GroupManager.getIndexSortByPosition(this.props.groups);
        for (let index of sortedIndex) {
          groups.push(
            <ErrorBoundary 
              key={index} 
              fallback={<div>Error on Group at index {index}</div>}
            >
              <Group
                /*** Functions ***/
                onGroupClick= {this.props.onGroupClick}
                onGroupDrop= {this.props.onGroupDrop}
                onMoveTabToNewGroup= {this.props.onMoveTabToNewGroup}
                onGroupCloseClick= {this.props.onGroupCloseClick}
                onGroupRemoveClick= {this.props.onGroupRemoveClick}
                onGroupTitleChange= {this.props.onGroupTitleChange}
                onTabClick= {this.props.onTabClick}
                onOpenInNewWindowClick= {this.props.onOpenInNewWindowClick}
                onCloseTab= {this.props.onCloseTab}
                onOpenTab= {this.props.onOpenTab}
                onGroupChangePosition= {this.props.onGroupChangePosition}
                onChangePinState= {this.props.onChangePinState}
                onChangeExpand= {this.props.onChangeExpand}
                /*** Data ***/
                key= {index}
                groups= {this.props.groups}
                group= {this.props.groups[index]}
                currentWindowId= {this.props.currentWindowId}
                currentlyClosing= {this.isCurrently(TaskManager.CLOSE_REFERENCE, this.props.groups[index].id)}
                currentlyRemoving= {this.isCurrently(TaskManager.REMOVE_REFERENCE, this.props.groups[index].id)}
                selectionFilter={
                  this.props.selectionFilter
                    ? this.props.selectionFilter[this.props.groups[index].id]
                    : undefined
                }
                /*** Options ***/
                searchGroupResult= {this.state.searchGroupsResults?this.state.searchGroupsResults[index]:undefined}
                currentlySearching= {this.state.searchGroupsResults?true:false}
                showTabsNumber={this.props.showTabsNumber}
                allowClickSwitch={this.props.allowClickSwitch}
                stateless={this.props.stateless}
                width={this.props.width}
                hotkeysEnable={this.props.hotkeysEnable}
                hoverStyle={this.props.hoverStyle}
                controlsEnable={this.props.controlsEnable}
                groupDraggable={this.props.groupDraggable}
                draggable={this.props.draggable}
                /*** actions ***/
                forceExpand={this.props.forceExpand}
                forceReduce={this.props.forceReduce}
              />
            </ErrorBoundary>);
        }
    } else {
      groups = (
        <div className="empty-list">
          There is no group now... Create your first one!
        </div>
      );
    }

    return (
      <ul className={groupListClasses}
        id={this.props.id}
        style={{width: this.props.width}}>
        {groups}
      </ul>
    );
  }

  applySearch(searchValue) {
    let searchGroupsResults = [];
    let atLeastOneResult = false;

    let [groupSearchValue,
        tabSearchValue] = Utils.extractSearchValue(searchValue);

    // Apply search
    for (let i = 0; i < this.props.groups.length; i++) {
      searchGroupsResults[i] = {
        atLeastOneResult: false,
        searchTabsResults: [],
      };
      // Search in group title
      if (groupSearchValue.length) {
        if ( !Utils.search(this.props.groups[i].title, groupSearchValue) ) {
          searchGroupsResults[i].atLeastOneResult = false;
          //atLeastOneResult = true;
          continue;
        } else {
          searchGroupsResults[i].atLeastOneResult = true;
          atLeastOneResult = true;
        }
      }

      if ( tabSearchValue.length ) {
        for (let j = 0; j < this.props.groups[i].tabs.length; j++) {
          // Search in tab title
          const currentTab = this.props.groups[i].tabs[j];
          const tabUrl = new URL(Utils.extractTabUrl(currentTab.url))
          const tabHost = tabUrl.hostname.slice(0, tabUrl.hostname.lastIndexOf('.'))
          const tabSearchPart = currentTab.title + " " + tabHost;
          if ( !Utils.search(tabSearchPart, tabSearchValue)) {
            searchGroupsResults[i].searchTabsResults[j] = false;
          } else {
            searchGroupsResults[i].atLeastOneResult = true;
            searchGroupsResults[i].searchTabsResults[j] = true;
            atLeastOneResult = true;
          }
        }
      } else {
        searchGroupsResults[i].searchTabsResults = undefined;
      }
    }

    return {
      searchGroupsResults: searchGroupsResults,
      atLeastOneResult: atLeastOneResult,
    };
  }

  unMarkSearch() {
    let id = "#" + this.props.id + " ";
    let all = document.querySelectorAll(
      id + ".group .group-title, "
      + id + ".tab-title");

    (new Mark(all)).unmark({
      "element": "span",
      "className": "highlight",
    });
  }

  markSearch(groupSearchValue, tabSearchValue) {
    let id = "#" + this.props.id + " ";
    let all = document.querySelectorAll(
      id + ".group .group-title, "
      + id + ".tab-title");
    let group = document.querySelectorAll(id + ".group .group-title");
    let tab = document.querySelectorAll(id + ".tab-title");

    (new Mark(all)).unmark({
      "element": "span",
      "className": "highlight",
      done() {
        if ( groupSearchValue.length ) {
          (new Mark(group)).mark(groupSearchValue.split(' '), {
            "element": "span",
            "className": "highlight",
          });
        }
        if ( tabSearchValue.length ) {
          (new Mark(tab)).mark(tabSearchValue.split(' '), {
            "element": "span",
            "className": "highlight",
          });
        }
      }
    });
  }
};

GroupList.propTypes = {
  groups: PropTypes.object.isRequired,
  currentWindowId: PropTypes.number,
  delayedTasks: PropTypes.object,
  onGroupAddClick: PropTypes.func,
  onGroupAddDrop: PropTypes.func,
  onMoveTabToNewGroup: PropTypes.func,
  onGroupClick: PropTypes.func,
  onGroupDrop: PropTypes.func,
  onGroupCloseClick: PropTypes.func,
  onGroupRemoveClick: PropTypes.func,
  onGroupTitleChange: PropTypes.func,
  onTabClick: PropTypes.func,
  onOpenInNewWindowClick: PropTypes.func,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
  onGroupChangePosition: PropTypes.func,
  onChangePinState: PropTypes.func,
  onChangeExpand: PropTypes.func,
  allowClickSwitch: PropTypes.bool,
  stateless: PropTypes.bool,
  searchfilter: PropTypes.string,
}
