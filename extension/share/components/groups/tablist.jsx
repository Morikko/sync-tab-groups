import React from 'react'
import PropTypes from 'prop-types'

import ErrorBoundary from '../ErrorBoundary'
import Tab from './tab'
import TabControls from './tabcontrols';

class TabList extends React.Component {
  render() {
    return (
      <ul className ={"tab-list "
        + (this.props.visible?"":"hiddenBySearch")}>
        {this.props.tabs.map(
          (tab, index) => {
            let selected = this.props.selectionFilter !== undefined
              ? this.props.selectionFilter[index]
              : undefined;

            return (
              <ErrorBoundary
                key={index}
                fallback={<div>Error on Tab at index {index}</div>}
              >
                <Tab
                  key={index}
                  group={this.props.group}
                  tabIndex={index}
                  tab={tab}
                  onTabClick={this.props.onTabClick}
                  onGroupDrop={this.props.onGroupDrop}
                  onMoveTabToNewGroup={this.props.onMoveTabToNewGroup}
                  onRemoveHiddenTab={this.props.onRemoveHiddenTab}
                  opened={this.props.opened}
                  onCloseTab={this.props.onCloseTab}
                  onOpenTab={this.props.onOpenTab}
                  searchTabResult={this.props.searchTabsResults?this.props.searchTabsResults[index]:true}
                  groups={this.props.groups}
                  onChangePinState={this.props.onChangePinState}
                  allowClickSwitch={this.props.allowClickSwitch}
                  hotkeysEnable={this.props.hotkeysEnable}
                  selected={selected}
                  hoverStyle={this.props.hoverStyle}
                  controlsEnable={this.props.controlsEnable}
                  draggable={this.props.draggable}
                />
              </ErrorBoundary>
            );
          }
        )}
      </ul>
    );
  }
}

TabList.propTypes = {
  onTabClick: PropTypes.func,
  tabs: PropTypes.array.isRequired,
  opened: PropTypes.bool.isRequired,
  onCloseTab: PropTypes.func,
  onOpenTab: PropTypes.func,
  onGroupDrop: PropTypes.func,
  onMoveTabToNewGroup: PropTypes.func,
  searchTabsResults: PropTypes.object,
  groups: PropTypes.object,
  onChangePinState: PropTypes.func,
  allowClickSwitch: PropTypes.bool,
}

export default TabControls