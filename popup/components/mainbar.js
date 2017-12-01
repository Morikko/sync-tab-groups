const MainBar = React.createClass({
  propTypes: {
    onChangeWindowSync: React.PropTypes.func,
    onClickPref: React.PropTypes.func,
    onClickMaximize: React.PropTypes.func,
    isSync: React.PropTypes.bool,
    currentWindowId: React.PropTypes.number.isRequired,
  },

  getInitialState: function() {
    return {
      maximized: false,
    };
  },

  render: function() {
    let id = "window-is-sync";

    let maximizerClasses = classNames({
      "icon-maximized": !this.props.maximized,
      "icon-minimized": this.props.maximized,
      "app-maximize": true,
      "fa": true,
      "fa-fw": true,
      "fa-window-maximize": true,
    });

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
          className: "right-actions",
        }, [
          React.DOM.i({
            className: "app-pref fa fa-fw fa-gear",
            title: "Open Preferences",
            onClick: this.handleClickPref
          }),
          React.DOM.i({
            className: maximizerClasses,
            title: "Expand Menu",
            onClick: this.props.onClickMaximize
          }),
        ]),
      )
    );
  },

  handleClickPref: function(event) {
    event.stopPropagation();
    this.props.onClickPref();
    window.close();
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
