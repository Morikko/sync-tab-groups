REBUILD=--skip-initial-build
WATCH_COMMAND=npx babel extension -x ".jsx" --watch --plugins transform-react-jsx --out-dir extension
JSX := $(shell find extension -name *.jsx)
JS := $(JSX:%.jsx=%.js)

all: $(JS) zip

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
	kill -9 `pgrep -f "$(WATCH_COMMAND)"`

# Create ZIP and XPI file
release: clean
	-mkdir build
	zip -r build/sync-tab-groups.zip extension/* -x extension/tests/\*
	cp build/sync-tab-groups.zip build/sync-tab-groups.xpi

clean:
	-rm build/sync-tab-groups.zip
	-rm build/sync-tab-groups.xpi
