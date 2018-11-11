import * as getTabs from './getTabs'
import * as moveTabs from './moveTabs'
import * as openTabs from './openTabs'
import * as removeTabs from './removeTabs'
import * as undiscardTabs from './undiscardTabs'
import * as updateTabs from './updateTabs'
import * as utilsTabs from './utilsTabs'

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