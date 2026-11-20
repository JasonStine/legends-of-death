// =========================================================
// regions/realms/dream_realm.js — Letonin's Dream Realm
// =========================================================
window.Maps.dream = (() => {
  const w = 16, h = 12;
  const grid = Array.from({ length: h }, (_, y) =>
    Array.from({ length: w }, (_, x) => (x >= 5 && x <= 10 && y >= 4 && y <= 9) ? 0 : 10)
  );
  const trees = [
    { tx: 5, ty: 4, kind: "cherry" }, { tx: 10, ty: 4, kind: "cherry" },
    { tx: 5, ty: 9, kind: "cherry" }, { tx: 10, ty: 9, kind: "cherry" }
  ];
  trees.forEach(t => { grid[t.ty][t.tx] = 2; });
  return {
    id: "dream", name: "Letonin's Dream Realm", w, h, floorType: "dream", grid, trees, buildings: [], signs: [], exits: [],
    portals: [{ tx: 7, ty: 9, style: "dream", label: "WAKE UP", dest: "house", destX: 8, destY: 8 }],
    props: [],
    npcs: [{ id: "letonin", tx: 7, ty: 5, dir: "down", event: "dreamLetonin" }]
  };
})();
