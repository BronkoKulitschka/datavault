// ==========================================================================
// Kleinkram: Index-Typen je Fraktion, Beispiel-Suchbegriffe.
// ==========================================================================

const FACTION_INDEX_TYPES = {
  imperium: [{
    id: "chapters",
    icon: "⛨",
    label: "Space Marine Chapters",
    query: "Space Marine Chapter",
    desc: "Chapters & heraldry"
  }],
  chaos: [{
    id: "legions",
    icon: "⛧",
    label: "Traitor Legions",
    query: "Traitor Legion",
    desc: "Legions & warbands"
  }]
};
const PLACEHOLDER_QUERIES = ["Space Marine Chapter Master", "Necron Dynasties", "Warp and Chaos Gods", "Battle of Cadia", "Adeptus Mechanicus Technology", "Craftworld Ulthwé"];

export { FACTION_INDEX_TYPES, PLACEHOLDER_QUERIES };
