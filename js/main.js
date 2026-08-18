// ==========================================================================
// Einstiegspunkt. Haengt die App an das Wurzelelement und faengt
// Startfehler sichtbar ab, statt einen schwarzen Bildschirm zu zeigen.
// ==========================================================================

import { Warhammer40KEncyclopedia } from "./app.js";

const wurzel = document.getElementById("root");

try {
  ReactDOM.createRoot(wurzel).render(
    React.createElement(Warhammer40KEncyclopedia)
  );
} catch (fehler) {
  wurzel.innerHTML =
    '<pre style="color:#ff5555;padding:20px;white-space:pre-wrap;' +
    'font-family:monospace">Fehler beim Start:\n' +
    ((fehler && fehler.message) || fehler) + "</pre>";
}
