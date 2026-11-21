// =========================================================
// regions/buildings/neighbor_houses.js — Lived-In Westside Extra Houses
// =========================================================
window.Maps.neighbor_house = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(16, 12, "wood", [
    [2, 2, 6, 5, 0],   // Historian's Study & Library Wing (Left)
    [8, 2, 6, 4, 7],   // Tiled Kitchen & Dining Nook (Top-Right)
    [8, 6, 6, 4, 0],   // Cozy Living Room & TV Nook (Bottom-Right)
    [4, 7, 4, 3, 0]    // Entry Foyer
  ]);
  r.grid[10][5] = 4; r.grid[10][6] = 4;

  solid(r, 3, 2, 2, 1);  // Folklore Bookshelf
  solid(r, 6, 2, 1, 1);  // Antique Photo Plaque
  solid(r, 9, 2, 4, 1);  // Kitchen Counter
  solid(r, 10, 4, 2, 1); // Dining Table
  solid(r, 10, 7, 3, 1); // Living Room Couch
  solid(r, 2, 5, 1, 1);  // Lamp

  return {
    ...r, id: "neighbor_house", name: "Mr. Henderson's House", trees: [], buildings: [], signs: [], portals: [],
    exits: [{ tx: 5, ty: 9, tw: 2, dest: "westside", destX: 13, destY: 6 }],
    props: [
      { kind: "rug", tx: 3, ty: 4, tw: 4, th: 2, color: "#14532d", inner: "#166534" },
      { kind: "rug", tx: 10, ty: 8, tw: 3, th: 2, color: "#7f1d1d", inner: "#991b1b" },
      { kind: "bookshelf", tx: 3, ty: 2, interact: "loreNeighborHistory", label: "Colorado Springs Folklore" },
      { kind: "plaque", tx: 6, ty: 2, interact: "hendersonPhotos", label: "1980s Colorado Photos" },
      { kind: "lamp", tx: 2, ty: 5 },
      { kind: "fridge", tx: 8, ty: 2 },
      { kind: "kitchen_counter", tx: 9, ty: 2 },
      { kind: "dining_table", tx: 10, ty: 4 },
      { kind: "couch", tx: 10, ty: 7 },
      { kind: "plant", tx: 13, ty: 9 }, { kind: "plant", tx: 2, ty: 2 },
      { kind: "exit_mat", tx: 5, ty: 9 }
    ],
    npcs: [
      { id: "neighbor", tx: 5, ty: 5, dir: "down", isHuman: true, routine: { type: "patrol", points: [[4, 5], [6, 5]], speed: 16, pause: 2.8 }, dialogue: [{ id: "neighbor", mood: "happy", text: "Ah, Jacob! Check my folklore bookshelf and the old 1980s photos on the wall—I've been tracking winged shadows near Limbach Park for years!" }] },
      { id: "patron", tx: 11, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "patron", mood: "happy", text: "I'm visiting Mr. Henderson for tea! He has the most fascinating stories about old Colorado Springs." }] }
    ]
  };
})();

window.Maps.neighbor_2 = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(16, 12, "wood", [
    [2, 2, 12, 5, 0],  // Main Retro Arcade & Lounge Floor
    [2, 7, 4, 3, 7],   // Mini Snack & Soda Bar Alcove (Bottom-Left)
    [6, 7, 5, 3, 0]    // Entry Foyer
  ]);
  r.grid[10][7] = 4; r.grid[10][8] = 4;

  solid(r, 3, 3, 3, 1);  // Lounge Couch
  solid(r, 9, 2, 1, 1);  // Arcade Cab 1
  solid(r, 11, 2, 1, 1); // Arcade Cab 2 (SNAKE.EXE)
  solid(r, 13, 2, 1, 1); // Arcade Cab 3
  solid(r, 2, 7, 1, 1);  // Vending Machine
  solid(r, 4, 8, 1, 1);  // Café Table

  return {
    ...r, id: "neighbor_2", name: "Retro Arcade Loft", trees: [], buildings: [], signs: [], portals: [],
    exits: [{ tx: 7, ty: 9, tw: 2, dest: "westside", destX: 19, destY: 6 }],
    props: [
      { kind: "rug", tx: 4, ty: 5, tw: 6, th: 2, color: "#581c87", inner: "#7c3aed" },
      { kind: "couch", tx: 3, ty: 3 },
      { kind: "arcade_cab", tx: 9, ty: 2, interact: "playSnake", label: "SNAKE.EXE Cabinet" },
      { kind: "arcade_cab", tx: 11, ty: 2, interact: "playSnake", label: "SNAKE.EXE Cabinet" },
      { kind: "arcade_cab", tx: 13, ty: 2, interact: "playSnake", label: "SNAKE.EXE Cabinet" },
      { kind: "vending_machine", tx: 2, ty: 7, interact: "vendingSnack", label: "Loft Soda Machine" },
      { kind: "cafe_set", tx: 4, ty: 8 },
      { kind: "lamp", tx: 2, ty: 2 }, { kind: "plant", tx: 13, ty: 6 },
      { kind: "exit_mat", tx: 7, ty: 9 }
    ],
    npcs: [
      { id: "party_guy", tx: 7, ty: 4, dir: "down", isHuman: true, routine: { type: "patrol", points: [[6, 4], [8, 4]], speed: 18, pause: 2.4 }, dialogue: [{ id: "party_guy", mood: "happy", text: "Yo! Welcome to my arcade loft! All 3 cabinets run SNAKE.EXE—score 30+ to beat my record and finish the Arcade Champion side quest!" }] },
      { id: "student_a", tx: 11, ty: 4, dir: "up", isHuman: true, dialogue: [{ id: "student_a", mood: "happy", text: "I got 20 points on SNAKE.EXE earlier! Grab a Dr. Pepper Zero from the corner vending machine if you need a break." }] },
      { id: "barista", tx: 4, ty: 7, dir: "down", isHuman: true, dialogue: [{ id: "barista", mood: "neutral", text: "Best hangout spot in Westside—way quieter than the Saturday party house!" }] }
    ]
  };
})();
