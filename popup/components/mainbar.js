const MainBar = React.createClass({
  propTypes: {
    onChangeWindowSync: React.PropTypes.func,
    onClickPref: React.PropTypes.func,
    isSync: React.PropTypes.bool,
    currentWindowId: React.PropTypes.number.isRequired,
  },

  render: function() {
    let id = "window-is-sync";

    return (
      React.DOM.li({
          className: "mainbar",
        },
        React.DOM.div({
          className: "window-synchronized"
        }, [
          React.createElement(
            NiceCheckbox, {
              id: id,
              label: "Window synchronized",
              checked: this.props.isSync,
              onCheckChange: this.handleCheckChange,
            }
          ),
        ]),
        React.DOM.div({
          className: "main-actions",
        }, [
          React.DOM.i({
            className: "app-pref fa fa-fw fa-gear",
            onClick: this.props.onClickPref
          }),
        ]),
      )
    );
  },

  handleCheckChange: function(id, value) {
    this.props.onChangeWindowSync(this.props.currentWindowId, value);
  },

  handleGroupDragOver: function(event) {
    event.stopPropagation();
  },

  handleDragEnter: function(event) {
    event.stopPropagation();
  },

  handleDragLeave: function(event) {
    event.stopPropagation();
  },

  handleDrop: function(event) {
    event.stopPropagation();
  }
});
