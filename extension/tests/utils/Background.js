let Background

let waitInit = (async() => {
  Background = await browser.runtime.getBckgroundPage();
})()

export {
  waitInit,
  Background,
}