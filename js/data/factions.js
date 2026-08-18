// ==========================================================================
// Die sechs Hauptfraktionen samt Farbschema und Kategorien.
// ==========================================================================

const FACTIONS = [{
  id: "imperium",
  name: "Imperium of Man",
  shortName: "Imperium",
  symbol: "⚔",
  colors: {
    primary: "#ffb000",
    secondary: "#cc5500",
    bg: "#0a0700",
    surface: "#1e1605",
    accent: "#ffcc33",
    glow: "rgba(255,176,0,0.4)",
    text: "#ffd98a",
    border: "#d99a2b",
    gradient: "linear-gradient(135deg, #1e1605 0%, #0a0700 100%)"
  },
  description: "Mankind's last bastion against the darkness",
  categories: ["Space Marines", "Imperial Guard", "Adeptus Mechanicus", "Inquisition"],
  browse: [{
    icon: "❂",
    title: "The God-Emperor",
    topic: "The God-Emperor of Mankind",
    tag: "Lore"
  }, {
    icon: "⚔",
    title: "Space Marine Chapters",
    topic: "Space Marine Chapters of the Adeptus Astartes",
    tag: "Characters"
  }, {
    icon: "✠",
    title: "The Inquisition",
    topic: "The Holy Inquisition of the Imperium",
    tag: "Lore"
  }, {
    icon: "⚙",
    title: "Adeptus Mechanicus",
    topic: "The Adeptus Mechanicus and the Cult of the Machine",
    tag: "Technology"
  }, {
    icon: "▣",
    title: "Imperial Guard",
    topic: "The Astra Militarum Imperial Guard",
    tag: "Characters"
  }, {
    icon: "✦",
    title: "The Horus Heresy",
    topic: "The Horus Heresy",
    tag: "Battles"
  }, {
    icon: "✜",
    title: "Holy Terra",
    topic: "Holy Terra and the Imperial Palace",
    tag: "Locations"
  }, {
    icon: "⊕",
    title: "Bolter & Power Armour",
    topic: "The Boltgun and Power Armour of the Space Marines",
    tag: "Weapons"
  }]
}, {
  id: "chaos",
  name: "Chaos Space Marines",
  shortName: "Chaos",
  symbol: "✦",
  colors: {
    primary: "#ff2a2a",
    secondary: "#aa0000",
    bg: "#0a0000",
    surface: "#200808",
    accent: "#ff5544",
    glow: "rgba(255,42,42,0.4)",
    text: "#ff9b8e",
    border: "#cc4a44",
    gradient: "linear-gradient(135deg, #200808 0%, #0a0000 100%)"
  },
  description: "Servants of the Ruinous Powers",
  categories: ["Word Bearers", "World Eaters", "Thousand Sons", "Death Guard"],
  browse: [{
    icon: "✦",
    title: "The Chaos Gods",
    topic: "The four Chaos Gods of the Warp",
    tag: "Lore"
  }, {
    icon: "☠",
    title: "Khorne",
    topic: "Khorne, the Blood God",
    tag: "Lore"
  }, {
    icon: "❋",
    title: "Nurgle",
    topic: "Nurgle, the Plague Lord",
    tag: "Lore"
  }, {
    icon: "✺",
    title: "Tzeentch",
    topic: "Tzeentch, the Changer of Ways",
    tag: "Lore"
  }, {
    icon: "◈",
    title: "Slaanesh",
    topic: "Slaanesh, the Dark Prince",
    tag: "Lore"
  }, {
    icon: "⚔",
    title: "Traitor Legions",
    topic: "The nine Traitor Legions of Chaos",
    tag: "Characters"
  }, {
    icon: "♆",
    title: "The Warp",
    topic: "The Warp and the Immaterium",
    tag: "Locations"
  }, {
    icon: "✠",
    title: "Daemon Engines",
    topic: "Daemon Engines of Chaos",
    tag: "Technology"
  }]
}, {
  id: "eldar",
  name: "Aeldari (Eldar)",
  shortName: "Eldar",
  symbol: "◈",
  colors: {
    primary: "#00e5d0",
    secondary: "#008a80",
    bg: "#000807",
    surface: "#062220",
    accent: "#5cfff0",
    glow: "rgba(0,229,208,0.4)",
    text: "#8ff5ec",
    border: "#22b3a6",
    gradient: "linear-gradient(135deg, #062220 0%, #000807 100%)"
  },
  description: "Ancient masters of the Webway",
  categories: ["Craftworld", "Harlequins", "Dark Eldar", "Ynnari"],
  browse: [{
    icon: "◈",
    title: "The Craftworlds",
    topic: "The Aeldari Craftworlds",
    tag: "Locations"
  }, {
    icon: "◇",
    title: "The Webway",
    topic: "The Webway of the Aeldari",
    tag: "Locations"
  }, {
    icon: "✧",
    title: "Aspect Warriors",
    topic: "The Aspect Warriors and Path of the Warrior",
    tag: "Characters"
  }, {
    icon: "❂",
    title: "Farseers",
    topic: "Aeldari Farseers and the art of psychic divination",
    tag: "Characters"
  }, {
    icon: "♦",
    title: "The Fall of the Aeldari",
    topic: "The Fall of the Aeldari and the birth of Slaanesh",
    tag: "Lore"
  }, {
    icon: "✦",
    title: "Drukhari",
    topic: "The Drukhari Dark Eldar of Commorragh",
    tag: "Characters"
  }, {
    icon: "◆",
    title: "Wraith Constructs",
    topic: "Aeldari Wraithbone constructs and Spirit Stones",
    tag: "Technology"
  }, {
    icon: "⬡",
    title: "The Ynnari",
    topic: "The Ynnari and Ynnead the God of the Dead",
    tag: "Lore"
  }]
}, {
  id: "orks",
  name: "Orks",
  shortName: "Orks",
  symbol: "⚡",
  colors: {
    primary: "#5cff2a",
    secondary: "#2e8810",
    bg: "#030800",
    surface: "#122208",
    accent: "#88ff55",
    glow: "rgba(92,255,42,0.4)",
    text: "#b0f98c",
    border: "#63bf38",
    gradient: "linear-gradient(135deg, #122208 0%, #030800 100%)"
  },
  description: "Da biggest and da strongest",
  categories: ["Boyz", "Vehicles", "Warbosses", "Klans"],
  browse: [{
    icon: "⚡",
    title: "Da Waaagh!",
    topic: "The Waaagh and the green tide of the Orks",
    tag: "Lore"
  }, {
    icon: "☠",
    title: "Warbosses",
    topic: "Ork Warbosses and Ghazghkull Thraka",
    tag: "Characters"
  }, {
    icon: "⊕",
    title: "Da Klanz",
    topic: "The six Ork Clans",
    tag: "Characters"
  }, {
    icon: "✦",
    title: "Mekboyz & Gubbinz",
    topic: "Ork Mekboyz and their crude technology",
    tag: "Technology"
  }, {
    icon: "▣",
    title: "Ork Vehicles",
    topic: "Ork vehicles, Trukks and Battlewagons",
    tag: "Weapons"
  }, {
    icon: "❂",
    title: "Da Boyz",
    topic: "Ork Boyz and the lifecycle of Orks",
    tag: "Characters"
  }, {
    icon: "◉",
    title: "Gork & Mork",
    topic: "Gork and Mork, the Ork gods",
    tag: "Lore"
  }, {
    icon: "⚙",
    title: "Big Shootas & Choppas",
    topic: "Ork weapons, Shootas and Choppas",
    tag: "Weapons"
  }]
}, {
  id: "necrons",
  name: "Necrons",
  shortName: "Necrons",
  symbol: "◉",
  colors: {
    primary: "#00ff7a",
    secondary: "#008844",
    bg: "#000604",
    surface: "#062216",
    accent: "#5cffaa",
    glow: "rgba(0,255,122,0.4)",
    text: "#8ffcc8",
    border: "#22bf7e",
    gradient: "linear-gradient(135deg, #062216 0%, #000604 100%)"
  },
  description: "Ancient undying machines of death",
  categories: ["Warriors", "Vehicles", "Lords", "Dynasties"],
  browse: [{
    icon: "◉",
    title: "The Necrontyr",
    topic: "The Necrontyr and their transformation into Necrons",
    tag: "Lore"
  }, {
    icon: "☉",
    title: "The C'tan",
    topic: "The C'tan, the Star Gods",
    tag: "Lore"
  }, {
    icon: "⊙",
    title: "The War in Heaven",
    topic: "The War in Heaven against the Old Ones",
    tag: "Battles"
  }, {
    icon: "❖",
    title: "Necron Dynasties",
    topic: "The Necron Dynasties and their structure",
    tag: "Lore"
  }, {
    icon: "▣",
    title: "Necron Lords",
    topic: "Necron Lords, Overlords and Szarekh the Silent King",
    tag: "Characters"
  }, {
    icon: "⚡",
    title: "Gauss Weaponry",
    topic: "Necron Gauss weapons and living metal",
    tag: "Weapons"
  }, {
    icon: "✦",
    title: "Tomb Worlds",
    topic: "Necron Tomb Worlds",
    tag: "Locations"
  }, {
    icon: "◈",
    title: "Reanimation Protocols",
    topic: "Necron reanimation protocols and Necrodermis",
    tag: "Technology"
  }]
}, {
  id: "tau",
  name: "T'au Empire",
  shortName: "T'au",
  symbol: "◎",
  colors: {
    primary: "#22a0ff",
    secondary: "#0d5db0",
    bg: "#00040a",
    surface: "#061c28",
    accent: "#5cc0ff",
    glow: "rgba(34,160,255,0.4)",
    text: "#93cfff",
    border: "#3d93e0",
    gradient: "linear-gradient(135deg, #061c28 0%, #00040a 100%)"
  },
  description: "Warriors of the Greater Good",
  categories: ["Fire Caste", "Battlesuits", "Sept Worlds", "Allies"],
  browse: [{
    icon: "◎",
    title: "The Greater Good",
    topic: "The Tau'va, the philosophy of the Greater Good",
    tag: "Lore"
  }, {
    icon: "⬡",
    title: "The Five Castes",
    topic: "The five castes of the T'au Empire",
    tag: "Lore"
  }, {
    icon: "▣",
    title: "Battlesuits",
    topic: "T'au Battlesuits, Crisis and Riptide",
    tag: "Weapons"
  }, {
    icon: "❂",
    title: "The Ethereals",
    topic: "The Ethereal Caste of the T'au",
    tag: "Characters"
  }, {
    icon: "⚡",
    title: "Pulse Weaponry",
    topic: "T'au pulse weapons and railguns",
    tag: "Weapons"
  }, {
    icon: "✦",
    title: "Commander Farsight",
    topic: "Commander Farsight and the Farsight Enclaves",
    tag: "Characters"
  }, {
    icon: "◈",
    title: "Sept Worlds",
    topic: "The Sept Worlds of the T'au Empire",
    tag: "Locations"
  }, {
    icon: "⚙",
    title: "Drone Technology",
    topic: "T'au drone technology and AI",
    tag: "Technology"
  }]
}, {
  id: "minor",
  name: "Minor Factions",
  shortName: "Minor Factions",
  symbol: "◈",
  colors: {
    primary: "#c8ccd0",
    secondary: "#8a9098",
    bg: "#07080a",
    surface: "#1b1f26",
    accent: "#e8ecf0",
    glow: "rgba(200,204,208,0.35)",
    text: "#dde2e8",
    border: "#9aa2ac",
    gradient: "linear-gradient(135deg, #1b1f26 0%, #07080a 100%)"
  },
  description: "Lesser-known peoples, powers and species of the galaxy",
  categories: ["Xenos", "Human", "Abhuman", "Lost"],
  browse: [{
    icon: "◈",
    title: "Leagues of Votann",
    topic: "The Leagues of Votann, the Kin",
    tag: "Xenos"
  }, {
    icon: "⬡",
    title: "Kroot",
    topic: "The Kroot of Pech",
    tag: "Xenos"
  }, {
    icon: "❂",
    title: "The Interex",
    topic: "The Interex, a lost human civilisation",
    tag: "Lore"
  }, {
    icon: "✦",
    title: "Diasporex",
    topic: "The Diasporex, human and xenos void-dwellers",
    tag: "Lore"
  }, {
    icon: "▣",
    title: "Jokaero",
    topic: "The Jokaero weaponsmiths",
    tag: "Xenos"
  }, {
    icon: "⚡",
    title: "Hrud",
    topic: "The Hrud, entropic xenos",
    tag: "Xenos"
  }, {
    icon: "◉",
    title: "Vespid",
    topic: "The Vespid Stingwings",
    tag: "Xenos"
  }, {
    icon: "✜",
    title: "Squats",
    topic: "The Squats, ancestors of the Kin",
    tag: "Abhuman"
  }]
}];

export { FACTIONS };
