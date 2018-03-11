describe("Controller ", ()=>{

  beforeAll(()=>{
    jasmine.addMatchers(tabGroupsMatchers);
  });

  describe("Update ", ()=>{
    describe("Utils ", ()=>{
        it("isVersionBelow", ()=>{
          expect(
            Controller.isVersionBelow("0.1.2", "1.2.3")
          ).toBe(true);

          expect(
            Controller.isVersionBelow("1.1.2", "1.2.3")
          ).toBe(true);

          expect(
            Controller.isVersionBelow("1.2.2", "1.2.3")
          ).toBe(true);

          expect(
            Controller.isVersionBelow("1.2.3", "1.2.3")
          ).toBe(true);

          expect(
            Controller.isVersionBelow("2.2.3", "1.2.3")
          ).toBe(false);

          expect(
            Controller.isVersionBelow("1.3.3", "1.2.3")
          ).toBe(false);

          expect(
            Controller.isVersionBelow("1.2.4", "1.2.3")
          ).toBe(false);
        });
    });

    describe("Update well ", ()=>{

      it("V0.6.2 -> ^0.6.2", ()=>{
        const
          enable = true,
          time = {
            a: "b",
            c: "d",
          },
          options = {
            backup: {
              enable: true,
              time: time,
            }
        };

        Controller.updateFromBelow_0_6_2(
          options
        );

        expect(options.backup.hasOwnProperty("enable")).toBe(false);
        expect(options.backup.hasOwnProperty("time")).toBe(false);

        expect(options.backup.download.hasOwnProperty("enable")).toBe(true);
        expect(options.backup.download.hasOwnProperty("time")).toBe(true);

        expect(options.backup.download.enable).toEqual(enable);
        expect(options.backup.download.time).toEqual(time);
      });
    })
  });
});
