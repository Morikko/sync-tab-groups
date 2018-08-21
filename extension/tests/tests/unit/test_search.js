describe("Search: ", () => {
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  describe("Results: ", () => {

    it("Single keyword NOT found", () => {
      expect(Utils.search("coucou les amis", "dd")).toBe(false);
    });

    it("Single keyword found", () => {
      expect(Utils.search("coucou les amis", "cou")).toBe(true);
    });

    it("Multiple keywords found", () => {
      expect(Utils.search("coucou les amis", "cou les")).toBe(true);
    });

    it("Multiple keywords NOT found", () => {
      expect(Utils.search("coucou les amis", "cou du")).toBe(false);
    });

    it("Not Case Sensitive", () => {
      expect(Utils.search("coucou les amis", "CoU")).toBe(true);
    });

    it("Accept Symbols", () => {
      expect(Utils.search("coucou les @mis", "@mis")).toBe(true);
    });

    it("Accept special caracters", () => {
      expect(Utils.search("Je m'appelle éric", "m'a eric")).toBe(true);
    });
  });

  describe("Split Search in Group/Tab: ", function() {
    // Extract search value

    it("Group and tab", () => {
      [groupSearch, tabSearch] = Utils.extractSearchValue("g/text coucou/grow throw");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("grow throw");
    });

    it("Group only", () => {
      [groupSearch, tabSearch] = Utils.extractSearchValue("g/text coucou/");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("");
    });

    it("Group only without last separator", () => {
      [groupSearch, tabSearch] = Utils.extractSearchValue("g/text coucou");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("");
    });

    it("Tab only", () => {
      [groupSearch, tabSearch] = Utils.extractSearchValue("grow throw");
      expect(groupSearch).toBe("");
      expect(tabSearch).toBe("grow throw");
    });
  });
})
