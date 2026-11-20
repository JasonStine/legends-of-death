// Overworld animation frames, portraits, and full-body battle sprites.
// =========================================================
// models/sprites.js — 32-Bit Overworld Sprites, 64x64 Portraits,
//                     & 96x96 FULL-BODY Battle Models
// =========================================================
window.Sprites = (() => {
  function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // ---------------------------------------------------------
  // 1. OVERWORLD 24x32 CHARACTER SPRITE (Smooth 4-Frame Walk)
  // ---------------------------------------------------------
  function drawOverworld(ctx, id, x, y, dir = "down", frame = 0, purgatorio = false) {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    const step = frame % 4; // 0: idle, 1: left foot, 2: idle, 3: right foot
    const bob = (step === 1 || step === 3) ? -1 : 0;
    const leftLegY = step === 1 ? -2 : (step === 3 ? 1 : 0);
    const rightLegY = step === 3 ? -2 : (step === 1 ? 1 : 0);
    const armSwing = step === 1 ? 2 : (step === 3 ? -2 : 0);

    // Special case: Crista the platinum cat
    if (p.hairStyle === "cat") {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath();
      ctx.ellipse(x + 12, y + 27, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      px(ctx, x + 7, y + 19 + bob, 10, 7, p.top);
      px(ctx, x + 15, y + 16 + bob, 3, 5, p.skinShade); // tail
      px(ctx, x + 7, y + 13 + bob, 9, 7, p.hair); // head
      px(ctx, x + 7, y + 11 + bob, 2, 3, p.hair); // ear L
      px(ctx, x + 14, y + 11 + bob, 2, 3, p.hair); // ear R
      px(ctx, x + 9, y + 16 + bob, 2, 2, p.eyes);
      px(ctx, x + 13, y + 16 + bob, 2, 2, p.eyes);
      return;
    }

    // Ground shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 29, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle Purgatorio wings if active
    if (purgatorio && p.wings && p.wings !== "float") {
      const wCol = p.wings === "angel" ? "#f8fafc" : (p.wings === "corrupted" ? "#7f1d1d" : "#111827");
      const flap = Math.sin(Date.now() * 0.008) * 2;
      px(ctx, x - 4, y + 10 + bob + flap, 7, 9, wCol);
      px(ctx, x + 21, y + 10 + bob + flap, 7, 9, p.wings === "corrupted" ? "#dc2626" : wCol);
    }

    // Legs & Shoes (alternating stride)
    if (dir === "left" || dir === "right") {
      const stride = step === 1 ? 3 : (step === 3 ? -3 : 0);
      px(ctx, x + 9 - stride, y + 21, 4, 6, p.pants);
      px(ctx, x + 9 - stride, y + 26, 5, 3, p.shoes);
      px(ctx, x + 11 + stride, y + 21, 4, 6, p.pants);
      px(ctx, x + 11 + stride, y + 26, 5, 3, p.shoes);
    } else {
      px(ctx, x + 7, y + 21 + leftLegY, 4, 6, p.pants);
      px(ctx, x + 7, y + 26 + leftLegY, 4, 3, p.shoes);
      px(ctx, x + 13, y + 21 + rightLegY, 4, 6, p.pants);
      px(ctx, x + 13, y + 26 + rightLegY, 4, 3, p.shoes);
    }

    // Torso / Jacket with shading
    px(ctx, x + 6, y + 13 + bob, 12, 9, p.top);
    px(ctx, x + 6, y + 19 + bob, 12, 3, p.topShade);
    if (dir === "down") {
      px(ctx, x + 10, y + 14 + bob, 4, 6, p.accent);
    }

    // Arms with walk swing
    if (dir === "down" || dir === "up") {
      px(ctx, x + 3, y + 14 + bob + armSwing, 3, 6, p.topShade);
      px(ctx, x + 3, y + 19 + bob + armSwing, 3, 2, p.skin);
      px(ctx, x + 18, y + 14 + bob - armSwing, 3, 6, p.topShade);
      px(ctx, x + 18, y + 19 + bob - armSwing, 3, 2, p.skin);
    } else {
      px(ctx, x + 10 + armSwing, y + 14 + bob, 4, 6, p.topShade);
      px(ctx, x + 10 + armSwing, y + 19 + bob, 4, 2, p.skin);
    }

    // Head
    px(ctx, x + 6, y + 3 + bob, 12, 10, p.skin);
    px(ctx, x + 6, y + 11 + bob, 12, 2, p.skinShade);

    // Hair / Hood
    if (p.hairStyle === "hood") {
      px(ctx, x + 4, y + 1 + bob, 16, 12, p.top);
      px(ctx, x + 6, y + 5 + bob, 12, 7, "#09090b");
    } else {
      px(ctx, x + 5, y + 1 + bob, 14, 5, p.hair);
      px(ctx, x + 7, y + 2 + bob, 6, 2, p.hairHi);
      if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
        px(ctx, x + 4, y + 4 + bob, 3, 12, p.hair);
        px(ctx, x + 17, y + 4 + bob, 3, 12, p.hair);
        if (dir === "up") px(ctx, x + 5, y + 4 + bob, 14, 12, p.hair);
      } else if (p.hairStyle === "spiky") {
        px(ctx, x + 6, y - 1 + bob, 3, 3, p.hair);
        px(ctx, x + 11, y - 2 + bob, 3, 4, p.hair);
        px(ctx, x + 15, y - 1 + bob, 3, 3, p.hair);
      } else if (p.hairStyle === "curly") {
        px(ctx, x + 4, y + 2 + bob, 16, 6, p.hair);
        px(ctx, x + 4, y + 5 + bob, 3, 6, p.hair);
        px(ctx, x + 17, y + 5 + bob, 3, 6, p.hair);
      } else if (p.hairStyle === "bun") {
        px(ctx, x + 9, y - 2 + bob, 6, 4, p.hair);
      } else {
        px(ctx, x + 5, y + 4 + bob, 2, 4, p.hair);
        px(ctx, x + 17, y + 4 + bob, 2, 4, p.hair);
      }
      if (dir === "up") {
        px(ctx, x + 5, y + 3 + bob, 14, 9, p.hair);
      }
    }

    // Face details
    if (dir === "down") {
      px(ctx, x + 8, y + 7 + bob, 2, 3, "#111");
      px(ctx, x + 8, y + 8 + bob, 2, 2, p.eyes);
      px(ctx, x + 14, y + 7 + bob, 2, 3, "#111");
      px(ctx, x + 14, y + 8 + bob, 2, 2, p.eyes);
    } else if (dir === "left") {
      px(ctx, x + 7, y + 7 + bob, 2, 3, p.eyes);
    } else if (dir === "right") {
      px(ctx, x + 15, y + 7 + bob, 2, 3, p.eyes);
    }
  }

  // ---------------------------------------------------------
  // 2. 64x64 EXPRESSIVE DIALOGUE PORTRAIT
  // ---------------------------------------------------------
  function drawPortrait(ctx, id, mood = "neutral") {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    ctx.clearRect(0, 0, 64, 64);

    // Subtle character aura backdrop
    const grad = ctx.createRadialGradient(32, 28, 4, 32, 32, 34);
    grad.addColorStop(0, p.aura ? p.aura + "55" : "#47556966");
    grad.addColorStop(1, "#0f1324");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    if (p.hairStyle === "cat") {
      px(ctx, 18, 26, 28, 24, p.hair);
      px(ctx, 16, 14, 8, 14, p.hair);
      px(ctx, 40, 14, 8, 14, p.hair);
      px(ctx, 18, 18, 4, 8, "#fda4af");
      px(ctx, 42, 18, 4, 8, "#fda4af");
      px(ctx, 22, 32, 6, 6, p.eyes);
      px(ctx, 36, 32, 6, 6, p.eyes);
      px(ctx, 30, 39, 4, 3, "#f472b6");
      return;
    }

    // Shoulders & Jacket
    px(ctx, 10, 44, 44, 20, p.top);
    px(ctx, 10, 56, 44, 8, p.topShade);
    px(ctx, 25, 45, 14, 19, p.accent);
    // Neck
    px(ctx, 26, 38, 12, 9, p.skinShade);

    // Back hair for long styles
    if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
      px(ctx, 12, 16, 40, 36, p.hair);
    }

    // Head shape
    px(ctx, 18, 14, 28, 26, p.skin);
    px(ctx, 20, 38, 24, 3, p.skinShade);
    px(ctx, 16, 22, 3, 8, p.skinShade); // ear L
    px(ctx, 45, 22, 3, 8, p.skinShade); // ear R

    // Hair / Hood
    if (p.hairStyle === "hood") {
      px(ctx, 10, 6, 44, 38, p.top);
      px(ctx, 16, 14, 32, 26, "#09090b");
    } else {
      px(ctx, 15, 8, 34, 12, p.hair);
      px(ctx, 20, 10, 18, 4, p.hairHi);
      px(ctx, 14, 14, 6, 16, p.hair);
      px(ctx, 44, 14, 6, 16, p.hair);
      if (p.hairStyle === "spiky") {
        px(ctx, 18, 3, 6, 7, p.hair);
        px(ctx, 28, 1, 8, 9, p.hair);
        px(ctx, 40, 4, 6, 7, p.hair);
      } else if (p.hairStyle === "curly") {
        px(ctx, 13, 10, 38, 10, p.hair);
        px(ctx, 13, 18, 6, 14, p.hair);
        px(ctx, 45, 18, 6, 14, p.hair);
      } else if (p.hairStyle === "bun") {
        px(ctx, 24, 2, 16, 8, p.hair);
      }
    }

    // Eyes
    const eyeY = 24;
    px(ctx, 21, eyeY, 7, 6, "#ffffff");
    px(ctx, 36, eyeY, 7, 6, "#ffffff");
    px(ctx, 23, eyeY + 1, 4, 5, p.eyes);
    px(ctx, 38, eyeY + 1, 4, 5, p.eyes);
    px(ctx, 24, eyeY + 2, 2, 2, "#09090b");
    px(ctx, 39, eyeY + 2, 2, 2, "#09090b");
    px(ctx, 23, eyeY + 1, 1, 1, "#ffffff");
    px(ctx, 38, eyeY + 1, 1, 1, "#ffffff");

    // Eyebrows & Mood Expressions
    if (mood === "angry" || mood === "intense") {
      px(ctx, 20, 21, 8, 2, p.hair);
      px(ctx, 25, 22, 4, 2, p.hair);
      px(ctx, 36, 21, 8, 2, p.hair);
      px(ctx, 35, 22, 4, 2, p.hair);
      px(ctx, 27, 34, 10, 3, "#7f1d1d");
    } else if (mood === "sad") {
      px(ctx, 20, 22, 8, 2, p.hair);
      px(ctx, 36, 22, 8, 2, p.hair);
      px(ctx, 28, 35, 8, 2, "#9a5b48");
      px(ctx, 22, 31, 2, 4, "#38bdf8"); // tear
    } else if (mood === "happy" || mood === "blush") {
      px(ctx, 20, 20, 8, 2, p.hair);
      px(ctx, 36, 20, 8, 2, p.hair);
      px(ctx, 27, 33, 10, 3, "#b91c1c");
      px(ctx, 28, 33, 8, 1, "#ffffff");
      if (mood === "blush") {
        px(ctx, 19, 30, 5, 2, "#f472b6");
        px(ctx, 40, 30, 5, 2, "#f472b6");
      }
    } else {
      px(ctx, 20, 21, 8, 2, p.hair);
      px(ctx, 36, 21, 8, 2, p.hair);
      px(ctx, 28, 34, 8, 2, "#8c4a38");
    }
  }

  // ---------------------------------------------------------
  // 3. 96x96 FULL-BODY BATTLE CHARACTER MODEL (Animated!)
  // ---------------------------------------------------------
  function drawBattleModel(ctx, id, cx, cy, flip = false, animTime = 0, lunge = 0, hitFlash = false) {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    const breath = Math.sin(animTime * 0.005) * 2;
    const wingFlap = Math.sin(animTime * 0.009) * 5;

    ctx.save();
    ctx.translate(cx + (flip ? -lunge : lunge), cy + breath);
    if (flip) ctx.scale(-1, 1);

    if (hitFlash) {
      ctx.filter = "brightness(2.5) saturate(0.2)";
    }

    // Special Boss Model: ENVY (Colossal Poison Serpent)
    if (p.weapon === "serpent") {
      // Coiled giant emerald/violet serpent
      ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
      ctx.beginPath();
      ctx.ellipse(0, 32, 38, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Coils
      px(ctx, -34, 14, 68, 16, "#065f46");
      px(ctx, -28, 18, 56, 8, "#10b981");
      px(ctx, -24, 0, 48, 16, "#047857");
      px(ctx, -18, 4, 36, 8, "#34d399");
      // Rising neck & cobra hood
      px(ctx, -20, -28, 40, 30, "#064e3b");
      px(ctx, -14, -24, 28, 24, "#581c87"); // violet markings
      px(ctx, -10, -20, 20, 20, "#10b981");
      // Serpent Head
      px(ctx, -16, -42, 32, 18, "#065f46");
      px(ctx, -12, -38, 24, 10, "#10b981");
      // Glowing Eyes & Fangs
      px(ctx, -10, -36, 6, 4, "#fde047");
      px(ctx, 4, -36, 6, 4, "#fde047");
      px(ctx, -8, -26, 3, 7, "#ffffff");
      px(ctx, 5, -26, 3, 7, "#ffffff");
      // Dripping black Iris toxin
      const drip = (animTime * 0.03) % 14;
      px(ctx, -7, -18 + drip, 2, 5, "#a855f7");
      px(ctx, 6, -15 + ((drip + 6) % 14), 2, 5, "#111827");
      ctx.restore();
      return;
    }

    // Aura glow underneath
    if (p.aura) {
      ctx.fillStyle = p.aura + "33";
      ctx.beginPath();
      ctx.ellipse(0, 34, 26, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Wings (Full-body Caeleste / Angel / Demon / Corrupted)
    if (p.wings && p.wings !== "float") {
      const leftCol = p.wings === "angel" ? "#f8fafc" : (p.wings === "demon" ? "#7f1d1d" : "#111827");
      const rightCol = p.wings === "corrupted" ? "#991b1b" : leftCol;
      const trim = p.wings === "angel" ? "#f5c542" : (p.wings === "demon" ? "#ef4444" : "#374151");

      // Left wing
      ctx.fillStyle = leftCol;
      ctx.beginPath();
      ctx.moveTo(-6, -6);
      ctx.lineTo(-42, -24 + wingFlap);
      ctx.lineTo(-34, 4 + wingFlap * 0.5);
      ctx.lineTo(-8, 10);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = trim;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right wing
      ctx.fillStyle = rightCol;
      ctx.beginPath();
      ctx.moveTo(6, -6);
      ctx.lineTo(42, -24 + wingFlap);
      ctx.lineTo(34, 4 + wingFlap * 0.5);
      ctx.lineTo(8, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Crepsus glowing blue eye on corrupted wing
      if (p.wings === "corrupted") {
        px(ctx, 20, -14 + wingFlap * 0.6, 6, 4, "#38bdf8");
      }
    }

    // Legs & Boots (Full body stance)
    px(ctx, -11, 14, 8, 16, p.pants);
    px(ctx, 3, 14, 8, 16, p.pants);
    px(ctx, -13, 28, 10, 6, p.shoes);
    px(ctx, 3, 28, 10, 6, p.shoes);

    // Torso / Coat / Armor
    px(ctx, -12, -10, 24, 24, p.top);
    px(ctx, -12, 8, 24, 7, p.topShade);
    px(ctx, -5, -8, 10, 18, p.accent);
    // Shoulder armor for Navi / Crepsus
    if (id === "navi" || id === "crepsus") {
      px(ctx, -16, -12, 7, 7, p.accent);
      px(ctx, 9, -12, 7, 7, p.accent);
    }

    // Arms
    px(ctx, -18, -8, 6, 16, p.topShade);
    px(ctx, -18, 6, 6, 5, p.skin);
    px(ctx, 12, -8, 6, 16, p.topShade);
    px(ctx, 12, 6, 6, 5, p.skin);

    // Head & Hair
    px(ctx, -10, -30, 20, 19, p.skin);
    px(ctx, -10, -14, 20, 3, p.skinShade);

    if (p.hairStyle === "hood") {
      px(ctx, -14, -35, 28, 25, p.top);
      px(ctx, -10, -28, 20, 16, "#09090b");
    } else {
      px(ctx, -12, -35, 24, 9, p.hair);
      px(ctx, -8, -33, 12, 3, p.hairHi);
      if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
        px(ctx, -14, -30, 5, 24, p.hair);
        px(ctx, 9, -30, 5, 24, p.hair);
      } else if (p.hairStyle === "spiky") {
        px(ctx, -10, -40, 5, 6, p.hair);
        px(ctx, -2, -42, 6, 8, p.hair);
        px(ctx, 7, -39, 5, 6, p.hair);
      } else if (p.hairStyle === "curly") {
        px(ctx, -13, -34, 26, 9, p.hair);
        px(ctx, -13, -27, 4, 12, p.hair);
        px(ctx, 9, -27, 4, 12, p.hair);
      }
    }

    // Eyes
    px(ctx, -6, -22, 4, 4, p.eyes);
    px(ctx, 3, -22, 4, 4, p.eyes);

    // Signature Weapons
    if (p.weapon === "halberd") {
      px(ctx, 18, -36, 3, 62, "#f59e0b");
      px(ctx, 14, -38, 14, 12, "#38bdf8");
      px(ctx, 20, -42, 5, 6, "#e0f2fe");
    } else if (p.weapon === "rapier") {
      px(ctx, 16, -24, 3, 34, "#c084fc");
      px(ctx, 12, 6, 11, 3, "#fbbf24");
    } else if (p.weapon === "mallet") {
      px(ctx, 16, -20, 4, 32, "#6366f1");
      px(ctx, 8, -32, 20, 14, "#1e1b4b");
      px(ctx, 10, -30, 16, 4, "#facc15");
    } else if (p.weapon === "whip") {
      ctx.strokeStyle = "#f97316";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(16, 6);
      ctx.bezierCurveTo(36, -6, 26, -26, 42, -32 + wingFlap * 0.5);
      ctx.stroke();
    } else if (p.weapon === "rake") {
      px(ctx, 17, -34, 4, 64, "#78350f");
      px(ctx, 9, -36, 20, 4, "#dc2626");
      px(ctx, 9, -44, 3, 10, "#fca5a5");
      px(ctx, 17, -44, 3, 10, "#fca5a5");
      px(ctx, 26, -44, 3, 10, "#fca5a5");
    } else if (p.weapon === "scythe") {
      px(ctx, 17, -38, 4, 68, "#4c1d95");
      ctx.fillStyle = "#e2e8f0";
      ctx.beginPath();
      ctx.moveTo(19, -38);
      ctx.quadraticCurveTo(-12, -46, -16, -22);
      ctx.quadraticCurveTo(0, -30, 19, -28);
      ctx.fill();
    } else if (p.weapon === "sickle") {
      px(ctx, 16, -8, 3, 18, "#db2777");
      ctx.strokeStyle = "#f8fafc";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(16, -10, 10, Math.PI * 0.9, Math.PI * 2.1);
      ctx.stroke();
    } else if (p.weapon === "ring") {
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(16, 8, 7 + Math.sin(animTime * 0.01) * 2, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.weapon === "claws") {
      px(ctx, 14, 10, 10, 3, "#ef4444");
      px(ctx, 16, 14, 10, 3, "#ef4444");
    } else if (p.weapon === "axe") {
      px(ctx, 17, -34, 4, 60, "#cbd5e1");
      px(ctx, 8, -32, 22, 14, "#10b981");
    }

    ctx.restore();
  }

  return { drawOverworld, drawPortrait, drawBattleModel };
})();
