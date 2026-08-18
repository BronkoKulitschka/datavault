// ==========================================================================
// Suchkategorien und Index-Typen.
// ==========================================================================

const SEARCH_CATEGORIES = ["All", "Characters", "Weapons", "Locations", "Technology", "Lore", "Battles"];
const INDEX_TYPES = [{
  id: "personae",
  icon: "✠",
  label: "Personae",
  query: "character",
  desc: "Notable persons & heroes"
}, {
  id: "tech",
  icon: "⚙",
  label: "Technologies",
  query: "technology",
  desc: "Machines, wargear & relics"
}, {
  id: "worlds",
  icon: "◉",
  label: "Worlds & Systems",
  query: "world planet",
  desc: "Planets, systems & locations"
}, {
  id: "weapons",
  icon: "⚔",
  label: "Weapons",
  query: "weapon",
  desc: "Iconic weapons & armaments"
}, {
  id: "organisations",
  icon: "▣",
  label: "Organisations",
  query: "organisation order",
  desc: "Orders, legions & sub-factions"
}, {
  id: "battles",
  icon: "✦",
  label: "Battles & Events",
  query: "battle war campaign",
  desc: "Wars, campaigns & events"
}];

export { SEARCH_CATEGORIES, INDEX_TYPES };
