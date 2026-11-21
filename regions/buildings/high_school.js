// =========================================================
// regions/buildings/high_school.js — Colorado Springs High School
// =========================================================
window.Maps.school = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(22, 16, "tile", [
    [3, 2, 10, 6, 7],  // Room 102: AP Calculus Classroom
    [15, 3, 5, 5, 0],  // Student Lounge & Vending Alcove
    [7, 8, 2, 1, 0],   // Classroom Doorway into Hallway
    [17, 8, 2, 1, 0],  // Lounge Archway into Hallway
    [2, 9, 18, 4, 0],  // Full East-West Locker Hallway
    [9, 13, 3, 1, 0]   // Main School Entrance Vestibule
  ]);
  r.grid[14][10] = 4; r.grid[14][11] = 4;

  solid(r, 5, 2, 4, 1);  // Front Chalkboard
  solid(r, 10, 3, 2, 1); // Teacher's Desk
  [5, 7].forEach(y => [4, 7, 10].forEach(x => solid(r, x, y, 1, 1)));
  solid(r, 3, 9, 3, 1);  // Locker Row Left
  solid(r, 10, 9, 3, 1); // Locker Row Mid
  solid(r, 14, 9, 2, 1); // Trophy Case
  solid(r, 15, 3, 1, 1); // Vending Machine
  solid(r, 17, 5, 1, 1); // Lounge Table

  return {
    ...r, id: "school", name: "Colorado Springs High School", trees: [], buildings: [], signs: [], portals: [],
    exits: [{ tx: 10, ty: 13, tw: 2, dest: "westside", destX: 5, destY: 6 }],
    props: [
      { kind: "chalkboard", tx: 5, ty: 2, interact: "loreSchoolCalculus", label: "AP Calculus Chalkboard" },
      { kind: "teacher_desk", tx: 10, ty: 3 },
      { kind: "plaque", tx: 12, ty: 2, interact: "lorePromPoster", label: "Senior Prom Poster" },
      { kind: "school_desk", tx: 4, ty: 5 }, { kind: "school_desk", tx: 7, ty: 5 }, { kind: "school_desk", tx: 10, ty: 5 },
      { kind: "school_desk", tx: 4, ty: 7 }, { kind: "school_desk", tx: 7, ty: 7 }, { kind: "school_desk", tx: 10, ty: 7 },
      // Closed classroom doors recessed cleanly INTO the north hallway wall (y = 8)!
      { kind: "closed_door", tx: 2, ty: 8, interact: "doorPhysics", label: "Room 101: Physics" },
      { kind: "locker_row", tx: 3, ty: 9 },
      { kind: "locker_row", tx: 10, ty: 9 },
      { kind: "closed_door", tx: 13, ty: 8, interact: "doorLatin", label: "Room 103: Latin" },
      { kind: "trophy_case", tx: 14, ty: 9, interact: "loreTrophyCase", label: "CSHS Trophy Case" },
      { kind: "water_fountain", tx: 16, ty: 9 },
      { kind: "closed_door", tx: 19, ty: 8, interact: "doorGym", label: "Gymnasium Doors" },
      { kind: "vending_machine", tx: 15, ty: 3, interact: "vendingSnack", label: "Hallway Vending Machine" },
      { kind: "cafe_set", tx: 17, ty: 5 },
      { kind: "plant", tx: 19, ty: 3 },
      { kind: "exit_mat", tx: 10, ty: 13 }
    ],
    npcs: [
      { id: "suzanna", tx: 7, ty: 3, dir: "down", isHuman: true, dialogue: [{ id: "suzanna", mood: "happy", text: "Welcome to Room 102 AP Calculus, Jacob! Check the Prom Poster on the wall—Senior Year is going to be unforgettable." }] },
      { id: "student_a", tx: 5, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "student_a", mood: "neutral", text: "I heard Emillia's prom dress is champagne pink—don't tell her I told you!" }] },
      { id: "student_b", tx: 8, ty: 11, dir: "right", isHuman: true, routine: { type: "patrol", points: [[6, 11], [14, 11]], speed: 22, pause: 2.2 }, dialogue: [{ id: "student_b", mood: "happy", text: "Room 101 Physics is locked for lab prep, and the Gym is closed until Prom decorating starts!" }] },
      { id: "party_girl", tx: 17, ty: 6, dir: "up", isHuman: true, dialogue: [{ id: "party_girl", mood: "happy", text: "Grabbing a soda from the lounge vending machine between classes!" }] }
    ]
  };
})();
