let Background

let waitInit = (async() => {
  Background = await browser.runtime.getBackgroundPage();
  window.Background = Background
  console.log("Get background");
})()

export {Background, waitInit}