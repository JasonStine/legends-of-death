// =========================================================
// regions/map_helpers.js — Shared Dynamic Room Builder & Registry
// =========================================================
window.Maps = window.Maps || {};
window.MapHelpers = (() => {
  function buildDynamicRoom(w, h, floorType, rects) {
    const grid = Array.from({ length: h }, () => Array(w).fill(12)); // 12 = exterior void
    rects.forEach(([rx, ry, rw, rh, fl = 0]) => {
      for (let y = ry; y < ry + rh; y++) {
        for (let x = rx; x < rx + rw; x++) {
          if (x >= 0 && y >= 0 && x < w && y < h) grid[y][x] = fl;
        }
      }
    });
    const isFl = (x, y) => (x >= 0 && y >= 0 && x < w && y < h && (grid[y][x] === 0 || grid[y][x] === 7));
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (grid[y][x] !== 12) continue;
        const nearFloor =
          isFl(x - 1, y) || isFl(x + 1, y) || isFl(x, y - 1) || isFl(x, y + 1) ||
          isFl(x - 1, y - 1) || isFl(x + 1, y - 1) || isFl(x - 1, y + 1) || isFl(x + 1, y + 1) ||
          isFl(x, y + 2) || isFl(x - 1, y + 2) || isFl(x + 1, y + 2);
        if (nearFloor) grid[y][x] = 1;
      }
    }
    return { w, h, floorType, grid };
  }

  function solid(r, x, y, tw = 1, th = 1) {
    for (let yy = y; yy < y + th; yy++) {
      for (let xx = x; xx < x + tw; xx++) {
        if (xx >= 0 && yy >= 0 && xx < r.w && yy < r.h && r.grid[yy][xx] !== 1 && r.grid[yy][xx] !== 12) {
          r.grid[yy][xx] = 11; // Invisible furniture collision (normal floor renders underneath)
        }
      }
    }
  }

  return { buildDynamicRoom, solid };
})();
