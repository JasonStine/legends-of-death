// =========================================================
// models/sprites.js — Upgraded 32-Bit GBA Human Sprites,
//                     64x64 Portraits & Detailed Battle Models
// =========================================================
window.Sprites = (() => {
  const OUT = "#141624";

  function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  // ---------------------------------------------------------
  // 1. OVERWORLD 24x32 HUMAN SPRITE (Anatomical + 1px Outlines)
  // ---------------------------------------------------------
  function drawOverworld(ctx, id, x, y, dir = "down", frame = 0, purgatorio = false, activity = null, time = 0) {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    const step = frame % 4;
    const danceBob = activity === "dance" ? Math.round(Math.sin(time * 0.014 + x) * 2) : 0;
    const bob = ((step === 1 || step === 3) ? -1 : 0) + danceBob;
    const leftLegY = step === 1 ? -2 : (step === 3 ? 1 : 0);
    const rightLegY = step === 3 ? -2 : (step === 1 ? 1 : 0);
    const armSwing = step === 1 ? 2 : (step === 3 ? -2 : 0);

    // Special: Crista the Platinum Cat (outlined & detailed)
    if (p.hairStyle === "cat") {
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 27, 7, 3, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, x + 6, y + 18 + bob, 12, 9, OUT);
      px(ctx, x + 7, y + 19 + bob, 10, 7, p.top);
      px(ctx, x + 16, y + 14 + bob, 3, 6, OUT);
      px(ctx, x + 17, y + 15 + bob, 2, 5, p.skinShade);
      px(ctx, x + 6, y + 12 + bob, 11, 9, OUT);
      px(ctx, x + 7, y + 13 + bob, 9, 7, p.hair);
      px(ctx, x + 7, y + 10 + bob, 3, 4, OUT); px(ctx, x + 8, y + 11 + bob, 1, 2, "#fda4af");
      px(ctx, x + 14, y + 10 + bob, 3, 4, OUT); px(ctx, x + 15, y + 11 + bob, 1, 2, "#fda4af");
      px(ctx, x + 9, y + 16 + bob, 2, 2, p.eyes);
      px(ctx, x + 13, y + 16 + bob, 2, 2, p.eyes);
      return;
    }

    // Ground shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.34)";
    ctx.beginPath(); ctx.ellipse(x + 12, y + 29, 7, 2.8, 0, 0, Math.PI * 2); ctx.fill();

    // Purgatorio Wings behind character
    if (purgatorio && p.wings && p.wings !== "float") {
      const wCol = p.wings === "angel" ? "#f8fafc" : (p.wings === "corrupted" ? "#7f1d1d" : "#111827");
      const flap = Math.sin(time * 0.008) * 2;
      px(ctx, x - 5, y + 10 + bob + flap, 9, 9, OUT);
      px(ctx, x - 4, y + 11 + bob + flap, 7, 7, wCol);
      px(ctx, x + 20, y + 10 + bob + flap, 9, 9, OUT);
      px(ctx, x + 21, y + 11 + bob + flap, 7, 7, p.wings === "corrupted" ? "#dc2626" : wCol);
    }

    // Back long hair layer (when facing down/side)
    if ((p.hairStyle === "long" || p.hairStyle === "wavy_long") && dir !== "up") {
      px(ctx, x + 4, y + 5 + bob, 16, 13, OUT);
      px(ctx, x + 5, y + 6 + bob, 14, 11, p.hair);
    }

    // LEGS & SHOES (Outlined with distinct stride)
    if (dir === "left" || dir === "right") {
      const stride = step === 1 ? 3 : (step === 3 ? -3 : 0);
      px(ctx, x + 8 - stride, y + 20, 6, 9, OUT);
      px(ctx, x + 9 - stride, y + 21, 4, 5, p.pants);
      px(ctx, x + 9 - stride, y + 26, 5, 2, p.shoes);
      px(ctx, x + 10 + stride, y + 20, 6, 9, OUT);
      px(ctx, x + 11 + stride, y + 21, 4, 5, p.pants);
      px(ctx, x + 11 + stride, y + 26, 5, 2, p.shoes);
    } else {
      px(ctx, x + 6, y + 20 + leftLegY, 6, 9, OUT);
      px(ctx, x + 7, y + 21 + leftLegY, 4, 5, p.pants);
      px(ctx, x + 7, y + 26 + leftLegY, 4, 2, p.shoes);

      px(ctx, x + 12, y + 20 + rightLegY, 6, 9, OUT);
      px(ctx, x + 13, y + 21 + rightLegY, 4, 5, p.pants);
      px(ctx, x + 13, y + 26 + rightLegY, 4, 2, p.shoes);
    }

    // TORSO / JACKET / BELT (Contoured shoulders & collar)
    px(ctx, x + 5, y + 12 + bob, 14, 10, OUT);
    px(ctx, x + 6, y + 13 + bob, 12, 8, p.top);
    px(ctx, x + 6, y + 18 + bob, 12, 2, p.topShade);
    px(ctx, x + 6, y + 20 + bob, 12, 1, "#0f172a"); // belt line
    if (dir === "down") {
      px(ctx, x + 10, y + 13 + bob, 4, 6, p.accent); // shirt / lapel
      px(ctx, x + 11, y + 20 + bob, 2, 1, "#f5c542"); // belt buckle
    }

    // ARMS & HANDS (Outlined, swinging naturally)
    if (dir === "down" || dir === "up") {
      px(ctx, x + 3, y + 13 + bob + armSwing, 4, 8, OUT);
      px(ctx, x + 4, y + 14 + bob + armSwing, 2, 4, p.topShade);
      px(ctx, x + 4, y + 18 + bob + armSwing, 2, 2, p.skin);

      px(ctx, x + 17, y + 13 + bob - armSwing, 4, 8, OUT);
      px(ctx, x + 18, y + 14 + bob - armSwing, 2, 4, p.topShade);
      px(ctx, x + 18, y + 18 + bob - armSwing, 2, 2, p.skin);
    } else {
      px(ctx, x + 9 + armSwing, y + 13 + bob, 5, 8, OUT);
      px(ctx, x + 10 + armSwing, y + 14 + bob, 3, 4, p.topShade);
      px(ctx, x + 10 + armSwing, y + 18 + bob, 3, 2, p.skin);
    }

    // NECK
    px(ctx, x + 10, y + 11 + bob, 4, 3, p.skinShade);

    // HEAD (Rounded silhouette with dark outline + chin taper)
    px(ctx, x + 6, y + 2 + bob, 12, 10, OUT);
    px(ctx, x + 7, y + 1 + bob, 10, 12, OUT);
    px(ctx, x + 7, y + 3 + bob, 10, 8, p.skin);
    px(ctx, x + 8, y + 10 + bob, 8, 2, p.skin);      // tapered chin
    px(ctx, x + 8, y + 11 + bob, 8, 1, p.skinShade); // jaw shade

    // HAIR / HOOD (Layered crown, bangs & highlights)
    if (p.hairStyle === "hood") {
      px(ctx, x + 5, y + 0 + bob, 14, 12, OUT);
      px(ctx, x + 6, y + 1 + bob, 12, 10, p.top);
      px(ctx, x + 8, y + 4 + bob, 8, 6, "#09090b");
    } else {
      px(ctx, x + 5, y + 0 + bob, 14, 6, OUT);
      px(ctx, x + 6, y + 1 + bob, 12, 4, p.hair);
      px(ctx, x + 8, y + 2 + bob, 5, 1, p.hairHi);
      // Sideburns / bangs
      px(ctx, x + 6, y + 4 + bob, 2, 3, p.hair);
      px(ctx, x + 16, y + 4 + bob, 2, 3, p.hair);
      if (p.hairStyle === "spiky") {
        px(ctx, x + 7, y - 2 + bob, 3, 3, p.hair);
        px(ctx, x + 11, y - 3 + bob, 3, 4, p.hair);
        px(ctx, x + 14, y - 1 + bob, 3, 3, p.hair);
      } else if (p.hairStyle === "curly") {
        px(ctx, x + 5, y + 2 + bob, 14, 5, p.hair);
        px(ctx, x + 5, y + 5 + bob, 2, 5, p.hair);
        px(ctx, x + 17, y + 5 + bob, 2, 5, p.hair);
      } else if (p.hairStyle === "bun") {
        px(ctx, x + 9, y - 2 + bob, 6, 4, OUT);
        px(ctx, x + 10, y - 1 + bob, 4, 2, p.hair);
      } else if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
        px(ctx, x + 5, y + 4 + bob, 2, 10, p.hair);
        px(ctx, x + 17, y + 4 + bob, 2, 10, p.hair);
      }
      if (dir === "up") {
        px(ctx, x + 6, y + 2 + bob, 12, 10, p.hair);
        if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
          px(ctx, x + 6, y + 9 + bob, 12, 6, p.hair);
        }
      }
    }

    // EXPRESSIVE FACE (Sclera + Colored Iris + Subtle Mouth)
    if (dir === "down") {
      px(ctx, x + 8, y + 6 + bob, 3, 3, "#ffffff");
      px(ctx, x + 9, y + 7 + bob, 2, 2, p.eyes);
      px(ctx, x + 13, y + 6 + bob, 3, 3, "#ffffff");
      px(ctx, x + 13, y + 7 + bob, 2, 2, p.eyes);
      if (p.hairStyle !== "hood") px(ctx, x + 11, y + 10 + bob, 2, 1, "#a66a54");
    } else if (dir === "left") {
      px(ctx, x + 7, y + 6 + bob, 2, 3, "#ffffff");
      px(ctx, x + 7, y + 7 + bob, 2, 2, p.eyes);
    } else if (dir === "right") {
      px(ctx, x + 15, y + 6 + bob, 2, 3, "#ffffff");
      px(ctx, x + 15, y + 7 + bob, 2, 2, p.eyes);
    }

    // Ambient life visual cue (cooking steam, vaping puff, music note)
    if (activity === "cook" && Math.floor(time / 850) % 2 === 0) {
      const drift = (time * 0.015) % 8;
      px(ctx, x + 10, y - 5 - drift, 3, 3, "rgba(255,255,255,0.75)");
      px(ctx, x + 14, y - 8 - drift, 2, 2, "rgba(254,240,138,0.85)");
    } else if (activity === "vape" && Math.floor(time / 1200) % 3 === 0) {
      const drift = (time * 0.012) % 9;
      px(ctx, x + 12, y - 4 - drift, 4, 3, "rgba(244,114,182,0.55)");
    } else if (activity === "dance" && Math.floor(time / 500) % 2 === 0) {
      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 8px monospace";
      ctx.fillText("♪", x + 16, y - 2);
    }
  }

  // ---------------------------------------------------------
  // 2. 64x64 EXPRESSIVE DIALOGUE PORTRAIT
  // ---------------------------------------------------------
  function drawPortrait(ctx, id, mood = "neutral") {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    ctx.clearRect(0, 0, 64, 64);

    const grad = ctx.createRadialGradient(32, 28, 4, 32, 32, 34);
    grad.addColorStop(0, p.aura ? p.aura + "55" : "#47556966");
    grad.addColorStop(1, "#0f1324");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);

    if (p.hairStyle === "sign") {
      px(ctx, 29, 34, 6, 24, "#78350f");
      px(ctx, 10, 14, 44, 24, "#92400e");
      px(ctx, 13, 17, 38, 18, "#fef3c7");
      px(ctx, 18, 22, 28, 3, "#78350f");
      px(ctx, 18, 28, 20, 3, "#78350f");
      return;
    }
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

    // Shoulders & Jacket with outline
    px(ctx, 9, 43, 46, 21, OUT);
    px(ctx, 11, 45, 42, 19, p.top);
    px(ctx, 11, 56, 42, 8, p.topShade);
    px(ctx, 25, 45, 14, 19, p.accent);
    px(ctx, 26, 38, 12, 9, p.skinShade);

    if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
      px(ctx, 11, 15, 42, 38, OUT);
      px(ctx, 13, 17, 38, 35, p.hair);
    }

    // Head with rounded chin
    px(ctx, 17, 13, 30, 27, OUT);
    px(ctx, 19, 15, 26, 23, p.skin);
    px(ctx, 21, 38, 22, 3, p.skinShade);
    px(ctx, 16, 22, 3, 8, p.skinShade);
    px(ctx, 45, 22, 3, 8, p.skinShade);

    if (p.hairStyle === "hood") {
      px(ctx, 10, 6, 44, 38, p.top);
      px(ctx, 16, 14, 32, 26, "#09090b");
    } else {
      px(ctx, 15, 8, 34, 12, p.hair);
      px(ctx, 20, 10, 18, 4, p.hairHi);
      px(ctx, 14, 14, 6, 16, p.hair);
      px(ctx, 44, 14, 6, 16, p.hair);
      if (p.hairStyle === "spiky") {
        px(ctx, 18, 3, 6, 7, p.hair); px(ctx, 28, 1, 8, 9, p.hair); px(ctx, 40, 4, 6, 7, p.hair);
      } else if (p.hairStyle === "curly") {
        px(ctx, 13, 10, 38, 10, p.hair); px(ctx, 13, 18, 6, 14, p.hair); px(ctx, 45, 18, 6, 14, p.hair);
      } else if (p.hairStyle === "bun") {
        px(ctx, 24, 2, 16, 8, p.hair);
      }
    }

    const eyeY = 24;
    px(ctx, 21, eyeY, 7, 6, "#ffffff"); px(ctx, 36, eyeY, 7, 6, "#ffffff");
    px(ctx, 23, eyeY + 1, 4, 5, p.eyes); px(ctx, 38, eyeY + 1, 4, 5, p.eyes);
    px(ctx, 24, eyeY + 2, 2, 2, "#09090b"); px(ctx, 39, eyeY + 2, 2, 2, "#09090b");
    px(ctx, 23, eyeY + 1, 1, 1, "#ffffff"); px(ctx, 38, eyeY + 1, 1, 1, "#ffffff");

    if (mood === "angry" || mood === "intense") {
      px(ctx, 20, 21, 8, 2, p.hair); px(ctx, 25, 22, 4, 2, p.hair);
      px(ctx, 36, 21, 8, 2, p.hair); px(ctx, 35, 22, 4, 2, p.hair);
      px(ctx, 27, 34, 10, 3, "#7f1d1d");
    } else if (mood === "sad") {
      px(ctx, 20, 22, 8, 2, p.hair); px(ctx, 36, 22, 8, 2, p.hair);
      px(ctx, 28, 35, 8, 2, "#9a5b48"); px(ctx, 22, 31, 2, 4, "#38bdf8");
    } else if (mood === "happy" || mood === "blush") {
      px(ctx, 20, 20, 8, 2, p.hair); px(ctx, 36, 20, 8, 2, p.hair);
      px(ctx, 27, 33, 10, 3, "#b91c1c"); px(ctx, 28, 33, 8, 1, "#ffffff");
      if (mood === "blush") { px(ctx, 19, 30, 5, 2, "#f472b6"); px(ctx, 40, 30, 5, 2, "#f472b6"); }
    } else {
      px(ctx, 20, 21, 8, 2, p.hair); px(ctx, 36, 21, 8, 2, p.hair);
      px(ctx, 28, 34, 8, 2, "#8c4a38");
    }
  }

  // ---------------------------------------------------------
  // 3. DETAILED FULL-BODY BATTLE MODEL (Outlined & Proportioned)
  // ---------------------------------------------------------
  function drawBattleModel(ctx, id, cx, cy, flip = false, animTime = 0, lunge = 0, hitFlash = false) {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    const breath = Math.sin(animTime * 0.005) * 1.8;
    const wingFlap = Math.sin(animTime * 0.009) * 4.5;

    ctx.save();
    ctx.translate(cx + (flip ? -lunge : lunge), cy + breath);
    if (flip) ctx.scale(-1, 1);
    if (hitFlash) ctx.filter = "brightness(2.5) saturate(0.2)";

    // Boss Serpent: Envy
    if (p.weapon === "serpent") {
      ctx.fillStyle = "rgba(16, 185, 129, 0.25)";
      ctx.beginPath(); ctx.ellipse(0, 30, 36, 9, 0, 0, Math.PI * 2); ctx.fill();
      px(ctx, -34, 13, 68, 16, OUT); px(ctx, -32, 15, 64, 12, "#065f46"); px(ctx, -26, 18, 52, 6, "#10b981");
      px(ctx, -24, 0, 48, 16, OUT); px(ctx, -22, 2, 44, 12, "#047857"); px(ctx, -16, 5, 32, 6, "#34d399");
      px(ctx, -20, -28, 40, 30, OUT); px(ctx, -18, -26, 36, 26, "#064e3b");
      px(ctx, -13, -23, 26, 22, "#581c87"); px(ctx, -9, -19, 18, 18, "#10b981");
      px(ctx, -16, -42, 32, 18, OUT); px(ctx, -14, -40, 28, 14, "#065f46"); px(ctx, -10, -37, 20, 8, "#10b981");
      px(ctx, -10, -35, 6, 4, "#fde047"); px(ctx, 4, -35, 6, 4, "#fde047");
      px(ctx, -8, -26, 3, 7, "#ffffff"); px(ctx, 5, -26, 3, 7, "#ffffff");
      const drip = (animTime * 0.03) % 14;
      px(ctx, -7, -18 + drip, 2, 5, "#a855f7");
      ctx.restore();
      return;
    }

    if (p.aura) {
      ctx.fillStyle = p.aura + "33";
      ctx.beginPath(); ctx.ellipse(0, 30, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Feathered / Stylized Wings
    if (p.wings && p.wings !== "float") {
      const leftCol = p.wings === "angel" ? "#f8fafc" : (p.wings === "demon" ? "#7f1d1d" : "#111827");
      const rightCol = p.wings === "corrupted" ? "#991b1b" : leftCol;
      const trim = p.wings === "angel" ? "#f5c542" : (p.wings === "demon" ? "#ef4444" : "#475569");
      ctx.fillStyle = leftCol;
      ctx.beginPath();
      ctx.moveTo(-6, -6); ctx.lineTo(-38, -22 + wingFlap); ctx.lineTo(-30, 3 + wingFlap * 0.5); ctx.lineTo(-7, 9);
      ctx.closePath(); ctx.fill(); ctx.strokeStyle = trim; ctx.lineWidth = 1.5; ctx.stroke();

      ctx.fillStyle = rightCol;
      ctx.beginPath();
      ctx.moveTo(6, -6); ctx.lineTo(38, -22 + wingFlap); ctx.lineTo(30, 3 + wingFlap * 0.5); ctx.lineTo(7, 9);
      ctx.closePath(); ctx.fill(); ctx.stroke();
      if (p.wings === "corrupted") px(ctx, 18, -12 + wingFlap * 0.6, 5, 4, "#38bdf8");
    }

    // Outlined Legs & Boots (Combat stance)
    px(ctx, -11, 11, 9, 19, OUT); px(ctx, -10, 12, 7, 13, p.pants); px(ctx, -11, 24, 8, 5, p.shoes);
    px(ctx, 2, 11, 9, 19, OUT);   px(ctx, 3, 12, 7, 13, p.pants);   px(ctx, 3, 24, 8, 5, p.shoes);

    // Outlined Torso, Collar & Belt
    px(ctx, -12, -10, 24, 23, OUT);
    px(ctx, -10, -8, 20, 19, p.top);
    px(ctx, -10, 6, 20, 5, p.topShade);
    px(ctx, -4, -8, 8, 16, p.accent);
    px(ctx, -10, 10, 20, 2, "#0f172a"); // belt
    px(ctx, -2, 10, 4, 2, "#f5c542");   // buckle
    if (id === "navi" || id === "crepsus") {
      px(ctx, -15, -11, 6, 6, p.accent); px(ctx, 9, -11, 6, 6, p.accent);
    }

    // Outlined Arms & Hands
    px(ctx, -17, -8, 6, 17, OUT); px(ctx, -16, -7, 4, 11, p.topShade); px(ctx, -16, 4, 4, 4, p.skin);
    px(ctx, 11, -8, 6, 17, OUT);  px(ctx, 12, -7, 4, 11, p.topShade);  px(ctx, 12, 4, 4, 4, p.skin);

    // Neck + Rounded Head
    px(ctx, -3, -13, 6, 5, p.skinShade);
    px(ctx, -10, -29, 20, 18, OUT);
    px(ctx, -8, -27, 16, 14, p.skin);
    px(ctx, -7, -14, 14, 2, p.skinShade);

    if (p.hairStyle === "hood") {
      px(ctx, -13, -33, 26, 23, OUT); px(ctx, -11, -31, 22, 19, p.top); px(ctx, -8, -25, 16, 13, "#09090b");
    } else {
      px(ctx, -11, -33, 22, 9, OUT);
      px(ctx, -10, -32, 20, 7, p.hair);
      px(ctx, -6, -30, 10, 2, p.hairHi);
      if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
        px(ctx, -12, -28, 4, 20, p.hair); px(ctx, 8, -28, 4, 20, p.hair);
      } else if (p.hairStyle === "spiky") {
        px(ctx, -9, -37, 4, 5, p.hair); px(ctx, -2, -39, 5, 7, p.hair); px(ctx, 6, -36, 4, 5, p.hair);
      } else if (p.hairStyle === "curly") {
        px(ctx, -12, -31, 24, 8, p.hair); px(ctx, -12, -25, 4, 10, p.hair); px(ctx, 8, -25, 4, 10, p.hair);
      }
    }

    // Expressive Eyes with sclera
    px(ctx, -6, -21, 4, 4, "#ffffff"); px(ctx, -5, -20, 3, 3, p.eyes);
    px(ctx, 2, -21, 4, 4, "#ffffff");  px(ctx, 3, -20, 3, 3, p.eyes);

    // Signature Weapons
    if (p.weapon === "halberd") {
      px(ctx, 16, -34, 3, 58, "#f59e0b"); px(ctx, 12, -36, 13, 11, "#38bdf8"); px(ctx, 18, -40, 5, 5, "#e0f2fe");
    } else if (p.weapon === "rapier") {
      px(ctx, 15, -22, 3, 32, "#c084fc"); px(ctx, 11, 5, 11, 3, "#fbbf24");
    } else if (p.weapon === "mallet") {
      px(ctx, 15, -18, 4, 30, "#6366f1"); px(ctx, 7, -30, 19, 13, "#1e1b4b"); px(ctx, 9, -28, 15, 3, "#facc15");
    } else if (p.weapon === "whip") {
      ctx.strokeStyle = "#f97316"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(15, 5); ctx.bezierCurveTo(32, -6, 24, -24, 38, -28 + wingFlap * 0.5); ctx.stroke();
    } else if (p.weapon === "rake") {
      px(ctx, 16, -32, 4, 60, "#78350f"); px(ctx, 8, -34, 19, 4, "#dc2626");
      px(ctx, 8, -42, 3, 9, "#fca5a5"); px(ctx, 16, -42, 3, 9, "#fca5a5"); px(ctx, 24, -42, 3, 9, "#fca5a5");
    } else if (p.weapon === "scythe") {
      px(ctx, 16, -36, 4, 64, "#4c1d95");
      ctx.fillStyle = "#e2e8f0"; ctx.beginPath();
      ctx.moveTo(18, -36); ctx.quadraticCurveTo(-10, -44, -14, -20); ctx.quadraticCurveTo(0, -28, 18, -26); ctx.fill();
    } else if (p.weapon === "sickle") {
      px(ctx, 15, -8, 3, 17, "#db2777");
      ctx.strokeStyle = "#f8fafc"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(15, -10, 9, Math.PI * 0.9, Math.PI * 2.1); ctx.stroke();
    } else if (p.weapon === "ring") {
      ctx.strokeStyle = "#facc15"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(15, 7, 6 + Math.sin(animTime * 0.01) * 2, 0, Math.PI * 2); ctx.stroke();
    } else if (p.weapon === "claws") {
      px(ctx, 13, 9, 9, 3, "#ef4444"); px(ctx, 15, 13, 9, 3, "#ef4444");
    } else if (p.weapon === "axe") {
      px(ctx, 16, -32, 4, 56, "#cbd5e1"); px(ctx, 8, -30, 20, 13, "#10b981");
    }

    ctx.restore();
  }

  return { drawOverworld, drawPortrait, drawBattleModel };
})();
