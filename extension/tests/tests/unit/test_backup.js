describe("Download Back Up: ", ()=>{
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  it("Check timers are triggering automatic backup", ()=>{

    jasmine.clock().install();
    // Change setInterval and set this reference to the background
    let savedSetInterval = bg.setInterval;
    bg.setInterval = window.setInterval;

    // Set options
    let optionSave = OptionManager.options.backup;
    OptionManager.options.backup = Utils.getCopy(OptionManager.options.backup);
    OptionManager.options.backup.enable = true;
    OptionManager.options.backup.time = Utils.setObjectPropertiesWith(OptionManager.TIMERS(), false);

    // Spy
    spyOn(StorageManager.Backup, "backup");

    for (let time in OptionManager.TIMERS()) {
      OptionManager.options.backup.time[time] = true;
      StorageManager.Backup.init();
      // Trigger timers
      jasmine.clock().tick(OptionManager.TIMERS()[time]+100);

      expect(StorageManager.Backup.backup).toHaveBeenCalledWith(time.substring(2));

      OptionManager.options.backup.time[time] = false;
    }

    // Reset options
    OptionManager.options.backup = optionSave;
    jasmine.clock().uninstall();
    bg.setInterval = savedSetInterval;
  });
});
