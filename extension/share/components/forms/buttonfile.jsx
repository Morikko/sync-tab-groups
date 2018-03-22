class ButtonFile extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return (<div className="button-file">
      <input
        className="button-file-input"
        id={this.props.id}
        type="file"
        onChange={this.handleClick}
        tabIndex="-1"
      />
      <label
          className="button-file-label"
          htmlFor={this.props.id}
          tabIndex="0">
        {this.props.title}
      </label>
    </div>);
  }

  async handleClick(event) {
    event.stopPropagation();
    try {
      let files = event.target.files;
      if (files.length === 0) {
        return "No file selected..."
      }
      const jsonContent = await StorageManager.File.readJsonFile(files[0]);
      this.props.onFileSelected({
        content: jsonContent,
        filename: files[0].name,
      });
    } catch (e) {
      let msg = "ButtonFile.handleClick failed: " + e;
      console.error(msg);
      return msg;
    }
  }
};

ButtonFile.propTypes = {
  title: PropTypes.string,
  onFileSelected: PropTypes.func,
  id: PropTypes.string,
};
