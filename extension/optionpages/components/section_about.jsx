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
      developper: [],
    }]

    return (
      <div
        className={"option-section " + (this.props.selected==="about"?
            "visible":"invisible")}>
          <h1 className="section-title">
            About
          </h1>
          <h2>
            Sync Tab Groups
          </h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec sodales ligula. Nam tempus ipsum sit amet lorem pellentesque, sed malesuada urna rutrum. Morbi placerat tempus mollis. Sed vel libero mattis, ultrices tellus in, consequat enim. Ut vitae fermentum nulla, vel consectetur mi. Etiam sit amet cursus augue. Ut justo metus, venenatis mollis viverra eu, lacinia faucibus velit. Donec ultricies gravida finibus. Duis ligula ante, vehicula vitae sapien nec, bibendum pretium mi. Proin porta enim at risus mattis, et sagittis odio sollicitudin. Ut mattis mauris id sem dignissim tincidunt eget a sem.
          </p>
          <ul>
            <li>Development</li>
            <li>Contribute</li>
            <li>Bug</li>
          </ul>
          <h2>
            Release Notes
          </h2>
          {
            /*
            this.release_notes.map((release_note) => {
              return <ReleaseNote release_note={release_note} />
            })
            */
          }
      </div>
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
  selected: PropTypes.string,
}
