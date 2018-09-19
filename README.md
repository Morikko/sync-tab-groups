# Sync Tab Groups

Sync Tab Groups is an easy way to manage all your tabs. You organize them depending on a topic by group. Groups can be closed and reopened without caring about your session. Moreover, you can easily search, active, move, save and remove your groups and tabs.

Check the [website](https://morikko.github.io/synctabgroups/) for more information (video, explanations, guides...)

[![Try it now on Firefox](https://user-images.githubusercontent.com/7831572/36659929-7ecb2042-1ad6-11e8-82a4-0628702e354e.png)](https://addons.mozilla.org/en-US/firefox/addon/sync-tab-groups/)

[![Try it now on Chrome](https://user-images.githubusercontent.com/7831572/36659935-8402879e-1ad6-11e8-83f7-d645a108696a.png)](https://chrome.google.com/webstore/detail/sync-tab-groups/gbkddinkjahdfhaiifploahejhmaaeoa)
 

# Contributing

I have spent a lot of time on this project, however today I lack time to continue and motivation to work alone on it. Altough, I won't add any new features now, but I might still fix bugs. Else:
 - **I will gladly help and guide anyone willing to maintain and improve the extension**. 
 - **Thus, any PR are welcomed.**
 - **I will mark all the issues I am ready to include in the project**.

The only conditions are:
 - the tests should pass
 - the compatiblity should be kept with the previous features
 - it should work on both Chrome and Firefox (or for new features, not disturbs the incompatible one)

Also, I was thinking of changing the environment before stopping the development: add webpack, switch the shell script to only the npm scripts, use ES Lint... I will accept also those PR.

## Translation
I would gladly accept other translations. Select the link related to your language and translate the different messages. Download the resulting files and send it me (Email) or with a PR.
 - [French](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blobôô/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/2351491da6541038be7db42f3917f04831116f47/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/2351491da6541038be7db42f3917f04831116f47/extension/_locales/fr/messages.json) (v0.6.3)
 - [German](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/v0.6.0/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/v0.6.0/extension/_locales/de/messages.json) (v0.6.0)
 - [Spanish](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/34c72370b945423baafb5550a23b3ace11e44fa6/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/34c72370b945423baafb5550a23b3ace11e44fa6/extension/_locales/es/messages.json) (v0.4.1)
 - [Russian](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/e9caca3ed60c9108a2c53f6b9d92ab3ad5a338f4/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/e9caca3ed60c9108a2c53f6b9d92ab3ad5a338f4/extension/_locales/ru/messages.json) (v0.4.1)
 - [Taiwanese Mandarin](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json&baseoriginal=https://github.com/Morikko/sync-tab-groups/blob/b8750968b21f7dc7f9a4461f2790e0a700764e6a/extension/_locales/en/messages.json&basetarget=https://github.com/Morikko/sync-tab-groups/blob/b8750968b21f7dc7f9a4461f2790e0a700764e6a/extension/_locales/zh_TW/messages.json) (v0.6.5 Partial)
 - [New language](https://morikko.github.io/translate-web-extension/translate?headoriginal=https://github.com/Morikko/sync-tab-groups/blob/master/extension/_locales/en/messages.json) 

# Bugs
If you find a bug, please [open an issue](https://github.com/Morikko/sync-tab-groups/issues).

# Build

## Makefile
- `make js` compile all .jsx -> .js
- `make watch` launch a daemon that compile all .jsx -> js and do it again when you save a .jsx file
- `make watch REBUILD=` Idem as previous but recompile all .jsx files first
- `make stop-watch` kill previous daemon
- `make release` Create the extension in release mode, a zip and a xpi in build/
- `make release CHROME=1` idem but for chrome purpose
- `make` or `make all` Compile all .jsx and export the release
- `make clean` Remove files built in build/ only

## Release mode
1. included scripts are in .production.min.js instead of .development.js
2. Utils.DEBUG_MODE is set to false
3. Extension in build doesn't include
  - .jsx files
  - .development.js libraries
  - tests files
4. ZIP and XPI files are mirror of extension in build/


# Credits
Translation:
 - German (thanks @bitkleberAST)
 - Russian (thanks @Александр)
 - Spanish (thanks @lucas-mancini)
 - Taiwanese Mandarin (thanks @rzfang)
Bootstraped from this project: [denschub/firefox-tabgroups](https://github.com/denschub/firefox-tabgroups)

[Website Repository](https://github.com/Morikko/synctabgroups)

Thank you all of you for helping me improving and fixing the extension :)
