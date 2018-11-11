import Utils from '../../background/utils/utils'
import {waitInit} from '../utils/Background'

let queryString = new jasmine.QueryString({
  getWindowLocation: function() {
    return window.location;
  },
});

let specFilter = new jasmine.HtmlSpecFilter({
  filterString: function() {
    if (Utils.getParameterByName("enable") !== 'true') {
      return "@@@@@@@";
    } else {
      return queryString.getParam("spec")
    }
  },
});


let env = jasmine.getEnv();

env.specFilter = function(spec) {
  return specFilter.matches(spec.getFullName());
};

let currentWindowOnload = window.onload;

window.onload = async function() {
  await waitInit;

  if (currentWindowOnload) {
    currentWindowOnload();
  }
};

function insertParam(key, value) {
  key = encodeURI(key);
  value = encodeURI(value);

  let kvp = document.location.search.substr(1).split('&');

  let i = kvp.length;
  let x;
  while (i--) {
    x = kvp[i].split('=');

    if (x[0] === key) {
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

let enableButton = document.createElement("button");
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

let focusButton = document.createElement("button");
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