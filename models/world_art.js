// =========================================================
// models/world_art.js — Real Asphalt Roads, Layered Trees,
//                       5 Unique Buildings, Signposts & Furniture
// =========================================================
window.WorldArt = (() => {
  const T = 24;

  function px(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // REAL ASPHALT ROAD TILE (Curbs, Sidewalks, Yellow Center Lines & Crosswalks!)
  function drawRoadTile(ctx, map, x, y, sx, sy) {
    const isRoad = (tx, ty) => {
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return false;
      return map.grid[ty][tx] === 3 || map.grid[ty][tx] === 4;
    };
    const up = isRoad(x, y - 1);
    const dn = isRoad(x, y + 1);
    const lt = isRoad(x - 1, y);
    const rt = isRoad(x + 1, y);

    // Asphalt base with subtle grain
    px(ctx, sx, sy, T, T, "#2f3545");
    if ((x + y) % 2 === 0) {
      px(ctx, sx + 4, sy + 5, 2, 1, "#3a4256");
      px(ctx, sx + 16, sy + 18, 2, 1, "#262b38");
    } else {
      px(ctx, sx + 14, sy + 7, 2, 1, "#3a4256");
      px(ctx, sx + 6, sy + 16, 2, 1, "#262b38");
    }

    // Concrete Curbs & Sidewalk Edges where road meets grass
    const curb = "#94a3b8", curbHi = "#cbd5e1";
    if (!up) { px(ctx, sx, sy, T, 3, curb); px(ctx, sx, sy, T, 1, curbHi); }
    if (!dn) { px(ctx, sx, sy + T - 3, T, 3, curb); px(ctx, sx, sy + T - 1, T, 1, "#475569"); }
    if (!lt) { px(ctx, sx, sy, 3, T, curb); px(ctx, sx, sy, 1, T, curbHi); }
    if (!rt) { px(ctx, sx + T - 3, sy, 3, T, curb); px(ctx, sx + T - 1, sy, 1, T, "#475569"); }

    // 2-Lane Horizontal Road (rows 9 & 10 in Colorado Springs)
    const isMainH = (y === 9 || y === 10) && (lt || rt);
    const isMainV = (x === 12 || x === 13) && (up || dn);

    if (isMainH && isMainV) {
      // Intersection asphalt — crisp white crosswalk stripes on outer edge
      if (y === 9 && x === 12) px(ctx, sx + 2, sy + 2, 5, 2, "#e2e8f0");
      if (y === 10 && x === 13) px(ctx, sx + 17, sy + 20, 5, 2, "#e2e8f0");
    } else if (isMainH) {
      // Yellow dashed center divider between row 9 and row 10
      if (y === 9 && x % 2 === 0) px(ctx, sx + 5, sy + T - 2, 14, 2, "#eab308");
      if (y === 10 && x % 2 === 0) px(ctx, sx + 5, sy, 14, 1, "#ca8a04");
    } else if (isMainV) {
      // Yellow dashed center divider between col 12 and col 13
      if (x === 12 && y % 2 === 0) px(ctx, sx + T - 2, sy + 5, 2, 14, "#eab308");
      if (x === 13 && y % 2 === 0) px(ctx, sx, sy + 5, 1, 14, "#ca8a04");
    } else {
      // Sidewalk / Driveway pavers leading to doors
      px(ctx, sx + 3, sy + 3, T - 6, T - 6, "#64748b");
      px(ctx, sx + 4, sy + 4, T - 8, T - 8, "#7b8ba3");
      px(ctx, sx + 3, sy + 12, T - 6, 1, "#475569");
    }
  }

  function drawTree(ctx, x, y, kind = "oak", time = 0) {
    if (kind === "cactus") {
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 2, 6, 20, "#15803d"); px(ctx, x + 10, y + 3, 2, 18, "#22c55e");
      px(ctx, x + 4, y + 8, 5, 4, "#15803d"); px(ctx, x + 4, y + 4, 3, 6, "#16a34a");
      px(ctx, x + 15, y + 10, 5, 4, "#15803d"); px(ctx, x + 17, y + 5, 3, 7, "#16a34a");
      return;
    }
    if (kind === "pine") {
      ctx.fillStyle = "rgba(0,0,0,0.32)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 16, 6, 7, "#5c3a21"); px(ctx, x + 10, y + 16, 2, 7, "#784c2b");
      px(ctx, x + 2, y + 12, 20, 6, "#14532d"); px(ctx, x + 4, y + 11, 16, 4, "#166534");
      px(ctx, x + 4, y + 6, 16, 6, "#15803d"); px(ctx, x + 6, y + 5, 12, 4, "#16a34a");
      px(ctx, x + 8, y + 0, 8, 6, "#15803d"); px(ctx, x + 10, y - 2, 4, 4, "#22c55e");
      return;
    }
    if (kind === "cherry") {
      ctx.fillStyle = "rgba(30, 10, 60, 0.35)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 14, 6, 9, "#4a2511"); px(ctx, x + 10, y + 14, 2, 9, "#6d391c");
      px(ctx, x + 1, y + 4, 22, 12, "#db2777"); px(ctx, x + 3, y + 1, 18, 12, "#f472b6");
      px(ctx, x + 5, y - 1, 12, 7, "#fbcfe8"); px(ctx, x + 14, y + 5, 6, 5, "#f9a8d4");
      const sway = Math.sin(time * 0.003 + x) * 4;
      const fall = (time * 0.015 + y) % 18;
      px(ctx, x + 8 + sway, y + 6 + fall, 2, 2, "#fdf2f8");
      return;
    }
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
    px(ctx, x + 9, y + 14, 6, 9, "#5c3a21"); px(ctx, x + 10, y + 14, 2, 8, "#855834");
    px(ctx, x + 1, y + 5, 22, 11, "#166534"); px(ctx, x + 2, y + 1, 20, 11, "#15803d");
    px(ctx, x + 4, y - 1, 16, 8, "#22c55e"); px(ctx, x + 6, y + 0, 8, 4, "#4ade80");
    px(ctx, x + 14, y + 4, 5, 4, "#4ade80");
  }

  function drawSignpost(ctx, tx, ty) {
    const x = tx * T, y = ty * T;
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath(); ctx.ellipse(x + 12, y + 21, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    px(ctx, x + 10, y + 11, 4, 10, "#5c3a21");
    px(ctx, x + 3, y + 3, 18, 11, "#78350f");
    px(ctx, x + 5, y + 5, 14, 7, "#fef3c7");
    px(ctx, x + 7, y + 7, 10, 1, "#78350f");
    px(ctx, x + 7, y + 9, 8, 1, "#78350f");
  }

  function drawBuilding(ctx, b, time = 0) {
    const x = b.tx * T, y = b.ty * T, w = b.tw * T, h = b.th * T;
    px(ctx, x + 4, y + h - 4, w - 2, 8, "rgba(0,0,0,0.32)");

    if (b.style === "house") {
      px(ctx, x - 3, y + 6, w + 6, 22, "#9a3412");
      px(ctx, x + 2, y, w - 4, 12, "#c2410c");
      for (let rx = x; rx < x + w; rx += 8) {
        px(ctx, rx, y + 14, 6, 2, "#7c2d12"); px(ctx, rx + 4, y + 20, 6, 2, "#7c2d12");
      }
      px(ctx, x + w - 18, y - 6, 10, 18, "#7f1d1d"); px(ctx, x + w - 19, y - 8, 12, 3, "#991b1b");
      px(ctx, x, y + 28, w, h - 28, "#fef3c7"); px(ctx, x, y + h - 8, w, 8, "#94a3b8");
      [x + 10, x + w - 26].forEach(wx => {
        px(ctx, wx - 3, y + 36, 22, 16, "#1e3a8a"); px(ctx, wx, y + 38, 16, 12, "#fde68a");
        px(ctx, wx + 7, y + 38, 2, 12, "#78350f"); px(ctx, wx, y + 43, 16, 2, "#78350f");
      });
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 26, 20, 26, "#78350f"); px(ctx, dx + 5, y + h - 23, 14, 21, "#b45309");
      px(ctx, dx + 15, y + h - 13, 3, 3, "#facc15");
      px(ctx, x + 6, y + h - 6, 20, 5, "#15803d"); px(ctx, x + 10, y + h - 7, 3, 3, "#f472b6");
      px(ctx, x + 18, y + h - 7, 3, 3, "#facc15");
    } else if (b.style === "church") {
      const mid = x + Math.floor(w / 2);
      px(ctx, mid - 12, y - 22, 24, 28, "#64748b"); px(ctx, mid - 14, y - 24, 28, 6, "#334155");
      px(ctx, mid - 2, y - 38, 4, 16, "#f5c542"); px(ctx, mid - 7, y - 34, 14, 4, "#f5c542");
      px(ctx, x - 2, y + 6, w + 4, 22, "#334155"); px(ctx, x + 6, y - 2, w - 12, 12, "#475569");
      px(ctx, x, y + 28, w, h - 28, "#cbd5e1"); px(ctx, x, y + 28, w, 4, "#94a3b8");
      [x + 12, x + w - 28].forEach(wx => {
        px(ctx, wx, y + 36, 16, 20, "#1e293b");
        px(ctx, wx + 2, y + 38, 6, 8, "#38bdf8"); px(ctx, wx + 8, y + 38, 6, 8, "#f43f5e");
        px(ctx, wx + 2, y + 46, 6, 8, "#facc15"); px(ctx, wx + 8, y + 46, 6, 8, "#a855f7");
      });
      const dx = b.doorTx * T;
      px(ctx, dx, y + h - 26, 24, 26, "#451a03");
      px(ctx, dx + 2, y + h - 24, 9, 24, "#78350f"); px(ctx, dx + 13, y + h - 24, 9, 24, "#78350f");
      px(ctx, dx - 4, y + h, 32, 4, "#94a3b8");
    } else if (b.style === "hospital") {
      px(ctx, x, y + 4, w, 14, "#0f766e");
      px(ctx, x + 2, y + 18, w - 4, h - 18, "#f8fafc"); px(ctx, x + 2, y + 18, w - 4, 4, "#cbd5e1");
      const mid = x + Math.floor(w / 2);
      px(ctx, mid - 12, y - 4, 24, 18, "#ffffff");
      px(ctx, mid - 3, y - 2, 6, 14, "#ef4444"); px(ctx, mid - 7, y + 2, 14, 6, "#ef4444");
      ctx.font = "bold 6px monospace"; ctx.fillStyle = "#e0f2fe"; ctx.fillText("HOSPITAL", x + 6, y + 13);
      for (let wx = x + 8; wx < x + w - 16; wx += 22) {
        if (Math.abs(wx - b.doorTx * T) < 16) continue;
        px(ctx, wx, y + 28, 16, 14, "#0284c7"); px(ctx, wx + 2, y + 30, 5, 10, "#7dd3fc");
      }
      const dx = b.doorTx * T;
      px(ctx, dx, y + h - 26, 24, 26, "#334155");
      px(ctx, dx + 2, y + h - 24, 9, 24, "#38bdf8"); px(ctx, dx + 13, y + h - 24, 9, 24, "#38bdf8");
    } else if (b.style === "bookstore") {
      px(ctx, x, y + 4, w, 14, "#14532d");
      px(ctx, x, y + 18, w, h - 18, "#991b1b");
      for (let by = y + 22; by < y + h - 4; by += 8) px(ctx, x + 2, by, w - 4, 1, "#7f1d1d");
      px(ctx, x - 2, y + 24, w + 4, 12, "#15803d");
      for (let ax = x; ax < x + w; ax += 12) px(ctx, ax, y + 24, 6, 12, "#166534");
      ctx.font = "bold 6px monospace"; ctx.fillStyle = "#fde68a"; ctx.fillText("BARNES & NOBLE", x + 16, y + 13);
      [x + 8, x + w - 28].forEach(wx => {
        px(ctx, wx, y + 40, 20, 16, "#fef3c7");
        px(ctx, wx + 2, y + 44, 4, 9, "#ef4444"); px(ctx, wx + 7, y + 43, 4, 10, "#2563eb");
        px(ctx, wx + 12, y + 45, 5, 8, "#16a34a");
      });
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 24, 20, 24, "#14532d"); px(ctx, dx + 5, y + h - 21, 14, 18, "#fde68a");
    } else if (b.style === "party") {
      const pulse = Math.floor(time / 350) % 2 === 0;
      px(ctx, x - 2, y + 6, w + 4, 20, "#312e81"); px(ctx, x + 4, y, w - 8, 10, "#4338ca");
      px(ctx, x, y + 26, w, h - 26, "#475569");
      px(ctx, x + 10, y + 36, 18, 14, pulse ? "#ec4899" : "#22d3ee");
      px(ctx, x + w - 28, y + 36, 18, 14, pulse ? "#22d3ee" : "#a855f7");
      px(ctx, x + 4, y + h - 10, 8, 10, "#09090b");
      px(ctx, x + 6, y + h - 7, 4, 4, pulse ? "#f43f5e" : "#334155");
      px(ctx, x + w - 12, y + h - 5, 4, 5, "#ef4444");
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 24, 20, 24, "#1e1b4b"); px(ctx, dx + 15, y + h - 12, 3, 3, "#facc15");
    }
  }

  function drawPortal(ctx, cx, cy, style = "purgatorio", time = 0) {
    const colors = {
      purgatorio: ["#7c3aed", "#c084fc", "#f5c542"],
      dream: ["#0284c7", "#38bdf8", "#f472b6"],
      bloodmoon: ["#991b1b", "#ef4444", "#fde047"]
    }[style] || ["#7c3aed", "#c084fc", "#f5c542"];

    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.beginPath(); ctx.ellipse(0, 10, 16, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = colors[2]; ctx.lineWidth = 1.5; ctx.stroke();

    px(ctx, -16, -16, 4, 24, "#334155"); px(ctx, 12, -16, 4, 24, "#334155");
    px(ctx, -16, -18, 32, 4, "#475569"); px(ctx, -3, -20, 6, 4, colors[2]);

    const rot = time * 0.004, pulse = Math.sin(time * 0.006) * 2;
    ctx.fillStyle = colors[0] + "aa";
    ctx.beginPath(); ctx.ellipse(0, -3, 11 + pulse * 0.4, 14 + pulse * 0.4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = colors[1]; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, -3, 8, rot, rot + Math.PI * 1.4); ctx.stroke();
    ctx.strokeStyle = colors[2]; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, -3, 4, -rot * 1.5, -rot * 1.5 + Math.PI * 1.2); ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2;
      px(ctx, Math.cos(a) * 12 - 1, Math.sin(a) * 14 - 4, 2, 2, "#ffffff");
    }
    ctx.restore();
  }

  function drawProp(ctx, prop, time = 0) {
    const x = prop.tx * T, y = prop.ty * T;
    if (prop.kind === "couch") {
      const w = 72;
      px(ctx, x, y + 26, w, 6, "rgba(0,0,0,0.3)");
      px(ctx, x, y, w, 12, "#1e3a8a"); px(ctx, x + 2, y + 2, w - 4, 8, "#2563eb");
      px(ctx, x, y + 10, 10, 18, "#1e40af"); px(ctx, x + w - 10, y + 10, 10, 18, "#1e40af");
      px(ctx, x + 10, y + 12, 17, 14, "#3b82f6"); px(ctx, x + 28, y + 12, 17, 14, "#3b82f6");
      px(ctx, x + 46, y + 12, 16, 14, "#3b82f6");
      px(ctx, x + 11, y + 6, 14, 9, "#f8fafc"); px(ctx, x + 13, y + 8, 10, 5, "#e2e8f0");
      px(ctx, x + 44, y + 10, 16, 16, "#a855f7"); px(ctx, x + 46, y + 12, 12, 12, "#c084fc");
      px(ctx, x + 4, y + 26, 6, 3, "#451a03"); px(ctx, x + w - 10, y + 26, 6, 3, "#451a03");
    } else if (prop.kind === "bed") {
      const w = 44;
      px(ctx, x - 2, y + 52, w + 4, 7, "rgba(0,0,0,0.3)");
      px(ctx, x, y, w, 12, "#78350f"); px(ctx, x + 3, y + 2, w - 6, 8, "#92400e");
      px(ctx, x + 2, y + 12, w - 4, 42, "#f8fafc");
      px(ctx, x + 7, y + 13, w - 14, 11, "#e0f2fe"); px(ctx, x + 9, y + 15, w - 18, 7, "#ffffff");
      px(ctx, x + 2, y + 26, w - 4, 28, "#312e81"); px(ctx, x + 2, y + 26, w - 4, 5, "#6366f1");
      px(ctx, x + 2, y + 52, w - 4, 4, "#78350f");
    } else if (prop.kind === "kitchen_counter") {
      const w = 96;
      px(ctx, x, y, w, 28, "#475569"); px(ctx, x + 2, y + 2, w - 4, 16, "#cbd5e1");
      px(ctx, x + 12, y + 5, 14, 10, "#ffffff"); px(ctx, x + 15, y + 7, 8, 6, "#d97706");
      px(ctx, x + 38, y + 5, 14, 10, "#ffffff"); px(ctx, x + 41, y + 7, 4, 4, "#ef4444");
      px(ctx, x + 46, y + 8, 4, 4, "#22c55e"); px(ctx, x + 66, y + 5, 16, 10, "#facc15");
    } else if (prop.kind === "tv") {
      px(ctx, x, y + 10, 48, 12, "#451a03"); px(ctx, x + 4, y - 4, 40, 18, "#0f172a");
      px(ctx, x + 6, y - 2, 36, 14, "#1e3a8a");
    } else if (prop.kind === "rug") {
      const w = (prop.tw || 4) * T, h = (prop.th || 3) * T;
      px(ctx, x, y, w, h, prop.color || "#581c87"); px(ctx, x + 4, y + 4, w - 8, h - 8, prop.inner || "#7e22ce");
    } else if (prop.kind === "altar") {
      px(ctx, x, y, 72, 24, "#cbd5e1"); px(ctx, x + 4, y + 4, 64, 14, "#f8fafc");
      px(ctx, x + 30, y - 8, 12, 16, "#f5c542"); px(ctx, x + 10, y + 2, 4, 8, "#fef08a");
      px(ctx, x + 58, y + 2, 4, 8, "#fef08a");
    } else if (prop.kind === "pew") {
      px(ctx, x, y, 72, 16, "#78350f"); px(ctx, x + 2, y + 2, 68, 6, "#92400e");
    } else if (prop.kind === "bookshelf") {
      px(ctx, x, y, 48, 28, "#78350f");
      const cols = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
      for (let i = 0; i < 8; i++) {
        px(ctx, x + 4 + i * 5, y + 4, 4, 9, cols[i % cols.length]);
        px(ctx, x + 4 + i * 5, y + 16, 4, 9, cols[(i + 2) % cols.length]);
      }
    } else if (prop.kind === "hospital_bed") {
      px(ctx, x, y, 40, 52, "#cbd5e1"); px(ctx, x + 3, y + 4, 34, 44, "#ffffff");
      px(ctx, x + 6, y + 8, 28, 10, "#e0f2fe"); px(ctx, x + 3, y + 24, 34, 24, "#0ea5e9");
    } else if (prop.kind === "party_table") {
      px(ctx, x, y, 72, 24, "#1e293b");
      const glow = Math.floor(time / 300) % 2 === 0 ? "#ec4899" : "#22d3ee";
      px(ctx, x + 8, y + 6, 6, 8, "#ef4444"); px(ctx, x + 20, y + 8, 6, 8, "#ef4444");
      px(ctx, x + 48, y + 4, 16, 14, "#09090b"); px(ctx, x + 52, y + 8, 8, 6, glow);
    } else if (prop.kind === "exit_mat") {
      px(ctx, x, y + 4, 48, 16, "#991b1b"); px(ctx, x + 3, y + 7, 42, 10, "#f5c542");
      ctx.font = "bold 7px monospace"; ctx.fillStyle = "#111"; ctx.fillText("EXIT", x + 15, y + 14);
    }
  }

  return { T, drawRoadTile, drawTree, drawSignpost, drawBuilding, drawPortal, drawProp };
})();
