# The project is no more maintained

Although I used it a lot, I feel less and less need for such an advanced way to manage my tabs. Aside from my full-time job, I have not much time left to put in this project. 

Even, if this project ends, I thank all of you that used the extension or helped me to make this extension so great.

The project remains:
 - Available: you continue to use it
 - Open-source: you are free to fork it or reuse the code

Alternatives:
- Firefox: [Simple Tab Groups](https://addons.mozilla.org/en-US/firefox/addon/simple-tab-groups/)
  - Actively maintained and with more features
  - But no more pinned tabs inside groups and the double window to manage the tabs 
- Chrome: nothing I am aware of

If you are curious about the experience of developing an open-source extension, you will enjoy [the article about Sync Tab Groups](https://medium.com/@Morikko/the-story-of-sync-tab-groups-the-web-extension-for-managing-your-tabs-d40ebb1079ec).


# Sync Tab Groups

Sync Tab Groups is an easy way to manage all your tabs. You organize them depending on a topic by group. Groups can be closed and reopened without caring about your session. Moreover, you can easily search, active, move, save and remove your groups and tabs.

Check the [website](https://morikko.github.io/synctabgroups/) for more information (video, explanations, guides...)

[![Try it now on Firefox](https://user-images.githubusercontent.com/7831572/36659929-7ecb2042-1ad6-11e8-82a4-0628702e354e.png)](https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/)

[![Try it now on Chrome](https://user-images.githubusercontent.com/7831572/36659935-8402879e-1ad6-11e8-83f7-d645a108696a.png)](https://chrome.google.com/webstore/detail/sync-tab-groups/gbkddinkjahdfhaiifploahejhmaaeoa)
 

# Contributing

 - **I will gladly help and guide anyone willing to maintain and improve the extension**. 
 - **Thus, any PR are welcomed.**
 - **I will mark all the issues I am ready to include in the project**.

The only conditions are:
 - the tests should pass
 - the lint should have no error
 - the compatibility should be kept with the previous features
 - it should work on both Chrome and Firefox (or for specific browser features, it should not disturb the incompatible browser)


## Translation
I would gladly accept other translations. Select the link related to your language and translate the different messages. Download the resulting files and send it me (Email) or with a PR.
 - [French](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blobôô/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/2351491da6541038be7db42f3917f04831116f47/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/2351491da6541038be7db42f3917f04831116f47/extension/_locales/fr/messages.json) (v0.6.3)
 - [German](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/v0.6.0/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/v0.6.0/extension/_locales/de/messages.json) (v0.6.0)
 - [Spanish](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/94208ab87efa8cb9ed39a2756d6f1ec9a2b8f6b4/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/94208ab87efa8cb9ed39a2756d6f1ec9a2b8f6b4/extension/_locales/es/messages.json) (v0.7.1)
 - [Russian](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/e9caca3ed60c9108a2c53f6b9d92ab3ad5a338f4/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/e9caca3ed60c9108a2c53f6b9d92ab3ad5a338f4/extension/_locales/ru/messages.json) (v0.4.1)
 - [Taiwanese Mandarin](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/b8750968b21f7dc7f9a4461f2790e0a700764e6a/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/b8750968b21f7dc7f9a4461f2790e0a700764e6a/extension/_locales/zh_TW/messages.json) (v0.6.5 Partial)
 - [New language](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json) 

# Bugs
If you find a bug, please [open an issue](https://github.com/Morikko/sync-tab-groups/issues).

# Build

## External dependencies
 - Node >= 8
 - Firefox Dev Edition (if you want to use web-ext)

## Scripts (with `npm run`)
- `build` the extension in dev mode is built to the `build/` folder
- `watch` Same than the `build` command but recompile the modified files
- `build:prod` the extension ready for production is built to the `release/build/` folder
- `zip`  Create the `XPI` and `ZIP` files in `release/` from the production build
- `release` Do the `build:prod` and `zip` commands
- `lint` show only errors
- `clean` Remove the folders `build/` and `release/`
- `firefox:dev` run firefox loaded with the dev extension
- `firefox:prod` run firefox loaded with the production extension

## Difference between mode
1. `process.env.IS_PROD` is only true in the production code, so `Utils.DEBUG_MODE` is true only in the dev code
2. Tests are only built in the dev version
3. ZIP and XPI files are the same than `release/build/`


# Credits
Translation:
 - German (thanks @bitkleberAST)
 - Russian (thanks @Александр)
 - Spanish (thanks [@lucas-mancini](https://github.com/lucas-mancini/))
 - Taiwanese Mandarin (thanks @rzfang)
 - French (thanks @ko-dever)
 
[Website Repository](https://github.com/Morikko/synctabgroups)

Thank you all of you for helping me improving and fixing the extension :)
