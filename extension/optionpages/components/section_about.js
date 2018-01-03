class AboutSection extends React.Component {
  render() {
    let release_notes = [{
      version: "",
      date: "",
      note: "",
      new: [],
      removed: [],
      changed: [],
      bugfix: [],
      developper: []
    }];

    return React.createElement(
      "div",
      {
        className: "option-section " + (this.props.selected === "about" ? "visible" : "invisible") },
      React.createElement(
        "h1",
        { className: "section-title" },
        "About"
      ),
      React.createElement(
        "h2",
        null,
        "Sync Tab Groups"
      ),
      React.createElement(
        "p",
        null,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec sodales ligula. Nam tempus ipsum sit amet lorem pellentesque, sed malesuada urna rutrum. Morbi placerat tempus mollis. Sed vel libero mattis, ultrices tellus in, consequat enim. Ut vitae fermentum nulla, vel consectetur mi. Etiam sit amet cursus augue. Ut justo metus, venenatis mollis viverra eu, lacinia faucibus velit. Donec ultricies gravida finibus. Duis ligula ante, vehicula vitae sapien nec, bibendum pretium mi. Proin porta enim at risus mattis, et sagittis odio sollicitudin. Ut mattis mauris id sem dignissim tincidunt eget a sem."
      ),
      React.createElement(
        "ul",
        null,
        React.createElement(
          "li",
          null,
          "Development"
        ),
        React.createElement(
          "li",
          null,
          "Contribute"
        ),
        React.createElement(
          "li",
          null,
          "Bug"
        )
      ),
      React.createElement(
        "h2",
        null,
        "Release Notes"
      )
    );
    /*
      React.DOM.div({
     }, [
      React.createElement(SectionTitle, {
        title: "Release Notes 0.4.1"
      }),
      React.DOM.span({},
        React.DOM.ul({},[
          React.DOM.li({},"Fix: More secure initialization of the extension"),
          React.DOM.li({},"Remove: Bookmark auto-save until I will have fix it"),
          React.DOM.li({},"Notes: Exports manually your groups regularly from the preferences or with a right click on the toolbar icon. So, you will keep a save."),
          React.DOM.li({},"Thanks for your feedbacks :)"),
      ])),
    ]);
    */
  }

};

AboutSection.propTypes = {
  selected: PropTypes.string
};