const OptionInput = React.createClass({
  propTypes: {
    label: React.PropTypes.string,
    name: React.PropTypes.string,
    help: React.PropTypes.string,
    onChange: React.PropTypes.func,
    id: React.PropTypes.string,
  },

  getInitialState: function() {
    return {
      name: this.props.name,
    };
  },

  componentWillReceiveProps: function(nextProps) {
      this.setState({
        name: nextProps.name,
      })
    },

  render: function() {
    let help_section = [];
    if ( this.props.help!==undefined ) {
      help_section.push(React.DOM.span({
        className: "option-input-text-help",
      }, this.props.help));
    }

    return React.DOM.div({
      className: "option-input-text",
    }, [
      React.DOM.span({
        className: "option-input-text-label",
        for: this.props.id,
      }, this.props.label),
      React.DOM.input({
        type: "text",
        value: this.state.name,
        id: this.props.id,
        onBlur: (event) => {
          this.props.onChange(this.props.id, event.target.value);
          this.setState({
            name: event.target.value
          });
        },
        onChange: (event) => {
          this.setState({
            name: event.target.value
          });
        },
      }),
      help_section
    ]);
  },

});
