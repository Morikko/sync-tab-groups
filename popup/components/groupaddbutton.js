const GroupAddButton = React.createClass({
  propTypes: {
    onClick: React.PropTypes.func,
    onDrop: React.PropTypes.func
  },

  getInitialState: function() {
    return {
      draggingOverCounter: 0
    };
  },

  render: function() {
    let buttonClasses = classNames({
      draggingOver: this.state.draggingOverCounter !== 0,
      group: true
    });

    return (
      React.DOM.li(
        {
          className: buttonClasses,
          onClick: this.handleClick,
          onDrop: this.handleDrop,
          onDragOver: this.handleGroupDragOver,
          onDragEnter: this.handleDragEnter,
          onDragLeave: this.handleDragLeave
        },
        React.DOM.span(
          {className: "group-title"},
          browser.i18n.getMessage("add_group"),
        )
      )
    );
  },

  handleClick: function(event) {
    event.stopPropagation();
    this.props.onClick();
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
    event.preventDefault();
  },

  handleDragEnter: function(event) {
    event.stopPropagation();
    event.preventDefault();

    let draggingCounterValue = (this.state.draggingOverCounter == 1) ? 2 : 1;
    this.setState({draggingOverCounter: draggingCounterValue});
  },

  handleDragLeave: function(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.state.draggingOverCounter == 2) {
      this.setState({draggingOverCounter: 1});
    } else if (this.state.draggingOverCounter == 1) {
      this.setState({draggingOverCounter: 0});
    }
  },

  handleDrop: function(event) {
    event.stopPropagation();

    this.setState({draggingOverCounter: 0});

    let sourceGroup = event.dataTransfer.getData("tab/group");
    let tabIndex = event.dataTransfer.getData("tab/index");

    this.props.onDrop(
      sourceGroup,
      tabIndex
    );
  }
});
