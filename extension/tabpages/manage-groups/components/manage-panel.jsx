class ManagePanelStandAlone extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        searchfilter: '',
        maximized: this.props.options.popup.maximized,
        searchGroupsResults: {} /*searchResults.searchGroupsResults*/ ,
        atLeastOneResult: true /*searchResults.atLeastOneResult*/ ,
      };
    }

    render() {
        return (
            <ul id="manage-panel">
        <li>
          <div className={classNames({
            "left-list": true,
            "half": !this.props.singleMode,})}>
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
              searchGroupsResults= {this.state.searchGroupsResults}
              currentlySearching= {this.state.searchfilter.length > 0}
              allowClickSwitch={false}
            />
          </div>
          <div className={classNames({
            "right-list": true,
            "half": true,
            "invisible": this.props.singleMode,})} >
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
              searchGroupsResults= {this.state.searchGroupsResults}
              currentlySearching= {this.state.searchfilter.length > 0}
              allowClickSwitch={false}
            />
          </div>
        </li>
        <li>
          <div className="belowActions">
            <div className="left">
              <i
                className="app-pref fa fa-fw fa-angle-double-down"
                title={browser.i18n.getMessage("expand_all_groups")}
                onClick={this.handleOpenAllExpand}
              />
              <i
                className="app-pref fa fa-fw fa-angle-double-up"
                title={browser.i18n.getMessage("reduce_all_groups")}
                onClick={this.handleCloseAllExpand}
              />
            </div>
            <div className={classNames({
              "center": true,
            })}>
              <GroupAddButton
                  onClick= {this.props.onGroupAddClick}
                  onDrop= {this.props.onGroupAddDrop}
                  currentlySearching= {false}
              />
            </div>
            <div className={classNames({
              "right": true,
              "invisible": this.props.singleMode,})} >
              <i
                className="app-pref fa fa-fw fa-angle-double-down"
                title={browser.i18n.getMessage("expand_all_groups")}
                onClick={this.handleOpenAllExpand}
              />
              <i
                className="app-pref fa fa-fw fa-angle-double-up"
                title={browser.i18n.getMessage("reduce_all_groups")}
                onClick={this.handleCloseAllExpand}
              />
            </div>
          </div>
        </li>
      </ul>
    );
  }
}

const ManagePanel = (() =>{
  return ReactRedux.connect((state) => {
    return {
      groups: state.get("tabgroups"),
      currentWindowId: state.get("currentWindowId"),
      delayedTasks: state.get("delayedTasks"),
      options: state.get("options")
    };
  }, ActionCreators)(ManagePanelStandAlone)})();
