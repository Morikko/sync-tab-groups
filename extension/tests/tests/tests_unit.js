

describe("Search Function: ", ()=>{

  it("Single keyword NOT found", ()=>{
    expect(
      Utils.search("coucou les amis", "dd")
    ).toBe(false);
  });

  it("Single keyword found", ()=>{
    expect(
      Utils.search("coucou les amis", "cou")
    ).toBe(true);
  });

  it("Multiple keywords found", ()=>{
    expect(
      Utils.search("coucou les amis", "cou les")
    ).toBe(true);
  });

  it("Multiple keywords NOT found", ()=>{
    expect(
      Utils.search("coucou les amis", "cou du")
    ).toBe(false);
  });

  it("Not Case Sensitive", ()=>{
    expect(
      Utils.search("coucou les amis", "CoU")
    ).toBe(true);
  });

  it("Accept Symbols", ()=>{
    expect(
      Utils.search("coucou les @mis", "@mis")
    ).toBe(true);
  });

  it("Accept special caracters", ()=>{
    expect(
      Utils.search("Je m'appelle éric", "m'a eric")
    ).toBe(true);
  });
});

describe("Extract Group Search: ", function() {
  // Extract search value
  let groupList = new GroupList({});

  it("Group and tab", ()=>{
    [groupSearch, tabSearch] = groupList.extractSearchValue("g/text coucou/grow throw");
    expect(groupSearch).toBe("text coucou");
    expect(tabSearch).toBe("grow throw");
  });

  it("Group only", ()=>{
    [groupSearch, tabSearch] = groupList.extractSearchValue("g/text coucou/");
    expect(groupSearch).toBe("text coucou");
    expect(tabSearch).toBe("");
  });

  it("Group only without last separator", ()=>{
    [groupSearch, tabSearch] = groupList.extractSearchValue("g/text coucou");
    expect(groupSearch).toBe("text coucou");
    expect(tabSearch).toBe("");
  });

  it("Tab only", ()=>{
    [groupSearch, tabSearch] = groupList.extractSearchValue("grow throw");
    expect(groupSearch).toBe("");
    expect(tabSearch).toBe("grow throw");
  });
});
