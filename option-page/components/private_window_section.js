const PrivateWindowSection = React.createClass({
  propTypes: {
    privateWindowOptions: React.PropTypes.object.isRequired
  },

  render: function() {
    return React.DOM.ul({
      className: "option-section"
    }, [
      React.createElement(SectionTitle, {
        title: 'Private Window'
      }),
      React.createElement(OptionCheckBox, {
        checked: true,
        label: "Synchronize Private Window as a new group",
        onCheckChange: this.handleOptionChange,
        id: "sync-private-window",
      }),
    ]);
  },

  handleOptionChange: function(optionName, optionValue) {

  }
});
