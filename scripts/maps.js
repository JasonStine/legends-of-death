// =========================================================
// scripts/maps.js — Clean Front-Door City Layout, Multi-Room
//                   Jacob's House, Continuity & Book-Accurate NPCs
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

  // COLORADO SPRINGS — Clean 2-Avenue City Grid (Paths ONLY Lead to Front Doors!)
  function buildOverworld() {
    const w = 26, h = 20;
    const grid = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => (x === 0 || y === 0 || x === w - 1 || y === h - 1) ? 2 : 0)
    );

    // Upper Avenue (y = 7..8) serving North buildings (Church & Jacob's House)
    for (let x = 2; x <= 23; x++) { grid[7][x] = 3; grid[8][x] = 3; }
    // Lower Avenue (y = 14..15) serving South buildings (Hospital, Barnes & Noble, Party House)
    for (let x = 2; x <= 23; x++) { grid[14][x] = 3; grid[15][x] = 3; }

    // Two clean Vertical Connectors (West Blvd x=8..9, East Blvd x=15..16)
    for (let y = 7; y <= 15; y++) {
      grid[y][8] = 3; grid[y][9] = 3;
      grid[y][15] = 3; grid[y][16] = 3;
    }
    // North Trail to Limbach Park Portal (x=12..13, y=3..7)
    for (let y = 3; y <= 7; y++) { grid[y][12] = 3; grid[y][13] = 3; }

    // Short Front-Door Walkways ONLY (never touching the back of any building!)
    grid[6][5] = 3;   // St. Jude Church front door (5,5) -> Upper Ave
    grid[6][19] = 3;  // Jacob's House front door (19,5) -> Upper Ave
    grid[13][5] = 3;  // Hospital front door (5,12) -> Lower Ave
    grid[13][12] = 3; // Barnes & Noble front door (12,12) -> Lower Ave
    grid[13][19] = 3; // Party House front door (19,12) -> Lower Ave

    const trees = [
      { tx: 1, ty: 1, kind: "pine" }, { tx: 2, ty: 1, kind: "oak" },
      { tx: 9, ty: 2, kind: "pine" }, { tx: 10, ty: 2, kind: "oak" },
      { tx: 15, ty: 2, kind: "pine" }, { tx: 23, ty: 2, kind: "oak" },
      { tx: 24, ty: 4, kind: "pine" }, { tx: 1, ty: 5, kind: "oak" },
      { tx: 1, ty: 11, kind: "pine" }, { tx: 24, ty: 11, kind: "oak" },
      { tx: 4, ty: 17, kind: "oak" }, { tx: 10, ty: 17, kind: "pine" },
      { tx: 16, ty: 17, kind: "oak" }, { tx: 22, ty: 17, kind: "pine" }
    ];
    trees.forEach(t => { grid[t.ty][t.tx] = 2; });

    // 5 Unique Buildings — ALL doors face south onto a front walkway & avenue!
    const buildings = [
      { id: "church", style: "church", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "church", destX: 7, destY: 9 },
      { id: "house", style: "house", tx: 17, ty: 3, tw: 5, th: 3, doorTx: 19, doorTy: 5, dest: "house", destX: 7, destY: 9 },
      { id: "hospital", style: "hospital", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "hospital", destX: 7, destY: 9 },
      { id: "bookstore", style: "bookstore", tx: 10, ty: 10, tw: 5, th: 3, doorTx: 12, doorTy: 12, dest: "bookstore", destX: 7, destY: 9 },
      { id: "party", style: "party", tx: 17, ty: 10, tw: 5, th: 3, doorTx: 19, doorTy: 12, dest: "party", destX: 7, destY: 9 }
    ];

    buildings.forEach(b => {
      for (let yy = b.ty; yy < b.ty + b.th; yy++) {
        for (let xx = b.tx; xx < b.tx + b.tw; xx++) {
          grid[yy][xx] = (xx === b.doorTx && yy === b.doorTy) ? 4 : 1;
        }
      }
    });

    // Readable Front-Yard Signposts (next to front doors)
    const signs = [
      { tx: 7, ty: 6, text: "St. Jude Catholic Church — Memorial Service for the Huesic Family." },
      { tx: 17, ty: 6, text: "Menos Residence (412 Starlight Ln) — Jacob & Dr. Menos's Home." },
      { tx: 7, ty: 13, text: "Colorado Springs Medical Center — Step inside anytime for free healing." },
      { tx: 14, ty: 13, text: "Barnes & Noble Booksellers — Stop by for coffee, constellations, and 'Twilight Fireflies'." },
      { tx: 17, ty: 13, text: "Classmate's House — Bass-heavy party music is rattling the windows!" },
      { tx: 14, ty: 4, text: "North Trail to Limbach Park — Strange chills linger here after dark..." }
    ];
    signs.forEach(s => { grid[s.ty][s.tx] = 1; });

    return {
      id: "overworld",
      name: "Colorado Springs",
      w, h, floorType: "grass", grid, trees, buildings, signs, props: [],
      portals: [
        { tx: 12, ty: 2, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 7, destY: 9, minQuest: 7 }
      ],
      npcs: [
        // Book-accurate town life!
        {
          id: "detective", tx: 3, ty: 6, dir: "right",
          routine: { type: "patrol", points: [[2, 6], [4, 6]], speed: 18, pause: 2.8 },
          dialogue: [{ id: "detective", mood: "sad", text: "Detective Miller, CSPD. Forensics found traces of Iris and Belladonna poison at the Huesic house... I've never seen a weapon like it in Colorado Springs." }]
        },
        {
          id: "suzanna", tx: 10, ty: 16, dir: "right",
          routine: { type: "patrol", points: [[9, 16], [14, 16]], speed: 20, pause: 2.5 },
          dialogue: [{ id: "suzanna", mood: "neutral", text: "Hello, Jacob! Enjoying your break before Senior Calculus? I'm picking up new textbooks at Barnes & Noble." }]
        },
        {
          id: "lucia", tx: 11, ty: 4, dir: "down",
          routine: { type: "patrol", points: [[11, 4], [11, 6]], speed: 22, pause: 2.6 },
          dialogue: [{ id: "lucia", mood: "intense", text: "(Quietly scanning the tree line) ...Oh, hey kid. Just admiring the Colorado air. (Wait—is she wearing a crimson cloak pin under her jacket?)" }]
        },
        // CONTINUITY FIX: Crista ONLY prowls outside AFTER you meet her inside Jacob's House (questStage >= 7)!
        {
          id: "crista", tx: 21, ty: 6, dir: "down", minQuest: 7, maxQuest: 14,
          routine: { type: "patrol", points: [[20, 6], [22, 6]], speed: 22, pause: 2.0 },
          dialogue: [{ id: "crista", mood: "happy", text: "Meow~ (Crista watches the street outside Jacob's house with piercing blue eyes.)" }]
        },
        // Epilogue Reunion
        {
          id: "letonin", tx: 12, ty: 8, dir: "down", minQuest: 15, maxQuest: 20, event: "epilogueReunion",
          routine: { type: "patrol", points: [[11, 8], [13, 8]], speed: 24, pause: 2.2 }
        },
        {
          id: "cyrine", tx: 14, ty: 8, dir: "left", minQuest: 15, maxQuest: 20, event: "epilogueReunion"
        }
      ]
    };
  }

  // JACOB'S HOUSE — Multi-Room Home! (Living Room + Kitchen + Separated Bedroom w/ Playable PC!)
  function buildHouse() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;

    // Interior Bedroom Partition Wall at x = 10 (y = 2..8, with a doorway at y = 6!)
    for (let y = 2; y <= 8; y++) {
      if (y !== 6) r.grid[y][10] = 1;
    }

    // Furniture collision footprints
    r.grid[4][2] = 1; r.grid[4][3] = 1; r.grid[4][4] = 1; // Living room couch
    r.grid[2][5] = 1; r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1; // Kitchen counter
    r.grid[2][4] = 1; // Fridge
    r.grid[3][13] = 1; r.grid[4][13] = 1; r.grid[3][14] = 1; r.grid[4][14] = 1; // Bedroom bed
    r.grid[2][11] = 1; r.grid[2][12] = 1; // Bedroom PC Desk (Playable SNAKE!)

    return {
      ...r, id: "house", name: "Jacob's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 6 }],
      props: [
        { kind: "rug", tx: 2, ty: 5, tw: 4, th: 3, color: "#312e81", inner: "#4338ca" },
        { kind: "couch", tx: 2, ty: 4, interact: "sleep", label: "Living Room Couch" },
        { kind: "tv", tx: 3, ty: 8 },
        { kind: "fridge", tx: 4, ty: 2 },
        { kind: "kitchen_counter", tx: 5, ty: 2 },
        { kind: "pc_desk", tx: 11, ty: 2, interact: "playSnake", label: "Jacob's PC (SNAKE.EXE)" },
        { kind: "bed", tx: 13, ty: 3, interact: "sleep", label: "Jacob's Bed" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        {
          id: "navi", tx: 6, ty: 3, dir: "up", event: "naviHouse",
          activity: "cook",
          routine: { type: "patrol", points: [[5, 3], [8, 3]], speed: 22, pause: 2.4, faceAtStop: "up" }
        },
        {
          id: "mom", tx: 5, ty: 7, dir: "right",
          routine: { type: "patrol", points: [[5, 7], [8, 7], [8, 8]], speed: 20, pause: 2.5 },
          dialogue: [{ id: "mom", mood: "happy", text: "Navi's brunch smells heavenly! Your bedroom computer is still on in the next room if you want to unwind, Jacob." }]
        },
        // CONTINUITY FIX: Crista is inside Jacob's House ONLY during Ch. VII (questStage === 6)!
        {
          id: "crista", tx: 3, ty: 6, dir: "down", minQuest: 6, maxQuest: 6, event: "snowCatCrista",
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
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 6 }],
      props: [
        { kind: "rug", tx: 6, ty: 3, tw: 4, th: 7, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "altar", tx: 6, ty: 2 },
        { kind: "plaque", tx: 10, ty: 2, interact: "loreChurchPlaque", label: "Memorial Plaque" },
        { kind: "pew", tx: 2, ty: 5 }, { kind: "pew", tx: 2, ty: 7 },
        { kind: "pew", tx: 11, ty: 5 }, { kind: "pew", tx: 11, ty: 7 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [{ id: "cyrine", tx: 7, ty: 4, dir: "up", maxQuest: 0, event: "churchCyrine" }]
    };
  }

  function buildHospital() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[4][2] = 1; r.grid[3][12] = 1; r.grid[4][12] = 1;
    return {
      ...r, id: "hospital", name: "Colorado Springs Hospital", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 13 }],
      props: [
        { kind: "hospital_bed", tx: 2, ty: 3 },
        { kind: "hospital_bed", tx: 12, ty: 3 },
        { kind: "plaque", tx: 9, ty: 2, interact: "loreHospitalChart", label: "Forensic Toxicology Note" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [{
        id: "mom", tx: 7, ty: 4, dir: "down", event: "hospitalHeal",
        routine: { type: "patrol", points: [[5, 4], [10, 4]], speed: 22, pause: 2.4 }
      }]
    };
  }

  // BARNES & NOBLE — Integrated into Ch. I Story + Exploration Lore!
  function buildBookstore() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][11] = 1; r.grid[3][12] = 1;
    return {
      ...r, id: "bookstore", name: "Barnes & Noble", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 12, destY: 13 }],
      props: [
        { kind: "rug", tx: 5, ty: 4, tw: 6, th: 4, color: "#14532d", inner: "#166534" },
        { kind: "bookshelf", tx: 2, ty: 3, interact: "loreTwilightFireflies", label: "Twilight Fireflies Display" },
        { kind: "bookshelf", tx: 11, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        {
          id: "clerk", tx: 12, ty: 6, dir: "left",
          dialogue: [{ id: "clerk", mood: "happy", text: "Welcome to Barnes & Noble! Check out the left bookshelf—we still keep a display copy of 'Twilight Fireflies' written by Mrs. Huesic." }]
        },
        // Cyrine waits here right after the funeral (questStage === 1)
        { id: "cyrine", tx: 7, ty: 5, dir: "down", minQuest: 1, maxQuest: 1, event: "bookstoreCyrine" },
        // CONTINUITY FIX: Illicero only hangs out here AFTER you meet him at the Party House (questStage >= 6)!
        {
          id: "illicero", tx: 6, ty: 6, dir: "right", minQuest: 6, maxQuest: 13, activity: "vape",
          dialogue: [{ id: "illicero", mood: "happy", text: "Told you I'd find you at Barnes & Noble, Jacob. Keep your eyes on the stars—and your ring close." }]
        }
      ]
    };
  }

  function buildParty() {
    const r = makeRoom(16, 12, "party");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][4] = 1;
    return {
      ...r, id: "party", name: "Classmate's Party House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 13 }],
      props: [
        { kind: "party_table", tx: 2, ty: 3 }, { kind: "party_table", tx: 11, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "sendex", tx: 7, ty: 4, dir: "down", maxQuest: 5, event: "partyBattle" },
        { id: "navi", tx: 5, ty: 6, dir: "up", maxQuest: 6, dialogue: [{ id: "navi", mood: "intense", text: "Stay behind me, Jacob—Sendex is right ahead!" }] },
        { id: "illicero", tx: 9, ty: 6, dir: "up", maxQuest: 6, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Relax, kid. Navi and I have your back." }] },
        { id: "cyrine", tx: 12, ty: 7, dir: "left", activity: "dance", dialogue: [{ id: "cyrine", mood: "happy", text: "Come on Jacob, live a little! The music's awesome!" }] }
      ]
    };
  }

  function buildDream() {
    const r = makeRoom(16, 12, "dream");
    const trees = [
      { tx: 2, ty: 2, kind: "cherry" }, { tx: 13, ty: 2, kind: "cherry" },
      { tx: 2, ty: 8, kind: "cherry" }, { tx: 13, ty: 8, kind: "cherry" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });
    return {
      ...r, id: "dream", name: "Letonin's Dream Realm", trees, buildings: [], signs: [], exits: [],
      portals: [{ tx: 7, ty: 10, style: "dream", label: "WAKE UP", dest: "house", destX: 5, destY: 6 }],
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
        { tx: 12, ty: 5, style: "bloodmoon", label: "CASA GRANDE", dest: "fortress", destX: 7, destY: 9, minQuest: 10 }
      ],
      props: [],
      npcs: [
        { id: "letonin", tx: 7, ty: 5, dir: "down", maxQuest: 9, event: "parkAction" },
        { id: "sendex", tx: 5, ty: 4, dir: "down", maxQuest: 8, event: "parkAction" },
        { id: "death", tx: 4, ty: 6, dir: "right", minQuest: 9, event: "deathStory" }
      ]
    };
  }

  // CASA GRANDE FORTRESS — Populated with Book-Accurate Discipuli (Vrotney & Damian)!
  function buildFortress() {
    const r = makeRoom(16, 13, "desert");
    const trees = [
      { tx: 2, ty: 3, kind: "cactus" }, { tx: 13, ty: 3, kind: "cactus" },
      { tx: 2, ty: 9, kind: "cactus" }, { tx: 13, ty: 9, kind: "cactus" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });
    return {
      ...r, id: "fortress", name: "Casa Grande Fortress (Blood Moon)", trees, buildings: [], signs: [], exits: [],
      portals: [{ tx: 7, ty: 11, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 10, destY: 5 }],
      props: [],
      npcs: [
        {
          id: "vrotney", tx: 4, ty: 10, dir: "right",
          dialogue: [{ id: "vrotney", mood: "happy", text: "Vrotney, Letonin's division! I shuttled you across the sky to get here—our Morte Discipuli are holding off Crepsus's perimeter!" }]
        },
        {
          id: "damian", tx: 11, ty: 10, dir: "left",
          dialogue: [{ id: "damian", mood: "intense", text: "Damian, Illicero's elite faction from Sydney! Master Kain manifested me into celestial brass knuckles earlier—we've got your flank covered!" }]
        },
        { id: "emillia", tx: 5, ty: 8, dir: "up", minQuest: 10, maxQuest: 13, event: "fortressEmillia" },
        { id: "envy", tx: 7, ty: 6, dir: "down", minQuest: 11, maxQuest: 11, event: "envyBattle" },
        { id: "sendex", tx: 10, ty: 7, dir: "left", minQuest: 12, maxQuest: 12, event: "danielAscend" },
        { id: "crepsus", tx: 7, ty: 3, dir: "down", minQuest: 10, maxQuest: 13, event: "crepsusBattle" },
        { id: "death", tx: 7, ty: 5, dir: "down", minQuest: 14, maxQuest: 14, event: "griefResolve" }
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
