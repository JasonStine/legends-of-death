// =========================================================
// scripts/maps.js — Stardew Valley Interiors, Dynamic Asphalt
//                   Roads + Sidewalks & Purgatorio Layer (v6)
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

  // ---------------------------------------------------------
  // COLORADO SPRINGS OVERWORLD (Tile 3 = Asphalt, Tile 5 = Sidewalk)
  // ---------------------------------------------------------
  function buildOverworld() {
    const w = 26, h = 20;
    const grid = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => (x === 0 || y === 0 || x === w - 1 || y === h - 1) ? 2 : 0)
    );

    // Upper Avenue (y = 7..8) & Lower Avenue (y = 14..15) — 2-lane Asphalt (3)
    for (let x = 2; x <= 23; x++) {
      grid[7][x] = 3; grid[8][x] = 3;
      grid[14][x] = 3; grid[15][x] = 3;
    }
    // Two Vertical Boulevards (x = 8..9 and x = 15..16) — 2-lane Asphalt (3)
    for (let y = 7; y <= 15; y++) {
      grid[y][8] = 3; grid[y][9] = 3;
      grid[y][15] = 3; grid[y][16] = 3;
    }
    // North Trail to Limbach Park Portal (x = 12..13, y = 3..6) — Asphalt (3)
    for (let y = 3; y <= 6; y++) { grid[y][12] = 3; grid[y][13] = 3; }

    // Dedicated Concrete Sidewalks (Tile 5) connecting ONLY front doors to the road!
    grid[6][5] = 5;   // St. Jude Church front door
    grid[6][19] = 5;  // Jacob's House front door
    grid[13][5] = 5;  // Hospital front door
    grid[13][12] = 5; // Barnes & Noble front door
    grid[13][19] = 5; // Party House front door

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

    const signs = [
      { tx: 7, ty: 6, text: "St. Jude Catholic Church — Memorial Service for the Huesic Family." },
      { tx: 17, ty: 6, text: "Menos Residence (412 Starlight Ln) — Jacob & Dr. Menos's Home." },
      { tx: 7, ty: 13, text: "Colorado Springs Medical Center — Open 24/7. Step inside for reception & free healing." },
      { tx: 14, ty: 13, text: "Barnes & Noble Booksellers & Café — Featuring 'Twilight Fireflies' & fresh espresso." },
      { tx: 17, ty: 13, text: "Classmate's House — Bass-heavy party music is rattling the windows!" },
      { tx: 14, ty: 4, text: "North Trail to Limbach Park — Strange chills linger here after dark..." }
    ];
    signs.forEach(s => { grid[s.ty][s.tx] = 1; });

    return {
      id: "overworld",
      name: "Colorado Springs",
      w, h, floorType: "grass", grid, trees, buildings, signs,
      props: [
        // Purgatorio-ONLY hidden spectral Reaperian Text crystal in town!
        { kind: "purg_crystal", tx: 10, ty: 5, purgOnly: true, interact: "lorePurgTown", label: "Astral Reaperian Tablet" }
      ],
      portals: [
        { tx: 12, ty: 2, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 7, destY: 9, minQuest: 7 }
      ],
      npcs: [
        {
          id: "detective", tx: 3, ty: 6, dir: "right", isHuman: true,
          routine: { type: "patrol", points: [[2, 6], [4, 6]], speed: 18, pause: 2.8 },
          dialogue: [{ id: "detective", mood: "sad", text: "Detective Miller, CSPD. Forensics found traces of Iris and Belladonna poison at the Huesic house... I've never seen a weapon like it in Colorado Springs." }]
        },
        {
          id: "suzanna", tx: 10, ty: 16, dir: "right", isHuman: true,
          routine: { type: "patrol", points: [[9, 16], [14, 16]], speed: 20, pause: 2.5 },
          dialogue: [{ id: "suzanna", mood: "neutral", text: "Hello, Jacob! Enjoying your break before Senior Calculus? I'm picking up new textbooks at Barnes & Noble." }]
        },
        {
          id: "lucia", tx: 11, ty: 4, dir: "down",
          routine: { type: "patrol", points: [[11, 4], [11, 6]], speed: 22, pause: 2.6 },
          dialogue: [{ id: "lucia", mood: "intense", text: "(Scanning the tree line) ...Oh, hey kid. Just admiring the Colorado air. (Wait—is she wearing a crimson cloak pin under her jacket?)" }]
        },
        // Purgatorio-ONLY invisible Reaper Scout patrolling Colorado Springs!
        {
          id: "md_scout", tx: 6, ty: 16, dir: "right", purgOnly: true,
          routine: { type: "patrol", points: [[5, 16], [8, 16]], speed: 26, pause: 1.8 },
          dialogue: [{ id: "md_scout", mood: "intense", text: "Whoa—a human walking in Purgatorio?! We Morte Discipuli patrol Colorado Springs unseen by mortal eyes, keeping rogue demons out!" }]
        },
        {
          id: "crista", tx: 21, ty: 6, dir: "down", minQuest: 7, maxQuest: 14,
          routine: { type: "patrol", points: [[20, 6], [22, 6]], speed: 22, pause: 2.0 },
          dialogue: [{ id: "crista", mood: "happy", text: "Meow~ (Crista watches the street outside Jacob's house with piercing blue eyes.)" }]
        },
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

  // ---------------------------------------------------------
  // JACOB'S HOUSE — Stardew Valley Multi-Area Home!
  // Living Room + Tiled Kitchen Nook + Sleek Divided Bedroom
  // ---------------------------------------------------------
  function buildHouse() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;

    // Kitchen Cream Tile Zone (x=4..9, y=2..4)
    for (let y = 2; y <= 4; y++) {
      for (let x = 4; x <= 9; x++) r.grid[y][x] = 7;
    }

    // Sleek Stardew Thin Partition Wall (Tile 6) separating Jacob's Bedroom at x = 10
    for (let y = 2; y <= 10; y++) {
      if (y !== 6 && y !== 7) r.grid[y][10] = 6;
    }

    // Furniture collision
    r.grid[4][2] = 1; r.grid[4][3] = 1; r.grid[4][4] = 1; // Couch
    r.grid[2][4] = 1; // Fridge
    r.grid[2][5] = 1; r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1; // Kitchen counter
    r.grid[2][11] = 1; r.grid[2][12] = 1; // Bedroom PC Desk (SNAKE.EXE)
    r.grid[3][13] = 1; r.grid[4][13] = 1; r.grid[3][14] = 1; r.grid[4][14] = 1; // Bed
    r.grid[2][14] = 1; // Nightstand

    return {
      ...r, id: "house", name: "Jacob's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 6 }],
      props: [
        { kind: "rug", tx: 2, ty: 5, tw: 4, th: 3, color: "#312e81", inner: "#4338ca" },
        { kind: "rug", tx: 11, ty: 6, tw: 3, th: 3, color: "#1e3a8a", inner: "#2563eb" },
        { kind: "couch", tx: 2, ty: 4, interact: "sleep", label: "Living Room Couch" },
        { kind: "tv", tx: 3, ty: 8 },
        { kind: "plant", tx: 1, ty: 2 },
        { kind: "fridge", tx: 4, ty: 2 },
        { kind: "kitchen_counter", tx: 5, ty: 2 },
        { kind: "pc_desk", tx: 11, ty: 2, interact: "playSnake", label: "Jacob's PC (SNAKE.EXE)" },
        { kind: "nightstand", tx: 14, ty: 2 },
        { kind: "bed", tx: 13, ty: 3, interact: "sleep", label: "Jacob's Bed" },
        { kind: "plant", tx: 14, ty: 9 },
        // Purgatorio-ONLY glowing black Envy poison residue (like Navi's Caeleste vision!)
        { kind: "poison_trace", tx: 6, ty: 6, purgOnly: true, interact: "lorePurgHouse", label: "Black Envy Toxin Residue" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        {
          id: "navi", tx: 6, ty: 3, dir: "up", event: "naviHouse",
          activity: "cook",
          routine: { type: "patrol", points: [[5, 3], [8, 3]], speed: 22, pause: 2.4, faceAtStop: "up" }
        },
        {
          id: "mom", tx: 5, ty: 7, dir: "right", isHuman: true,
          routine: { type: "patrol", points: [[5, 7], [8, 7], [8, 8]], speed: 20, pause: 2.5 },
          dialogue: [{ id: "mom", mood: "happy", text: "Navi's brunch smells heavenly! Your bedroom computer is on in the next room if you want to play a game, Jacob." }]
        },
        {
          id: "crista", tx: 3, ty: 6, dir: "down", minQuest: 6, maxQuest: 6, event: "snowCatCrista",
          routine: { type: "patrol", points: [[2, 6], [5, 6]], speed: 20, pause: 2.0 }
        }
      ]
    };
  }

  // ---------------------------------------------------------
  // ST. JUDE CHURCH — 8 Pews, Flower Stands, Mourners & Purgatorio Spirit
  // ---------------------------------------------------------
  function buildChurch() {
    const r = makeRoom(16, 12, "stone");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    // 4 rows of pews on each side (8 pews total!)
    [4, 5, 7, 8].forEach(py => {
      for (let x = 2; x <= 4; x++) r.grid[py][x] = 1;
      for (let x = 11; x <= 13; x++) r.grid[py][x] = 1;
    });
    r.grid[2][5] = 1; r.grid[2][10] = 1; // flower stands

    return {
      ...r, id: "church", name: "St. Jude Church", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 6 }],
      props: [
        { kind: "rug", tx: 6, ty: 3, tw: 4, th: 7, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "altar", tx: 6, ty: 2 },
        { kind: "flower_stand", tx: 5, ty: 2 },
        { kind: "flower_stand", tx: 10, ty: 2 },
        { kind: "plaque", tx: 11, ty: 2, interact: "loreChurchPlaque", label: "Memorial Plaque" },
        { kind: "pew", tx: 2, ty: 4 }, { kind: "pew", tx: 2, ty: 5 },
        { kind: "pew", tx: 2, ty: 7 }, { kind: "pew", tx: 2, ty: 8 },
        { kind: "pew", tx: 11, ty: 4 }, { kind: "pew", tx: 11, ty: 5 },
        { kind: "pew", tx: 11, ty: 7 }, { kind: "pew", tx: 11, ty: 8 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "cyrine", tx: 7, ty: 4, dir: "up", maxQuest: 0, event: "churchCyrine" },
        {
          id: "mourner", tx: 5, ty: 6, dir: "up", isHuman: true,
          dialogue: [{ id: "mourner", mood: "sad", text: "The Huesics sat in the front pew every Sunday... Poor Cyrine shouldn't have to bear this alone." }]
        },
        {
          id: "mourner", tx: 10, ty: 6, dir: "up", isHuman: true,
          dialogue: [{ id: "mourner", mood: "sad", text: "Did you hear the church bells ringing at midnight last night? Nobody at the parish rang them..." }]
        },
        // Purgatorio-ONLY wandering spirit inside the church!
        {
          id: "spirit", tx: 8, ty: 3, dir: "down", purgOnly: true,
          dialogue: [{ id: "spirit", mood: "happy", text: "(A warm, glowing spirit whispers in Purgatorio) 'Tell Cyrine we are watching over her... Even in death, a family's love never fades.'" }]
        }
      ]
    };
  }

  // ---------------------------------------------------------
  // COLORADO SPRINGS HOSPITAL — Reception Lobby + Back Treatment Rooms!
  // ---------------------------------------------------------
  function buildHospital() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;

    // Back Treatment Wing Floor (y = 2..5, light-blue sterile vinyl)
    for (let y = 2; y <= 5; y++) {
      for (let x = 1; x <= 14; x++) r.grid[y][x] = 7;
    }

    // Sleek Horizontal Stardew Partition Wall (Tile 6) separating Reception Lobby & Back Wing!
    for (let x = 1; x <= 14; x++) {
      if (x !== 7 && x !== 8) r.grid[6][x] = 6; // Wide double doorway at x = 7..8!
    }

    // Back Room Props Collision (Beds & ECG Machines)
    r.grid[3][2] = 1; r.grid[4][2] = 1; r.grid[3][3] = 1; r.grid[4][3] = 1; // Left bed
    r.grid[3][4] = 1; // Left ECG machine
    r.grid[3][12] = 1; r.grid[4][12] = 1; r.grid[3][13] = 1; r.grid[4][13] = 1; // Right bed
    r.grid[3][11] = 1; // Right ECG machine
    r.grid[2][9] = 1; // Toxicology Chart

    // Front Lobby Props Collision (Reception Desk & Waiting Chairs)
    r.grid[8][2] = 1; r.grid[8][3] = 1; r.grid[8][4] = 1; // Reception Desk
    r.grid[8][12] = 1; r.grid[8][13] = 1; // Waiting Chairs

    return {
      ...r, id: "hospital", name: "Colorado Springs Hospital", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 13 }],
      props: [
        // Back Treatment Rooms
        { kind: "hospital_bed", tx: 2, ty: 3 },
        { kind: "med_machine", tx: 4, ty: 3 },
        { kind: "hospital_bed", tx: 12, ty: 3 },
        { kind: "med_machine", tx: 11, ty: 3 },
        { kind: "plaque", tx: 9, ty: 2, interact: "loreHospitalChart", label: "Toxicology Chart" },
        // Front Reception Lobby
        { kind: "reception_desk", tx: 2, ty: 8, interact: "loreHospitalDesk", label: "Reception Computer" },
        { kind: "waiting_chair", tx: 12, ty: 8 },
        { kind: "waiting_chair", tx: 13, ty: 8 },
        { kind: "plant", tx: 1, ty: 7 },
        { kind: "plant", tx: 14, ty: 7 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        {
          id: "receptionist", tx: 3, ty: 7, dir: "down", isHuman: true,
          dialogue: [{ id: "receptionist", mood: "happy", text: "Welcome to Colorado Springs Hospital! Dr. Menos is in the back treatment wing through the double doors—she'll patch you right up for free!" }]
        },
        {
          id: "mom", tx: 7, ty: 3, dir: "down", isHuman: true, event: "hospitalHeal",
          routine: { type: "patrol", points: [[6, 3], [9, 3]], speed: 20, pause: 2.4 }
        },
        {
          id: "nurse", tx: 10, ty: 4, dir: "right", isHuman: true,
          dialogue: [{ id: "nurse", mood: "neutral", text: "Checking the vitals monitors! If you're curious about the Huesic forensics report, Dr. Menos pinned a note on the back wall." }]
        },
        // Purgatorio-ONLY spirit in the Hospital ER!
        {
          id: "spirit", tx: 5, ty: 4, dir: "down", purgOnly: true,
          dialogue: [{ id: "spirit", mood: "neutral", text: "(A newly departed soul hovers peacefully beside the monitor) 'Waiting for the Reapers to guide me onward... They're kinder than the stories say.'" }]
        }
      ]
    };
  }

  // ---------------------------------------------------------
  // BARNES & NOBLE — Stocked Book Aisles + Coffee Corner + Extras!
  // ---------------------------------------------------------
  function buildBookstore() {
    const r = makeRoom(16, 12, "bookstore");
    r.grid[11][7] = 4; r.grid[11][8] = 4;

    // Café / Coffee Corner Tiled Floor (right wing x=10..14, y=2..9)
    for (let y = 2; y <= 9; y++) {
      for (let x = 10; x <= 14; x++) r.grid[y][x] = 7;
    }

    // Book Aisles Collision (4 stocked bookshelves!)
    [2, 3].forEach(x => { r.grid[3][x] = 1; r.grid[6][x] = 1; });
    [6, 7].forEach(x => { r.grid[3][x] = 1; r.grid[6][x] = 1; });

    // Café Bar & Tables Collision
    r.grid[2][11] = 1; r.grid[2][12] = 1; r.grid[2][13] = 1; // Coffee Counter
    r.grid[6][11] = 1; r.grid[6][13] = 1; // Café Tables

    return {
      ...r, id: "bookstore", name: "Barnes & Noble & Café", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 12, destY: 13 }],
      props: [
        { kind: "rug", tx: 4, ty: 4, tw: 5, th: 2, color: "#14532d", inner: "#166534" },
        // 4 Stocked Book Aisles (2 interactive lore shelves!)
        { kind: "bookshelf", tx: 2, ty: 3, interact: "loreTwilightFireflies", label: "Twilight Fireflies Display" },
        { kind: "bookshelf", tx: 6, ty: 3, interact: "loreSupernaturalNovels", label: "Supernatural Fiction Aisle" },
        { kind: "bookshelf", tx: 2, ty: 6 },
        { kind: "bookshelf", tx: 6, ty: 6 },
        // Café / Coffee Corner
        { kind: "coffee_counter", tx: 11, ty: 2, interact: "loreCafeBoard", label: "Café Espresso Bar" },
        { kind: "cafe_table", tx: 11, ty: 6 },
        { kind: "cafe_table", tx: 13, ty: 6 },
        { kind: "plant", tx: 14, ty: 2 },
        { kind: "plant", tx: 1, ty: 9 },
        // Purgatorio-ONLY hidden crystal in the bookstore!
        { kind: "purg_crystal", tx: 9, ty: 8, purgOnly: true, interact: "lorePurgBookstore", label: "Hidden Reaperian Text" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        {
          id: "clerk", tx: 12, ty: 3, dir: "down", isHuman: true,
          dialogue: [{ id: "clerk", mood: "happy", text: "Welcome to Barnes & Noble Café! We have fresh espresso, croissants, and a featured display of 'Twilight Fireflies' on the top-left aisle!" }]
        },
        {
          id: "patron", tx: 4, ty: 7, dir: "up", isHuman: true,
          routine: { type: "patrol", points: [[3, 7], [5, 7]], speed: 18, pause: 3.0 },
          dialogue: [{ id: "patron", mood: "neutral", text: "I love the mystery section here... Wait, have you seen those supernatural novels on the middle shelf? Crazy how detailed the Reaper lore is!" }]
        },
        {
          id: "barista", tx: 11, ty: 7, dir: "up", isHuman: true,
          dialogue: [{ id: "barista", mood: "happy", text: "Best caramel lattes in Colorado Springs! Nothing beats reading under the stars outside after dark." }]
        },
        // Cyrine waits here in Ch. I (cont.) right after the funeral
        { id: "cyrine", tx: 5, ty: 5, dir: "down", minQuest: 1, maxQuest: 1, event: "bookstoreCyrine" },
        // Illicero lounges here AFTER you meet him at the Party House
        {
          id: "illicero", tx: 13, ty: 7, dir: "left", minQuest: 6, maxQuest: 13, activity: "vape",
          dialogue: [{ id: "illicero", mood: "happy", text: "Told you I'd catch you at Barnes & Noble, Jacob. Grab a coffee and check the Supernatural aisle—Navi hates how accurate those books are." }]
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
