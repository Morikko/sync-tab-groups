class ManageWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      single: true
    }
    this.onColumnChange = this.onColumnChange.bind(this);
  }

  render() {
    return (
      <div>
        <ManageBar
          singleMode={this.state.single}
          changeColumnDisplay={this.onColumnChange}/>
        <ManagePanel
          {...this.props}
          singleMode={this.state.single}
        />
      </div>
    )
  }

  onColumnChange(value) {
    this.setState({
      single: value
    });
  }
}
