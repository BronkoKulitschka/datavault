// ==========================================================================
// EINSTELLUNGEN
//
// Alles rund um die Optionen liegt hier: Vorgabewerte, die Beschreibung
// der Bedienelemente und das Speichern auf dem Geraet.
//
// Eine neue Option hinzufuegen heisst: einen Eintrag in DEFAULTS anlegen,
// eine Zeile in OPTION_GROUPS ergaenzen — fertig. Das Optionsfenster baut
// sich aus dieser Beschreibung von selbst auf, es muss nichts am Fenster
// selbst geaendert werden.
//
// Die Werte liegen im localStorage des Browsers. Das ist reiner
// Geraetespeicher: nichts wird uebertragen, nichts landet auf einem Server.
// ==========================================================================

const SPEICHER_SCHLUESSEL = "datavault.options.v1";

const DEFAULTS = {
  // — Darstellung —
  fontScale: 100,        // Schriftgroesse in Prozent
  lineHeight: 170,       // Zeilenabstand in Prozent
  contentWidth: 960,     // Textbreite in Pixel
  serifBody: false,      // Fliesstext mit Serifen statt Monospace
  roundedCorners: true,  // abgerundete Ecken

  // — CRT-Effekte —
  brightness: 126,       // Helligkeit in Prozent
  scanlines: true,       // Scanline-Raster
  scanlineGap: 4,        // Abstand der Scanlines in Pixel
  flicker: true,         // Flackern
  vignette: 28,          // Randabdunklung in Prozent
  glow: 50,              // Leuchtstaerke in Prozent

  // — Verhalten —
  startFaction: "imperium",  // Fraktion beim Start
  preferredSource: "auto",   // bevorzugtes Wiki
  autoFocus: false,          // Suchfeld beim Start aktivieren
  showSigils: true,          // Sigillen in Artikeln anzeigen

  // — Barrierefreiheit —
  reduceMotion: false,   // Bewegung abschalten
  highContrast: false,   // maximaler Kontrast
  largeTargets: false,   // groessere Schaltflaechen
  underlineLinks: false, // Querverweise unterstreichen
};

// Beschreibung der Bedienelemente. Reihenfolge = Reihenfolge im Fenster.
//   typ "regler"   → Schieberegler, braucht min/max/schritt und einheit
//   typ "schalter" → An/Aus
//   typ "auswahl"  → Liste fester Werte
const OPTION_GROUPS = [
  {
    id: "darstellung",
    titel: "Darstellung",
    symbol: "◈",
    optionen: [
      { key: "fontScale",    label: "Schriftgröße",   typ: "regler", min: 80,  max: 140, schritt: 5,  einheit: "%" },
      { key: "lineHeight",   label: "Zeilenabstand",  typ: "regler", min: 130, max: 220, schritt: 10, einheit: "%" },
      { key: "contentWidth", label: "Textbreite",     typ: "regler", min: 640, max: 1280, schritt: 40, einheit: "px" },
      { key: "serifBody",    label: "Fließtext mit Serifen", typ: "schalter",
        hinweis: "Überschriften bleiben unverändert." },
      { key: "roundedCorners", label: "Abgerundete Ecken", typ: "schalter" },
    ],
  },
  {
    id: "crt",
    titel: "CRT-Effekte",
    symbol: "▤",
    optionen: [
      { key: "brightness",  label: "Helligkeit",     typ: "regler", min: 60, max: 160, schritt: 2, einheit: "%" },
      { key: "glow",        label: "Leuchtstärke",   typ: "regler", min: 0,  max: 100, schritt: 5, einheit: "%" },
      { key: "vignette",    label: "Randabdunklung", typ: "regler", min: 0,  max: 70,  schritt: 5, einheit: "%" },
      { key: "scanlines",   label: "Scanlines",      typ: "schalter" },
      { key: "scanlineGap", label: "Scanline-Abstand", typ: "regler", min: 3, max: 8, schritt: 1, einheit: "px",
        nurWenn: "scanlines" },
      { key: "flicker",     label: "Flackern",       typ: "schalter" },
    ],
  },
  {
    id: "verhalten",
    titel: "Verhalten",
    symbol: "▶",
    optionen: [
      { key: "startFaction", label: "Fraktion beim Start", typ: "auswahl", werte: [
        { wert: "imperium", label: "Imperium" },
        { wert: "chaos",    label: "Chaos" },
        { wert: "eldar",    label: "Aeldari" },
        { wert: "orks",     label: "Orks" },
        { wert: "necrons",  label: "Necrons" },
        { wert: "tau",      label: "T'au" },
      ] },
      { key: "preferredSource", label: "Bevorzugtes Wiki", typ: "auswahl", werte: [
        { wert: "auto",       label: "Automatisch" },
        { wert: "fandom",     label: "Fandom" },
        { wert: "lexicanum",  label: "Lexicanum" },
      ], hinweis: "Bei fehlendem Artikel wird die andere Quelle trotzdem versucht." },
      { key: "autoFocus",   label: "Suchfeld beim Start aktivieren", typ: "schalter" },
      { key: "showSigils",  label: "Sigillen in Artikeln", typ: "schalter" },
    ],
  },
  {
    id: "zugang",
    titel: "Barrierefreiheit",
    symbol: "◍",
    optionen: [
      { key: "highContrast",   label: "Hoher Kontrast", typ: "schalter",
        hinweis: "Hellt Text auf und nimmt Scanlines sowie Randabdunklung zurück." },
      { key: "reduceMotion",   label: "Bewegung reduzieren", typ: "schalter" },
      { key: "largeTargets",   label: "Größere Schaltflächen", typ: "schalter" },
      { key: "underlineLinks", label: "Querverweise unterstreichen", typ: "schalter" },
    ],
  },
];

