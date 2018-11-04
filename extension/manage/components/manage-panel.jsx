import React from 'react'
import * as ReactRedux from 'react-redux'
import classNames from 'classnames'
import {
  Navigation,
  generalNavigationListener,
} from '../../share/components/groups/wrapper/navigation'

import SearchBar from '../../share/components/groups/searchbar'
import GroupList from '../../share/components/groups/grouplist'
import GroupAddButton from '../../share/components/groups/groupaddbutton'
import ActionCreators from '../../share/components/groups/wrapper/actionCreators'

import OPTION_CONSTANTS from '../../background/core/OPTION_CONSTANTS'

class ManagePanelStandAlone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      leftsearchfilter: '',
      rightsearchfilter: '',
      leftForceExpand: false,
      leftForceReduce: false,
      rightForceExpand: false,
      rightForceReduce: false,
    };
    this.update = this.update.bind(this);
  }

  update() {
    this.forceUpdate();
  }

  componentDidMount() {
    window.addEventListener("resize", this.update);

    Navigation.setTarget(document.querySelector('.left-list'));

    if (this.props.options.shortcuts.navigation) {
      document.body.addEventListener("keydown", generalNavigationListener);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.update);

    if (this.props.options.shortcuts.navigation) {
      document.body.removeEventListener("keydown", generalNavigationListener);
    }
  }

  componentDidUpdate() {
    if (this.state.leftForceExpand) {
      this.setState({
        leftForceExpand: false,
      });
    }
    if (this.state.leftForceReduce) {
      this.setState({
        leftForceReduce: false,
      });
    }
    if (this.state.rightForceExpand) {
      this.setState({
        rightForceExpand: false,
      });
    }
    if (this.state.rightForceReduce) {
      this.setState({
        rightForceReduce: false,
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
            "half": !this.props.singleMode})}>
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
                  hotkeysEnable={this.props.options.shortcuts.navigation}/>
              }
            </div>
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
              onRemoveHiddenTabsInGroup={this.props.onRemoveHiddenTabsInGroup}
              onRemoveHiddenTab={this.props.onRemoveHiddenTab}
              /*** Data ***/
              groups= {this.props.groups}
              currentWindowId= {this.props.currentWindowId}
              delayedTasks= {this.props.delayedTasks}
              /*** Options ***/
              id="manage-left"
              searchfilter= {this.state.leftsearchfilter}
              allowClickSwitch={false}
              stateless={true}
              width={width}
              hotkeysEnable={this.props.options.shortcuts.navigation}
              showTabsNumber= {this.props.options.popup.showTabsNumber}
              groupDraggable={this.props.options.groups.sortingType === OPTION_CONSTANTS.SORT_CUSTOM}
              draggable={true}
              hoverStyle={true}
              controlsEnable={true}
              /*** actions ***/
              forceExpand={this.state.leftForceExpand}
              forceReduce={this.state.leftForceReduce}
            />
          </div>
          <div className={classNames({
            "right-list": true,
            "half": true,
            "invisible": this.props.singleMode})} >
            <div className="group-action right">
              {
                <SearchBar
                  onSearchChange={this.onSearchRightChange.bind(this)}
                  hotkeysEnable={this.props.options.shortcuts.navigation} />
              }
              <i
                className="app-pref fa fa-fw fa-angle-double-down"
                title={browser.i18n.getMessage("expand_all_groups")}
                onClick={this.handleRightForceExpand.bind(this)}
              />
              <i
                className="app-pref fa fa-fw fa-angle-double-up"
                title={browser.i18n.getMessage("reduce_all_groups")}
                onClick={this.handleRightForceReduce.bind(this)}
              />
            </div>
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
              onRemoveHiddenTabsInGroup={this.props.onRemoveHiddenTabsInGroup}
              onRemoveHiddenTab={this.props.onRemoveHiddenTab}
              /*** Data ***/
              groups= {this.props.groups}
              currentWindowId= {this.props.currentWindowId}
              delayedTasks= {this.props.delayedTasks}
              /*** Options ***/
              id="manage-right"
              searchfilter= {this.state.rightsearchfilter}
              allowClickSwitch={false}
              stateless={true}
              width={width}
              hotkeysEnable={this.props.options.shortcuts.navigation}
              showTabsNumber= {this.props.options.popup.showTabsNumber}
              groupDraggable= {this.props.options.groups.sortingType === OPTION_CONSTANTS.SORT_CUSTOM}
              draggable={true}
              hoverStyle={true}
              controlsEnable={true}
              /*** actions ***/
              forceExpand={this.state.rightForceExpand}
              forceReduce={this.state.rightForceReduce}
            />
          </div>
        </li>
        <li>
          <div className="belowActions">
            <GroupAddButton
              onClick= {this.props.onGroupAddClick}
              onDrop= {this.props.onGroupAddDrop}
              currentlySearching= {false}
              hotkeysEnable={this.props.options.shortcuts.navigation}
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
    if (this.state.leftsearchfilter.length && !searchValue.length) {
      stateToUpdate.leftForceReduce = true;
    }
    this.setState(stateToUpdate);
  }

  onSearchRightChange(searchValue) {
    let stateToUpdate = {
      rightsearchfilter: searchValue,
    };
    if (this.state.rightsearchfilter.length && !searchValue.length) {
      stateToUpdate.rightForceReduce = true;
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

  handleRightForceExpand(event) {
    event.stopPropagation();
    this.setState({
      rightForceExpand: true,
    });
  }

  handleRightForceReduce(event) {
    event.stopPropagation();
    this.setState({
      rightForceReduce: true,
    });
  }
}

const ManagePanel = (() => {
  return ReactRedux.connect((state) => {
    return {
      groups: state.get("groups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options"),
    };
  }, ActionCreators)(ManagePanelStandAlone)
})();

export default ManagePanel