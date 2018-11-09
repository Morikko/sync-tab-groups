let Background

let waitInit = (async() => {
  Background = await browser.runtime.getBackgroundPage();
})()

export { waitInit }
export default Background