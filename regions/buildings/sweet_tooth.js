// =========================================================
// regions/buildings/sweet_tooth.js — Sweet Tooth Candy Store
// =========================================================
window.Maps.candy_shop = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(16, 14, "candy", [
    [2, 2, 12, 6, 0],  // Main Candy Boutique & Staff Counter Wing
    [2, 8, 8, 4, 0],   // Café Seating & Entry Wing
    [10, 8, 4, 3, 0]   // Cozy Ice-Cream Corner Alcove (Dropped Cone!)
  ]);
  r.grid[12][6] = 4; r.grid[12][7] = 4;

  solid(r, 5, 4, 4, 1);  // Wrap-around Service Counter
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
      { id: "candy_clerk", tx: 7, ty: 3, dir: "down", isHuman: true, routine: { type: "patrol", points: [[6, 3], [8, 3]], speed: 16, pause: 2.6, faceAtStop: "down" }, dialogue: [{ id: "candy_clerk", mood: "happy", text: "Welcome to Sweet Tooth! Grab a free strawberry-jam truffle sample on the left case, or Lindor Dark Chocolate on the right—and oops, I gotta mop up that dropped cone in the corner!" }] },
      { id: "kid", tx: 11, ty: 9, dir: "down", isHuman: true, dialogue: [{ id: "kid", mood: "sad", text: "Aw man... I dropped my strawberry-vanilla ice cream cone in the corner! Don't step in it!" }] },
      { id: "patron", tx: 4, ty: 7, dir: "up", isHuman: true, dialogue: [{ id: "patron", mood: "happy", text: "Best candy store in the whole Colorado Springs mall! Their dark chocolate truffles are unreal." }] }
    ]
  };
})();
