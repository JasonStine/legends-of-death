// Character color palettes, roles, wings, and weapon configuration.
// =========================================================
// models/palettes.js — 32-Bit Character & Realm Palettes
// =========================================================
window.PALETTES = {
  jacob: {
    name: "Jacob Menos",
    role: "Nephilim • Healer",
    skin: "#f4c8a6", skinShade: "#d9a27c",
    hair: "#c8a165", hairHi: "#e5c88f", hairStyle: "messy",
    eyes: "#38bdf8",
    top: "#2563eb", topShade: "#1e3a8a", accent: "#f8fafc",
    pants: "#1f2937", shoes: "#e2e8f0",
    aura: "#facc15", wings: null, weapon: "ring"
  },
  cyrine: {
    name: "Cyrine Huesic",
    role: "Demon • Deicide Profugo",
    skin: "#f6d2bd", skinShade: "#dbb098",
    hair: "#e5e7eb", hairHi: "#ffffff", hairStyle: "long",
    eyes: "#a855f7",
    top: "#7c3aed", topShade: "#4c1d95", accent: "#f472b6",
    pants: "#18181b", shoes: "#3f3f46",
    aura: "#ef4444", wings: "demon", weapon: "claws"
  },
  navi: {
    name: "Navi",
    role: "Everred • Reaper of Order",
    skin: "#f1ccb0", skinShade: "#d4a688",
    hair: "#4b2e1e", hairHi: "#71462f", hairStyle: "wavy_long",
    eyes: "#0284c7",
    top: "#1e293b", topShade: "#0f172a", accent: "#f59e0b",
    pants: "#0f172a", shoes: "#1e293b",
    aura: "#38bdf8", wings: "dark", weapon: "halberd"
  },
  letonin: {
    name: "Letonin",
    role: "Reaper of Order • Dreams",
    skin: "#f3cfb3", skinShade: "#d4a787",
    hair: "#1f1b24", hairHi: "#3f374a", hairStyle: "wavy",
    eyes: "#b45309",
    top: "#312e81", topShade: "#1e1b4b", accent: "#a78bfa",
    pants: "#111827", shoes: "#312e81",
    aura: "#c084fc", wings: "float", weapon: "mallet"
  },
  illicero: {
    name: "Illicero (Kain)",
    role: "Reaper of Order • Souls",
    skin: "#f0c29e", skinShade: "#ce9972",
    hair: "#eab308", hairHi: "#fef08a", hairStyle: "spiky",
    eyes: "#f59e0b",
    top: "#7f1d1d", topShade: "#450a0a", accent: "#fbbf24",
    pants: "#18181b", shoes: "#27272a",
    aura: "#f43f5e", wings: "dark", weapon: "rapier"
  },
  sendex: {
    name: "Sendex (Daniel)",
    role: "Reaper of Order • Fire",
    skin: "#efd0ba", skinShade: "#cca68d",
    hair: "#111827", hairHi: "#374151", hairStyle: "curly",
    eyes: "#ef4444",
    top: "#27272a", topShade: "#09090b", accent: "#f97316",
    pants: "#18181b", shoes: "#3f3f46",
    aura: "#f97316", wings: "dark", weapon: "whip"
  },
  sendex_angel: {
    name: "Daniel (Ascended)",
    role: "Angel • Moonlight Sonata",
    skin: "#f8dfc9", skinShade: "#dcb99d",
    hair: "#1f2937", hairHi: "#6b7280", hairStyle: "curly",
    eyes: "#fef08a",
    top: "#f8fafc", topShade: "#cbd5e1", accent: "#f5c542",
    pants: "#e2e8f0", shoes: "#f5c542",
    aura: "#fef08a", wings: "angel", weapon: "axe"
  },
  crepsus: {
    name: "Crepsus",
    role: "Rogue Advisor • Hybrid",
    skin: "#d8b49c", skinShade: "#b08970",
    hair: "#5c3a21", hairHi: "#855834", hairStyle: "spiky",
    eyes: "#22c55e",
    top: "#1c1917", topShade: "#0c0a09", accent: "#dc2626",
    pants: "#1c1917", shoes: "#450a0a",
    aura: "#991b1b", wings: "corrupted", weapon: "rake"
  },
  envy: {
    name: "Envy (Clarica)",
    role: "Divine Sin • Poison",
    skin: "#e9d5c0", skinShade: "#c4ad95",
    hair: "#1e1b4b", hairHi: "#4338ca", hairStyle: "long",
    eyes: "#10b981",
    top: "#064e3b", topShade: "#022c22", accent: "#a855f7",
    pants: "#064e3b", shoes: "#111827",
    aura: "#10b981", wings: null, weapon: "serpent"
  },
  emillia: {
    name: "Emillia Sonasa",
    role: "Siren Princess • Vocality",
    skin: "#f7d4bc", skinShade: "#dbb195",
    hair: "#fde047", hairHi: "#fef9c3", hairStyle: "long",
    eyes: "#3b82f6",
    top: "#f472b6", topShade: "#be185d", accent: "#fef08a",
    pants: "#1e293b", shoes: "#db2777",
    aura: "#38bdf8", wings: null, weapon: "sickle"
  },
  death: {
    name: "Lord Death",
    role: "The Grim Reaper",
    skin: "#e5e7eb", skinShade: "#cbd5e1",
    hair: "#451a03", hairHi: "#78350f", hairStyle: "hood",
    eyes: "#a855f7",
    top: "#111827", topShade: "#030712", accent: "#9333ea",
    pants: "#030712", shoes: "#1f2937",
    aura: "#9333ea", wings: "dark", weapon: "scythe"
  },
  mom: {
    name: "Dr. Menos",
    role: "Jacob's Mom • Doctor",
    skin: "#f3c9aa", skinShade: "#d4a482",
    hair: "#92400e", hairHi: "#b45309", hairStyle: "bun",
    eyes: "#2563eb",
    top: "#f8fafc", topShade: "#cbd5e1", accent: "#0ea5e9",
    pants: "#334155", shoes: "#1e293b",
    aura: null, wings: null, weapon: null
  },
  crista: {
    name: "Crista",
    role: "Platinum Cat (Illicero)",
    skin: "#f1f5f9", skinShade: "#cbd5e1",
    hair: "#ffffff", hairHi: "#ffffff", hairStyle: "cat",
    eyes: "#38bdf8",
    top: "#e2e8f0", topShade: "#94a3b8", accent: "#38bdf8",
    pants: "#e2e8f0", shoes: "#cbd5e1",
    aura: "#fbbf24", wings: null, weapon: null
  }
};
