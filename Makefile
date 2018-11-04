

DEBUG_VAR:=Utils.DEBUG_MODE=

# Create ZIP and XPI file
release: clean
	cp -r extension/ $(BUILD_DIR)/
	sed -i 's/$(DEBUG_VAR)true;/$(DEBUG_VAR)false;/' $(BUILD_UTIL)
	# Filter undesirable files
	-rm -rf $(BUILD_DIR)/extension/tests
	-rm $(BUILD_JSX)
	-rm $(BUILD_JS_DEV_LIB)
	# Export the result
	cd $(BUILD_DIR)/extension;
	zip -r ../sync-tab-groups.zip *;\
		cd ../../
	cp $(BUILD_DIR)/sync-tab-groups.zip $(BUILD_DIR)/sync-tab-groups.xpi
