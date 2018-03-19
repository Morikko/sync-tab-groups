describe("Comparator: ", ()=>{
  beforeAll(TestManager.initUnitBeforeAll());
  beforeEach(TestManager.initBeforeEach());

  it("toEqualTabs", ()=>{
    let tabs = Session.createTabs({tabsLength: 7, pinnedTabs: 2});

    expect(tabs).toEqualTabs(tabs);

    let alter_tabs = Session.createTabs(
      {tabsLength: 7, pinnedTabs: 2}
    );

    expect(tabs).not.toEqualTabs(alter_tabs);

    expect(undefined).not.toEqualTabs(tabs);
    expect(tabs).not.toEqualTabs(undefined);
  })

  it("toEqualGroup", ()=>{
    let groups = Session.createGroup({tabsLength: 7, pinnedTabs: 2, incognito: false});
    expect(groups).toEqualGroup(groups);

    let groups_alter = Utils.getCopy(groups);
    groups_alter.incognito = true;

    let groups_alter_tabs = Utils.getCopy(groups);
    groups_alter_tabs.tabs = Session.createTabs(
      {tabsLength: 7, pinnedTabs: 2}
    );

    expect(groups).not.toEqualGroup(groups_alter);
    expect(groups).not.toEqualGroup(groups_alter_tabs);

    expect(undefined).not.toEqualGroup(groups);
    expect(groups).not.toEqualGroup(undefined);
  });

  it("toEqualGroups", ()=>{
    // TODO
  });

});
