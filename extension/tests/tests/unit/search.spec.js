import TestManager from '../../utils/TestManager'

describe("Search: ", () => {
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  describe("Results: ", () => {

    it("Single keyword NOT found", () => {
      expect(window.Background.Utils.search("coucou les amis", "dd")).toBe(false);
    });

    it("Single keyword found", () => {
      expect(window.Background.Utils.search("coucou les amis", "cou")).toBe(true);
    });

    it("Multiple keywords found", () => {
      expect(window.Background.Utils.search("coucou les amis", "cou les")).toBe(true);
    });

    it("Multiple keywords NOT found", () => {
      expect(window.Background.Utils.search("coucou les amis", "cou du")).toBe(false);
    });

    it("Not Case Sensitive", () => {
      expect(window.Background.Utils.search("coucou les amis", "CoU")).toBe(true);
    });

    it("Accept Symbols", () => {
      expect(window.Background.Utils.search("coucou les @mis", "@mis")).toBe(true);
    });

    it("Accept special caracters", () => {
      expect(window.Background.Utils.search("Je m'appelle éric", "m'a eric")).toBe(true);
    });
  });

  describe("Split Search in Group/Tab: ", function() {
    // Extract search value

    it("Group and tab", () => {
      const [groupSearch, tabSearch] = window.Background.Utils.extractSearchValue("g/text coucou/grow throw");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("grow throw");
    });

    it("Group only", () => {
      const [groupSearch, tabSearch] = window.Background.Utils.extractSearchValue("g/text coucou/");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("");
    });

    it("Group only without last separator", () => {
      const [groupSearch, tabSearch] = window.Background.Utils.extractSearchValue("g/text coucou");
      expect(groupSearch).toBe("text coucou");
      expect(tabSearch).toBe("");
    });

    it("Tab only", () => {
      const [groupSearch, tabSearch] = window.Background.Utils.extractSearchValue("grow throw");
      expect(groupSearch).toBe("");
      expect(tabSearch).toBe("grow throw");
    });
  });
})
