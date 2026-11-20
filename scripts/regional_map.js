// =========================================================
// scripts/regional_map.js — Smooth Regional Atlas Map Renderer
// =========================================================
window.RegionalMap = (() => {
  function draw(game, fog) {
    const mc = document.getElementById("minimap-canvas");
    if (!mc) return;
    const mctx = mc.getContext("2d");
    mctx.imageSmoothingEnabled = true;
    const T = window.WorldArt.T;
    const W = mc.width, H = mc.height;

    const visitedSet = new Set(Object.keys(game.explored || {}));
    visitedSet.add(game.mapId);
    const seenWest = !fog || visitedSet.has("westside") || ["school", "candy_shop", "neighbor_house", "neighbor_2"].includes(game.mapId);
    const seenPark = !fog || visitedSet.has("park") || game.questStage >= 7;
    const seenFort = !fog || visitedSet.has("fortress") || game.questStage >= 10;

    // Valley terrain
    const bg = mctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#1c3b2c"); bg.addColorStop(0.5, "#2b593c"); bg.addColorStop(1, "#1e4230");
    mctx.fillStyle = bg; mctx.fillRect(0, 0, W, H);

    mctx.fillStyle = "#163322";
    for (let i = 0; i < 38; i++) {
      const fx = (i * 47) % W;
      const fy = (i % 2 === 0) ? (12 + (i % 5) * 6) : (H - 16 - (i % 4) * 5);
      mctx.beginPath(); mctx.arc(fx, fy, 12 + (i % 5) * 2, 0, Math.PI * 2); mctx.fill();
    }

    // Monument Creek
    mctx.strokeStyle = "#0284c7"; mctx.lineWidth = 14; mctx.lineCap = "round";
    mctx.beginPath(); mctx.moveTo(0, H - 24); mctx.bezierCurveTo(130, H - 10, 320, H - 38, W, H - 20); mctx.stroke();
    mctx.strokeStyle = "#38bdf8"; mctx.lineWidth = 4; mctx.stroke();

    // Natural Flagstone Path Network
    mctx.strokeStyle = "#bda682"; mctx.lineWidth = 13;
    mctx.beginPath();
    mctx.moveTo(26, 154); mctx.lineTo(W - 22, 154);
    mctx.moveTo(40, 232); mctx.lineTo(W - 26, 232);
    mctx.moveTo(116, 154); mctx.lineTo(116, 232);
    mctx.moveTo(192, 154); mctx.lineTo(192, 232);
    mctx.moveTo(318, 154); mctx.lineTo(318, 232);
    mctx.moveTo(396, 154); mctx.lineTo(396, 232);
    mctx.moveTo(356, 154); mctx.lineTo(356, 72);
    mctx.stroke();

    mctx.save();
    mctx.strokeStyle = "rgba(255,255,255,0.22)"; mctx.setLineDash([4, 4]); mctx.lineWidth = 1.5;
    mctx.beginPath(); mctx.moveTo(234, 62); mctx.lineTo(234, H - 36); mctx.stroke();
    mctx.restore();

    mctx.font = "bold 10px system-ui, sans-serif";
    mctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    mctx.fillText("WESTSIDE DISTRICT", 22, 84);
    mctx.fillText("COLORADO SPRINGS (EAST)", 246, 84);

    const drawPin = (x, y, label, color, active = false) => {
      mctx.save();
      mctx.fillStyle = "rgba(0,0,0,0.45)"; mctx.beginPath(); mctx.roundRect(x - 20, y - 9, 40, 20, 5); mctx.fill();
      mctx.fillStyle = color; mctx.strokeStyle = active ? "#facc15" : "#f8fafc"; mctx.lineWidth = active ? 2.5 : 1.2;
      mctx.beginPath(); mctx.roundRect(x - 18, y - 11, 36, 18, 4); mctx.fill(); mctx.stroke();
      mctx.font = "bold 9px system-ui, sans-serif";
      const tw = mctx.measureText(label).width;
      mctx.fillStyle = "rgba(9, 12, 24, 0.82)"; mctx.beginPath(); mctx.roundRect(x - tw / 2 - 4, y + 9, tw + 8, 13, 3); mctx.fill();
      mctx.fillStyle = active ? "#fde047" : "#f1f5f9"; mctx.fillText(label, x - tw / 2, y + 19);
      mctx.restore();
    };

    const cur = game.mapId;
    drawPin(276, 118, "St. Jude Church", "#64748b", cur === "church");
    drawPin(424, 118, "Jacob's House", "#c2410c", cur === "house" || cur === "dream");
    drawPin(276, 194, "Hospital", "#0d9488", cur === "hospital");
    drawPin(356, 194, "Barnes & Noble", "#15803d", cur === "bookstore");
    drawPin(428, 194, "Party House", "#4f46e5", cur === "party");

    if (seenWest) {
      drawPin(66, 118, "CS High School", "#b91c1c", cur === "school");
      drawPin(150, 118, "Henderson's", "#2563eb", cur === "neighbor_house");
      drawPin(206, 118, "Arcade Loft", "#7c3aed", cur === "neighbor_2");
      drawPin(68, 194, "Sweet Tooth", "#db2777", cur === "candy_shop");
    } else {
      mctx.fillStyle = "rgba(18, 16, 40, 0.84)"; mctx.beginPath(); mctx.roundRect(10, 66, 218, 196, 12); mctx.fill();
      mctx.strokeStyle = "rgba(167, 139, 250, 0.55)"; mctx.lineWidth = 1.5; mctx.stroke();
      mctx.fillStyle = "#c4b5fd"; mctx.font = "bold 12px system-ui, sans-serif"; mctx.fillText("??? WESTSIDE ???", 60, 152);
      mctx.fillStyle = "#94a3b8"; mctx.font = "10px system-ui, sans-serif"; mctx.fillText("Walk west on Upper Path", 56, 170);
    }

    if (seenPark) {
      drawPin(356, 44, "Limbach Park", "#7c3aed", cur === "park");
    } else {
      mctx.fillStyle = "rgba(30, 18, 56, 0.85)"; mctx.beginPath(); mctx.roundRect(300, 22, 112, 34, 8); mctx.fill();
      mctx.strokeStyle = "rgba(167, 139, 250, 0.5)"; mctx.stroke();
      mctx.fillStyle = "#c4b5fd"; mctx.font = "bold 10px system-ui, sans-serif"; mctx.fillText("??? NORTH TRAIL ???", 308, 43);
    }
    if (seenFort) drawPin(440, 44, "Casa Grande", "#991b1b", cur === "fortress");

    const pinCoords = {
      church: [276, 118], house: [424, 118], dream: [424, 118],
      hospital: [276, 194], bookstore: [356, 194], party: [428, 194],
      school: [66, 118], neighbor_house: [150, 118], neighbor_2: [206, 118], candy_shop: [68, 194],
      park: [356, 44], fortress: [440, 44]
    };
    let pxPin = 356, pyPin = 154;
    if (cur === "overworld") {
      pxPin = 242 + (game.player.x / (window.Maps.overworld.w * T)) * 224;
      pyPin = 86 + (game.player.y / (window.Maps.overworld.h * T)) * 182;
    } else if (cur === "westside") {
      pxPin = 18 + (game.player.x / (window.Maps.westside.w * T)) * 212;
      pyPin = 86 + (game.player.y / (window.Maps.westside.h * T)) * 182;
    } else if (pinCoords[cur]) {
      [pxPin, pyPin] = pinCoords[cur];
    }

    mctx.fillStyle = "rgba(250, 204, 21, 0.35)"; mctx.beginPath(); mctx.arc(pxPin, pyPin, 11, 0, Math.PI * 2); mctx.fill();
    mctx.fillStyle = "#facc15"; mctx.strokeStyle = "#111827"; mctx.lineWidth = 2;
    mctx.beginPath(); mctx.arc(pxPin, pyPin, 5.5, 0, Math.PI * 2); mctx.fill(); mctx.stroke();
  }

  return { draw };
})();
