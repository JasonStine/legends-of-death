// Game loop, movement, cutscene transitions, and save/load behavior.
// =========================================================
// scripts/engine.js — Main Loop, Slower GBA Movement,
//                     Cutscene Walk-Out Engine & Save System
// =========================================================
(() => {
  const T = window.WorldArt.T; // 24px tiles
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const pCanvas = document.getElementById("portrait-canvas");
  const pCtx = pCanvas.getContext("2d");
  pCtx.imageSmoothingEnabled = false;

  const screenWrap = document.getElementById("screen-wrap");
  const fadeLayer = document.getElementById("fade-layer");

  // Slower, deliberate Pokémon LeafGreen walking speed (pixels/sec)
  const WALK_SPEED = 64;

  const game = {
    started: false,
    mapId: "overworld",
    purgatorio: false,
    questStage: 0,
    player: { x: 12 * T, y: 9 * T, dir: "down", walkTimer: 0, frame: 0 },
    input: { up: false, down: false, left: false, right: false },
    dialogue: null, // { lines, idx, onDone }
    cutscene: null, // { steps, idx }
    actors: [],     // Live mutable NPC instances for current map
    menuOpen: false,
    lastTime: 0
  };

  // ---------------------------------------------------------
  // MAP LOADING & ACTOR SPAWNING
  // ---------------------------------------------------------
  function loadMap(mapId, tx, ty, afterFade) {
    fadeLayer.classList.add("active");
    setTimeout(() => {
      game.mapId = mapId;
      game.player.x = tx * T;
      game.player.y = ty * T;
      game.player.frame = 0;
      rebuildActors();
      document.getElementById("location-pill").textContent = window.Maps[mapId].name;
      updateQuestHud();
      saveProgress();
      setTimeout(() => {
        fadeLayer.classList.remove("active");
        if (afterFade) afterFade();
      }, 180);
    }, 220);
  }

  function rebuildActors() {
    const map = window.Maps[game.mapId];
    game.actors = (map.npcs || [])
      .filter(n => {
        if (n.minQuest !== undefined && game.questStage < n.minQuest) return false;
        if (n.maxQuest !== undefined && game.questStage > n.maxQuest) return false;
        return true;
      })
      .map(n => ({
        ...n,
        x: n.tx * T,
        y: n.ty * T,
        frame: 0,
        walkTimer: 0,
        hidden: false
      }));
  }

  function updateQuestHud() {
    const q = window.Story.quests[Math.min(game.questStage, window.Story.quests.length - 1)];
    document.getElementById("quest-act").textContent = q.act;
    document.getElementById("quest-text").textContent = `${q.title}: ${q.objective}`;
  }

  // ---------------------------------------------------------
  // DIALOGUE & CHOICE SYSTEM (With 64x64 Portraits)
  // ---------------------------------------------------------
  function startDialogue(lines, onDone) {
    if (!lines || !lines.length) { if (onDone) onDone(); return; }
    game.dialogue = { lines, idx: 0, onDone };
    showCurrentLine();
  }

  function showCurrentLine() {
    const d = game.dialogue;
    const line = d.lines[d.idx];
    const pal = window.PALETTES[line.id] || window.PALETTES.jacob;
    document.getElementById("speaker-name").textContent = pal.name;
    document.getElementById("speaker-role").textContent = pal.role;
    document.getElementById("dialogue-text").textContent = line.text;
    window.Sprites.drawPortrait(pCtx, line.id, line.mood || "neutral");
    document.getElementById("dialogue-box").classList.remove("hidden");
  }

  function advanceDialogue() {
    if (!game.dialogue) return;
    game.dialogue.idx++;
    if (game.dialogue.idx >= game.dialogue.lines.length) {
      const cb = game.dialogue.onDone;
      game.dialogue = null;
      document.getElementById("dialogue-box").classList.add("hidden");
      if (cb) cb();
    } else {
      showCurrentLine();
    }
  }

  function showChoices(options) {
    const box = document.getElementById("choice-box");
    box.innerHTML = "";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "choice-btn";
      btn.textContent = opt.label;
      btn.onclick = () => {
        box.classList.add("hidden");
        opt.action();
      };
      box.appendChild(btn);
    });
    box.classList.remove("hidden");
  }

  // ---------------------------------------------------------
  // CUTSCENE ENGINE (Letterbox + NPC Walk-Out Animations!)
  // ---------------------------------------------------------
  function runCutscene(steps, onDone) {
    screenWrap.classList.add("cutscene-active");
    game.cutscene = { steps, idx: 0, onDone, activeWalk: null };
    nextCutsceneStep();
  }

  function nextCutsceneStep() {
    const cs = game.cutscene;
    if (!cs) return;
    if (cs.idx >= cs.steps.length) {
      const cb = cs.onDone;
      game.cutscene = null;
      screenWrap.classList.remove("cutscene-active");
      if (cb) cb();
      return;
    }

    const step = cs.steps[cs.idx++];
    if (step.type === "dialogue") {
      startDialogue(step.lines, () => nextCutsceneStep());
    } else if (step.type === "walk") {
      const actor = game.actors.find(a => a.id === step.actorId);
      if (!actor) { nextCutsceneStep(); return; }
      cs.activeWalk = {
        actor,
        targetX: step.tx * T,
        targetY: step.ty * T,
        speed: step.speed || 58,
        hideAtEnd: !!step.hideAtEnd
      };
    } else if (step.type === "wait") {
      setTimeout(() => nextCutsceneStep(), step.ms || 400);
    } else if (step.type === "warp") {
      loadMap(step.mapId, step.tx, step.ty, () => nextCutsceneStep());
    } else {
      nextCutsceneStep();
    }
  }

  function updateCutscene(dt) {
    const cs = game.cutscene;
    if (!cs || !cs.activeWalk) return;
    const w = cs.activeWalk;
    const a = w.actor;
    const dx = w.targetX - a.x;
    const dy = w.targetY - a.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= 2) {
      a.x = w.targetX;
      a.y = w.targetY;
      a.frame = 0;
      if (w.hideAtEnd) a.hidden = true;
      cs.activeWalk = null;
      nextCutsceneStep();
      return;
    }

    const stepDist = w.speed * dt;
    a.x += (dx / dist) * stepDist;
    a.y += (dy / dist) * stepDist;
    a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    a.walkTimer += dt;
    if (a.walkTimer > 0.14) {
      a.walkTimer = 0;
      a.frame = (a.frame + 1) % 4;
    }
  }

  // ---------------------------------------------------------
  // STORY EVENTS & INTERACTIONS
  // ---------------------------------------------------------
  function triggerEvent(eventName) {
    if (eventName === "churchCyrine") {
      startDialogue(window.Story.dialogues.churchCyrine, () => {
        if (game.questStage < 1) {
          game.questStage = 1;
          updateQuestHud();
          saveProgress();
        }
      });
    }

    else if (eventName === "hospitalHeal") {
      startDialogue([
        { id: "mom", mood: "happy", text: "Welcome to Colorado Springs Hospital, sweetheart! Let me patch you and your friends up—all HP & energy fully restored!" }
      ]);
    }

    else if (eventName === "sleep") {
      showChoices([
        {
          label: "Sleep here now",
          action: () => {
            startDialogue(window.Story.dialogues.sleepPrompt, () => {
              if (game.questStage === 1) {
                game.questStage = 2;
                loadMap("dream", 7, 9);
              } else {
                startDialogue([{ id: "jacob", mood: "happy", text: "That felt great... Feeling fully rested!" }]);
              }
            });
          }
        },
        { label: "Not yet", action: () => {} }
      ]);
    }

    else if (eventName === "dreamLetonin") {
      startDialogue(window.Story.dialogues.dreamLetonin, () => {
        if (game.questStage < 3) game.questStage = 3;
        loadMap("house", 5, 6, () => {
          startDialogue(window.Story.dialogues.afterDreamWake);
        });
      });
    }

    else if (eventName === "partyBattle") {
      startDialogue(window.Story.dialogues.partyConfrontation, () => {
        window.Battle.start("partySendex", () => {
          game.questStage = 4;
          updateQuestHud();
          saveProgress();
          // POST-FIGHT CUTSCENE: Sendex scowls and physically walks out the exit door!
          runCutscene([
            { type: "dialogue", lines: window.Story.dialogues.partyPostBattle },
            { type: "walk", actorId: "sendex", tx: 7, ty: 10, speed: 52, hideAtEnd: true },
            { type: "wait", ms: 350 },
            { type: "dialogue", lines: window.Story.dialogues.partyAfterWalkout }
          ]);
        });
      });
    }

    else if (eventName === "parkBattle") {
      if (game.questStage >= 5) {
        startDialogue([{ id: "letonin", mood: "happy", text: "Step through the Crimson Portal on the right to confront Crepsus in Casa Grande!" }]);
        return;
      }
      startDialogue(window.Story.dialogues.parkAwaken, () => {
        window.Battle.start("parkSendex", () => {
          game.questStage = 5;
          rebuildActors();
          updateQuestHud();
          saveProgress();
          runCutscene([
            { type: "dialogue", lines: window.Story.dialogues.parkPostBattle },
            { type: "walk", actorId: "sendex", tx: 12, ty: 5, speed: 60, hideAtEnd: true }
          ]);
        });
      });
    }

    else if (eventName === "envyBattle") {
      startDialogue(window.Story.dialogues.fortressEnvyIntro, () => {
        window.Battle.start("fortressEnvy", () => {
          game.questStage = 6;
          updateQuestHud();
          saveProgress();
          runCutscene([
            { type: "dialogue", lines: window.Story.dialogues.fortressEnvyPost },
            { type: "walk", actorId: "envy", tx: 13, ty: 6, speed: 45, hideAtEnd: true }
          ], () => rebuildActors());
        });
      });
    }

    else if (eventName === "crepsusBattle") {
      if (game.questStage < 6) {
        startDialogue([{ id: "crepsus", mood: "angry", text: "Get past my Divine Sin Envy first, little human!" }]);
        return;
      }
      startDialogue(window.Story.dialogues.fortressCrepsusIntro, () => {
        window.Battle.start("fortressCrepsus", () => {
          game.questStage = 7;
          updateQuestHud();
          saveProgress();
          runCutscene([
            { type: "dialogue", lines: window.Story.dialogues.fortressCrepsusPost },
            { type: "walk", actorId: "crepsus", tx: 7, ty: 1, speed: 40, hideAtEnd: true },
            { type: "wait", ms: 400 },
            { type: "warp", mapId: "overworld", tx: 12, ty: 10 }
          ]);
        });
      });
    }

    else if (eventName === "epilogueLetonin") {
      startDialogue(window.Story.dialogues.epilogueLetonin);
    }
  }

  // ---------------------------------------------------------
  // MOVEMENT, COLLISION & INTERACT
  // ---------------------------------------------------------
  function isBlocked(px, py) {
    const map = window.Maps[game.mapId];
    // Player feet hitbox
    const corners = [
      [px + 5, py + 14],
      [px + 18, py + 14],
      [px + 5, py + 23],
      [px + 18, py + 23]
    ];
    for (const [cx, cy] of corners) {
      const tx = Math.floor(cx / T);
      const ty = Math.floor(cy / T);
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return true;
      const tile = map.grid[ty][tx];
      if (tile === 1 || tile === 2) return true;
    }
    // NPC collision
    for (const a of game.actors) {
      if (a.hidden) continue;
      if (Math.abs(px - a.x) < 16 && Math.abs(py - a.y) < 16) return true;
    }
    return false;
  }

  function checkTriggers() {
    const map = window.Maps[game.mapId];
    const ptx = Math.floor((game.player.x + 12) / T);
    const pty = Math.floor((game.player.y + 18) / T);

    // Building doors on Overworld
    for (const b of map.buildings || []) {
      if (ptx === b.doorTx && pty === b.doorTy) {
        loadMap(b.dest, b.destX, b.destY);
        return;
      }
    }
    // Interior Exit Mats
    for (const ex of map.exits || []) {
      if (pty === ex.ty && ptx >= ex.tx && ptx < ex.tx + (ex.tw || 2)) {
        loadMap(ex.dest, ex.destX, ex.destY);
        return;
      }
    }
    // Animated Portals
    for (const p of map.portals || []) {
      if (p.minQuest !== undefined && game.questStage < p.minQuest) continue;
      if (Math.hypot(game.player.x - p.tx * T, game.player.y - p.ty * T) < 16) {
        loadMap(p.dest, p.destX, p.destY);
        return;
      }
    }
  }

  function interact() {
    if (!game.started || game.menuOpen || window.Battle.isActive()) return;
    if (game.dialogue) { advanceDialogue(); return; }
    if (game.cutscene) return;

    const p = game.player;
    const fx = p.x + 12 + (p.dir === "left" ? -20 : p.dir === "right" ? 20 : 0);
    const fy = p.y + 16 + (p.dir === "up" ? -20 : p.dir === "down" ? 20 : 0);

    // 1. Check nearby NPCs
    for (const a of game.actors) {
      if (a.hidden) continue;
      if (Math.hypot(fx - (a.x + 12), fy - (a.y + 16)) < 26) {
        if (a.event) triggerEvent(a.event);
        else if (a.dialogue) startDialogue(a.dialogue);
        return;
      }
    }

    // 2. Check interactive furniture (Couch / Bed)
    const map = window.Maps[game.mapId];
    for (const prop of map.props || []) {
      if (!prop.interact) continue;
      const pw = prop.kind === "couch" ? 72 : 44;
      const ph = prop.kind === "couch" ? 32 : 58;
      const px0 = prop.tx * T - 10, py0 = prop.ty * T - 10;
      if (fx >= px0 && fx <= px0 + pw + 20 && fy >= py0 && fy <= py0 + ph + 20) {
        triggerEvent(prop.interact);
        return;
      }
    }
  }

  // ---------------------------------------------------------
  // RENDERING PIPELINE (384x256 Crisp Pixel Art)
  // ---------------------------------------------------------
  function drawFloor(map, camX, camY, time) {
    const styles = {
      grass: ["#3f8f45", "#38823e"],
      wood: ["#9c6b43", "#8c5e38"],
      stone: ["#475569", "#3f4c5e"],
      tile: ["#e2e8f0", "#cbd5e1"],
      party: ["#1e1b4b", "#28225e"],
      dream: ["#1e1b4b", "#312e81"],
      park: ["#2d6a4f", "#245740"],
      desert: ["#b45309", "#9a3412"]
    };
    const [c1, c2] = styles[map.floorType] || styles.grass;

    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        const sx = x * T - camX;
        const sy = y * T - camY;
        if (sx < -T || sy < -T || sx > 384 || sy > 256) continue;
        const tile = map.grid[y][x];
        if (tile === 3) {
          ctx.fillStyle = "#64748b";
          ctx.fillRect(sx, sy, T, T);
          ctx.fillStyle = "#94a3b8";
          ctx.fillRect(sx + 10, sy + 10, 4, 4);
        } else if (tile === 1 && map.id !== "overworld") {
          ctx.fillStyle = "#1e293b";
          ctx.fillRect(sx, sy, T, T);
          ctx.fillStyle = "#334155";
          ctx.fillRect(sx, sy + T - 4, T, 4);
        } else {
          ctx.fillStyle = (x + y) % 2 === 0 ? c1 : c2;
          ctx.fillRect(sx, sy, T, T);
          // Dream Realm glowing star water sparkles
          if (map.floorType === "dream" && (x * 7 + y * 13) % 11 === 0) {
            ctx.fillStyle = Math.sin(time * 0.005 + x) > 0 ? "#fde047" : "#38bdf8";
            ctx.fillRect(sx + 10, sy + 10, 2, 2);
          }
        }
      }
    }
  }

  function drawQuestBeacon(map, camX, camY, time) {
    const q = window.Story.quests[game.questStage];
    if (!q) return;
    let tx = null, ty = null;

    if (map.id === "overworld") {
      if (q.mapHint === "church") { tx = 5; ty = 5; }
      else if (q.mapHint === "house") { tx = 19; ty = 5; }
      else if (q.mapHint === "party") { tx = 19; ty = 14; }
      else if (q.mapHint === "park" || q.mapHint === "fortress") { tx = 12; ty = 2; }
    } else if (map.id === "house" && q.mapHint === "house") {
      tx = 3; ty = 4; // Point right at Jacob's Couch!
    } else if (map.id === "church" && q.mapHint === "church") {
      tx = 7; ty = 4;
    } else if (map.id === "dream" && q.mapHint === "dream") {
      tx = 7; ty = 4;
    } else if (map.id === "party" && q.mapHint === "party") {
      tx = 7; ty = 4;
    } else if (map.id === "park") {
      tx = game.questStage === 4 ? 7 : 12;
      ty = game.questStage === 4 ? 5 : 5;
    } else if (map.id === "fortress") {
      tx = 7; ty = game.questStage === 5 ? 6 : 3;
    }

    if (tx === null) return;
    const bx = tx * T + 12 - camX;
    const by = ty * T - 10 + Math.sin(time * 0.008) * 3 - camY;
    ctx.fillStyle = "#f5c542";
    ctx.beginPath();
    ctx.moveTo(bx, by + 8);
    ctx.lineTo(bx - 6, by);
    ctx.lineTo(bx + 6, by);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#111";
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function render(time) {
    ctx.clearRect(0, 0, 384, 256);

    if (window.Battle.isActive()) {
      window.Battle.draw(ctx, time);
      return;
    }

    const map = window.Maps[game.mapId];
    const mapPxW = map.w * T;
    const mapPxH = map.h * T;
    const camX = Math.max(0, Math.min(mapPxW - 384, Math.round(game.player.x + 12 - 192)));
    const camY = Math.max(0, Math.min(mapPxH - 256, Math.round(game.player.y + 12 - 128)));

    drawFloor(map, camX, camY, time);

    ctx.save();
    ctx.translate(-camX, -camY);

    // 1. Interior rugs & exit mats first
    (map.props || []).filter(p => p.kind === "rug" || p.kind === "exit_mat").forEach(p => window.WorldArt.drawProp(ctx, p, time));

    // 2. Buildings & Trees
    (map.buildings || []).forEach(b => window.WorldArt.drawBuilding(ctx, b, time));
    (map.trees || []).forEach(t => window.WorldArt.drawTree(ctx, t.tx * T, t.ty * T, t.kind, time));

    // 3. Border trees on overworld
    if (map.id === "overworld") {
      for (let x = 0; x < map.w; x++) {
        window.WorldArt.drawTree(ctx, x * T, 0, x % 2 === 0 ? "pine" : "oak", time);
        window.WorldArt.drawTree(ctx, x * T, (map.h - 1) * T, "oak", time);
      }
      for (let y = 1; y < map.h - 1; y++) {
        window.WorldArt.drawTree(ctx, 0, y * T, "pine", time);
        window.WorldArt.drawTree(ctx, (map.w - 1) * T, y * T, "oak", time);
      }
    }

    // 4. Furniture props (Couch, Bed, Kitchen, etc.)
    (map.props || []).filter(p => p.kind !== "rug" && p.kind !== "exit_mat").forEach(p => window.WorldArt.drawProp(ctx, p, time));

    // 5. Animated Swirling Portals
    (map.portals || []).forEach(p => {
      if (p.minQuest !== undefined && game.questStage < p.minQuest) return;
      window.WorldArt.drawPortal(ctx, p.tx * T + 12, p.ty * T + 12, p.style, time);
      if (p.label) {
        ctx.font = "bold 7px monospace";
        ctx.fillStyle = "#fef08a";
        ctx.fillText(p.label, p.tx * T - 10, p.ty * T - 10);
      }
    });

    // 6. Y-Sorted Characters (Player + NPCs)
    const drawables = [
      { id: "jacob", x: game.player.x, y: game.player.y, dir: game.player.dir, frame: game.player.frame }
    ];
    game.actors.forEach(a => { if (!a.hidden) drawables.push(a); });
    drawables.sort((a, b) => a.y - b.y);
    drawables.forEach(ch => {
      window.Sprites.drawOverworld(ctx, ch.id, ch.x, ch.y - 6, ch.dir, ch.frame, game.purgatorio);
    });

    ctx.restore();

    // 7. Purgatorio Violet Tint Overlay
    if (game.purgatorio || map.id === "park") {
      ctx.fillStyle = "rgba(88, 28, 135, 0.22)";
      ctx.fillRect(0, 0, 384, 256);
    }

    // 8. Golden Quest Arrow
    if (!game.cutscene && !game.dialogue) {
      drawQuestBeacon(map, camX, camY, time);
    }
  }

  // ---------------------------------------------------------
  // MAIN GAME LOOP
  // ---------------------------------------------------------
  function tick(time) {
    const dt = Math.min(0.05, (time - game.lastTime) / 1000 || 0.016);
    game.lastTime = time;

    if (game.started && !game.menuOpen && !window.Battle.isActive()) {
      if (game.cutscene) {
        updateCutscene(dt);
      } else if (!game.dialogue) {
        let vx = 0, vy = 0;
        if (game.input.up) { vy = -1; game.player.dir = "up"; }
        else if (game.input.down) { vy = 1; game.player.dir = "down"; }
        else if (game.input.left) { vx = -1; game.player.dir = "left"; }
        else if (game.input.right) { vx = 1; game.player.dir = "right"; }

        if (vx !== 0 || vy !== 0) {
          const nx = game.player.x + vx * WALK_SPEED * dt;
          const ny = game.player.y + vy * WALK_SPEED * dt;
          if (!isBlocked(nx, ny)) {
            game.player.x = nx;
            game.player.y = ny;
          }
          game.player.walkTimer += dt;
          if (game.player.walkTimer > 0.16) {
            game.player.walkTimer = 0;
            game.player.frame = (game.player.frame + 1) % 4;
          }
          checkTriggers();
        } else {
          game.player.frame = 0;
        }
      }
    }

    render(time);
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------
  // MENU, SAVE / LOAD, & CONTROLS BINDING
  // ---------------------------------------------------------
  function saveProgress() {
    try {
      localStorage.setItem("lod_save_v3", JSON.stringify({
        mapId: game.mapId,
        questStage: game.questStage,
        x: game.player.x,
        y: game.player.y
      }));
    } catch (_) {}
  }

  function openMenu(tab = "quests") {
    game.menuOpen = true;
    document.getElementById("menu-overlay").classList.remove("hidden");
    renderMenuTab(tab);
  }

  function renderMenuTab(tab) {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    const body = document.getElementById("menu-body");
    if (tab === "quests") {
      body.innerHTML = window.Story.quests.map((q, i) => {
        const done = i < game.questStage;
        const curr = i === game.questStage;
        return `<div class="menu-card" style="opacity:${i > game.questStage ? 0.45 : 1}">
          <h4>${done ? "✓ " : curr ? "▶ " : ""}${q.act} — ${q.title}</h4>
          <p>${q.objective}</p>
        </div>`;
      }).join("");
    } else if (tab === "party") {
      const roster = ["jacob", "cyrine", "navi", "letonin", "illicero", "sendex", "emillia"];
      body.innerHTML = roster.map(id => {
        const p = window.PALETTES[id];
        return `<div class="menu-card"><h4>${p.name}</h4><p>${p.role}</p></div>`;
      }).join("");
    } else if (tab === "lore") {
      body.innerHTML = window.Story.lore.map(l =>
        `<div class="menu-card"><h4>${l.title}</h4><p>${l.text}</p></div>`
      ).join("");
    } else if (tab === "save") {
      saveProgress();
      body.innerHTML = `<div class="menu-card"><h4>Progress Saved!</h4><p>Your journey is saved automatically in your browser. You can close and return anytime.</p></div>`;
    }
  }

  // Touch D-Pad
  document.querySelectorAll(".dpad-btn").forEach(btn => {
    const dir = btn.dataset.dir;
    const set = v => { game.input[dir] = v; btn.classList.toggle("pressed", v); };
    btn.addEventListener("pointerdown", e => { e.preventDefault(); set(true); });
    btn.addEventListener("pointerup", () => set(false));
    btn.addEventListener("pointerleave", () => set(false));
    btn.addEventListener("pointercancel", () => set(false));
  });

  // Action Buttons
  document.getElementById("btn-a").addEventListener("click", interact);
  document.getElementById("dialogue-box").addEventListener("click", advanceDialogue);
  document.getElementById("btn-b").addEventListener("click", () => {
    if (game.menuOpen) {
      game.menuOpen = false;
      document.getElementById("menu-overlay").classList.add("hidden");
    } else if (game.dialogue) {
      advanceDialogue();
    }
  });
  document.getElementById("btn-realm").addEventListener("click", e => {
    game.purgatorio = !game.purgatorio;
    e.currentTarget.classList.toggle("active", game.purgatorio);
  });
  document.getElementById("btn-menu").addEventListener("click", () => openMenu("quests"));
  document.getElementById("btn-menu-top").addEventListener("click", () => openMenu("quests"));
  document.getElementById("menu-close").addEventListener("click", () => {
    game.menuOpen = false;
    document.getElementById("menu-overlay").classList.add("hidden");
  });
  document.querySelectorAll(".tab-btn").forEach(b => b.addEventListener("click", () => renderMenuTab(b.dataset.tab)));

  // Keyboard Controls
  const keyMap = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" };
  window.addEventListener("keydown", e => {
    if (keyMap[e.code]) { game.input[keyMap[e.code]] = true; e.preventDefault(); }
    if (e.code === "KeyZ" || e.code === "Enter" || e.code === "Space") { interact(); e.preventDefault(); }
    if (e.code === "KeyX" || e.code === "Escape") {
      if (game.menuOpen) { game.menuOpen = false; document.getElementById("menu-overlay").classList.add("hidden"); }
    }
    if (e.code === "KeyM") openMenu("quests");
  });
  window.addEventListener("keyup", e => {
    if (keyMap[e.code]) game.input[keyMap[e.code]] = false;
  });

  // Title Screen Boot
  const saved = localStorage.getItem("lod_save_v3");
  if (saved) document.getElementById("btn-continue").classList.remove("hidden");

  document.getElementById("btn-new-game").addEventListener("click", () => {
    document.getElementById("title-screen").classList.add("hidden");
    game.started = true;
    game.questStage = 0;
    loadMap("overworld", 12, 9, () => startDialogue(window.Story.dialogues.intro));
  });

  document.getElementById("btn-continue").addEventListener("click", () => {
    const s = JSON.parse(localStorage.getItem("lod_save_v3"));
    document.getElementById("title-screen").classList.add("hidden");
    game.started = true;
    game.questStage = s.questStage || 0;
    loadMap(s.mapId || "overworld", Math.round((s.x || 288) / T), Math.round((s.y || 216) / T));
  });

  requestAnimationFrame(tick);
})();
