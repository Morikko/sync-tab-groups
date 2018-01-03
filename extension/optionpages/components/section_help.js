class HelpSection extends React.Component {
  render() {
    return React.createElement(
      "div",
      {
        className: this.props.selected === "help" ? "visible" : "invisible" },
      React.createElement(
        "h1",
        { className: "section-title" },
        "Guide"
      ),
      React.createElement(
        "h2",
        { className: "subsection-title" },
        "General"
      ),
      React.createElement(
        "p",
        null,
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam nec sodales ligula. Nam tempus ipsum sit amet lorem pellentesque, sed malesuada urna rutrum. Morbi placerat tempus mollis. Sed vel libero mattis, ultrices tellus in, consequat enim. Ut vitae fermentum nulla, vel consectetur mi. Etiam sit amet cursus augue. Ut justo metus, venenatis mollis viverra eu, lacinia faucibus velit. Donec ultricies gravida finibus. Duis ligula ante, vehicula vitae sapien nec, bibendum pretium mi. Proin porta enim at risus mattis, et sagittis odio sollicitudin. Ut mattis mauris id sem dignissim tincidunt eget a sem."
      ),
      React.createElement(
        "h2",
        { className: "subsection-title" },
        "Group"
      ),
      React.createElement(
        "p",
        null,
        "Vestibulum maximus, lectus ac auctor vulputate, libero purus rhoncus ligula, vitae dictum neque dolor vel elit.Nunc vel ante ligula.Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla eu magna sed massa fringilla facilisis ut et mauris.Maecenas lorem eros, tempus eu viverra eget, feugiat nec est.Fusce non ipsum mauris.Cras rutrum imperdiet fringilla.Sed blandit commodo cursus.Nam ullamcorper vulputate elementum.Ut placerat turpis erat, eget sodales neque cursus non.Sed diam elit, semper sed volutpat in , commodo ac enim.Sed sit amet bibendum nibh.Etiam volutpat nisl ac lectus viverra, vitae fringilla tortor ultrices.Aenean vel scelerisque augue, vel consectetur nulla.Phasellus eget est eu quam aliquet auctor vitae sit amet libero."
      ),
      React.createElement(
        "h2",
        { className: "subsection-title" },
        "Interface"
      ),
      React.createElement(
        "p",
        null,
        "Praesent diam eros, commodo eu nulla et, congue condimentum lacus. Proin auctor vel ligula sit amet consectetur. Phasellus id ante rutrum, posuere nibh eu, pellentesque arcu. Morbi nibh magna, consequat in risus nec, rhoncus rhoncus nisl. In sollicitudin luctus erat. Maecenas vel scelerisque tortor. Nulla mattis lobortis rutrum."
      ),
      React.createElement(
        "p",
        null,
        "Morbi dictum id turpis in vestibulum. Nulla convallis tincidunt tellus id pulvinar. Nulla egestas justo a condimentum consequat. Integer ornare diam et sagittis iaculis. Praesent a porta justo, vel gravida est. Etiam vitae tempus erat. Quisque sagittis sem a ligula sodales molestie. Morbi dapibus odio sit amet neque volutpat cursus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aenean auctor sodales consectetur."
      ),
      React.createElement(
        "h2",
        { className: "subsection-title" },
        "Manage"
      ),
      React.createElement(
        "p",
        null,
        "In at augue quis tortor faucibus laoreet. Donec vitae accumsan tortor. Sed interdum neque vel luctus placerat. Fusce sed tellus sollicitudin, ullamcorper elit ac, egestas ex. Proin dolor sem, suscipit in diam ut, viverra venenatis magna. Nunc arcu leo, fermentum vitae justo ac, ultrices lacinia turpis. Phasellus nec commodo magna, vitae imperdiet lacus. Ut sit amet consectetur est. Duis maximus eget massa sagittis ullamcorper. Vivamus neque augue, pellentesque vel ultricies hendrerit, sagittis quis enim. Duis pretium vitae ipsum in congue. Vestibulum posuere feugiat aliquet. Quisque vel varius nunc. Nam et mattis nisl. Aliquam facilisis felis vitae nulla luctus malesuada."
      )
    );
  }
};

HelpSection.propTypes = {
  selected: PropTypes.string
};