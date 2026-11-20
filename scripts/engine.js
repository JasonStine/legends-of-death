// =========================================================
// scripts/engine.js — Main Loop, B-to-Run / Auto-Run,
//                     Button Sizes, 7 Handheld Device Themes,
//                     Full-Screen Settings, Fog of War & Lore Toasts
// =========================================================
(() => {
  const T = window.WorldArt.T;
  const SAVE_KEY = "lod_save_v4";
  const WALK_SPEED = 62;
  const RUN_SPEED = 112;
  const MENU_TABS = ["quests", "party", "lore", "settings", "save"];
  const SETTING_COUNT = 6;

  const THEMES = [
    { id: "default",         label: "Midnight Blue (Default)", swatch: "#232a46" },
    { id: "dark-purple",     label: "Dark Purple",             swatch: "#3b2060" },
    { id: "dark-green",      label: "Dark Green",              swatch: "#15382c" },
    { id: "light-offwhite",  label: "Light Off-White",         swatch: "#ebe7dc" },
    { id: "light-green",     label: "Light Green",             swatch: "#aee2c7" },
    { id: "light-blue",      label: "Light Blue",              swatch: "#aed4f2" },
    { id: "sunburnt-yellow", label: "Sunburnt Yellow ★",       swatch: "#e8a427" }
  ];

  const shell = document.getElementById("handheld-shell");
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;

  const pCanvas = document.getElementById("portrait-canvas");
  const pCtx = pCanvas.getContext("2d");
  pCtx.imageSmoothingEnabled = false;

  const screenWrap = document.getElementById("screen-wrap");
  const fadeLayer = document.getElementById("fade-layer");

  let toastTimer = null;

  const game = {
    started: false,
    titleFocus: 0,
    mapId: "overworld",
    purgatorio: false,
    questStage: 0,
    warpCooldown: 0,
    player: { x: 12 * T, y: 9 * T, dir: "down", walkTimer: 0, frame: 0 },
    input: { up: false, down: false, left: false, right: false, run: false },
    dialogue: null,
    choice: null,
    cutscene: null,
    actors: [],
    menuOpen: false,
    menuTab: "quests",
    settingFocus: 0,
    discoveredParty: ["jacob"],
    loreTiers: {},
    settings: {
      volume: true,
      runByDefault: false,   // OFF: hold B to Run | ON: Run by default, hold B to Walk
      buttonSize: "medium",  // "small" | "medium" | "large"
      theme: "default",      // 7 handheld shell styles
      fogOfWar: true         // ON by default
    },
    lastTime: 0
  };

  function applyAppearance() {
    shell.dataset.theme = game.settings.theme || "default";
    shell.dataset.btnSize = game.settings.buttonSize || "medium";
    const bLabel = document.getElementById("b-mode-label");
    if (bLabel) bLabel.textContent = game.settings.runByDefault ? "WALK" : "RUN";
  }

  // ---------------------------------------------------------
  // LORE EVOLUTION & CORNER TOAST POPUP
  // ---------------------------------------------------------
  function showLoreToast(label, title) {
    const el = document.getElementById("lore-toast");
    document.getElementById("toast-label").textContent = label;
    document.getElementById("toast-title").textContent = title;
    el.classList.remove("hidden");
    window.AudioFX.lore();
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add("hidden"), 3200);
  }

  function unlockLore(id, tier) {
    const def = window.Story.loreDefs.find(l => l.id === id);
    if (!def) return;
    const prev = game.loreTiers[id] || 0;
    if (tier > prev) {
      game.loreTiers[id] = Math.min(tier, def.tiers.length);
      showLoreToast(prev === 0 ? "NEW LORE" : "LORE EVOLVED", def.title);
      saveProgress();
    }
  }

  function unlockParty(ids) {
    if (!ids) return;
    let changed = false;
    ids.forEach(id => {
      if (!game.discoveredParty.includes(id)) {
        game.discoveredParty.push(id);
        changed = true;
      }
    });
    if (changed) saveProgress();
  }

  // ---------------------------------------------------------
  // CLICKABLE PROGRESS BAR
  // ---------------------------------------------------------
  function updateProgressHud() {
    const total = window.Story.quests.length - 1;
    const q = window.Story.quests[Math.min(game.questStage, total)];
    const pct = Math.min(100, Math.round((game.questStage / total) * 100));
    document.getElementById("progress-act").textContent = `${q.act} • ${q.ch}`;
    document.getElementById("progress-fill").style.width = `${pct}%`;
    document.getElementById("progress-pct").textContent = `${pct}%`;
  }

  // ---------------------------------------------------------
  // MAP LOADING (With Safe Warp Cooldown)
  // ---------------------------------------------------------
  function loadMap(mapId, tx, ty, afterFade) {
    game.warpCooldown = 0.9;
    window.AudioFX.portal();
    fadeLayer.classList.add("active");
    setTimeout(() => {
      game.mapId = mapId;
      game.player.x = tx * T;
      game.player.y = ty * T;
      game.player.frame = 0;
      rebuildActors();
      document.getElementById("location-pill").textContent = window.Maps[mapId].name;
      updateProgressHud();
      saveProgress();
      setTimeout(() => {
        fadeLayer.classList.remove("active");
        if (afterFade) afterFade();
      }, 160);
    }, 200);
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
        patrolIdx: 0,
        pauseTimer: 1.0 + Math.random() * 1.2,
        hidden: false
      }));
  }

  function updateActors(dt) {
    if (game.dialogue || game.cutscene || game.choice) return;
    for (const a of game.actors) {
      if (a.hidden || !a.routine || a.routine.type !== "patrol") continue;
      if (a.pauseTimer > 0) {
        a.pauseTimer -= dt;
        a.frame = 0;
        if (a.routine.faceAtStop) a.dir = a.routine.faceAtStop;
        continue;
      }
      const [ttx, tty] = a.routine.points[a.patrolIdx];
      const tx = ttx * T, ty = tty * T;
      const dx = tx - a.x, dy = ty - a.y;
      const dist = Math.hypot(dx, dy);

      if (Math.hypot((a.x + (dx / (dist || 1)) * 6) - game.player.x, (a.y + (dy / (dist || 1)) * 6) - game.player.y) < 18) {
        a.frame = 0;
        continue;
      }

      if (dist <= 2) {
        a.x = tx; a.y = ty;
        a.frame = 0;
        a.patrolIdx = (a.patrolIdx + 1) % a.routine.points.length;
        a.pauseTimer = a.routine.pause || 2.0;
      } else {
        const sp = (a.routine.speed || 24) * dt;
        a.x += (dx / dist) * sp;
        a.y += (dy / dist) * sp;
        a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
        a.walkTimer += dt;
        if (a.walkTimer > 0.2) { a.walkTimer = 0; a.frame = (a.frame + 1) % 4; }
      }
    }
  }

  // ---------------------------------------------------------
  // DIALOGUE & D-PAD NAVIGABLE CHOICES
  // ---------------------------------------------------------
  function startDialogue(lines, onDone) {
    if (!lines || !lines.length) { if (onDone) onDone(); return; }
    game.dialogue = { lines, idx: 0, onDone };
    showCurrentLine();
  }

  function showCurrentLine() {
    const line = game.dialogue.lines[game.dialogue.idx];
    const pal = window.PALETTES[line.id] || window.PALETTES.jacob;
    const roleLabel = (game.questStage >= 6 && pal.trueRole) ? pal.trueRole : pal.role;
    document.getElementById("speaker-name").textContent = pal.name;
    document.getElementById("speaker-role").textContent = roleLabel;
    document.getElementById("dialogue-text").textContent = line.text;
    window.Sprites.drawPortrait(pCtx, line.id, line.mood || "neutral");
    document.getElementById("dialogue-box").classList.remove("hidden");
    window.AudioFX.blip();

    if (line.unlockParty) unlockParty(line.unlockParty);
    if (line.unlockLore) unlockLore(line.unlockLore.id, line.unlockLore.tier);
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
    game.choice = { options, focusIdx: 0 };
    renderChoices();
    document.getElementById("choice-box").classList.remove("hidden");
  }

  function renderChoices() {
    if (!game.choice) return;
    const box = document.getElementById("choice-box");
    box.innerHTML = "";
    game.choice.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.className = "choice-btn" + (i === game.choice.focusIdx ? " focused" : "");
      btn.textContent = (i === game.choice.focusIdx ? "▶ " : "  ") + opt.label;
      btn.onclick = () => {
        game.choice.focusIdx = i;
        confirmChoice();
      };
      box.appendChild(btn);
    });
  }

  function moveChoice(delta) {
    if (!game.choice) return;
    const n = game.choice.options.length;
    game.choice.focusIdx = (game.choice.focusIdx + delta + n) % n;
    window.AudioFX.cursor();
    renderChoices();
  }

  function confirmChoice() {
    if (!game.choice) return;
    const opt = game.choice.options[game.choice.focusIdx];
    game.choice = null;
    document.getElementById("choice-box").classList.add("hidden");
    window.AudioFX.confirm();
    if (opt && opt.action) opt.action();
  }

  function cancelChoice() {
    if (!game.choice) return;
    game.choice = null;
    document.getElementById("choice-box").classList.add("hidden");
    window.AudioFX.cancel();
  }

  // ---------------------------------------------------------
  // CUTSCENE ENGINE
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
    if (step.type === "dialogue") startDialogue(step.lines, () => nextCutsceneStep());
    else if (step.type === "walk") {
      const actor = game.actors.find(a => a.id === step.actorId);
      if (!actor) { nextCutsceneStep(); return; }
      cs.activeWalk = { actor, targetX: step.tx * T, targetY: step.ty * T, speed: step.speed || 54, hideAtEnd: !!step.hideAtEnd };
    } else if (step.type === "wait") setTimeout(() => nextCutsceneStep(), step.ms || 350);
    else if (step.type === "warp") loadMap(step.mapId, step.tx, step.ty, () => nextCutsceneStep());
    else nextCutsceneStep();
  }

  function updateCutscene(dt) {
    const cs = game.cutscene;
    if (!cs || !cs.activeWalk) return;
    const w = cs.activeWalk;
    const a = w.actor;
    const dx = w.targetX - a.x, dy = w.targetY - a.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= 2) {
      a.x = w.targetX; a.y = w.targetY; a.frame = 0;
      if (w.hideAtEnd) a.hidden = true;
      cs.activeWalk = null;
      nextCutsceneStep();
      return;
    }
    const sp = w.speed * dt;
    a.x += (dx / dist) * sp; a.y += (dy / dist) * sp;
    a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
    a.walkTimer += dt;
    if (a.walkTimer > 0.14) { a.walkTimer = 0; a.frame = (a.frame + 1) % 4; }
  }

  // ---------------------------------------------------------
  // FULL 15-CHAPTER STORY EVENTS
  // ---------------------------------------------------------
  function advanceStage(newStage) {
    if (game.questStage < newStage) {
      game.questStage = newStage;
      updateProgressHud();
      saveProgress();
    }
  }

  function triggerEvent(eventName) {
    const D = window.Story.dialogues;

    if (eventName === "churchCyrine") {
      startDialogue(D.churchCyrine, () => advanceStage(1));
    } else if (eventName === "naviHouse") {
      if (game.questStage <= 1) startDialogue(D.naviKitchen, () => advanceStage(2));
      else startDialogue([{ id: "navi", mood: "neutral", text: "I'm keeping the kitchen stocked for everyone. Rest on the couch or bed whenever you need, Jacob." }]);
    } else if (eventName === "hospitalHeal") {
      window.AudioFX.heal();
      startDialogue([{ id: "mom", mood: "happy", text: "Welcome to Colorado Springs Medical Center, sweetheart! All HP and spirit energy fully restored!" }]);
    } else if (eventName === "sleep") {
      showChoices([
        {
          label: "Sleep & Rest Here",
          action: () => {
            if (game.questStage === 2 || game.questStage === 3) {
              startDialogue(D.sleepPrompt, () => {
                advanceStage(3);
                loadMap("dream", 7, 8);
              });
            } else if (game.questStage < 2) {
              startDialogue([{ id: "jacob", mood: "neutral", text: "I should talk to Cyrine at church and meet Navi in the kitchen before going to sleep!" }]);
            } else {
              window.AudioFX.heal();
              startDialogue([{ id: "jacob", mood: "happy", text: "Zzz... That felt great! Feeling completely rested." }]);
            }
          }
        },
        { label: "Stay Awake", action: () => {} }
      ]);
    } else if (eventName === "dreamLetonin") {
      startDialogue(D.dreamLetonin, () => {
        advanceStage(4);
        loadMap("house", 5, 6, () => startDialogue(D.afterDreamWake));
      });
    } else if (eventName === "partyBattle") {
      startDialogue(D.partyConfrontation, () => {
        window.Battle.start("partySendex", () => {
          advanceStage(5);
          runCutscene([
            { type: "dialogue", lines: D.partyPostBattle },
            { type: "walk", actorId: "sendex", tx: 7, ty: 10, speed: 52, hideAtEnd: true },
            { type: "wait", ms: 350 },
            { type: "dialogue", lines: D.partyAfterWalkout }
          ]);
        });
      });
    } else if (eventName === "snowCatCrista") {
      if (game.questStage === 5) startDialogue(D.snowCatCrista, () => advanceStage(6));
      else startDialogue([{ id: "crista", mood: "happy", text: "Purr~ (Crista rubs against your leg calmly.)" }]);
    } else if (eventName === "parkAction") {
      if (game.questStage === 6) {
        startDialogue(D.parkSummonLetonin, () => { advanceStage(7); triggerEvent("parkAction"); });
      } else if (game.questStage === 7) {
        startDialogue(D.parkSoulFusion, () => {
          window.Battle.start("parkSendex", () => {
            advanceStage(8);
            rebuildActors();
            runCutscene([
              { type: "dialogue", lines: D.parkPostBattle },
              { type: "walk", actorId: "sendex", tx: 12, ty: 5, speed: 56, hideAtEnd: true }
            ]);
          });
        });
      } else {
        startDialogue([{ id: "letonin", mood: "happy", text: "Go speak to Lord Death over on the left!" }]);
      }
    } else if (eventName === "deathStory") {
      if (game.questStage === 8) startDialogue(D.deathStory, () => advanceStage(9));
      else startDialogue([{ id: "death", mood: "neutral", text: "Step through the Crimson Portal on the right to confront Crepsus in Casa Grande, Arizona." }]);
    } else if (eventName === "fortressEmillia") {
      if (game.questStage === 9) startDialogue(D.fortressEmilliaDream, () => { advanceStage(10); rebuildActors(); });
      else startDialogue([{ id: "emillia", mood: "intense", text: "Let's finish Envy and Crepsus so we can finally go home!" }]);
    } else if (eventName === "envyBattle") {
      startDialogue(D.fortressEnvyIntro, () => {
        window.Battle.start("fortressEnvy", () => {
          advanceStage(11);
          runCutscene([
            { type: "dialogue", lines: D.fortressEnvyPost },
            { type: "walk", actorId: "envy", tx: 13, ty: 6, speed: 46, hideAtEnd: true }
          ], () => rebuildActors());
        });
      });
    } else if (eventName === "danielAscend") {
      startDialogue(D.fortressDanielAscend, () => {
        advanceStage(12);
        runCutscene([{ type: "walk", actorId: "sendex", tx: 10, ty: 2, speed: 62, hideAtEnd: true }], () => rebuildActors());
      });
    } else if (eventName === "crepsusBattle") {
      if (game.questStage < 12) {
        startDialogue([{ id: "crepsus", mood: "angry", text: "You aren't ready for me yet! Deal with my Sin and your little allies first!" }]);
        return;
      }
      startDialogue(D.fortressCrepsusIntro, () => {
        window.Battle.start("fortressCrepsus", () => {
          advanceStage(13);
          runCutscene([
            { type: "dialogue", lines: D.fortressCrepsusPost },
            { type: "walk", actorId: "crepsus", tx: 7, ty: 1, speed: 40, hideAtEnd: true }
          ], () => rebuildActors());
        });
      });
    } else if (eventName === "griefResolve") {
      startDialogue(D.griefAndResolve, () => { advanceStage(14); loadMap("overworld", 12, 10); });
    } else if (eventName === "epilogueReunion") {
      startDialogue(D.epilogueReunion);
    }
  }

  // ---------------------------------------------------------
  // MOVEMENT, COLLISION & INTERACT
  // ---------------------------------------------------------
  function isBlocked(px, py) {
    const map = window.Maps[game.mapId];
    const corners = [[px + 5, py + 14], [px + 18, py + 14], [px + 5, py + 23], [px + 18, py + 23]];
    for (const [cx, cy] of corners) {
      const tx = Math.floor(cx / T), ty = Math.floor(cy / T);
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return true;
      const tile = map.grid[ty][tx];
      if (tile === 1 || tile === 2) return true;
    }
    for (const a of game.actors) {
      if (a.hidden) continue;
      if (Math.abs(px - a.x) < 15 && Math.abs(py - a.y) < 15) return true;
    }
    return false;
  }

  function checkTriggers() {
    if (game.warpCooldown > 0) return;
    const map = window.Maps[game.mapId];
    const ptx = Math.floor((game.player.x + 12) / T);
    const pty = Math.floor((game.player.y + 18) / T);

    for (const b of map.buildings || []) {
      if (ptx === b.doorTx && pty === b.doorTy) { loadMap(b.dest, b.destX, b.destY); return; }
    }
    for (const ex of map.exits || []) {
      if (pty === ex.ty && ptx >= ex.tx && ptx < ex.tx + (ex.tw || 2)) { loadMap(ex.dest, ex.destX, ex.destY); return; }
    }
    for (const p of map.portals || []) {
      if (p.minQuest !== undefined && game.questStage < p.minQuest) continue;
      if (Math.hypot(game.player.x - p.tx * T, game.player.y - p.ty * T) < 15) {
        loadMap(p.dest, p.destX, p.destY);
        return;
      }
    }
  }

  function interact() {
    if (!game.started) { confirmTitle(); return; }
    if (window.Battle.isActive()) { window.Battle.confirmMove(); return; }
    if (game.choice) { confirmChoice(); return; }
    if (game.menuOpen) { confirmMenuAction(); return; }
    if (game.dialogue) { advanceDialogue(); return; }
    if (game.cutscene) return;

    const p = game.player;
    const fx = p.x + 12 + (p.dir === "left" ? -20 : p.dir === "right" ? 20 : 0);
    const fy = p.y + 16 + (p.dir === "up" ? -20 : p.dir === "down" ? 20 : 0);

    for (const a of game.actors) {
      if (a.hidden) continue;
      if (Math.hypot(fx - (a.x + 12), fy - (a.y + 16)) < 26) {
        const opp = { up: "down", down: "up", left: "right", right: "left" };
        a.dir = opp[p.dir] || "down";
        if (a.event) triggerEvent(a.event);
        else if (a.dialogue) startDialogue(a.dialogue);
        return;
      }
    }

    const map = window.Maps[game.mapId];
    for (const s of map.signs || []) {
      if (Math.hypot(fx - (s.tx * T + 12), fy - (s.ty * T + 12)) < 24) {
        startDialogue([{ id: "sign", mood: "neutral", text: s.text }]);
        return;
      }
    }

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
  // RENDERING PIPELINE
  // ---------------------------------------------------------
  function drawFloor(map, camX, camY, time) {
    const styles = {
      grass: ["#3f8f45", "#38823e"], wood: ["#9c6b43", "#8c5e38"],
      stone: ["#475569", "#3f4c5e"], tile: ["#e2e8f0", "#cbd5e1"],
      party: ["#1e1b4b", "#28225e"], dream: ["#1e1b4b", "#312e81"],
      park: ["#2d6a4f", "#245740"], desert: ["#b45309", "#9a3412"]
    };
    const [c1, c2] = styles[map.floorType] || styles.grass;

    for (let y = 0; y < map.h; y++) {
      for (let x = 0; x < map.w; x++) {
        const sx = x * T - camX, sy = y * T - camY;
        if (sx < -T || sy < -T || sx > 384 || sy > 256) continue;
        const tile = map.grid[y][x];
        if (tile === 3) {
          ctx.fillStyle = "#64748b"; ctx.fillRect(sx, sy, T, T);
          ctx.fillStyle = "#94a3b8"; ctx.fillRect(sx + 10, sy + 10, 4, 4);
        } else if (tile === 1 && map.id !== "overworld") {
          ctx.fillStyle = "#1e293b"; ctx.fillRect(sx, sy, T, T);
          ctx.fillStyle = "#334155"; ctx.fillRect(sx, sy + T - 4, T, 4);
        } else {
          ctx.fillStyle = (x + y) % 2 === 0 ? c1 : c2;
          ctx.fillRect(sx, sy, T, T);
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
      else if (q.mapHint === "overworld") { tx = 12; ty = 8; }
    } else if (map.id === "house" && q.mapHint === "house") {
      if (game.questStage === 1) { tx = 7; ty = 3; }
      else if (game.questStage === 2 || game.questStage === 3) { tx = 3; ty = 4; }
      else if (game.questStage === 5) { tx = 3; ty = 6; }
    } else if (map.id === "church" && q.mapHint === "church") { tx = 7; ty = 4; }
    else if (map.id === "dream" && q.mapHint === "dream") { tx = 7; ty = 4; }
    else if (map.id === "party" && q.mapHint === "party") { tx = 7; ty = 4; }
    else if (map.id === "park") {
      if (game.questStage === 6 || game.questStage === 7) { tx = 7; ty = 5; }
      else if (game.questStage === 8) { tx = 4; ty = 6; }
      else if (game.questStage >= 9) { tx = 12; ty = 5; }
    } else if (map.id === "fortress") {
      if (game.questStage === 9) { tx = 5; ty = 8; }
      else if (game.questStage === 10) { tx = 7; ty = 6; }
      else if (game.questStage === 11) { tx = 10; ty = 7; }
      else if (game.questStage === 12) { tx = 7; ty = 3; }
      else if (game.questStage === 13) { tx = 7; ty = 5; }
    }

    if (tx === null) return;
    const bx = tx * T + 12 - camX;
    const by = ty * T - 10 + Math.sin(time * 0.008) * 3 - camY;
    ctx.fillStyle = "#f5c542";
    ctx.beginPath();
    ctx.moveTo(bx, by + 8); ctx.lineTo(bx - 6, by); ctx.lineTo(bx + 6, by);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.stroke();
  }

  function render(time) {
    ctx.clearRect(0, 0, 384, 256);
    if (window.Battle.isActive()) { window.Battle.draw(ctx, time); return; }

    const map = window.Maps[game.mapId];
    const camX = Math.max(0, Math.min(map.w * T - 384, Math.round(game.player.x + 12 - 192)));
    const camY = Math.max(0, Math.min(map.h * T - 256, Math.round(game.player.y + 12 - 128)));

    drawFloor(map, camX, camY, time);

    ctx.save();
    ctx.translate(-camX, -camY);

    (map.props || []).filter(p => p.kind === "rug" || p.kind === "exit_mat").forEach(p => window.WorldArt.drawProp(ctx, p, time));
    (map.buildings || []).forEach(b => window.WorldArt.drawBuilding(ctx, b, time));
    (map.signs || []).forEach(s => window.WorldArt.drawSignpost(ctx, s.tx, s.ty));
    (map.trees || []).forEach(t => window.WorldArt.drawTree(ctx, t.tx * T, t.ty * T, t.kind, time));

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

    (map.props || []).filter(p => p.kind !== "rug" && p.kind !== "exit_mat").forEach(p => window.WorldArt.drawProp(ctx, p, time));

    (map.portals || []).forEach(p => {
      if (p.minQuest !== undefined && game.questStage < p.minQuest) return;
      window.WorldArt.drawPortal(ctx, p.tx * T + 12, p.ty * T + 12, p.style, time);
      if (p.label) {
        ctx.font = "bold 7px monospace";
        ctx.fillStyle = "#fef08a";
        ctx.fillText(p.label, p.tx * T - 10, p.ty * T - 10);
      }
    });

    const drawables = [{ id: "jacob", x: game.player.x, y: game.player.y, dir: game.player.dir, frame: game.player.frame, activity: null }];
    game.actors.forEach(a => { if (!a.hidden) drawables.push(a); });
    drawables.sort((a, b) => a.y - b.y);
    drawables.forEach(ch => {
      window.Sprites.drawOverworld(ctx, ch.id, ch.x, ch.y - 6, ch.dir, ch.frame, game.purgatorio, ch.activity, time);
    });

    ctx.restore();

    if (game.purgatorio || map.id === "park") {
      ctx.fillStyle = "rgba(88, 28, 135, 0.22)";
      ctx.fillRect(0, 0, 384, 256);
    }

    if (!game.cutscene && !game.dialogue) drawQuestBeacon(map, camX, camY, time);
  }

  // ---------------------------------------------------------
  // MAIN GAME LOOP (Hold B to Run / Run by Default Swap)
  // ---------------------------------------------------------
  function tick(time) {
    const dt = Math.min(0.05, (time - game.lastTime) / 1000 || 0.016);
    game.lastTime = time;
    if (game.warpCooldown > 0) game.warpCooldown = Math.max(0, game.warpCooldown - dt);

    if (game.started && !game.menuOpen && !window.Battle.isActive()) {
      updateActors(dt);
      if (game.cutscene) {
        updateCutscene(dt);
      } else if (!game.dialogue && !game.choice) {
        let vx = 0, vy = 0;
        if (game.input.up) { vy = -1; game.player.dir = "up"; }
        else if (game.input.down) { vy = 1; game.player.dir = "down"; }
        else if (game.input.left) { vx = -1; game.player.dir = "left"; }
        else if (game.input.right) { vx = 1; game.player.dir = "right"; }

        if (vx !== 0 || vy !== 0) {
          const isRunning = game.settings.runByDefault ? !game.input.run : game.input.run;
          const sp = isRunning ? RUN_SPEED : WALK_SPEED;
          const nx = game.player.x + vx * sp * dt;
          const ny = game.player.y + vy * sp * dt;
          if (!isBlocked(nx, ny)) { game.player.x = nx; game.player.y = ny; }
          game.player.walkTimer += dt;
          if (game.player.walkTimer > (isRunning ? 0.10 : 0.17)) {
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
  // FULL-SCREEN MENU & SETTINGS
  // ---------------------------------------------------------
  function openMenu(tab = "quests") {
    if (!game.started || window.Battle.isActive()) return;
    game.menuOpen = true;
    game.menuTab = tab;
    game.settingFocus = 0;
    window.AudioFX.confirm();
    document.getElementById("menu-overlay").classList.remove("hidden");
    renderMenuTab(tab);
  }

  function closeMenu() {
    game.menuOpen = false;
    window.AudioFX.cancel();
    document.getElementById("menu-overlay").classList.add("hidden");
  }

  function renderMenuTab(tab) {
    game.menuTab = tab;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    const body = document.getElementById("menu-body");
    const fog = game.settings.fogOfWar;

    if (tab === "quests") {
      body.innerHTML = window.Story.quests.map((q, i) => {
        const done = i < game.questStage;
        const curr = i === game.questStage;
        const hiddenByFog = fog && i > game.questStage;
        if (hiddenByFog) {
          return `<div class="menu-card fogged"><h4>🔒 ${q.act} • ${q.ch} — ???</h4><p>Undiscovered chapter. Advance the story to reveal.</p></div>`;
        }
        return `<div class="menu-card ${curr ? "focused" : ""}">
          <h4><span>${done ? "✓ " : curr ? "▶ " : ""}${q.act} • ${q.ch} — ${q.title}</span></h4>
          <p>${q.objective}</p>
        </div>`;
      }).join("");
    }

    else if (tab === "party") {
      body.innerHTML = window.Story.partyOrder.map(id => {
        const p = window.PALETTES[id];
        const met = game.discoveredParty.includes(id);
        if (fog && !met) {
          return `<div class="menu-card fogged"><h4>???</h4><p>You have not met this character yet.</p></div>`;
        }
        const role = (game.questStage >= 6 && p.trueRole) ? p.trueRole : p.role;
        return `<div class="menu-card"><h4>${p.name}</h4><p>${role}</p></div>`;
      }).join("");
    }

    else if (tab === "lore") {
      body.innerHTML = window.Story.loreDefs.map(def => {
        const tier = game.loreTiers[def.id] || 0;
        const showTier = fog ? tier : def.tiers.length;
        if (showTier === 0) {
          return `<div class="menu-card fogged"><h4>???</h4><p>Explore Colorado Springs and talk to characters to uncover this lore.</p></div>`;
        }
        const entries = def.tiers.slice(0, showTier).map((t, idx) => `<p style="margin-top:${idx ? 5 : 0}px">${idx > 0 ? "↳ " : ""}${t}</p>`).join("");
        return `<div class="menu-card">
          <h4><span>${def.title}</span><span class="badge-tier">Tier ${showTier}/${def.tiers.length}</span></h4>
          ${entries}
        </div>`;
      }).join("");
    }

    else if (tab === "settings") {
      const currTheme = THEMES.find(t => t.id === game.settings.theme) || THEMES[0];
      const items = [
        {
          label: "Audio Volume",
          sub: "Toggle 32-bit retro sound effects",
          val: game.settings.volume ? "ON" : "OFF"
        },
        {
          label: "Run by Default",
          sub: game.settings.runByDefault ? "Auto-Run ON (Hold B to Walk)" : "Walk normally (Hold B to Run)",
          val: game.settings.runByDefault ? "ON" : "OFF"
        },
        {
          label: "Button Size",
          sub: "Adjusts gamepad buttons & screen spacing",
          val: game.settings.buttonSize.toUpperCase()
        },
        {
          label: "Device Color Style",
          sub: "Change handheld console shell theme",
          val: currTheme.label,
          swatch: currTheme.swatch
        },
        {
          label: "Enable Fog of War",
          sub: "Hide unknown chapters, party & lore as ???",
          val: game.settings.fogOfWar ? "ON" : "OFF"
        },
        {
          label: "Reset Save & Play Again",
          sub: "Erase current progress and start from Ch. I",
          val: "RESET",
          danger: true
        }
      ];

      body.innerHTML = items.map((it, idx) => `
        <div class="menu-card setting-row ${idx === game.settingFocus ? "focused" : ""}" data-sidx="${idx}">
          <div class="setting-left">
            <strong>${idx === game.settingFocus ? "▶ " : ""}${it.label}</strong>
            <span class="setting-sub">${it.sub}</span>
          </div>
          <span class="setting-pill ${it.danger ? "danger" : ""}">
            ${it.swatch ? `<span class="theme-swatch" style="background:${it.swatch}"></span>` : ""}
            ${it.val}
          </span>
        </div>
      `).join("");

      body.querySelectorAll(".setting-row").forEach(row => {
        row.onclick = () => {
          game.settingFocus = Number(row.dataset.sidx);
          confirmMenuAction();
        };
      });
    }

    else if (tab === "save") {
      saveProgress();
      body.innerHTML = `<div class="menu-card focused"><h4>✓ Game Saved!</h4><p>Your chapter progress, evolving lore, party discoveries, and device settings are saved automatically on this device.</p></div>`;
    }
  }

  function confirmMenuAction() {
    if (game.menuTab !== "settings") {
      if (game.menuTab === "save") { saveProgress(); window.AudioFX.heal(); }
      return;
    }
    if (game.settingFocus === 0) {
      game.settings.volume = !game.settings.volume;
      window.AudioFX.setEnabled(game.settings.volume);
    } else if (game.settingFocus === 1) {
      game.settings.runByDefault = !game.settings.runByDefault;
      applyAppearance();
    } else if (game.settingFocus === 2) {
      const sizes = ["small", "medium", "large"];
      game.settings.buttonSize = sizes[(sizes.indexOf(game.settings.buttonSize) + 1) % sizes.length];
      applyAppearance();
    } else if (game.settingFocus === 3) {
      const idx = THEMES.findIndex(t => t.id === game.settings.theme);
      game.settings.theme = THEMES[(idx + 1) % THEMES.length].id;
      applyAppearance();
    } else if (game.settingFocus === 4) {
      game.settings.fogOfWar = !game.settings.fogOfWar;
    } else if (game.settingFocus === 5) {
      closeMenu();
      showChoices([
        {
          label: "Yes, Reset & Start Over",
          action: () => {
            localStorage.removeItem(SAVE_KEY);
            location.reload();
          }
        },
        { label: "Cancel", action: () => {} }
      ]);
      return;
    }
    window.AudioFX.confirm();
    saveProgress();
    renderMenuTab("settings");
  }

  // ---------------------------------------------------------
  // TITLE SCREEN NAVIGATION
  // ---------------------------------------------------------
  function updateTitleFocus() {
    const newBtn = document.getElementById("btn-new-game");
    const contBtn = document.getElementById("btn-continue");
    const hasSave = !contBtn.classList.contains("hidden");
    if (!hasSave) game.titleFocus = 0;
    newBtn.classList.toggle("focused", game.titleFocus === 0);
    contBtn.classList.toggle("focused", game.titleFocus === 1);
    newBtn.textContent = (game.titleFocus === 0 ? "▶ " : "") + "NEW JOURNEY";
    contBtn.textContent = (game.titleFocus === 1 ? "▶ " : "") + "CONTINUE";
  }

  function confirmTitle() {
    window.AudioFX.confirm();
    if (game.titleFocus === 1 && localStorage.getItem(SAVE_KEY)) startContinue();
    else startNewGame();
  }

  // ---------------------------------------------------------
  // UNIFIED D-PAD DISPATCHER
  // ---------------------------------------------------------
  function onDpadPress(dir) {
    if (!game.started) {
      const hasSave = !document.getElementById("btn-continue").classList.contains("hidden");
      if (hasSave && (dir === "left" || dir === "right" || dir === "up" || dir === "down")) {
        game.titleFocus = game.titleFocus === 0 ? 1 : 0;
        window.AudioFX.cursor();
        updateTitleFocus();
      }
      return;
    }
    if (window.Battle.isActive()) { window.Battle.moveFocus(dir); return; }
    if (game.choice) {
      if (dir === "up") moveChoice(-1);
      else if (dir === "down") moveChoice(1);
      return;
    }
    if (game.menuOpen) {
      if (dir === "left" || dir === "right") {
        const idx = MENU_TABS.indexOf(game.menuTab);
        const next = MENU_TABS[(idx + (dir === "right" ? 1 : -1) + MENU_TABS.length) % MENU_TABS.length];
        window.AudioFX.cursor();
        renderMenuTab(next);
      } else if (game.menuTab === "settings") {
        if (dir === "up") { game.settingFocus = (game.settingFocus + SETTING_COUNT - 1) % SETTING_COUNT; window.AudioFX.cursor(); renderMenuTab("settings"); }
        else if (dir === "down") { game.settingFocus = (game.settingFocus + 1) % SETTING_COUNT; window.AudioFX.cursor(); renderMenuTab("settings"); }
      } else {
        const body = document.getElementById("menu-body");
        if (dir === "up") body.scrollTop -= 56;
        else if (dir === "down") body.scrollTop += 56;
      }
      return;
    }
    game.input[dir] = true;
  }

  function onDpadRelease(dir) { game.input[dir] = false; }

  // ---------------------------------------------------------
  // SAVE / LOAD
  // ---------------------------------------------------------
  function saveProgress() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        mapId: game.mapId,
        questStage: game.questStage,
        x: game.player.x,
        y: game.player.y,
        discoveredParty: game.discoveredParty,
        loreTiers: game.loreTiers,
        settings: game.settings
      }));
    } catch (_) {}
  }

  function startNewGame() {
    document.getElementById("title-screen").classList.add("hidden");
    game.started = true;
    game.questStage = 0;
    game.discoveredParty = ["jacob"];
    game.loreTiers = {};
    loadMap("overworld", 12, 9, () => startDialogue(window.Story.dialogues.intro));
  }

  function startContinue() {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    document.getElementById("title-screen").classList.add("hidden");
    game.started = true;
    game.questStage = s.questStage || 0;
    game.discoveredParty = s.discoveredParty || ["jacob"];
    game.loreTiers = s.loreTiers || {};
    if (s.settings) {
      game.settings = { ...game.settings, ...s.settings };
      window.AudioFX.setEnabled(game.settings.volume);
      applyAppearance();
    }
    loadMap(s.mapId || "overworld", Math.round((s.x || 288) / T), Math.round((s.y || 216) / T));
  }

  // ---------------------------------------------------------
  // EVENT BINDINGS (Hold B to Run + Touch + Keyboard)
  // ---------------------------------------------------------
  document.querySelectorAll(".dpad-btn").forEach(btn => {
    const dir = btn.dataset.dir;
    btn.addEventListener("pointerdown", e => { e.preventDefault(); btn.classList.add("pressed"); onDpadPress(dir); });
    const release = () => { btn.classList.remove("pressed"); onDpadRelease(dir); };
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointerleave", release);
    btn.addEventListener("pointercancel", release);
  });

  document.getElementById("btn-a").addEventListener("click", interact);
  document.getElementById("dialogue-box").addEventListener("click", advanceDialogue);

  // B Button: Hold to Run (or Walk if Run-by-Default is ON) + Cancel/Back in UI
  const btnB = document.getElementById("btn-b");
  btnB.addEventListener("pointerdown", e => {
    e.preventDefault();
    btnB.classList.add("pressed");
    game.input.run = true;
    if (game.choice) cancelChoice();
    else if (game.menuOpen) closeMenu();
    else if (game.dialogue) advanceDialogue();
  });
  const releaseB = () => { btnB.classList.remove("pressed"); game.input.run = false; };
  btnB.addEventListener("pointerup", releaseB);
  btnB.addEventListener("pointerleave", releaseB);
  btnB.addEventListener("pointercancel", releaseB);

  document.getElementById("btn-realm").addEventListener("click", e => {
    if (!game.started) return;
    game.purgatorio = !game.purgatorio;
    window.AudioFX.portal();
    e.currentTarget.classList.toggle("active", game.purgatorio);
  });

  document.getElementById("progress-hud").addEventListener("click", () => openMenu("quests"));
  document.getElementById("btn-menu").addEventListener("click", () => game.menuOpen ? closeMenu() : openMenu("quests"));
  document.getElementById("btn-menu-top").addEventListener("click", () => game.menuOpen ? closeMenu() : openMenu("quests"));
  document.getElementById("menu-close").addEventListener("click", closeMenu);
  document.querySelectorAll(".tab-btn").forEach(b => b.addEventListener("click", () => { window.AudioFX.cursor(); renderMenuTab(b.dataset.tab); }));

  const keyMap = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" };
  window.addEventListener("keydown", e => {
    if (keyMap[e.code]) { if (!e.repeat || !game.menuOpen) onDpadPress(keyMap[e.code]); e.preventDefault(); }
    if (e.code === "KeyZ" || e.code === "Enter" || e.code === "Space") { interact(); e.preventDefault(); }
    if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyX") {
      game.input.run = true;
      if (e.code === "KeyX" && !e.repeat) {
        if (game.choice) cancelChoice();
        else if (game.menuOpen) closeMenu();
      }
    }
    if (e.code === "Escape") {
      if (game.choice) cancelChoice();
      else if (game.menuOpen) closeMenu();
    }
    if (e.code === "KeyM") { game.menuOpen ? closeMenu() : openMenu("quests"); }
  });
  window.addEventListener("keyup", e => {
    if (keyMap[e.code]) onDpadRelease(keyMap[e.code]);
    if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyX") game.input.run = false;
  });

  // Boot Title Screen & Load Saved Settings
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) {
    document.getElementById("btn-continue").classList.remove("hidden");
    try {
      const parsed = JSON.parse(saved);
      if (parsed.settings) {
        game.settings = { ...game.settings, ...parsed.settings };
        window.AudioFX.setEnabled(game.settings.volume);
      }
    } catch (_) {}
  }
  applyAppearance();
  updateTitleFocus();
  document.getElementById("btn-new-game").addEventListener("click", startNewGame);
  document.getElementById("btn-continue").addEventListener("click", startContinue);

  requestAnimationFrame(tick);
})();
