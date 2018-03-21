class ManageBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    if (Utils.getParameterByName('type') === Selector.TYPE.IMPORT) {
      this.state.type = 'import_groups';
    } else {
      this.state.type = 'export_groups';
    }
  }

  render() {
    return React.createElement(
      'div',
      { id: 'menu' },
      React.createElement(
        'div',
        { className: 'title' },
        React.createElement('img', { src: '/share/icons/tabspace-active-64.png', alt: '', height: '32' }),
        React.createElement(
          'span',
          null,
          "Selector"
        )
      ),
      React.createElement(
        'div',
        { className: 'bar-buttons' },
        React.createElement(OptionButton, {
          title: browser.i18n.getMessage(this.state.type),
          onClick: e => this.props.onFinish(),
          highlight: this.props.hasSelected,
          disabled: !this.props.hasSelected
        })
      )
    );
  }
}

ManageBar.propTypes = {
  singleMode: PropTypes.bool,
  changeColumnDisplay: PropTypes.func
};