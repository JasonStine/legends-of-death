// =========================================================
// regions/realms/limbach_park.js — Limbach Park (Purgatorio)
// =========================================================
window.Maps.park = (() => {
  const { buildDynamicRoom } = window.MapHelpers;
  const r = buildDynamicRoom(16, 13, "park", [[1, 2, 14, 10, 0]]);
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
})();
