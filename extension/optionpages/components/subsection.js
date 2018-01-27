class SubSection extends React.Component {
  render() {
    return React.createElement(
      "div",
      { className: "subsection tooltip" },
      this.props.title && React.createElement(
        "h2",
        null,
        this.props.title
      ),
      this.props.tooltip && React.createElement(
        "div",
        { className: "tooltiptext" },
        React.createElement(
          "h2",
          null,
          this.props.title + " " + browser.i18n.getMessage("options_help_title") + ": "
        ),
        this.props.tooltip
      ),
      this.props.content
    );
  }

  getId() {
    return this.props.title.toLowerCase().replace(" ", "_").replace("/", "_");
  }
}

SubSection.propTypes = {
  content: PropTypes.object,
  tooltip: PropTypes.object,
  title: PropTypes.string.isRequired
};