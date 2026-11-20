// World tiles, buildings, portals, and interior furniture.
// =========================================================
// models/world_art.js — Detailed 32-Bit Trees, Unique Buildings,
//                       Animated Portals, & Real Furniture
// =========================================================
window.WorldArt = (() => {
  const T = 24; // 24x24 GBA tile size

  function px(ctx, x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // ---------------------------------------------------------
  // LAYERED 32-BIT TREES (Oak, Pine, Cherry Blossom, Cactus)
  // ---------------------------------------------------------
  function drawTree(ctx, x, y, kind = "oak", time = 0) {
    if (kind === "cactus") {
      // Desert Saguaro (Casa Grande)
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 2, 6, 20, "#15803d");
      px(ctx, x + 10, y + 3, 2, 18, "#22c55e");
      px(ctx, x + 4, y + 8, 5, 4, "#15803d");
      px(ctx, x + 4, y + 4, 3, 6, "#16a34a");
      px(ctx, x + 15, y + 10, 5, 4, "#15803d");
      px(ctx, x + 17, y + 5, 3, 7, "#16a34a");
      return;
    }

    if (kind === "pine") {
      // Layered Colorado Evergreen Pine
      ctx.fillStyle = "rgba(0,0,0,0.32)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 16, 6, 7, "#5c3a21");
      px(ctx, x + 10, y + 16, 2, 7, "#784c2b");
      // 3 tiered boughs
      px(ctx, x + 2, y + 12, 20, 6, "#14532d");
      px(ctx, x + 4, y + 11, 16, 4, "#166534");
      px(ctx, x + 4, y + 6, 16, 6, "#15803d");
      px(ctx, x + 6, y + 5, 12, 4, "#16a34a");
      px(ctx, x + 8, y + 0, 8, 6, "#15803d");
      px(ctx, x + 10, y - 2, 4, 4, "#22c55e");
      return;
    }

    if (kind === "cherry") {
      // Dream Realm Cherry Blossom Tree with drifting petals
      ctx.fillStyle = "rgba(30, 10, 60, 0.35)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 9, y + 14, 6, 9, "#4a2511");
      px(ctx, x + 10, y + 14, 2, 9, "#6d391c");
      // Lush pink canopy clusters
      px(ctx, x + 1, y + 4, 22, 12, "#db2777");
      px(ctx, x + 3, y + 1, 18, 12, "#f472b6");
      px(ctx, x + 5, y - 1, 12, 7, "#fbcfe8");
      px(ctx, x + 14, y + 5, 6, 5, "#f9a8d4");
      // Drifting blossom petal
      const sway = Math.sin(time * 0.003 + x) * 4;
      const fall = (time * 0.015 + y) % 18;
      px(ctx, x + 8 + sway, y + 6 + fall, 2, 2, "#fdf2f8");
      return;
    }

    // Default: Rich 32-Bit LeafGreen-Style Oak Tree
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath(); ctx.ellipse(x + 12, y + 22, 10, 4, 0, 0, Math.PI * 2); ctx.fill();
    px(ctx, x + 9, y + 14, 6, 9, "#5c3a21");
    px(ctx, x + 10, y + 14, 2, 8, "#855834");
    // Shaded foliage clusters
    px(ctx, x + 1, y + 5, 22, 11, "#166534");
    px(ctx, x + 2, y + 1, 20, 11, "#15803d");
    px(ctx, x + 4, y - 1, 16, 8, "#22c55e");
    px(ctx, x + 6, y + 0, 8, 4, "#4ade80");
    px(ctx, x + 14, y + 4, 5, 4, "#4ade80");
  }

  // ---------------------------------------------------------
  // 5 COMPLETELY UNIQUE BUILDINGS (Overworld Landmarks)
  // ---------------------------------------------------------
  function drawBuilding(ctx, b, time = 0) {
    const x = b.tx * T;
    const y = b.ty * T;
    const w = b.tw * T;
    const h = b.th * T;

    // Ground drop shadow
    px(ctx, x + 4, y + h - 4, w - 2, 8, "rgba(0,0,0,0.32)");

    if (b.style === "house") {
      // JACOB'S HOUSE: Warm Craftsman Suburban Home
      // Terracotta shingled pitched roof
      px(ctx, x - 3, y + 6, w + 6, 22, "#9a3412");
      px(ctx, x + 2, y, w - 4, 12, "#c2410c");
      for (let rx = x; rx < x + w; rx += 8) {
        px(ctx, rx, y + 14, 6, 2, "#7c2d12");
        px(ctx, rx + 4, y + 20, 6, 2, "#7c2d12");
      }
      // Brick Chimney
      px(ctx, x + w - 18, y - 6, 10, 18, "#7f1d1d");
      px(ctx, x + w - 19, y - 8, 12, 3, "#991b1b");
      // Cream siding walls
      px(ctx, x, y + 28, w, h - 28, "#fef3c7");
      px(ctx, x, y + h - 8, w, 8, "#94a3b8"); // stone foundation
      // Warm lit windows with shutters
      [x + 10, x + w - 26].forEach(wx => {
        px(ctx, wx - 3, y + 36, 22, 16, "#1e3a8a");
        px(ctx, wx, y + 38, 16, 12, "#fde68a");
        px(ctx, wx + 7, y + 38, 2, 12, "#78350f");
        px(ctx, wx, y + 43, 16, 2, "#78350f");
      });
      // Front Door & Wooden Porch
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 26, 20, 26, "#78350f");
      px(ctx, dx + 5, y + h - 23, 14, 21, "#b45309");
      px(ctx, dx + 15, y + h - 13, 3, 3, "#facc15");
      // Mailbox & flowerbed
      px(ctx, x + 6, y + h - 6, 20, 5, "#15803d");
      px(ctx, x + 10, y + h - 7, 3, 3, "#f472b6");
      px(ctx, x + 18, y + h - 7, 3, 3, "#facc15");
    }

    else if (b.style === "church") {
      // ST. JUDE CATHOLIC CHURCH: Gothic Stone, Steeple & Stained Glass
      // Tall Steeple
      const mid = x + Math.floor(w / 2);
      px(ctx, mid - 12, y - 22, 24, 28, "#64748b");
      px(ctx, mid - 14, y - 24, 28, 6, "#334155");
      // Golden Cross
      px(ctx, mid - 2, y - 38, 4, 16, "#f5c542");
      px(ctx, mid - 7, y - 34, 14, 4, "#f5c542");
      // Steep Gothic Slate Roof
      px(ctx, x - 2, y + 6, w + 4, 22, "#334155");
      px(ctx, x + 6, y - 2, w - 12, 12, "#475569");
      // Grey Stone Walls
      px(ctx, x, y + 28, w, h - 28, "#cbd5e1");
      px(ctx, x, y + 28, w, 4, "#94a3b8");
      // Arched Stained Glass Windows
      [x + 12, x + w - 28].forEach(wx => {
        px(ctx, wx, y + 36, 16, 20, "#1e293b");
        px(ctx, wx + 2, y + 38, 6, 8, "#38bdf8");
        px(ctx, wx + 8, y + 38, 6, 8, "#f43f5e");
        px(ctx, wx + 2, y + 46, 6, 8, "#facc15");
        px(ctx, wx + 8, y + 46, 6, 8, "#a855f7");
      });
      // Double Oak Church Doors + Stone Steps
      const dx = b.doorTx * T;
      px(ctx, dx, y + h - 26, 24, 26, "#451a03");
      px(ctx, dx + 2, y + h - 24, 9, 24, "#78350f");
      px(ctx, dx + 13, y + h - 24, 9, 24, "#78350f");
      px(ctx, dx - 4, y + h, 32, 4, "#94a3b8");
    }

    else if (b.style === "hospital") {
      // COLORADO SPRINGS HOSPITAL: Modern White/Teal Clinic + Red Cross
      px(ctx, x, y + 4, w, 14, "#0f766e"); // flat modern roofline
      px(ctx, x + 2, y + 18, w - 4, h - 18, "#f8fafc");
      px(ctx, x + 2, y + 18, w - 4, 4, "#cbd5e1");
      // Glowing Red Cross Badge
      const mid = x + Math.floor(w / 2);
      px(ctx, mid - 12, y - 4, 24, 18, "#ffffff");
      px(ctx, mid - 3, y - 2, 6, 14, "#ef4444");
      px(ctx, mid - 7, y + 2, 14, 6, "#ef4444");
      // Modern Teal Glass Windows
      for (let wx = x + 8; wx < x + w - 16; wx += 22) {
        if (Math.abs(wx - b.doorTx * T) < 16) continue;
        px(ctx, wx, y + 28, 16, 14, "#0284c7");
        px(ctx, wx + 2, y + 30, 5, 10, "#7dd3fc");
      }
      // Automatic Glass Sliding Doors
      const dx = b.doorTx * T;
      px(ctx, dx, y + h - 26, 24, 26, "#334155");
      px(ctx, dx + 2, y + h - 24, 9, 24, "#38bdf8");
      px(ctx, dx + 13, y + h - 24, 9, 24, "#38bdf8");
    }

    else if (b.style === "bookstore") {
      // BARNES & NOBLE: Brick Facade, Green Striped Awning & Book Displays
      px(ctx, x, y + 4, w, 14, "#14532d");
      px(ctx, x, y + 18, w, h - 18, "#991b1b"); // warm red brick
      for (let by = y + 22; by < y + h - 4; by += 8) {
        px(ctx, x + 2, by, w - 4, 1, "#7f1d1d");
      }
      // Forest Green Awning with Stripes
      px(ctx, x - 2, y + 24, w + 4, 12, "#15803d");
      for (let ax = x; ax < x + w; ax += 12) {
        px(ctx, ax, y + 24, 6, 12, "#166534");
      }
      // Display Windows showing tiny colorful books
      [x + 8, x + w - 28].forEach(wx => {
        px(ctx, wx, y + 40, 20, 16, "#fef3c7");
        px(ctx, wx + 2, y + 44, 4, 9, "#ef4444");
        px(ctx, wx + 7, y + 43, 4, 10, "#2563eb");
        px(ctx, wx + 12, y + 45, 5, 8, "#16a34a");
      });
      // Door
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 24, 20, 24, "#14532d");
      px(ctx, dx + 5, y + h - 21, 14, 18, "#fde68a");
    }

    else if (b.style === "party") {
      // PARTY HOUSE: Suburban House with Pulsing Neon Party Lights!
      const pulse = Math.floor(time / 350) % 2 === 0;
      const winCol1 = pulse ? "#ec4899" : "#22d3ee";
      const winCol2 = pulse ? "#22d3ee" : "#a855f7";
      px(ctx, x - 2, y + 6, w + 4, 20, "#312e81");
      px(ctx, x + 4, y, w - 8, 10, "#4338ca");
      px(ctx, x, y + 26, w, h - 26, "#475569");
      // Pulsing Neon Windows
      px(ctx, x + 10, y + 36, 18, 14, winCol1);
      px(ctx, x + w - 28, y + 36, 18, 14, winCol2);
      // Subwoofer & Solo Cups outside
      px(ctx, x + 4, y + h - 10, 8, 10, "#09090b");
      px(ctx, x + 6, y + h - 7, 4, 4, pulse ? "#f43f5e" : "#334155");
      px(ctx, x + w - 12, y + h - 5, 4, 5, "#ef4444");
      // Door
      const dx = b.doorTx * T;
      px(ctx, dx + 2, y + h - 24, 20, 24, "#1e1b4b");
      px(ctx, dx + 15, y + h - 12, 3, 3, "#facc15");
    }

    // Crisp Building Signboard
    if (b.label) {
      ctx.font = "bold 7px monospace";
      const tw = ctx.measureText(b.label).width + 8;
      const sx = x + Math.floor((w - tw) / 2);
      const sy = y + h + 2;
      px(ctx, sx, sy, tw, 11, "rgba(10, 14, 26, 0.88)");
      ctx.strokeStyle = "#f5c542";
      ctx.lineWidth = 1;
      ctx.strokeRect(sx + 0.5, sy + 0.5, tw - 1, 10);
      ctx.fillStyle = "#fef3c7";
      ctx.fillText(b.label, sx + 4, sy + 8);
    }
  }

  // ---------------------------------------------------------
  // ANIMATED SWIRLING PORTAL MODELS (Purgatorio / Dream / Fortress)
  // ---------------------------------------------------------
  function drawPortal(ctx, cx, cy, style = "purgatorio", time = 0) {
    const colors = {
      purgatorio: ["#7c3aed", "#c084fc", "#f5c542"],
      dream: ["#0284c7", "#38bdf8", "#f472b6"],
      bloodmoon: ["#991b1b", "#ef4444", "#fde047"]
    }[style] || ["#7c3aed", "#c084fc", "#f5c542"];

    ctx.save();
    ctx.translate(cx, cy);

    // Ancient stone rune base
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.beginPath();
    ctx.ellipse(0, 10, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = colors[2];
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Vertical Stone Pillars
    px(ctx, -16, -16, 4, 24, "#334155");
    px(ctx, 12, -16, 4, 24, "#334155");
    px(ctx, -16, -18, 32, 4, "#475569");
    px(ctx, -3, -20, 6, 4, colors[2]); // keystone rune

    // Swirling Energy Vortex
    const rot = time * 0.004;
    const pulse = Math.sin(time * 0.006) * 2;
    ctx.fillStyle = colors[0] + "aa";
    ctx.beginPath();
    ctx.ellipse(0, -3, 11 + pulse * 0.4, 14 + pulse * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = colors[1];
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -3, 8, rot, rot + Math.PI * 1.4);
    ctx.stroke();

    ctx.strokeStyle = colors[2];
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -3, 4, -rot * 1.5, -rot * 1.5 + Math.PI * 1.2);
    ctx.stroke();

    // Orbiting Spark Particles
    for (let i = 0; i < 4; i++) {
      const a = rot + (i * Math.PI) / 2;
      const sx = Math.cos(a) * 12;
      const sy = Math.sin(a) * 14 - 3;
      px(ctx, sx - 1, sy - 1, 2, 2, "#ffffff");
    }
    ctx.restore();
  }

  // ---------------------------------------------------------
  // REAL-LOOKING INTERIOR FURNITURE (Couch, Bed, Kitchen, etc.)
  // ---------------------------------------------------------
  function drawProp(ctx, prop, time = 0) {
    const x = prop.tx * T;
    const y = prop.ty * T;

    if (prop.kind === "couch") {
      // REAL-LOOKING COZY LIVING ROOM COUCH (Jacob's Sleeping Couch)
      const w = 72, h = 32;
      px(ctx, x, y + 26, w, 6, "rgba(0,0,0,0.3)"); // shadow
      px(ctx, x, y, w, 12, "#1e3a8a"); // backrest
      px(ctx, x + 2, y + 2, w - 4, 8, "#2563eb"); // cushion top
      px(ctx, x, y + 10, 10, 18, "#1e40af"); // left armrest
      px(ctx, x + w - 10, y + 10, 10, 18, "#1e40af"); // right armrest
      // 3 Stitched Seat Cushions
      px(ctx, x + 10, y + 12, 17, 14, "#3b82f6");
      px(ctx, x + 28, y + 12, 17, 14, "#3b82f6");
      px(ctx, x + 46, y + 12, 16, 14, "#3b82f6");
      // Cozy White Pillow & Draped Blanket!
      px(ctx, x + 11, y + 6, 14, 9, "#f8fafc");
      px(ctx, x + 13, y + 8, 10, 5, "#e2e8f0");
      px(ctx, x + 44, y + 10, 16, 16, "#a855f7"); // purple throw blanket
      px(ctx, x + 46, y + 12, 12, 12, "#c084fc");
      px(ctx, x + 4, y + 26, 6, 3, "#451a03"); // wooden feet
      px(ctx, x + w - 10, y + 26, 6, 3, "#451a03");
    }

    else if (prop.kind === "bed") {
      // REAL-LOOKING BED (Headboard, Plump Pillow, Folded Duvet)
      const w = 44, h = 58;
      px(ctx, x - 2, y + 52, w + 4, 7, "rgba(0,0,0,0.3)");
      // Wooden Headboard
      px(ctx, x, y, w, 12, "#78350f");
      px(ctx, x + 3, y + 2, w - 6, 8, "#92400e");
      // Mattress & Sheet
      px(ctx, x + 2, y + 12, w - 4, 42, "#f8fafc");
      // Plump Pillow
      px(ctx, x + 7, y + 13, w - 14, 11, "#e0f2fe");
      px(ctx, x + 9, y + 15, w - 18, 7, "#ffffff");
      // Indigo/Teal Folded Duvet
      px(ctx, x + 2, y + 26, w - 4, 28, "#312e81");
      px(ctx, x + 2, y + 26, w - 4, 5, "#6366f1"); // folded cuff
      px(ctx, x + 2, y + 52, w - 4, 4, "#78350f"); // footboard
    }

    else if (prop.kind === "kitchen_counter") {
      // Kitchen Island with Navi's Brunch Spread!
      const w = 96, h = 28;
      px(ctx, x, y, w, h, "#475569");
      px(ctx, x + 2, y + 2, w - 4, 16, "#cbd5e1"); // granite top
      // Pancakes, Fruit Bowl, Quiche
      px(ctx, x + 12, y + 5, 14, 10, "#ffffff");
      px(ctx, x + 15, y + 7, 8, 6, "#d97706"); // pancakes
      px(ctx, x + 38, y + 5, 14, 10, "#ffffff");
      px(ctx, x + 41, y + 7, 4, 4, "#ef4444"); // strawberries
      px(ctx, x + 46, y + 8, 4, 4, "#22c55e"); // grapes
      px(ctx, x + 66, y + 5, 16, 10, "#facc15"); // quiche tray
    }

    else if (prop.kind === "tv") {
      px(ctx, x, y + 10, 48, 12, "#451a03"); // stand
      px(ctx, x + 4, y - 4, 40, 18, "#0f172a"); // bezel
      px(ctx, x + 6, y - 2, 36, 14, "#1e3a8a"); // glowing screen
    }

    else if (prop.kind === "rug") {
      const w = (prop.tw || 4) * T, h = (prop.th || 3) * T;
      px(ctx, x, y, w, h, prop.color || "#581c87");
      px(ctx, x + 4, y + 4, w - 8, h - 8, prop.inner || "#7e22ce");
    }

    else if (prop.kind === "altar") {
      px(ctx, x, y, 72, 24, "#cbd5e1");
      px(ctx, x + 4, y + 4, 64, 14, "#f8fafc");
      px(ctx, x + 30, y - 8, 12, 16, "#f5c542"); // gold cross
      px(ctx, x + 10, y + 2, 4, 8, "#fef08a"); // candle
      px(ctx, x + 58, y + 2, 4, 8, "#fef08a"); // candle
    }

    else if (prop.kind === "pew") {
      px(ctx, x, y, 72, 16, "#78350f");
      px(ctx, x + 2, y + 2, 68, 6, "#92400e");
    }

    else if (prop.kind === "bookshelf") {
      px(ctx, x, y, 48, 28, "#78350f");
      const cols = ["#ef4444", "#3b82f6", "#22c55e", "#f59e0b", "#a855f7"];
      for (let i = 0; i < 8; i++) {
        px(ctx, x + 4 + i * 5, y + 4, 4, 9, cols[i % cols.length]);
        px(ctx, x + 4 + i * 5, y + 16, 4, 9, cols[(i + 2) % cols.length]);
      }
    }

    else if (prop.kind === "hospital_bed") {
      px(ctx, x, y, 40, 52, "#cbd5e1");
      px(ctx, x + 3, y + 4, 34, 44, "#ffffff");
      px(ctx, x + 6, y + 8, 28, 10, "#e0f2fe");
      px(ctx, x + 3, y + 24, 34, 24, "#0ea5e9");
    }

    else if (prop.kind === "party_table") {
      px(ctx, x, y, 72, 24, "#1e293b");
      const glow = Math.floor(time / 300) % 2 === 0 ? "#ec4899" : "#22d3ee";
      px(ctx, x + 8, y + 6, 6, 8, "#ef4444"); // solo cup
      px(ctx, x + 20, y + 8, 6, 8, "#ef4444");
      px(ctx, x + 48, y + 4, 16, 14, "#09090b"); // speaker
      px(ctx, x + 52, y + 8, 8, 6, glow);
    }

    else if (prop.kind === "exit_mat") {
      px(ctx, x, y + 4, 48, 16, "#991b1b");
      px(ctx, x + 3, y + 7, 42, 10, "#f5c542");
      ctx.font = "bold 7px monospace";
      ctx.fillStyle = "#111";
      ctx.fillText("EXIT", x + 15, y + 14);
    }
  }

  return { T, drawTree, drawBuilding, drawPortal, drawProp };
})();
