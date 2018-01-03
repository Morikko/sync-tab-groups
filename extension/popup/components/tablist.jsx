/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert
*/
class TabList extends React.Component{
  render() {
    return (
      <ul className ="tab-list">
        {this.props.tabs.map((tab, index) => {
          return <Tab
            key={index}
            group={this.props.group}
            tabIndex={index}
            tab={tab}
            onTabClick={this.props.onTabClick}
            onGroupDrop={this.props.onGroupDrop}
            onMoveTabToNewGroup={this.props.onMoveTabToNewGroup}
            opened={this.props.opened}
            onCloseTab={this.props.onCloseTab}
            onOpenTab={this.props.onOpenTab}
            searchTabResult={this.props.searchTabsResults[index]||false}
            groups={this.props.groups}
            onChangePinState={this.props.onChangePinState}
          />
        })}
      </ul>
    );
  }
};

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
}
