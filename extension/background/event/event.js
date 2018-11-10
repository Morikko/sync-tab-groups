import CommandsEvent from './commands'
import InstallEvents from './install'
import ExtensionEvents from './extension'
import TabsEvents from './tabs'
import WindowsEvents from './windows'

const Events = {
  Commands: CommandsEvent,
  Install: InstallEvents,
  Extension: ExtensionEvents,
  Tabs: TabsEvents,
  Windows: WindowsEvents,
}

window.Events = Events

export default Events