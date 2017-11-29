# Sync Tab Groups

Sync Tab Groups are an easy way to organize your current tabs depending on a topic. Each open group is synchronized with a window so that all tabs change are saved. Hence, you can close a current tabs-flow while opening another one. 

![Sync Tab Groups example](assets/markdown-img-paste-20171111155549715.png)

# Usage

## Groups
- Tabs are synchronized in your groups as they are in your windows 
- Close a group of tabs and keep it saved (for opening it again later)
- Use your groups among all your windows
- Tabs in closed group are REALLY close (See limitations)

## Menu

### From toolbar
- Open a group 
  - In your current window
  - In a new window directly
- Click on a group/tab already opened to focus it in your screen
- Move tabs between groups by drag and dropping (Create new group included)
- Change name of your groups
- Undo for closing and removing groups, don't regret easy click ;)
- Close/Open tabs from the UI

## Private Windows
 - Synchronization: (either) (See extension settings)
   - Like any windows (default)
   - Invisible in groups 
 - Option: Remove a group automatically when closed (See extension settings)

## Pinned Tabs
 - Synchronization: (either) (See extension settings)
   - Like any tabs (default)
   - Keep in the window and not part of a group (Tab Groups behavior)

## Save
- Groups are saved on your computer, you find them back after restarting Firefox
- A backup of your groups is done in "Other Bookmarks/SyncTabGroups"
- Import/Export groups from
  - Sync Tab Groups extension
  - Tab Groups extension (Import only)

## Important limitations
Due to the API, I won't be able to add hide/show tabs or keep tabs unloaded:
 - Switching can be slow (overall with lots of tabs)
 - Previous sessions (back button) are lost when closing a group
 - Temporary data like forms are lost when closing a group
 - All tabs are loaded when a group is opened (Will be fixed with Firefox 58 on January) ([More info](https://github.com/Morikko/sync-tab-groups/issues/5#issuecomment-344753295))

# About other Tabs Groups addon

Sync Tab Groups (STG) differs from [Tab Groups](https://addons.mozilla.org/en-US/firefox/addon/tab-groups-panorama/) and [Simplified Tab Groups](https://addons.mozilla.org/en-US/firefox/addon/tab-groups/) (TGs).

- Groups are not shared with the other extension: before switching 
- STG uses the new Firefox API whereas TGs use the previous and deprecated one
- STG closes the tabs and is synchronized over all windows
- TGs hide/show tabs and is related to a specific window

# Future Features
- Keybinding
- Move tabs from menu on right click on tab page
[And many more...](https://github.com/Morikko/sync-tab-groups/issues)

# Languages
English and French. 
I would gladly accept other translations. Add it in `_locales/`, while following the en (English) file. Change message and description parts only.

# Bugs
If you find a bug, please [open an issue](https://github.com/Morikko/sync-tab-groups/issues) or send me an email.

# Thanks
Thank you all of you for helping me improving and fixing the extension :)

I thank [denschub/firefox-tabgroups](https://github.com/denschub/firefox-tabgroups) for his UI code I reused as a base.
