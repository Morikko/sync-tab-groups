const MainBar = React.createClass({
  propTypes: {
    onChangeWindowSync: React.PropTypes.func,
    onClickPref: React.PropTypes.func,
    isSync: React.PropTypes.bool,
    currentWindowId: React.PropTypes.number.isRequired,
  },

  getInitialState: function() {
    return {
      isSync: this.props.isSync,
    };
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
          React.DOM.label({
            for: id
          }, [
            React.DOM.input({
              type: "checkbox",
              checked: this.state.isSync,
              id: id,
              onClick: this.handleClick,
            }),
            " Window synchronized"
          ]),
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

  handleClick: function(event) {
    event.stopPropagation();
    this.setState({
      isSync: !this.state.isSync
    })

    this.props.onChangeWindowSync(this.props.currentWindowId, this.state.isSync);
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
