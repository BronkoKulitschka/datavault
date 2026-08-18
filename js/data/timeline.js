// ==========================================================================
// Chronologie von der War in Heaven bis zur Era Indomitus.
// ==========================================================================


/* ============================================================================
 * TIMELINE — a curated chronology of the whole 40K history, from the ancient
 * War in Heaven to the current Era Indomitus (M42). Each event has an era tag,
 * a date, a title, a short blurb, and an "article" title so a tap opens the
 * matching wiki article. Ordered oldest → newest.
 * ========================================================================== */
const TIMELINE = [{
  date: "~60 Mio. v.M2",
  era: "War in Heaven",
  title: "Krieg im Himmel",
  article: "War in Heaven",
  blurb: "Die Alten und die Necrontyr führen den ersten großen Krieg der Galaxis. Die Necrontyr werden durch die Biotransferenz zu den seelenlosen Necrons."
}, {
  date: "~M1–M15",
  era: "Aeldari",
  title: "Aufstieg & Fall der Aeldari",
  article: "Fall of the Aeldari",
  blurb: "Das Aeldari-Reich beherrscht die Galaxis, verfällt aber in Dekadenz — was schließlich zur Geburt Slaaneshs führt."
}, {
  date: "~M15",
  era: "Untergang",
  title: "Der Fall / Geburt Slaaneshs",
  article: "Fall of the Aeldari",
  blurb: "Die exzessive Dekadenz der Aeldari gebiert den Chaosgott Slaanesh. Das Auge des Schreckens entsteht, die Aeldari werden fast ausgelöscht."
}, {
  date: "~M15–M25",
  era: "Dark Age of Technology",
  title: "Dunkles Zeitalter der Technologie",
  article: "Dark Age of Technology",
  blurb: "Die Menschheit erreicht ihren technologischen Höhepunkt, breitet sich über die Sterne aus und entwickelt Künstliche Intelligenz."
}, {
  date: "~M25–M30",
  era: "Age of Strife",
  title: "Zeitalter des Zwists (Old Night)",
  article: "Age of Strife",
  blurb: "Warpstürme schneiden die Menschheitswelten voneinander ab. Aufkommende Psioniker und die Männer aus Eisen stürzen die Menschheit ins Chaos."
}, {
  date: "~M30",
  era: "Unification",
  title: "Einigungskriege",
  article: "Unification Wars",
  blurb: "Der Imperator einigt Terra, unterwirft die Techno-Barbaren und beginnt den Aufbau des Imperiums der Menschheit."
}, {
  date: "~M30–M31",
  era: "Great Crusade",
  title: "Der Große Kreuzzug",
  article: "Great Crusade",
  blurb: "Der Imperator und seine Primarchen mit ihren Legionen erobern die Galaxis zurück, um die Menschheit unter einem Banner zu vereinen."
}, {
  date: "~M31",
  era: "Horus Heresy",
  title: "Die Horus-Häresie",
  article: "Horus Heresy",
  blurb: "Warmaster Horus fällt dem Chaos anheim. Der galaxisweite Bürgerkrieg spaltet die Legionen und gipfelt in der Belagerung von Terra."
}, {
  date: "~M31",
  era: "Horus Heresy",
  title: "Belagerung von Terra",
  article: "Siege of Terra",
  blurb: "Der Höhepunkt der Häresie: Horus wird erschlagen, der Imperator wird tödlich verwundet und auf dem Goldenen Thron beigesetzt."
}, {
  date: "544.M32",
  era: "Age of Imperium",
  title: "Der Krieg der Bestie",
  article: "The Beheading",
  blurb: "Ein gewaltiger Ork-Waaagh! bedroht Terra selbst. Die Imperial Fists werden fast ausgelöscht, die Deathwatch entsteht."
}, {
  date: "M36",
  era: "Age of Apostasy",
  title: "Zeitalter der Apostasie",
  article: "Age of Apostasy",
  blurb: "Der wahnsinnige Hohelord Goge Vandire reißt die Macht an sich. Sein Terror-Regime endet erst durch die Reformation der Ekklesiarchie."
}, {
  date: "M41",
  era: "Time of Ending",
  title: "Die Tyrannidenkriege",
  article: "Tyrannic Wars",
  blurb: "Die Schwarmflotten der Tyraniden dringen aus der intergalaktischen Leere ein und verschlingen ganze Welten."
}, {
  date: "M41",
  era: "Time of Ending",
  title: "Kriege um Armageddon",
  article: "War for Armageddon",
  blurb: "Ghazghkull Thraka entfesselt wiederholt gewaltige Ork-Invasionen auf der Industriewelt Armageddon."
}, {
  date: "999.M41",
  era: "Time of Ending",
  title: "13. Schwarzer Kreuzzug & Fall von Cadia",
  article: "13th Black Crusade",
  blurb: "Abaddon der Plünderer stürmt Cadia. Die Zerstörung der Welt löst den Großen Riss aus, der die Galaxis zerteilt."
}, {
  date: "999.M41",
  era: "Great Rift",
  title: "Der Große Riss (Cicatrix Maledictum)",
  article: "Great Rift",
  blurb: "Ein gewaltiger Warp-Riss durchtrennt die Galaxis von Pol zu Pol und stürzt zahllose Welten in Finsternis."
}, {
  date: "~M42",
  era: "Era Indomitus",
  title: "Rückkehr Guillimans & Indomitus-Kreuzzug",
  article: "Indomitus Crusade",
  blurb: "Roboute Guilliman erwacht, führt die neuen Primaris-Space-Marines an und startet den größten Kreuzzug seit dem Großen Kreuzzug."
}, {
  date: "~M42",
  era: "Era Indomitus",
  title: "Das Psychische Erwachen",
  article: "Psychic Awakening",
  blurb: "Der Große Riss verstärkt psychische Kräfte in der ganzen Galaxis und weckt uralte Mächte in allen Fraktionen."
}, {
  date: "~M42",
  era: "Era Indomitus",
  title: "Die Seuchenkriege",
  article: "Plague Wars",
  blurb: "Mortarion und seine Death Guard entfesseln Nurgles Seuchen über Guillimans Heimatreich Ultramar."
}, {
  date: "~M42",
  era: "Era Indomitus",
  title: "Vierter Tyrannidenkrieg",
  article: "Fourth Tyrannic War",
  blurb: "Die bislang größte Tyranniden-Invasion trifft auf ein durch den Großen Riss geteiltes, geschwächtes Imperium."
}];

// Index types that only make sense for certain factions, keyed by faction id.

export { TIMELINE };
