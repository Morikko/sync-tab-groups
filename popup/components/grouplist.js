const GroupList = (() => {
  const GroupListStandalone = React.createClass({
    propTypes: {
      groups: React.PropTypes.object.isRequired,
      closeTimeout: React.PropTypes.number,
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

    componentDidUpdate: function() {
      this.props.uiHeightChanged && this.props.uiHeightChanged();
    },

    render: function() {
      return React.DOM.ul(
        {className: "group-list"},
        this.props.groups.map((group) => {
          return React.createElement(Group, {
            key: group.id,
            group: group,
            closeTimeout: this.props.closeTimeout,
            onGroupClick: this.props.onGroupClick,
            onGroupDrop: this.props.onGroupDrop,
            onGroupCloseClick: this.props.onGroupCloseClick,
            onGroupTitleChange: this.props.onGroupTitleChange,
            onTabClick: this.props.onTabClick,
            onTabDrag: this.props.onTabDrag,
            onTabDragStart: this.props.onTabDragStart,
            uiHeightChanged: this.props.uiHeightChanged
          });
        }),
        React.createElement(
          GroupAddButton,
          {
            onClick: this.props.onGroupAddClick,
            onDrop: this.props.onGroupAddDrop
          }
        )
      );
    }
  });

  return ReactRedux.connect((state) => {
    return {
      groups: state.get("tabgroups"),
      closeTimeout: state.get("closeTimeout")
    };
  }, ActionCreators)(GroupListStandalone);
})();
