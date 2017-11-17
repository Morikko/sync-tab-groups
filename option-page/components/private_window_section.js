const PrivateWindowSection = React.createClass({
  propTypes: {
    privateWindowOptions: React.PropTypes.object.isRequired
  },

  render: function() {
    return React.DOM.div({
      className: "option-section"
    }, [
      React.DOM.h2({className: "title-section"}, 'Private Window'),
      React.DOM.input({
        type: "checkbox"
      })
    ]);
  }
});
