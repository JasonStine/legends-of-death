// =========================================================
// scripts/snake.js — Playable Retro SNAKE.EXE Mini-Game
// =========================================================
window.SnakeGame = (() => {
  const VIEW_W = 384, VIEW_H = 288;
  const s = {
    active: false, gridW: 24, gridH: 15, body: [],
    dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: { x: 15, y: 7 },
    score: 0, best: Number(localStorage.getItem("lod_snake_best") || 0),
    timer: 0, over: false, onHighScore: null
  };

  function start(onHighScore) {
    s.active = true; s.over = false; s.score = 0; s.onHighScore = onHighScore || null;
    s.dir = { x: 1, y: 0 }; s.nextDir = { x: 1, y: 0 };
    s.body = [{ x: 8, y: 7 }, { x: 7, y: 7 }, { x: 6, y: 7 }];
    s.food = { x: 16, y: 7 }; s.timer = 0;
    window.AudioFX.confirm();
  }

  function exit() { s.active = false; window.AudioFX.cancel(); }
  function isActive() { return s.active; }
  function isOver() { return s.over; }

  function setDir(dir) {
    if (dir === "up" && s.dir.y !== 1) s.nextDir = { x: 0, y: -1 };
    else if (dir === "down" && s.dir.y !== -1) s.nextDir = { x: 0, y: 1 };
    else if (dir === "left" && s.dir.x !== 1) s.nextDir = { x: -1, y: 0 };
    else if (dir === "right" && s.dir.x !== -1) s.nextDir = { x: 1, y: 0 };
  }

  function update(dt) {
    if (!s.active || s.over) return;
    s.timer += dt;
    if (s.timer < 0.13) return;
    s.timer = 0;
    s.dir = { ...s.nextDir };
    const head = { x: s.body[0].x + s.dir.x, y: s.body[0].y + s.dir.y };
    if (head.x < 0 || head.y < 0 || head.x >= s.gridW || head.y >= s.gridH ||
        s.body.some(seg => seg.x === head.x && seg.y === head.y)) {
      s.over = true;
      window.AudioFX.hit();
      return;
    }
    s.body.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      s.score += 10;
      if (s.score > s.best) {
        s.best = s.score;
        try { localStorage.setItem("lod_snake_best", String(s.best)); } catch (_) {}
      }
      window.AudioFX.heal();
      if (s.score >= 30 && s.onHighScore) s.onHighScore();
      s.food = { x: Math.floor(Math.random() * s.gridW), y: Math.floor(Math.random() * s.gridH) };
    } else {
      s.body.pop();
    }
  }

  function draw(ctx) {
    ctx.fillStyle = "#051a0f"; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    ctx.fillStyle = "#0a2e1a"; ctx.fillRect(0, 0, VIEW_W, 28);
    ctx.fillStyle = "#4ade80"; ctx.font = "bold 11px monospace";
    ctx.fillText(`SNAKE.EXE  SCORE:${s.score}  BEST:${s.best}`, 12, 18);
    ctx.fillStyle = "#86efac"; ctx.font = "9px monospace";
    ctx.fillText("B: EXIT", 332, 18);

    const ox = 24, oy = 38, cs = 14;
    ctx.strokeStyle = "#22c55e"; ctx.lineWidth = 2;
    ctx.strokeRect(ox - 2, oy - 2, s.gridW * cs + 4, s.gridH * cs + 4);

    ctx.fillStyle = "#ef4444"; ctx.fillRect(ox + s.food.x * cs + 2, oy + s.food.y * cs + 2, cs - 4, cs - 4);
    ctx.fillStyle = "#fde047"; ctx.fillRect(ox + s.food.x * cs + 5, oy + s.food.y * cs + 1, 3, 2);

    s.body.forEach((seg, i) => {
      ctx.fillStyle = i === 0 ? "#86efac" : "#22c55e";
      ctx.fillRect(ox + seg.x * cs + 1, oy + seg.y * cs + 1, cs - 2, cs - 2);
    });

    if (s.over) {
      ctx.fillStyle = "rgba(0,0,0,0.72)"; ctx.fillRect(72, 108, 240, 74);
      ctx.strokeStyle = "#f5c542"; ctx.strokeRect(72, 108, 240, 74);
      ctx.fillStyle = "#f5c542"; ctx.font = "bold 16px monospace"; ctx.fillText("GAME OVER!", 142, 134);
      ctx.fillStyle = "#e2e8f0"; ctx.font = "11px monospace"; ctx.fillText("PRESS A TO RETRY • B TO EXIT", 94, 162);
    }
  }

  return { start, exit, isActive, isOver, setDir, update, draw };
})();
