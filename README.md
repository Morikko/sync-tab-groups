# Sync Tab Groups

Sync Tab Groups are an easy way to organize your current tabs depending on a topic. Each open group is synchronized with a window so that all tabs change are saved. Hence, you can close a current tabs-flow while opening another one. 

![Sync Tab Groups example](assets/markdown-img-paste-20171111155549715.png)

# Usage
- Tabs synchronized in group change as they change in your window. (You don't have to save all tabs, open all tabs in bookmark)
- Close a group of tabs and keep it saved (for opening it again later)
- Tabs in closed group are really close, Firefox won't use memory any more for them
- Groups are shared in all windows, and you can easily switch between them from the UI
- Works with private window
- Works with pinned tabs
- Move tabs between groups by drag and dropping
- Set name to your groups
- Undo for closing and removing groups, don't regret easy click ;)
- Groups are saved on your computer, so that you can restore them after quitting Firefox
- A backup of your groups is done in "Other Bookmarks/SyncTabGroups"


# About other Tabs Groups addon

Sync Tab Groups (STG) differs from [Tab Groups](https://addons.mozilla.org/en-US/firefox/addon/tab-groups-panorama/) and [Simplified Tab Groups](https://addons.mozilla.org/en-US/firefox/addon/tab-groups/) (TGs).

- STG uses the new Firefox API
- TGs use the previous and deprecated API
- STG closes the tabs and is synchronized over all windows
- TGs hide/show tabs and is related to a specific window

Due to the new API, I won't be able to add hide/show tabs for improving speed change, neither to restore session when tabs are reopened.

# Future Features
- Keybinding
- Move tabs from menu on right click on tab page

# Languages
English and French. 
I would gladly accept other translations. Add it in `_locales/`, while following the en (English) file. Change message and description parts only.

# Bugs
If you find a bug, please [open an issue](https://github.com/Morikko/sync-tab-groups/issues) or send me an email.

# Thanks
I thank [denschub/firefox-tabgroups](https://github.com/denschub/firefox-tabgroups) for his UI code I reused as a base.
