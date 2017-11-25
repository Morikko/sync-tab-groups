const OptionButton = React.createClass({
  propTypes: {
    title: React.PropTypes.string,
    onClick: React.PropTypes.func,
    id: React.PropTypes.string,
  },

  render: function() {
    return React.DOM.button({
      type: "button",
      className: "option-button",
      onClick: this.handleClick
    }, [
      this.props.title
    ]);
  },

  handleClick: function(event) {
    event.stopPropagation();
    this.props.onClick();
  }

});
