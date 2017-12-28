const SectionTitle = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired
  },

  render: function() {
    return React.DOM.h2({
      className: "title-section"
    }, this.props.title);
  }

});
