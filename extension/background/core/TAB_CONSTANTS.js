// TODO: use global isChrome
const isChrome = () => browser.runtime.getBrowserInfo == null;

const TAB_CONSTANTS = {
  NEW_TAB: (isChrome()?"chrome://newtab/":"about:newtab"),
}

export default TAB_CONSTANTS