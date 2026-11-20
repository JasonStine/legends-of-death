// =========================================================
// regions/realms/casa_grande.js — Casa Grande Fortress (Blood Moon)
// =========================================================
window.Maps.fortress = (() => {
  const { buildDynamicRoom } = window.MapHelpers;
  const r = buildDynamicRoom(16, 13, "desert", [[1, 2, 14, 10, 0]]);
  const trees = [
    { tx: 2, ty: 3, kind: "cactus" }, { tx: 13, ty: 3, kind: "cactus" },
    { tx: 2, ty: 9, kind: "cactus" }, { tx: 13, ty: 9, kind: "cactus" }
  ];
  trees.forEach(t => { r.grid[t.ty][t.tx] = 2; });
  return {
    ...r, id: "fortress", name: "Casa Grande Fortress (Blood Moon)", trees, buildings: [], signs: [], exits: [],
    portals: [{ tx: 7, ty: 11, style: "purgatorio", label: "LIMBACH PARK", dest: "park", destX: 10, destY: 5 }],
    props: [],
    npcs: [
      { id: "vrotney", tx: 4, ty: 10, dir: "right", dialogue: [{ id: "vrotney", mood: "happy", text: "Vrotney, Letonin's division! I shuttled you across the sky to get here—our Morte Discipuli are holding off Crepsus's perimeter!" }] },
      { id: "damian", tx: 11, ty: 10, dir: "left", dialogue: [{ id: "damian", mood: "intense", text: "Damian, Illicero's elite faction from Sydney! Master Kain manifested me into celestial brass knuckles earlier—we've got your flank covered!" }] },
      { id: "emillia", tx: 5, ty: 8, dir: "up", minQuest: 10, maxQuest: 13, event: "fortressEmillia" },
      { id: "envy", tx: 7, ty: 6, dir: "down", minQuest: 11, maxQuest: 11, event: "envyBattle" },
      { id: "sendex", tx: 10, ty: 7, dir: "left", minQuest: 12, maxQuest: 12, event: "danielAscend" },
      { id: "crepsus", tx: 7, ty: 3, dir: "down", minQuest: 10, maxQuest: 13, event: "crepsusBattle" },
      { id: "death", tx: 7, ty: 5, dir: "down", minQuest: 14, maxQuest: 14, event: "griefResolve" }
    ]
  };
})();
