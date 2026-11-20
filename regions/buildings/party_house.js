// =========================================================
// regions/buildings/party_house.js — Dynamic Multi-Wing Party House
// =========================================================
window.Maps.party = (() => {
  const { buildDynamicRoom, solid } = window.MapHelpers;
  const r = buildDynamicRoom(18, 14, "party", [
    [5, 2, 6, 3, 0],   // Protruding DJ Stage Alcove (Top-Center!)
    [2, 5, 10, 6, 0],  // Main Neon Dance Floor
    [12, 4, 5, 6, 0],  // Protruding Side Lounge & Snack Bar Wing (Right!)
    [6, 11, 4, 1, 0]   // Entry Vestibule
  ]);
  r.grid[12][7] = 4; r.grid[12][8] = 4;

  solid(r, 6, 2, 3, 1);  // DJ Booth
  solid(r, 2, 5, 3, 1);  // Left Snack Table
  solid(r, 13, 4, 3, 1); // Right Snack Table
  solid(r, 2, 9, 3, 1);  // Lounge Couch

  return {
    ...r, id: "party", name: "Classmate's Party House", trees: [], buildings: [], signs: [], portals: [],
    exits: [{ tx: 7, ty: 11, tw: 2, dest: "overworld", destX: 19, destY: 13 }],
    props: [
      { kind: "disco_ball", tx: 7, ty: 6 },
      { kind: "dj_booth", tx: 6, ty: 2 },
      { kind: "party_table", tx: 2, ty: 5 },
      { kind: "party_table", tx: 13, ty: 4 },
      { kind: "couch", tx: 2, ty: 9 },
      { kind: "exit_mat", tx: 7, ty: 11 }
    ],
    npcs: [
      { id: "sendex", tx: 7, ty: 5, dir: "down", maxQuest: 5, event: "partyBattle" },
      { id: "navi", tx: 5, ty: 7, dir: "up", maxQuest: 6, dialogue: [{ id: "navi", mood: "intense", text: "Stay behind me, Jacob—Sendex is right ahead!" }] },
      { id: "illicero", tx: 9, ty: 7, dir: "up", maxQuest: 6, activity: "vape", dialogue: [{ id: "illicero", mood: "happy", text: "Relax, kid. Navi and I have your back." }] },
      { id: "cyrine", tx: 14, ty: 7, dir: "left", activity: "dance", dialogue: [{ id: "cyrine", mood: "happy", text: "Come on Jacob, live a little! The music's awesome!" }] },
      { id: "party_guy", tx: 7, ty: 3, dir: "down", isHuman: true, activity: "dance", dialogue: [{ id: "party_guy", mood: "happy", text: "YO! Welcome to the Senior kickoff party! Grab a drink at the snack bar!" }] },
      { id: "party_girl", tx: 12, ty: 6, dir: "left", isHuman: true, activity: "dance", dialogue: [{ id: "party_girl", mood: "happy", text: "Wait, who's that hot blond guy vaping by the lounge? He's totally my type!" }] },
      { id: "student_a", tx: 3, ty: 7, dir: "right", isHuman: true, activity: "dance", dialogue: [{ id: "student_a", mood: "happy", text: "This bass is shaking the whole block! Glad you came, Jacob!" }] },
      { id: "student_b", tx: 15, ty: 8, dir: "up", isHuman: true, activity: "dance", dialogue: [{ id: "student_b", mood: "happy", text: "Someone just broke a bottle on the front lawn—classic Saturday night!" }] }
    ]
  };
})();
