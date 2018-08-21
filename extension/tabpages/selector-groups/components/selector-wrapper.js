var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class WrapperStandAlone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      single: true,
      selectionFilter: this.getSelectionFilter(props.groups),
      hasSelected: false
    };

    this.onImportTypeChange = this.onImportTypeChange.bind(this);
    this.changeTabSelectionFilter = this.changeTabSelectionFilter.bind(this);
    this.changeGroupSelectionFilter = this.changeGroupSelectionFilter.bind(this);
    this.getSelectionFilter = this.getSelectionFilter.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setSelectionFilter(this.getSelectionFilter(nextProps.groups));
  }

  getSelectionFilter(groups, defaultValue = false) {
    let selectionFilter = {};
    groups.forEach(group => {
      let tabs = group.tabs.map(tab => defaultValue);
      selectionFilter[group.id] = {
        selected: tabs.filter(tab => tab).length,
        tabs
      };
    });

    return selectionFilter;
  }

  setSelectionFilter(selectionFilter) {
    let hasSelected = Object.values(selectionFilter).filter(group => {
      if (group.selected) return true;
      if (group.tabs.filter(tab => tab).length) return true;
      return false;
    }).length > 0;

    this.setState({
      hasSelected: hasSelected,
      selectionFilter: selectionFilter
    });
  }

  // Also change the group
  changeTabSelectionFilter(id, index, previousValue) {
    const nextSelectionFilter = Utils.getCopy(this.state.selectionFilter);
    nextSelectionFilter[id].tabs[index] = !previousValue;
    nextSelectionFilter[id].selected = nextSelectionFilter[id].tabs.filter(tab => tab).length;

    this.setSelectionFilter(nextSelectionFilter);
  }

  // None -> Full | Partial -> Full | Full -> None
  changeGroupSelectionFilter(id, previousValue) {
    const nextSelectionFilter = Utils.getCopy(this.state.selectionFilter);
    let tabs = nextSelectionFilter[id].tabs;

    if (previousValue < tabs.length) {
      tabs = tabs.map(tab => true);
      nextSelectionFilter[id] = {
        selected: tabs.length,
        tabs
      };
    } else {
      tabs = tabs.map(tab => false);
      nextSelectionFilter[id] = {
        selected: 0,
        tabs
      };
    }

    this.setSelectionFilter(nextSelectionFilter);
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(ManageBar, {
        singleMode: this.state.single,
        hasSelected: this.state.hasSelected,
        onFinish: this.onFinish,
        changeColumnDisplay: this.onColumnChange }),
      React.createElement(Panel, _extends({}, this.props, {
        singleMode: this.state.single,
        selectionFilter: this.state.selectionFilter,
        changeTabSelectionFilter: this.changeTabSelectionFilter,
        changeGroupSelectionFilter: this.changeGroupSelectionFilter,
        selectAllInSelectionFilter: () => {
          this.setSelectionFilter(this.getSelectionFilter(this.props.groups, true));
        },
        selectNoneInSelectionFilter: () => {
          this.setSelectionFilter(this.getSelectionFilter(this.props.groups, false));
        }
      }))
    );
  }

  onImportTypeChange(value) {
    this.setState({
      single: value
    });
  }

  onFinish() {
    this.props.finish({
      importType: undefined,
      filter: this.state.selectionFilter
    });
  }
}

const Wrapper = (() => {
  return ReactRedux.connect(state => {
    return {
      groups: state.get("groups"),
      options: state.get("options")
    };
  }, ActionCreators)(WrapperStandAlone);
})();