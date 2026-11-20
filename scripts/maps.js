// =========================================================
// scripts/maps.js — Overworld, 5 Interiors, Dream Realm,
//                   Limbach Park, Casa Grande, Yard Signs & NPC Routines
// =========================================================
window.Maps = (() => {
  function makeRoom(w, h, floorType = "wood") {
    const grid = [];
    for (let y = 0; y < h; y++) {
      const row = [];
      for (let x = 0; x < w; x++) {
        if (y === 0 || y === 1 || y === h - 1 || x === 0 || x === w - 1) row.push(1);
        else row.push(0);
      }
      grid.push(row);
    }
    return { w, h, floorType, grid };
  }

  function buildOverworld() {
    const w = 26, h = 20;
    const grid = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => (x === 0 || y === 0 || x === w - 1 || y === h - 1) ? 2 : 0)
    );
    for (let x = 3; x <= 22; x++) { grid[9][x] = 3; grid[10][x] = 3; }
    for (let y = 5; y <= 15; y++) { grid[y][12] = 3; grid[y][13] = 3; }
    for (let y = 6; y <= 9; y++) { grid[y][5] = 3; grid[y][19] = 3; }
    for (let y = 10; y <= 13; y++) { grid[y][5] = 3; grid[y][19] = 3; }

    const trees = [
      { tx: 1, ty: 1, kind: "pine" }, { tx: 2, ty: 1, kind: "oak" },
      { tx: 9, ty: 2, kind: "pine" }, { tx: 10, ty: 2, kind: "oak" },
      { tx: 15, ty: 2, kind: "pine" }, { tx: 23, ty: 2, kind: "oak" },
      { tx: 24, ty: 4, kind: "pine" }, { tx: 1, ty: 7, kind: "oak" },
      { tx: 2, ty: 11, kind: "pine" }, { tx: 9, ty: 17, kind: "oak" },
      { tx: 16, ty: 17, kind: "pine" }, { tx: 23, ty: 11, kind: "oak" },
      { tx: 24, ty: 16, kind: "pine" }, { tx: 2, ty: 17, kind: "oak" }
    ];
    trees.forEach(t => { grid[t.ty][t.tx] = 2; });

    const buildings = [
      { id: "church", style: "church", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "church", destX: 7, destY: 9 },
      { id: "house", style: "house", tx: 17, ty: 3, tw: 5, th: 3, doorTx: 19, doorTy: 5, dest: "house", destX: 7, destY: 9 },
      { id: "hospital", style: "hospital", tx: 3, ty: 12, tw: 5, th: 3, doorTx: 5, doorTy: 14, dest: "hospital", destX: 7, destY: 9 },
      { id: "bookstore", style: "bookstore", tx: 10, ty: 14, tw: 5, th: 3, doorTx: 12, doorTy: 16, dest: "bookstore", destX: 7, destY: 9 },
      { id: "party", style: "party", tx: 17, ty: 12, tw: 5, th: 3, doorTx: 19, doorTy: 14, dest: "party", destX: 7, destY: 9 }
    ];

    buildings.forEach(b => {
      for (let yy = b.ty; yy < b.ty + b.th; yy++) {
        for (let xx = b.tx; xx < b.tx + b.tw; xx++) {
          grid[yy][xx] = (xx === b.doorTx && yy === b.doorTy) ? 4 : 1;
        }
      }
    });

    // Physical readable Signposts out front of buildings!
    const signs = [
      { tx: 7, ty: 6, text: "St. Jude Catholic Church — Memorial Service for the Huesic Family." },
      { tx: 17, ty: 6, text: "Menos Residence (412 Starlight Ln) — Jacob & Dr. Menos's Home." },
      { tx: 7, ty: 15, text: "Colorado Springs Medical Center — Step inside anytime for free healing!" },
      { tx: 14, ty: 17, text: "Barnes & Noble Booksellers — Featuring local children's classic 'Twilight Fireflies'." },
      { tx: 17, ty: 15, text: "Classmate's House — Bass-heavy party music is rattling the windows!" },
      { tx: 14, ty: 3, text: "North Trail to Limbach Park — Strange chills linger here after dark..." }
    ];
    signs.forEach(s => { grid[s.ty][s.tx] = 1; });

    return {
      id: "overworld",
      name: "Colorado Springs",
      w, h, floorType: "grass", grid, trees, buildings, signs, props: [],
      portals: [
        { tx: 12, ty: 2, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 7, destY: 9, minQuest: 6 }
      ],
      npcs: [
        {
          id: "crista", tx: 16, ty: 7, dir: "down", minQuest: 5, maxQuest: 13,
          routine: { type: "patrol", points: [[16, 7], [18, 7], [18, 8], [16, 8]], speed: 24, pause: 1.8 },
          dialogue: [{ id: "crista", mood: "happy", text: "Meow~ (The platinum cat playfully prowls Jacob's front lawn, watching the road with sharp blue eyes.)" }]
        },
        {
          id: "letonin", tx: 12, ty: 8, dir: "down", minQuest: 14, maxQuest: 20, event: "epilogueReunion",
          routine: { type: "patrol", points: [[11, 8], [13, 8]], speed: 26, pause: 2.2 }
        },
        {
          id: "cyrine", tx: 14, ty: 8, dir: "left", minQuest: 14, maxQuest: 20, event: "epilogueReunion"
        }
      ]
    };
  }

  // JACOB'S HOUSE — Living, Breathing NPCs!
  function buildHouse() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[4][2] = 1; r.grid[4][3] = 1; r.grid[4][4] = 1;
    r.grid[3][12] = 1; r.grid[3][13] = 1; r.grid[4][12] = 1; r.grid[4][13] = 1;
    r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1; r.grid[2][9] = 1;

    return {
      ...r, id: "house", name: "Jacob's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 7 }],
      props: [
        { kind: "rug", tx: 2, ty: 5, tw: 4, th: 3, color: "#312e81", inner: "#4338ca" },
        { kind: "couch", tx: 2, ty: 4, interact: "sleep", label: "Jacob's Couch" },
        { kind: "tv", tx: 3, ty: 8 },
        { kind: "kitchen_counter", tx: 6, ty: 2 },
        { kind: "bed", tx: 12, ty: 3, interact: "sleep", label: "Jacob's Bed" },
        { kind: "bookshelf", tx: 10, ty: 2 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        {
          id: "navi", tx: 7, ty: 3, dir: "up", event: "naviHouse",
          activity: "cook",
          routine: { type: "patrol", points: [[6, 3], [9, 3]], speed: 24, pause: 2.4, faceAtStop: "up" }
        },
        {
          id: "cyrine", tx: 10, ty: 5, dir: "left",
          routine: { type: "patrol", points: [[10, 4], [10, 7], [8, 7]], speed: 22, pause: 2.6 },
          dialogue: [{ id: "cyrine", mood: "neutral", text: "I'm just organizing my things... You should rest on the couch or your bed, Jacob." }]
        },
        {
          id: "mom", tx: 5, ty: 7, dir: "right",
          routine: { type: "patrol", points: [[5, 7], [8, 8], [5, 8]], speed: 22, pause: 2.5 },
          dialogue: [{ id: "mom", mood: "happy", text: "Navi's brunch smells heavenly! Make sure you get real sleep, Jacob—you've been up way too late." }]
        },
        {
          id: "crista", tx: 3, ty: 6, dir: "down", minQuest: 5, maxQuest: 13, event: "snowCatCrista",
          routine: { type: "patrol", points: [[2, 6], [5, 6]], speed: 20, pause: 2.0 }
        }
      ]
    };
  }

  function buildChurch() {
    const r = makeRoom(16, 12, "stone");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let x = 2; x <= 4; x++) { r.grid[5][x] = 1; r.grid[7][x] = 1; }
    for (let x = 11; x <= 13; x++) { r.grid[5][x] = 1; r.grid[7][x] = 1; }
    return {
      ...r, id: "church", name: "St. Jude Church", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 7 }],
      props: [
        { kind: "rug", tx: 6, ty: 3, tw: 4, th: 7, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "altar", tx: 6, ty: 2 },
        { kind: "pew", tx: 2, ty: 5 }, { kind: "pew", tx: 2, ty: 7 },
        { kind: "pew", tx: 11, ty: 5 }, { kind: "pew", tx: 11, ty: 7 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [{ id: "cyrine", tx: 7, ty: 4, dir: "up", event: "churchCyrine" }]
    };
  }

  function buildHospital() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[4][2] = 1; r.grid[3][12] = 1; r.grid[4][12] = 1;
    return {
      ...r, id: "hospital", name: "Colorado Springs Hospital", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 16 }],
      props: [
        { kind: "hospital_bed", tx: 2, ty: 3 }, { kind: "hospital_bed", tx: 12, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [{
        id: "mom", tx: 7, ty: 4, dir: "down", event: "hospitalHeal",
        routine: { type: "patrol", points: [[5, 4], [10, 4]], speed: 24, pause: 2.2 }
      }]
    };
  }

  function buildBookstore() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][11] = 1; r.grid[3][12] = 1;
    return {
      ...r, id: "bookstore", name: "Barnes & Noble", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 12, destY: 18 }],
      props: [
        { kind: "rug", tx: 5, ty: 4, tw: 6, th: 4, color: "#14532d", inner: "#166534" },
        { kind: "bookshelf", tx: 2, ty: 3 }, { kind: "bookshelf", tx: 11, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [{
        id: "illicero", tx: 7, ty: 5, dir: "down", activity: "vape",
        routine: { type: "patrol", points: [[5, 5], [9, 5], [9, 6]], speed: 24, pause: 2.4 },
        dialogue: [{ id: "illicero", mood: "happy", text: "You really DO hang out at Barnes & Noble, Jacob! 'Twilight Fireflies' is on the top shelf—the red and yellow spirits feel oddly familiar." }]
      }]
    };
  }

  function buildParty() {
    const r = makeRoom(16, 12, "party");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][4] = 1;
    return {
      ...r, id: "party", name: "Classmate's Party House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 16 }],
      props: [
        { kind: "party_table", tx: 2, ty: 3 }, { kind: "party_table", tx: 11, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "sendex", tx: 7, ty: 4, dir: "down", maxQuest: 4, event: "partyBattle" },
        { id: "navi", tx: 5, ty: 6, dir: "up", maxQuest: 5, dialogue: [{ id: "navi", mood: "intense", text: "Stay behind me, Jacob—Sendex is right ahead!" }] },
        { id: "illicero", tx: 9, ty: 6, dir: "up", maxQuest: 5, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Relax, kid. Navi and I have your back." }] },
        { id: "cyrine", tx: 12, ty: 7, dir: "left", activity: "dance", dialogue: [{ id: "cyrine", mood: "happy", text: "Come on Jacob, live a little! The music's awesome!" }] }
      ]
    };
  }

  // DREAM REALM — SAFE SPAWN at (7, 8) away from Wake Portal at (7, 10)!
  function buildDream() {
    const r = makeRoom(16, 12, "dream");
    const trees = [
      { tx: 2, ty: 2, kind: "cherry" }, { tx: 13, ty: 2, kind: "cherry" },
      { tx: 2, ty: 8, kind: "cherry" }, { tx: 13, ty: 8, kind: "cherry" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });
    return {
      ...r, id: "dream", name: "Letonin's Dream Realm", trees, buildings: [], signs: [], exits: [],
      portals: [
        { tx: 7, ty: 10, style: "dream", label: "WAKE UP", dest: "house", destX: 5, destY: 6 }
      ],
      props: [],
      npcs: [{ id: "letonin", tx: 7, ty: 4, dir: "down", event: "dreamLetonin" }]
    };
  }

  function buildPark() {
    const r = makeRoom(16, 13, "park");
    const trees = [
      { tx: 2, ty: 2, kind: "pine" }, { tx: 3, ty: 2, kind: "pine" },
      { tx: 12, ty: 2, kind: "pine" }, { tx: 13, ty: 2, kind: "pine" },
      { tx: 2, ty: 9, kind: "pine" }, { tx: 13, ty: 9, kind: "pine" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });
    return {
      ...r, id: "park", name: "Limbach Park (Purgatorio)", trees, buildings: [], signs: [], exits: [],
      portals: [
        { tx: 7, ty: 11, style: "purgatorio", label: "TO TOWN", dest: "overworld", destX: 12, destY: 4 },
        { tx: 12, ty: 5, style: "bloodmoon", label: "CASA GRANDE", dest: "fortress", destX: 7, destY: 9, minQuest: 9 }
      ],
      props: [],
      npcs: [
        { id: "letonin", tx: 7, ty: 5, dir: "down", maxQuest: 8, event: "parkAction" },
        { id: "sendex", tx: 5, ty: 4, dir: "down", maxQuest: 7, event: "parkAction" },
        { id: "death", tx: 4, ty: 6, dir: "right", minQuest: 8, event: "deathStory" }
      ]
    };
  }

  function buildFortress() {
    const r = makeRoom(16, 13, "desert");
    const trees = [
      { tx: 2, ty: 3, kind: "cactus" }, { tx: 13, ty: 3, kind: "cactus" },
      { tx: 2, ty: 9, kind: "cactus" }, { tx: 13, ty: 9, kind: "cactus" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });
    return {
      ...r, id: "fortress", name: "Casa Grande Fortress (Blood Moon)", trees, buildings: [], signs: [], exits: [],
      portals: [
        { tx: 7, ty: 11, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 10, destY: 5 }
      ],
      props: [],
      npcs: [
        { id: "emillia", tx: 5, ty: 8, dir: "up", minQuest: 9, maxQuest: 12, event: "fortressEmillia" },
        { id: "envy", tx: 7, ty: 6, dir: "down", minQuest: 10, maxQuest: 10, event: "envyBattle" },
        { id: "sendex", tx: 10, ty: 7, dir: "left", minQuest: 11, maxQuest: 11, event: "danielAscend" },
        { id: "crepsus", tx: 7, ty: 3, dir: "down", minQuest: 9, maxQuest: 12, event: "crepsusBattle" },
        { id: "death", tx: 7, ty: 5, dir: "down", minQuest: 13, maxQuest: 13, event: "griefResolve" }
      ]
    };
  }

  return {
    overworld: buildOverworld(),
    house: buildHouse(),
    church: buildChurch(),
    hospital: buildHospital(),
    bookstore: buildBookstore(),
    party: buildParty(),
    dream: buildDream(),
    park: buildPark(),
    fortress: buildFortress()
  };
})();
