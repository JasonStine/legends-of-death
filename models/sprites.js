// =========================================================
// models/sprites.js — v9: Organic Human-Proportioned Sprites
//                     & 96x96 Book-Accurate Illustrated Portraits
// =========================================================
window.Sprites = (() => {
  const OUT = "#141624";

  function px(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  }

  function pill(ctx, x, y, w, h, r, fill, stroke = null, lw = 1) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
  }

  // ---------------------------------------------------------
  // 1. OVERWORLD 24x32 ORGANIC HUMAN SPRITE (Non-Blocky!)
  // ---------------------------------------------------------
  function drawOverworld(ctx, id, x, y, dir = "down", frame = 0, purgatorio = false, activity = null, time = 0) {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    const step = frame % 4;
    const danceBob = activity === "dance" ? Math.round(Math.sin(time * 0.014 + x) * 1.8) : 0;
    const bob = ((step === 1 || step === 3) ? -1 : 0) + danceBob;
    const leftLegY = step === 1 ? -2 : (step === 3 ? 1 : 0);
    const rightLegY = step === 3 ? -2 : (step === 1 ? 1 : 0);
    const armSwing = step === 1 ? 2 : (step === 3 ? -2 : 0);

    // Special: Crista the Platinum Cat (curved organic feline)
    if (p.hairStyle === "cat") {
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.beginPath(); ctx.ellipse(x + 12, y + 27, 7, 2.8, 0, 0, Math.PI * 2); ctx.fill();
      pill(ctx, x + 6, y + 18 + bob, 11, 8, 4, p.top, OUT, 1);
      // Curved tail
      ctx.strokeStyle = OUT; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x + 16, y + 21 + bob); ctx.quadraticCurveTo(x + 21, y + 17 + bob, x + 18, y + 13 + bob); ctx.stroke();
      ctx.strokeStyle = p.skinShade; ctx.lineWidth = 1.6; ctx.stroke();
      // Cat head & ears
      ctx.beginPath(); ctx.arc(x + 11, y + 15 + bob, 5, 0, Math.PI * 2);
      ctx.fillStyle = p.hair; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = p.hair;
      ctx.beginPath(); ctx.moveTo(x + 7, y + 13 + bob); ctx.lineTo(x + 7, y + 8 + bob); ctx.lineTo(x + 10, y + 11 + bob); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 15, y + 13 + bob); ctx.lineTo(x + 15, y + 8 + bob); ctx.lineTo(x + 12, y + 11 + bob); ctx.fill();
      px(ctx, x + 9, y + 14 + bob, 1.8, 1.8, p.eyes);
      px(ctx, x + 12.5, y + 14 + bob, 1.8, 1.8, p.eyes);
      return;
    }

    // Soft Ground Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.32)";
    ctx.beginPath(); ctx.ellipse(x + 12, y + 29, 6.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();

    // Purgatorio Wings behind character
    if (purgatorio && p.wings && p.wings !== "float") {
      const wCol = p.wings === "angel" ? "#f8fafc" : (p.wings === "corrupted" ? "#7f1d1d" : "#111827");
      const flap = Math.sin(time * 0.008) * 2;
      ctx.fillStyle = wCol; ctx.strokeStyle = OUT; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + 8, y + 14 + bob); ctx.lineTo(x - 4, y + 8 + bob + flap); ctx.lineTo(x - 1, y + 18 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = p.wings === "corrupted" ? "#dc2626" : wCol;
      ctx.beginPath(); ctx.moveTo(x + 16, y + 14 + bob); ctx.lineTo(x + 28, y + 8 + bob + flap); ctx.lineTo(x + 25, y + 18 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
    }

    // Back Long Hair Layer (flowing silhouette)
    if ((p.hairStyle === "long" || p.hairStyle === "wavy_long") && dir !== "up") {
      pill(ctx, x + 5.5, y + 5 + bob, 13, 13, 5, p.hair, OUT, 1);
    }

    // LEGS & SHOES (Rounded organic legs with stride)
    if (dir === "left" || dir === "right") {
      const stride = step === 1 ? 2.8 : (step === 3 ? -2.8 : 0);
      pill(ctx, x + 9.5 - stride, y + 20, 4.5, 7, 2, p.pants, OUT, 1);
      pill(ctx, x + 9 - stride, y + 25.5, 5.5, 3, 1.5, p.shoes, OUT, 1);
      pill(ctx, x + 10.5 + stride, y + 20, 4.5, 7, 2, p.pants, OUT, 1);
      pill(ctx, x + 10 + stride, y + 25.5, 5.5, 3, 1.5, p.shoes, OUT, 1);
    } else {
      pill(ctx, x + 7, y + 20 + leftLegY, 4.5, 7, 2, p.pants, OUT, 1);
      pill(ctx, x + 6.8, y + 25.5 + leftLegY, 5, 3, 1.5, p.shoes, OUT, 1);
      pill(ctx, x + 12.5, y + 20 + rightLegY, 4.5, 7, 2, p.pants, OUT, 1);
      pill(ctx, x + 12.2, y + 25.5 + rightLegY, 5, 3, 1.5, p.shoes, OUT, 1);
    }

    // CONTOURED TORSO / JACKET (Rounded shoulders + tapered waist)
    pill(ctx, x + 6.5, y + 12.5 + bob, 11, 9.5, 3.5, p.top, OUT, 1);
    pill(ctx, x + 7.2, y + 18 + bob, 9.6, 3.2, 1.5, p.topShade);
    if (dir === "down") {
      px(ctx, x + 10.5, y + 13.5 + bob, 3, 6, p.accent); // V-neck shirt / lapel
    }

    // ARMS & HANDS (Rounded sleeves + skin hands)
    if (dir === "down" || dir === "up") {
      pill(ctx, x + 4.2, y + 13.5 + bob + armSwing, 3.2, 6.5, 1.6, p.topShade, OUT, 0.9);
      ctx.fillStyle = p.skin; ctx.beginPath(); ctx.arc(x + 5.8, y + 19.5 + bob + armSwing, 1.4, 0, Math.PI * 2); ctx.fill();

      pill(ctx, x + 16.6, y + 13.5 + bob - armSwing, 3.2, 6.5, 1.6, p.topShade, OUT, 0.9);
      ctx.fillStyle = p.skin; ctx.beginPath(); ctx.arc(x + 18.2, y + 19.5 + bob - armSwing, 1.4, 0, Math.PI * 2); ctx.fill();
    } else {
      pill(ctx, x + 10 + armSwing, y + 13.5 + bob, 3.6, 6.5, 1.8, p.topShade, OUT, 0.9);
      ctx.fillStyle = p.skin; ctx.beginPath(); ctx.arc(x + 11.8 + armSwing, y + 19.5 + bob, 1.5, 0, Math.PI * 2); ctx.fill();
    }

    // NECK
    px(ctx, x + 10.5, y + 10.5 + bob, 3, 3, p.skinShade);

    // HEAD (Smooth organic oval head — NOT a square!)
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 7 + bob, 5.4, 5.6, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.skin; ctx.fill();
    ctx.strokeStyle = OUT; ctx.lineWidth = 1; ctx.stroke();

    // HAIR / HOOD (Layered rounded crown & natural bangs)
    if (p.hairStyle === "hood") {
      ctx.beginPath(); ctx.ellipse(x + 12, y + 6.5 + bob, 6.4, 6.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.top; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(x + 12, y + 7.5 + bob, 4.2, 4.1, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#09090b"; ctx.fill();
    } else {
      ctx.fillStyle = p.hair; ctx.strokeStyle = OUT; ctx.lineWidth = 0.9;
      ctx.beginPath();
      ctx.arc(x + 12, y + 5.5 + bob, 5.8, Math.PI * 0.95, Math.PI * 2.05);
      ctx.quadraticCurveTo(x + 18, y + 8 + bob, x + 16.5, y + 9 + bob);
      ctx.quadraticCurveTo(x + 12, y + 5.2 + bob, x + 7.5, y + 9 + bob);
      ctx.quadraticCurveTo(x + 6, y + 8 + bob, x + 6.2, y + 5.5 + bob);
      ctx.fill(); ctx.stroke();

      // Hair highlight sheen
      ctx.fillStyle = p.hairHi;
      ctx.beginPath(); ctx.ellipse(x + 11, y + 3.2 + bob, 2.5, 1, -0.2, 0, Math.PI * 2); ctx.fill();

      if (p.hairStyle === "spiky") {
        ctx.fillStyle = p.hair;
        ctx.beginPath(); ctx.moveTo(x + 8, y + 2 + bob); ctx.lineTo(x + 10, y - 2 + bob); ctx.lineTo(x + 12, y + 1 + bob); ctx.fill();
        ctx.beginPath(); ctx.moveTo(x + 11, y + 1 + bob); ctx.lineTo(x + 14, y - 2.5 + bob); ctx.lineTo(x + 16, y + 2 + bob); ctx.fill();
      } else if (p.hairStyle === "bun") {
        ctx.beginPath(); ctx.arc(x + 12, y + 0.5 + bob, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = p.hair; ctx.fill(); ctx.stroke();
      } else if (p.hairStyle === "curly") {
        ctx.fillStyle = p.hair;
        [[7, 5], [9.5, 2], [12, 1.2], [14.5, 2], [17, 5]].forEach(([cx0, cy0]) => {
          ctx.beginPath(); ctx.arc(x + cx0, y + cy0 + bob, 2.2, 0, Math.PI * 2); ctx.fill();
        });
      }
      if (dir === "up") {
        ctx.beginPath(); ctx.ellipse(x + 12, y + 7 + bob, 5.7, 5.8, 0, 0, Math.PI * 2);
        ctx.fillStyle = p.hair; ctx.fill(); ctx.stroke();
      }
    }

    // EXPRESSIVE EYES
    if (dir === "down") {
      px(ctx, x + 8.8, y + 6.6 + bob, 2.2, 2.2, "#ffffff");
      px(ctx, x + 9.4, y + 7.1 + bob, 1.5, 1.7, p.eyes);
      px(ctx, x + 13, y + 6.6 + bob, 2.2, 2.2, "#ffffff");
      px(ctx, x + 13.1, y + 7.1 + bob, 1.5, 1.7, p.eyes);
    } else if (dir === "left") {
      px(ctx, x + 7.6, y + 6.8 + bob, 1.8, 2.2, p.eyes);
    } else if (dir === "right") {
      px(ctx, x + 14.6, y + 6.8 + bob, 1.8, 2.2, p.eyes);
    }

    // Ambient life visual cue
    if (activity === "cook" && Math.floor(time / 850) % 2 === 0) {
      const drift = (time * 0.015) % 8;
      ctx.fillStyle = "rgba(255,255,255,0.72)";
      ctx.beginPath(); ctx.arc(x + 11, y - 4 - drift, 1.8, 0, Math.PI * 2); ctx.fill();
    } else if (activity === "vape" && Math.floor(time / 1200) % 3 === 0) {
      const drift = (time * 0.012) % 9;
      ctx.fillStyle = "rgba(244,114,182,0.55)";
      ctx.beginPath(); ctx.arc(x + 13, y - 3 - drift, 2.2, 0, Math.PI * 2); ctx.fill();
    } else if (activity === "dance" && Math.floor(time / 500) % 2 === 0) {
      ctx.fillStyle = "#38bdf8"; ctx.font = "bold 8px monospace"; ctx.fillText("♪", x + 16, y - 2);
    }
  }

  // ---------------------------------------------------------
  // 2. 96x96 BOOK-ACCURATE ILLUSTRATED DIALOGUE PORTRAIT!
  // ---------------------------------------------------------
  function drawPortrait(ctx, id, mood = "neutral") {
    const p = window.PALETTES[id] || window.PALETTES.jacob;
    const W = ctx.canvas.width || 96;
    const H = ctx.canvas.height || 96;
    ctx.save();
    ctx.clearRect(0, 0, W, H);
    ctx.scale(W / 96, H / 96);

    // Rich atmospheric backdrop with character aura
    const bg = ctx.createRadialGradient(48, 40, 8, 48, 48, 56);
    bg.addColorStop(0, p.aura ? p.aura + "55" : "#47556966");
    bg.addColorStop(1, "#0d1122");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 96, 96);

    // Special: Signpost portrait
    if (p.hairStyle === "sign") {
      pill(ctx, 43, 54, 10, 36, 2, "#78350f", OUT, 2);
      pill(ctx, 14, 20, 68, 38, 5, "#92400e", OUT, 2);
      pill(ctx, 19, 25, 58, 28, 3, "#fef3c7");
      px(ctx, 26, 33, 44, 4, "#78350f");
      px(ctx, 26, 42, 32, 4, "#78350f");
      ctx.restore();
      return;
    }

    // Special: Crista the Platinum Cat (Detailed Feline Portrait)
    if (p.hairStyle === "cat") {
      // Ears
      ctx.fillStyle = "#ffffff"; ctx.strokeStyle = OUT; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(24, 44); ctx.lineTo(22, 18); ctx.lineTo(40, 32); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(72, 44); ctx.lineTo(74, 18); ctx.lineTo(56, 32); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fda4af";
      ctx.beginPath(); ctx.moveTo(26, 40); ctx.lineTo(25, 25); ctx.lineTo(36, 34); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(70, 40); ctx.lineTo(71, 25); ctx.lineTo(60, 34); ctx.closePath(); ctx.fill();
      // Face
      ctx.beginPath(); ctx.ellipse(48, 54, 24, 21, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#f8fafc"; ctx.fill(); ctx.stroke();
      // Piercing ice-blue eyes
      [37, 59].forEach(ex => {
        ctx.beginPath(); ctx.ellipse(ex, 52, 5.5, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#38bdf8"; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.fillStyle = "#09090b"; ctx.beginPath(); ctx.ellipse(ex, 52, 2, 4.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex - 2, 49.5, 1.5, 0, Math.PI * 2); ctx.fill();
      });
      // Pink nose & whiskers
      ctx.fillStyle = "#f472b6"; ctx.beginPath(); ctx.moveTo(45, 60); ctx.lineTo(51, 60); ctx.lineTo(48, 63); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#94a3b8"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(20, 58); ctx.lineTo(34, 60); ctx.moveTo(20, 64); ctx.lineTo(34, 63);
      ctx.moveTo(76, 58); ctx.lineTo(62, 60); ctx.moveTo(76, 64); ctx.lineTo(62, 63); ctx.stroke();
      ctx.restore();
      return;
    }

    // Back Long Hair Layer (Cyrine, Navi, Emillia, Envy, Lucia)
    if (p.hairStyle === "long" || p.hairStyle === "wavy_long") {
      ctx.fillStyle = p.hair; ctx.strokeStyle = OUT; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(22, 34);
      ctx.quadraticCurveTo(14, 62, 18, 94);
      ctx.lineTo(78, 94);
      ctx.quadraticCurveTo(82, 62, 74, 34);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
    }

    // Contoured Shoulders & Jacket / Collar
    ctx.fillStyle = p.top; ctx.strokeStyle = OUT; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(12, 96);
    ctx.quadraticCurveTo(14, 70, 34, 67);
    ctx.lineTo(62, 67);
    ctx.quadraticCurveTo(82, 70, 84, 96);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Inner Shirt / Collar / Armor Accents
    ctx.fillStyle = p.accent;
    ctx.beginPath(); ctx.moveTo(38, 68); ctx.lineTo(48, 86); ctx.lineTo(58, 68); ctx.closePath(); ctx.fill();
    if (id === "navi" || id === "crepsus") {
      // Gold / Crimson Shoulder Armor
      pill(ctx, 16, 69, 14, 10, 4, p.accent, OUT, 1.5);
      pill(ctx, 66, 69, 14, 10, 4, p.accent, OUT, 1.5);
    }

    // Neck with soft chin shadow
    pill(ctx, 41, 56, 14, 16, 4, p.skin, OUT, 1.5);
    ctx.fillStyle = p.skinShade;
    ctx.beginPath(); ctx.ellipse(48, 60, 7, 4, 0, 0, Math.PI * 2); ctx.fill();

    // Ears
    ctx.fillStyle = p.skin; ctx.strokeStyle = OUT; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.ellipse(27, 44, 3.8, 6, -0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(69, 44, 3.8, 6, 0.1, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

    // Book-accurate Letonin silver hoop earring!
    if (id === "letonin") {
      ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(26, 51, 3.2, 0, Math.PI * 2); ctx.stroke();
    }

    // Contoured Anime/32-Bit Face & Tapered Chin
    ctx.fillStyle = p.skin; ctx.strokeStyle = OUT; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(28, 32);
    ctx.quadraticCurveTo(27, 50, 35, 58);
    ctx.quadraticCurveTo(48, 65, 61, 58);
    ctx.quadraticCurveTo(69, 50, 68, 32);
    ctx.quadraticCurveTo(68, 17, 48, 17);
    ctx.quadraticCurveTo(28, 17, 28, 32);
    ctx.closePath();
    ctx.fill(); ctx.stroke();

    // Subtle cheek blush / shading
    if (mood === "blush" || mood === "happy") {
      ctx.fillStyle = "rgba(244, 114, 182, 0.35)";
      ctx.beginPath(); ctx.ellipse(34, 48, 5, 2.6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(62, 48, 5, 2.6, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Book-accurate subtle scar above Cyrine's left eye (Ch. VIII)
    if (id === "cyrine") {
      ctx.strokeStyle = "#c084fc"; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(57, 31); ctx.lineTo(61, 34); ctx.stroke();
    }

    // Expressive Detailed Eyes (Sclera + Colored Iris + Pupil + Specular Shine + Lashes)
    const drawEye = (ex, flip) => {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.ellipse(ex, 42, 6, 4.8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = p.eyes;
      ctx.beginPath(); ctx.arc(ex + (flip ? -0.5 : 0.5), 42.3, 3.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#09090b";
      ctx.beginPath(); ctx.arc(ex + (flip ? -0.5 : 0.5), 42.5, 1.8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ffffff";
      ctx.beginPath(); ctx.arc(ex - 1.6, 40.5, 1.3, 0, Math.PI * 2); ctx.fill();
      // Upper lash line
      ctx.strokeStyle = OUT; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(ex, 42.5, 6.2, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke();
    };
    drawEye(37.5, false);
    drawEye(58.5, true);

    // Subtle Nose Bridge
    ctx.strokeStyle = p.skinShade; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(48, 44); ctx.lineTo(47, 49); ctx.lineTo(49.5, 49.5); ctx.stroke();

    // Mood-Driven Eyebrows & Mouth
    ctx.strokeStyle = p.hairStyle === "hood" ? "#451a03" : p.hair;
    ctx.lineWidth = 2.2; ctx.lineCap = "round";
    if (mood === "angry" || mood === "intense") {
      ctx.beginPath(); ctx.moveTo(31, 33); ctx.lineTo(43, 36); ctx.moveTo(65, 33); ctx.lineTo(53, 36); ctx.stroke();
      ctx.fillStyle = "#7f1d1d"; ctx.beginPath(); ctx.ellipse(48, 55, 5.5, 2.5, 0, 0, Math.PI * 2); ctx.fill();
    } else if (mood === "sad") {
      ctx.beginPath(); ctx.moveTo(31, 36); ctx.lineTo(43, 33.5); ctx.moveTo(65, 36); ctx.lineTo(53, 33.5); ctx.stroke();
      ctx.strokeStyle = "#8c4a38"; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.arc(48, 58, 5, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke();
      // Tear drop
      ctx.fillStyle = "#38bdf8"; ctx.beginPath(); ctx.arc(34, 48, 1.8, 0, Math.PI * 2); ctx.fill();
    } else if (mood === "happy" || mood === "blush") {
      ctx.beginPath(); ctx.moveTo(31, 34); ctx.lineTo(43, 33); ctx.moveTo(65, 34); ctx.lineTo(53, 33); ctx.stroke();
      ctx.fillStyle = "#b91c1c";
      ctx.beginPath(); ctx.arc(48, 53.5, 5.5, 0.1, Math.PI - 0.1); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ffffff"; px(ctx, 44, 53.5, 8, 1.8, "#ffffff");
    } else {
      ctx.beginPath(); ctx.moveTo(31, 34.5); ctx.lineTo(43, 34.5); ctx.moveTo(65, 34.5); ctx.lineTo(53, 34.5); ctx.stroke();
      ctx.strokeStyle = "#8c4a38"; ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(43, 55); ctx.quadraticCurveTo(48, 56.5, 53, 55); ctx.stroke();
    }

    // Front Hair / Hood (Detailed Bangs & Layered Strands)
    if (p.hairStyle === "hood") {
      // Lord Death's Black Hoodie + Wavy Brown Hair Peeking Out!
      ctx.fillStyle = p.top; ctx.strokeStyle = OUT; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(18, 72);
      ctx.quadraticCurveTo(14, 14, 48, 10);
      ctx.quadraticCurveTo(82, 14, 78, 72);
      ctx.lineTo(68, 66);
      ctx.quadraticCurveTo(72, 24, 48, 22);
      ctx.quadraticCurveTo(24, 24, 28, 66);
      ctx.closePath();
      ctx.fill(); ctx.stroke();
      // Wavy brown hair tuft under hood
      ctx.fillStyle = p.hair;
      ctx.beginPath(); ctx.moveTo(32, 28); ctx.quadraticCurveTo(44, 34, 48, 25); ctx.quadraticCurveTo(56, 33, 64, 28);
      ctx.quadraticCurveTo(48, 18, 32, 28); ctx.fill();
    } else {
      ctx.fillStyle = p.hair; ctx.strokeStyle = OUT; ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(24, 42);
      ctx.quadraticCurveTo(21, 14, 48, 12);
      ctx.quadraticCurveTo(75, 14, 72, 42);
      ctx.lineTo(67, 46);
      ctx.quadraticCurveTo(66, 30, 58, 30);
      ctx.lineTo(53, 35);
      ctx.lineTo(48, 28);
      ctx.lineTo(41, 36);
      ctx.lineTo(36, 29);
      ctx.quadraticCurveTo(29, 31, 29, 46);
      ctx.closePath();
      ctx.fill(); ctx.stroke();

      // Glossy anime hair highlight arc
      ctx.strokeStyle = p.hairHi; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(48, 26, 14, Math.PI * 1.18, Math.PI * 1.72); ctx.stroke();

      if (p.hairStyle === "spiky") {
        ctx.fillStyle = p.hair; ctx.strokeStyle = OUT; ctx.lineWidth = 1.6;
        [[30,18,36,5,42,15],[42,14,50,3,56,14],[56,15,65,6,68,20]].forEach(([x1,y1,x2,y2,x3,y3]) => {
          ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.closePath(); ctx.fill(); ctx.stroke();
        });
      } else if (p.hairStyle === "curly") {
        ctx.fillStyle = p.hair;
        [[26,30],[31,20],[40,14],[50,13],[60,15],[67,22],[70,32]].forEach(([cx0,cy0]) => {
          ctx.beginPath(); ctx.arc(cx0, cy0, 6.5, 0, Math.PI * 2); ctx.fill();
        });
      } else if (p.hairStyle === "bun") {
        ctx.beginPath(); ctx.arc(48, 10, 9, 0, Math.PI * 2);
        ctx.fillStyle = p.hair; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.8; ctx.stroke();
      }
    }

    ctx.restore();
  }

  // ---------------------------------------------------------
  // 3. ORGANIC FULL-BODY BATTLE CHARACTER MODEL
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
      pill(ctx, -33, 14, 66, 14, 7, "#065f46", OUT, 2);
      pill(ctx, -23, 1, 46, 14, 7, "#047857", OUT, 2);
      pill(ctx, -19, -27, 38, 28, 12, "#064e3b", OUT, 2);
      pill(ctx, -12, -23, 24, 21, 8, "#581c87");
      pill(ctx, -15, -41, 30, 17, 8, "#065f46", OUT, 2);
      px(ctx, -10, -35, 6, 4, "#fde047"); px(ctx, 4, -35, 6, 4, "#fde047");
      px(ctx, -8, -26, 3, 7, "#ffffff"); px(ctx, 5, -26, 3, 7, "#ffffff");
      ctx.restore();
      return;
    }

    if (p.aura) {
      ctx.fillStyle = p.aura + "33";
      ctx.beginPath(); ctx.ellipse(0, 30, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
    }

    // Feathered Wings
    if (p.wings && p.wings !== "float") {
      const leftCol = p.wings === "angel" ? "#f8fafc" : (p.wings === "demon" ? "#7f1d1d" : "#111827");
      const rightCol = p.wings === "corrupted" ? "#991b1b" : leftCol;
      const trim = p.wings === "angel" ? "#f5c542" : (p.wings === "demon" ? "#ef4444" : "#475569");
      ctx.fillStyle = leftCol; ctx.strokeStyle = trim; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(-6, -6); ctx.lineTo(-38, -22 + wingFlap); ctx.lineTo(-30, 3 + wingFlap * 0.5); ctx.lineTo(-7, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = rightCol;
      ctx.beginPath(); ctx.moveTo(6, -6); ctx.lineTo(38, -22 + wingFlap); ctx.lineTo(30, 3 + wingFlap * 0.5); ctx.lineTo(7, 9); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (p.wings === "corrupted") px(ctx, 18, -12 + wingFlap * 0.6, 5, 4, "#38bdf8");
    }

    // Organic Legs & Boots
    pill(ctx, -10.5, 11, 8, 17, 3.5, p.pants, OUT, 1.5);
    pill(ctx, -11.5, 24, 9, 5.5, 2.5, p.shoes, OUT, 1.5);
    pill(ctx, 2.5, 11, 8, 17, 3.5, p.pants, OUT, 1.5);
    pill(ctx, 2.5, 24, 9, 5.5, 2.5, p.shoes, OUT, 1.5);

    // Contoured Torso & Coat
    pill(ctx, -11, -9, 22, 22, 6, p.top, OUT, 1.8);
    pill(ctx, -9.5, 5, 19, 6, 2, p.topShade);
    px(ctx, -4, -8, 8, 15, p.accent);
    px(ctx, -9, 10, 18, 2, "#0f172a");
    px(ctx, -2, 10, 4, 2, "#f5c542");

    // Organic Arms & Hands
    pill(ctx, -16, -7, 5.5, 14, 2.8, p.topShade, OUT, 1.4);
    ctx.fillStyle = p.skin; ctx.beginPath(); ctx.arc(-13.2, 7.5, 2.5, 0, Math.PI * 2); ctx.fill();
    pill(ctx, 10.5, -7, 5.5, 14, 2.8, p.topShade, OUT, 1.4);
    ctx.fillStyle = p.skin; ctx.beginPath(); ctx.arc(13.2, 7.5, 2.5, 0, Math.PI * 2); ctx.fill();

    // Neck & Smooth Oval Head
    px(ctx, -3, -13, 6, 5, p.skinShade);
    ctx.beginPath(); ctx.ellipse(0, -21, 9.2, 9.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = p.skin; ctx.fill(); ctx.strokeStyle = OUT; ctx.lineWidth = 1.6; ctx.stroke();

    if (p.hairStyle === "hood") {
      ctx.beginPath(); ctx.ellipse(0, -21.5, 11.5, 11, 0, 0, Math.PI * 2);
      ctx.fillStyle = p.top; ctx.fill(); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, -20.5, 7.5, 7.2, 0, 0, Math.PI * 2);
      ctx.fillStyle = "#09090b"; ctx.fill();
    } else {
      ctx.fillStyle = p.hair; ctx.strokeStyle = OUT; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(0, -23, 10, Math.PI * 0.92, Math.PI * 2.08);
      ctx.quadraticCurveTo(10, -18, 8, -17); ctx.quadraticCurveTo(0, -23, -8, -17);
      ctx.quadraticCurveTo(-10, -18, -10, -23); ctx.fill(); ctx.stroke();
    }

    // Eyes
    px(ctx, -5.5, -21.5, 3.5, 3.5, "#ffffff"); px(ctx, -4.5, -20.8, 2.5, 2.8, p.eyes);
    px(ctx, 2, -21.5, 3.5, 3.5, "#ffffff");    px(ctx, 2.8, -20.8, 2.5, 2.8, p.eyes);

    // Signature Weapons
    if (p.weapon === "halberd") {
      px(ctx, 16, -34, 3, 58, "#f59e0b"); px(ctx, 12, -36, 13, 11, "#38bdf8"); px(ctx, 18, -40, 5, 5, "#e0f2fe");
    } else if (p.weapon === "rapier") {
      px(ctx, 15, -22, 3, 32, "#c084fc"); px(ctx, 11, 5, 11, 3, "#fbbf24");
    } else if (p.weapon === "mallet") {
      px(ctx, 15, -18, 4, 30, "#6366f1"); pill(ctx, 7, -30, 19, 13, 3, "#1e1b4b", "#facc15", 1.5);
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
