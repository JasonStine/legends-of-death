// =========================================================
// scripts/maps.js — v7: Organic Perimeters + Distant City,
//                   2nd Overworld District (Westside: High School
//                   & Candy Store), Extra Houses, Dense Interiors
//                   & Intimate Dream Realm Island
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
  // 0 = grass, 1 = solid/building/sign, 2 = tree, 3 = 2-lane asphalt road,
  // 4 = doorway, 5 = concrete sidewalk, 8 = distant city skyline,
  // 9 = wooden fence, 10 = shimmering water/creek

  // ---------------------------------------------------------
  // 1. COLORADO SPRINGS — MAIN DISTRICT (Organic Edge + Distant City)
  // ---------------------------------------------------------
  function buildOverworld() {
    const w = 26, h = 20;
    const grid = Array.from({ length: h }, () => Array(w).fill(0));

    // Top edge: Distant Colorado Springs skyline & hills (y = 0)
    for (let x = 0; x < w; x++) grid[0][x] = 8;
    // Bottom edge: Shimmering Monument Creek + Distant City (y = 19)
    for (let x = 0; x < w; x++) grid[19][x] = (x >= 4 && x <= 21) ? 10 : 8;
    // Right edge: Distant City skyline (x = 25)
    for (let y = 0; y < h; y++) grid[y][25] = 8;
    // Left edge: Wooden fence & forest (x = 0) EXCEPT Westside Avenue exit (y = 7..8)!
    for (let y = 1; y < h - 1; y++) {
      if (y !== 7 && y !== 8) grid[y][0] = 9;
    }

    // Organic Wiggly Tree Clusters (staggered 1-3 tiles deep — NO straight box!)
    const trees = [
      // North organic treeline
      { tx: 1, ty: 1, kind: "pine" }, { tx: 2, ty: 1, kind: "oak" }, { tx: 3, ty: 1, kind: "pine" },
      { tx: 1, ty: 2, kind: "oak" },  { tx: 4, ty: 1, kind: "oak" }, { tx: 8, ty: 1, kind: "pine" },
      { tx: 9, ty: 1, kind: "oak" },  { tx: 9, ty: 2, kind: "pine" }, { tx: 10, ty: 1, kind: "oak" },
      { tx: 14, ty: 1, kind: "pine" }, { tx: 15, ty: 1, kind: "oak" }, { tx: 16, ty: 1, kind: "pine" },
      { tx: 15, ty: 2, kind: "pine" }, { tx: 22, ty: 1, kind: "oak" }, { tx: 23, ty: 1, kind: "pine" },
      { tx: 24, ty: 1, kind: "oak" },  { tx: 23, ty: 2, kind: "oak" }, { tx: 24, ty: 2, kind: "pine" },
      // East staggered forest edge
      { tx: 24, ty: 4, kind: "pine" }, { tx: 23, ty: 5, kind: "oak" }, { tx: 24, ty: 5, kind: "pine" },
      { tx: 24, ty: 10, kind: "oak" }, { tx: 23, ty: 11, kind: "pine" }, { tx: 24, ty: 11, kind: "oak" },
      { tx: 24, ty: 16, kind: "pine" }, { tx: 23, ty: 17, kind: "oak" }, { tx: 24, ty: 17, kind: "pine" },
      // South creek-side wiggly trees
      { tx: 2, ty: 17, kind: "oak" },  { tx: 3, ty: 18, kind: "pine" }, { tx: 5, ty: 18, kind: "oak" },
      { tx: 11, ty: 18, kind: "pine" }, { tx: 12, ty: 17, kind: "oak" }, { tx: 18, ty: 18, kind: "pine" },
      { tx: 20, ty: 17, kind: "oak" }, { tx: 22, ty: 18, kind: "pine" },
      // West edge accents
      { tx: 1, ty: 5, kind: "oak" }, { tx: 1, ty: 10, kind: "pine" }, { tx: 1, ty: 16, kind: "oak" }
    ];
    trees.forEach(t => { grid[t.ty][t.tx] = 2; });

    // Wooden neighborhood fences framing yards organically
    [5, 6, 7].forEach(x => { grid[1][x] = 9; });
    [17, 18, 19, 20, 21].forEach(x => { grid[1][x] = 9; });
    [6, 7, 8, 9, 10].forEach(x => { grid[18][x] = 9; });

    // Upper Avenue (y = 7..8) extends to x = 0 (Westside District!) and x = 24 (Outer City!)
    for (let x = 0; x <= 24; x++) { grid[7][x] = 3; grid[8][x] = 3; }
    // Lower Avenue (y = 14..15)
    for (let x = 2; x <= 24; x++) { grid[14][x] = 3; grid[15][x] = 3; }
    // Vertical Boulevards
    for (let y = 7; y <= 15; y++) {
      grid[y][8] = 3; grid[y][9] = 3;
      grid[y][15] = 3; grid[y][16] = 3;
    }
    // North Trail to Limbach Park
    for (let y = 3; y <= 6; y++) { grid[y][12] = 3; grid[y][13] = 3; }

    // Concrete Front-Door Sidewalks (Tile 5)
    grid[6][5] = 5;   // St. Jude Church
    grid[6][19] = 5;  // Jacob's House
    grid[13][5] = 5;  // Hospital
    grid[13][12] = 5; // Barnes & Noble
    grid[13][19] = 5; // Party House
    grid[16][15] = 5; // Extra Neighbor House front walkway

    // 6 Buildings (5 Story Landmarks + 1 Extra Enterable Neighbor House!)
    const buildings = [
      { id: "church", style: "church", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "church", destX: 7, destY: 9 },
      { id: "house", style: "house", tx: 17, ty: 3, tw: 5, th: 3, doorTx: 19, doorTy: 5, dest: "house", destX: 7, destY: 9 },
      { id: "hospital", style: "hospital", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "hospital", destX: 7, destY: 9 },
      { id: "bookstore", style: "bookstore", tx: 10, ty: 10, tw: 5, th: 3, doorTx: 12, doorTy: 12, dest: "bookstore", destX: 7, destY: 9 },
      { id: "party", style: "party", tx: 17, ty: 10, tw: 5, th: 3, doorTx: 19, doorTy: 12, dest: "party", destX: 7, destY: 9 },
      { id: "neighbor_house", style: "neighbor_house", tx: 13, ty: 16, tw: 4, th: 2, doorTx: 15, doorTy: 17, dest: "neighbor_house", destX: 6, destY: 8 }
    ];
    // Fix neighbor_house door to face north onto Lower Avenue or south; let's place Neighbor House cleanly at (13..16, 16..17) with door at (15,17) and walkway at (15,18)? Better: put Neighbor House at (2, 16) or (20, 16) facing south? No, all doors face south, so let's put Neighbor House at (10, 3)?? No, x=12 is North Trail. Let's place Neighbor House at (2, 3)?? Church is 3..7.
    // Cleanest spot: Right next to Barnes & Noble? No, Lower Ave is y=14..15, so y=16..18 has space! Let's put a short paved loop or put Neighbor House in the Westside District + one at (6, 16) with door at (7, 17)? Even cleaner: put Neighbor House at (20, 3) -> shift Jacob's House to (16, 3)? Wait: East Blvd is 15..16. So (17..21, 3..5) is Jacob's House.
    // Let's keep all 5 buildings clean and put Neighbor House #1 at (2, 16..17) with a walkway up? No, front doors face south! So let's remove neighbor_house from y=16 and instead put TWO extra enterable houses + High School + Candy Store in the huge new WESTSIDE District right next door!
    buildings.pop();
    grid[16][15] = 0;

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
      id: "overworld",
      name: "Colorado Springs (East)",
      w, h, floorType: "grass", grid, trees, buildings, signs,
      // Walk west at x=0 (y=7..8) to seamlessly enter the NEW Westside District!
      exits: [
        { tx: 0, ty: 7, tw: 1, dest: "westside", destX: 22, destY: 7 },
        { tx: 0, ty: 8, tw: 1, dest: "westside", destX: 22, destY: 8 }
      ],
      // Quest-tied boundary triggers on outer East city roads!
      boundaryZones: [
        { tx: 24, ty: 7, pushX: -1, pushY: 0 },
        { tx: 24, ty: 8, pushX: -1, pushY: 0 },
        { tx: 24, ty: 14, pushX: -1, pushY: 0 },
        { tx: 24, ty: 15, pushX: -1, pushY: 0 }
      ],
      props: [
        { kind: "bush", tx: 2, ty: 6 }, { kind: "bush", tx: 22, ty: 6 },
        { kind: "bush", tx: 2, ty: 13 }, { kind: "bush", tx: 22, ty: 13 },
        { kind: "purg_crystal", tx: 10, ty: 5, purgOnly: true, interact: "lorePurgTown", label: "Astral Reaperian Tablet" }
      ],
      portals: [
        { tx: 12, ty: 2, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 7, destY: 9, minQuest: 7 }
      ],
      npcs: [
        {
          id: "detective", tx: 3, ty: 6, dir: "right", isHuman: true,
          routine: { type: "patrol", points: [[2, 6], [4, 6]], speed: 18, pause: 2.8 },
          dialogue: [{ id: "detective", mood: "sad", text: "Detective Miller, CSPD. Forensics found Iris and Belladonna poison at the Huesic house... Have you checked the Hospital toxicology notes?" }]
        },
        {
          id: "suzanna", tx: 10, ty: 16, dir: "right", isHuman: true,
          routine: { type: "patrol", points: [[9, 16], [14, 16]], speed: 20, pause: 2.5 },
          dialogue: [{ id: "suzanna", mood: "neutral", text: "Hello, Jacob! Walk west down Upper Avenue to visit Colorado Springs High School—I left a Calculus study sheet on the chalkboard!" }]
        },
        {
          id: "lucia", tx: 11, ty: 4, dir: "down",
          routine: { type: "patrol", points: [[11, 4], [11, 6]], speed: 22, pause: 2.6 },
          dialogue: [{ id: "lucia", mood: "intense", text: "(Scanning the tree line) ...Oh, hey kid. Just admiring the Colorado air. (Wait—is she wearing a crimson cloak pin under her jacket?)" }]
        },
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
  // 2. NEW SECOND OVERWORLD DISTRICT: WESTSIDE (High School,
  //    Mall Candy Store & 2 Extra Enterable Neighbor Houses!)
  // ---------------------------------------------------------
  function buildWestside() {
    const w = 24, h = 18;
    const grid = Array.from({ length: h }, () => Array(w).fill(0));

    // Organic perimeter: Distant City skyline on North & West, Creek on South
    for (let x = 0; x < w; x++) { grid[0][x] = 8; grid[17][x] = (x >= 3 && x <= 20) ? 10 : 8; }
    for (let y = 0; y < h; y++) {
      grid[y][0] = 8;
      if (y !== 7 && y !== 8) grid[y][w - 1] = 9;
    }

    const trees = [
      { tx: 1, ty: 1, kind: "pine" }, { tx: 2, ty: 1, kind: "oak" }, { tx: 2, ty: 2, kind: "pine" },
      { tx: 9, ty: 1, kind: "oak" },  { tx: 10, ty: 1, kind: "pine" }, { tx: 15, ty: 1, kind: "oak" },
      { tx: 21, ty: 1, kind: "pine" }, { tx: 22, ty: 1, kind: "oak" }, { tx: 22, ty: 2, kind: "pine" },
      { tx: 1, ty: 5, kind: "oak" },  { tx: 1, ty: 11, kind: "pine" }, { tx: 2, ty: 15, kind: "oak" },
      { tx: 10, ty: 16, kind: "pine" }, { tx: 18, ty: 16, kind: "oak" }, { tx: 22, ty: 15, kind: "pine" }
    ];
    trees.forEach(t => { grid[t.ty][t.tx] = 2; });

    // Clean 2-Avenue Westside Roads
    for (let x = 1; x <= 23; x++) { grid[7][x] = 3; grid[8][x] = 3; }
    for (let x = 2; x <= 21; x++) { grid[14][x] = 3; grid[15][x] = 3; }
    for (let y = 7; y <= 15; y++) {
      grid[y][9] = 3; grid[y][10] = 3;
      grid[y][16] = 3; grid[y][17] = 3;
    }

    // Front-door sidewalks ONLY
    grid[6][5] = 5;   // Colorado Springs High School
    grid[6][13] = 5;  // Neighbor House #1 (Mr. Henderson)
    grid[6][19] = 5;  // Neighbor House #2 (Retro Arcade Loft)
    grid[13][5] = 5;  // Sweet Tooth Mall Candy Store

    const buildings = [
      { id: "school", style: "school", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "school", destX: 7, destY: 9 },
      { id: "neighbor_house", style: "neighbor_house", tx: 11, ty: 3, tw: 4, th: 3, doorTx: 13, doorTy: 5, dest: "neighbor_house", destX: 6, destY: 9 },
      { id: "neighbor_2", style: "house", tx: 17, ty: 3, tw: 4, th: 3, doorTx: 19, doorTy: 5, dest: "neighbor_2", destX: 6, destY: 9 },
      { id: "candy_shop", style: "candy_shop", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "candy_shop", destX: 7, destY: 9 }
    ];
    buildings.forEach(b => {
      for (let yy = b.ty; yy < b.ty + b.th; yy++) {
        for (let xx = b.tx; xx < b.tx + b.tw; xx++) {
          grid[yy][xx] = (xx === b.doorTx && yy === b.doorTy) ? 4 : 1;
        }
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
      id: "westside",
      name: "Westside (School & Mall)",
      w, h, floorType: "grass", grid, trees, buildings, signs,
      exits: [
        { tx: 23, ty: 7, tw: 1, dest: "overworld", destX: 1, destY: 7 },
        { tx: 23, ty: 8, tw: 1, dest: "overworld", destX: 1, destY: 8 }
      ],
      boundaryZones: [
        { tx: 1, ty: 7, pushX: 1, pushY: 0 },
        { tx: 1, ty: 8, pushX: 1, pushY: 0 }
      ],
      props: [
        { kind: "bush", tx: 2, ty: 6 }, { kind: "bush", tx: 11, ty: 12 }, { kind: "bush", tx: 13, ty: 12 },
        { kind: "purg_crystal", tx: 12, ty: 11, purgOnly: true, interact: "lorePurgWestside", label: "Purgatorio Memory Shard" }
      ],
      portals: [],
      npcs: [
        {
          id: "student_a", tx: 6, ty: 9, dir: "right", isHuman: true,
          routine: { type: "patrol", points: [[5, 9], [8, 9]], speed: 20, pause: 2.2 },
          dialogue: [{ id: "student_a", mood: "happy", text: "Hey Jacob! Did you hear two transfer students—Letonin and Emillia—are rumored to be enrolling next semester?" }]
        },
        {
          id: "student_b", tx: 13, ty: 13, dir: "left", isHuman: true, event: "sideQuestChocolate"
        }
      ]
    };
  }

  // ---------------------------------------------------------
  // 3. REVAMPED DENSE INTERIORS (Zero Empty Space!)
  // ---------------------------------------------------------
  function buildHouse() {
    const r = makeRoom(16, 12, "wood");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 4; y++) for (let x = 4; x <= 9; x++) r.grid[y][x] = 7;
    for (let y = 2; y <= 10; y++) if (y !== 6 && y !== 7) r.grid[y][10] = 6;

    // Furniture collision
    r.grid[4][2] = 1; r.grid[4][3] = 1; r.grid[4][4] = 1;
    r.grid[2][4] = 1; r.grid[2][5] = 1; r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1;
    r.grid[5][7] = 1; r.grid[5][8] = 1; // Dining table
    r.grid[2][11] = 1; r.grid[2][12] = 1; // PC Desk
    r.grid[3][13] = 1; r.grid[4][13] = 1; r.grid[3][14] = 1; r.grid[4][14] = 1; // Bed
    r.grid[2][14] = 1; // Nightstand
    r.grid[8][11] = 1; r.grid[8][12] = 1; // Bedroom bookshelf

    return {
      ...r, id: "house", name: "Jacob's House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 6 }],
      props: [
        { kind: "rug", tx: 2, ty: 5, tw: 4, th: 3, color: "#312e81", inner: "#4338ca" },
        { kind: "rug", tx: 11, ty: 5, tw: 3, th: 3, color: "#1e3a8a", inner: "#2563eb" },
        { kind: "couch", tx: 2, ty: 4, interact: "sleep", label: "Living Room Couch" },
        { kind: "tv", tx: 3, ty: 8 },
        { kind: "plant", tx: 1, ty: 2 },
        { kind: "fridge", tx: 4, ty: 2 },
        { kind: "kitchen_counter", tx: 5, ty: 2 },
        { kind: "dining_table", tx: 7, ty: 5 },
        { kind: "pc_desk", tx: 11, ty: 2, interact: "playSnake", label: "Jacob's PC (SNAKE.EXE)" },
        { kind: "nightstand", tx: 14, ty: 2 },
        { kind: "bed", tx: 13, ty: 3, interact: "sleep", label: "Jacob's Bed" },
        { kind: "bookshelf", tx: 11, ty: 8, interact: "loreJacobDiary", label: "Jacob's Constellation Journal" },
        { kind: "plant", tx: 14, ty: 9 },
        { kind: "poison_trace", tx: 6, ty: 6, purgOnly: true, interact: "lorePurgHouse", label: "Black Envy Toxin Residue" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        {
          id: "navi", tx: 6, ty: 3, dir: "up", event: "naviHouse", activity: "cook",
          routine: { type: "patrol", points: [[5, 3], [8, 3]], speed: 22, pause: 2.4, faceAtStop: "up" }
        },
        {
          id: "mom", tx: 5, ty: 7, dir: "right", isHuman: true,
          routine: { type: "patrol", points: [[5, 7], [8, 7], [8, 8]], speed: 20, pause: 2.5 },
          dialogue: [{ id: "mom", mood: "happy", text: "Navi's brunch smells heavenly! Your bedroom PC is on in the next room if you want to play SNAKE.EXE, Jacob." }]
        },
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
        { kind: "pew", tx: 2, ty: 4 }, { kind: "pew", tx: 2, ty: 5 },
        { kind: "pew", tx: 2, ty: 7 }, { kind: "pew", tx: 2, ty: 8 },
        { kind: "pew", tx: 11, ty: 4 }, { kind: "pew", tx: 11, ty: 5 },
        { kind: "pew", tx: 11, ty: 7 }, { kind: "pew", tx: 11, ty: 8 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "cyrine", tx: 7, ty: 4, dir: "up", maxQuest: 0, event: "churchCyrine" },
        { id: "mourner", tx: 5, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "The Huesics sat in the front pew every Sunday... Poor Cyrine shouldn't have to bear this alone." }] },
        { id: "mourner", tx: 10, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "mourner", mood: "sad", text: "Did you hear the church bells ringing at midnight last night? Nobody at the parish rang them..." }] },
        { id: "spirit", tx: 8, ty: 3, dir: "down", purgOnly: true, dialogue: [{ id: "spirit", mood: "happy", text: "(A warm, glowing spirit whispers in Purgatorio) 'Tell Cyrine we are watching over her... Even in death, a family's love never fades.'" }] }
      ]
    };
  }

  function buildHospital() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 5; y++) for (let x = 1; x <= 14; x++) r.grid[y][x] = 7;
    // Horizontal divider between Lobby & Back Wing + Vertical divider between Exam Bay 1 & 2!
    for (let x = 1; x <= 14; x++) if (x !== 7 && x !== 8) r.grid[6][x] = 6;
    for (let y = 2; y <= 4; y++) r.grid[y][8] = 6; // Separates Exam Bay 1 (left) & Exam Bay 2 (right)!

    r.grid[3][2] = 1; r.grid[4][2] = 1; r.grid[3][3] = 1; r.grid[4][3] = 1;
    r.grid[3][4] = 1;
    r.grid[3][12] = 1; r.grid[4][12] = 1; r.grid[3][13] = 1; r.grid[4][13] = 1;
    r.grid[3][11] = 1;
    r.grid[2][5] = 1; r.grid[2][6] = 1; // Sink counter
    r.grid[2][9] = 1;
    r.grid[8][2] = 1; r.grid[8][3] = 1; r.grid[8][4] = 1;
    r.grid[8][12] = 1; r.grid[8][13] = 1;

    return {
      ...r, id: "hospital", name: "Colorado Springs Hospital", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 5, destY: 13 }],
      props: [
        { kind: "hospital_bed", tx: 2, ty: 3 }, { kind: "med_machine", tx: 4, ty: 3 },
        { kind: "sink_counter", tx: 5, ty: 2 },
        { kind: "hospital_bed", tx: 12, ty: 3 }, { kind: "med_machine", tx: 11, ty: 3 },
        { kind: "plaque", tx: 9, ty: 2, interact: "loreHospitalChart", label: "Toxicology Chart" },
        { kind: "reception_desk", tx: 2, ty: 8, interact: "loreHospitalDesk", label: "Reception Computer" },
        { kind: "waiting_chair", tx: 12, ty: 8 }, { kind: "waiting_chair", tx: 13, ty: 8 },
        { kind: "plant", tx: 1, ty: 7 }, { kind: "plant", tx: 14, ty: 7 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "receptionist", tx: 3, ty: 7, dir: "down", isHuman: true, dialogue: [{ id: "receptionist", mood: "happy", text: "Welcome to Colorado Springs Hospital! Dr. Menos is in Exam Bay 1 & 2 through the double doors—free healing anytime!" }] },
        { id: "mom", tx: 6, ty: 4, dir: "down", isHuman: true, event: "hospitalHeal", routine: { type: "patrol", points: [[5, 4], [7, 4]], speed: 20, pause: 2.4 } },
        { id: "nurse", tx: 10, ty: 4, dir: "right", isHuman: true, dialogue: [{ id: "nurse", mood: "neutral", text: "Vitals look steady in Exam Bay 2! Check the wall chart behind me if you want Dr. Menos's toxicology notes." }] },
        { id: "spirit", tx: 5, ty: 5, dir: "down", purgOnly: true, dialogue: [{ id: "spirit", mood: "neutral", text: "(A newly departed soul hovers peacefully) 'Waiting for the Reapers to guide me onward...'" }] }
      ]
    };
  }

  // BARNES & NOBLE — 6 Stocked Bookshelves + KIDS' PLAY SECTION + Café Corner!
  function buildBookstore() {
    const r = makeRoom(16, 12, "bookstore");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 9; y++) for (let x = 10; x <= 14; x++) r.grid[y][x] = 7;

    // 6 Stocked Bookshelves (3 rows x 2 columns!)
    [2, 3].forEach(x => { r.grid[2][x] = 1; r.grid[5][x] = 1; });
    [6, 7].forEach(x => { r.grid[2][x] = 1; r.grid[5][x] = 1; });
    r.grid[2][11] = 1; r.grid[2][12] = 1; r.grid[2][13] = 1; // Café Counter
    r.grid[6][11] = 1; r.grid[6][13] = 1; // Café Tables
    r.grid[8][2] = 1; // Toy blocks in Kids' Play Section

    return {
      ...r, id: "bookstore", name: "Barnes & Noble & Café", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 12, destY: 13 }],
      props: [
        // Kids' Play Section (bottom-left corner!)
        { kind: "play_mat", tx: 1, ty: 8, tw: 3, th: 2 },
        { kind: "toy_blocks", tx: 2, ty: 8 },
        { kind: "rug", tx: 4, ty: 3, tw: 5, th: 2, color: "#14532d", inner: "#166534" },
        // Dense Stocked Book Aisles
        { kind: "bookshelf", tx: 2, ty: 2, interact: "loreTwilightFireflies", label: "Twilight Fireflies Display" },
        { kind: "bookshelf", tx: 6, ty: 2, interact: "loreSupernaturalNovels", label: "Supernatural Fiction Aisle" },
        { kind: "bookshelf", tx: 2, ty: 5 },
        { kind: "bookshelf", tx: 6, ty: 5 },
        // Café Corner
        { kind: "coffee_counter", tx: 11, ty: 2, interact: "loreCafeBoard", label: "Café Espresso Bar" },
        { kind: "cafe_table", tx: 11, ty: 6 }, { kind: "cafe_table", tx: 13, ty: 6 },
        { kind: "plant", tx: 14, ty: 2 },
        { kind: "purg_crystal", tx: 9, ty: 8, purgOnly: true, interact: "lorePurgBookstore", label: "Hidden Reaperian Text" },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "clerk", tx: 12, ty: 3, dir: "down", isHuman: true, dialogue: [{ id: "clerk", mood: "happy", text: "Welcome to Barnes & Noble Café! We have fresh espresso, a Kids' Play Corner, and 'Twilight Fireflies' on the top-left aisle!" }] },
        { id: "patron", tx: 4, ty: 6, dir: "up", isHuman: true, routine: { type: "patrol", points: [[4, 6], [5, 6]], speed: 18, pause: 3.0 }, dialogue: [{ id: "patron", mood: "neutral", text: "These supernatural novels on the top-middle shelf are wild—they describe Reapers altering human memories!" }] },
        { id: "barista", tx: 11, ty: 7, dir: "up", isHuman: true, dialogue: [{ id: "barista", mood: "happy", text: "Best caramel lattes in Colorado Springs!" }] },
        // Book-Accurate Kid in the Play Section who can see Purgatorio!
        { id: "kid", tx: 3, ty: 9, dir: "left", isHuman: true, event: "kidPlaySection" },
        { id: "cyrine", tx: 5, ty: 4, dir: "down", minQuest: 1, maxQuest: 1, event: "bookstoreCyrine" },
        { id: "illicero", tx: 13, ty: 7, dir: "left", minQuest: 6, maxQuest: 13, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Told you I'd catch you at Barnes & Noble, Jacob. Grab a coffee and check the Supernatural aisle." }] }
      ]
    };
  }

  // PARTY HOUSE — Packed with Dancing Partygoers, DJ Booth & Disco Ball!
  function buildParty() {
    const r = makeRoom(16, 12, "party");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1; // DJ Booth
    r.grid[3][2] = 1; r.grid[3][3] = 1; r.grid[3][4] = 1; // Snack table L
    r.grid[3][11] = 1; r.grid[3][12] = 1; r.grid[3][13] = 1; // Snack table R
    r.grid[8][2] = 1; r.grid[8][3] = 1; r.grid[8][4] = 1; // Lounge couch

    return {
      ...r, id: "party", name: "Classmate's Party House", trees: [], buildings: [], signs: [], portals: [],
      exits: [{ tx: 7, ty: 10, tw: 2, dest: "overworld", destX: 19, destY: 13 }],
      props: [
        { kind: "disco_ball", tx: 7, ty: 5 },
        { kind: "dj_booth", tx: 6, ty: 2 },
        { kind: "party_table", tx: 2, ty: 3 }, { kind: "party_table", tx: 11, ty: 3 },
        { kind: "couch", tx: 2, ty: 8 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "sendex", tx: 7, ty: 4, dir: "down", maxQuest: 5, event: "partyBattle" },
        { id: "navi", tx: 5, ty: 6, dir: "up", maxQuest: 6, dialogue: [{ id: "navi", mood: "intense", text: "Stay behind me, Jacob—Sendex is right ahead!" }] },
        { id: "illicero", tx: 9, ty: 6, dir: "up", maxQuest: 6, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Relax, kid. Navi and I have your back." }] },
        { id: "cyrine", tx: 12, ty: 7, dir: "left", activity: "dance", dialogue: [{ id: "cyrine", mood: "happy", text: "Come on Jacob, live a little! The music's awesome!" }] },
        // Extra Partygoers!
        { id: "party_guy", tx: 7, ty: 3, dir: "down", isHuman: true, activity: "dance", dialogue: [{ id: "party_guy", mood: "happy", text: "YO! Welcome to the Senior kickoff party! Grab a drink at the snack table!" }] },
        { id: "party_girl", tx: 11, ty: 5, dir: "left", isHuman: true, activity: "dance", dialogue: [{ id: "party_girl", mood: "happy", text: "Wait, who's that hot blond guy vaping by the kitchen? He's totally my type!" }] },
        { id: "student_a", tx: 3, ty: 5, dir: "right", isHuman: true, activity: "dance", dialogue: [{ id: "student_a", mood: "happy", text: "This bass is shaking the whole block! Glad you came, Jacob!" }] },
        { id: "student_b", tx: 13, ty: 8, dir: "up", isHuman: true, activity: "dance", dialogue: [{ id: "student_b", mood: "happy", text: "Someone just broke a bottle on the front lawn—classic Saturday night!" }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 4. NEW INTERIORS: High School, Candy Store & 2 Neighbor Houses!
  // ---------------------------------------------------------
  function buildSchool() {
    const r = makeRoom(16, 12, "tile");
    r.grid[11][7] = 4; r.grid[11][8] = 4;
    for (let y = 2; y <= 6; y++) for (let x = 1; x <= 14; x++) r.grid[y][x] = 7;
    r.grid[2][5] = 1; r.grid[2][6] = 1; r.grid[2][7] = 1; r.grid[2][8] = 1; // Chalkboard
    r.grid[2][1] = 1; r.grid[2][2] = 1; r.grid[2][3] = 1; // Lockers
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
        { kind: "cafe_table", tx: 3, ty: 7 }, { kind: "cafe_table", tx: 11, ty: 7 },
        { kind: "plant", tx: 14, ty: 2 },
        { kind: "exit_mat", tx: 7, ty: 10 }
      ],
      npcs: [
        { id: "candy_clerk", tx: 7, ty: 4, dir: "down", isHuman: true, dialogue: [{ id: "candy_clerk", mood: "happy", text: "Hello! Would you like to try our sample of the day—a chocolate truffle filled with strawberry jam? We also just restocked Lindor Dark Chocolate on the right!" }] }
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
        { kind: "plant", tx: 12, ty: 2 },
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
        { kind: "plant", tx: 12, ty: 2 },
        { kind: "exit_mat", tx: 6, ty: 9 }
      ],
      npcs: [
        { id: "party_guy", tx: 7, ty: 5, dir: "down", isHuman: true, dialogue: [{ id: "party_guy", mood: "happy", text: "Yo! Welcome to my arcade loft! Try beating my high score on the SNAKE.EXE cabinet over there!" }] }
      ]
    };
  }

  // ---------------------------------------------------------
  // 5. REVAMPED DREAM REALM — Smaller Intimate Glowing Island
  //    Surrounded by Shimmering Cherry Blossom Lake Water!
  // ---------------------------------------------------------
  function buildDream() {
    const w = 16, h = 12;
    const grid = Array.from({ length: h }, (_, y) =>
      Array.from({ length: w }, (_, x) => {
        // Intimate glowing island at x = 5..10, y = 4..9; shimmering dream water everywhere else!
        if (x >= 5 && x <= 10 && y >= 4 && y <= 9) return 0;
        return 10; // Dream Lake water (impassable)
      })
    );
    const trees = [
      { tx: 5, ty: 4, kind: "cherry" }, { tx: 10, ty: 4, kind: "cherry" },
      { tx: 5, ty: 9, kind: "cherry" }, { tx: 10, ty: 9, kind: "cherry" }
    ];
    trees.forEach(t => { grid[t.ty][t.tx] = 2; });

    return {
      id: "dream",
      name: "Letonin's Dream Realm",
      w, h, floorType: "dream", grid, trees, buildings: [], signs: [], exits: [],
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
