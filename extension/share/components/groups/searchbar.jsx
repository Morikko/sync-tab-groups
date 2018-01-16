class SearchBar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };

    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.clearSearchBar = this.clearSearchBar.bind(this);
  }

  render() {
    this.searchbar = (
      <input type="search"
        placeholder={browser.i18n.getMessage('search')}
        onChange={this.handleSearchChange}
        value={this.state.value}
        id="search-input"
        autoFocus/>
      );

    return (
      <div className="searchbar">
        {this.searchbar}
        <i title={browser.i18n.getMessage("clear_search")}
          className={"cancel-search fa fa-fw fa-times-circle" + (this.state.value.length>0?"":"  hiddenBySearch")}
          onClick={this.clearSearchBar}/>
      </div>
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
    event.stopPropagation();
    this.setState({
      value: ''
    });
    this.props.onSearchChange('');
  }
};

SearchBar.propTypes = {
  onSearchChange: PropTypes.func,
}
