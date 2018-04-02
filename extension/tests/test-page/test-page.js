var bg;

var queryString = new jasmine.QueryString({
  getWindowLocation: function() {
    return window.location;
  }
});

var specFilter = new jasmine.HtmlSpecFilter({
  filterString: function() {
    if (Utils.getParameterByName("enable") !== 'true') {
      return "@@@@@@@";
    } else {
      return queryString.getParam("spec")
    }
  }
});


var env = jasmine.getEnv();

env.specFilter = function(spec) {
  return specFilter.matches(spec.getFullName());
};

var waitInit = (async () => {
  bg = await browser.runtime.getBackgroundPage();
  GroupManager = bg.GroupManager;
  WindowManager = bg.WindowManager;
  TabManager = bg.TabManager;
  OptionManager = bg.OptionManager;
  StorageManager = bg.StorageManager;
  Selector = bg.Selector;
  Background = bg.Background;
  TabHidden = bg.TabHidden;
  Event = bg.Event;
})()

function insertParam(key, value) {
  key = encodeURI(key);
  value = encodeURI(value);

  var kvp = document.location.search.substr(1).split('&');

  var i = kvp.length;
  var x;
  while (i--) {
    x = kvp[i].split('=');

    if (x[0] == key) {
      x[1] = value;
      kvp[i] = x.join('=');
      break;
    }
  }

  if (i < 0) {
    kvp[kvp.length] = [key, value].join('=');
  }

  //this will reload the page, it's likely better to store this until finished
  document.location.search = kvp.join('&');
}

var enableButton = document.createElement("button");
enableButton.innerText = Utils.getParameterByName("enable") === 'true'
  ? "Disable"
  : "Enable";
enableButton.addEventListener("click", () => {
  if (Utils.getParameterByName("enable") === 'true') {
    insertParam("enable", "false");
  } else {
    insertParam("enable", "true");
  }
})

var focusButton = document.createElement("button");
focusButton.innerText = Utils.getParameterByName("doAll") === 'true'
  ? "Focus Only"
  : "All";
focusButton.addEventListener("click", () => {
  if (Utils.getParameterByName("doAll") === 'true') {
    insertParam("doAll", "false");
  } else {
    insertParam("doAll", "true");
  }
})

document.addEventListener("DOMContentLoaded", () => {
  document.body.insertBefore(enableButton, document.querySelector("ul"));
  document.body.insertBefore(focusButton, enableButton);
  let div = document.createElement('div');
  div.innerText = "Filter: " + Utils.getParameterByName("spec");
  document.body.insertBefore(div, focusButton);
});

if ( Utils.getParameterByName("doAll") !== 'true' ) {
  fdescribe('Force only fdescribe and fit to run', ()=>{

  });
}
