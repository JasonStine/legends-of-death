# Legends of Death & the Reapers of Time (v11)

Modular 32-bit handheld web RPG built for GitHub Pages (zero build step required).

## Project Folder Structure
- `index.html` — Handheld shell, PIN gate, overlays & script loader
- `styles/`
  - `themes.css` — 7 console color themes & viewport-safe button sizes
  - `handheld.css` — PIN gate, portrait / Fold / landscape GBA handheld layout
  - `overlays.css` — Dialogue, Battle UI, In-Game Menu, Regional Map, Settings & Release Notes
- `people/`
  - `palettes.js` — Character palettes, roles & visual traits
  - `sprites.js` — Organic human sprites, 96×96 book-accurate portraits & battle models
- `art/`
  - `exterior_art.js` — Lush grass, natural pathways w/ encroaching grass, buildings, fences & portals
  - `interior_art.js` — Dynamic multi-room auto-tiled walls, floors & furniture props
- `regions/`
  - `map_helpers.js` — Shared `buildDynamicRoom()` & `solid()` utilities
  - `east_town.js` & `westside.js` — Playable Colorado Springs overworld districts
  - `buildings/` — One dedicated file per building (`jacobs_house.js`, `st_jude_church.js`, `hospital.js`, `barnes_noble.js`, `party_house.js`, `high_school.js`, `sweet_tooth.js`, `neighbor_houses.js`)
  - `realms/` — `dream_realm.js`, `limbach_park.js`, `casa_grande.js`
- `scripts/`
  - `audio.js`, `story.js`, `snake.js`, `regional_map.js`, `battle.js`, `engine.js`
