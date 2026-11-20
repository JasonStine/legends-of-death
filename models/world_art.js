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
      // Modern Colorado Springs dark espresso/walnut hardwood (Bookstore stays warm mahogany)
      const isStore = floorType === "bookstore";
      const base = purgatorio ? "#2d2442" : (isStore ? "#7c4f31" : "#6b5344");
      const hi   = purgatorio ? "#392e54" : (isStore ? "#8f5d3c" : "#7a604f");
      const seam = purgatorio ? "#1e172e" : (isStore ? "#5e3a22" : "#523e32");
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

    if (floorType === "candy") {
      // Sweet Tooth Boutique: Soft Pastel Cream & Rose-Pink Checkered Tile!
      const c1 = purgatorio ? "#291a3d" : "#fff5f9";
      const c2 = purgatorio ? "#201330" : "#fce7f3";
      px(ctx, sx, sy, T, T, (x + y) % 2 === 0 ? c1 : c2);
      px(ctx, sx, sy + T - 1, T, 1, purgatorio ? "#160d24" : "#f9a8d4");
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

  // STARDEW-STYLE DYNAMIC MULTI-ROOM WALLS (Supports Non-Cubic Wings, Hallways & Alcoves!)
  // tile === 12: Void outside the building contour (pure dark backdrop)
  // tile === 1 or 6: Auto-tiled wall hugging any walkable floor (0, 4, 7, 11)
  function drawInteriorWallTile(ctx, map, tileId, x, y, sx, sy, purgatorio = false) {
    if (tileId === 12) {
      px(ctx, sx, sy, T, T, "#090b12");
      return;
    }

    const ft = map.floorType;
    const isFloor = (tx, ty) => {
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return false;
      const v = map.grid[ty][tx];
      return v === 0 || v === 4 || v === 7 || v === 11;
    };

    const flUp = isFloor(x, y - 1);
    const flDn = isFloor(x, y + 1);
    const flLt = isFloor(x - 1, y);
    const flRt = isFloor(x + 1, y);
    const flDn2 = isFloor(x, y + 2);

    // Book-Accurate Modern Colorado Springs Urban-Fantasy Palette
    const wallTop = purgatorio ? "#231b3b"
      : (ft === "stone" ? "#3b475c"
      : (ft === "tile" ? "#e2e8f0"
      : (ft === "party" ? "#1e1947"
      : (ft === "candy" ? "#fbcfe8"
      : (ft === "bookstore" ? "#7f2d2d" : "#cbd5e1")))));
    const wallBot = purgatorio ? "#161029"
      : (ft === "stone" ? "#252f42"
      : (ft === "tile" ? "#94a3b8"
      : (ft === "party" ? "#120e2e"
      : (ft === "candy" ? "#f472b6"
      : (ft === "bookstore" ? "#4a2511" : "#64748b")))));
    const trimHi = purgatorio ? "#8b5cf6"
      : (ft === "stone" ? "#64748b"
      : (ft === "tile" ? "#0f766e"
      : (ft === "party" ? "#818cf8"
      : (ft === "candy" ? "#db2777"
      : (ft === "bookstore" ? "#92400e" : "#475569")))));
    const trimMid = purgatorio ? "#5b21b6"
      : (ft === "stone" ? "#475569"
      : (ft === "tile" ? "#0d9488"
      : (ft === "party" ? "#4f46e5"
      : (ft === "candy" ? "#be185d"
      : (ft === "bookstore" ? "#6b3410" : "#334155")))));
    const cap = "#090b12";

    // Interior thin divider (tile === 6) — cleanly drawn over floor without ugly seams
    if (tileId === 6) {
      drawInteriorFloorTile(ctx, ft, 0, x, y, sx, sy, 0, purgatorio);
      if (flDn && !flUp) {
        // Horizontal divider showing front face
        px(ctx, sx, sy + 2, T, 20, cap);
        px(ctx, sx, sy + 3, T, 3, trimHi);
        px(ctx, sx, sy + 6, T, 9, wallTop);
        px(ctx, sx, sy + 15, T, 5, wallBot);
      } else if (flUp && flDn) {
        // Thin horizontal partition between two rooms
        px(ctx, sx, sy + 4, T, 16, cap);
        px(ctx, sx, sy + 5, T, 3, trimHi);
        px(ctx, sx, sy + 8, T, 6, wallTop);
        px(ctx, sx, sy + 14, T, 5, wallBot);
      } else {
        // Clean slim vertical divider (8px wide, centered)
        px(ctx, sx + 8, sy, 8, T, cap);
        px(ctx, sx + 9, sy, 6, T, trimMid);
        px(ctx, sx + 10, sy, 4, T, trimHi);
      }
      return;
    }

    // Perimeter Wall (tile === 1):
    // Case A: Visible Front-Facing North Wall (floor directly below!)
    if (flDn) {
      px(ctx, sx, sy, T, 14, wallTop);
      px(ctx, sx, sy + 14, T, 2, trimHi);
      px(ctx, sx, sy + 16, T, 7, wallBot);
      px(ctx, sx, sy + 23, T, 1, cap);
      // Decorative windows / stained glass / paintings along back walls
      if (ft === "stone" && (x % 5 === 3)) {
        px(ctx, sx + 4, sy - 4, 16, 16, "#0f172a");
        px(ctx, sx + 6, sy - 2, 6, 6, purgatorio ? "#a855f7" : "#38bdf8");
        px(ctx, sx + 12, sy - 2, 6, 6, purgatorio ? "#7c3aed" : "#f43f5e");
        px(ctx, sx + 6, sy + 4, 6, 6, "#facc15");
        px(ctx, sx + 12, sy + 4, 6, 6, "#a855f7");
      } else if ((ft === "wood" || ft === "candy") && (x === 3 || x === 12)) {
        px(ctx, sx + 3, sy - 2, 18, 13, trimMid);
        px(ctx, sx + 5, sy, 14, 9, purgatorio ? "#312e81" : "#e0f2fe");
        px(ctx, sx + 11, sy, 2, 9, trimMid);
        px(ctx, sx + 5, sy + 4, 14, 1, trimMid);
      } else if (ft === "wood" && x === 7) {
        px(ctx, sx + 3, sy - 1, 18, 12, "#78350f");
        px(ctx, sx + 5, sy + 1, 14, 4, "#38bdf8");
        px(ctx, sx + 5, sy + 5, 14, 4, "#22c55e");
      }
      return;
    }

    // Case B: Upper Crown Cap above a North Wall (floor 2 tiles below!)
    if (flDn2) {
      px(ctx, sx, sy, T, 10, cap);
      px(ctx, sx, sy + 10, T, 4, trimHi);
      px(ctx, sx, sy + 14, T, 2, trimMid);
      px(ctx, sx, sy + 16, T, 8, wallTop);
      return;
    }

    // Case C: Side / Bottom / Corner Framing hugging the room contour
    px(ctx, sx, sy, T, T, cap);
    if (flUp) {
      px(ctx, sx, sy, T, 4, trimHi);
      px(ctx, sx, sy + 4, T, 3, trimMid);
    }
    if (flRt) {
      px(ctx, sx + T - 6, sy, 4, T, trimMid);
      px(ctx, sx + T - 2, sy, 2, T, trimHi);
    }
    if (flLt) {
      px(ctx, sx, sy, 2, T, trimHi);
      px(ctx, sx + 2, sy, 4, T, trimMid);
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
    } else if (b.style === "school") {
      // COLORADO SPRINGS HIGH SCHOOL: Brick Campus + Clocktower
      px(ctx, x, y + 4, w, 16, "#7f1d1d");
      px(ctx, x, y + 20, w, h - 20, purgatorio ? "#4c2c44" : "#b91c1c");
      for (let by = y + 24; by < y + h - 4; by += 7) px(ctx, x + 2, by, w - 4, 1, "#991b1b");
      // Clocktower centerpiece
      const mid = x + Math.floor(w / 2);
      px(ctx, mid - 14, y - 16, 28, 22, "#991b1b");
      px(ctx, mid - 16, y - 18, 32, 4, "#450a0a");
      px(ctx, mid - 7, y - 12, 14, 14, "#fef3c7"); // clock face
      px(ctx, mid - 1, y - 9, 2, 5, "#111"); px(ctx, mid - 1, y - 5, 5, 2, "#111");
      ctx.font = "bold 6px monospace"; ctx.fillStyle = "#fef08a"; ctx.fillText("CS HIGH SCHOOL", x + 16, y + 15);
      // Tall classroom windows
      [x + 8, x + w - 26].forEach(wx => {
        px(ctx, wx, y + 32, 18, 18, "#bae6fd");
        px(ctx, wx + 8, y + 32, 2, 18, "#7f1d1d"); px(ctx, wx, y + 40, 18, 2, "#7f1d1d");
      });
      const dx = b.doorTx * T;
      px(ctx, dx, y + h - 24, 24, 24, "#451a03");
      px(ctx, dx + 2, y + h - 22, 9, 22, "#92400e"); px(ctx, dx + 13, y + h - 22, 9, 22, "#92400e");
    } else if (b.style === "candy_shop") {
      // MALL CANDY STORE (Ch. XII): Striped Pink/Cream Awning & Pastel Windows
      px(ctx, x, y + 4, w, 14, "#be185d");
      px(ctx, x, y + 18, w, h - 18, purgatorio ? "#4c1d4b" : "#fdf2f8");
      // Pink & White Striped Awning
      px(ctx, x - 2, y + 22, w + 4, 11, "#ec4899");
      for (let ax = x; ax < x + w; ax += 12) px(ctx, ax, y + 22, 6, 11, "#fbcfe8");
      ctx.font = "bold 6px monospace"; ctx.fillStyle = "#fef08a"; ctx.fillText("SWEET TOOTH", x + 22, y + 13);
      [x + 8, x + w - 28].forEach(wx => {
        px(ctx, wx, y + 38, 20, 16, "#bae6fd");
        px(ctx, wx + 3, y + 44, 5, 7, "#ef4444"); px(ctx, wx + 10, y + 42, 5, 9, "#a855f7");
      });
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 24, 20, 24, "#be185d"); px(ctx, dx + 5, y + h - 21, 14, 18, "#fde68a");
    } else if (b.style === "neighbor_house") {
      // EXTRA SUBURBAN NEIGHBOR HOUSE (Slate Blue/Sage Craftsman)
      px(ctx, x - 3, y + 6, w + 6, 22, "#1e3a8a");
      px(ctx, x + 2, y, w - 4, 12, "#2563eb");
      px(ctx, x, y + 28, w, h - 28, purgatorio ? "#94a3b8" : "#dbeafe");
      px(ctx, x, y + h - 8, w, 8, "#64748b");
      [x + 10, x + w - 26].forEach(wx => {
        px(ctx, wx - 2, y + 36, 20, 15, "#1e293b"); px(ctx, wx, y + 38, 16, 11, "#fef08a");
      });
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 25, 20, 25, "#1e3a8a"); px(ctx, dx + 5, y + h - 22, 14, 20, "#3b82f6");
      px(ctx, dx + 15, y + h - 12, 3, 3, "#facc15");
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
      px(ctx, x + 2, y + 14, 68, 4, "rgba(0,0,0,0.28)"); // soft floor shadow
      px(ctx, x, y + 1, 72, 13, "#451a03");
      px(ctx, x + 2, y + 2, 68, 5, "#8c4a1c"); // backrest
      px(ctx, x + 2, y + 8, 68, 4, "#78350f"); // seat
      px(ctx, x + 3, y + 12, 4, 4, "#451a03"); // symmetrical left leg
      px(ctx, x + 65, y + 12, 4, 4, "#451a03"); // symmetrical right leg
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
    } else if (prop.kind === "play_mat") {
      // Barnes & Noble Kids' Play Section Colorful Foam Mat!
      const w = (prop.tw || 3) * T, h = (prop.th || 2) * T;
      const cols = ["#ef4444", "#3b82f6", "#facc15", "#22c55e"];
      for (let yy = 0; yy < (prop.th || 2); yy++) {
        for (let xx = 0; xx < (prop.tw || 3); xx++) {
          px(ctx, x + xx * T, y + yy * T, T, T, cols[(xx + yy) % 4]);
          px(ctx, x + xx * T + 2, y + yy * T + 2, T - 4, T - 4, "rgba(255,255,255,0.18)");
        }
      }
    } else if (prop.kind === "toy_blocks") {
      px(ctx, x + 3, y + 10, 8, 8, "#ef4444"); px(ctx, x + 12, y + 11, 8, 7, "#3b82f6");
      px(ctx, x + 7, y + 3, 8, 8, "#facc15");
    } else if (prop.kind === "dj_booth") {
      const w = 72;
      px(ctx, x, y + 2, w, 22, "#0f172a"); px(ctx, x + 2, y + 4, w - 4, 14, "#1e293b");
      const glow = Math.floor(time / 220) % 2 === 0 ? "#ec4899" : "#22d3ee";
      px(ctx, x + 8, y + 6, 14, 10, "#cbd5e1"); px(ctx, x + 11, y + 8, 8, 6, "#09090b"); // turntable L
      px(ctx, x + 50, y + 6, 14, 10, "#cbd5e1"); px(ctx, x + 53, y + 8, 8, 6, "#09090b"); // turntable R
      px(ctx, x + 28, y + 8, 16, 6, glow); // neon mixer
    } else if (prop.kind === "disco_ball") {
      const pulse = Math.floor(time / 300) % 3;
      const cols = ["rgba(236,72,153,0.16)", "rgba(34,211,238,0.16)", "rgba(168,85,247,0.16)"];
      ctx.fillStyle = cols[pulse];
      ctx.beginPath(); ctx.arc(x + 12, y + 12, 26, 0, Math.PI * 2); ctx.fill();
    } else if (prop.kind === "dining_table") {
      px(ctx, x, y + 4, 48, 20, "#78350f"); px(ctx, x + 2, y + 6, 44, 14, "#b45309");
      px(ctx, x + 8, y + 9, 8, 6, "#f8fafc"); px(ctx, x + 32, y + 9, 8, 6, "#f8fafc");
    } else if (prop.kind === "sink_counter") {
      px(ctx, x, y, 48, 22, "#94a3b8"); px(ctx, x + 2, y + 2, 44, 14, "#f1f5f9");
      px(ctx, x + 14, y + 5, 18, 9, "#38bdf8");
    } else if (prop.kind === "locker_row") {
      const w = 72;
      px(ctx, x, y, w, 24, "#1e3a8a");
      for (let lx = 0; lx < w; lx += 12) {
        px(ctx, x + lx + 1, y + 2, 10, 20, "#2563eb");
        px(ctx, x + lx + 3, y + 5, 6, 2, "#93c5fd");
        px(ctx, x + lx + 8, y + 12, 2, 3, "#facc15");
      }
    } else if (prop.kind === "chalkboard") {
      px(ctx, x, y, 96, 18, "#78350f"); px(ctx, x + 3, y + 2, 90, 14, "#14532d");
      px(ctx, x + 10, y + 6, 28, 2, "#f8fafc"); px(ctx, x + 10, y + 10, 44, 2, "#bbf7d0");
    } else if (prop.kind === "school_desk") {
      // Clean symmetrical school desk + chair (NO black/green wall tile behind it!)
      px(ctx, x + 3, y + 19, 18, 3, "rgba(0,0,0,0.22)");
      px(ctx, x + 4, y + 15, 2, 5, "#475569"); px(ctx, x + 18, y + 15, 2, 5, "#475569"); // symmetrical metal legs
      px(ctx, x + 2, y + 4, 20, 12, "#78350f"); px(ctx, x + 3, y + 5, 18, 10, "#d97706"); // desk top
      px(ctx, x + 6, y + 7, 7, 6, "#f8fafc"); px(ctx, x + 7, y + 9, 5, 1, "#94a3b8"); // notebook
      px(ctx, x + 15, y + 8, 3, 1, "#eab308"); // yellow pencil
    } else if (prop.kind === "candy_case") {
      const w = 72;
      px(ctx, x, y, w, 24, "#be185d"); px(ctx, x + 2, y + 2, w - 4, 14, "#fdf2f8");
      const ccols = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7", "#ec4899"];
      for (let i = 0; i < 6; i++) px(ctx, x + 6 + i * 10, y + 5, 7, 8, ccols[i]);
    } else if (prop.kind === "arcade_cab") {
      px(ctx, x + 3, y - 4, 18, 28, "#312e81"); px(ctx, x + 5, y - 2, 14, 10, "#22d3ee");
      px(ctx, x + 5, y + 10, 14, 5, "#f43f5e"); px(ctx, x + 7, y + 11, 3, 3, "#facc15");
    } else if (prop.kind === "bush") {
      px(ctx, x + 3, y + 8, 18, 12, "#15803d"); px(ctx, x + 5, y + 5, 14, 10, "#22c55e");
      px(ctx, x + 8, y + 8, 3, 3, "#f472b6"); px(ctx, x + 14, y + 11, 3, 3, "#facc15");
    } else if (prop.kind === "lamp") {
      // Warm Stardew glowing floor lamp with amber light halo!
      const glow = 0.22 + Math.sin(time * 0.005 + x) * 0.05;
      ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
      ctx.beginPath(); ctx.arc(x + 12, y + 8, 16, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 18, 6, 3, "#78350f");
      px(ctx, x + 11, y + 9, 2, 10, "#92400e");
      px(ctx, x + 6, y + 2, 12, 8, "#fef08a");
      px(ctx, x + 7, y + 3, 10, 6, "#fde047");
    } else if (prop.kind === "fireplace") {
      // Cozy Stardew brick hearth with flickering fire!
      px(ctx, x + 2, y - 2, 44, 24, "#7c2d12");
      px(ctx, x + 4, y, 40, 20, "#9a3412");
      px(ctx, x, y - 4, 48, 4, "#78350f"); // wooden mantle
      px(ctx, x + 12, y + 6, 24, 14, "#1c1917"); // firebox
      const f = Math.floor(time / 180) % 2;
      px(ctx, x + 16, y + 11 - f, 16, 8 + f, "#f97316");
      px(ctx, x + 19, y + 13 - f, 10, 6, "#facc15");
    } else if (prop.kind === "closet_rack") {
      // Wardrobe / Hanging Clothes Rack for Jacob's Closet!
      px(ctx, x, y, 48, 24, "#5c2d0c");
      px(ctx, x + 2, y + 2, 44, 20, "#78350f");
      px(ctx, x + 4, y + 4, 40, 2, "#cbd5e1"); // hanging rod
      const shirts = ["#2563eb", "#7c3aed", "#ef4444", "#16a34a", "#f59e0b"];
      shirts.forEach((c, i) => px(ctx, x + 5 + i * 8, y + 6, 6, 13, c));
    } else if (prop.kind === "candelabra") {
      // Tall Golden Church Candelabra with flickering flames!
      const glow = 0.25 + Math.sin(time * 0.008 + y) * 0.07;
      ctx.fillStyle = `rgba(250, 204, 21, ${glow})`;
      ctx.beginPath(); ctx.arc(x + 12, y + 5, 13, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 18, 6, 3, "#b45309");
      px(ctx, x + 11, y + 7, 2, 12, "#f5c542");
      px(ctx, x + 6, y + 6, 12, 2, "#f5c542");
      px(ctx, x + 6, y + 3, 2, 4, "#fef3c7");
      px(ctx, x + 11, y + 2, 2, 5, "#fef3c7");
      px(ctx, x + 16, y + 3, 2, 4, "#fef3c7");
      const fl = Math.floor(time / 200) % 2;
      px(ctx, x + 6, y + 1 - fl, 2, 2, "#f97316");
      px(ctx, x + 11, y - fl, 2, 2, "#facc15");
      px(ctx, x + 16, y + 1 - fl, 2, 2, "#f97316");
    } else if (prop.kind === "bookshelf_wide") {
      // Full continuous 3-tile (72px) stocked Barnes & Noble bookshelf!
      px(ctx, x, y, 72, 26, "#5c2d0c"); px(ctx, x + 2, y + 2, 68, 22, "#78350f");
      const cols = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];
      for (let i = 0; i < 13; i++) {
        px(ctx, x + 4 + i * 5, y + 4, 4, 8, cols[i % cols.length]);
        px(ctx, x + 4 + i * 5, y + 14, 4, 8, cols[(i + 2) % cols.length]);
      }
    } else if (prop.kind === "cafe_set") {
      // Café Table WITH Wooden Chairs on Left & Right!
      px(ctx, x - 6, y + 7, 7, 10, "#5c2d0c"); px(ctx, x - 5, y + 8, 5, 8, "#92400e"); // Left chair
      px(ctx, x + 23, y + 7, 7, 10, "#5c2d0c"); px(ctx, x + 24, y + 8, 5, 8, "#92400e"); // Right chair
      px(ctx, x + 2, y + 4, 20, 16, "#78350f"); px(ctx, x + 4, y + 6, 16, 12, "#b45309");
      px(ctx, x + 8, y + 9, 4, 4, "#f8fafc"); px(ctx, x + 14, y + 11, 4, 4, "#fef3c7");
    } else if (prop.kind === "play_fence") {
      // Low colorful wooden enclosure for Barnes & Noble Kids' Play Corner
      px(ctx, x, y + 10, T, 5, "#f59e0b");
      px(ctx, x + 2, y + 7, 4, 11, "#ef4444");
      px(ctx, x + 10, y + 7, 4, 11, "#3b82f6");
      px(ctx, x + 18, y + 7, 4, 11, "#22c55e");
    } else if (prop.kind === "closed_door") {
      // High School Closed Classroom Door with Frosted Window & Room Plaque!
      px(ctx, x + 2, y - 4, 20, 26, "#451a03");
      px(ctx, x + 4, y - 2, 16, 22, "#92400e");
      px(ctx, x + 7, y + 1, 10, 7, "#bae6fd"); // frosted door glass
      px(ctx, x + 16, y + 11, 2, 3, "#facc15"); // brass handle
    } else if (prop.kind === "teacher_desk") {
      px(ctx, x + 2, y + 18, 44, 4, "rgba(0,0,0,0.24)");
      px(ctx, x, y + 2, 48, 18, "#5c2d0c"); px(ctx, x + 2, y + 4, 44, 14, "#92400e");
      px(ctx, x + 8, y + 7, 10, 7, "#f8fafc"); // lesson book
      px(ctx, x + 34, y + 6, 6, 6, "#ef4444"); // classic red apple!
    } else if (prop.kind === "vending_machine") {
      px(ctx, x + 2, y - 4, 20, 26, "#1e3a8a");
      px(ctx, x + 4, y - 2, 12, 14, "#bae6fd");
      px(ctx, x + 5, y, 4, 4, "#ef4444"); px(ctx, x + 10, y, 4, 4, "#22c55e");
      px(ctx, x + 5, y + 6, 4, 4, "#f59e0b"); px(ctx, x + 10, y + 6, 4, 4, "#a855f7");
      px(ctx, x + 5, y + 15, 14, 5, "#0f172a"); // dispenser slot
    } else if (prop.kind === "water_fountain") {
      px(ctx, x + 4, y + 2, 16, 16, "#94a3b8"); px(ctx, x + 6, y + 4, 12, 10, "#e2e8f0");
      px(ctx, x + 9, y + 7, 6, 4, "#38bdf8");
    } else if (prop.kind === "trophy_case") {
      px(ctx, x, y - 2, 48, 24, "#78350f"); px(ctx, x + 3, y, 42, 18, "#e0f2fe");
      px(ctx, x + 8, y + 6, 6, 10, "#f5c542"); px(ctx, x + 21, y + 4, 6, 12, "#facc15");
      px(ctx, x + 34, y + 7, 6, 9, "#cbd5e1");
    } else if (prop.kind === "service_counter") {
      // Sweet Tooth Wrap-Around Staff Service Counter + Cash Register + Candy Jars!
      const w = 96;
      px(ctx, x, y + 2, w, 22, "#be185d"); px(ctx, x + 2, y + 4, w - 4, 14, "#fdf2f8");
      // Cash Register
      px(ctx, x + 10, y - 2, 16, 11, "#334155"); px(ctx, x + 12, y, 12, 5, "#4ade80");
      // Colorful Glass Candy Jars
      px(ctx, x + 36, y - 1, 9, 10, "#f43f5e"); px(ctx, x + 37, y - 3, 7, 2, "#cbd5e1");
      px(ctx, x + 50, y - 1, 9, 10, "#38bdf8"); px(ctx, x + 51, y - 3, 7, 2, "#cbd5e1");
      px(ctx, x + 64, y - 1, 9, 10, "#a855f7"); px(ctx, x + 65, y - 3, 7, 2, "#cbd5e1");
      px(ctx, x + 78, y - 1, 9, 10, "#facc15"); px(ctx, x + 79, y - 3, 7, 2, "#cbd5e1");
    } else if (prop.kind === "dropped_cone") {
      // Melting Strawberry & Vanilla Ice Cream Cone Dropped in the Corner!
      ctx.fillStyle = "rgba(244, 114, 182, 0.55)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 15, 9, 5, 0, 0, Math.PI * 2); ctx.fill(); // melting puddle
      ctx.fillStyle = "#f472b6";
      ctx.beginPath(); ctx.arc(x + 10, y + 13, 4.5, 0, Math.PI * 2); ctx.fill(); // strawberry scoop
      ctx.fillStyle = "#fef3c7";
      ctx.beginPath(); ctx.arc(x + 13, y + 15, 3, 0, Math.PI * 2); ctx.fill(); // vanilla drip
      // Waffle cone tipped sideways
      ctx.fillStyle = "#d97706";
      ctx.beginPath(); ctx.moveTo(x + 12, y + 10); ctx.lineTo(x + 21, y + 6); ctx.lineTo(x + 17, y + 14); ctx.closePath(); ctx.fill();
    } else if (prop.kind === "gumball") {
      px(ctx, x + 8, y + 14, 8, 8, "#dc2626");
      ctx.fillStyle = "#bae6fd"; ctx.beginPath(); ctx.arc(x + 12, y + 8, 6, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 6, 2, 2, "#ef4444"); px(ctx, x + 13, y + 7, 2, 2, "#facc15"); px(ctx, x + 11, y + 10, 2, 2, "#22c55e");
    } else if (prop.kind === "exit_mat") {
      px(ctx, x, y + 4, 48, 16, "#991b1b"); px(ctx, x + 3, y + 7, 42, 10, "#f5c542");
      ctx.font = "bold 7px monospace"; ctx.fillStyle = "#111"; ctx.fillText("EXIT", x + 15, y + 14);
    }
  }

  
  // ---------------------------------------------------------
  // 2B. ORGANIC PERIMETER TILES: Distant City, Fence & Shimmering Water
  // ---------------------------------------------------------
  function drawDistantCityTile(ctx, x, y, sx, sy, purgatorio = false) {
    // Distant Colorado Springs skyline & suburban rooftops beyond the playable edge
    const sky = purgatorio ? "#17112b" : "#1e293b";
    px(ctx, sx, sy, T, T, sky);
    const seed = (x * 17 + y * 31) % 5;
    const bH = 10 + seed * 3;
    const bCol = purgatorio ? "#2d244d" : (seed % 2 === 0 ? "#334155" : "#475569");
    const winCol = purgatorio ? "#a78bfa" : "#fde047";
    px(ctx, sx + 2, sy + T - bH, T - 4, bH, bCol);
    px(ctx, sx + 1, sy + T - bH, T - 2, 2, purgatorio ? "#4c3b7a" : "#64748b");
    // Tiny glowing distant city windows
    px(ctx, sx + 5, sy + T - bH + 4, 3, 3, winCol);
    px(ctx, sx + 14, sy + T - bH + 4, 3, 3, seed % 3 === 0 ? "#38bdf8" : winCol);
    if (bH > 14) {
      px(ctx, sx + 5, sy + T - bH + 10, 3, 3, winCol);
      px(ctx, sx + 14, sy + T - bH + 10, 3, 3, winCol);
    }
  }

  function drawFenceTile(ctx, map, x, y, sx, sy, purgatorio = false) {
    // Grass under auto-oriented wooden neighborhood fence (vertical, horizontal & corners!)
    px(ctx, sx, sy, T, T, purgatorio ? "#1f3d34" : "#3a8540");
    const isF = (tx, ty) => (tx >= 0 && ty >= 0 && tx < map.w && ty < map.h && map.grid[ty][tx] === 9);
    const up = isF(x, y - 1), dn = isF(x, y + 1), lt = isF(x - 1, y), rt = isF(x + 1, y);
    const wood = "#92400e", woodHi = "#b45309", rail = "#78350f", shade = "#451a03";

    // Horizontal rails if connected left or right (or isolated)
    if (lt || rt || (!up && !dn)) {
      const rx = lt ? 0 : 8;
      const rw = (lt && rt) ? T : (lt ? 14 : (rt ? 16 : 16));
      px(ctx, sx + rx, sy + 9, rw, 3, rail);
      px(ctx, sx + rx, sy + 16, rw, 3, rail);
      if (lt && rt) {
        [2, 10, 18].forEach(ox => {
          px(ctx, sx + ox, sy + 5, 4, 16, wood);
          px(ctx, sx + ox + 1, sy + 4, 2, 2, woodHi);
        });
      }
    }
    // Vertical rails & posts if connected up or down!
    if (up || dn) {
      const ry = up ? 0 : 8;
      const rh = (up && dn) ? T : (up ? 14 : 16);
      px(ctx, sx + 9, sy + ry, 6, rh, rail);
      px(ctx, sx + 10, sy + ry, 4, rh, wood);
      px(ctx, sx + 11, sy + ry, 2, rh, woodHi);
    }
    // Sturdy center fence post at every tile / corner
    px(ctx, sx + 8, sy + 4, 8, 17, shade);
    px(ctx, sx + 9, sy + 5, 6, 15, wood);
    px(ctx, sx + 10, sy + 4, 4, 3, woodHi);
  }

  function drawWaterTile(ctx, x, y, sx, sy, time = 0, isDream = false) {
    if (isDream) {
      // Glowing Dream Realm Cherry Blossom Lake water!
      px(ctx, sx, sy, T, T, "#131036");
      const wave = Math.sin(time * 0.003 + x * 0.7 + y * 0.5);
      if ((x * 7 + y * 11) % 5 === 0) {
        px(ctx, sx + 6, sy + 8 + Math.round(wave * 2), 8, 2, "rgba(167, 139, 250, 0.45)");
      }
      if ((x * 13 + y * 19) % 7 === 0) {
        const star = wave > 0 ? "#fde047" : "#38bdf8";
        px(ctx, sx + 11, sy + 11, 2, 2, star);
      }
      return;
    }
    // Natural Colorado Springs creek/pond water
    px(ctx, sx, sy, T, T, "#0284c7");
    const shift = Math.round(Math.sin(time * 0.004 + x + y) * 2);
    px(ctx, sx + 4 + shift, sy + 7, 8, 2, "#38bdf8");
    px(ctx, sx + 10 - shift, sy + 16, 7, 2, "#7dd3fc");
  }

  // Ethereal Dream Realm Floating Backdrop (Eclipse, Floating Islands, Petals & Stars)
  function drawDreamBackdrop(ctx, time = 0) {
    // Upper eclipse sky glow
    const grad = ctx.createLinearGradient(0, 0, 0, 120);
    grad.addColorStop(0, "rgba(76, 29, 149, 0.45)");
    grad.addColorStop(1, "rgba(19, 16, 54, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 384, 120);

    // Rising Sun & Moon Eclipse reflected in the top-center sky
    ctx.save();
    ctx.fillStyle = "rgba(250, 204, 21, 0.35)";
    ctx.beginPath(); ctx.arc(192, 34, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fde047";
    ctx.beginPath(); ctx.arc(192, 34, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#131036";
    ctx.beginPath(); ctx.arc(195, 34, 14, 0, Math.PI * 2); ctx.fill();

    // Floating Ethereal Dream Islands in the background
    [[54, 48, 28], [326, 56, 24], [46, 215, 22], [336, 210, 26]].forEach(([ix, iy, iw], idx) => {
      const fy = iy + Math.sin(time * 0.002 + idx * 1.6) * 4;
      px(ctx, ix - iw / 2, fy, iw, 6, "#4c1d95");
      px(ctx, ix - iw / 2 + 2, fy - 2, iw - 4, 4, "#f472b6");
      px(ctx, ix - iw / 4, fy + 6, iw / 2, 5, "#312e81");
    });

    // Drifting Cherry Blossom Petals across the whole Dream Realm
    for (let i = 0; i < 16; i++) {
      const px0 = ((i * 61 + time * 0.018) % 384);
      const py0 = ((i * 43 + time * 0.012 + Math.sin(time * 0.003 + i) * 14) % 288);
      px(ctx, px0, py0, 3, 2, i % 2 === 0 ? "#fbcfe8" : "#f472b6");
    }
    ctx.restore();
  }

  return { T, drawRoadTile, drawSidewalkTile, drawDistantCityTile, drawFenceTile, drawWaterTile, drawDreamBackdrop, drawInteriorFloorTile, drawInteriorWallTile, drawTree, drawSignpost, drawBuilding, drawPortal, drawProp };
})();
