import getTabs from './getTabs'
import moveTabs from './moveTabs'
import openTabs from './openTabs'
import removeTabs from './removeTabs'
import undiscardTabs from './undiscardTabs'
import updateTabs from './updateTabs'
import utilsTabs from './utilsTabs'

const TabManager = {
  ...getTabs,
  ...moveTabs,
  ...openTabs,
  ...removeTabs,
  ...undiscardTabs,
  ...updateTabs,
  ...utilsTabs,
}
window.TabManager = TabManager;

export default TabManager