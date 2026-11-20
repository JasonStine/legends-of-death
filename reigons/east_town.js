// =========================================================
// regions/east_town.js — Colorado Springs (East District)
// =========================================================
window.Maps.overworld = (() => {
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

  // Natural Flagstone Pathways w/ Encroaching Grass
  for (let x = 0; x <= 24; x++) { grid[7][x] = 3; grid[8][x] = 3; }
  for (let x = 2; x <= 24; x++) { grid[14][x] = 3; grid[15][x] = 3; }
  for (let y = 7; y <= 15; y++) {
    grid[y][8] = 3; grid[y][9] = 3;
    grid[y][15] = 3; grid[y][16] = 3;
  }
  for (let y = 3; y <= 6; y++) { grid[y][12] = 3; grid[y][13] = 3; }

  // Stepping-Stone Front Walkways
  grid[6][5] = 5; grid[6][19] = 5;
  grid[13][5] = 5; grid[13][12] = 5; grid[13][19] = 5;

  // Entry destY is 1 tile ABOVE each interior's exit_mat so walking in never re-triggers exit!
  const buildings = [
    { id: "church", style: "church", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "church", destX: 7, destY: 10 },
    { id: "house", style: "house", tx: 17, ty: 3, tw: 5, th: 3, doorTx: 19, doorTy: 5, dest: "house", destX: 8, destY: 10 },
    { id: "hospital", style: "hospital", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "hospital", destX: 8, destY: 10 },
    { id: "bookstore", style: "bookstore", tx: 10, ty: 10, tw: 5, th: 3, doorTx: 12, doorTy: 12, dest: "bookstore", destX: 7, destY: 10 },
    { id: "party", style: "party", tx: 17, ty: 10, tw: 5, th: 3, doorTx: 19, doorTy: 12, dest: "party", destX: 7, destY: 10 }
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
      { id: "suzanna", tx: 10, ty: 16, dir: "right", isHuman: true, routine: { type: "patrol", points: [[9, 16], [14, 16]], speed: 20, pause: 2.5 }, dialogue: [{ id: "suzanna", mood: "neutral", text: "Hello, Jacob! Walk west down the path to visit Colorado Springs High School—Room 102 is open!" }] },
      { id: "lucia", tx: 11, ty: 4, dir: "down", routine: { type: "patrol", points: [[11, 4], [11, 6]], speed: 22, pause: 2.6 }, dialogue: [{ id: "lucia", mood: "intense", text: "(Scanning the tree line) ...Oh, hey kid. Just admiring the Colorado air. (Wait—is she wearing a crimson cloak pin under her jacket?)" }] },
      { id: "md_scout", tx: 6, ty: 16, dir: "right", purgOnly: true, routine: { type: "patrol", points: [[5, 16], [8, 16]], speed: 26, pause: 1.8 }, dialogue: [{ id: "md_scout", mood: "intense", text: "Whoa—a human walking in Purgatorio?! We Morte Discipuli patrol Colorado Springs unseen by mortal eyes!" }] },
      { id: "crista", tx: 21, ty: 6, dir: "down", minQuest: 7, maxQuest: 14, routine: { type: "patrol", points: [[20, 6], [22, 6]], speed: 22, pause: 2.0 }, dialogue: [{ id: "crista", mood: "happy", text: "Meow~ (Crista watches the street outside Jacob's house with piercing blue eyes.)" }] },
      { id: "letonin", tx: 12, ty: 8, dir: "down", minQuest: 15, maxQuest: 20, event: "epilogueReunion", routine: { type: "patrol", points: [[11, 8], [13, 8]], speed: 24, pause: 2.2 } },
      { id: "cyrine", tx: 14, ty: 8, dir: "left", minQuest: 15, maxQuest: 20, event: "epilogueReunion" }
    ]
  };
})();
