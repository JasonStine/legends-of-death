// Overworld, interior, Dream Realm, Limbach Park, and Casa Grande maps.
// =========================================================
// scripts/maps.js — Colorado Springs Overworld, 5 Distinct
//                   Building Interiors, Dream Realm, Park & Fortress
// =========================================================
window.Maps = (() => {
  // Helper to build a bordered interior map
  function makeRoom(w, h, floorType = "wood") {
    const grid = [];
    for (let y = 0; y < h; y++) {
      const row = [];
      for (let x = 0; x < w; x++) {
        if (y === 0 || y === 1 || y === h - 1 || x === 0 || x === w - 1) row.push(1); // solid wall
        else row.push(0); // walkable floor
      }
      grid.push(row);
    }
    return { w, h, floorType, grid };
  }

  // Overworld (26 x 20 tiles)
  function buildOverworld() {
    const w = 26, h = 20;
    const grid = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => {
        if (x === 0 || y === 0 || x === w - 1 || y === h - 1) return 2; // tree border
        return 0; // grass
      })
    );
    // Paved roads connecting all 5 distinct buildings
    for (let x = 3; x <= 22; x++) { grid[9][x] = 3; grid[10][x] = 3; }
    for (let y = 5; y <= 15; y++) { grid[y][12] = 3; grid[y][13] = 3; }
    // Sidewalks to doors
    for (let y = 6; y <= 9; y++) { grid[y][5] = 3; grid[y][19] = 3; }
    for (let y = 10; y <= 13; y++) { grid[y][5] = 3; grid[y][19] = 3; }

    // Decorative trees (Oak & Pine)
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

    // 5 COMPLETELY UNIQUE BUILDINGS
    const buildings = [
      { id: "church", style: "church", label: "ST. JUDE CHURCH", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "church", destX: 7, destY: 9 },
      { id: "house", style: "house", label: "JACOB'S HOUSE", tx: 17, ty: 3, tw: 5, th: 3, doorTx: 19, doorTy: 5, dest: "house", destX: 7, destY: 9 },
      { id: "hospital", style: "hospital", label: "HOSPITAL (HEAL)", tx: 3, ty: 12, tw: 5, th: 3, doorTx: 5, doorTy: 14, dest: "hospital", destX: 7, destY: 9 },
      { id: "bookstore", style: "bookstore", label: "BARNES & NOBLE", tx: 10, ty: 14, tw: 5, th: 3, doorTx: 12, doorTy: 16, dest: "bookstore", destX: 7, destY: 9 },
      { id: "party", style: "party", label: "PARTY HOUSE", tx: 17, ty: 12, tw: 5, th: 3, doorTx: 19, doorTy: 14, dest: "party", destX: 7, destY: 9 }
    ];

    // Mark building footprints solid except their doors
    buildings.forEach(b => {
      for (let yy = b.ty; yy < b.ty + b.th; yy++) {
        for (let xx = b.tx; xx < b.tx + b.tw; xx++) {
          if (xx === b.doorTx && yy === b.doorTy) grid[yy][xx] = 4; // doorway
          else grid[yy][xx] = 1; // solid wall
        }
      }
    });

    return {
      id: "overworld",
      name: "Colorado Springs",
      w, h,
      floorType: "grass",
      grid,
      trees,
      buildings,
      props: [],
      portals: [
        { tx: 12, ty: 2, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 7, destY: 11, minQuest: 4 }
      ],
      npcs: [
        { id: "crista", tx: 16, ty: 7, dir: "down", minQuest: 3, maxQuest: 7, dialogue: [{ id: "crista", mood: "happy", text: "Meow~ (The platinum white cat with piercing blue eyes watches over you calmly. It feels strangely like Illicero...)" }] },
        { id: "letonin", tx: 12, ty: 8, dir: "down", minQuest: 7, maxQuest: 9, event: "epilogueLetonin" },
        { id: "cyrine", tx: 14, ty: 8, dir: "left", minQuest: 7, maxQuest: 9, event: "epilogueLetonin" }
      ]
    };
  }

  // JACOB'S HOUSE INTERIOR (Real Couch, Real Bed, Kitchen Brunch, TV)
  function buildHouse() {
    const r = makeRoom(16, 12, "wood");
    // Open exit door at bottom center
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    // Collision footprints for furniture
    // Couch (tx 2..4, ty 4)
    r.grid[4][2] = 1; r.grid[4][3] = 1; r.grid[4][4] = 1;
    // Bed (tx 12..13, ty 3..4)
    r.grid[3][12] = 1; r.grid[3][13] = 1; r.grid[4][12] = 1; r.grid[4][13] = 1;
    // Kitchen counter (tx 6..9, ty 2)
    r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1; r.grid[2][9] = 1;

    return {
      ...r,
      id: "house",
      name: "Jacob's House",
      trees: [],
      buildings: [],
      portals: [],
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
        { id: "navi", tx: 7, ty: 4, dir: "down", dialogue: [{ id: "navi", mood: "neutral", text: "Morning, Jacob. I cooked quiche, pancakes, and fresh fruit on the counter. Whenever you're ready, rest on the living room couch or your bed." }] },
        { id: "cyrine", tx: 10, ty: 6, dir: "left", dialogue: [{ id: "cyrine", mood: "neutral", text: "Thanks for letting me stay here, Jacob. Get some sleep on the couch—you look like you haven't rested in days." }] },
        { id: "mom", tx: 5, ty: 7, dir: "right", dialogue: [{ id: "mom", mood: "happy", text: "Navi's cooking is incredible! Take care of Cyrine today, sweetheart—and don't stay out too late." }] }
      ]
    };
  }

  // ST. JUDE CATHOLIC CHURCH INTERIOR
  function buildChurch() {
    const r = makeRoom(16, 12, "stone");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    // Pews collision
    for (let x = 2; x <= 4; x++) { r.grid[5][x] = 1; r.grid[7][x] = 1; }
    for (let x = 11; x <= 13; x++) { r.grid[5][x] = 1; r.grid[7][x] = 1; }

    return {
      ...r,
      id: "church",
      name: "St. Jude Church",
      trees: [],
      buildings: [],
      portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 7 }],
      props: [
        { kind: "rug", tx: 6, ty: 3, tw: 4, th: 7, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "altar", tx: 6, ty: 2 },
        { kind: "pew", tx: 2, ty: 5 },
        { kind: "pew", tx: 2, ty: 7 },
        { kind: "pew", tx: 11, ty: 5 },
        { kind: "pew", tx: 11, ty: 7 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "cyrine", tx: 7, ty: 4, dir: "down", event: "churchCyrine" }
      ]
    };
  }

  // COLORADO SPRINGS HOSPITAL INTERIOR (Free Full Heal!)
  function buildHospital() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[4][2] = 1; r.grid[3][12] = 1; r.grid[4][12] = 1;

    return {
      ...r,
      id: "hospital",
      name: "Colorado Springs Hospital",
      trees: [],
      buildings: [],
      portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 16 }],
      props: [
        { kind: "hospital_bed", tx: 2, ty: 3 },
        { kind: "hospital_bed", tx: 12, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "mom", tx: 7, ty: 4, dir: "down", event: "hospitalHeal" }
      ]
    };
  }

  // BARNES & NOBLE INTERIOR
  function buildBookstore() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][11] = 1; r.grid[3][12] = 1;

    return {
      ...r,
      id: "bookstore",
      name: "Barnes & Noble",
      trees: [],
      buildings: [],
      portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 12, destY: 18 }],
      props: [
        { kind: "rug", tx: 5, ty: 4, tw: 6, th: 4, color: "#14532d", inner: "#166534" },
        { kind: "bookshelf", tx: 2, ty: 3 },
        { kind: "bookshelf", tx: 11, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "illicero", tx: 7, ty: 5, dir: "down", dialogue: [{ id: "illicero", mood: "happy", text: "You really DO hang out at Barnes & Noble, huh Jacob? Check out 'Twilight Fireflies'—the red spirit and yellow spirit sound a lot like you and Cyrine." }] }
      ]
    };
  }

  // PARTY HOUSE INTERIOR (Battle 1 + Sendex Walk-Out Cutscene!)
  function buildParty() {
    const r = makeRoom(16, 12, "party");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][4] = 1;

    return {
      ...r,
      id: "party",
      name: "Classmate's Party House",
      trees: [],
      buildings: [],
      portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 16 }],
      props: [
        { kind: "party_table", tx: 2, ty: 3 },
        { kind: "party_table", tx: 11, ty: 3 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "sendex", tx: 7, ty: 4, dir: "down", maxQuest: 3, event: "partyBattle" },
        { id: "navi", tx: 5, ty: 6, dir: "up", maxQuest: 4, dialogue: [{ id: "navi", mood: "intense", text: "Stay sharp, Jacob! Sendex is right ahead in the kitchen!" }] },
        { id: "illicero", tx: 9, ty: 6, dir: "up", maxQuest: 4, dialogue: [{ id: "illicero", mood: "happy", text: "Ready to back you up whenever you confront Sendex." }] }
      ]
    };
  }

  // DREAM REALM (Cherry Blossom Lake + Eclipse Sky + Dream Portal)
  function buildDream() {
    const r = makeRoom(16, 12, "dream");
    const trees = [
      { tx: 2, ty: 2, kind: "cherry" }, { tx: 13, ty: 2, kind: "cherry" },
      { tx: 2, ty: 8, kind: "cherry" }, { tx: 13, ty: 8, kind: "cherry" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });

    return {
      ...r,
      id: "dream",
      name: "Letonin's Dream Realm",
      trees,
      buildings: [],
      exits: [],
      portals: [
        { tx: 7, ty: 9, style: "dream", label: "WAKE UP", dest: "house", destX: 5, destY: 6 }
      ],
      props: [],
      npcs: [
        { id: "letonin", tx: 7, ty: 4, dir: "down", event: "dreamLetonin" }
      ]
    };
  }

  // LIMBACH PARK (Purgatorio Pines + Portals)
  function buildPark() {
    const r = makeRoom(16, 13, "park");
    const trees = [
      { tx: 2, ty: 2, kind: "pine" }, { tx: 3, ty: 2, kind: "pine" },
      { tx: 12, ty: 2, kind: "pine" }, { tx: 13, ty: 2, kind: "pine" },
      { tx: 2, ty: 9, kind: "pine" }, { tx: 13, ty: 9, kind: "pine" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });

    return {
      ...r,
      id: "park",
      name: "Limbach Park (Purgatorio)",
      trees,
      buildings: [],
      exits: [],
      portals: [
        { tx: 7, ty: 11, style: "purgatorio", label: "TO TOWN", dest: "overworld", destX: 12, destY: 4 },
        { tx: 12, ty: 5, style: "bloodmoon", label: "CASA GRANDE", dest: "fortress", destX: 7, destY: 10, minQuest: 5 }
      ],
      props: [],
      npcs: [
        { id: "letonin", tx: 7, ty: 5, dir: "down", maxQuest: 5, event: "parkBattle" },
        { id: "sendex", tx: 5, ty: 4, dir: "down", maxQuest: 4, event: "parkBattle" },
        { id: "death", tx: 4, ty: 6, dir: "right", minQuest: 5, dialogue: [{ id: "death", mood: "neutral", text: "Step into the Crimson Portal on the right to reach Crepsus's desert fortress in Casa Grande, Arizona." }] }
      ]
    };
  }

  // CASA GRANDE FORTRESS (Arizona Desert + Blood Moon + Final Bosses)
  function buildFortress() {
    const r = makeRoom(16, 13, "desert");
    const trees = [
      { tx: 2, ty: 3, kind: "cactus" }, { tx: 13, ty: 3, kind: "cactus" },
      { tx: 2, ty: 9, kind: "cactus" }, { tx: 13, ty: 9, kind: "cactus" }
    ];
    trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });

    return {
      ...r,
      id: "fortress",
      name: "Casa Grande Fortress (Blood Moon)",
      trees,
      buildings: [],
      exits: [],
      portals: [
        { tx: 7, ty: 11, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 11, destY: 5 }
      ],
      props: [],
      npcs: [
        { id: "envy", tx: 7, ty: 6, dir: "down", minQuest: 5, maxQuest: 5, event: "envyBattle" },
        { id: "crepsus", tx: 7, ty: 3, dir: "down", minQuest: 5, maxQuest: 6, event: "crepsusBattle" },
        { id: "emillia", tx: 5, ty: 8, dir: "up", minQuest: 5, maxQuest: 6, dialogue: [{ id: "emillia", mood: "intense", text: "Let's crush Envy and Crepsus so we can all go home!" }] }
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