// Alle Optionen als flache Liste — praktisch fuer Pruefungen.
const ALLE_OPTIONEN = OPTION_GROUPS.flatMap((g) => g.optionen);

// Haelt einen Wert im erlaubten Bereich und im richtigen Typ.
function bereinige(key, wert) {
  const beschreibung = ALLE_OPTIONEN.find((o) => o.key === key);
  if (!beschreibung) return undefined;

  if (beschreibung.typ === "regler") {
    const zahl = Number(wert);
    if (!Number.isFinite(zahl)) return DEFAULTS[key];
    return Math.min(beschreibung.max, Math.max(beschreibung.min, zahl));
  }
  if (beschreibung.typ === "schalter") {
    return Boolean(wert);
  }
  if (beschreibung.typ === "auswahl") {
    const erlaubt = beschreibung.werte.some((w) => w.wert === wert);
    return erlaubt ? wert : DEFAULTS[key];
  }
  return DEFAULTS[key];
}

// Laedt die gespeicherten Einstellungen. Unbekannte oder kaputte Werte
// werden still durch die Vorgabe ersetzt, damit ein beschaedigter
// Speicher die App nicht lahmlegt.
function ladeOptionen() {
  const ergebnis = { ...DEFAULTS };
  try {
    const roh = window.localStorage.getItem(SPEICHER_SCHLUESSEL);
    if (!roh) return ergebnis;
    const gespeichert = JSON.parse(roh);
    if (!gespeichert || typeof gespeichert !== "object") return ergebnis;
    for (const key of Object.keys(DEFAULTS)) {
      if (key in gespeichert) {
        const wert = bereinige(key, gespeichert[key]);
        if (wert !== undefined) ergebnis[key] = wert;
      }
    }
  } catch (fehler) {
    // Privater Modus oder gesperrter Speicher — dann eben Vorgabewerte.
    console.warn("Einstellungen konnten nicht geladen werden:", fehler);
  }
  return ergebnis;
}

// Speichert die Einstellungen. Schlaegt das fehl, laeuft die App weiter,
// die Werte gelten dann nur fuer diese Sitzung.
function speichereOptionen(optionen) {
  try {
    window.localStorage.setItem(SPEICHER_SCHLUESSEL, JSON.stringify(optionen));
    return true;
  } catch (fehler) {
    console.warn("Einstellungen konnten nicht gespeichert werden:", fehler);
    return false;
  }
}

function vergissOptionen() {
  try {
    window.localStorage.removeItem(SPEICHER_SCHLUESSEL);
  } catch (fehler) {
    console.warn("Einstellungen konnten nicht entfernt werden:", fehler);
  }
}

export {
  DEFAULTS,
  OPTION_GROUPS,
  ALLE_OPTIONEN,
  ladeOptionen,
  speichereOptionen,
  vergissOptionen,
};
