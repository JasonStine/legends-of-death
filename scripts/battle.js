// =========================================================
// scripts/battle.js — Full-Body 32-Bit GBA Turn-Based Battle
//                     with D-Pad / A Button Grid Navigation
// =========================================================
window.Battle = (() => {
  const ui = () => document.getElementById("battle-ui");
  const logEl = () => document.getElementById("battle-log");
  const actionsEl = () => document.getElementById("battle-actions");
  const partyHudEl = () => document.getElementById("battle-party-hud");

  let active = false;
  let state = null;
  let onComplete = null;
  let vfx = [];
  let shake = 0;

  const ENCOUNTERS = {
    partySendex: {
      bg: "party",
      enemy: { id: "sendex", name: "Sendex (Possessed)", lv: 18, hp: 165, maxHp: 165, atk: 24, moves: ["Ultor Fire Whip", "Rage Sensory", "Blazing Lash"] },
      party: [
        {
          id: "navi", name: "Navi", role: "Lightning", hp: 130, maxHp: 130,
          moves: [
            { name: "Tonitrus Fragor", desc: "Lightning Strike", dmg: [28, 38], color: "#38bdf8" },
            { name: "Electric Halberd", desc: "Heavy Slash", dmg: [22, 32], color: "#facc15" },
            { name: "Rune Trap", desc: "Zap + Debuff", dmg: [20, 26], color: "#a78bfa" },
            { name: "Guard Aura", desc: "Restore 35 HP", heal: 35, color: "#4ade80" }
          ]
        },
        {
          id: "illicero", name: "Illicero", role: "Soul Rapier", hp: 140, maxHp: 140,
          moves: [
            { name: "Coronzon Thrust", desc: "Demon-Soul Blade", dmg: [30, 42], color: "#f43f5e" },
            { name: "Soul Sensory", desc: "Calm & Heal Party", healAll: 28, color: "#fbbf24" },
            { name: "Wing Dive", desc: "Aerial Strike", dmg: [24, 34], color: "#e879f9" },
            { name: "Vape Smoke", desc: "Focus + Crit", dmg: [26, 36], color: "#c084fc" }
          ]
        }
      ]
    },

    parkSendex: {
      bg: "purgatorio",
      enemy: { id: "sendex", name: "Sendex (Branded)", lv: 22, hp: 210, maxHp: 210, atk: 28, moves: ["Telum Resonatur", "Thorn Whip", "Crepsus Surge"] },
      party: [
        {
          id: "illicero", name: "Jacob+Illicero", role: "Soul Fused", hp: 165, maxHp: 165,
          moves: [
            { name: "Fused Soul Bow", desc: "Jacob Aim + Bolt", dmg: [36, 48], color: "#facc15" },
            { name: "Nephilim Heal", desc: "Heal Both 45 HP", healAll: 45, color: "#4ade80" },
            { name: "Agility Boost", desc: "Rapid Strike", dmg: [30, 38], color: "#38bdf8" },
            { name: "Shatter Brand", desc: "Purifying Light", dmg: [34, 44], color: "#fef08a" }
          ]
        },
        {
          id: "letonin", name: "Letonin", role: "Dream Mallet", hp: 155, maxHp: 155,
          moves: [
            { name: "Obsidian Mallet", desc: "Nightmare Smash", dmg: [35, 46], color: "#c084fc" },
            { name: "Celestial Freeze", desc: "Ice Chains", dmg: [28, 38], color: "#38bdf8" },
            { name: "Dream Shield", desc: "Restore 40 HP", heal: 40, color: "#a78bfa" },
            { name: "Ring of Night", desc: "Psychic Burst", dmg: [32, 42], color: "#818cf8" }
          ]
        }
      ]
    },

    fortressEnvy: {
      bg: "bloodmoon",
      enemy: { id: "envy", name: "Envy (Divine Sin)", lv: 26, hp: 260, maxHp: 260, atk: 32, moves: ["Iris Venom Fang", "Serpent Coil", "Toxic Mist"] },
      party: [
        {
          id: "navi", name: "Navi", role: "Mana-Linked", hp: 170, maxHp: 170,
          moves: [
            { name: "Fulgur de Praeda", desc: "Mega Storm", dmg: [42, 56], color: "#38bdf8" },
            { name: "Compass Strike", desc: "Deadly Accuracy", dmg: [32, 42], color: "#facc15" },
            { name: "Mana Surge", desc: "Heal Both 40 HP", healAll: 40, color: "#4ade80" },
            { name: "Lightning Spear", desc: "Piercing Bolt", dmg: [36, 46], color: "#60a5fa" }
          ]
        },
        {
          id: "emillia", name: "Emillia", role: "Siren Princess", hp: 165, maxHp: 165,
          moves: [
            { name: "Royal Voice", desc: "Absolute Command", dmg: [44, 58], color: "#f472b6" },
            { name: "Greek Vine Bind", desc: "Thorn Roots", dmg: [30, 40], color: "#22c55e" },
            { name: "Phantasm Decoy", desc: "Illusion Slash", dmg: [34, 44], color: "#c084fc" },
            { name: "Siren Sickle", desc: "Swift Cut", dmg: [28, 38], color: "#fb7185" }
          ]
        }
      ]
    },

    fortressCrepsus: {
      bg: "bloodmoon",
      enemy: { id: "crepsus", name: "Crepsus (Hybrid)", lv: 30, hp: 310, maxHp: 310, atk: 35, moves: ["Life-Drain Rake", "Messes Luna", "Corrupted Wing"] },
      party: [
        {
          id: "cyrine", name: "Cyrine", role: "Deicide Profugo", hp: 190, maxHp: 190,
          moves: [
            { name: "Pyronecrosis", desc: "Godslayer Flames", dmg: [48, 64], color: "#ef4444" },
            { name: "Ancestral Call", desc: "Family Spirits!", dmg: [44, 58], color: "#f59e0b" },
            { name: "Bone-Armor Fist", desc: "Crushing Blow", dmg: [38, 48], color: "#e2e8f0" },
            { name: "Shadow Claws", desc: "Frenzied Slash", dmg: [36, 46], color: "#a855f7" }
          ]
        },
        {
          id: "jacob", name: "Jacob", role: "Nephilim Light", hp: 180, maxHp: 180,
          moves: [
            { name: "Divine Heal", desc: "Heal Both 60 HP", healAll: 60, color: "#4ade80" },
            { name: "Soul Amplify", desc: "Radiant Blast", dmg: [36, 48], color: "#facc15" },
            { name: "Squire Bond", desc: "Daniel's Piano!", dmg: [42, 54], color: "#fef08a" },
            { name: "Ring Pulse", desc: "Stagger Boss", dmg: [30, 40], color: "#38bdf8" }
          ]
        }
      ]
    }
  };

  function start(encounterKey, cb) {
    const tpl = ENCOUNTERS[encounterKey];
    if (!tpl) { if (cb) cb(true); return; }
    active = true;
    onComplete = cb;
    vfx = [];
    shake = 0;

    state = {
      bg: tpl.bg,
      enemy: { ...tpl.enemy, lunge: 0, flash: 0 },
      party: tpl.party.map(m => ({ ...m, lunge: 0, flash: 0 })),
      turnIdx: 0,
      focusIdx: 0,
      busy: false
    };

    ui().classList.remove("hidden");
    renderHud();
    setLog(`${state.enemy.name} stands before you! Choose ${state.party[0].name}'s move!`);
    renderMoves();
  }

  function setLog(msg) { logEl().textContent = msg; }

  function renderHud() {
    const e = state.enemy;
    document.getElementById("enemy-name").textContent = e.name;
    document.getElementById("enemy-tag").textContent = "Lv." + e.lv;
    const epct = Math.max(0, (e.hp / e.maxHp) * 100);
    const eFill = document.getElementById("enemy-hp-fill");
    eFill.style.width = epct + "%";
    eFill.style.background = epct < 25 ? "#ef4444" : (epct < 55 ? "#f59e0b" : "#22c55e");
    document.getElementById("enemy-hp-text").textContent = `${Math.max(0, e.hp)} / ${e.maxHp}`;

    partyHudEl().innerHTML = state.party.map((m, i) => {
      const pct = Math.max(0, (m.hp / m.maxHp) * 100);
      const col = pct < 25 ? "#ef4444" : (pct < 55 ? "#f59e0b" : "#22c55e");
      const activeCls = (!state.busy && state.turnIdx === i && m.hp > 0) ? "active-turn" : "";
      return `
        <div class="stat-card party-card ${activeCls}">
          <div class="stat-row">
            <span>${m.name}</span>
            <span style="color:#93c5fd;font-size:0.85em">${m.role}</span>
          </div>
          <div class="hp-bar-bg"><div class="hp-bar-fill" style="width:${pct}%;background:${col}"></div></div>
          <div class="hp-text">${Math.max(0, m.hp)} / ${m.maxHp}</div>
        </div>
      `;
    }).join("");
  }

  function renderMoves() {
    const actor = state.party[state.turnIdx];
    actionsEl().innerHTML = actor.moves.map((mv, idx) => `
      <button class="move-btn ${idx === state.focusIdx ? "focused" : ""}" ${state.busy ? "disabled" : ""} data-idx="${idx}">
        <span>${idx === state.focusIdx ? "▶ " : ""}${mv.name}</span>
        <small>${mv.desc}</small>
      </button>
    `).join("");

    actionsEl().querySelectorAll(".move-btn").forEach(btn => {
      btn.onclick = () => {
        state.focusIdx = Number(btn.dataset.idx);
        useMove(state.focusIdx);
      };
    });
  }

  // Full D-Pad + A button navigation for the 2x2 battle move grid
  function moveFocus(dir) {
    if (!active || !state || state.busy) return;
    const prev = state.focusIdx;
    if (dir === "right" && state.focusIdx % 2 === 0) state.focusIdx++;
    else if (dir === "left" && state.focusIdx % 2 === 1) state.focusIdx--;
    else if (dir === "down" && state.focusIdx < 2) state.focusIdx += 2;
    else if (dir === "up" && state.focusIdx >= 2) state.focusIdx -= 2;
    if (prev !== state.focusIdx) {
      window.AudioFX.cursor();
      renderMoves();
    }
  }

  function confirmMove() {
    if (!active || !state || state.busy) return;
    useMove(state.focusIdx);
  }

  function spawnVfx(x, y, color) {
    for (let i = 0; i < 16; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 1 + Math.random() * 2.8;
      vfx.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 24, color });
    }
  }

  function useMove(idx) {
    if (state.busy) return;
    state.busy = true;
    const actor = state.party[state.turnIdx];
    const mv = actor.moves[idx];
    renderMoves();

    actor.lunge = 26;
    setTimeout(() => { actor.lunge = 0; }, 220);

    if (mv.healAll) {
      state.party.forEach(p => { if (p.hp > 0) p.hp = Math.min(p.maxHp, p.hp + mv.healAll); });
      window.AudioFX.heal();
      spawnVfx(105, 148, mv.color);
      setLog(`${actor.name} used ${mv.name}! Restored ${mv.healAll} HP to the team!`);
    } else if (mv.heal) {
      actor.hp = Math.min(actor.maxHp, actor.hp + mv.heal);
      window.AudioFX.heal();
      spawnVfx(95 + state.turnIdx * 45, 148, mv.color);
      setLog(`${actor.name} used ${mv.name} and recovered ${mv.heal} HP!`);
    } else {
      const dmg = Math.floor(mv.dmg[0] + Math.random() * (mv.dmg[1] - mv.dmg[0] + 1));
      state.enemy.hp = Math.max(0, state.enemy.hp - dmg);
      state.enemy.flash = 14;
      shake = 10;
      window.AudioFX.hit();
      spawnVfx(290, 96, mv.color);
      setLog(`${actor.name} unleashed ${mv.name} for ${dmg} damage!`);
    }

    renderHud();

    setTimeout(() => {
      if (state.enemy.hp <= 0) {
        setLog(`${state.enemy.name} was defeated! Entering cutscene...`);
        setTimeout(() => finish(true), 900);
        return;
      }

      if (state.turnIdx === 0 && state.party[1] && state.party[1].hp > 0) {
        state.turnIdx = 1;
        state.focusIdx = 0;
        state.busy = false;
        setLog(`Now choose ${state.party[1].name}'s move!`);
        renderHud();
        renderMoves();
      } else {
        enemyTurn();
      }
    }, 820);
  }

  function enemyTurn() {
    const e = state.enemy;
    const alive = state.party.filter(p => p.hp > 0);
    const target = alive[Math.floor(Math.random() * alive.length)];
    const moveName = e.moves[Math.floor(Math.random() * e.moves.length)];
    const dmg = Math.max(10, Math.floor(e.atk * (0.85 + Math.random() * 0.35)));

    e.lunge = 26;
    setTimeout(() => { e.lunge = 0; }, 220);

    target.hp = Math.max(0, target.hp - dmg);
    target.flash = 14;
    shake = 10;
    window.AudioFX.hit();
    spawnVfx(100, 148, "#ef4444");
    setLog(`${e.name} used ${moveName} on ${target.name} for ${dmg} damage!`);
    renderHud();

    setTimeout(() => {
      if (state.party.every(p => p.hp <= 0)) {
        state.party.forEach(p => { p.hp = Math.floor(p.maxHp * 0.65); });
        window.AudioFX.heal();
        setLog("Jacob's Nephilim soul surges with golden light, reviving the team!");
        renderHud();
      }
      state.turnIdx = state.party[0].hp > 0 ? 0 : 1;
      state.focusIdx = 0;
      state.busy = false;
      renderHud();
      renderMoves();
    }, 900);
  }

  function finish(won) {
    active = false;
    ui().classList.add("hidden");
    const cb = onComplete;
    onComplete = null;
    if (cb) cb(won);
  }

  function draw(ctx, time) {
    if (!active || !state) return;
    ctx.save();
    if (shake > 0) {
      ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
      shake *= 0.82;
      if (shake < 0.5) shake = 0;
    }

    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    if (state.bg === "bloodmoon") {
      grad.addColorStop(0, "#2b050b"); grad.addColorStop(0.55, "#7f1d1d"); grad.addColorStop(1, "#1c1917");
    } else if (state.bg === "party") {
      grad.addColorStop(0, "#1e1b4b"); grad.addColorStop(0.55, "#4c1d95"); grad.addColorStop(1, "#0f172a");
    } else {
      grad.addColorStop(0, "#0f172a"); grad.addColorStop(0.55, "#312e81"); grad.addColorStop(1, "#1e293b");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 384, 256);

    if (state.bg === "bloodmoon") {
      ctx.fillStyle = "#ef4444";
      ctx.beginPath(); ctx.arc(192, 46, 26, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "rgba(254, 202, 202, 0.25)";
      ctx.beginPath(); ctx.arc(192, 46, 34, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.65)";
      for (let i = 0; i < 20; i++) ctx.fillRect((i * 53) % 380, (i * 29) % 100, 2, 2);
    }

    ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
    ctx.beginPath(); ctx.ellipse(290, 134, 62, 16, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#f5c542"; ctx.lineWidth = 2; ctx.stroke();

    ctx.fillStyle = "rgba(15, 23, 42, 0.72)";
    ctx.beginPath(); ctx.ellipse(104, 178, 78, 18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#38bdf8"; ctx.lineWidth = 2; ctx.stroke();

    if (state.enemy.flash > 0) state.enemy.flash--;
    window.Sprites.drawBattleModel(ctx, state.enemy.id, 290, 98, true, time, state.enemy.lunge, state.enemy.flash > 0);

    state.party.forEach((p, idx) => {
      if (p.hp <= 0) return;
      if (p.flash > 0) p.flash--;
      const px = idx === 0 ? 74 : 134;
      const py = idx === 0 ? 140 : 148;
      window.Sprites.drawBattleModel(ctx, p.id, px, py, false, time + idx * 400, p.lunge, p.flash > 0);
    });

    for (let i = vfx.length - 1; i >= 0; i--) {
      const pt = vfx[i];
      pt.x += pt.vx; pt.y += pt.vy; pt.life--;
      ctx.fillStyle = pt.color;
      ctx.fillRect(Math.round(pt.x), Math.round(pt.y), 4, 4);
      if (pt.life <= 0) vfx.splice(i, 1);
    }

    ctx.restore();
  }

  return { start, draw, moveFocus, confirmMove, isActive: () => active };
})();
