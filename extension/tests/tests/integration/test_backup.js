describe("Download Back Up: ", ()=>{
  // Keep previous states
  beforeAll(TestManager.initIntegrationBeforeAll());
  // Set back previous states
  afterAll(TestManager.initIntegrationAfterAll());

  it("Check timers are triggering automatic backup", ()=>{

    TestManager.installFakeTime();

    // Set options
    let optionSave = OptionManager.options.backup.download;
    OptionManager.options.backup.download = Utils.getCopy(OptionManager.options.backup.download);

    OptionManager.options.backup.download.enable = true;
    OptionManager.options.backup.download.time = Utils.setObjectPropertiesWith(OPTION_CONSTANTS.TIMERS(), false);

    // Spy
    spyOn(ExtensionStorageManager.Backup, "backup");

    for (let time in OPTION_CONSTANTS.TIMERS()) {
      OptionManager.options.backup.download.time[time] = true;
      ExtensionStorageManager.Backup.init();
      // Trigger timers
      jasmine.clock().tick(OPTION_CONSTANTS.TIMERS()[time]);

      expect(ExtensionStorageManager.Backup.backup).toHaveBeenCalledWith(time.substring(2));

      OptionManager.options.backup.download.time[time] = false;
    }

    // Reset options
    backupOption = OptionManager.options.backup.download;
    TestManager.uninstallFakeTime();
  });
});
