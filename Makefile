JSX := $(shell find extension -name *.jsx)
JS := $(JSX:%.jsx=%.js)

all: $(JS) zip

js: $(JS)

%.js: %.jsx
	node_modules/babel-cli/bin/babel.js --plugins transform-react-jsx $< > $@

zip: clean
	-mkdir build
	zip -r build/sync-tab-groups.zip extension/* -x extension/tests/\*
	cp build/sync-tab-groups.zip build/sync-tab-groups.xpi

clean:
	-rm build/sync-tab-groups.zip
	-rm build/sync-tab-groups.xpi
