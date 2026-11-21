// =========================================================
// scripts/engine.js — Main Loop (v4)
//   • Developer Access PIN Gate (72800)
//   • Live Moving NPC Quest Arrow + Generous Chat Hitbox
//   • Pokemon-Style Step-In + Screen Zoom Battle Intro
//   • In-Game Story/Party/Lore Menu (No Save Tab)
//   • Full-Screen Pill-Grid Settings (Burnt Orange Default)
// =========================================================
(() => {
  const T = window.WorldArt.T;
  const VIEW_W = 384;
  const VIEW_H = 288;
  const SAVE_KEY = "lod_save_v5";
  const PIN_CODE = "72800";
  const WALK_SPEED = 62;
  const RUN_SPEED = 112;
  const IG_TABS = ["quests", "side", "map", "party", "lore"];

  const THEMES = [
    { id: "sunburnt-yellow", label: "Burnt Orange ★", swatch: "#e89b24" },
    { id: "default",         label: "Midnight Blue",  swatch: "#232a46" },
    { id: "dark-purple",     label: "Dark Purple",    swatch: "#3b2060" },
    { id: "dark-green",      label: "Dark Green",     swatch: "#15382c" },
    { id: "light-offwhite",  label: "Off-White",      swatch: "#ebe7dc" },
    { id: "light-green",     label: "Light Green",    swatch: "#aee2c7" },
    { id: "light-blue",      label: "Light Blue",     swatch: "#aed4f2" }
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
    pinUnlocked: false,
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
    ingameMenuOpen: false,
    ingameTab: "quests",
    settingsOpen: false,
    settingFocusRow: 0,
    discoveredParty: ["jacob"],
    loreTiers: {},
    sideQuests: {
      hasLindor: false,
      status: {} // { questId: "active" | "done" }
    },
    explored: {}, // { mapId: ["x,y", ...] }
    openInfoRow: -1,
    settings: {
      volume: true,
      runByDefault: false,
      buttonSize: "medium",
      theme: "sunburnt-yellow", // Default: Burnt Orange / Sunburnt Yellow!
      fogOfWar: true
    },
    lastTime: 0
  };

  // ---------------------------------------------------------
  // DEVELOPER ACCESS PIN GATE (72800)
  // ---------------------------------------------------------
  function initPinGate() {
    const gate = document.getElementById("pin-gate");
    const display = document.getElementById("pin-display");
    const errEl = document.getElementById("pin-error");
    const card = gate.querySelector(".pin-card");

    if (sessionStorage.getItem("lod_pin_ok") === "1") {
      game.pinUnlocked = true;
      gate.classList.add("hidden");
      return;
    }

    let entered = "";
    const updateDisplay = () => {
      const slots = [];
      for (let i = 0; i < 5; i++) slots.push(i < entered.length ? "•" : "_");
      display.textContent = slots.join(" ");
    };

    const submitPin = () => {
      if (entered === PIN_CODE) {
        window.AudioFX.heal();
        game.pinUnlocked = true;
        sessionStorage.setItem("lod_pin_ok", "1");
        gate.classList.add("hidden");
      } else {
        window.AudioFX.cancel();
        errEl.classList.remove("hidden");
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
        entered = "";
        updateDisplay();
      }
    };

    const pushDigit = d => {
      if (entered.length >= 5) return;
      errEl.classList.add("hidden");
      window.AudioFX.cursor();
      entered += d;
      updateDisplay();
      if (entered.length === 5) setTimeout(submitPin, 140);
    };

    gate.querySelectorAll(".pin-key").forEach(btn => {
      btn.addEventListener("click", () => {
        if (btn.dataset.digit !== undefined) pushDigit(btn.dataset.digit);
        else if (btn.dataset.fn === "clear") {
          window.AudioFX.cancel();
          entered = "";
          errEl.classList.add("hidden");
          updateDisplay();
        } else if (btn.dataset.fn === "enter") {
          submitPin();
        }
      });
    });

    window.addEventListener("keydown", e => {
      if (game.pinUnlocked) return;
      if (e.key >= "0" && e.key <= "9") { pushDigit(e.key); e.preventDefault(); }
      else if (e.key === "Backspace") { entered = entered.slice(0, -1); updateDisplay(); e.preventDefault(); }
      else if (e.key === "Enter") { submitPin(); e.preventDefault(); }
    });

    updateDisplay();
  }

  function isPurgatorioUnlocked() {
    return game.questStage >= 7 || !game.settings.fogOfWar;
  }

  function updatePurgatorioBtn() {
    const btn = document.getElementById("btn-realm");
    if (!btn) return;
    const unlocked = isPurgatorioUnlocked();
    btn.textContent = unlocked ? "PURGATORIO" : "???";
    btn.classList.toggle("locked", !unlocked);
    if (!unlocked && game.purgatorio) {
      game.purgatorio = false;
      btn.classList.remove("active");
    }
  }

  function applyAppearance() {
    shell.dataset.theme = game.settings.theme || "sunburnt-yellow";
    shell.dataset.btnSize = game.settings.buttonSize || "medium";
    const bLabel = document.getElementById("b-mode-label");
    if (bLabel) bLabel.textContent = game.settings.runByDefault ? "WALK" : "RUN";
    updatePurgatorioBtn();
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

  function setSideQuest(id, status) {
    const prev = game.sideQuests.status[id];
    if (prev === "done") return;
    if (prev !== status) {
      game.sideQuests.status[id] = status;
      const def = (window.Story.sideQuestDefs || []).find(q => q.id === id);
      if (def) showLoreToast(status === "done" ? "SIDE QUEST DONE" : "SIDE QUEST", def.title);
      saveProgress();
    }
  }

  function markExplored(mapId, px, py) {
    const map = window.Maps[mapId];
    if (!map) return;
    if (!game.explored[mapId]) game.explored[mapId] = [];
    const set = new Set(game.explored[mapId]);
    const cx = Math.floor((px + 12) / T);
    const cy = Math.floor((py + 12) / T);
    const rad = 3;
    let added = false;
    for (let dy = -rad; dy <= rad; dy++) {
      for (let dx = -rad; dx <= rad; dx++) {
        const tx = cx + dx, ty = cy + dy;
        if (tx >= 0 && ty >= 0 && tx < map.w && ty < map.h) {
          const key = `${tx},${ty}`;
          if (!set.has(key)) { set.add(key); added = true; }
        }
      }
    }
    if (added) game.explored[mapId] = Array.from(set);
  }

  function updateProgressHud() {
    const total = window.Story.quests.length - 1;
    const q = window.Story.quests[Math.min(game.questStage, total)];
    const pct = Math.min(100, Math.round((game.questStage / total) * 100));
    document.getElementById("progress-act").textContent = `${q.act} • ${q.ch}`;
    document.getElementById("progress-fill").style.width = `${pct}%`;
    document.getElementById("progress-pct").textContent = `${pct}%`;
  }

  // ---------------------------------------------------------
  // MAP LOADING & AMBIENT LIVING NPCS
  // ---------------------------------------------------------
  function loadMap(mapId, tx, ty, afterFade) {
    const safeId = (window.Maps && window.Maps[mapId]) ? mapId : "overworld";
    game.warpCooldown = 0.9;
    try { window.AudioFX.portal(); } catch (_) {}
    fadeLayer.classList.add("active");
    setTimeout(() => {
      try {
        game.mapId = safeId;
        game.player.x = (Number.isFinite(tx) ? tx : 12) * T;
        game.player.y = (Number.isFinite(ty) ? ty : 7) * T;
        if (safeId !== "overworld" && safeId !== "westside") game.player.dir = "up";
        game.player.frame = 0;
        rebuildActors();
        markExplored(safeId, game.player.x, game.player.y);
        document.getElementById("location-pill").textContent = window.Maps[safeId].name + (game.purgatorio ? " (Purgatorio)" : "");
        updatePurgatorioBtn();
        updateProgressHud();
        saveProgress();
      } catch (err) {
        console.error("loadMap error:", err);
      } finally {
        setTimeout(() => {
          fadeLayer.classList.remove("active");
          if (afterFade) afterFade();
        }, 160);
      }
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
  // DIALOGUE & CHOICES
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
      btn.onclick = () => { game.choice.focusIdx = i; confirmChoice(); };
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
  // CUTSCENE ENGINE + POKEMON-STYLE STEP-IN & ZOOM BATTLE INTRO!
  // ---------------------------------------------------------
  function runCutscene(steps, onDone) {
    screenWrap.classList.add("cutscene-active");
    game.cutscene = { steps, idx: 0, onDone, activeWalks: [] };
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
      cs.activeWalks = [{ actor, targetX: step.tx * T, targetY: step.ty * T, speed: step.speed || 54, hideAtEnd: !!step.hideAtEnd }];
    } else if (step.type === "multiWalk") {
      cs.activeWalks = step.walks
        .map(w => {
          const actor = game.actors.find(a => a.id === w.actorId);
          return actor ? { actor, targetX: w.tx * T, targetY: w.ty * T, speed: w.speed || 60, hideAtEnd: !!w.hideAtEnd } : null;
        })
        .filter(Boolean);
      if (!cs.activeWalks.length) nextCutsceneStep();
    } else if (step.type === "battleZoom") {
      // Dramatic Pokemon-style flash + screen zoom-in into combat!
      const flash = document.getElementById("battle-flash");
      window.AudioFX.portal();
      flash.classList.remove("flashing");
      void flash.offsetWidth;
      flash.classList.add("flashing");
      canvas.classList.add("battle-zooming");
      setTimeout(() => {
        canvas.classList.remove("battle-zooming");
        nextCutsceneStep();
      }, 540);
    } else if (step.type === "wait") {
      setTimeout(() => nextCutsceneStep(), step.ms || 350);
    } else if (step.type === "warp") {
      loadMap(step.mapId, step.tx, step.ty, () => nextCutsceneStep());
    } else {
      nextCutsceneStep();
    }
  }

  function updateCutscene(dt) {
    const cs = game.cutscene;
    if (!cs || !cs.activeWalks || !cs.activeWalks.length) return;
    let allDone = true;

    for (const w of cs.activeWalks) {
      if (w.done) continue;
      const a = w.actor;
      const dx = w.targetX - a.x, dy = w.targetY - a.y;
      const dist = Math.hypot(dx, dy);
      if (dist <= 2) {
        a.x = w.targetX; a.y = w.targetY; a.frame = 0;
        if (w.hideAtEnd) a.hidden = true;
        w.done = true;
      } else {
        allDone = false;
        const sp = w.speed * dt;
        a.x += (dx / dist) * sp; a.y += (dy / dist) * sp;
        a.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
        a.walkTimer += dt;
        if (a.walkTimer > 0.14) { a.walkTimer = 0; a.frame = (a.frame + 1) % 4; }
      }
    }

    if (allDone) {
      cs.activeWalks = [];
      nextCutsceneStep();
    }
  }

  // Helper: Allies step forward -> Pokemon flash + zoom -> Battle!
  function launchBattleWithStepIn(encounterKey, stepInWalks, onWin) {
    const steps = [];
    if (stepInWalks && stepInWalks.length) steps.push({ type: "multiWalk", walks: stepInWalks });
    steps.push({ type: "wait", ms: 200 });
    steps.push({ type: "battleZoom" });
    runCutscene(steps, () => {
      window.Battle.start(encounterKey, onWin);
    });
  }

  // ---------------------------------------------------------
  // FULL 15-CHAPTER STORY EVENTS
  // ---------------------------------------------------------
  function advanceStage(newStage) {
    if (game.questStage < newStage) {
      const wasUnlocked = isPurgatorioUnlocked();
      game.questStage = newStage;
      updateProgressHud();
      updatePurgatorioBtn();
      if (!wasUnlocked && isPurgatorioUnlocked()) {
        showLoreToast("REALM UNLOCKED", "Purgatorio Shift!");
      }
      saveProgress();
    }
  }

  function triggerEvent(eventName) {
    const D = window.Story.dialogues;

    if (eventName === "churchCyrine") {
      startDialogue(D.churchCyrine, () => { advanceStage(1); rebuildActors(); });
    } else if (eventName === "bookstoreCyrine") {
      startDialogue(D.bookstoreCyrine, () => { advanceStage(2); rebuildActors(); });
    } else if (eventName === "naviHouse") {
      if (game.questStage <= 2) startDialogue(D.naviKitchen, () => advanceStage(3));
      else startDialogue([{ id: "navi", mood: "neutral", text: "I'm keeping the kitchen stocked for everyone. Rest on the couch or bed whenever you need, Jacob." }]);
    } else if (eventName === "playSnake") {
      if (!game.sideQuests.status.snake_champ) setSideQuest("snake_champ", "active");
      showChoices([
        { label: "Play SNAKE.EXE", action: () => window.SnakeGame.start(() => setSideQuest("snake_champ", "done")) },
        { label: "Step Away", action: () => {} }
      ]);
    } else if (eventName === "loreTwilightFireflies") {
      startDialogue([{ id: "sign", mood: "neutral", text: "You flip through 'Twilight Fireflies'—the story of a red spirit whose anger burned the forest and a yellow spirit who calmed it.", unlockLore: { id: "twilight_fireflies", tier: 1 } }]);
    } else if (eventName === "loreChurchPlaque") {
      startDialogue([{ id: "sign", mood: "neutral", text: "Memorial Plaque: 'In loving memory of the Huesic Family.' On the margin, a tiny Latin engraving notes that midnight church bells summon the Reapers' hunt.", unlockLore: { id: "church_memorial", tier: 1 } }]);
    } else if (eventName === "loreHospitalChart") {
      startDialogue([{ id: "sign", mood: "neutral", text: "Dr. Menos's Toxicology Note: 'Concentrated Iris and Belladonna compound from the Huesic case does not match any known terrestrial plant...'", unlockLore: { id: "hospital_toxicology", tier: 1 } }]);
    } else if (eventName === "loreHospitalDesk") {
      startDialogue([{ id: "receptionist", mood: "neutral", text: "Reception Log: 'Dr. Menos is on duty in the back wing. Police detectives dropped off sealed toxicology files earlier today.'" }]);
    } else if (eventName === "loreSupernaturalNovels") {
      startDialogue([{ id: "sign", mood: "neutral", text: "You pull a fantasy novel off the shelf—it describes Reapers using a voice spell called 'Alter' to rewrite human perception. No wonder Cyrine knew how it worked!", unlockLore: { id: "supernatural_novels", tier: 1 } }]);
    } else if (eventName === "loreCafeBoard") {
      startDialogue([{ id: "clerk", mood: "happy", text: "Café Special: Iced Caramel Macchiato & Dark Chocolate Truffles! (Jacob's favorite Lindor chocolates are right by the register.)" }]);
    } else if (eventName === "lorePurgTown") {
      startDialogue([{ id: "sign", mood: "intense", text: "Astral Reaperian Tablet: 'Purgatorio mirrors the mortal world—humans cannot see or touch those who walk here, save for young children and Nephilim.'", unlockLore: { id: "purgatorio_secrets", tier: 2 } }]);
    } else if (eventName === "lorePurgHouse") {
      startDialogue([{ id: "jacob", mood: "intense", text: "Whoa... in Purgatorio, I can see faint black-green Envy toxin glowing on the floor—just like Navi saw at Cyrine's house!", unlockLore: { id: "purgatorio_secrets", tier: 1 } }]);
    } else if (eventName === "lorePurgBookstore") {
      startDialogue([{ id: "sign", mood: "intense", text: "Hidden Reaperian Text: 'When a Reaper disguises themselves as an animal, their form reflects their soul—like Illicero's platinum cat form, Crista.'", unlockLore: { id: "crista_cat", tier: 2 } }]);
    } else if (eventName === "loreCloset") {
      setSideQuest("closet_easter_egg", "done");
      startDialogue([
        { id: "jacob", mood: "happy", text: "My closet! Found my favorite faded purple pants, cozy cardigan, and a spare camping lantern—classic." }
      ]);
    } else if (eventName === "kidPlaySection") {
      setSideQuest("leo_sight", "done");
      startDialogue([
        { id: "kid", mood: "happy", text: "Hi! Did you see the shiny man with black wings standing by the café? Grown-ups say I'm imagining things, but he waved at me!", unlockLore: { id: "kids_purgatorio", tier: 1 } }
      ]);
    } else if (eventName === "loreJacobDiary") {
      startDialogue([
        { id: "jacob", mood: "happy", text: "My constellation notebook! I've been sketching Orion and Cassiopeia here since middle school—Cyrine always loved hearing their stories." }
      ]);
    } else if (eventName === "loreSchoolCalculus") {
      startDialogue([
        { id: "sign", mood: "neutral", text: "Mrs. Suzanna's Chalkboard: 'AP Calculus — Derivatives & Limits. Please stay awake in class, Letonin!'" }
      ]);
    } else if (eventName === "lorePromPoster") {
      startDialogue([
        { id: "sign", mood: "happy", text: "COLORADO SPRINGS HIGH SENIOR PROM — 'A Night Under the Stars' in 2 weeks! (Maybe someone will bring Lindor dark chocolate...)", unlockLore: { id: "westside_secrets", tier: 1 } }
      ]);
    } else if (eventName === "doorPhysics") {
      startDialogue([{ id: "sign", mood: "neutral", text: "Room 101 — AP Physics. The door is locked for lab prep. You can smell faint ozone through the frosted glass." }]);
    } else if (eventName === "doorLatin") {
      startDialogue([{ id: "sign", mood: "neutral", text: "Room 103 — Latin Studies. (A poster on the door reads: 'A Deo factus est...' — wait, that sounds weirdly familiar!)" }]);
    } else if (eventName === "doorGym") {
      startDialogue([{ id: "sign", mood: "neutral", text: "Colorado Springs High Gymnasium — Closed while Student Council hangs stars and fairy lights for Senior Prom!" }]);
    } else if (eventName === "loreTrophyCase") {
      startDialogue([{ id: "sign", mood: "happy", text: "CSHS Trophy Case: State Track Champions, Chess Club First Place, and Music Conservatory Honors (Daniel Flora — Piano Soloist)." }]);
    } else if (eventName === "vendingSnack") {
      window.AudioFX.heal();
      startDialogue([{ id: "jacob", mood: "happy", text: "Grabbed an ice-cold Dr. Pepper Zero from the lounge vending machine! Refreshing—HP restored!" }]);
    } else if (eventName === "candyCounter") {
      startDialogue([{ id: "candy_clerk", mood: "happy", text: "Chloe smiles from behind the counter: 'Let me know if you want a box of Lindor Dark Chocolate from the right case—they're flying off the shelves!'" }]);
    } else if (eventName === "droppedCone") {
      startDialogue([{ id: "jacob", mood: "sad", text: "A melting strawberry-and-vanilla waffle cone splattered in the corner... Moment of silence for a fallen treat." }]);
    } else if (eventName === "candySample") {
      window.AudioFX.heal();
      startDialogue([
        { id: "candy_clerk", mood: "happy", text: "Here's a free chocolate truffle filled with strawberry jam! Sweet and refreshing—HP restored!" }
      ]);
    } else if (eventName === "lindorPickup") {
      game.sideQuests.hasLindor = true;
      window.AudioFX.confirm();
      startDialogue([
        { id: "jacob", mood: "happy", text: "Picked up a box of Lindor Dark Chocolate—my absolute favorite! (Tyler outside in Westside might love some too.)" }
      ]);
    } else if (eventName === "sideQuestChocolate") {
      if (game.sideQuests.status.tyler_lindor === "done") {
        startDialogue([{ id: "student_b", mood: "happy", text: "Thanks again for the Lindor chocolates, Jacob! You're a lifesaver!" }]);
      } else if (game.sideQuests.hasLindor) {
        setSideQuest("tyler_lindor", "done");
        window.AudioFX.heal();
        startDialogue([
          { id: "student_b", mood: "happy", text: "Whoa—you actually brought Lindor Dark Chocolate from Sweet Tooth?! Side Quest Complete! Here's a tip: check the Arcade Loft next door for SNAKE.EXE!" }
        ]);
      } else {
        setSideQuest("tyler_lindor", "active");
        startDialogue([
          { id: "student_b", mood: "sad", text: "SIDE QUEST: Hey Jacob, I promised my date Lindor Dark Chocolate from Sweet Tooth Candy Store down the street, but I'm stuck waiting for my ride! Could you grab a box for me?" }
        ]);
      }
    } else if (eventName === "loreNeighborHistory") {
      setSideQuest("henderson_folklore", "done");
      startDialogue([
        { id: "neighbor", mood: "neutral", text: "Local Folklore Archive: 'For decades, hikers near Limbach Park have reported seeing dark-winged figures vanish into thin air—and hearing faint piano music on moonlit nights.'", unlockLore: { id: "westside_secrets", tier: 1 } }
      ]);
    } else if (eventName === "lorePurgWestside") {
      startDialogue([
        { id: "sign", mood: "intense", text: "Purgatorio Memory Shard: 'Even if memories are sealed by Death, two souls bound across realms will always find their way back together.'", unlockLore: { id: "purgatorio_secrets", tier: 2 } }
      ]);
    } else if (eventName === "hospitalHeal") {
      window.AudioFX.heal();
      startDialogue([{ id: "mom", mood: "happy", text: "Welcome to Colorado Springs Medical Center, sweetheart! All HP and spirit energy fully restored!" }]);
    } else if (eventName === "sleep") {
      showChoices([
        {
          label: "Sleep & Rest Here",
          action: () => {
            if (game.questStage === 3 || game.questStage === 4) {
              startDialogue(D.sleepPrompt, () => {
                advanceStage(4);
                loadMap("dream", 7, 7);
              });
            } else if (game.questStage < 3) {
              startDialogue([{ id: "jacob", mood: "neutral", text: "I should talk to Cyrine and meet Navi in the kitchen before going to sleep!" }]);
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
        advanceStage(5);
        loadMap("house", 5, 6, () => startDialogue(D.afterDreamWake));
      });
    } else if (eventName === "partyBattle") {
      startDialogue(D.partyConfrontation, () => {
        launchBattleWithStepIn(
          "partySendex",
          [
            { actorId: "navi", tx: 6, ty: 5, speed: 62 },
            { actorId: "illicero", tx: 8, ty: 5, speed: 62 }
          ],
          () => {
            advanceStage(6);
            runCutscene([
              { type: "dialogue", lines: D.partyPostBattle },
              { type: "walk", actorId: "sendex", tx: 7, ty: 10, speed: 52, hideAtEnd: true },
              { type: "wait", ms: 350 },
              { type: "dialogue", lines: D.partyAfterWalkout }
            ]);
          }
        );
      });
    } else if (eventName === "snowCatCrista") {
      if (game.questStage === 6) startDialogue(D.snowCatCrista, () => { advanceStage(7); rebuildActors(); });
      else startDialogue([{ id: "crista", mood: "happy", text: "Purr~ (Crista rubs against your leg calmly.)" }]);
    } else if (eventName === "parkAction") {
      if (game.questStage === 7) {
        startDialogue(D.parkSummonLetonin, () => { advanceStage(8); triggerEvent("parkAction"); });
      } else if (game.questStage === 8) {
        startDialogue(D.parkSoulFusion, () => {
          launchBattleWithStepIn(
            "parkSendex",
            [{ actorId: "letonin", tx: 6, ty: 4, speed: 62 }],
            () => {
              advanceStage(9);
              rebuildActors();
              markExplored(game.mapId, game.player.x, game.player.y);
              runCutscene([
                { type: "dialogue", lines: D.parkPostBattle },
                { type: "walk", actorId: "sendex", tx: 12, ty: 5, speed: 56, hideAtEnd: true }
              ]);
            }
          );
        });
      } else {
        startDialogue([{ id: "letonin", mood: "happy", text: "Go speak to Lord Death over on the left!" }]);
      }
    } else if (eventName === "deathStory") {
      if (game.questStage === 9) startDialogue(D.deathStory, () => advanceStage(10));
      else startDialogue([{ id: "death", mood: "neutral", text: "Step through the Crimson Portal on the right to confront Crepsus in Casa Grande, Arizona." }]);
    } else if (eventName === "fortressEmillia") {
      if (game.questStage === 10) startDialogue(D.fortressEmilliaDream, () => { advanceStage(11); rebuildActors(); });
      else startDialogue([{ id: "emillia", mood: "intense", text: "Let's finish Envy and Crepsus so we can finally go home!" }]);
    } else if (eventName === "envyBattle") {
      startDialogue(D.fortressEnvyIntro, () => {
        launchBattleWithStepIn(
          "fortressEnvy",
          [{ actorId: "emillia", tx: 6, ty: 7, speed: 65 }],
          () => {
            advanceStage(12);
            runCutscene([
              { type: "dialogue", lines: D.fortressEnvyPost },
              { type: "walk", actorId: "envy", tx: 13, ty: 6, speed: 46, hideAtEnd: true }
            ], () => rebuildActors());
          }
        );
      });
    } else if (eventName === "danielAscend") {
      startDialogue(D.fortressDanielAscend, () => {
        advanceStage(13);
        runCutscene([{ type: "walk", actorId: "sendex", tx: 10, ty: 2, speed: 62, hideAtEnd: true }], () => rebuildActors());
      });
    } else if (eventName === "crepsusBattle") {
      if (game.questStage < 13) {
        startDialogue([{ id: "crepsus", mood: "angry", text: "You aren't ready for me yet! Deal with my Sin and your little allies first!" }]);
        return;
      }
      startDialogue(D.fortressCrepsusIntro, () => {
        launchBattleWithStepIn(
          "fortressCrepsus",
          [{ actorId: "crepsus", tx: 7, ty: 4, speed: 50 }],
          () => {
            advanceStage(14);
            runCutscene([
              { type: "dialogue", lines: D.fortressCrepsusPost },
              { type: "walk", actorId: "crepsus", tx: 7, ty: 1, speed: 40, hideAtEnd: true }
            ], () => rebuildActors());
          }
        );
      });
    } else if (eventName === "griefResolve") {
      startDialogue(D.griefAndResolve, () => { advanceStage(15); loadMap("overworld", 12, 8); });
    } else if (eventName === "epilogueReunion") {
      startDialogue(D.epilogueReunion);
    }
  }

  // ---------------------------------------------------------
  // MOVEMENT, COLLISION & GENEROUS MOVING-NPC INTERACT HITBOX
  // ---------------------------------------------------------
  function isBlocked(px, py) {
    const map = window.Maps[game.mapId];
    const corners = [[px + 5, py + 14], [px + 18, py + 14], [px + 5, py + 23], [px + 18, py + 23]];
    for (const [cx, cy] of corners) {
      const tx = Math.floor(cx / T), ty = Math.floor(cy / T);
      if (tx < 0 || ty < 0 || tx >= map.w || ty >= map.h) return true;
      const tile = map.grid[ty][tx];
      if (tile === 1 || tile === 2 || tile === 6 || tile === 8 || tile === 9 || tile === 10 || tile === 11 || tile === 12) return true;
    }
    for (const a of game.actors) {
      if (a.hidden) continue;
      if (a.purgOnly && !game.purgatorio) continue;
      if (a.isHuman && game.purgatorio) continue; // Book-accurate: can't touch humans while in Purgatorio!
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
    // Story-based Quest-Tied Outer City Boundary Guard!
    for (const bz of map.boundaryZones || []) {
      if (ptx === bz.tx && pty === bz.ty) {
        game.player.x += (bz.pushX || 0) * T;
        game.player.y += (bz.pushY || 0) * T;
        const q = window.Story.quests[Math.min(game.questStage, window.Story.quests.length - 1)];
        const msg = q
          ? `I shouldn't leave the neighborhood right now—I need to focus on ${q.title}: ${q.objective}`
          : "I shouldn't wander too far out of Colorado Springs right now.";
        startDialogue([{ id: "jacob", mood: "neutral", text: msg }]);
        return;
      }
    }
  }

  function interact() {
    if (!game.pinUnlocked) return;
    if (window.SnakeGame.isActive()) { if (window.SnakeGame.isOver()) window.SnakeGame.start(() => setSideQuest("snake_champ", "done")); return; }
    if (!game.started) { confirmTitle(); return; }
    if (window.Battle.isActive()) { window.Battle.confirmMove(); return; }
    if (game.choice) { confirmChoice(); return; }
    if (game.settingsOpen) { cycleFocusedSetting(); return; }
    if (game.ingameMenuOpen) { closeIngameMenu(); return; }
    if (game.dialogue) { advanceDialogue(); return; }
    if (game.cutscene) return;

    const p = game.player;
    const px = p.x + 12, py = p.y + 16;
    const fx = px + (p.dir === "left" ? -22 : p.dir === "right" ? 22 : 0);
    const fy = py + (p.dir === "up" ? -22 : p.dir === "down" ? 22 : 0);

    // 1. Live NPC check: find closest live moving NPC in front OR right next to Jacob!
    let bestActor = null, bestDist = 36;
    for (const a of game.actors) {
      if (a.hidden) continue;
      if (a.purgOnly && !game.purgatorio) continue;
      if (a.isHuman && game.purgatorio) continue;
      const ax = a.x + 12, ay = a.y + 16;
      const dFront = Math.hypot(fx - ax, fy - ay);
      const dDirect = Math.hypot(px - ax, py - ay);
      const score = Math.min(dFront, dDirect + 4);
      if (score < bestDist) {
        bestDist = score;
        bestActor = a;
      }
    }
    if (bestActor) {
      const opp = { up: "down", down: "up", left: "right", right: "left" };
      bestActor.dir = opp[p.dir] || "down";
      bestActor.pauseTimer = 1.5;
      if (bestActor.event) triggerEvent(bestActor.event);
      else if (bestActor.dialogue) startDialogue(bestActor.dialogue);
      return;
    }

    // 2. Readable Yard Signposts
    const map = window.Maps[game.mapId];
    for (const s of map.signs || []) {
      if (Math.hypot(fx - (s.tx * T + 12), fy - (s.ty * T + 12)) < 26) {
        startDialogue([{ id: "sign", mood: "neutral", text: s.text }]);
        return;
      }
    }

    // 3. Interactive Furniture (Couch / Bed)
    for (const prop of map.props || []) {
      if (!prop.interact) continue;
      if (prop.purgOnly && !game.purgatorio) continue;
      const pw = (prop.kind === "couch" || prop.kind === "reception_desk" || prop.kind === "coffee_counter" || prop.kind === "candy_case" || prop.kind === "dj_booth" || prop.kind === "chalkboard" || prop.kind === "service_counter" || prop.kind === "bookshelf_wide") ? 76 : 44;
      const ph = prop.kind === "bed" ? 56 : 30;
      const px0 = prop.tx * T - 10, py0 = prop.ty * T - 10;
      if (fx >= px0 && fx <= px0 + pw + 20 && fy >= py0 && fy <= py0 + ph + 20) {
        triggerEvent(prop.interact);
        return;
      }
    }
  }

  // ---------------------------------------------------------
  // RENDERING PIPELINE (384x288 + Real Asphalt Roads + Live Arrow)
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
        if (sx < -T || sy < -T || sx > VIEW_W || sy > VIEW_H) continue;
        const tile = map.grid[y][x];
        const isExterior = (map.id === "overworld" || map.id === "westside" || map.id === "dream" || map.id === "park" || map.id === "fortress");
        if (tile === 3) {
          window.WorldArt.drawRoadTile(ctx, map, x, y, sx, sy, game.purgatorio);
        } else if (tile === 5) {
          window.WorldArt.drawSidewalkTile(ctx, sx, sy, game.purgatorio);
        } else if (tile === 9) {
          window.WorldArt.drawFenceTile(ctx, map, x, y, sx, sy, game.purgatorio);
        } else if (tile === 10) {
          window.WorldArt.drawWaterTile(ctx, x, y, sx, sy, time, map.id === "dream");
        } else if ((tile === 1 || tile === 6 || tile === 12) && !isExterior) {
          window.WorldArt.drawInteriorWallTile(ctx, map, tile, x, y, sx, sy, game.purgatorio);
        } else if (!isExterior && window.WorldArt.drawInteriorFloorTile(ctx, map.floorType, tile, x, y, sx, sy, time, game.purgatorio)) {
          // Drawn by Stardew interior floor renderer!
        } else {
          if (map.floorType === "grass") {
            window.WorldArt.drawGrassTile(ctx, x, y, sx, sy, game.purgatorio);
          } else {
            ctx.fillStyle = (x + y) % 2 === 0 ? c1 : c2;
            ctx.fillRect(sx, sy, T, T);
          }
          if (map.floorType === "dream" && (x * 7 + y * 13) % 11 === 0) {
            ctx.fillStyle = Math.sin(time * 0.005 + x) > 0 ? "#fde047" : "#38bdf8";
            ctx.fillRect(sx + 10, sy + 10, 2, 2);
          }
        }
      }
    }
  }

  // DYNAMIC QUEST BEACON — Tracks Live Moving NPC Coordinates!
  function drawQuestBeacon(map, camX, camY, time) {
    const q = window.Story.quests[game.questStage];
    if (!q) return;

    let worldX = null, worldY = null;
    const findActor = id => game.actors.find(a => a.id === id && !a.hidden);

    if (map.id === "overworld") {
      if (q.mapHint === "church") { worldX = 5 * T + 12; worldY = 5 * T; }
      else if (q.mapHint === "bookstore") { worldX = 12 * T + 12; worldY = 12 * T; }
      else if (q.mapHint === "house") { worldX = 19 * T + 12; worldY = 5 * T; }
      else if (q.mapHint === "party") { worldX = 19 * T + 12; worldY = 12 * T; }
      else if (q.mapHint === "park" || q.mapHint === "fortress") { worldX = 12 * T + 12; worldY = 2 * T; }
      else if (q.mapHint === "overworld") {
        const a = findActor("letonin");
        if (a) { worldX = a.x + 12; worldY = a.y - 4; }
      }
    } else if (map.id === "house" && q.mapHint === "house") {
      if (game.questStage === 2) {
        const a = findActor("navi");
        if (a) { worldX = a.x + 12; worldY = a.y - 4; }
      } else if (game.questStage === 3 || game.questStage === 4) {
        worldX = 3 * T + 12; worldY = 7 * T;
      } else if (game.questStage === 6) {
        const a = findActor("crista");
        if (a) { worldX = a.x + 12; worldY = a.y - 2; }
      }
    } else if (map.id === "church" && q.mapHint === "church") {
      const a = findActor("cyrine"); if (a) { worldX = a.x + 12; worldY = a.y - 4; }
    } else if (map.id === "bookstore" && q.mapHint === "bookstore") {
      const a = findActor("cyrine"); if (a) { worldX = a.x + 12; worldY = a.y - 4; }
    } else if (map.id === "dream" && q.mapHint === "dream") {
      const a = findActor("letonin"); if (a) { worldX = a.x + 12; worldY = a.y - 4; }
    } else if (map.id === "party" && q.mapHint === "party") {
      const a = findActor("sendex"); if (a) { worldX = a.x + 12; worldY = a.y - 4; }
    } else if (map.id === "park") {
      if (game.questStage === 7 || game.questStage === 8) {
        const a = findActor("letonin"); if (a) { worldX = a.x + 12; worldY = a.y - 4; }
      } else if (game.questStage === 9) {
        const a = findActor("death"); if (a) { worldX = a.x + 12; worldY = a.y - 4; }
      } else if (game.questStage >= 10) { worldX = 12 * T + 12; worldY = 5 * T; }
    } else if (map.id === "fortress") {
      const targetId = { 10: "emillia", 11: "envy", 12: "sendex", 13: "crepsus", 14: "death" }[game.questStage];
      const a = targetId ? findActor(targetId) : null;
      if (a) { worldX = a.x + 12; worldY = a.y - 4; }
    }

    if (worldX === null) return;
    const bx = worldX - camX;
    const by = worldY - 8 + Math.sin(time * 0.008) * 3 - camY;
    ctx.fillStyle = "#f5c542";
    ctx.beginPath();
    ctx.moveTo(bx, by + 8); ctx.lineTo(bx - 6, by); ctx.lineTo(bx + 6, by);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "#111"; ctx.lineWidth = 1; ctx.stroke();
  }

  function render(time) {
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);
    if (window.SnakeGame.isActive()) { window.SnakeGame.draw(ctx); return; }
    if (window.Battle.isActive()) { window.Battle.draw(ctx, time); return; }

    const map = window.Maps[game.mapId];
    const mapW = map.w * T, mapH = map.h * T;
    const camX = mapW <= VIEW_W ? -Math.floor((VIEW_W - mapW) / 2) : Math.max(0, Math.min(mapW - VIEW_W, Math.round(game.player.x + 12 - VIEW_W / 2)));
    const camY = mapH <= VIEW_H ? -Math.floor((VIEW_H - mapH) / 2) : Math.max(0, Math.min(mapH - VIEW_H, Math.round(game.player.y + 12 - VIEW_H / 2)));

    ctx.fillStyle = "#0b0d15";
    ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    drawFloor(map, camX, camY, time);

    ctx.save();
    ctx.translate(-camX, -camY);

    (map.props || []).filter(p => p.kind === "rug" || p.kind === "exit_mat").forEach(p => window.WorldArt.drawProp(ctx, p, time));
    (map.buildings || []).forEach(b => window.WorldArt.drawBuilding(ctx, b, time, game.purgatorio));
    (map.signs || []).forEach(s => window.WorldArt.drawSignpost(ctx, s.tx, s.ty));
    (map.trees || []).forEach(t => window.WorldArt.drawTree(ctx, t.tx * T, t.ty * T, t.kind, time));

    // Organic wiggly trees, fences, creek & distant city are now defined per-map!

    (map.props || []).filter(p => p.kind !== "rug" && p.kind !== "exit_mat" && (!p.purgOnly || game.purgatorio)).forEach(p => window.WorldArt.drawProp(ctx, p, time));

    (map.portals || []).forEach(p => {
      if (p.minQuest !== undefined && game.questStage < p.minQuest) return;
      window.WorldArt.drawPortal(ctx, p.tx * T + 12, p.ty * T + 12, p.style, time);
      if (p.label) {
        ctx.font = "bold 7px monospace"; ctx.fillStyle = "#fef08a";
        ctx.fillText(p.label, p.tx * T - 10, p.ty * T - 10);
      }
    });

    const drawables = [{ id: "jacob", x: game.player.x, y: game.player.y, dir: game.player.dir, frame: game.player.frame, activity: null }];
    game.actors.forEach(a => {
      if (a.hidden) return;
      if (a.purgOnly && !game.purgatorio) return;
      drawables.push(a);
    });
    drawables.sort((a, b) => a.y - b.y);
    drawables.forEach(ch => {
      ctx.save();
      if (ch.isHuman && game.purgatorio) ctx.globalAlpha = 0.35; // Book-accurate: mortal humans appear ghostly/untouchable in Purgatorio
      else if (ch.purgOnly) ctx.globalAlpha = 0.88 + Math.sin(time * 0.006) * 0.12;
      window.Sprites.drawOverworld(ctx, ch.id, ch.x, ch.y - 6, ch.dir, ch.frame, game.purgatorio, ch.activity, time);
      ctx.restore();
    });

    ctx.restore();

    if (map.id === "dream") window.WorldArt.drawDreamBackdrop(ctx, time);

    if (game.purgatorio || map.id === "park") {
      ctx.fillStyle = "rgba(76, 29, 149, 0.22)";
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      // Floating astral Purgatorio wisps
      for (let i = 0; i < 12; i++) {
        const wx = ((i * 73 + time * 0.015) % VIEW_W);
        const wy = ((i * 59 + Math.sin(time * 0.002 + i) * 18 + VIEW_H) % VIEW_H);
        ctx.fillStyle = i % 2 === 0 ? "rgba(192, 132, 252, 0.6)" : "rgba(56, 189, 248, 0.5)";
        ctx.fillRect(Math.round(wx), Math.round(wy), 2, 2);
      }
    }

    if (!game.cutscene && !game.dialogue) drawQuestBeacon(map, camX, camY, time);
  }

  // ---------------------------------------------------------
  // MAIN GAME LOOP
  // ---------------------------------------------------------
  function tick(time) {
    const dt = Math.min(0.05, (time - game.lastTime) / 1000 || 0.016);
    game.lastTime = time;
    if (game.warpCooldown > 0) game.warpCooldown = Math.max(0, game.warpCooldown - dt);

    if (window.SnakeGame.isActive()) { window.SnakeGame.update(dt); }
    else if (game.pinUnlocked && game.started && !game.ingameMenuOpen && !game.settingsOpen && !window.Battle.isActive()) {
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
          if (!isBlocked(nx, ny)) { game.player.x = nx; game.player.y = ny; markExplored(game.mapId, nx, ny); }
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

    try {
      render(time);
    } catch (err) {
      console.error("Render error:", err);
    }
    requestAnimationFrame(tick);
  }

  // ---------------------------------------------------------
  // IN-GAME MENU (Story / Party / Lore — Inside Game Screen!)
  // ---------------------------------------------------------
  function openIngameMenu(tab = "quests") {
    if (!game.started || window.Battle.isActive() || game.settingsOpen) return;
    game.ingameMenuOpen = true;
    game.ingameTab = tab;
    window.AudioFX.confirm();
    document.getElementById("ingame-menu").classList.remove("hidden");
    renderIngameTab(tab);
  }

  function closeIngameMenu() {
    game.ingameMenuOpen = false;
    window.AudioFX.cancel();
    document.getElementById("ingame-menu").classList.add("hidden");
  }

  function renderIngameTab(tab) {
    game.ingameTab = tab;
    document.querySelectorAll(".ig-tab[data-tab]").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
    const body = document.getElementById("ingame-body");
    const fog = game.settings.fogOfWar;

    if (tab === "quests") {
      body.innerHTML = window.Story.quests.map((q, i) => {
        const done = i < game.questStage, curr = i === game.questStage;
        if (fog && i > game.questStage) {
          return `<div class="menu-card fogged"><h4>🔒 ${q.act} • ${q.ch} — ???</h4><p>Undiscovered chapter.</p></div>`;
        }
        return `<div class="menu-card ${curr ? "focused" : ""}">
          <h4><span>${done ? "✓ " : curr ? "▶ " : ""}${q.act} • ${q.ch} — ${q.title}</span></h4>
          <p>${q.objective}</p>
        </div>`;
      }).join("");
    } else if (tab === "side") {
      const defs = window.Story.sideQuestDefs || [];
      body.innerHTML = defs.map(sq => {
        const st = game.sideQuests.status[sq.id] || null;
        if (fog && !st) {
          return `<div class="menu-card fogged"><h4><span>🔒 ???</span><span class="sq-badge locked">UNDISCOVERED</span></h4><p>Explore Colorado Springs &amp; Westside to discover this side quest.</p></div>`;
        }
        const badge = st === "done"
          ? `<span class="sq-badge done">✓ COMPLETED</span>`
          : st === "active"
            ? `<span class="sq-badge active">▶ ACTIVE</span>`
            : `<span class="sq-badge locked">AVAILABLE</span>`;
        return `<div class="menu-card ${st === "active" ? "focused" : ""}">
          <h4><span>${sq.title}</span>${badge}</h4>
          <p><strong>${sq.giver}:</strong> ${sq.objective}</p>
        </div>`;
      }).join("");
    } else if (tab === "map") {
      const map = window.Maps[game.mapId];
      const visitedMaps = Object.keys(game.explored || {});
      const districts = ["overworld", "westside", "park", "fortress"];
      const foundCount = districts.filter(d => visitedMaps.includes(d) || game.mapId === d).length;
      body.innerHTML = `
        <div class="minimap-wrap">
          <div class="minimap-header">
            <span>🗺 Colorado Springs Regional Map</span>
            <span>${fog ? `Zones: ${foundCount}/${districts.length}` : "Full Atlas"}</span>
          </div>
          <canvas id="minimap-canvas" width="480" height="300"></canvas>
          <div class="minimap-legend">
            <span><i class="mm-dot" style="background:#facc15;border-radius:50%"></i>You (${map.name})</span>
            <span><i class="mm-dot" style="background:#38bdf8"></i>Landmarks</span>
            <span><i class="mm-dot" style="background:#a855f7"></i>Realms</span>
            <span><i class="mm-dot" style="background:#1e1b4b;border:1px solid #6366f1"></i>Fog of War</span>
          </div>
        </div>`;
      window.RegionalMap.draw(game, fog);
    } else if (tab === "party") {
      body.innerHTML = window.Story.partyOrder.map(id => {
        const p = window.PALETTES[id];
        if (fog && !game.discoveredParty.includes(id)) {
          return `<div class="menu-card fogged"><h4>???</h4><p>You have not met this character yet.</p></div>`;
        }
        const role = (game.questStage >= 6 && p.trueRole) ? p.trueRole : p.role;
        return `<div class="menu-card"><h4>${p.name}</h4><p>${role}</p></div>`;
      }).join("");
    } else if (tab === "lore") {
      body.innerHTML = window.Story.loreDefs.map(def => {
        const tier = game.loreTiers[def.id] || 0;
        const showTier = fog ? tier : def.tiers.length;
        if (showTier === 0) {
          return `<div class="menu-card fogged"><h4>???</h4><p>Talk to characters to uncover this lore.</p></div>`;
        }
        const entries = def.tiers.slice(0, showTier).map((t, idx) => `<p style="margin-top:${idx ? 4 : 0}px">${idx > 0 ? "↳ " : ""}${t}</p>`).join("");
        return `<div class="menu-card">
          <h4><span>${def.title}</span><span class="badge-tier">Tier ${showTier}/${def.tiers.length}</span></h4>
          ${entries}
        </div>`;
      }).join("");
    }
  }


  // ---------------------------------------------------------
  // FULL-SCREEN SETTINGS OVERLAY (All Options as Selectable Pills!)
  // ---------------------------------------------------------
  function openSettings() {
    if (!game.pinUnlocked) return;
    if (game.ingameMenuOpen) closeIngameMenu();
    game.settingsOpen = true;
    game.settingFocusRow = 0;
    window.AudioFX.confirm();
    document.getElementById("settings-overlay").classList.remove("hidden");
    renderSettings();
  }

  function closeSettings() {
    game.settingsOpen = false;
    window.AudioFX.cancel();
    document.getElementById("settings-overlay").classList.add("hidden");
  }

  function renderSettings() {
    const body = document.getElementById("settings-body");
    const s = game.settings;

    const sections = [
      {
        title: "Audio Volume",
        desc: "Toggle 32-bit retro sound effects.",
        info: "Controls all synthesized GBA-style sound effects including menu clicks, dialogue blips, battle attacks, healing chimes, portal warps, and Lore/Quest popups.",
        pills: [
          { label: "ON", active: s.volume, onClick: () => { s.volume = true; window.AudioFX.setEnabled(true); } },
          { label: "OFF", active: !s.volume, onClick: () => { s.volume = false; window.AudioFX.setEnabled(false); } }
        ]
      },
      {
        title: "Run Mode (B Button)",
        desc: s.runByDefault ? "Running by default — hold B to walk." : "Walking normally — hold B to sprint.",
        info: "When OFF, Jacob walks normally and sprints while you hold B (or Shift). Turn ON to auto-run everywhere and hold B whenever you want to walk slowly.",
        pills: [
          { label: "Hold B to Run", active: !s.runByDefault, onClick: () => { s.runByDefault = false; applyAppearance(); } },
          { label: "Run by Default", active: s.runByDefault, onClick: () => { s.runByDefault = true; applyAppearance(); } }
        ]
      },
      {
        title: "Gamepad Button Size",
        desc: "Adjusts D-Pad & A/B button scale.",
        info: "Resizes the on-screen handheld D-pad and A/B buttons for comfort on small phones, Fold displays, or landscape GBA mode—always clamped to stay on screen.",
        pills: [
          { label: "Small", active: s.buttonSize === "small", onClick: () => { s.buttonSize = "small"; applyAppearance(); } },
          { label: "Medium", active: s.buttonSize === "medium", onClick: () => { s.buttonSize = "medium"; applyAppearance(); } },
          { label: "Large", active: s.buttonSize === "large", onClick: () => { s.buttonSize = "large"; applyAppearance(); } }
        ]
      },
      {
        title: "Device Color Style",
        desc: "Change handheld shell & settings theme.",
        info: "Customizes the color of the entire handheld console shell, top bar, buttons, and this Settings screen. Burnt Orange ★ is the default special edition finish.",
        pills: THEMES.map(t => ({
          label: t.label,
          swatch: t.swatch,
          active: s.theme === t.id,
          onClick: () => { s.theme = t.id; applyAppearance(); }
        }))
      },
      {
        title: "Enable Fog of War",
        desc: "Controls mystery fog across Menus & Mini-Map.",
        info: "When ON (default), undiscovered Story chapters, Side Quests, unmet Party members, unlearned Lore, the Purgatorio button, and unexplored Mini-Map areas appear as ??? until you discover them. Turn OFF to reveal everything immediately.",
        pills: [
          { label: "ON (Default)", active: s.fogOfWar, onClick: () => { s.fogOfWar = true; updatePurgatorioBtn(); } },
          { label: "OFF (Reveal All)", active: !s.fogOfWar, onClick: () => { s.fogOfWar = false; updatePurgatorioBtn(); } }
        ]
      },
      {
        title: "Reset Save Data",
        desc: "Erase saved progress & restart from Ch. I.",
        info: "Your game auto-saves whenever you enter a building, complete a chapter, discover lore, or change settings. Use this button to wipe your save and start a fresh journey.",
        pills: [
          {
            label: "Reset Save & Play Again",
            danger: true,
            onClick: () => {
              closeSettings();
              showChoices([
                { label: "Yes, Reset & Start Over", action: () => { localStorage.removeItem(SAVE_KEY); location.reload(); } },
                { label: "Cancel", action: () => {} }
              ]);
            }
          }
        ]
      }
    ];

    body.innerHTML = "";
    sections.forEach((sec, rIdx) => {
      const card = document.createElement("div");
      card.className = "setting-section" + (rIdx === game.settingFocusRow ? " focused" : "");
      const isInfoOpen = game.openInfoRow === rIdx;

      const head = document.createElement("div");
      head.className = "setting-head-row";
      head.innerHTML = `<div class="setting-title">${rIdx === game.settingFocusRow ? "▶ " : ""}${sec.title}</div>`;
      const infoBtn = document.createElement("button");
      infoBtn.className = "info-btn" + (isInfoOpen ? " open" : "");
      infoBtn.textContent = "i";
      infoBtn.title = "More info about " + sec.title;
      infoBtn.onclick = e => {
        e.stopPropagation();
        window.AudioFX.cursor();
        game.openInfoRow = isInfoOpen ? -1 : rIdx;
        renderSettings();
      };
      head.appendChild(infoBtn);
      card.appendChild(head);

      const descEl = document.createElement("div");
      descEl.className = "setting-desc";
      descEl.textContent = sec.desc;
      card.appendChild(descEl);

      if (isInfoOpen) {
        const box = document.createElement("div");
        box.className = "setting-info-box";
        box.textContent = sec.info;
        card.appendChild(box);
      }
      const row = document.createElement("div");
      row.className = "option-pills";
      sec.pills.forEach(p => {
        const btn = document.createElement("button");
        btn.className = "opt-btn" + (p.active ? " active" : "") + (p.danger ? " danger" : "");
        btn.innerHTML = `${p.swatch ? `<span class="theme-swatch" style="background:${p.swatch}"></span>` : ""}${p.label}`;
        btn.onclick = () => {
          game.settingFocusRow = rIdx;
          p.onClick();
          window.AudioFX.confirm();
          saveProgress();
          if (game.settingsOpen) renderSettings();
        };
        row.appendChild(btn);
      });
      card.appendChild(row);
      body.appendChild(card);
    });
  }

  function cycleFocusedSetting(delta = 1) {
    const s = game.settings;
    if (game.settingFocusRow === 0) { s.volume = !s.volume; window.AudioFX.setEnabled(s.volume); }
    else if (game.settingFocusRow === 1) { s.runByDefault = !s.runByDefault; applyAppearance(); }
    else if (game.settingFocusRow === 2) {
      const sz = ["small", "medium", "large"];
      s.buttonSize = sz[(sz.indexOf(s.buttonSize) + delta + sz.length) % sz.length];
      applyAppearance();
    } else if (game.settingFocusRow === 3) {
      const idx = THEMES.findIndex(t => t.id === s.theme);
      s.theme = THEMES[(idx + delta + THEMES.length) % THEMES.length].id;
      applyAppearance();
    } else if (game.settingFocusRow === 4) {
      s.fogOfWar = !s.fogOfWar;
    } else if (game.settingFocusRow === 5) {
      closeSettings();
      showChoices([
        { label: "Yes, Reset & Start Over", action: () => { localStorage.removeItem(SAVE_KEY); location.reload(); } },
        { label: "Cancel", action: () => {} }
      ]);
      return;
    }
    window.AudioFX.confirm();
    saveProgress();
    renderSettings();
  }

  // ---------------------------------------------------------
  // TITLE SCREEN & UNIFIED D-PAD DISPATCHER
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

  function onDpadPress(dir) {
    if (!game.pinUnlocked) return;
    if (!game.started) {
      const hasSave = !document.getElementById("btn-continue").classList.contains("hidden");
      if (hasSave && (dir === "left" || dir === "right" || dir === "up" || dir === "down")) {
        game.titleFocus = game.titleFocus === 0 ? 1 : 0;
        window.AudioFX.cursor();
        updateTitleFocus();
      }
      return;
    }
    if (window.SnakeGame.isActive()) { window.SnakeGame.setDir(dir); return; }
    if (window.Battle.isActive()) { window.Battle.moveFocus(dir); return; }
    if (game.choice) {
      if (dir === "up") moveChoice(-1);
      else if (dir === "down") moveChoice(1);
      return;
    }
    if (game.settingsOpen) {
      if (dir === "up") { game.settingFocusRow = (game.settingFocusRow + 5) % 6; window.AudioFX.cursor(); renderSettings(); }
      else if (dir === "down") { game.settingFocusRow = (game.settingFocusRow + 1) % 6; window.AudioFX.cursor(); renderSettings(); }
      else if (dir === "left") cycleFocusedSetting(-1);
      else if (dir === "right") cycleFocusedSetting(1);
      return;
    }
    if (game.ingameMenuOpen) {
      if (dir === "left" || dir === "right") {
        const idx = IG_TABS.indexOf(game.ingameTab);
        const next = IG_TABS[(idx + (dir === "right" ? 1 : -1) + IG_TABS.length) % IG_TABS.length];
        window.AudioFX.cursor();
        renderIngameTab(next);
      } else {
        const body = document.getElementById("ingame-body");
        if (dir === "up") body.scrollTop -= 48;
        else if (dir === "down") body.scrollTop += 48;
      }
      return;
    }
    game.input[dir] = true;
  }

  function onDpadRelease(dir) { game.input[dir] = false; }

  // ---------------------------------------------------------
  // AUTO-SAVE / LOAD
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
        sideQuests: game.sideQuests,
        explored: game.explored,
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
    loadMap("overworld", 12, 7, () => startDialogue(window.Story.dialogues.intro));
  }

  function startContinue() {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    document.getElementById("title-screen").classList.add("hidden");
    game.started = true;
    game.questStage = s.questStage || 0;
    game.discoveredParty = s.discoveredParty || ["jacob"];
    game.loreTiers = s.loreTiers || {};
    if (s.sideQuests) game.sideQuests = { hasLindor: !!s.sideQuests.hasLindor, status: s.sideQuests.status || {} };
    game.explored = s.explored || {};
    if (s.settings) {
      game.settings = { ...game.settings, ...s.settings };
      window.AudioFX.setEnabled(game.settings.volume);
      applyAppearance();
    }
    loadMap(s.mapId || "overworld", Math.round((s.x || 288) / T), Math.round((s.y || 216) / T));
  }

  // ---------------------------------------------------------
  // EVENT BINDINGS
  // ---------------------------------------------------------
  document.querySelectorAll(".dpad-btn").forEach(btn => {
    const dir = btn.dataset.dir;
    btn.addEventListener("pointerdown", e => { e.preventDefault(); btn.classList.add("pressed"); onDpadPress(dir); });
    const release = () => { btn.classList.remove("pressed"); onDpadRelease(dir); };
    btn.addEventListener("pointerup", release);
    btn.addEventListener("pointerleave", release);
    btn.addEventListener("pointercancel", release);
  });

  const btnA = document.getElementById("btn-a");
  btnA.addEventListener("pointerdown", e => {
    e.preventDefault();
    btnA.classList.add("pressed");
    interact();
  });
  const releaseA = () => btnA.classList.remove("pressed");
  btnA.addEventListener("pointerup", releaseA);
  btnA.addEventListener("pointerleave", releaseA);
  btnA.addEventListener("pointercancel", releaseA);

  // Prevent long-press text selection / context menu popup on handheld buttons
  document.querySelectorAll(".dpad-btn, .round-btn, .pill-btn, #dpad-well, #ab-well").forEach(el => {
    el.addEventListener("contextmenu", e => e.preventDefault());
  });
  document.getElementById("dialogue-box").addEventListener("click", advanceDialogue);

  const btnB = document.getElementById("btn-b");
  btnB.addEventListener("pointerdown", e => {
    e.preventDefault();
    btnB.classList.add("pressed");
    game.input.run = true;
    if (!relOverlay.classList.contains("hidden")) closeReleaseNotes();
    else if (window.SnakeGame.isActive()) window.SnakeGame.exit();
    else if (game.choice) cancelChoice();
    else if (game.settingsOpen) closeSettings();
    else if (game.ingameMenuOpen) closeIngameMenu();
    else if (game.dialogue) advanceDialogue();
  });
  const releaseB = () => { btnB.classList.remove("pressed"); game.input.run = false; };
  btnB.addEventListener("pointerup", releaseB);
  btnB.addEventListener("pointerleave", releaseB);
  btnB.addEventListener("pointercancel", releaseB);

  document.getElementById("btn-realm").addEventListener("click", e => {
    if (!game.started || !game.pinUnlocked || window.Battle.isActive()) return;
    if (!isPurgatorioUnlocked()) {
      window.AudioFX.cancel();
      if (!game.dialogue && !game.cutscene) {
        startDialogue([{ id: "jacob", mood: "neutral", text: "You feel a strange chill in the air... (Advance the story to Ch. VIII at Limbach Park to unlock Purgatorio!)" }]);
      }
      return;
    }
    game.purgatorio = !game.purgatorio;
    window.AudioFX.portal();
    e.currentTarget.classList.toggle("active", game.purgatorio);
    document.getElementById("location-pill").textContent = window.Maps[game.mapId].name + (game.purgatorio ? " (Purgatorio)" : "");
  });

  document.getElementById("progress-hud").addEventListener("click", () => openIngameMenu("quests"));
  document.getElementById("btn-menu").addEventListener("click", () => game.ingameMenuOpen ? closeIngameMenu() : openIngameMenu("quests"));
  document.getElementById("ig-close").addEventListener("click", closeIngameMenu);
  document.getElementById("ig-settings-shortcut").addEventListener("click", openSettings);
  document.querySelectorAll(".ig-tab[data-tab]").forEach(b => b.addEventListener("click", () => { window.AudioFX.cursor(); renderIngameTab(b.dataset.tab); }));

  document.getElementById("btn-settings-top").addEventListener("click", () => game.settingsOpen ? closeSettings() : openSettings());
  document.getElementById("settings-close").addEventListener("click", closeSettings);
  // Release Notes Modal Wiring
  const relOverlay = document.getElementById("release-overlay");
  const openReleaseNotes = () => { window.AudioFX.confirm(); relOverlay.classList.remove("hidden"); };
  const closeReleaseNotes = () => { window.AudioFX.cancel(); relOverlay.classList.add("hidden"); };
  document.getElementById("btn-release-notes").addEventListener("click", openReleaseNotes);
  document.getElementById("release-close").addEventListener("click", closeReleaseNotes);


  const keyMap = { ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down", ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right" };
  window.addEventListener("keydown", e => {
    if (!game.pinUnlocked) return;
    if (keyMap[e.code]) { if (!e.repeat || (!game.ingameMenuOpen && !game.settingsOpen)) onDpadPress(keyMap[e.code]); e.preventDefault(); }
    if (e.code === "KeyZ" || e.code === "Enter" || e.code === "Space") { interact(); e.preventDefault(); }
    if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyX") {
      game.input.run = true;
      if (e.code === "KeyX" && !e.repeat) {
        if (!relOverlay.classList.contains("hidden")) closeReleaseNotes();
    else if (window.SnakeGame.isActive()) window.SnakeGame.exit();
    else if (game.choice) cancelChoice();
        else if (game.settingsOpen) closeSettings();
        else if (game.ingameMenuOpen) closeIngameMenu();
      }
    }
    if (e.code === "Escape") {
      if (!relOverlay.classList.contains("hidden")) closeReleaseNotes();
    else if (window.SnakeGame.isActive()) window.SnakeGame.exit();
    else if (game.choice) cancelChoice();
      else if (game.settingsOpen) closeSettings();
      else if (game.ingameMenuOpen) closeIngameMenu();
    }
    if (e.code === "KeyM") { game.ingameMenuOpen ? closeIngameMenu() : openIngameMenu("quests"); }
  });
  window.addEventListener("keyup", e => {
    if (keyMap[e.code]) onDpadRelease(keyMap[e.code]);
    if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.code === "KeyX") game.input.run = false;
  });

  // Boot Sequence
  initPinGate();
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
