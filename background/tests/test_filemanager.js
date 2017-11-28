var TestManager = TestManager || {};

TestManager.import_export = function() {
  this.title = "Import/Export Groups";
  this.groups = [];
  this.windowId = browser.windows.WINDOW_ID_NONE;

  this.return_result = function(code, msg = "") {
    return TestManager.Results(
      code,
      this.title,
      msg, {
        groups: this.groups
      }
    )
  };

  this.test = async function() {
    try {
      await this.set();

      // Import Tab Groups without session
      this.groups = StorageManager.File.importGroups(
        Examples.tabGroups_2w_3g
      );

      if ( !TestManager.compareGroups(
         this.groups,
         Examples.importedGroups
      ) ){
        return this.return_result(TestManager.ERROR, "Can't Import Tab Groups without session");
      }

      // Import Tab Groups with session
      this.groups = StorageManager.File.importGroups(
        Examples.tabGroups_2w_3g_session
      );

      if ( !TestManager.compareGroups(
         this.groups,
         Examples.importedGroups
      ) ){
        return this.return_result(TestManager.ERROR, "Can't Import Tab Groups with session");
      }

      // Import Sync Tab Groups
      this.groups = StorageManager.File.importGroups(
        Examples.syncTabGroups_2w_3g
      );

      if ( !TestManager.compareGroups(
         this.groups,
         Examples.importedGroups
      ) ){
        return this.return_result(TestManager.ERROR, "Can't Import Sync Tab Groups");
      }

      return this.return_result(TestManager.DONE);
    } catch (e) {
      return this.return_result(TestManager.ERROR, "Error in function: " + e);
    }
  }

  this.set = async function() {

  }
}

TestManager.FileManager.push(TestManager.import_export);
