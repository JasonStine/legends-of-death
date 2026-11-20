// =========================================================
// regions/buildings/barnes_noble.js — Barnes & Noble & Café
// =========================================================
window.Maps.bookstore = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(18, 14, "bookstore", [
    [2, 2, 8, 6, 0],   // Main Book Aisles Wing
    [1, 8, 5, 3, 0],   // Protruding Kids' Play Nook
    [6, 8, 4, 4, 0],   // Entry Foyer
    [10, 5, 1, 2, 7],  // Archway to Café
    [11, 3, 6, 7, 7]   // Protruding Café & Espresso Wing
  ]);
  r.grid[12][7] = 4; r.grid[12][8] = 4;

  solid(r, 3, 2, 6, 1); solid(r, 3, 5, 6, 1);
  solid(r, 1, 8, 3, 1); solid(r, 2, 9, 1, 1);
  solid(r, 12, 3, 3, 1);
  solid(r, 12, 7, 1, 1); solid(r, 15, 7, 1, 1);

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
})();
