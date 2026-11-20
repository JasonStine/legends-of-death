// =========================================================
// regions/buildings/st_jude_church.js — Centered Basilica Nave
// =========================================================
window.Maps.church = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(16, 14, "stone", [
    [5, 2, 6, 3, 0],   // Symmetrical Altar Apse (x=5..10, center=8.0)
    [2, 5, 12, 5, 0],  // Wide Main Nave & Pews (x=2..13, center=8.0)
    [6, 10, 4, 2, 0]   // Centered Entry Vestibule (x=6..9, center=8.0)
  ]);
  r.grid[12][7] = 4; r.grid[12][8] = 4;

  [5, 6, 8, 9].forEach(py => { solid(r, 2, py, 3, 1); solid(r, 11, py, 3, 1); });
  solid(r, 5, 2, 6, 1); // Flower stands + centered 4-tile Altar table

  return {
    ...r, id: "church", name: "St. Jude Church", trees: [], buildings: [], signs: [], portals: [],
    exits: [{ tx: 7, ty: 11, tw: 2, dest: "overworld", destX: 5, destY: 6 }],
    props: [
      { kind: "rug", tx: 6, ty: 3, tw: 4, th: 8, color: "#7f1d1d", inner: "#991b1b" },
      // 96px (4-tile) Altar spans x=6..9 — mathematically dead-center on the 4-tile carpet!
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
})();
