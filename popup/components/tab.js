const Tab = React.createClass({
  propTypes: {
    onTabClick: React.PropTypes.func,
    onTabDrag: React.PropTypes.func,
    onTabDragStart: React.PropTypes.func,
    tab: React.PropTypes.object.isRequired
  },

  render: function() {
    let favicon = React.DOM.img({
      alt: "",
      className: "tab-icon",
      src: this.props.tab.icon
    });

    let tabClasses = classNames({
      active: this.props.tab.active,
      tab: true
    });

    return (
      React.DOM.li(
        {
          className: tabClasses,
          onClick: this.handleTabClick,
          onDrag: this.handleTabDrag,
          onDragStart: this.handleTabDragStart,
          draggable: true
        },
        favicon,
        React.DOM.span({className: "tab-title"}, this.props.tab.title)
      )
    );
  },

  handleTabClick: function(event) {
    event.stopPropagation();

    let tab = this.props.tab;
    this.props.onTabClick(
      tab.group,
      tab.index
    );
  },

  handleTabDrag: function(event) {
    event.stopPropagation();

    let tab = this.props.tab;
    event.dataTransfer.setData("tab/index", tab.index);
    event.dataTransfer.setData("tab/group", tab.group);

    this.props.onTabDrag(
      tab.group,
      tab.index
    );
  },

  handleTabDragStart: function(event) {
    event.stopPropagation();

    let tab = this.props.tab;
    event.dataTransfer.setData("tab/index", tab.index);
    event.dataTransfer.setData("tab/group", tab.group);

    this.props.onTabDragStart(
      tab.group,
      tab.index
    );
  }
});
