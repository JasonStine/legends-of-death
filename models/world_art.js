// =========================================================
// models/world_art.js — Dynamic 2-Lane Asphalt Roads, Sidewalks,
//                       Stardew Valley Interiors, Rich Props &
//                       Purgatorio Spectral Reflections (v6)
// =========================================================
window.WorldArt = (() => {
  const T = 24;

  function px(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // ---------------------------------------------------------
  // 1. DYNAMIC 2-LANE ASPHALT ROAD (Tile === 3) — Zero Hardcoding!
  // ---------------------------------------------------------
  function drawRoadTile(ctx, map, x, y, sx, sy, purgatorio = false) {
    const isAsphalt = (tx, ty) => {
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return false;
      return map.grid[ty][tx] === 3;
    };
    const isWalk = (tx, ty) => {
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return false;
      const v = map.grid[ty][tx];
      return v === 3 || v === 4 || v === 5;
    };

    const upA = isAsphalt(x, y - 1), dnA = isAsphalt(x, y + 1);
    const ltA = isAsphalt(x - 1, y), rtA = isAsphalt(x + 1, y);

    // Asphalt surface (shifts cooler/darker in Purgatorio)
    const base = purgatorio ? "#1e1b33" : "#2f3545";
    const hi   = purgatorio ? "#2c264a" : "#3b4257";
    const lo   = purgatorio ? "#151226" : "#252a38";
    px(ctx, sx, sy, T, T, base);
    if ((x + y) % 2 === 0) {
      px(ctx, sx + 5, sy + 6, 2, 1, hi);
      px(ctx, sx + 17, sy + 18, 2, 1, lo);
    } else {
      px(ctx, sx + 15, sy + 8, 2, 1, hi);
      px(ctx, sx + 6, sy + 16, 2, 1, lo);
    }

    // Concrete curbs ONLY where asphalt meets grass/trees (never across sidewalks!)
    const curb = purgatorio ? "#5b5578" : "#94a3b8";
    const curbHi = purgatorio ? "#7c75a1" : "#cbd5e1";
    const curbLo = purgatorio ? "#2d2842" : "#475569";
    if (!isWalk(x, y - 1)) { px(ctx, sx, sy, T, 3, curb); px(ctx, sx, sy, T, 1, curbHi); }
    if (!isWalk(x, y + 1)) { px(ctx, sx, sy + T - 3, T, 3, curb); px(ctx, sx, sy + T - 1, T, 1, curbLo); }
    if (!isWalk(x - 1, y)) { px(ctx, sx, sy, 3, T, curb); px(ctx, sx, sy, 1, T, curbHi); }
    if (!isWalk(x + 1, y)) { px(ctx, sx + T - 3, sy, 3, T, curb); px(ctx, sx + T - 1, sy, 1, T, curbLo); }

    // Detect 2-lane horizontal vs vertical segments dynamically
    const horizBand = (ltA || rtA) && !(upA && dnA);
    const vertBand  = (upA || dnA) && !(ltA && rtA);
    const isIntersection = (upA && dnA && ltA) || (upA && dnA && rtA) || (ltA && rtA && upA && dnA);
    const dashCol = purgatorio ? "#a78bfa" : "#eab308";

    if (!isIntersection) {
      if (horizBand && dnA && !upA && x % 2 === 0) {
        // Top lane of a 2-lane horizontal street -> yellow dash on bottom seam
        px(ctx, sx + 5, sy + T - 1, 14, 2, dashCol);
      } else if (vertBand && rtA && !ltA && y % 2 === 0) {
        // Left lane of a 2-lane vertical street -> yellow dash on right seam
        px(ctx, sx + T - 1, sy + 5, 2, 14, dashCol);
      }
    }
  }

  // ---------------------------------------------------------
  // 2. CLEAN CONCRETE SIDEWALK / FRONT WALKWAY (Tile === 5)
  // ---------------------------------------------------------
  function drawSidewalkTile(ctx, sx, sy, purgatorio = false) {
    const bg = purgatorio ? "#433d5e" : "#94a3b8";
    const inner = purgatorio ? "#524b73" : "#cbd5e1";
    const seam = purgatorio ? "#2e2945" : "#64748b";
    px(ctx, sx, sy, T, T, bg);
    px(ctx, sx + 2, sy + 2, T - 4, T - 4, inner);
    px(ctx, sx + 2, sy + 12, T - 4, 1, seam);
    px(ctx, sx + 12, sy + 2, 1, 10, seam);
  }

  // ---------------------------------------------------------
  // 3. STARDEW VALLEY-STYLE INTERIOR FLOORS & THIN WALLS
  // ---------------------------------------------------------
  function drawInteriorFloorTile(ctx, floorType, tileId, x, y, sx, sy, time = 0, purgatorio = false) {
    // Tile === 7: Secondary room zone floor (e.g., Kitchen/Café cream-tile or Bedroom carpet)
    if (tileId === 7) {
      if (floorType === "wood" || floorType === "bookstore") {
        // Cozy warm cream & terracotta kitchen/café tile
        const c1 = purgatorio ? "#2b2547" : "#e7dec8";
        const c2 = purgatorio ? "#221d3b" : "#d8ccb2";
        px(ctx, sx, sy, T, T, (x + y) % 2 === 0 ? c1 : c2);
        px(ctx, sx, sy + T - 1, T, 1, purgatorio ? "#171329" : "#bfb296");
        px(ctx, sx + T - 1, sy, 1, T, purgatorio ? "#171329" : "#bfb296");
        return true;
      }
      if (floorType === "tile") {
        // Hospital back treatment room sterile light-blue vinyl
        px(ctx, sx, sy, T, T, purgatorio ? "#1c2541" : "#dbeafe");
        px(ctx, sx + 1, sy + 1, T - 1, T - 1, purgatorio ? "#232e52" : "#eff6ff");
        return true;
      }
    }

    if (floorType === "wood" || floorType === "bookstore") {
      // Warm Stardew-style horizontal hardwood planks
      const base = purgatorio ? "#3d3054" : "#b58352";
      const hi   = purgatorio ? "#4b3b66" : "#c49362";
      const seam = purgatorio ? "#2a203b" : "#96673b";
      px(ctx, sx, sy, T, T, base);
      px(ctx, sx, sy + 1, T, 1, hi);
      px(ctx, sx, sy + 7, T, 1, seam);
      px(ctx, sx, sy + 15, T, 1, seam);
      px(ctx, sx, sy + 23, T, 1, seam);
      const j = ((x * 5 + y * 3) % 3) * 7 + 4;
      px(ctx, sx + j, sy, 1, 8, seam);
      px(ctx, sx + ((j + 11) % T), sy + 8, 1, 8, seam);
      return true;
    }

    if (floorType === "stone") {
      // St. Jude Church: Smooth slate stone + stained glass light beams
      const c1 = purgatorio ? "#26233d" : "#526075";
      const c2 = purgatorio ? "#211e36" : "#4b586d";
      px(ctx, sx, sy, T, T, (x + y) % 2 === 0 ? c1 : c2);
      px(ctx, sx, sy + T - 1, T, 1, purgatorio ? "#161426" : "#374254");
      if (!purgatorio && (y === 4 || y === 6 || y === 8)) {
        if (x === 3 || x === 12) px(ctx, sx + 3, sy + 3, 18, 18, "rgba(56, 189, 248, 0.14)");
        if (x === 4 || x === 11) px(ctx, sx + 3, sy + 3, 18, 18, "rgba(250, 204, 21, 0.11)");
      }
      return true;
    }

    if (floorType === "tile") {
      // Hospital Lobby clean warm-white linoleum
      px(ctx, sx, sy, T, T, purgatorio ? "#242742" : "#e2e8f0");
      px(ctx, sx + 1, sy + 1, T - 1, T - 1, purgatorio ? "#2c3052" : "#f1f5f9");
      return true;
    }

    if (floorType === "party") {
      px(ctx, sx, sy, T, T, "#1e1b4b");
      px(ctx, sx, sy + 11, T, 1, "#2a2566");
      if ((x + y) % 4 === 0) {
        const pulse = Math.floor(time / 450) % 2 === 0 ? "rgba(236,72,153,0.13)" : "rgba(34,211,238,0.13)";
        px(ctx, sx + 2, sy + 2, T - 4, T - 4, pulse);
      }
      return true;
    }
    return false;
  }

  // STARDEW VALLEY INTERIOR WALLS:
  // tile === 1: Outer Perimeter Walls (painted drywall + crown molding + baseboard)
  // tile === 6: Sleek Thin Interior Room Divider Wall (NOT chunky full-tile blocks!)
  function drawInteriorWallTile(ctx, map, tileId, x, y, sx, sy, purgatorio = false) {
    const ft = map.floorType;
    const wallTop = purgatorio ? "#2a2145" : (ft === "stone" ? "#3b475c" : (ft === "tile" ? "#cbd5e1" : (ft === "party" ? "#1e1947" : "#d6c3a5")));
    const wallBot = purgatorio ? "#1d1633" : (ft === "stone" ? "#293345" : (ft === "tile" ? "#94a3b8" : (ft === "party" ? "#141033" : "#8c6239")));
    const trim    = purgatorio ? "#6d4aff" : (ft === "stone" ? "#64748b" : (ft === "tile" ? "#0f766e" : (ft === "party" ? "#6366f1" : "#6b4423")));
    const cap     = "#141624";

    // SLEEK THIN PARTITION WALL (Tile === 6) — Drawn over floor!
    if (tileId === 6) {
      drawInteriorFloorTile(ctx, ft, 0, x, y, sx, sy, 0, purgatorio);
      const hasUp = y > 0 && (map.grid[y - 1][x] === 6 || map.grid[y - 1][x] === 1);
      const hasDn = y < map.h - 1 && (map.grid[y + 1][x] === 6 || map.grid[y + 1][x] === 1);
      const hasLt = x > 0 && (map.grid[y][x - 1] === 6 || map.grid[y][x - 1] === 1);
      const hasRt = x < map.w - 1 && (map.grid[y][x + 1] === 6 || map.grid[y][x + 1] === 1);

      if (hasLt || hasRt) {
        // Horizontal room divider with wainscoting & baseboard
        px(ctx, sx, sy + 4, T, 16, cap);
        px(ctx, sx, sy + 5, T, 3, trim);
        px(ctx, sx, sy + 8, T, 7, wallTop);
        px(ctx, sx, sy + 15, T, 4, wallBot);
      } else {
        // Vertical room divider (slim 10px architectural wall, centered)
        px(ctx, sx + 7, sy, 10, T, cap);
        px(ctx, sx + 8, sy, 8, T, wallTop);
        px(ctx, sx + 9, sy, 6, T, trim);
        if (!hasDn) {
          // Clean end-cap with baseboard at doorway
          px(ctx, sx + 7, sy + T - 5, 10, 5, wallBot);
        }
      }
      return;
    }

    // OUTER PERIMETER WALLS (Tile === 1)
    if (y === 0) {
      // Ceiling border + upper wall top
      px(ctx, sx, sy, T, 10, cap);
      px(ctx, sx, sy + 10, T, 3, trim);
      px(ctx, sx, sy + 13, T, 11, wallTop);
    } else if (y === 1) {
      // Lower half of back wall + wainscoting + baseboard
      px(ctx, sx, sy, T, 14, wallTop);
      px(ctx, sx, sy + 14, T, 2, trim);
      px(ctx, sx, sy + 16, T, 7, wallBot);
      px(ctx, sx, sy + 23, T, 1, cap);

      // Decorative windows / stained glass on back wall
      if (ft === "stone" && (x === 3 || x === 12)) {
        px(ctx, sx + 4, sy - 4, 16, 17, "#0f172a");
        px(ctx, sx + 6, sy - 2, 6, 6, purgatorio ? "#a855f7" : "#38bdf8");
        px(ctx, sx + 12, sy - 2, 6, 6, purgatorio ? "#7c3aed" : "#f43f5e");
        px(ctx, sx + 6, sy + 4, 6, 7, "#facc15");
        px(ctx, sx + 12, sy + 4, 6, 7, "#a855f7");
      } else if ((ft === "wood" || ft === "bookstore") && (x === 3 || x === 13)) {
        px(ctx, sx + 4, sy - 2, 16, 14, "#6b4423");
        px(ctx, sx + 6, sy, 12, 10, purgatorio ? "#312e81" : "#bae6fd");
        px(ctx, sx + 11, sy, 2, 10, "#6b4423");
        px(ctx, sx + 6, sy + 5, 12, 1, "#6b4423");
      }
    } else if (y === map.h - 1) {
      px(ctx, sx, sy, T, 4, trim);
      px(ctx, sx, sy + 4, T, T - 4, cap);
    } else {
      // Sleek left/right outer wall framing
      if (x === 0) {
        px(ctx, sx, sy, 16, T, cap);
        px(ctx, sx + 16, sy, 6, T, wallBot);
        px(ctx, sx + 22, sy, 2, T, trim);
      } else {
        px(ctx, sx, sy, 2, T, trim);
        px(ctx, sx + 2, sy, 6, T, wallBot);
        px(ctx, sx + 8, sy, 16, T, cap);
      }
    }
  }

  // ---------------------------------------------------------
  // 4. TREES, SIGNPOSTS, BUILDINGS & PORTALS
  // ---------------------------------------------------------
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

  function drawBuilding(ctx, b, time = 0, purgatorio = false) {
    const x = b.tx * T, y = b.ty * T, w = b.tw * T, h = b.th * T;
    px(ctx, x + 4, y + h - 4, w - 2, 8, "rgba(0,0,0,0.32)");

    if (b.style === "house") {
      px(ctx, x - 3, y + 6, w + 6, 22, purgatorio ? "#3b1d5e" : "#9a3412");
      px(ctx, x + 2, y, w - 4, 12, purgatorio ? "#4c257a" : "#c2410c");
      for (let rx = x; rx < x + w; rx += 8) {
        px(ctx, rx, y + 14, 6, 2, purgatorio ? "#291242" : "#7c2d12");
        px(ctx, rx + 4, y + 20, 6, 2, purgatorio ? "#291242" : "#7c2d12");
      }
      px(ctx, x + w - 18, y - 6, 10, 18, "#7f1d1d"); px(ctx, x + w - 19, y - 8, 12, 3, "#991b1b");
      px(ctx, x, y + 28, w, h - 28, purgatorio ? "#c7c0d8" : "#fef3c7");
      px(ctx, x, y + h - 8, w, 8, "#94a3b8");
      [x + 10, x + w - 26].forEach(wx => {
        px(ctx, wx - 3, y + 36, 22, 16, "#1e3a8a");
        px(ctx, wx, y + 38, 16, 12, purgatorio ? "#a78bfa" : "#fde68a");
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
      px(ctx, x, y + 28, w, h - 28, purgatorio ? "#9ca3af" : "#cbd5e1");
      px(ctx, x, y + 28, w, 4, "#94a3b8");
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
      px(ctx, x, y + 4, w, 14, purgatorio ? "#312e81" : "#0f766e");
      px(ctx, x + 2, y + 18, w - 4, h - 18, purgatorio ? "#cbd5e1" : "#f8fafc");
      px(ctx, x + 2, y + 18, w - 4, 4, "#94a3b8");
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
      px(ctx, x, y + 18, w, h - 18, purgatorio ? "#581c45" : "#991b1b");
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

    // Subtle Purgatorio spectral rune sigil glowing above roofs in Purgatorio mode!
    if (purgatorio) {
      const glow = 0.55 + Math.sin(time * 0.005 + x) * 0.35;
      ctx.strokeStyle = `rgba(192, 132, 252, ${glow})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - 1, y + 1, w + 2, h - 1);
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

  // ---------------------------------------------------------
  // 5. RICH INTERIOR PROPS & PURGATORIO-ONLY OBJECTS
  // ---------------------------------------------------------
  function drawProp(ctx, prop, time = 0) {
    const x = prop.tx * T, y = prop.ty * T;

    if (prop.kind === "couch") {
      const w = 72;
      px(ctx, x, y + 26, w, 6, "rgba(0,0,0,0.28)");
      px(ctx, x, y, w, 12, "#1e3a8a"); px(ctx, x + 2, y + 2, w - 4, 8, "#2563eb");
      px(ctx, x, y + 10, 10, 18, "#1e40af"); px(ctx, x + w - 10, y + 10, 10, 18, "#1e40af");
      px(ctx, x + 10, y + 12, 17, 14, "#3b82f6"); px(ctx, x + 28, y + 12, 17, 14, "#3b82f6");
      px(ctx, x + 46, y + 12, 16, 14, "#3b82f6");
      px(ctx, x + 11, y + 6, 14, 9, "#f8fafc"); px(ctx, x + 13, y + 8, 10, 5, "#e2e8f0");
      px(ctx, x + 44, y + 10, 16, 16, "#a855f7"); px(ctx, x + 46, y + 12, 12, 12, "#c084fc");
      px(ctx, x + 4, y + 26, 6, 3, "#451a03"); px(ctx, x + w - 10, y + 26, 6, 3, "#451a03");
    } else if (prop.kind === "bed") {
      const w = 44;
      px(ctx, x - 2, y + 52, w + 4, 7, "rgba(0,0,0,0.28)");
      px(ctx, x, y, w, 12, "#78350f"); px(ctx, x + 3, y + 2, w - 6, 8, "#92400e");
      px(ctx, x + 2, y + 12, w - 4, 42, "#f8fafc");
      px(ctx, x + 7, y + 13, w - 14, 11, "#e0f2fe"); px(ctx, x + 9, y + 15, w - 18, 7, "#ffffff");
      px(ctx, x + 2, y + 26, w - 4, 28, "#312e81"); px(ctx, x + 2, y + 26, w - 4, 5, "#6366f1");
      px(ctx, x + 2, y + 52, w - 4, 4, "#78350f");
    } else if (prop.kind === "nightstand") {
      px(ctx, x + 2, y + 4, 20, 18, "#78350f"); px(ctx, x + 4, y + 6, 16, 14, "#92400e");
      px(ctx, x + 7, y - 2, 10, 7, "#fef08a"); // bedside lamp shade
      px(ctx, x + 11, y + 5, 2, 3, "#451a03");
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
      px(ctx, x, y, 72, 14, "#5c2d0c"); px(ctx, x + 2, y + 2, 68, 5, "#8c4a1c");
      px(ctx, x + 2, y + 8, 68, 4, "#78350f");
    } else if (prop.kind === "flower_stand") {
      px(ctx, x + 8, y + 10, 8, 12, "#cbd5e1");
      px(ctx, x + 4, y + 2, 16, 10, "#15803d");
      px(ctx, x + 6, y + 3, 4, 4, "#f8fafc"); px(ctx, x + 13, y + 4, 4, 4, "#f472b6");
      px(ctx, x + 10, y + 7, 4, 4, "#facc15");
    } else if (prop.kind === "bookshelf") {
      px(ctx, x, y, 48, 26, "#5c2d0c"); px(ctx, x + 2, y + 2, 44, 22, "#78350f");
      const cols = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
      for (let i = 0; i < 8; i++) {
        px(ctx, x + 4 + i * 5, y + 4, 4, 8, cols[i % cols.length]);
        px(ctx, x + 4 + i * 5, y + 14, 4, 8, cols[(i + 2) % cols.length]);
      }
    } else if (prop.kind === "coffee_counter") {
      // Barnes & Noble Café Bar (Espresso Machine + Pastry Case)
      const w = 72;
      px(ctx, x, y, w, 26, "#451a03"); px(ctx, x + 2, y + 2, w - 4, 15, "#d6b892");
      // Espresso Machine
      px(ctx, x + 6, y - 4, 18, 14, "#334155"); px(ctx, x + 8, y - 2, 14, 6, "#94a3b8");
      px(ctx, x + 12, y + 6, 6, 4, "#f8fafc"); // coffee mug
      // Glass Pastry Case
      px(ctx, x + 32, y - 2, 32, 14, "#bae6fd");
      px(ctx, x + 35, y + 3, 7, 5, "#d97706"); // croissant
      px(ctx, x + 46, y + 3, 7, 5, "#92400e"); // brownie
      px(ctx, x + 55, y + 3, 6, 5, "#f472b6"); // cupcake
    } else if (prop.kind === "cafe_table") {
      px(ctx, x + 2, y + 4, 20, 16, "#78350f"); px(ctx, x + 4, y + 6, 16, 12, "#b45309");
      px(ctx, x + 8, y + 9, 4, 4, "#f8fafc"); px(ctx, x + 14, y + 11, 4, 4, "#fef3c7");
    } else if (prop.kind === "reception_desk") {
      // Hospital Reception Counter + Monitor + Clipboard
      const w = 72;
      px(ctx, x, y, w, 24, "#0f766e"); px(ctx, x + 2, y + 2, w - 4, 14, "#f1f5f9");
      px(ctx, x + 10, y - 3, 18, 12, "#1e293b"); px(ctx, x + 12, y - 1, 14, 8, "#38bdf8");
      px(ctx, x + 42, y + 4, 14, 9, "#fef3c7"); // clipboard
      px(ctx, x + 31, y + 18, 10, 4, "#ef4444"); // mini red cross
    } else if (prop.kind === "waiting_chair") {
      px(ctx, x + 2, y + 4, 20, 16, "#0369a1"); px(ctx, x + 4, y + 6, 16, 10, "#38bdf8");
    } else if (prop.kind === "hospital_bed") {
      px(ctx, x, y, 40, 48, "#94a3b8"); px(ctx, x + 3, y + 4, 34, 40, "#ffffff");
      px(ctx, x + 6, y + 7, 28, 9, "#e0f2fe"); px(ctx, x + 3, y + 22, 34, 22, "#0ea5e9");
    } else if (prop.kind === "med_machine") {
      // Animated ECG Heart-Rate Monitor + IV Drip Pole!
      px(ctx, x + 2, y, 20, 24, "#475569");
      px(ctx, x + 4, y + 2, 16, 11, "#052e16");
      const beat = Math.floor(time / 220) % 4;
      px(ctx, x + 6 + beat * 3, y + 6, 3, 3, "#4ade80"); // blinking ECG pulse
      px(ctx, x + 6, y + 16, 4, 3, "#ef4444"); px(ctx, x + 12, y + 16, 5, 3, "#38bdf8");
    } else if (prop.kind === "plant") {
      px(ctx, x + 7, y + 14, 10, 8, "#9a3412");
      px(ctx, x + 4, y + 4, 16, 11, "#15803d"); px(ctx, x + 7, y + 2, 10, 8, "#22c55e");
    } else if (prop.kind === "party_table") {
      px(ctx, x, y, 72, 24, "#1e293b");
      const glow = Math.floor(time / 300) % 2 === 0 ? "#ec4899" : "#22d3ee";
      px(ctx, x + 8, y + 6, 6, 8, "#ef4444"); px(ctx, x + 20, y + 8, 6, 8, "#ef4444");
      px(ctx, x + 48, y + 4, 16, 14, "#09090b"); px(ctx, x + 52, y + 8, 8, 6, glow);
    } else if (prop.kind === "pc_desk") {
      px(ctx, x, y + 6, 44, 18, "#78350f"); px(ctx, x + 2, y + 8, 40, 14, "#92400e");
      px(ctx, x + 10, y - 4, 24, 15, "#1e293b");
      const scr = Math.floor(time / 500) % 2 === 0 ? "#16a34a" : "#22c55e";
      px(ctx, x + 12, y - 2, 20, 11, "#052e16");
      px(ctx, x + 15, y + 2, 8, 2, scr); px(ctx, x + 26, y + 5, 2, 2, "#ef4444");
      px(ctx, x + 12, y + 13, 20, 4, "#cbd5e1");
    } else if (prop.kind === "fridge") {
      px(ctx, x + 2, y - 4, 20, 28, "#cbd5e1");
      px(ctx, x + 4, y - 2, 16, 10, "#f8fafc"); px(ctx, x + 4, y + 10, 16, 12, "#e2e8f0");
      px(ctx, x + 17, y + 2, 2, 5, "#64748b"); px(ctx, x + 17, y + 12, 2, 6, "#64748b");
    } else if (prop.kind === "plaque") {
      px(ctx, x + 4, y + 4, 16, 14, "#78350f"); px(ctx, x + 6, y + 6, 12, 10, "#f5c542");
      px(ctx, x + 8, y + 9, 8, 1, "#78350f"); px(ctx, x + 8, y + 12, 6, 1, "#78350f");
    } else if (prop.kind === "purg_crystal") {
      // Purgatorio-ONLY Floating Violet Reaperian Text Crystal!
      const bob = Math.sin(time * 0.006 + x) * 2.5;
      ctx.fillStyle = "rgba(168, 85, 247, 0.3)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 20, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 4 + bob, 6, 12, "#a855f7");
      px(ctx, x + 10, y + 2 + bob, 4, 16, "#d8b4fe");
      px(ctx, x + 11, y + 6 + bob, 2, 6, "#ffffff");
    } else if (prop.kind === "poison_trace") {
      // Purgatorio-ONLY Glowing Black Envy Poison Residue!
      const glow = 0.55 + Math.sin(time * 0.007 + x) * 0.35;
      ctx.fillStyle = `rgba(16, 185, 129, ${glow})`;
      ctx.beginPath(); ctx.ellipse(x + 12, y + 12, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 7, y + 10, 10, 4, "#111827");
      px(ctx, x + 10, y + 8, 4, 2, "#a855f7");
    } else if (prop.kind === "exit_mat") {
      px(ctx, x, y + 4, 48, 16, "#991b1b"); px(ctx, x + 3, y + 7, 42, 10, "#f5c542");
      ctx.font = "bold 7px monospace"; ctx.fillStyle = "#111"; ctx.fillText("EXIT", x + 15, y + 14);
    }
  }

  return { T, drawRoadTile, drawSidewalkTile, drawInteriorFloorTile, drawInteriorWallTile, drawTree, drawSignpost, drawBuilding, drawPortal, drawProp };
})();
