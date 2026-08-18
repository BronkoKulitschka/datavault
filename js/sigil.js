// ==========================================================================
// Sigillen: djb2-Hash und die daraus erzeugte Geometrie.
// ==========================================================================


/* ============================================================================
 * ARTICLE SIGILS — procedural, unique per article.
 * ----------------------------------------------------------------------------
 * The app ships NO artwork. Every article illustration is generated at runtime
 * as an SVG from the article name's djb2 hash, so it is deterministic (the same
 * article always looks the same) and entirely our own work. No third-party
 * image files are downloaded, bundled or served.
 * ========================================================================== */
function imageIdFor(name) {
  const s = String(name || "").trim().toLowerCase();
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = h * 33 + s.charCodeAt(i) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

// Builds the geometry for one procedural sigil from a seed string.
// Pure maths — deterministic, no files, no network.
function sigilGeometry(seed, variant) {
  const s = String(seed || "") + "::" + variant;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = h * 33 + s.charCodeAt(i) >>> 0;
  const rnd = () => {
    h ^= h << 13;
    h >>>= 0;
    h ^= h >> 17;
    h ^= h << 5;
    h >>>= 0;
    return h / 4294967296;
  };
  const pick = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const C = 100;
  const poly = (sides, r, rot) => {
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const a = rot + i * 2 * Math.PI / sides;
      pts.push((C + r * Math.cos(a)).toFixed(2) + "," + (C + r * Math.sin(a)).toFixed(2));
    }
    return pts.join(" ");
  };
  const rings = [];
  const ringCount = pick(3, 5);
  for (let i = 0; i < ringCount; i++) {
    rings.push({
      points: poly(pick(3, 8), 82 - i * pick(12, 18), rnd() * Math.PI * 2),
      op: (0.5 - i * 0.07).toFixed(2)
    });
  }
  const spokeCount = pick(6, 16);
  const spokes = [];
  const spokeRot = rnd() * Math.PI * 2;
  for (let i = 0; i < spokeCount; i++) {
    const a = spokeRot + i * 2 * Math.PI / spokeCount;
    const inner = pick(20, 45),
      outer = pick(70, 92);
    spokes.push({
      x1: (C + inner * Math.cos(a)).toFixed(2),
      y1: (C + inner * Math.sin(a)).toFixed(2),
      x2: (C + outer * Math.cos(a)).toFixed(2),
      y2: (C + outer * Math.sin(a)).toFixed(2)
    });
  }
  const ticks = [];
  const tickCount = pick(24, 48);
  for (let i = 0; i < tickCount; i++) {
    const a = i * 2 * Math.PI / tickCount;
    const len = rnd() > 0.7 ? 8 : 4;
    ticks.push({
      x1: (C + 92 * Math.cos(a)).toFixed(2),
      y1: (C + 92 * Math.sin(a)).toFixed(2),
      x2: (C + (92 - len) * Math.cos(a)).toFixed(2),
      y2: (C + (92 - len) * Math.sin(a)).toFixed(2)
    });
  }
  return {
    rings,
    spokes,
    ticks,
    core: poly(pick(3, 6), pick(10, 20), rnd() * Math.PI * 2),
    coreRing: pick(24, 34),
    bars: [pick(14, 30), pick(14, 30), pick(14, 30)]
  };
}

export { imageIdFor, sigilGeometry };
