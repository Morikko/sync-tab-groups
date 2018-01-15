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