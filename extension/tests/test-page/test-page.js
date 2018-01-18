var bg;

var queryString = new jasmine.QueryString({
  getWindowLocation: function() {
    return window.location;
  }
});

var specFilter = new jasmine.HtmlSpecFilter({
  filterString: function() {
    switch(queryString.getParam("spec")) {
      case "all":
        return "";
      case undefined:
        return "@@@@@@@";
      case "":
        return "@@@@@@@";
      default:
        return queryString.getParam("spec")
    }
  }
});

var env = jasmine.getEnv();

env.specFilter = function(spec) {
  return specFilter.matches(spec.getFullName());
};

(async () => {
  bg = await browser.runtime.getBackgroundPage();
  GroupManager = bg.GroupManager;
})()
