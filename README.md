# Legends of Death & the Reapers of Time (32-Bit RPG)

A 32-bit GBA-style story RPG inspired by *Pokémon LeafGreen* and based on the novel *Legends of Death and the Reapers of Time*. Runs directly on Android, iPhone, and Desktop browsers via GitHub Pages.

## Project Structure
```
legends-of-death/
├── index.html             # Entry HTML page & handheld UI shell
├── README.md              # Setup & deployment guide
├── styles/
│   └── game.css           # Responsive mobile/handheld styling & cutscene bars
├── models/
│   ├── palettes.js        # Character color palettes, roles & weapons
│   ├── sprites.js         # 24x32 animated overworld sprites, 64x64 portraits & 96x96 full-body battle models
│   └── world_art.js       # Layered trees, 5 unique buildings, animated portals & real furniture (couch/bed)
└── scripts/
    ├── story.js           # Enhanced storyline, battle briefings, quests & Lore Codex
        ├── maps.js            # Colorado Springs overworld, 5 interiors, Dream Realm, Limbach Park & Casa Grande
            ├── battle.js          # Turn-based 2-unit RPG battle system with full-body models & VFX
                └── engine.js          # Smooth GBA movement, cutscene walk-out engine & auto-save
                ```

                ## Controls
                - **Mobile:** On-screen D-Pad, **A** (Interact / Advance), **B** (Back), **PURGATORIO** (Realm Shift), **MENU** (Quests/Party/Lore).
                - **Desktop:** Arrow Keys / WASD to walk, **Z / Enter / Space** = A, **X / Esc** = B, **M** = Menu.