// =========================================================
// scripts/maps.js — v8: Pure Organic Tree Perimeters (No City Wall),
//                   Auto-Oriented Fences & Exact Sketch-Matched
//                   Stardew Valley Interiors
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

  // Tile Legend for Overworlds:
  // 0 = grass, 1 = building/sign, 2 = tree, 3 = 2-lane asphalt road,
  // 4 = doorway, 5 = concrete sidewalk, 9 = auto-oriented wooden fence, 10 = creek/lake water

  // ---------------------------------------------------------
  // 1. COLORADO SPRINGS — EAST DISTRICT (Pure Organic Forest + Creek)
  // ---------------------------------------------------------
  function buildOverworld() {
    const w = 26, h = 20;
    const grid = Array.from({ length: h }, () => Array(w).fill(0));
    const trees = [];
    const addTree = (tx, ty, kind) => {
      if (grid[ty][tx] === 0) {
        grid[ty][tx] = 2;
        trees.push({ tx, ty, kind });
      }
    };

    // Outer Organic Forest Perimeter (NO city wall! Pure layered pine & oak trees)
    for (let x = 0; x < w; x++) {
      addTree(x, 0, x % 2 === 0 ? "pine" : "oak");
      if (x <= 3 || x >= 22) addTree(x, 19, x % 2 === 0 ? "oak" : "pine");
      else grid[19][x] = 10; // Monument Creek water along southern edge
    }
    for (let y = 1; y < h - 1; y++) {
      addTree(25, y, y % 2 === 0 ? "pine" : "oak");
      if (y !== 7 && y !== 8) grid[y][0] = 9; // Vertical auto-oriented fence on west edge
    }

    // Wiggly interior-edge tree depth (staggered 1-3 tiles deep so it's never a straight box!)
    [
      [1,1,"pine"],[2,1,"oak"],[3,1,"pine"],[1,2,"oak"],[4,1,"oak"],[8,1,"pine"],[9,1,"oak"],[9,2,"pine"],[10,1,"oak"],
      [14,1,"pine"],[15,1,"oak"],[16,1,"pine"],[15,2,"pine"],[22,1,"oak"],[23,1,"pine"],[24,1,"oak"],[23,2,"oak"],[24,2,"pine"],
      [24,4,"pine"],[23,5,"oak"],[24,5,"pine"],[24,10,"oak"],[23,11,"pine"],[24,11,"oak"],[24,16,"pine"],[23,17,"oak"],[24,17,"pine"],
      [2,17,"oak"],[3,18,"pine"],[5,18,"oak"],[11,18,"pine"],[12,17,"oak"],[18,18,"pine"],[20,17,"oak"],[22,18,"pine"],
      [1,5,"oak"],[1,10,"pine"],[1,16,"oak"]
    ].forEach(([tx, ty, k]) => addTree(tx, ty, k));

    // Horizontal yard fences
    [5, 6, 7].forEach(x => { grid[1][x] = 9; });
    [17, 18, 19, 20, 21].forEach(x => { grid[1][x] = 9; });
    [6, 7, 8, 9, 10].forEach(x => { grid[18][x] = 9; });

    // Clean 2-Lane Asphalt Avenues & Boulevards
    for (let x = 0; x <= 24; x++) { grid[7][x] = 3; grid[8][x] = 3; }
    for (let x = 2; x <= 24; x++) { grid[14][x] = 3; grid[15][x] = 3; }
    for (let y = 7; y <= 15; y++) {
      grid[y][8] = 3; grid[y][9] = 3;
      grid[y][15] = 3; grid[y][16] = 3;
    }
    for (let y = 3; y <= 6; y++) { grid[y][12] = 3; grid[y][13] = 3; }

    // Concrete Front-Door Sidewalks
    grid[6][5] = 5; grid[6][19] = 5;
    grid[13][5] = 5; grid[13][12] = 5; grid[13][19] = 5;

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
      { tx: 14, ty: 13, text: "Barnes & Noble Booksellers & Café — Kids' Play Corner, Espresso Bar & 'Twilight Fireflies'." },
      { tx: 17, ty: 13, text: "Classmate's House — Bass-heavy party music is rattling the windows!" },
      { tx: 14, ty: 4, text: "North Trail to Limbach Park — Strange chills linger here after dark..." },
      { tx: 1, ty: 6, text: "◀ WESTSIDE DISTRICT: Colorado Springs High School, Mall Candy Store & Neighborhood Houses!" }
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
        { id: "suzanna", tx: 10, ty: 16, dir: "right", isHuman: true, routine: { type: "patrol", points: [[9, 16], [14, 16]], speed: 20, pause: 2.5 }, dialogue: [{ id: "suzanna", mood: "neutral", text: "Hello, Jacob! Walk west down Upper Avenue to visit Colorado Springs High School—I left a Calculus study sheet on the chalkboard!" }] },
        { id: "lucia", tx: 11, ty: 4, dir: "down", routine: { type: "patrol", points: [[11, 4], [11, 6]], speed: 22, pause: 2.6 }, dialogue: [{ id: "lucia", mood: "intense", text: "(Scanning the tree line) ...Oh, hey kid. Just admiring the Colorado air. (Wait—is she wearing a crimson cloak pin under her jacket?)" }] },
        { id: "md_scout", tx: 6, ty: 16, dir: "right", purgOnly: true, routine: { type: "patrol", points: [[5, 16], [8, 16]], speed: 26, pause: 1.8 }, dialogue: [{ id: "md_scout", mood: "intense", text: "Whoa—a human walking in Purgatorio?! We Morte Discipuli patrol Colorado Springs unseen by mortal eyes!" }] },
        { id: "crista", tx: 21, ty: 6, dir: "down", minQuest: 7, maxQuest: 14, routine: { type: "patrol", points: [[20, 6], [22, 6]], speed: 22, pause: 2.0 }, dialogue: [{ id: "crista", mood: "happy", text: "Meow~ (Crista watches the street outside Jacob's house with piercing blue eyes.)" }] },
        { id: "letonin", tx: 12, ty: 8, dir: "down", minQuest: 15, maxQuest: 20, event: "epilogueReunion", routine: { type: "patrol", points: [[11, 8], [13, 8]], speed: 24, pause: 2.2 } },
        { id: "cyrine", tx: 14, ty: 8, dir: "left", minQuest: 15, maxQuest: 20, event: "epilogueReunion" }
      ]
    };
  }

  // ---------------------------------------------------------
  // 2. WESTSIDE DISTRICT (Pure Organic Forest + Creek — No City Wall!)
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
      if (y !== 7 && y !== 8) grid[y][w - 1] = 9; // Vertical auto-oriented fence on east border
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
      { id: "school", style: "school", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "school", destX: 7, destY: 9 },
      { id: "neighbor_house", style: "neighbor_house", tx: 11, ty: 3, tw: 4, th: 3, doorTx: 13, doorTy: 5, dest: "neighbor_house", destX: 6, destY: 9 },
      { id: "neighbor_2", style: "house", tx: 17, ty: 3, tw: 4, th: 3, doorTx: 19, doorTy: 5, dest: "neighbor_2", destX: 6, destY: 9 },
      { id: "candy_shop", style: "candy_shop", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "candy_shop", destX: 7, destY: 9 }
    ];
    buildings.forEach(b => {
      for (let yy = b.ty; yy < b.ty + b.th; yy++) {
        for (let xx = b.tx; xx < b.tx + b.tw; xx++) grid[yy][xx] = (xx === b.doorTx && yy === b.doorTy) ? 4 : 1;
      }
    });

    const signs = [
      { tx: 7, ty: 6, text: "Colorado Springs High School — Home of the Seniors! Prom is right around the corner." },
      { tx: 7, ty: 13, text: "Sweet Tooth Candy Store (Mall Plaza) — Free Chocolate Truffle Samples & Lindor Dark Chocolate!" },
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
  // 3. JACOB'S HOUSE — Exact 4-Room Stardew Layout from Sketch!
  //    Top-Left: Kitchen | Bottom-Left: Living Room
  //    Top-Right: Closet | Bottom-Right: Bedroom
  // ---------------------------------------------------------
  function buildHouse() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;

    // Kitchen Cream Tile Zone (Top-Left: x=1..8, y=2..4)
    for (let y = 2; y <= 4; y++) for (let x = 1; x <= 8; x++) r.grid[y][x] = 7;

    // Horizontal Wall separating Kitchen (top-left) & Living Room (bottom-left) at y = 5
    for (let x = 1; x <= 5; x++) r.grid[5][x] = 6;

    // Vertical Wall separating Right Wing (Closet + Bedroom) from Central Hall at x = 10
    for (let y = 2; y <= 10; y++) {
      if (y !== 3 && y !== 7) r.grid[y][10] = 6; // Doorway at y=3 (Closet) & y=7 (Bedroom)!
    }
    // Horizontal Wall separating Closet (top-right) & Bedroom (bottom-right) at y = 5
    for (let x = 11; x <= 14; x++) {
      if (x !== 12) r.grid[5][x] = 6; // Inner closet door at x=12!
    }

    // Collisions
    // Kitchen
    r.grid[2][2] = 1; // Fridge
    r.grid[2][3] = 1; r.grid[2][4] = 1; r.grid[2][5] = 1; r.grid[2][6] = 1; // Brunch counter
    r.grid[4][7] = 1; r.grid[4][8] = 1; // Dining table
    // Living Room (Bottom-Left)
    r.grid[6][2] = 1; r.grid[6][3] = 1; r.grid[6][4] = 1; // Couch facing TV
    r.grid[9][2] = 1; r.grid[9][3] = 1; // TV stand
    r.grid[6][1] = 1; // Floor lamp
    // Closet (Top-Right)
    r.grid[2][11] = 1; r.grid[2][12] = 1; // Clothes rack
    r.grid[2][14] = 1; // Storage chest / plaque
    // Bedroom (Bottom-Right)
    r.grid[6][13] = 1; r.grid[7][13] = 1; r.grid[6][14] = 1; r.grid[7][14] = 1; // Bed
    r.grid[9][11] = 1; r.grid[9][12] = 1; // Bedroom PC Desk (SNAKE.EXE)
    r.grid[9][14] = 1; // Nightstand lamp

    return {
      ...r, id: "house", name: "Jacob's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 6 }],
      props: [
        // Warm Stardew Rugs
        { kind: "rug", tx: 2, ty: 7, tw: 4, th: 2, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "rug", tx: 7, ty: 6, tw: 2, th: 3, color: "#92400e", inner: "#b45309" },
        { kind: "rug", tx: 11, ty: 7, tw: 2, th: 2, color: "#1e3a8a", inner: "#2563eb" },
        // Kitchen (Top-Left)
        { kind: "plant", tx: 1, ty: 2 },
        { kind: "fridge", tx: 2, ty: 2 },
        { kind: "kitchen_counter", tx: 3, ty: 2 },
        { kind: "dining_table", tx: 7, ty: 4 },
        // Living Room (Bottom-Left)
        { kind: "lamp", tx: 1, ty: 6 },
        { kind: "couch", tx: 2, ty: 6, interact: "sleep", label: "Living Room Couch" },
        { kind: "tv", tx: 2, ty: 9 },
        { kind: "plant", tx: 1, ty: 9 },
        // Closet (Top-Right)
        { kind: "closet_rack", tx: 11, ty: 2, interact: "loreCloset", label: "Jacob's Closet" },
        { kind: "plaque", tx: 14, ty: 2, interact: "loreJacobDiary", label: "Constellation Box" },
        // Bedroom (Bottom-Right)
        { kind: "bed", tx: 13, ty: 6, interact: "sleep", label: "Jacob's Bed" },
        { kind: "pc_desk", tx: 11, ty: 9, interact: "playSnake", label: "Jacob's PC (SNAKE.EXE)" },
        { kind: "lamp", tx: 14, ty: 9 },
        // Purgatorio-ONLY Envy poison residue
        { kind: "poison_trace", tx: 8, ty: 7, purgOnly: true, interact: "lorePurgHouse", label: "Black Envy Toxin Residue" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "navi", tx: 4, ty: 3, dir: "up", event: "naviHouse", activity: "cook", routine: { type: "patrol", points: [[3, 3], [6, 3]], speed: 22, pause: 2.4, faceAtStop: "up" } },
        { id: "mom", tx: 5, ty: 8, dir: "left", isHuman: true, routine: { type: "patrol", points: [[5, 8], [7, 8], [7, 7]], speed: 20, pause: 2.5 }, dialogue: [{ id: "mom", mood: "happy", text: "Navi's cooking smells amazing! Your bedroom PC is on in the bottom-right room if you want to play SNAKE.EXE." }] },
        { id: "crista", tx: 7, ty: 6, dir: "down", minQuest: 6, maxQuest: 6, event: "snowCatCrista", routine: { type: "patrol", points: [[6, 6], [8, 6]], speed: 20, pause: 2.0 } }
      ]
    };
  }

  // ---------------------------------------------------------
  // 4. ST. JUDE CHURCH — Exact Sketch Match: Mourners Seated in
  //    Pews, Aisle Candelabras, Altar Flowers & Plaque!
  // ---------------------------------------------------------
  function buildChurch() {
    const r = makeRoom(16, 12, "stone");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    [4, 5, 7, 8].forEach(py => {
      for (let x = 2; x <= 4; x++) r.grid[py][x] = 1;
      for (let x = 11; x <= 13; x++) r.grid[py][x] = 1;
    });
    r.grid[2][5] = 1; r.grid[2][10] = 1;

    return {
      ...r, id: "church", name: "St. Jude Church", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 6 }],
      props: [
        { kind: "rug", tx: 6, ty: 3, tw: 4, th: 7, color: "#7f1d1d", inner: "#991b1b" },
        { kind: "altar", tx: 6, ty: 2 },
        { kind: "flower_stand", tx: 5, ty: 2 }, { kind: "flower_stand", tx: 10, ty: 2 },
        { kind: "plaque", tx: 11, ty: 2, interact: "loreChurchPlaque", label: "Memorial Plaque" },
        // Golden Aisle Candelabras lining the red carpet!
        { kind: "candelabra", tx: 5, ty: 4 }, { kind: "candelabra", tx: 10, ty: 4 },
        { kind: "candelabra", tx: 5, ty: 7 }, { kind: "candelabra", tx: 10, ty: 7 },
        { kind: "candelabra", tx: 5, ty: 9 }, { kind: "candelabra", tx: 10, ty: 9 },
        // 8 Pews (4 rows per side)
        { kind: "pew", tx: 2, ty: 4 }, { kind: "pew", tx: 2, ty: 5 },
        { kind: "pew", tx: 2, ty: 7 }, { kind: "pew", tx: 2, ty: 8 },
        { kind: "pew", tx: 11, ty: 4 }, { kind: "pew", tx: 11, ty: 5 },
        { kind: "pew", tx: 11, ty: 7 }, { kind: "pew", tx: 11, ty: 8 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "cyrine", tx: 7, ty: 4, dir: "up", maxQuest: 0, event: "churchCyrine" },
        // Mourners seated right in the pews + aisle!
        { id: "mourner", tx: 3, ty: 5, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "The Huesics sat in this pew every Sunday... Poor Cyrine shouldn't have to bear this alone." }] },
        { id: "mourner", tx: 3, ty: 8, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "Nobody in Colorado Springs has ever seen anything as cruel as what happened to their family." }] },
        { id: "mourner", tx: 12, ty: 5, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "Did you hear the church bells ringing at midnight last night? Nobody at the parish rang them..." }] },
        { id: "mourner", tx: 12, ty: 8, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "We're all praying for Cyrine. Thank you for staying by her side, Jacob." }] },
        { id: "spirit", tx: 8, ty: 3, dir: "down", purgOnly: true, dialogue: [{ id: "spirit", mood: "happy", text: "(A warm, glowing spirit whispers in Purgatorio) 'Tell Cyrine we are watching over her...'" }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 5. COLORADO SPRINGS HOSPITAL — Exact Sketch Match!
  //    2 Separate Exam Rooms (Left & Right doors!) + Centered
  //    Reception Desk + Waiting Chairs on BOTH Left & Right!
  // ---------------------------------------------------------
  function buildHospital() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 5; y++) for (let x = 1; x <= 14; x++) r.grid[y][x] = 7;

    // Solid center wall dividing Exam Room 1 (left) & Exam Room 2 (right)
    for (let y = 2; y <= 5; y++) r.grid[y][8] = 6;
    // Horizontal wall dividing Lobby & Exam Wing with TWO separate doors (x=4 & x=11)!
    for (let x = 1; x <= 14; x++) {
      if (x !== 4 && x !== 11) r.grid[6][x] = 6;
    }

    // Exam Room 1 (Left) & Exam Room 2 (Right) Props Collision
    r.grid[3][2] = 1; r.grid[4][2] = 1; r.grid[3][3] = 1; r.grid[4][3] = 1;
    r.grid[3][5] = 1; // ECG 1
    r.grid[2][6] = 1; r.grid[2][7] = 1; // Sink 1
    r.grid[3][12] = 1; r.grid[4][12] = 1; r.grid[3][13] = 1; r.grid[4][13] = 1;
    r.grid[3][10] = 1; // ECG 2
    r.grid[2][9] = 1;  // Toxicology Chart

    // Lobby: CENTERED Reception Desk (x=6..8, y=8) + Waiting Chairs Left (2..3) & Right (12..13)!
    r.grid[8][6] = 1; r.grid[8][7] = 1; r.grid[8][8] = 1;
    r.grid[8][2] = 1; r.grid[8][3] = 1;
    r.grid[8][12] = 1; r.grid[8][13] = 1;

    return {
      ...r, id: "hospital", name: "Colorado Springs Hospital", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 13 }],
      props: [
        // Exam Room 1 (Left)
        { kind: "hospital_bed", tx: 2, ty: 3 }, { kind: "med_machine", tx: 5, ty: 3 },
        { kind: "sink_counter", tx: 6, ty: 2 },
        // Exam Room 2 (Right)
        { kind: "plaque", tx: 9, ty: 2, interact: "loreHospitalChart", label: "Toxicology Chart" },
        { kind: "med_machine", tx: 10, ty: 3 }, { kind: "hospital_bed", tx: 12, ty: 3 },
        // Lobby (Centered Reception Desk + Left & Right Waiting Areas + Corner Plants!)
        { kind: "reception_desk", tx: 6, ty: 8, interact: "loreHospitalDesk", label: "Reception Desk" },
        { kind: "waiting_chair", tx: 2, ty: 8 }, { kind: "waiting_chair", tx: 3, ty: 8 },
        { kind: "waiting_chair", tx: 12, ty: 8 }, { kind: "waiting_chair", tx: 13, ty: 8 },
        { kind: "plant", tx: 1, ty: 9 }, { kind: "plant", tx: 14, ty: 9 },
        { kind: "lamp", tx: 1, ty: 7 }, { kind: "lamp", tx: 14, ty: 7 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "receptionist", tx: 7, ty: 7, dir: "down", isHuman: true, dialogue: [{ id: "receptionist", mood: "happy", text: "Welcome to Colorado Springs Hospital! Exam Room 1 (left door) has Dr. Menos for free healing, and Exam Room 2 (right door) has Nurse Maya!" }] },
        { id: "mom", tx: 4, ty: 4, dir: "down", isHuman: true, event: "hospitalHeal", routine: { type: "patrol", points: [[4, 4], [6, 4]], speed: 18, pause: 2.5 } },
        { id: "nurse", tx: 11, ty: 4, dir: "down", isHuman: true, dialogue: [{ id: "nurse", mood: "neutral", text: "Monitoring vitals in Exam Room 2! Check Dr. Menos's toxicology chart on the top-left wall here." }] },
        { id: "patron", tx: 2, ty: 7, dir: "down", isHuman: true, dialogue: [{ id: "patron", mood: "neutral", text: "Waiting for my annual checkup—Dr. Menos is the best doctor in Colorado Springs!" }] },
        { id: "spirit", tx: 5, ty: 5, dir: "down", purgOnly: true, dialogue: [{ id: "spirit", mood: "neutral", text: "(A newly departed soul hovers peacefully) 'Waiting for the Reapers to guide me onward...'" }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 6. BARNES & NOBLE & CAFÉ — Exact Sketch Match!
  //    Continuous Wide Bookshelves + Enclosed Kids' Play Section +
  //    Partitioned Café Corner with Chairs Around Tables!
  // ---------------------------------------------------------
  function buildBookstore() {
    const r = makeRoom(16, 12, "bookstore");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 9; y++) for (let x = 10; x <= 14; x++) r.grid[y][x] = 7;

    // Vertical Stardew Wall separating Bookstore & Café at x = 9 (with wide archway at y = 5..6!)
    for (let y = 2; y <= 9; y++) {
      if (y !== 5 && y !== 6) r.grid[y][9] = 6;
    }

    // Continuous Wide Bookshelves (x=2..7, NO empty gap!)
    for (let x = 2; x <= 7; x++) { r.grid[2][x] = 1; r.grid[5][x] = 1; }
    // Kids' Play Corner low divider along y = 7 (x=1..3, open entrance at x=4!)
    for (let x = 1; x <= 3; x++) r.grid[7][x] = 1;
    r.grid[8][2] = 1; // Toy blocks
    // Café Counter & Café Table Sets
    r.grid[2][11] = 1; r.grid[2][12] = 1; r.grid[2][13] = 1;
    r.grid[6][11] = 1; r.grid[6][13] = 1;

    return {
      ...r, id: "bookstore", name: "Barnes & Noble & Café", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 12, destY: 13 }],
      props: [
        // Kids' Play Section (enclosed by low colorful play_fence!)
        { kind: "play_mat", tx: 1, ty: 8, tw: 3, th: 2 },
        { kind: "play_fence", tx: 1, ty: 7 }, { kind: "play_fence", tx: 2, ty: 7 }, { kind: "play_fence", tx: 3, ty: 7 },
        { kind: "toy_blocks", tx: 2, ty: 8 },
        { kind: "rug", tx: 2, ty: 3, tw: 6, th: 2, color: "#14532d", inner: "#166534" },
        // Continuous Wide Stocked Bookshelves (zero awkward gap!)
        { kind: "bookshelf_wide", tx: 2, ty: 2, interact: "loreTwilightFireflies", label: "Twilight Fireflies Display" },
        { kind: "bookshelf_wide", tx: 5, ty: 2, interact: "loreSupernaturalNovels", label: "Supernatural Fiction Aisle" },
        { kind: "bookshelf_wide", tx: 2, ty: 5 },
        { kind: "bookshelf_wide", tx: 5, ty: 5 },
        // Café Corner (Espresso Bar + Café Tables WITH Chairs!)
        { kind: "coffee_counter", tx: 11, ty: 2, interact: "loreCafeBoard", label: "Café Espresso Bar" },
        { kind: "cafe_set", tx: 11, ty: 6 }, { kind: "cafe_set", tx: 13, ty: 6 },
        { kind: "lamp", tx: 1, ty: 2 }, { kind: "plant", tx: 14, ty: 2 }, { kind: "plant", tx: 14, ty: 9 },
        { kind: "purg_crystal", tx: 10, ty: 8, purgOnly: true, interact: "lorePurgBookstore", label: "Hidden Reaperian Text" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "clerk", tx: 12, ty: 3, dir: "down", isHuman: true, dialogue: [{ id: "clerk", mood: "happy", text: "Welcome to Barnes & Noble Café! We have fresh espresso, a Kids' Play Corner, and 'Twilight Fireflies' on the top-left aisle!" }] },
        { id: "patron", tx: 5, ty: 6, dir: "up", isHuman: true, routine: { type: "patrol", points: [[4, 6], [7, 6]], speed: 18, pause: 3.0 }, dialogue: [{ id: "patron", mood: "neutral", text: "These supernatural novels on the top-right shelf are wild—they describe Reapers altering human memories!" }] },
        { id: "barista", tx: 11, ty: 7, dir: "up", isHuman: true, dialogue: [{ id: "barista", mood: "happy", text: "Best caramel lattes in Colorado Springs! Grab a chair and stay awhile." }] },
        { id: "kid", tx: 3, ty: 9, dir: "left", isHuman: true, event: "kidPlaySection" },
        { id: "cyrine", tx: 5, ty: 4, dir: "down", minQuest: 1, maxQuest: 1, event: "bookstoreCyrine" },
        { id: "illicero", tx: 13, ty: 7, dir: "left", minQuest: 6, maxQuest: 13, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Told you I'd catch you at Barnes & Noble, Jacob. Grab a coffee and check the Supernatural aisle." }] }
      ]
    };
  }

  function buildParty() {
    const r = makeRoom(16, 12, "party");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][4] = 1;
    r.grid[3][11] = 1; r.grid[3][12] = 1; r.grid[3][13] = 1;
    r.grid[8][2] = 1; r.grid[8][3] = 1; r.grid[8][4] = 1;
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

  function buildSchool() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 6; y++) for (let x = 1; x <= 14; x++) r.grid[y][x] = 7;
    r.grid[2][5] = 1; r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1;
    r.grid[2][1] = 1; r.grid[2][2] = 1; r.grid[2][3] = 1;
    [4, 6].forEach(y => [4, 7, 10].forEach(x => { r.grid[y][x] = 1; }));
    return {
      ...r, id: "school", name: "Colorado Springs High School", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "westside", destX: 5, destY: 6 }],
      props: [
        { kind: "locker_row", tx: 1, ty: 2 },
        { kind: "chalkboard", tx: 5, ty: 2, interact: "loreSchoolCalculus", label: "Mrs. Suzanna's Calculus Board" },
        { kind: "plaque", tx: 12, ty: 2, interact: "lorePromPoster", label: "Senior Prom Poster" },
        { kind: "school_desk", tx: 4, ty: 4 }, { kind: "school_desk", tx: 7, ty: 4 }, { kind: "school_desk", tx: 10, ty: 4 },
        { kind: "school_desk", tx: 4, ty: 6 }, { kind: "school_desk", tx: 7, ty: 6 }, { kind: "school_desk", tx: 10, ty: 6 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "suzanna", tx: 7, ty: 3, dir: "down", isHuman: true, dialogue: [{ id: "suzanna", mood: "happy", text: "Welcome to Calculus, Jacob! Check the Prom Poster on the wall—Senior Year is going to be unforgettable." }] },
        { id: "student_a", tx: 5, ty: 5, dir: "up", isHuman: true, dialogue: [{ id: "student_a", mood: "neutral", text: "I heard Emillia's prom dress is champagne pink—don't tell her I told you!" }] }
      ]
    };
  }

  function buildCandyShop() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 9; y++) for (let x = 1; x <= 14; x++) if ((x + y) % 2 === 0) r.grid[y][x] = 7;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][4] = 1;
    r.grid[3][10] = 1; r.grid[3][11] = 1; r.grid[3][12] = 1;
    r.grid[7][3] = 1; r.grid[7][11] = 1;
    return {
      ...r, id: "candy_shop", name: "Sweet Tooth Candy Store", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "westside", destX: 5, destY: 13 }],
      props: [
        { kind: "candy_case", tx: 2, ty: 3, interact: "candySample", label: "Strawberry Chocolate Truffles" },
        { kind: "candy_case", tx: 10, ty: 3, interact: "lindorPickup", label: "Lindor Dark Chocolate" },
        { kind: "cafe_set", tx: 3, ty: 7 }, { kind: "cafe_set", tx: 11, ty: 7 },
        { kind: "lamp", tx: 1, ty: 2 }, { kind: "plant", tx: 14, ty: 2 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "candy_clerk", tx: 7, ty: 4, dir: "down", isHuman: true, dialogue: [{ id: "candy_clerk", mood: "happy", text: "Hello! Try our free strawberry-jam chocolate truffle sample on the left, or grab Lindor Dark Chocolate on the right!" }] }
      ]
    };
  }

  function buildNeighborHouse() {
    const r = makeRoom(14, 11, "wood");
    r.grid[10][6] = 4; r.grid[10][7] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1;
    r.grid[3][9] = 1; r.grid[3][10] = 1;
    return {
      ...r, id: "neighbor_house", name: "Mr. Henderson's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 6, ty: 9, tw: 2, dest: "westside", destX: 13, destY: 6 }],
      props: [
        { kind: "rug", tx: 4, ty: 4, tw: 5, th: 3, color: "#14532d", inner: "#166534" },
        { kind: "bookshelf", tx: 2, ty: 3, interact: "loreNeighborHistory", label: "Colorado Springs Folklore" },
        { kind: "dining_table", tx: 9, ty: 3 },
        { kind: "lamp", tx: 1, ty: 2 }, { kind: "plant", tx: 12, ty: 2 },
        { kind: "exit_mat", tx: 6, ty: 9 }
      ],
      npcs: [
        { id: "neighbor", tx: 6, ty: 5, dir: "down", isHuman: true, dialogue: [{ id: "neighbor", mood: "happy", text: "Ah, Jacob! Check my bookshelf on the left—I've been collecting old Colorado Springs legends about winged shadows near Limbach Park!" }] }
      ]
    };
  }

  function buildNeighbor2() {
    const r = makeRoom(14, 11, "wood");
    r.grid[10][6] = 4; r.grid[10][7] = 4;
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][4] = 1;
    r.grid[3][10] = 1;
    return {
      ...r, id: "neighbor_2", name: "Retro Arcade Loft", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 6, ty: 9, tw: 2, dest: "westside", destX: 19, destY: 6 }],
      props: [
        { kind: "rug", tx: 4, ty: 5, tw: 5, th: 3, color: "#581c87", inner: "#7c3aed" },
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
      portals: [{ tx: 7, ty: 9, style: "dream", label: "WAKE UP", dest: "house", destX: 5, destY: 6 }],
      props: [],
      npcs: [{ id: "letonin", tx: 7, ty: 5, dir: "down", event: "dreamLetonin" }]
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
