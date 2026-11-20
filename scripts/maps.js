// =========================================================
// scripts/maps.js — v10: Dynamic Stardew-Style Connected Rooms
//                   (Non-Cubic Wings & Hallways), Tile 11 Clean
//                   Furniture Collision (Zero Wall Artifacts!),
//                   Full High School Zone & Lived-In Sweet Tooth
// =========================================================
window.Maps = (() => {
  // Helper: Carve connected non-rectangular rooms/hallways out of void (12)
  // and automatically wrap every room contour in clean Stardew-style perimeter walls (1)!
  function buildDynamicRoom(w, h, floorType, rects) {
    const grid = Array.from({ length: h }, () => Array(w).fill(12)); // 12 = exterior void

    // 1. Carve walkable room & hallway rectangles
    rects.forEach(([rx, ry, rw, rh, fl = 0]) => {
      for (let y = ry; y < ry + rh; y++) {
        for (let x = rx; x < rx + rw; x++) {
          if (x >= 0 && y >= 0 && x < w && y < h) grid[y][x] = fl;
        }
      }
    });

    // 2. Wrap every floor tile in perimeter walls (1) — 2 tiles tall on north edges!
    const isFl = (x, y) => (x >= 0 && y >= 0 && x < w && y < h && (grid[y][x] === 0 || grid[y][x] === 7));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (grid[y][x] !== 12) continue;
        const nearFloor =
          isFl(x - 1, y) || isFl(x + 1, y) || isFl(x, y - 1) || isFl(x, y + 1) ||
          isFl(x - 1, y - 1) || isFl(x + 1, y - 1) || isFl(x - 1, y + 1) || isFl(x + 1, y + 1) ||
          isFl(x, y + 2) || isFl(x - 1, y + 2) || isFl(x + 1, y + 2);
        if (nearFloor) grid[y][x] = 1;
      }
    }
    return { w, h, floorType, grid };
  }

  // Helper: Mark furniture footprint as Tile 11 (solid collision, renders normal floor underneath!)
  function solid(r, x, y, tw = 1, th = 1) {
    for (let yy = y; yy < y + th; yy++) {
      for (let xx = x; xx < x + tw; xx++) {
        if (xx >= 0 && yy >= 0 && xx < r.w && yy < r.h && r.grid[yy][xx] !== 1 && r.grid[yy][xx] !== 12) {
          r.grid[yy][xx] = 11;
        }
      }
    }
  }

  // ---------------------------------------------------------
  // 1. COLORADO SPRINGS — EAST DISTRICT (Pure Organic Forest + Creek)
  // ---------------------------------------------------------
  function buildOverworld() {
    const w = 26, h = 20;
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const trees = [];
    const addTree = (tx, ty, kind) => {
      if (grid[ty][tx] === 0) { grid[ty][tx] = 2; trees.push({ tx, ty, kind }); }
    };

    for (let x = 0; x < w; x++) {
      addTree(x, 0, x % 2 === 0 ? "pine" : "oak");
      if (x <= 3 || x >= 22) addTree(x, 19, x % 2 === 0 ? "oak" : "pine");
      else grid[19][x] = 10;
    }
    for (let y = 1; y < h - 1; y++) {
      addTree(25, y, y % 2 === 0 ? "pine" : "oak");
      if (y !== 7 && y !== 8) grid[y][0] = 9;
    }
    [
      [1,1,"pine"],[2,1,"oak"],[3,1,"pine"],[1,2,"oak"],[4,1,"oak"],[8,1,"pine"],[9,1,"oak"],[9,2,"pine"],[10,1,"oak"],
      [14,1,"pine"],[15,1,"oak"],[16,1,"pine"],[15,2,"pine"],[22,1,"oak"],[23,1,"pine"],[24,1,"oak"],[23,2,"oak"],[24,2,"pine"],
      [24,4,"pine"],[23,5,"oak"],[24,5,"pine"],[24,10,"oak"],[23,11,"pine"],[24,11,"oak"],[24,16,"pine"],[23,17,"oak"],[24,17,"pine"],
      [2,17,"oak"],[3,18,"pine"],[5,18,"oak"],[11,18,"pine"],[12,17,"oak"],[18,18,"pine"],[20,17,"oak"],[22,18,"pine"],
      [1,5,"oak"],[1,10,"pine"],[1,16,"oak"]
    ].forEach(([tx, ty, k]) => addTree(tx, ty, k));

    [5, 6, 7].forEach(x => { grid[1][x] = 9; });
    [17, 18, 19, 20, 21].forEach(x => { grid[1][x] = 9; });
    [6, 7, 8, 9, 10].forEach(x => { grid[18][x] = 9; });

    for (let x = 0; x <= 24; x++) { grid[7][x] = 3; grid[8][x] = 3; }
    for (let x = 2; x <= 24; x++) { grid[14][x] = 3; grid[15][x] = 3; }
    for (let y = 7; y <= 15; y++) {
      grid[y][8] = 3; grid[y][9] = 3;
      grid[y][15] = 3; grid[y][16] = 3;
    }
    for (let y = 3; y <= 6; y++) { grid[y][12] = 3; grid[y][13] = 3; }

    grid[6][5] = 5; grid[6][19] = 5;
    grid[13][5] = 5; grid[13][12] = 5; grid[13][19] = 5;

    const buildings = [
      { id: "church", style: "church", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "church", destX: 7, destY: 11 },
      { id: "house", style: "house", tx: 17, ty: 3, tw: 5, th: 3, doorTx: 19, doorTy: 5, dest: "house", destX: 8, destY: 11 },
      { id: "hospital", style: "hospital", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "hospital", destX: 8, destY: 11 },
      { id: "bookstore", style: "bookstore", tx: 10, ty: 10, tw: 5, th: 3, doorTx: 12, doorTy: 12, dest: "bookstore", destX: 8, destY: 11 },
      { id: "party", style: "party", tx: 17, ty: 10, tw: 5, th: 3, doorTx: 19, doorTy: 12, dest: "party", destX: 7, destY: 9 }
    ];
    buildings.forEach(b => {
      for (let yy = b.ty; yy < b.ty + b.th; yy++) {
        for (let xx = b.tx; xx < b.tx + b.tw; xx++) grid[yy][xx] = (xx === b.doorTx && yy === b.doorTy) ? 4 : 1;
      }
    });

    const signs = [
      { tx: 7, ty: 6, text: "St. Jude Catholic Church — Memorial Service for the Huesic Family." },
      { tx: 17, ty: 6, text: "Menos Residence (412 Starlight Ln) — Jacob & Dr. Menos's Home." },
      { tx: 7, ty: 13, text: "Colorado Springs Medical Center — Open 24/7. Step inside for reception & free healing." },
      { tx: 14, ty: 13, text: "Barnes & Noble Booksellers & Café — Kids' Play Corner, Espresso Bar & 'Twilight Fireflies'." },
      { tx: 17, ty: 13, text: "Classmate's House — Bass-heavy party music is rattling the windows!" },
      { tx: 14, ty: 4, text: "North Trail to Limbach Park — Strange chills linger here after dark..." },
      { tx: 1, ty: 6, text: "◀ WESTSIDE DISTRICT: Colorado Springs High School, Sweet Tooth Candy Store & Neighborhood Houses!" }
    ];
    signs.forEach(s => { grid[s.ty][s.tx] = 1; });

    return {
      id: "overworld", name: "Colorado Springs (East)", w, h, floorType: "grass", grid, trees, buildings, signs,
      exits: [
        { tx: 0, ty: 7, tw: 1, dest: "westside", destX: 22, destY: 7 },
        { tx: 0, ty: 8, tw: 1, dest: "westside", destX: 22, destY: 8 }
      ],
      boundaryZones: [
        { tx: 24, ty: 7, pushX: -1, pushY: 0 }, { tx: 24, ty: 8, pushX: -1, pushY: 0 },
        { tx: 24, ty: 14, pushX: -1, pushY: 0 }, { tx: 24, ty: 15, pushX: -1, pushY: 0 }
      ],
      props: [
        { kind: "bush", tx: 2, ty: 6 }, { kind: "bush", tx: 22, ty: 6 },
        { kind: "bush", tx: 2, ty: 13 }, { kind: "bush", tx: 22, ty: 13 },
        { kind: "purg_crystal", tx: 10, ty: 5, purgOnly: true, interact: "lorePurgTown", label: "Astral Reaperian Tablet" }
      ],
      portals: [{ tx: 12, ty: 2, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 7, destY: 9, minQuest: 7 }],
      npcs: [
        { id: "detective", tx: 3, ty: 6, dir: "right", isHuman: true, routine: { type: "patrol", points: [[2, 6], [4, 6]], speed: 18, pause: 2.8 }, dialogue: [{ id: "detective", mood: "sad", text: "Detective Miller, CSPD. Forensics found Iris and Belladonna poison at the Huesic house... Have you checked the Hospital toxicology notes?" }] },
        { id: "suzanna", tx: 10, ty: 16, dir: "right", isHuman: true, routine: { type: "patrol", points: [[9, 16], [14, 16]], speed: 20, pause: 2.5 }, dialogue: [{ id: "suzanna", mood: "neutral", text: "Hello, Jacob! Walk west down Upper Avenue to visit Colorado Springs High School—Room 102 is open!" }] },
        { id: "lucia", tx: 11, ty: 4, dir: "down", routine: { type: "patrol", points: [[11, 4], [11, 6]], speed: 22, pause: 2.6 }, dialogue: [{ id: "lucia", mood: "intense", text: "(Scanning the tree line) ...Oh, hey kid. Just admiring the Colorado air. (Wait—is she wearing a crimson cloak pin under her jacket?)" }] },
        { id: "md_scout", tx: 6, ty: 16, dir: "right", purgOnly: true, routine: { type: "patrol", points: [[5, 16], [8, 16]], speed: 26, pause: 1.8 }, dialogue: [{ id: "md_scout", mood: "intense", text: "Whoa—a human walking in Purgatorio?! We Morte Discipuli patrol Colorado Springs unseen by mortal eyes!" }] },
        { id: "crista", tx: 21, ty: 6, dir: "down", minQuest: 7, maxQuest: 14, routine: { type: "patrol", points: [[20, 6], [22, 6]], speed: 22, pause: 2.0 }, dialogue: [{ id: "crista", mood: "happy", text: "Meow~ (Crista watches the street outside Jacob's house with piercing blue eyes.)" }] },
        { id: "letonin", tx: 12, ty: 8, dir: "down", minQuest: 15, maxQuest: 20, event: "epilogueReunion", routine: { type: "patrol", points: [[11, 8], [13, 8]], speed: 24, pause: 2.2 } },
        { id: "cyrine", tx: 14, ty: 8, dir: "left", minQuest: 15, maxQuest: 20, event: "epilogueReunion" }
      ]
    };
  }

  // ---------------------------------------------------------
  // 2. WESTSIDE DISTRICT (School, Sweet Tooth & Extra Houses)
  // ---------------------------------------------------------
  function buildWestside() {
    const w = 24, h = 18;
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const trees = [];
    const addTree = (tx, ty, kind) => {
      if (grid[ty][tx] === 0) { grid[ty][tx] = 2; trees.push({ tx, ty, kind }); }
    };

    for (let x = 0; x < w; x++) {
      addTree(x, 0, x % 2 === 0 ? "pine" : "oak");
      if (x <= 2 || x >= 21) addTree(x, 17, x % 2 === 0 ? "oak" : "pine");
      else grid[17][x] = 10;
    }
    for (let y = 1; y < h - 1; y++) {
      addTree(0, y, y % 2 === 0 ? "oak" : "pine");
      if (y !== 7 && y !== 8) grid[y][w - 1] = 9;
    }
    [
      [1,1,"pine"],[2,1,"oak"],[2,2,"pine"],[9,1,"oak"],[10,1,"pine"],[15,1,"oak"],[21,1,"pine"],[22,1,"oak"],[22,2,"pine"],
      [1,5,"oak"],[1,11,"pine"],[2,15,"oak"],[10,16,"pine"],[18,16,"oak"],[22,15,"pine"]
    ].forEach(([tx, ty, k]) => addTree(tx, ty, k));

    for (let x = 1; x <= 23; x++) { grid[7][x] = 3; grid[8][x] = 3; }
    for (let x = 2; x <= 21; x++) { grid[14][x] = 3; grid[15][x] = 3; }
    for (let y = 7; y <= 15; y++) {
      grid[y][9] = 3; grid[y][10] = 3;
      grid[y][16] = 3; grid[y][17] = 3;
    }
    grid[6][5] = 5; grid[6][13] = 5; grid[6][19] = 5; grid[13][5] = 5;

    const buildings = [
      { id: "school", style: "school", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "school", destX: 10, destY: 13 },
      { id: "neighbor_house", style: "neighbor_house", tx: 11, ty: 3, tw: 4, th: 3, doorTx: 13, doorTy: 5, dest: "neighbor_house", destX: 6, destY: 9 },
      { id: "neighbor_2", style: "house", tx: 17, ty: 3, tw: 4, th: 3, doorTx: 19, doorTy: 5, dest: "neighbor_2", destX: 6, destY: 9 },
      { id: "candy_shop", style: "candy_shop", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "candy_shop", destX: 7, destY: 11 }
    ];
    buildings.forEach(b => {
      for (let yy = b.ty; yy < b.ty + b.th; yy++) {
        for (let xx = b.tx; xx < b.tx + b.tw; xx++) grid[yy][xx] = (xx === b.doorTx && yy === b.doorTy) ? 4 : 1;
      }
    });

    const signs = [
      { tx: 7, ty: 6, text: "Colorado Springs High School — Enter to explore the Locker Hallway, AP Calculus (Rm 102) & Student Lounge!" },
      { tx: 7, ty: 13, text: "Sweet Tooth Candy Store — Free Truffle Samples, Lindor Dark Chocolate & Fresh Ice Cream!" },
      { tx: 14, ty: 6, text: "Henderson Residence — Neighborhood historian & antique collector." },
      { tx: 22, ty: 6, text: "EAST TO MAIN TOWN ▶ (Church, Jacob's House, Hospital, Barnes & Noble)" }
    ];
    signs.forEach(s => { grid[s.ty][s.tx] = 1; });

    return {
      id: "westside", name: "Westside (School & Mall)", w, h, floorType: "grass", grid, trees, buildings, signs,
      exits: [
        { tx: 23, ty: 7, tw: 1, dest: "overworld", destX: 1, destY: 7 },
        { tx: 23, ty: 8, tw: 1, dest: "overworld", destX: 1, destY: 8 }
      ],
      boundaryZones: [{ tx: 1, ty: 7, pushX: 1, pushY: 0 }, { tx: 1, ty: 8, pushX: 1, pushY: 0 }],
      props: [
        { kind: "bush", tx: 2, ty: 6 }, { kind: "bush", tx: 11, ty: 12 }, { kind: "bush", tx: 13, ty: 12 },
        { kind: "purg_crystal", tx: 12, ty: 11, purgOnly: true, interact: "lorePurgWestside", label: "Purgatorio Memory Shard" }
      ],
      portals: [],
      npcs: [
        { id: "student_a", tx: 6, ty: 9, dir: "right", isHuman: true, routine: { type: "patrol", points: [[5, 9], [8, 9]], speed: 20, pause: 2.2 }, dialogue: [{ id: "student_a", mood: "happy", text: "Hey Jacob! Did you hear two transfer students—Letonin and Emillia—are rumored to be enrolling next semester?" }] },
        { id: "student_b", tx: 13, ty: 13, dir: "left", isHuman: true, event: "sideQuestChocolate" }
      ]
    };
  }

  // ---------------------------------------------------------
  // 3. JACOB'S HOUSE — True Dynamic Multi-Wing Stardew Layout!
  //    4 Distinct Protruding Wings + Connecting Hallway (Zero Cubes!)
  // ---------------------------------------------------------
  function buildHouse() {
    const r = buildDynamicRoom(18, 14, "wood", [
      [2, 2, 7, 4, 7],   // Kitchen Wing (Top-Left, cream tile)
      [1, 7, 6, 4, 0],   // Living Room Wing (Bottom-Left, protruding west!)
      [7, 6, 3, 6, 0],   // Central Entry Hallway & Foyer
      [11, 2, 5, 3, 0],  // Walk-In Closet Alcove (Top-Right)
      [10, 3, 1, 1, 0],  // Hallway -> Closet Archway
      [11, 6, 6, 5, 0],  // Jacob's Bedroom Wing (Bottom-Right, protruding east!)
      [10, 8, 1, 2, 0],  // Hallway -> Bedroom Archway
      [13, 5, 1, 1, 0]   // Inner Bedroom <-> Closet Door
    ]);
    r.grid[12][8] = 4; r.grid[12][9] = 4;

    // Clean Tile 11 furniture collisions (NO black/green wall blocks behind furniture!)
    solid(r, 3, 2, 5, 1);  // Fridge + Brunch Counter
    solid(r, 7, 4, 2, 1);  // Dining table
    solid(r, 2, 7, 3, 1);  // Living Room Couch
    solid(r, 2, 10, 2, 1); // TV Stand
    solid(r, 1, 7, 1, 1);  // Floor Lamp
    solid(r, 11, 2, 2, 1); // Closet Rack
    solid(r, 15, 2, 1, 1); // Constellation Box
    solid(r, 14, 6, 2, 2); // Bed
    solid(r, 12, 10, 2, 1);// PC Desk
    solid(r, 16, 10, 1, 1);// Bedroom Lamp

    return {
      ...r, id: "house", name: "Jacob's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 8, ty: 11, tw: 2, dest: "overworld", destX: 19, destY: 6 }],
      props: [
        { kind: "rug", tx: 2, ty: 8, tw: 4, th: 2, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "rug", tx: 8, ty: 7, tw: 2, th: 3, color: "#92400e", inner: "#b45309" },
        { kind: "rug", tx: 12, ty: 7, tw: 2, th: 2, color: "#1e3a8a", inner: "#2563eb" },
        // Kitchen Wing
        { kind: "plant", tx: 2, ty: 2 }, { kind: "fridge", tx: 3, ty: 2 },
        { kind: "kitchen_counter", tx: 4, ty: 2 }, { kind: "dining_table", tx: 7, ty: 4 },
        // Living Room Wing
        { kind: "lamp", tx: 1, ty: 7 },
        { kind: "couch", tx: 2, ty: 7, interact: "sleep", label: "Living Room Couch" },
        { kind: "tv", tx: 2, ty: 10 }, { kind: "plant", tx: 1, ty: 10 },
        // Closet Wing
        { kind: "closet_rack", tx: 11, ty: 2, interact: "loreCloset", label: "Jacob's Closet" },
        { kind: "plaque", tx: 15, ty: 2, interact: "loreJacobDiary", label: "Constellation Box" },
        // Bedroom Wing
        { kind: "bed", tx: 14, ty: 6, interact: "sleep", label: "Jacob's Bed" },
        { kind: "pc_desk", tx: 12, ty: 10, interact: "playSnake", label: "Jacob's PC (SNAKE.EXE)" },
        { kind: "lamp", tx: 16, ty: 10 },
        { kind: "poison_trace", tx: 8, ty: 7, purgOnly: true, interact: "lorePurgHouse", label: "Black Envy Toxin Residue" },
        { kind: "exit_mat", tx: 8, ty: 11 }
      ],
      npcs: [
        { id: "navi", tx: 5, ty: 3, dir: "up", event: "naviHouse", activity: "cook", routine: { type: "patrol", points: [[4, 3], [7, 3]], speed: 22, pause: 2.4, faceAtStop: "up" } },
        { id: "mom", tx: 5, ty: 9, dir: "left", isHuman: true, routine: { type: "patrol", points: [[5, 9], [8, 9]], speed: 20, pause: 2.5 }, dialogue: [{ id: "mom", mood: "happy", text: "Navi's cooking smells amazing! Your bedroom PC is on in the right wing if you want to play SNAKE.EXE." }] },
        { id: "crista", tx: 8, ty: 8, dir: "down", minQuest: 6, maxQuest: 6, event: "snowCatCrista", routine: { type: "patrol", points: [[7, 8], [9, 8]], speed: 20, pause: 2.0 } }
      ]
    };
  }

  // ---------------------------------------------------------
  // 4. ST. JUDE CHURCH — Cross-Shaped Basilica Nave (Non-Cubic!)
  // ---------------------------------------------------------
  function buildChurch() {
    const r = buildDynamicRoom(16, 14, "stone", [
      [5, 2, 6, 3, 0],   // Altar Apse (Top Center Alcove!)
      [2, 5, 12, 5, 0],  // Wide Main Nave & Transept (Pews!)
      [6, 10, 4, 2, 0]   // Narrower Entry Vestibule
    ]);
    r.grid[12][7] = 4; r.grid[12][8] = 4;

    // Clean Tile 11 collisions for pews & altar flowers
    [5, 6, 8, 9].forEach(py => { solid(r, 2, py, 3, 1); solid(r, 11, py, 3, 1); });
    solid(r, 5, 2, 6, 1);

    return {
      ...r, id: "church", name: "St. Jude Church", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 11, tw: 2, dest: "overworld", destX: 5, destY: 6 }],
      props: [
        { kind: "rug", tx: 6, ty: 3, tw: 4, th: 8, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "altar", tx: 6, ty: 2 },
        { kind: "flower_stand", tx: 5, ty: 2 }, { kind: "flower_stand", tx: 10, ty: 2 },
        { kind: "plaque", tx: 10, ty: 3, interact: "loreChurchPlaque", label: "Memorial Plaque" },
        { kind: "candelabra", tx: 5, ty: 5 }, { kind: "candelabra", tx: 10, ty: 5 },
        { kind: "candelabra", tx: 5, ty: 8 }, { kind: "candelabra", tx: 10, ty: 8 },
        { kind: "pew", tx: 2, ty: 5 }, { kind: "pew", tx: 2, ty: 6 },
        { kind: "pew", tx: 2, ty: 8 }, { kind: "pew", tx: 2, ty: 9 },
        { kind: "pew", tx: 11, ty: 5 }, { kind: "pew", tx: 11, ty: 6 },
        { kind: "pew", tx: 11, ty: 8 }, { kind: "pew", tx: 11, ty: 9 },
        { kind: "exit_mat", tx: 7, ty: 11 }
      ],
      npcs: [
        { id: "cyrine", tx: 7, ty: 4, dir: "up", maxQuest: 0, event: "churchCyrine" },
        { id: "mourner", tx: 3, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "The Huesics sat in this pew every Sunday... Poor Cyrine shouldn't have to bear this alone." }] },
        { id: "mourner", tx: 3, ty: 9, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "Nobody in Colorado Springs has ever seen anything as cruel as what happened to their family." }] },
        { id: "mourner", tx: 12, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "Did you hear the church bells ringing at midnight last night? Nobody at the parish rang them..." }] },
        { id: "mourner", tx: 12, ty: 9, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "We're all praying for Cyrine. Thank you for staying by her side, Jacob." }] },
        { id: "spirit", tx: 8, ty: 3, dir: "down", purgOnly: true, dialogue: [{ id: "spirit", mood: "happy", text: "(A warm, glowing spirit whispers in Purgatorio) 'Tell Cyrine we are watching over her...'" }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 5. COLORADO SPRINGS HOSPITAL — Multi-Wing Medical Center!
  //    2 Distinct Exam Rooms + Centered Reception Lobby + Clean Props
  // ---------------------------------------------------------
  function buildHospital() {
    const r = buildDynamicRoom(18, 14, "tile", [
      [2, 2, 6, 4, 7],   // Exam Room 1 (Top-Left Wing)
      [10, 2, 6, 4, 7],  // Exam Room 2 (Top-Right Wing)
      [5, 6, 1, 2, 0],   // Left Doorway Corridor
      [12, 6, 1, 2, 0],  // Right Doorway Corridor
      [1, 8, 16, 4, 0]   // Wide Main Reception & Waiting Lobby
    ]);
    r.grid[12][8] = 4; r.grid[12][9] = 4;

    // Clean Tile 11 collisions (NO black/green wall tiles behind beds or chairs!)
    solid(r, 2, 3, 2, 2); solid(r, 4, 3, 1, 1); solid(r, 6, 2, 2, 1); // Exam 1
    solid(r, 14, 3, 2, 2); solid(r, 13, 3, 1, 1); solid(r, 10, 2, 1, 1); // Exam 2
    solid(r, 7, 9, 3, 1); // Centered Reception Desk
    solid(r, 2, 9, 2, 1); solid(r, 14, 9, 2, 1); // Waiting Chairs Left & Right

    return {
      ...r, id: "hospital", name: "Colorado Springs Hospital", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 8, ty: 11, tw: 2, dest: "overworld", destX: 5, destY: 13 }],
      props: [
        { kind: "hospital_bed", tx: 2, ty: 3 }, { kind: "med_machine", tx: 4, ty: 3 },
        { kind: "sink_counter", tx: 6, ty: 2 },
        { kind: "plaque", tx: 10, ty: 2, interact: "loreHospitalChart", label: "Toxicology Chart" },
        { kind: "med_machine", tx: 13, ty: 3 }, { kind: "hospital_bed", tx: 14, ty: 3 },
        { kind: "reception_desk", tx: 7, ty: 9, interact: "loreHospitalDesk", label: "Reception Desk" },
        { kind: "waiting_chair", tx: 2, ty: 9 }, { kind: "waiting_chair", tx: 3, ty: 9 },
        { kind: "waiting_chair", tx: 14, ty: 9 }, { kind: "waiting_chair", tx: 15, ty: 9 },
        { kind: "plant", tx: 1, ty: 10 }, { kind: "plant", tx: 16, ty: 10 },
        { kind: "lamp", tx: 1, ty: 8 }, { kind: "lamp", tx: 16, ty: 8 },
        { kind: "exit_mat", tx: 8, ty: 11 }
      ],
      npcs: [
        { id: "receptionist", tx: 8, ty: 8, dir: "down", isHuman: true, dialogue: [{ id: "receptionist", mood: "happy", text: "Welcome to Colorado Springs Hospital! Exam Room 1 (left corridor) has Dr. Menos for free healing, and Exam Room 2 (right corridor) has Nurse Maya!" }] },
        { id: "mom", tx: 5, ty: 4, dir: "down", isHuman: true, event: "hospitalHeal", routine: { type: "patrol", points: [[5, 4], [7, 4]], speed: 18, pause: 2.5 } },
        { id: "nurse", tx: 11, ty: 4, dir: "down", isHuman: true, dialogue: [{ id: "nurse", mood: "neutral", text: "Monitoring vitals in Exam Room 2! Check Dr. Menos's toxicology chart on the wall here." }] },
        { id: "patron", tx: 2, ty: 8, dir: "down", isHuman: true, dialogue: [{ id: "patron", mood: "neutral", text: "Waiting for my annual checkup—Dr. Menos is the best doctor in Colorado Springs!" }] },
        { id: "spirit", tx: 6, ty: 5, dir: "down", purgOnly: true, dialogue: [{ id: "spirit", mood: "neutral", text: "(A newly departed soul hovers peacefully) 'Waiting for the Reapers to guide me onward...'" }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 6. BARNES & NOBLE & CAFÉ — Dynamic 3-Zone Bookshop Wing!
  // ---------------------------------------------------------
  function buildBookstore() {
    const r = buildDynamicRoom(18, 14, "bookstore", [
      [2, 2, 8, 6, 0],   // Main Book Aisles Wing
      [1, 8, 5, 3, 0],   // Protruding Kids' Play Nook (Bottom-Left!)
      [6, 8, 4, 4, 0],   // Entry Foyer
      [10, 5, 1, 2, 7],  // Archway to Café
      [11, 3, 6, 7, 7]   // Protruding Café & Espresso Wing (Right!)
    ]);
    r.grid[12][7] = 4; r.grid[12][8] = 4;

    solid(r, 3, 2, 6, 1); solid(r, 3, 5, 6, 1); // Wide stocked bookshelves
    solid(r, 1, 8, 3, 1); solid(r, 2, 9, 1, 1); // Kids' Play fence & blocks
    solid(r, 12, 3, 3, 1); // Coffee Counter
    solid(r, 12, 7, 1, 1); solid(r, 15, 7, 1, 1); // Café Table Sets

    return {
      ...r, id: "bookstore", name: "Barnes & Noble & Café", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 11, tw: 2, dest: "overworld", destX: 12, destY: 13 }],
      props: [
        { kind: "play_mat", tx: 1, ty: 9, tw: 3, th: 2 },
        { kind: "play_fence", tx: 1, ty: 8 }, { kind: "play_fence", tx: 2, ty: 8 }, { kind: "play_fence", tx: 3, ty: 8 },
        { kind: "toy_blocks", tx: 2, ty: 9 },
        { kind: "rug", tx: 3, ty: 3, tw: 6, th: 2, color: "#14532d", inner: "#166534" },
        { kind: "bookshelf_wide", tx: 3, ty: 2, interact: "loreTwilightFireflies", label: "Twilight Fireflies Display" },
        { kind: "bookshelf_wide", tx: 6, ty: 2, interact: "loreSupernaturalNovels", label: "Supernatural Fiction Aisle" },
        { kind: "bookshelf_wide", tx: 3, ty: 5 }, { kind: "bookshelf_wide", tx: 6, ty: 5 },
        { kind: "coffee_counter", tx: 12, ty: 3, interact: "loreCafeBoard", label: "Café Espresso Bar" },
        { kind: "cafe_set", tx: 12, ty: 7 }, { kind: "cafe_set", tx: 15, ty: 7 },
        { kind: "lamp", tx: 2, ty: 2 }, { kind: "plant", tx: 16, ty: 3 }, { kind: "plant", tx: 16, ty: 9 },
        { kind: "purg_crystal", tx: 11, ty: 9, purgOnly: true, interact: "lorePurgBookstore", label: "Hidden Reaperian Text" },
        { kind: "exit_mat", tx: 7, ty: 11 }
      ],
      npcs: [
        { id: "clerk", tx: 13, ty: 4, dir: "down", isHuman: true, dialogue: [{ id: "clerk", mood: "happy", text: "Welcome to Barnes & Noble Café! We have fresh espresso, a Kids' Play Corner, and 'Twilight Fireflies' on the top-left aisle!" }] },
        { id: "patron", tx: 6, ty: 6, dir: "up", isHuman: true, routine: { type: "patrol", points: [[5, 6], [8, 6]], speed: 18, pause: 3.0 }, dialogue: [{ id: "patron", mood: "neutral", text: "These supernatural novels on the top-right shelf are wild—they describe Reapers altering human memories!" }] },
        { id: "barista", tx: 12, ty: 8, dir: "up", isHuman: true, dialogue: [{ id: "barista", mood: "happy", text: "Best caramel lattes in Colorado Springs! Grab a chair and stay awhile." }] },
        { id: "kid", tx: 3, ty: 10, dir: "left", isHuman: true, event: "kidPlaySection" },
        { id: "cyrine", tx: 6, ty: 4, dir: "down", minQuest: 1, maxQuest: 1, event: "bookstoreCyrine" },
        { id: "illicero", tx: 15, ty: 8, dir: "left", minQuest: 6, maxQuest: 13, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Told you I'd catch you at Barnes & Noble, Jacob. Grab a coffee and check the Supernatural aisle." }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 7. COLORADO SPRINGS HIGH SCHOOL — FULL MULTI-ROOM ZONE!
  //    Main Locker Hallway + Closed Doors (Physics/Latin/Gym) +
  //    AP Calculus Classroom (Rm 102) + Student Lounge Alcove!
  // ---------------------------------------------------------
  function buildSchool() {
    const r = buildDynamicRoom(22, 16, "tile", [
      [3, 2, 10, 6, 7],  // Room 102: AP Calculus Classroom (Top-Left/Center!)
      [15, 3, 5, 5, 0],  // Student Lounge & Vending Alcove (Top-Right!)
      [7, 8, 2, 1, 0],   // Classroom Doorway into Hallway
      [17, 8, 2, 1, 0],  // Lounge Archway into Hallway
      [2, 9, 18, 4, 0],  // Full East-West Locker Hallway!
      [9, 13, 3, 1, 0]   // Main School Entrance Vestibule
    ]);
    r.grid[14][10] = 4; r.grid[14][11] = 4;

    // Clean Tile 11 collisions (NO black/green wall bars behind desks!)
    solid(r, 5, 2, 4, 1);  // Front Chalkboard
    solid(r, 10, 3, 2, 1); // Teacher's Desk
    // 6 Clean Student Desks (2 rows x 3 cols)
    [5, 7].forEach(y => [4, 7, 10].forEach(x => solid(r, x, y, 1, 1)));
    // Hallway Lockers, Trophy Case, Fountain, Closed Doors, Vending Machine
    solid(r, 3, 9, 3, 1);   // Locker Row Left
    solid(r, 10, 9, 3, 1);  // Locker Row Mid
    solid(r, 14, 9, 2, 1);  // Trophy Case
    solid(r, 15, 3, 1, 1);  // Vending Machine
    solid(r, 17, 5, 1, 1);  // Lounge Table

    return {
      ...r, id: "school", name: "Colorado Springs High School", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 10, ty: 13, tw: 2, dest: "westside", destX: 5, destY: 6 }],
      props: [
        // AP Calculus Classroom (Room 102)
        { kind: "chalkboard", tx: 5, ty: 2, interact: "loreSchoolCalculus", label: "AP Calculus Chalkboard" },
        { kind: "teacher_desk", tx: 10, ty: 3 },
        { kind: "plaque", tx: 12, ty: 2, interact: "lorePromPoster", label: "Senior Prom Poster" },
        { kind: "school_desk", tx: 4, ty: 5 }, { kind: "school_desk", tx: 7, ty: 5 }, { kind: "school_desk", tx: 10, ty: 5 },
        { kind: "school_desk", tx: 4, ty: 7 }, { kind: "school_desk", tx: 7, ty: 7 }, { kind: "school_desk", tx: 10, ty: 7 },
        // Main Locker Hallway (Lockers + Closed Classroom Doors + Trophy Case + Water Fountain!)
        { kind: "closed_door", tx: 2, ty: 9, interact: "doorPhysics", label: "Room 101: Physics" },
        { kind: "locker_row", tx: 3, ty: 9 },
        { kind: "locker_row", tx: 10, ty: 9 },
        { kind: "trophy_case", tx: 14, ty: 9, interact: "loreTrophyCase", label: "CSHS Trophy Case" },
        { kind: "water_fountain", tx: 16, ty: 9 },
        { kind: "closed_door", tx: 19, ty: 9, interact: "doorGym", label: "Gymnasium Doors" },
        { kind: "closed_door", tx: 4, ty: 12, interact: "doorLatin", label: "Room 103: Latin" },
        // Student Lounge Alcove
        { kind: "vending_machine", tx: 15, ty: 3, interact: "vendingSnack", label: "Hallway Vending Machine" },
        { kind: "cafe_set", tx: 17, ty: 5 },
        { kind: "plant", tx: 19, ty: 3 },
        { kind: "exit_mat", tx: 10, ty: 13 }
      ],
      npcs: [
        { id: "suzanna", tx: 7, ty: 3, dir: "down", isHuman: true, dialogue: [{ id: "suzanna", mood: "happy", text: "Welcome to Room 102 AP Calculus, Jacob! Check the Prom Poster on the wall—Senior Year is going to be unforgettable." }] },
        { id: "student_a", tx: 5, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "student_a", mood: "neutral", text: "I heard Emillia's prom dress is champagne pink—don't tell her I told you!" }] },
        { id: "student_b", tx: 8, ty: 11, dir: "right", isHuman: true, routine: { type: "patrol", points: [[6, 11], [14, 11]], speed: 22, pause: 2.2 }, dialogue: [{ id: "student_b", mood: "happy", text: "Room 101 Physics is locked for lab prep, and the Gym is closed until Prom decorating starts!" }] },
        { id: "party_girl", tx: 17, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "party_girl", mood: "happy", text: "Grabbing a soda from the lounge vending machine between classes!" }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 8. SWEET TOOTH CANDY STORE — Lived-In L-Shaped Boutique!
  //    Staff Counter with Chloe Behind It, Tables, Customers &
  //    Dropped Melting Ice Cream Cone in the Corner!
  // ---------------------------------------------------------
  function buildCandyShop() {
    const r = buildDynamicRoom(16, 14, "candy", [
      [2, 2, 12, 6, 0],  // Main Candy Boutique & Staff Counter Wing
      [2, 8, 8, 4, 0],   // Café Seating & Entry Wing
      [10, 8, 4, 3, 0]   // Cozy Ice-Cream Corner Alcove (Dropped Cone!)
    ]);
    r.grid[12][6] = 4; r.grid[12][7] = 4;

    // Clean Tile 11 collisions
    solid(r, 5, 4, 4, 1);  // Wrap-around Service Counter (Chloe stands behind at y=3!)
    solid(r, 2, 2, 3, 1);  // Strawberry Truffle Case
    solid(r, 11, 2, 3, 1); // Lindor Dark Chocolate Case
    solid(r, 3, 9, 1, 1);  // Café Table Left
    solid(r, 9, 9, 1, 1);  // Café Table Right
    solid(r, 13, 8, 1, 1); // Gumball Machine

    return {
      ...r, id: "candy_shop", name: "Sweet Tooth Candy Store", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 6, ty: 11, tw: 2, dest: "westside", destX: 5, destY: 13 }],
      props: [
        { kind: "rug", tx: 5, ty: 6, tw: 4, th: 2, color: "#be185d", inner: "#f472b6" },
        { kind: "candy_case", tx: 2, ty: 2, interact: "candySample", label: "Strawberry Chocolate Truffles" },
        { kind: "candy_case", tx: 11, ty: 2, interact: "lindorPickup", label: "Lindor Dark Chocolate" },
        { kind: "service_counter", tx: 5, ty: 4, interact: "candyCounter", label: "Sweet Tooth Counter" },
        { kind: "cafe_set", tx: 3, ty: 9 }, { kind: "cafe_set", tx: 9, ty: 9 },
        { kind: "gumball", tx: 13, ty: 8 },
        { kind: "dropped_cone", tx: 12, ty: 10, interact: "droppedCone", label: "Dropped Ice Cream Cone" },
        { kind: "plant", tx: 2, ty: 10 }, { kind: "lamp", tx: 13, ty: 5 },
        { kind: "exit_mat", tx: 6, ty: 11 }
      ],
      npcs: [
        // Chloe works BEHIND the service counter!
        { id: "candy_clerk", tx: 7, ty: 3, dir: "down", isHuman: true, routine: { type: "patrol", points: [[6, 3], [8, 3]], speed: 16, pause: 2.6, faceAtStop: "down" }, dialogue: [{ id: "candy_clerk", mood: "happy", text: "Welcome to Sweet Tooth! Grab a free strawberry-jam truffle sample on the left case, or Lindor Dark Chocolate on the right—and oops, I gotta mop up that dropped cone in the corner!" }] },
        { id: "kid", tx: 11, ty: 9, dir: "down", isHuman: true, dialogue: [{ id: "kid", mood: "sad", text: "Aw man... I dropped my strawberry-vanilla ice cream cone in the corner! Don't step in it!" }] },
        { id: "patron", tx: 4, ty: 7, dir: "up", isHuman: true, dialogue: [{ id: "patron", mood: "happy", text: "Best candy store in the whole Colorado Springs mall! Their dark chocolate truffles are unreal." }] }
      ]
    };
  }

  function buildParty() {
    const r = buildDynamicRoom(16, 12, "party", [
      [1, 2, 14, 9, 0]
    ]);
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    solid(r, 6, 2, 3, 1); solid(r, 2, 3, 3, 1); solid(r, 11, 3, 3, 1); solid(r, 2, 8, 3, 1);
    return {
      ...r, id: "party", name: "Classmate's Party House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 13 }],
      props: [
        { kind: "disco_ball", tx: 7, ty: 5 }, { kind: "dj_booth", tx: 6, ty: 2 },
        { kind: "party_table", tx: 2, ty: 3 }, { kind: "party_table", tx: 11, ty: 3 },
        { kind: "couch", tx: 2, ty: 8 }, { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "sendex", tx: 7, ty: 4, dir: "down", maxQuest: 5, event: "partyBattle" },
        { id: "navi", tx: 5, ty: 6, dir: "up", maxQuest: 6, dialogue: [{ id: "navi", mood: "intense", text: "Stay behind me, Jacob—Sendex is right ahead!" }] },
        { id: "illicero", tx: 9, ty: 6, dir: "up", maxQuest: 6, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Relax, kid. Navi and I have your back." }] },
        { id: "cyrine", tx: 12, ty: 7, dir: "left", activity: "dance", dialogue: [{ id: "cyrine", mood: "happy", text: "Come on Jacob, live a little! The music's awesome!" }] },
        { id: "party_guy", tx: 7, ty: 3, dir: "down", isHuman: true, activity: "dance", dialogue: [{ id: "party_guy", mood: "happy", text: "YO! Welcome to the Senior kickoff party! Grab a drink at the snack table!" }] },
        { id: "party_girl", tx: 11, ty: 5, dir: "left", isHuman: true, activity: "dance", dialogue: [{ id: "party_girl", mood: "happy", text: "Wait, who's that hot blond guy vaping by the kitchen? He's totally my type!" }] },
        { id: "student_a", tx: 3, ty: 5, dir: "right", isHuman: true, activity: "dance", dialogue: [{ id: "student_a", mood: "happy", text: "This bass is shaking the whole block! Glad you came, Jacob!" }] },
        { id: "student_b", tx: 13, ty: 8, dir: "up", isHuman: true, activity: "dance", dialogue: [{ id: "student_b", mood: "happy", text: "Someone just broke a bottle on the front lawn—classic Saturday night!" }] }
      ]
    };
  }

  function buildNeighborHouse() {
    const r = buildDynamicRoom(14, 11, "wood", [
      [1, 2, 7, 5, 0], [8, 3, 5, 6, 0], [4, 7, 4, 3, 0]
    ]);
    r.grid[10][5] = 4; r.grid[10][6] = 4;
    solid(r, 2, 2, 2, 1); solid(r, 9, 3, 2, 1);
    return {
      ...r, id: "neighbor_house", name: "Mr. Henderson's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 5, ty: 9, tw: 2, dest: "westside", destX: 13, destY: 6 }],
      props: [
        { kind: "rug", tx: 3, ty: 4, tw: 4, th: 2, color: "#14532d", inner: "#166534" },
        { kind: "bookshelf", tx: 2, ty: 2, interact: "loreNeighborHistory", label: "Colorado Springs Folklore" },
        { kind: "dining_table", tx: 9, ty: 3 },
        { kind: "lamp", tx: 1, ty: 2 }, { kind: "plant", tx: 12, ty: 3 },
        { kind: "exit_mat", tx: 5, ty: 9 }
      ],
      npcs: [
        { id: "neighbor", tx: 6, ty: 5, dir: "down", isHuman: true, dialogue: [{ id: "neighbor", mood: "happy", text: "Ah, Jacob! Check my bookshelf on the top-left—I've been collecting old Colorado Springs legends about winged shadows near Limbach Park!" }] }
      ]
    };
  }

  function buildNeighbor2() {
    const r = buildDynamicRoom(14, 11, "wood", [
      [1, 2, 12, 5, 0], [4, 7, 6, 3, 0]
    ]);
    r.grid[10][6] = 4; r.grid[10][7] = 4;
    solid(r, 2, 3, 3, 1); solid(r, 10, 3, 1, 1);
    return {
      ...r, id: "neighbor_2", name: "Retro Arcade Loft", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 6, ty: 9, tw: 2, dest: "westside", destX: 19, destY: 6 }],
      props: [
        { kind: "rug", tx: 4, ty: 5, tw: 5, th: 2, color: "#581c87", inner: "#7c3aed" },
        { kind: "couch", tx: 2, ty: 3 },
        { kind: "arcade_cab", tx: 10, ty: 3, interact: "playSnake", label: "Retro SNAKE.EXE Cabinet" },
        { kind: "lamp", tx: 1, ty: 2 }, { kind: "plant", tx: 12, ty: 2 },
        { kind: "exit_mat", tx: 6, ty: 9 }
      ],
      npcs: [
        { id: "party_guy", tx: 7, ty: 5, dir: "down", isHuman: true, dialogue: [{ id: "party_guy", mood: "happy", text: "Yo! Welcome to my arcade loft! Try scoring 30+ on SNAKE.EXE to complete the Arcade Champion side quest!" }] }
      ]
    };
  }

  function buildDream() {
    const w = 16, h = 12;
    const grid = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => (x >= 5 && x <= 10 && y >= 4 && y <= 9) ? 0 : 10)
    );
    const trees = [
      { tx: 5, ty: 4, kind: "cherry" }, { tx: 10, ty: 4, kind: "cherry" },
      { tx: 5, ty: 9, kind: "cherry" }, { tx: 10, ty: 9, kind: "cherry" }
    ];
    trees.forEach(t => { grid[t.ty][t.tx] = 2; });
    return {
      id: "dream", name: "Letonin's Dream Realm", w, h, floorType: "dream", grid, trees, buildings: [], signs: [], exits: [],
      portals: [{ tx: 7, ty: 9, style: "dream", label: "WAKE UP", dest: "house", destX: 8, destY: 8 }],
      props: [],
      npcs: [{ id: "letonin", tx: 7, ty: 5, dir: "down", event: "dreamLetonin" }]
    };
  }

  function buildPark() {
    const r = buildDynamicRoom(16, 13, "park", [[1, 2, 14, 10, 0]]);
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
    const r = buildDynamicRoom(16, 13, "desert", [[1, 2, 14, 10, 0]]);
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
        { id: "vrotney", tx: 4, ty: 10, dir: "right", dialogue: [{ id: "vrotney", mood: "happy", text: "Vrotney, Letonin's division! I shuttled you across the sky to get here—our Morte Discipuli are holding off Crepsus's perimeter!" }] },
        { id: "damian", tx: 11, ty: 10, dir: "left", dialogue: [{ id: "damian", mood: "intense", text: "Damian, Illicero's elite faction from Sydney! Master Kain manifested me into celestial brass knuckles earlier—we've got your flank covered!" }] },
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
    westside: buildWestside(),
    house: buildHouse(),
    church: buildChurch(),
    hospital: buildHospital(),
    bookstore: buildBookstore(),
    party: buildParty(),
    school: buildSchool(),
    candy_shop: buildCandyShop(),
    neighbor_house: buildNeighborHouse(),
    neighbor_2: buildNeighbor2(),
    dream: buildDream(),
    park: buildPark(),
    fortress: buildFortress()
  };
})();
