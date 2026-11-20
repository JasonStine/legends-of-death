// =========================================================
// regions/buildings/neighbor_houses.js — Westside Extra Houses
// =========================================================
window.Maps.neighbor_house = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
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
})();

window.Maps.neighbor_2 = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
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
})();
