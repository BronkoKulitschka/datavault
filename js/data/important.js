// ==========================================================================
// Hervorgehobene Eintraege je Fraktion.
// ==========================================================================

const IMPORTANT_MAP = {
  imperium: {
    personae: ["Emperor of Mankind", "Roboute Guilliman", "Marneus Calgar", "Sanguinius", "Rogal Dorn", "Leman Russ", "Lion El'Jonson", "Vulkan", "Jaghatai Khan", "Sebastian Yarrick", "Ciaphas Cain", "Saint Celestine", "Belisarius Cawl", "Malcador the Sigillite"],
    worlds: ["Terra", "Mars", "Macragge", "Cadia", "Armageddon", "Baal", "Fenris", "Catachan", "Krieg"],
    tech: ["Power Armour", "Terminator Armour", "Golden Throne", "Astronomican", "Standard Template Construct", "Rhino", "Land Raider"],
    weapons: ["Bolter", "Lasgun", "Chainsword", "Power Sword", "Plasma Gun", "Power Fist", "Melta", "Flamer"],
    organisations: ["Adeptus Astartes", "Adeptus Mechanicus", "Adeptus Custodes", "Inquisition", "Astra Militarum", "Adepta Sororitas", "Adeptus Arbites", "Imperial Navy", "Ecclesiarchy"],
    battles: ["Horus Heresy", "Battle of Terra", "Fall of Cadia", "Second War for Armageddon", "Damocles Crusade", "Badab War", "13th Black Crusade"]
  },
  chaos: {
    personae: ["Horus", "Abaddon the Despoiler", "Fulgrim", "Mortarion", "Magnus the Red", "Angron", "Perturabo", "Lorgar", "Kharn the Betrayer", "Ahriman", "Typhus", "Fabius Bile"],
    worlds: ["Medrengard", "Sicarus", "Plague Planet", "Planet of the Sorcerers", "Maeleum", "Davin"],
    tech: ["Daemon Engine", "Defiler", "Soul Grinder", "Forgefiend", "Heldrake", "Chaos Titan"],
    weapons: ["Daemon Weapon", "Chainaxe", "Hellblade", "Baleflamer", "Hades Autocannon"],
    organisations: ["Black Legion", "Word Bearers", "Death Guard", "Thousand Sons", "World Eaters", "Emperor's Children", "Iron Warriors", "Night Lords", "Alpha Legion"],
    battles: ["Horus Heresy", "13th Black Crusade", "Siege of Terra", "Battle of Skalathrax"]
  },
  eldar: {
    personae: ["Eldrad Ulthran", "Asurmen", "Jain Zar", "Maugan Ra", "Baharroth", "Karandras", "Fuegan", "Yvraine", "Prince Yriel", "Illic Nightspear", "Avatar of Khaine"],
    worlds: ["Ulthwé", "Biel-Tan", "Iyanden", "Saim-Hann", "Alaitoc", "Commorragh", "Black Library"],
    tech: ["Wraithbone", "Spirit Stone", "Webway", "Infinity Circuit", "Holo-field", "Wraithguard"],
    weapons: ["Shuriken Catapult", "Bright Lance", "Diresword", "Death Spinner", "D-Cannon", "Fusion Gun"],
    organisations: ["Aspect Warriors", "Harlequins", "Ynnari", "Dire Avengers", "Howling Banshees", "Striking Scorpions", "Fire Dragons"],
    battles: ["Fall of the Aeldari", "Battle of Iyanden", "Battle of Biel-Tan"]
  },
  orks: {
    personae: ["Ghazghkull Mag Uruk Thraka", "Grotsnik", "Kaptin Badrukk", "Gorgutz 'Ead 'Unter", "Old Zogwort", "Wazdakka Gutsmek", "Nazdreg Ug Urdgrub", "Snagrod", "Tuska", "Zodgrod Wortsnagga"],
    worlds: ["Ullanor", "Octarius", "Charadon", "Gorro"],
    tech: ["Gargant", "Killa Kan", "Deff Dread", "Battlewagon", "Mek Speshul", "Cybork", "Force Field"],
    weapons: ["Shoota", "Choppa", "Power Klaw", "Burna", "Big Shoota", "Rokkit Launcha", "Kustom Mega-Blasta", "Grot Blasta"],
    organisations: ["Goffs", "Bad Moons", "Evil Sunz", "Deathskulls", "Blood Axes", "Snakebites", "Freebooterz", "Speed Freeks"],
    battles: ["War of the Beast", "Second War for Armageddon", "Third War for Armageddon", "Battle of Ullanor"]
  },
  necrons: {
    personae: ["Imotekh the Stormlord", "Trazyn the Infinite", "Orikan the Diviner", "Szarekh", "Anrakyr the Traveller", "Nemesor Zahndrekh", "Vargard Obyron", "Illuminor Szeras", "The Silent King", "Nightbringer", "Deceiver"],
    worlds: ["Mandragora", "Solemnace", "Gidrim", "Thanatos", "Zapennec"],
    tech: ["Living Metal", "Necrodermis", "Tesseract Vault", "Canoptek Scarab", "Resurrection Orb", "Quantum Shielding", "Dolmen Gate"],
    weapons: ["Gauss Flayer", "Tesla Carbine", "Staff of Light", "Warscythe", "Doomsday Cannon", "Voidblade", "Death Ray"],
    organisations: ["Sautekh Dynasty", "Mephrit Dynasty", "Nihilakh Dynasty", "Novokh Dynasty", "Nephrekh Dynasty", "Triarch Praetorians", "C'tan"],
    battles: ["War in Heaven", "Orphean War", "Fall of Cadia"]
  },
  tau: {
    personae: ["Commander Farsight", "Commander Shadowsun", "Aun'Va", "Aun'Shi", "Darkstrider", "Longstrike", "Commander Brightsword", "Commander Puretide", "Shas'O Kais"],
    worlds: ["T'au", "Vior'la", "Sa'cea", "Bork'an", "Dal'yth", "Fal'shia", "Tau'n", "D'yanoi"],
    tech: ["XV8 Crisis Battlesuit", "XV104 Riptide Battlesuit", "XV25 Stealthsuit", "Drone", "Combat Armour", "Dark Matter Nova Reactor"],
    weapons: ["Pulse Rifle", "Railgun", "Rail Rifle", "Fusion Blaster", "Burst Cannon", "Ion Cannon", "Smart Missile System"],
    organisations: ["Fire Caste", "Earth Caste", "Water Caste", "Air Caste", "Ethereal Caste", "Farsight Enclaves", "Kroot", "Vespid"],
    battles: ["Damocles Gulf Crusade", "War of Dakka", "Conquest of Mu'gulath Bay", "Taros Campaign"]
  },
  minor: {
    personae: ["Leagues of Votann", "Kroot", "Interex", "Diasporex", "Jokaero", "Hrud", "Vespid", "Squats", "Genestealer Cult", "Demiurg", "Tarellians", "Loxatl"],
    worlds: ["Leagues of Votann", "Pech", "Interex", "Demiurg"],
    tech: ["Kroot", "Votann Ancestor Core", "Digital Weapons"],
    weapons: ["Kroot Rifle", "Genestealer", "Etacarn Plasma Pistol"],
    organisations: ["Leagues of Votann", "Interex", "Diasporex", "Severan Dominate", "Genestealer Cult", "Kroot Mercenaries"],
    battles: ["Interex", "Great Crusade"]
  }
};

export { IMPORTANT_MAP };
