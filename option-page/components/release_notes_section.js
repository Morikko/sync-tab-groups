const ReleaseNotesSection = React.createClass({
  propTypes: {
  },

  render: function() {
    return React.DOM.div({
      className: "option-section"
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
  },

});
