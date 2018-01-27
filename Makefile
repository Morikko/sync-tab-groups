REBUILD=--skip-initial-build
WATCH_COMMAND=npx babel extension -x ".jsx" --watch --plugins transform-react-jsx --out-dir extension
BUILD_DIR:=build

JSX:=$(shell find extension -name *.jsx)
BUILD_JSX:=$(JSX:%=$(BUILD_DIR)/%)
HTML:=$(shell find extension -name *.html)
BUILD_HTML:=$(HTML:%=$(BUILD_DIR)/%)
UTIL:=$(shell find extension -name utils.js)
BUILD_UTIL:=$(UTIL:%=$(BUILD_DIR)/%)
JS_DEV_LIB:=$(shell find extension -name *.development.js)
BUILD_JS_DEV_LIB:=$(JS_DEV_LIB:%=$(BUILD_DIR)/%)
JS := $(JSX:%.jsx=%.js)

DEBUG_VAR:=Utils.DEGUG_MODE=


all: $(JS) release

# Compile all jsx -> js that are not up to date
js: $(JS)

%.js: %.jsx
	npx babel --plugins transform-react-jsx $<  --out-file $@

# Launch background script for compiling jsx at each change
# `make watch REBUILD=` if you want to compile again all jsx files
watch: stop-watch
	$(WATCH_COMMAND) $(REBUILD)&

# Stop all previous background script
stop-watch:
	-kill -9 `pgrep -f "$(WATCH_COMMAND)"`

# Create ZIP and XPI file
release: clean
	-mkdir build
	cp -r extension/ $(BUILD_DIR)/
	# Change some code for the release
	sed -i 's/.development./.production.min./g' $(BUILD_HTML)
	# Filter undesirable files
	-rm -rf $(BUILD_DIR)/extension/tests
	-rm $(BUILD_JSX)
	-rm $(BUILD_JS_DEV_LIB)
	# Export the result
	cd $(BUILD_DIR)/extension;zip -r ../sync-tab-groups.zip *;\
		cd ../../
	cp $(BUILD_DIR)/sync-tab-groups.zip $(BUILD_DIR)/sync-tab-groups.xpi

test:
	echo $(BUILD_JS_DEV_LIB)

clean:
	-rm $(BUILD_DIR)/sync-tab-groups.zip
	-rm $(BUILD_DIR)/sync-tab-groups.xpi
	-rm -rf $(BUILD_DIR)/extension
