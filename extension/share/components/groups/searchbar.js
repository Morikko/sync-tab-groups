class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.clearSearchBar = this.clearSearchBar.bind(this);
  }

  render() {
    this.searchbar = React.createElement('input', { type: 'search',
      placeholder: browser.i18n.getMessage('search'),
      onChange: this.handleSearchChange,
      value: this.state.value,
      id: 'search-input',
      onKeyDown: Utils.doActivateHotkeys(searchBarNavigationListener(this), this.props.hotkeysEnable),
      autoFocus: true });

    return React.createElement(
      'div',
      { className: 'searchbar' },
      this.searchbar,
      React.createElement('i', { title: browser.i18n.getMessage("clear_search"),
        className: "cancel-search fa fa-fw fa-times-circle" + (this.state.value.length > 0 ? "" : "  hiddenBySearch"),
        onClick: this.clearSearchBar })
    );
  }

  handleSearchChange(event) {
    event.stopPropagation();
    this.setState({
      value: event.target.value
    });
    this.props.onSearchChange(event.target.value);
  }

  clearSearchBar(event) {
    if (event) {
      event.stopPropagation();
    }
    this.setState({
      value: ''
    });
    this.props.onSearchChange('');
  }
};

SearchBar.propTypes = {
  onSearchChange: PropTypes.func
};