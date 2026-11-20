// =========================================================
// regions/buildings/jacobs_house.js — 4-Wing Modern Home
// =========================================================
window.Maps.house = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(18, 14, "wood", [
    [2, 2, 7, 4, 7],   // Kitchen Wing (Top-Left, cream tile)
    [1, 7, 6, 4, 0],   // Living Room Wing (Bottom-Left)
    [7, 6, 3, 6, 0],   // Central Entry Hallway & Foyer
    [11, 2, 5, 3, 0],  // Walk-In Closet Alcove (Top-Right)
    [10, 3, 1, 1, 0],  // Hallway -> Closet Archway
    [11, 6, 6, 5, 0],  // Jacob's Bedroom Wing (Bottom-Right)
    [10, 8, 1, 2, 0],  // Hallway -> Bedroom Archway
    [13, 5, 1, 1, 0]   // Inner Bedroom <-> Closet Door
  ]);
  r.grid[12][8] = 4; r.grid[12][9] = 4;

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
      { kind: "plant", tx: 2, ty: 2 }, { kind: "fridge", tx: 3, ty: 2 },
      { kind: "kitchen_counter", tx: 4, ty: 2 }, { kind: "dining_table", tx: 7, ty: 4 },
      { kind: "lamp", tx: 1, ty: 7 },
      { kind: "couch", tx: 2, ty: 7, interact: "sleep", label: "Living Room Couch" },
      { kind: "tv", tx: 2, ty: 10 }, { kind: "plant", tx: 1, ty: 10 },
      { kind: "closet_rack", tx: 11, ty: 2, interact: "loreCloset", label: "Jacob's Closet" },
      { kind: "plaque", tx: 15, ty: 2, interact: "loreJacobDiary", label: "Constellation Box" },
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
})();
