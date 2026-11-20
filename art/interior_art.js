// =========================================================
// art/interior_art.js — v11 Sleek Modern Urban-Fantasy Interiors:
//   • Dynamic Multi-Room Auto-Tiled Walls (Windows ONLY on Outer Walls!)
//   • Centered 96px Church Altar Table (Symmetrical on 4-Tile Carpet!)
//   • Clean Furniture & Props w/ Symmetrical Legs & Soft Shadows
// =========================================================
window.WorldArt = window.WorldArt || {};
(() => {
  const T = 24;

  function px(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function drawInteriorFloorTile(ctx, floorType, tileId, x, y, sx, sy, time = 0, purgatorio = false) {
    if (tileId === 7) {
      if (floorType === "wood" || floorType === "bookstore") {
        const c1 = purgatorio ? "#2b2547" : "#e7dec8";
        const c2 = purgatorio ? "#221d3b" : "#d8ccb2";
        px(ctx, sx, sy, T, T, (x + y) % 2 === 0 ? c1 : c2);
        px(ctx, sx, sy + T - 1, T, 1, purgatorio ? "#171329" : "#bfb296");
        px(ctx, sx + T - 1, sy, 1, T, purgatorio ? "#171329" : "#bfb296");
        return true;
      }
      if (floorType === "tile") {
        px(ctx, sx, sy, T, T, purgatorio ? "#1c2541" : "#dbeafe");
        px(ctx, sx + 1, sy + 1, T - 1, T - 1, purgatorio ? "#232e52" : "#eff6ff");
        return true;
      }
    }

    if (floorType === "wood" || floorType === "bookstore") {
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
      const c1 = purgatorio ? "#26233d" : "#526075";
      const c2 = purgatorio ? "#211e36" : "#4b586d";
      px(ctx, sx, sy, T, T, (x + y) % 2 === 0 ? c1 : c2);
      px(ctx, sx, sy + T - 1, T, 1, purgatorio ? "#161426" : "#374254");
      if (!purgatorio && (y === 5 || y === 7 || y === 9)) {
        if (x === 3 || x === 12) px(ctx, sx + 3, sy + 3, 18, 18, "rgba(56, 189, 248, 0.14)");
        if (x === 4 || x === 11) px(ctx, sx + 3, sy + 3, 18, 18, "rgba(250, 204, 21, 0.11)");
      }
      return true;
    }

    if (floorType === "tile") {
      px(ctx, sx, sy, T, T, purgatorio ? "#242742" : "#e2e8f0");
      px(ctx, sx + 1, sy + 1, T - 1, T - 1, purgatorio ? "#2c3052" : "#f1f5f9");
      return true;
    }

    if (floorType === "candy") {
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
    const isOuterNorth = !flUp && flDn && y <= 2; // Windows ONLY on true outer north walls!

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

    // Interior thin divider (tile === 6)
    if (tileId === 6) {
      drawInteriorFloorTile(ctx, ft, 0, x, y, sx, sy, 0, purgatorio);
      if (flDn && !flUp) {
        px(ctx, sx, sy + 2, T, 20, cap);
        px(ctx, sx, sy + 3, T, 3, trimHi);
        px(ctx, sx, sy + 6, T, 9, wallTop);
        px(ctx, sx, sy + 15, T, 5, wallBot);
      } else if (flUp && flDn) {
        px(ctx, sx, sy + 4, T, 16, cap);
        px(ctx, sx, sy + 5, T, 3, trimHi);
        px(ctx, sx, sy + 8, T, 6, wallTop);
        px(ctx, sx, sy + 14, T, 5, wallBot);
      } else {
        px(ctx, sx + 8, sy, 8, T, cap);
        px(ctx, sx + 9, sy, 6, T, trimMid);
        px(ctx, sx + 10, sy, 4, T, trimHi);
      }
      return;
    }

    // Perimeter Wall (tile === 1):
    if (flDn) {
      px(ctx, sx, sy, T, 14, wallTop);
      px(ctx, sx, sy + 14, T, 2, trimHi);
      px(ctx, sx, sy + 16, T, 7, wallBot);
      px(ctx, sx, sy + 23, T, 1, cap);
      // Windows & art ONLY on outer north walls — never floating on interior partitions!
      if (isOuterNorth) {
        if (ft === "stone" && (x === 6 || x === 9)) {
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
      }
      return;
    }

    if (flDn2) {
      px(ctx, sx, sy, T, 10, cap);
      px(ctx, sx, sy + 10, T, 4, trimHi);
      px(ctx, sx, sy + 14, T, 2, trimMid);
      px(ctx, sx, sy + 16, T, 8, wallTop);
      return;
    }

    px(ctx, sx, sy, T, T, cap);
    if (flUp) { px(ctx, sx, sy, T, 4, trimHi); px(ctx, sx, sy + 4, T, 3, trimMid); }
    if (flRt) { px(ctx, sx + T - 6, sy, 4, T, trimMid); px(ctx, sx + T - 2, sy, 2, T, trimHi); }
    if (flLt) { px(ctx, sx, sy, 2, T, trimHi); px(ctx, sx + 2, sy, 4, T, trimMid); }
  }

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
      // DEAD-CENTERED 96px (4-Tile) Church Altar Table spanning x=6..9 seamlessly!
      px(ctx, x + 2, y + 22, 92, 4, "rgba(0,0,0,0.28)");
      px(ctx, x, y + 2, 96, 22, "#94a3b8");
      px(ctx, x + 3, y + 4, 90, 16, "#f8fafc"); // crisp white altar cloth
      px(ctx, x + 42, y + 4, 12, 18, "#991b1b"); // centered crimson runner
      px(ctx, x + 46, y - 8, 4, 18, "#f5c542"); // centered golden cross vertical
      px(ctx, x + 41, y - 4, 14, 4, "#f5c542"); // centered golden cross horizontal
      // Symmetrical left & right altar candles
      px(ctx, x + 14, y + 1, 4, 9, "#fef08a"); px(ctx, x + 15, y - 1, 2, 2, "#f97316");
      px(ctx, x + 78, y + 1, 4, 9, "#fef08a"); px(ctx, x + 79, y - 1, 2, 2, "#f97316");
    } else if (prop.kind === "pew") {
      px(ctx, x + 2, y + 14, 68, 4, "rgba(0,0,0,0.28)");
      px(ctx, x, y + 1, 72, 13, "#451a03");
      px(ctx, x + 2, y + 2, 68, 5, "#8c4a1c");
      px(ctx, x + 2, y + 8, 68, 4, "#78350f");
      px(ctx, x + 3, y + 12, 4, 4, "#451a03");
      px(ctx, x + 65, y + 12, 4, 4, "#451a03");
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
    } else if (prop.kind === "bookshelf_wide") {
      px(ctx, x, y, 72, 26, "#5c2d0c"); px(ctx, x + 2, y + 2, 68, 22, "#78350f");
      const cols = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7", "#ec4899"];
      for (let i = 0; i < 13; i++) {
        px(ctx, x + 4 + i * 5, y + 4, 4, 8, cols[i % cols.length]);
        px(ctx, x + 4 + i * 5, y + 14, 4, 8, cols[(i + 2) % cols.length]);
      }
    } else if (prop.kind === "coffee_counter") {
      const w = 72;
      px(ctx, x, y, w, 26, "#451a03"); px(ctx, x + 2, y + 2, w - 4, 15, "#d6b892");
      px(ctx, x + 6, y - 4, 18, 14, "#334155"); px(ctx, x + 8, y - 2, 14, 6, "#94a3b8");
      px(ctx, x + 12, y + 6, 6, 4, "#f8fafc");
      px(ctx, x + 32, y - 2, 32, 14, "#bae6fd");
      px(ctx, x + 35, y + 3, 7, 5, "#d97706"); px(ctx, x + 46, y + 3, 7, 5, "#92400e"); px(ctx, x + 55, y + 3, 6, 5, "#f472b6");
    } else if (prop.kind === "cafe_set") {
      px(ctx, x - 6, y + 7, 7, 10, "#5c2d0c"); px(ctx, x - 5, y + 8, 5, 8, "#92400e");
      px(ctx, x + 23, y + 7, 7, 10, "#5c2d0c"); px(ctx, x + 24, y + 8, 5, 8, "#92400e");
      px(ctx, x + 2, y + 4, 20, 16, "#78350f"); px(ctx, x + 4, y + 6, 16, 12, "#b45309");
      px(ctx, x + 8, y + 9, 4, 4, "#f8fafc"); px(ctx, x + 14, y + 11, 4, 4, "#fef3c7");
    } else if (prop.kind === "reception_desk") {
      const w = 72;
      px(ctx, x, y, w, 24, "#0f766e"); px(ctx, x + 2, y + 2, w - 4, 14, "#f1f5f9");
      px(ctx, x + 10, y - 3, 18, 12, "#1e293b"); px(ctx, x + 12, y - 1, 14, 8, "#38bdf8");
      px(ctx, x + 42, y + 4, 14, 9, "#fef3c7"); px(ctx, x + 31, y + 18, 10, 4, "#ef4444");
    } else if (prop.kind === "waiting_chair") {
      px(ctx, x + 3, y + 18, 18, 3, "rgba(0,0,0,0.2)");
      px(ctx, x + 2, y + 4, 20, 15, "#0369a1"); px(ctx, x + 4, y + 6, 16, 10, "#38bdf8");
    } else if (prop.kind === "hospital_bed") {
      px(ctx, x, y, 40, 48, "#94a3b8"); px(ctx, x + 3, y + 4, 34, 40, "#ffffff");
      px(ctx, x + 6, y + 7, 28, 9, "#e0f2fe"); px(ctx, x + 3, y + 22, 34, 22, "#0ea5e9");
    } else if (prop.kind === "med_machine") {
      px(ctx, x + 2, y, 20, 24, "#475569"); px(ctx, x + 4, y + 2, 16, 11, "#052e16");
      const beat = Math.floor(time / 220) % 4;
      px(ctx, x + 6 + beat * 3, y + 6, 3, 3, "#4ade80");
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
      const bob = Math.sin(time * 0.006 + x) * 2.5;
      ctx.fillStyle = "rgba(168, 85, 247, 0.3)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 20, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 4 + bob, 6, 12, "#a855f7");
      px(ctx, x + 10, y + 2 + bob, 4, 16, "#d8b4fe");
      px(ctx, x + 11, y + 6 + bob, 2, 6, "#ffffff");
    } else if (prop.kind === "poison_trace") {
      const glow = 0.55 + Math.sin(time * 0.007 + x) * 0.35;
      ctx.fillStyle = `rgba(16, 185, 129, ${glow})`;
      ctx.beginPath(); ctx.ellipse(x + 12, y + 12, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 7, y + 10, 10, 4, "#111827"); px(ctx, x + 10, y + 8, 4, 2, "#a855f7");
    } else if (prop.kind === "play_mat") {
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
      px(ctx, x + 8, y + 6, 14, 10, "#cbd5e1"); px(ctx, x + 11, y + 8, 8, 6, "#09090b");
      px(ctx, x + 50, y + 6, 14, 10, "#cbd5e1"); px(ctx, x + 53, y + 8, 8, 6, "#09090b");
      px(ctx, x + 28, y + 8, 16, 6, glow);
    } else if (prop.kind === "disco_ball") {
      const cols = ["rgba(236,72,153,0.16)", "rgba(34,211,238,0.16)", "rgba(168,85,247,0.16)"];
      ctx.fillStyle = cols[Math.floor(time / 300) % 3];
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
      px(ctx, x + 3, y + 19, 18, 3, "rgba(0,0,0,0.22)");
      px(ctx, x + 4, y + 15, 2, 5, "#475569"); px(ctx, x + 18, y + 15, 2, 5, "#475569");
      px(ctx, x + 2, y + 4, 20, 12, "#78350f"); px(ctx, x + 3, y + 5, 18, 10, "#d97706");
      px(ctx, x + 6, y + 7, 7, 6, "#f8fafc"); px(ctx, x + 7, y + 9, 5, 1, "#94a3b8");
      px(ctx, x + 15, y + 8, 3, 1, "#eab308");
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
      const glow = 0.22 + Math.sin(time * 0.005 + x) * 0.05;
      ctx.fillStyle = `rgba(254, 240, 138, ${glow})`;
      ctx.beginPath(); ctx.arc(x + 12, y + 8, 16, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 18, 6, 3, "#78350f"); px(ctx, x + 11, y + 9, 2, 10, "#92400e");
      px(ctx, x + 6, y + 2, 12, 8, "#fef08a"); px(ctx, x + 7, y + 3, 10, 6, "#fde047");
    } else if (prop.kind === "closet_rack") {
      px(ctx, x, y, 48, 24, "#5c2d0c"); px(ctx, x + 2, y + 2, 44, 20, "#78350f");
      px(ctx, x + 4, y + 4, 40, 2, "#cbd5e1");
      ["#2563eb", "#7c3aed", "#ef4444", "#16a34a", "#f59e0b"].forEach((c, i) => px(ctx, x + 5 + i * 8, y + 6, 6, 13, c));
    } else if (prop.kind === "candelabra") {
      const glow = 0.25 + Math.sin(time * 0.008 + y) * 0.07;
      ctx.fillStyle = `rgba(250, 204, 21, ${glow})`;
      ctx.beginPath(); ctx.arc(x + 12, y + 5, 13, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 18, 6, 3, "#b45309"); px(ctx, x + 11, y + 7, 2, 12, "#f5c542");
      px(ctx, x + 6, y + 6, 12, 2, "#f5c542");
      px(ctx, x + 6, y + 3, 2, 4, "#fef3c7"); px(ctx, x + 11, y + 2, 2, 5, "#fef3c7"); px(ctx, x + 16, y + 3, 2, 4, "#fef3c7");
      const fl = Math.floor(time / 200) % 2;
      px(ctx, x + 6, y + 1 - fl, 2, 2, "#f97316"); px(ctx, x + 11, y - fl, 2, 2, "#facc15"); px(ctx, x + 16, y + 1 - fl, 2, 2, "#f97316");
    } else if (prop.kind === "play_fence") {
      px(ctx, x, y + 10, T, 5, "#f59e0b");
      px(ctx, x + 2, y + 7, 4, 11, "#ef4444"); px(ctx, x + 10, y + 7, 4, 11, "#3b82f6"); px(ctx, x + 18, y + 7, 4, 11, "#22c55e");
    } else if (prop.kind === "closed_door") {
      px(ctx, x + 2, y - 4, 20, 26, "#451a03"); px(ctx, x + 4, y - 2, 16, 22, "#92400e");
      px(ctx, x + 7, y + 1, 10, 7, "#bae6fd"); px(ctx, x + 16, y + 11, 2, 3, "#facc15");
    } else if (prop.kind === "teacher_desk") {
      px(ctx, x + 2, y + 18, 44, 4, "rgba(0,0,0,0.24)");
      px(ctx, x, y + 2, 48, 18, "#5c2d0c"); px(ctx, x + 2, y + 4, 44, 14, "#92400e");
      px(ctx, x + 8, y + 7, 10, 7, "#f8fafc"); px(ctx, x + 34, y + 6, 6, 6, "#ef4444");
    } else if (prop.kind === "vending_machine") {
      px(ctx, x + 2, y - 4, 20, 26, "#1e3a8a"); px(ctx, x + 4, y - 2, 12, 14, "#bae6fd");
      px(ctx, x + 5, y, 4, 4, "#ef4444"); px(ctx, x + 10, y, 4, 4, "#22c55e");
      px(ctx, x + 5, y + 6, 4, 4, "#f59e0b"); px(ctx, x + 10, y + 6, 4, 4, "#a855f7");
      px(ctx, x + 5, y + 15, 14, 5, "#0f172a");
    } else if (prop.kind === "water_fountain") {
      px(ctx, x + 4, y + 2, 16, 16, "#94a3b8"); px(ctx, x + 6, y + 4, 12, 10, "#e2e8f0");
      px(ctx, x + 9, y + 7, 6, 4, "#38bdf8");
    } else if (prop.kind === "trophy_case") {
      px(ctx, x, y - 2, 48, 24, "#78350f"); px(ctx, x + 3, y, 42, 18, "#e0f2fe");
      px(ctx, x + 8, y + 6, 6, 10, "#f5c542"); px(ctx, x + 21, y + 4, 6, 12, "#facc15"); px(ctx, x + 34, y + 7, 6, 9, "#cbd5e1");
    } else if (prop.kind === "service_counter") {
      const w = 96;
      px(ctx, x, y + 2, w, 22, "#be185d"); px(ctx, x + 2, y + 4, w - 4, 14, "#fdf2f8");
      px(ctx, x + 10, y - 2, 16, 11, "#334155"); px(ctx, x + 12, y, 12, 5, "#4ade80");
      px(ctx, x + 36, y - 1, 9, 10, "#f43f5e"); px(ctx, x + 50, y - 1, 9, 10, "#38bdf8");
      px(ctx, x + 64, y - 1, 9, 10, "#a855f7"); px(ctx, x + 78, y - 1, 9, 10, "#facc15");
    } else if (prop.kind === "dropped_cone") {
      ctx.fillStyle = "rgba(244, 114, 182, 0.55)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 15, 9, 5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#f472b6"; ctx.beginPath(); ctx.arc(x + 10, y + 13, 4.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fef3c7"; ctx.beginPath(); ctx.arc(x + 13, y + 15, 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#d97706"; ctx.beginPath(); ctx.moveTo(x + 12, y + 10); ctx.lineTo(x + 21, y + 6); ctx.lineTo(x + 17, y + 14); ctx.closePath(); ctx.fill();
    } else if (prop.kind === "gumball") {
      px(ctx, x + 8, y + 14, 8, 8, "#dc2626");
      ctx.fillStyle = "#bae6fd"; ctx.beginPath(); ctx.arc(x + 12, y + 8, 6, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 6, 2, 2, "#ef4444"); px(ctx, x + 13, y + 7, 2, 2, "#facc15"); px(ctx, x + 11, y + 10, 2, 2, "#22c55e");
    } else if (prop.kind === "exit_mat") {
      px(ctx, x, y + 4, 48, 16, "#991b1b"); px(ctx, x + 3, y + 7, 42, 10, "#f5c542");
      ctx.font = "bold 7px monospace"; ctx.fillStyle = "#111"; ctx.fillText("EXIT", x + 15, y + 14);
    }
  }

  Object.assign(window.WorldArt, { drawInteriorFloorTile, drawInteriorWallTile, drawProp });
})();
