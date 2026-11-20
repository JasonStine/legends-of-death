// =========================================================
// scripts/audio.js — Synthesized 32-Bit GBA Retro SFX
// =========================================================
window.AudioFX = (() => {
  let ctx = null;
  let enabled = true;

  function ensure() {
    if (!enabled) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  }

  function tone(freq, dur = 0.08, type = "square", gainVal = 0.06, slideTo = null) {
    const c = ensure();
    if (!c) return;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, c.currentTime + dur);
    g.gain.setValueAtTime(gainVal, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur);
    osc.connect(g);
    g.connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + dur);
  }

  return {
    setEnabled(val) { enabled = !!val; },
    isEnabled() { return enabled; },
    cursor() { tone(520, 0.045, "square", 0.04); },
    confirm() { tone(660, 0.06, "square", 0.05, 880); },
    cancel() { tone(360, 0.07, "square", 0.05, 220); },
    blip() { tone(440, 0.03, "triangle", 0.04); },
    hit() { tone(180, 0.14, "sawtooth", 0.08, 60); },
    heal() {
      tone(523, 0.08, "triangle", 0.06);
      setTimeout(() => tone(659, 0.09, "triangle", 0.06), 70);
      setTimeout(() => tone(784, 0.12, "triangle", 0.06), 140);
    },
    portal() { tone(260, 0.25, "sine", 0.07, 740); },
    lore() {
      tone(587, 0.09, "triangle", 0.06);
      setTimeout(() => tone(880, 0.14, "triangle", 0.06), 90);
    }
  };
})();
