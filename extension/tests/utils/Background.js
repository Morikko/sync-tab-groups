let Background

let waitInit = (async() => {
  Background = await browser.runtime.getBackgroundPage();
  window.Background = Background
})()

export {Background, waitInit}