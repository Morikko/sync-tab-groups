const SearchBar = React.createClass({
  propTypes: {
    onSearchChange: React.PropTypes.func,
  },

  getInitialState: function() {
    return {
      value: '',
    };
  },

  render: function() {
    this.searchbar = React.DOM.input({
      type: "search",
      placeholder: browser.i18n.getMessage("search"),
      onChange: this.handleSearchChange,
      value: this.state.value,
      id: "search-input",
    });

    return (
      React.DOM.li({
        className: "searchbar",
      }, [
        this.searchbar,
        React.DOM.i({
          title: browser.i18n.getMessage("clear_search"),
          className: "cancel-search fa fa-fw fa-times-circle" + (this.state.value.length>0?"":"  hiddenBySearch"),
          onClick: this.clearSearchBar
        })
      ])
    );
  },

  handleSearchChange: function(event) {
    event.stopPropagation();
    this.setState({
      value: event.target.value
    });
    this.props.onSearchChange(event.target.value);
  },

  clearSearchBar: function(event) {
    event.stopPropagation();
    this.setState({
      value: ''
    });
    this.props.onSearchChange('');
  },
});
