const App = React.createClass({
  propTypes: {
    onGroupAddClick: React.PropTypes.func,
    onGroupAddDrop: React.PropTypes.func,
    onGroupClick: React.PropTypes.func,
    onGroupDrop: React.PropTypes.func,
    onGroupCloseClick: React.PropTypes.func,
    onGroupTitleChange: React.PropTypes.func,
    onTabClick: React.PropTypes.func,
    onTabDrag: React.PropTypes.func,
    onTabDragStart: React.PropTypes.func,
    uiHeightChanged: React.PropTypes.func
  },

  render: function() {
    return React.createElement(GroupList, this.props);
  }
});
