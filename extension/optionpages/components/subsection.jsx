class SubSection extends React.Component {
  render() {
    return (
      <div className="subsection tooltip">
        {this.props.title && <h2>
          {this.props.title}
        </h2>}
        {this.props.tooltip &&
          <div className="tooltiptext">
            <h2>{
              this.props.title
            + " "
            + browser.i18n.getMessage("options_help_title")
            + ": "}
            </h2>
          {this.props.tooltip}
          </div>}
        {this.props.content}
      </div>
    );
  }

  getId() {
    return this.props.title.toLowerCase().replace(" ", "_").replace("/", "_");
  }
}

SubSection.propTypes = {
  content: PropTypes.object,
  tooltip: PropTypes.object,
  title: PropTypes.string.isRequired,
};
