class ButtonFile extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    return React.createElement(
      "div",
      { className: "button-file" },
      React.createElement("input", {
        className: "button-file-input",
        id: this.props.id,
        type: "file",
        onChange: this.handleClick,
        tabIndex: "-1"
      }),
      React.createElement(
        "label",
        {
          className: "button-file-label",
          htmlFor: this.props.id,
          tabIndex: "0" },
        this.props.title
      )
    );
  }

  async handleClick(event) {
    event.stopPropagation();
    try {
      let files = event.target.files;
      if (files.length === 0) {
        return "No file selected...";
      }
      const jsonContent = await StorageManager.File.readJsonFile(files[0]);
      this.props.onFileSelected(jsonContent);
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
  id: PropTypes.string
};