// =========================================================
// regions/westside.js — Westside District (School, Sweet Tooth & Homes)
// =========================================================
window.Maps.westside = (() => {
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

  // All entry destY set 1 full tile INSIDE above the interior exit mats!
  const buildings = [
    { id: "school", style: "school", tx: 3, ty: 3, tw: 5, th: 3, doorTx: 5, doorTy: 5, dest: "school", destX: 10, destY: 12 },
    { id: "neighbor_house", style: "neighbor_house", tx: 11, ty: 3, tw: 4, th: 3, doorTx: 13, doorTy: 5, dest: "neighbor_house", destX: 5, destY: 8 },
    { id: "neighbor_2", style: "house", tx: 17, ty: 3, tw: 4, th: 3, doorTx: 19, doorTy: 5, dest: "neighbor_2", destX: 6, destY: 8 },
    { id: "candy_shop", style: "candy_shop", tx: 3, ty: 10, tw: 5, th: 3, doorTx: 5, doorTy: 12, dest: "candy_shop", destX: 6, destY: 10 }
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
})();
