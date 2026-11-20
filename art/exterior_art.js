// =========================================================
// art/exterior_art.js — v11 Refreshed Outdoor Aesthetics:
//   • Lush Textured Grass w/ Wildflowers & Tufts
//   • Natural Cobblestone/Flagstone Pathways w/ Encroaching Grass Edges
//   • Refreshed Crisp Buildings, Auto-Fences, Trees, Water & Portals
// =========================================================
window.WorldArt = window.WorldArt || {};
(() => {
  const T = 24;
  window.WorldArt.T = T;

  function px(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // ---------------------------------------------------------
  // 1. LUSH REFRESHED GRASS TILE (Depth, Tufts & Wildflowers!)
  // ---------------------------------------------------------
  function drawGrassTile(ctx, x, y, sx, sy, purgatorio = false) {
    const c1 = purgatorio ? "#213f36" : "#44964c";
    const c2 = purgatorio ? "#1d3830" : "#3f8e47";
    const blade = purgatorio ? "#2f5e50" : "#58b35f";
    const shade = purgatorio ? "#162b25" : "#33783a";

    px(ctx, sx, sy, T, T, (x + y) % 2 === 0 ? c1 : c2);

    const h = (x * 37 + y * 17) % 19;
    // Soft dappled turf tufts
    if (h % 3 === 0) {
      px(ctx, sx + 4 + (h % 7), sy + 6, 2, 3, blade);
      px(ctx, sx + 7 + (h % 7), sy + 7, 2, 2, blade);
      px(ctx, sx + 5 + (h % 7), sy + 9, 3, 1, shade);
    }
    if (h % 4 === 1) {
      px(ctx, sx + 14, sy + 15, 2, 3, blade);
      px(ctx, sx + 17, sy + 16, 2, 2, blade);
    }
    // Occasional tiny Colorado wildflowers (violet wisps in Purgatorio)
    if (h === 2 || h === 11) {
      const fCol = purgatorio ? "#c084fc" : (h === 2 ? "#fef08a" : "#fbcfe8");
      px(ctx, sx + 9, sy + 12, 2, 2, fCol);
      px(ctx, sx + 10, sy + 14, 1, 2, shade);
    }
  }

  // ---------------------------------------------------------
  // 2. NATURAL WALKING PATHWAY (Tile === 3) w/ ENCROACHING GRASS!
  //    Replaces old asphalt road with warm flagstone & packed earth
  //    with organic grass blades creeping onto every edge cell!
  // ---------------------------------------------------------
  function drawRoadTile(ctx, map, x, y, sx, sy, purgatorio = false) {
    const isPath = (tx, ty) => {
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return false;
      const v = map.grid[ty][tx];
      return v === 3 || v === 4 || v === 5;
    };

    const up = isPath(x, y - 1), dn = isPath(x, y + 1);
    const lt = isPath(x - 1, y), rt = isPath(x + 1, y);

    // Warm packed-earth & cobblestone path base (shifts to moonlit slate in Purgatorio)
    const dirt   = purgatorio ? "#332c4d" : "#c7b28f";
    const dirtLo = purgatorio ? "#27213d" : "#b39b74";
    const stone  = purgatorio ? "#48406b" : "#ded0b6";
    const stoneHi= purgatorio ? "#5c5287" : "#efe5d1";

    px(ctx, sx, sy, T, T, dirt);

    // Embedded natural flagstones for sleek texture
    const seed = (x * 13 + y * 29) % 5;
    px(ctx, sx + 3 + seed, sy + 4, 8, 6, stone);
    px(ctx, sx + 4 + seed, sy + 4, 6, 2, stoneHi);
    px(ctx, sx + 12 - seed, sy + 14, 9, 6, stone);
    px(ctx, sx + 13 - seed, sy + 14, 7, 2, stoneHi);
    if ((x + y) % 2 === 0) {
      px(ctx, sx + 16, sy + 5, 4, 3, dirtLo);
      px(ctx, sx + 4, sy + 17, 4, 3, dirtLo);
    }

    // ENCROACHING GRASS EDGES — Organic grass creeping slightly over pathway borders!
    const gBase  = purgatorio ? "#1f3d34" : "#44964c";
    const gTuft  = purgatorio ? "#2f5e50" : "#58b35f";
    const gShade = purgatorio ? "#142923" : "#2f6e36";

    if (!up) {
      px(ctx, sx, sy, T, 3, gBase);
      px(ctx, sx + 2, sy + 3, 5, 2, gBase);
      px(ctx, sx + 11, sy + 3, 6, 3, gBase);
      px(ctx, sx + 19, sy + 3, 4, 2, gBase);
      px(ctx, sx + 4, sy + 2, 2, 2, gTuft);
      px(ctx, sx + 14, sy + 3, 2, 2, gTuft);
      px(ctx, sx + 11, sy + 6, 5, 1, "rgba(0,0,0,0.14)");
    }
    if (!dn) {
      px(ctx, sx, sy + T - 3, T, 3, gBase);
      px(ctx, sx + 3, sy + T - 5, 6, 2, gBase);
      px(ctx, sx + 14, sy + T - 6, 5, 3, gBase);
      px(ctx, sx + 5, sy + T - 4, 2, 2, gTuft);
      px(ctx, sx + 16, sy + T - 5, 2, 2, gTuft);
      px(ctx, sx, sy + T - 1, T, 1, gShade);
    }
    if (!lt) {
      px(ctx, sx, sy, 3, T, gBase);
      px(ctx, sx + 3, sy + 4, 2, 5, gBase);
      px(ctx, sx + 3, sy + 14, 3, 6, gBase);
      px(ctx, sx + 2, sy + 6, 2, 2, gTuft);
      px(ctx, sx + 3, sy + 16, 2, 2, gTuft);
    }
    if (!rt) {
      px(ctx, sx + T - 3, sy, 3, T, gBase);
      px(ctx, sx + T - 5, sy + 3, 2, 6, gBase);
      px(ctx, sx + T - 6, sy + 13, 3, 6, gBase);
      px(ctx, sx + T - 4, sy + 5, 2, 2, gTuft);
      px(ctx, sx + T - 5, sy + 15, 2, 2, gTuft);
    }
  }

  // ---------------------------------------------------------
  // 3. STEPPING-STONE FRONT WALKWAY (Tile === 5) w/ Grass Fringe
  // ---------------------------------------------------------
  function drawSidewalkTile(ctx, sx, sy, purgatorio = false) {
    // Lush grass underneath stepping stones
    px(ctx, sx, sy, T, T, purgatorio ? "#1f3d34" : "#44964c");
    const stone = purgatorio ? "#524b73" : "#d8ccb2";
    const hi    = purgatorio ? "#6a6194" : "#f1e8d6";
    const edge  = purgatorio ? "#2e2945" : "#9c8b6e";
    // Two sleek broad garden flagstones leading to the front door
    px(ctx, sx + 3, sy + 2, 18, 9, edge);
    px(ctx, sx + 4, sy + 2, 16, 7, stone);
    px(ctx, sx + 5, sy + 3, 14, 2, hi);

    px(ctx, sx + 3, sy + 13, 18, 9, edge);
    px(ctx, sx + 4, sy + 13, 16, 7, stone);
    px(ctx, sx + 5, sy + 14, 14, 2, hi);
  }

  // ---------------------------------------------------------
  // 4. AUTO-ORIENTED WOODEN FENCES & SHIMMERING WATER
  // ---------------------------------------------------------
  function drawFenceTile(ctx, map, x, y, sx, sy, purgatorio = false) {
    drawGrassTile(ctx, x, y, sx, sy, purgatorio);
    const isF = (tx, ty) => (tx >= 0 && ty >= 0 && tx < map.w && ty < map.h && map.grid[ty][tx] === 9);
    const up = isF(x, y - 1), dn = isF(x, y + 1), lt = isF(x - 1, y), rt = isF(x + 1, y);
    const wood = "#92400e", woodHi = "#b45309", rail = "#78350f", shade = "#451a03";

    if (lt || rt || (!up && !dn)) {
      const rx = lt ? 0 : 8;
      const rw = (lt && rt) ? T : (lt ? 14 : 16);
      px(ctx, sx + rx, sy + 9, rw, 3, rail);
      px(ctx, sx + rx, sy + 16, rw, 3, rail);
      if (lt && rt) {
        [2, 10, 18].forEach(ox => {
          px(ctx, sx + ox, sy + 5, 4, 16, wood);
          px(ctx, sx + ox + 1, sy + 4, 2, 2, woodHi);
        });
      }
    }
    if (up || dn) {
      const ry = up ? 0 : 8;
      const rh = (up && dn) ? T : (up ? 14 : 16);
      px(ctx, sx + 9, sy + ry, 6, rh, rail);
      px(ctx, sx + 10, sy + ry, 4, rh, wood);
      px(ctx, sx + 11, sy + ry, 2, rh, woodHi);
    }
    px(ctx, sx + 8, sy + 4, 8, 17, shade);
    px(ctx, sx + 9, sy + 5, 6, 15, wood);
    px(ctx, sx + 10, sy + 4, 4, 3, woodHi);
  }

  function drawWaterTile(ctx, x, y, sx, sy, time = 0, isDream = false) {
    if (isDream) {
      px(ctx, sx, sy, T, T, "#131036");
      const wave = Math.sin(time * 0.003 + x * 0.7 + y * 0.5);
      if ((x * 7 + y * 11) % 5 === 0) px(ctx, sx + 6, sy + 8 + Math.round(wave * 2), 8, 2, "rgba(167, 139, 250, 0.45)");
      if ((x * 13 + y * 19) % 7 === 0) px(ctx, sx + 11, sy + 11, 2, 2, wave > 0 ? "#fde047" : "#38bdf8");
      return;
    }
    px(ctx, sx, sy, T, T, "#0284c7");
    const shift = Math.round(Math.sin(time * 0.004 + x + y) * 2);
    px(ctx, sx + 4 + shift, sy + 7, 8, 2, "#38bdf8");
    px(ctx, sx + 10 - shift, sy + 16, 7, 2, "#7dd3fc");
  }

  function drawDreamBackdrop(ctx, time = 0) {
    const grad = ctx.createLinearGradient(0, 0, 0, 120);
    grad.addColorStop(0, "rgba(76, 29, 149, 0.45)");
    grad.addColorStop(1, "rgba(19, 16, 54, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 384, 120);

    ctx.save();
    ctx.fillStyle = "rgba(250, 204, 21, 0.35)";
    ctx.beginPath(); ctx.arc(192, 34, 22, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#fde047";
    ctx.beginPath(); ctx.arc(192, 34, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#131036";
    ctx.beginPath(); ctx.arc(195, 34, 14, 0, Math.PI * 2); ctx.fill();

    [[54, 48, 28], [326, 56, 24], [46, 215, 22], [336, 210, 26]].forEach(([ix, iy, iw], idx) => {
      const fy = iy + Math.sin(time * 0.002 + idx * 1.6) * 4;
      px(ctx, ix - iw / 2, fy, iw, 6, "#4c1d95");
      px(ctx, ix - iw / 2 + 2, fy - 2, iw - 4, 4, "#f472b6");
      px(ctx, ix - iw / 4, fy + 6, iw / 2, 5, "#312e81");
    });

    for (let i = 0; i < 16; i++) {
      const px0 = ((i * 61 + time * 0.018) % 384);
      const py0 = ((i * 43 + time * 0.012 + Math.sin(time * 0.003 + i) * 14) % 288);
      px(ctx, px0, py0, 3, 2, i % 2 === 0 ? "#fbcfe8" : "#f472b6");
    }
    ctx.restore();
  }

  // ---------------------------------------------------------
  // 5. TREES, SIGNPOSTS, REFRESHED BUILDINGS & PORTALS
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
    // Soft ground contact shadow
    px(ctx, x + 3, y + h - 3, w - 2, 7, "rgba(0,0,0,0.28)");

    if (b.style === "house") {
      px(ctx, x - 3, y + 6, w + 6, 22, purgatorio ? "#3b1d5e" : "#8c2f14");
      px(ctx, x + 2, y, w - 4, 12, purgatorio ? "#4c257a" : "#b8431a");
      for (let rx = x; rx < x + w; rx += 8) {
        px(ctx, rx, y + 14, 6, 2, purgatorio ? "#291242" : "#6b220d");
        px(ctx, rx + 4, y + 20, 6, 2, purgatorio ? "#291242" : "#6b220d");
      }
      px(ctx, x + w - 18, y - 6, 10, 18, "#7f1d1d"); px(ctx, x + w - 19, y - 8, 12, 3, "#991b1b");
      px(ctx, x, y + 28, w, h - 28, purgatorio ? "#c7c0d8" : "#f8fafc");
      px(ctx, x, y + 28, w, 3, "rgba(0,0,0,0.16)"); // eave shadow
      px(ctx, x, y + h - 8, w, 8, "#94a3b8");
      [x + 10, x + w - 26].forEach(wx => {
        px(ctx, wx - 3, y + 36, 22, 16, "#334155");
        px(ctx, wx, y + 38, 16, 12, purgatorio ? "#a78bfa" : "#fde68a");
        px(ctx, wx + 7, y + 38, 2, 12, "#475569"); px(ctx, wx, y + 43, 16, 2, "#475569");
      });
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 26, 20, 26, "#451a03"); px(ctx, dx + 5, y + h - 23, 14, 21, "#92400e");
      px(ctx, dx + 15, y + h - 13, 3, 3, "#facc15");
      px(ctx, dx - 2, y + h - 2, 28, 4, "#cbd5e1"); // porch step
      px(ctx, x + 6, y + h - 6, 20, 5, "#15803d"); px(ctx, x + 10, y + h - 7, 3, 3, "#f472b6");
      px(ctx, x + 18, y + h - 7, 3, 3, "#facc15");
    } else if (b.style === "church") {
      const mid = x + Math.floor(w / 2);
      px(ctx, mid - 12, y - 22, 24, 28, "#64748b"); px(ctx, mid - 14, y - 24, 28, 6, "#334155");
      px(ctx, mid - 2, y - 38, 4, 16, "#f5c542"); px(ctx, mid - 7, y - 34, 14, 4, "#f5c542");
      px(ctx, x - 2, y + 6, w + 4, 22, "#334155"); px(ctx, x + 6, y - 2, w - 12, 12, "#475569");
      px(ctx, x, y + 28, w, h - 28, purgatorio ? "#9ca3af" : "#e2e8f0");
      px(ctx, x, y + 28, w, 4, "#94a3b8");
      [x + 12, x + w - 28].forEach(wx => {
        px(ctx, wx, y + 36, 16, 20, "#1e293b");
        px(ctx, wx + 2, y + 38, 6, 8, "#38bdf8"); px(ctx, wx + 8, y + 38, 6, 8, "#f43f5e");
        px(ctx, wx + 2, y + 46, 6, 8, "#facc15"); px(ctx, wx + 8, y + 46, 6, 8, "#a855f7");
      });
      const dx = b.doorTx * T;
      px(ctx, dx, y + h - 26, 24, 26, "#451a03");
      px(ctx, dx + 2, y + h - 24, 9, 24, "#78350f"); px(ctx, dx + 13, y + h - 24, 9, 24, "#78350f");
      px(ctx, dx - 4, y + h - 1, 32, 4, "#cbd5e1");
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
      px(ctx, x, y + 4, w, 16, "#7f1d1d");
      px(ctx, x, y + 20, w, h - 20, purgatorio ? "#4c2c44" : "#b91c1c");
      for (let by = y + 24; by < y + h - 4; by += 7) px(ctx, x + 2, by, w - 4, 1, "#991b1b");
      const mid = x + Math.floor(w / 2);
      px(ctx, mid - 14, y - 16, 28, 22, "#991b1b");
      px(ctx, mid - 16, y - 18, 32, 4, "#450a0a");
      px(ctx, mid - 7, y - 12, 14, 14, "#fef3c7");
      px(ctx, mid - 1, y - 9, 2, 5, "#111"); px(ctx, mid - 1, y - 5, 5, 2, "#111");
      ctx.font = "bold 6px monospace"; ctx.fillStyle = "#fef08a"; ctx.fillText("CS HIGH SCHOOL", x + 16, y + 15);
      [x + 8, x + w - 26].forEach(wx => {
        px(ctx, wx, y + 32, 18, 18, "#bae6fd");
        px(ctx, wx + 8, y + 32, 2, 18, "#7f1d1d"); px(ctx, wx, y + 40, 18, 2, "#7f1d1d");
      });
      const dx = b.doorTx * T;
      px(ctx, dx, y + h - 24, 24, 24, "#451a03");
      px(ctx, dx + 2, y + h - 22, 9, 22, "#92400e"); px(ctx, dx + 13, y + h - 22, 9, 22, "#92400e");
    } else if (b.style === "candy_shop") {
      px(ctx, x, y + 4, w, 14, "#be185d");
      px(ctx, x, y + 18, w, h - 18, purgatorio ? "#4c1d4b" : "#fdf2f8");
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

  Object.assign(window.WorldArt, {
    drawGrassTile, drawRoadTile, drawSidewalkTile, drawFenceTile,
    drawWaterTile, drawDreamBackdrop, drawTree, drawSignpost, drawBuilding, drawPortal
  });
})();
