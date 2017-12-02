all:
	zip -r sync-tab-groups.zip * -x assets/\*

clean:
	rm sync-tab-groups.zip
