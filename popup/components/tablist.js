const TabList = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    onTabDrag: React.PropTypes.func,
    onTabDragStart: React.PropTypes.func,
    tabs: React.PropTypes.array.isRequired
  },

  render: function() {
    return (
      React.DOM.ul(
        {className: "tab-list"},
        this.props.tabs.map((tab) => {
          return React.createElement(Tab, {
            key: tab.index,
            tab: tab,
            onTabClick: this.props.onTabClick,
            onTabDrag: this.props.onTabDrag,
            onTabDragStart: this.props.onTabDragStart,
            uiHeightChanged: this.props.uiHeightChanged
          });
        })
      )
    );
  }
});
