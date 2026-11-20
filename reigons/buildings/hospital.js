// =========================================================
// regions/buildings/hospital.js — Colorado Springs Hospital
// =========================================================
window.Maps.hospital = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(18, 14, "tile", [
    [2, 2, 6, 4, 7],   // Exam Room 1 (Top-Left Wing)
    [10, 2, 6, 4, 7],  // Exam Room 2 (Top-Right Wing)
    [5, 6, 1, 2, 0],   // Left Doorway Corridor
    [12, 6, 1, 2, 0],  // Right Doorway Corridor
    [1, 8, 16, 4, 0]   // Wide Main Reception & Waiting Lobby
  ]);
  r.grid[12][8] = 4; r.grid[12][9] = 4;

  solid(r, 2, 3, 2, 2); solid(r, 4, 3, 1, 1); solid(r, 6, 2, 2, 1);
  solid(r, 14, 3, 2, 2); solid(r, 13, 3, 1, 1); solid(r, 10, 2, 1, 1);
  solid(r, 7, 9, 3, 1);
  solid(r, 2, 9, 2, 1); solid(r, 14, 9, 2, 1);

  return {
    ...r, id: "hospital", name: "Colorado Springs Hospital", trees: [], buildings: [], signs: [], portals: [],
    exits: [{ tx: 8, ty: 11, tw: 2, dest: "overworld", destX: 5, destY: 13 }],
    props: [
      { kind: "hospital_bed", tx: 2, ty: 3 }, { kind: "med_machine", tx: 4, ty: 3 },
      { kind: "sink_counter", tx: 6, ty: 2 },
      { kind: "plaque", tx: 10, ty: 2, interact: "loreHospitalChart", label: "Toxicology Chart" },
      { kind: "med_machine", tx: 13, ty: 3 }, { kind: "hospital_bed", tx: 14, ty: 3 },
      { kind: "reception_desk", tx: 7, ty: 9, interact: "loreHospitalDesk", label: "Reception Desk" },
      { kind: "waiting_chair", tx: 2, ty: 9 }, { kind: "waiting_chair", tx: 3, ty: 9 },
      { kind: "waiting_chair", tx: 14, ty: 9 }, { kind: "waiting_chair", tx: 15, ty: 9 },
      { kind: "plant", tx: 1, ty: 10 }, { kind: "plant", tx: 16, ty: 10 },
      { kind: "lamp", tx: 1, ty: 8 }, { kind: "lamp", tx: 16, ty: 8 },
      { kind: "exit_mat", tx: 8, ty: 11 }
    ],
    npcs: [
      { id: "receptionist", tx: 8, ty: 8, dir: "down", isHuman: true, dialogue: [{ id: "receptionist", mood: "happy", text: "Welcome to Colorado Springs Hospital! Exam Room 1 (left corridor) has Dr. Menos for free healing, and Exam Room 2 (right corridor) has Nurse Maya!" }] },
      { id: "mom", tx: 5, ty: 4, dir: "down", isHuman: true, event: "hospitalHeal", routine: { type: "patrol", points: [[5, 4], [7, 4]], speed: 18, pause: 2.5 } },
      { id: "nurse", tx: 11, ty: 4, dir: "down", isHuman: true, dialogue: [{ id: "nurse", mood: "neutral", text: "Monitoring vitals in Exam Room 2! Check Dr. Menos's toxicology chart on the wall here." }] },
      { id: "patron", tx: 2, ty: 8, dir: "down", isHuman: true, dialogue: [{ id: "patron", mood: "neutral", text: "Waiting for my annual checkup—Dr. Menos is the best doctor in Colorado Springs!" }] },
      { id: "spirit", tx: 6, ty: 5, dir: "down", purgOnly: true, dialogue: [{ id: "spirit", mood: "neutral", text: "(A newly departed soul hovers peacefully) 'Waiting for the Reapers to guide me onward...'" }] }
    ]
  };
})();
