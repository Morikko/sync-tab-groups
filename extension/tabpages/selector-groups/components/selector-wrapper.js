var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

class WrapperStandAlone extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      single: true,
      selectionFilter: this.getSelectionFilter(props.groups)
    };
    this.onColumnChange = this.onColumnChange.bind(this);
    this.changeTabSelectionFilter = this.changeTabSelectionFilter.bind(this);
    this.changeGroupSelectionFilter = this.changeGroupSelectionFilter.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectionFilter: this.getSelectionFilter(nextProps.groups)
    });
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

  // Also change the group
  changeTabSelectionFilter(id, index, previousValue) {
    const nextSelectionFilter = Utils.getCopy(this.state.selectionFilter);
    nextSelectionFilter[id].tabs[index] = !previousValue;
    nextSelectionFilter[id].selected = nextSelectionFilter[id].tabs.filter(tab => tab).length;

    this.setState({
      selectionFilter: nextSelectionFilter
    });
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

    this.setState({
      selectionFilter: nextSelectionFilter
    });
  }

  render() {
    return React.createElement(
      "div",
      null,
      React.createElement(ManageBar, {
        singleMode: this.state.single,
        changeColumnDisplay: this.onColumnChange }),
      React.createElement(Panel, _extends({}, this.props, {
        singleMode: this.state.single,
        selectionFilter: this.state.selectionFilter,
        changeTabSelectionFilter: this.changeTabSelectionFilter,
        changeGroupSelectionFilter: this.changeGroupSelectionFilter
      }))
    );
  }

  onColumnChange(value) {
    this.setState({
      single: value
    });
  }
  /*
  static STEP = Object.freeze({
    SELECTION: "Selection",
    TYPE:
  })
  */
}

const Wrapper = (() => {
  return ReactRedux.connect(state => {
    return {
      groups: state.get("groups")
    };
  }, ActionCreators)(WrapperStandAlone);
})();