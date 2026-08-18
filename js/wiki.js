// ==========================================================================
// Wiki-Anbindung: Quellen, Abruf, Aufbereitung der Artikel.
// ==========================================================================


/* ============================================================================
 * DATA SOURCES — MediaWiki community wikis (no AI, no API key, free)
 * ----------------------------------------------------------------------------
 * Content is fetched live from two fan-run MediaWiki sites via their public
 * action API. This is a plain data request (action=query / parse), NOT an AI
 * API, so it costs nothing.
 *
 * NOTE on CORS: MediaWiki supports cross-origin reads when you pass
 * `origin=*`. Fandom generally allows this from the browser. Lexicanum has
 * stricter bot protection and may refuse some requests; we therefore try
 * Fandom first and fall back to Lexicanum.
 *
 * LEGAL POSTURE (as of v0.58):
 *   - Text is fetched live and never stored, cached or bundled. The app is a
 *     reader, not a publisher.
 *   - No third-party artwork ships with or is loaded by the app. All article
 *     graphics are generated procedurally at runtime (see ARTICLE SIGILS).
 *   - The app name carries no Games Workshop trademark.
 *   - Distribution must stay free: no price, no ads, no in-app purchases.
 *   - Wiki text is CC-BY-SA; each article links its source for attribution.
 *   Warhammer 40,000 and all associated marks remain © Games Workshop Ltd.
 *   This is an unofficial, non-commercial fan project.
 * ========================================================================== */
const WIKI_SOURCES = [{
  id: "fandom",
  label: "Warhammer 40k Wiki",
  api: "https://warhammer40k.fandom.com/api.php",
  base: "https://warhammer40k.fandom.com/wiki/"
}, {
  id: "lexicanum",
  label: "Lexicanum",
  api: "https://wh40k.lexicanum.com/mediawiki/api.php",
  base: "https://wh40k.lexicanum.com/wiki/"
}];

// Build a CORS-enabled MediaWiki API URL.
function wikiUrl(source, params) {
  const usp = new URLSearchParams({
    format: "json",
    origin: "*",
    ...params
  });
  return `${source.api}?${usp.toString()}`;
}

// Search a single wiki; returns array of {title, snippet, source}.
async function searchWiki(source, term, limit = 10) {
  const url = wikiUrl(source, {
    action: "query",
    list: "search",
    srsearch: term,
    srlimit: String(limit),
    srprop: "snippet"
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${source.label} search ${res.status}`);
  const data = await res.json();
  const hits = data?.query?.search || [];
  return hits.map(h => ({
    title: h.title,
    snippet: stripHtml(h.snippet || ""),
    source
  }));
}

// Search both wikis in parallel; merge, de-dupe by title (Fandom first).
async function searchAllWikis(term, limit = 12) {
  const results = await Promise.allSettled(WIKI_SOURCES.map(s => searchWiki(s, term, limit)));
  const merged = [];
  const seen = new Set();
  for (const r of results) {
    if (r.status !== "fulfilled") continue;
    for (const hit of r.value) {
      const key = hit.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(hit);
    }
  }
  if (!merged.length) {
    const reasons = results.filter(r => r.status === "rejected").map(r => r.reason?.message).join("; ");
    throw new Error(reasons || "No results found in either archive.");
  }
  return merged;
}

// Load ALL members of a category from one wiki, following cmcontinue.
// Returns array of titles. Fails quietly (e.g. Lexicanum bot block).
async function loadCategoryFrom(source, category) {
  if (!category) return [];
  const titles = [];
  let cont = null;
  try {
    do {
      const params = {
        action: "query",
        list: "categorymembers",
        cmtitle: category,
        cmlimit: "500",
        cmtype: "page"
      };
      if (cont) params.cmcontinue = cont;
      const res = await fetch(wikiUrl(source, params));
      if (!res.ok) break;
      const data = await res.json();
      const members = data?.query?.categorymembers || [];
      members.forEach(m => titles.push(m.title));
      cont = data?.continue?.cmcontinue || null;
    } while (cont);
  } catch (e) {
    // ignore — one wiki may be unreachable
  }
  return titles;
}

// Load a category from both wikis and merge by title.
// Returns array of { title, sources:[source,...] }, sorted alphabetically.
async function loadCategoryMerged(categoryByWiki) {
  const byKey = {};
  await Promise.all(WIKI_SOURCES.map(async source => {
    const category = categoryByWiki[source.id];
    const titles = await loadCategoryFrom(source, category);
    titles.forEach(title => {
      const key = title.toLowerCase();
      if (!byKey[key]) byKey[key] = {
        title,
        sources: []
      };
      if (!byKey[key].sources.includes(source)) byKey[key].sources.push(source);
    });
  }));
  return Object.values(byKey).sort((a, b) => a.title.localeCompare(b.title));
}

// Fetch a parsed article (intro sections) from a wiki by exact title.
async function fetchArticle(source, title) {
  const url = wikiUrl(source, {
    action: "parse",
    page: title,
    prop: "text|sections|displaytitle",
    redirects: "1"
  });
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${source.label} fetch ${res.status}`);
  const data = await res.json();
  if (data.error) throw new Error(data.error.info || "Article not found");
  return data.parse;
}

// --- HTML helpers (no external deps) -------------------------------------
function stripHtml(html) {
  if (typeof document !== "undefined") {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return (tmp.textContent || tmp.innerText || "").trim();
  }
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Convert a MediaWiki parsed article into the app's entry structure:
 * { title, category, faction, summary, sections[], keyFacts[], relatedTopics[],
 *   sourceLabel, sourceUrl }
 * Wiki links inside paragraphs are converted to [[Term]] markers so the
 * existing renderLinkedText() keeps cross-linking working.
 */
function parseArticleToEntry(parse, source) {
  const title = stripHtml(parse.displaytitle || parse.title || "");
  const html = parse.text?.["*"] || "";
  const doc = typeof document !== "undefined" ? new DOMParser().parseFromString(html, "text/html") : null;
  const summary = "Archive entry retrieved from the " + source.label + ".";
  const sections = [];
  const keyFacts = [];
  const relatedTopics = [];
  if (doc) {
    const content = doc.querySelector(".mw-parser-output") || doc.body;

    // Remove noise: tables of contents, edit links, reference markers, etc.
    content.querySelectorAll(".toc, .mw-editsection, .reference, .navbox, .noprint, style, .reflist, sup.reference").forEach(el => el.remove());

    // Infobox -> key facts (portable infobox is common on Fandom).
    const infobox = content.querySelector(".portable-infobox, .infobox, table.infobox");
    if (infobox) {
      infobox.querySelectorAll(".pi-item, tr").forEach(row => {
        const label = row.querySelector(".pi-data-label, th")?.textContent?.trim();
        const value = row.querySelector(".pi-data-value, td")?.textContent?.trim();
        if (label && value && label.length < 40 && value.length < 80) {
          keyFacts.push({
            label,
            value
          });
        }
      });
    }

    // Walk top-level children, grouping paragraphs under their headings.
    let currentHeading = "Overview";
    let buffer = [];
    const flush = () => {
      const text = buffer.join("\n\n").trim();
      if (text) sections.push({
        heading: currentHeading,
        content: text
      });
      buffer = [];
    };
    const nodes = Array.from(content.children);
    for (const node of nodes) {
      const tag = node.tagName?.toLowerCase();
      if (tag === "h2" || tag === "h3") {
        flush();
        currentHeading = node.textContent.replace(/\[edit\]/gi, "").trim();
        // Stop at boilerplate trailing sections.
        if (/^(references|sources|gallery|see also|external links)$/i.test(currentHeading)) {
          currentHeading = null;
          break;
        }
      } else if (tag === "p") {
        const withLinks = paragraphWithLinks(node);
        if (withLinks.trim().length > 0) buffer.push(withLinks);
        // collect related topics from links
        node.querySelectorAll("a[href^='/wiki/'], a[href*='/wiki/']").forEach(a => {
          const t = a.textContent.trim();
          if (t && t.length < 40 && relatedTopics.length < 12 && !relatedTopics.includes(t)) {
            relatedTopics.push(t);
          }
        });
      }
      if (sections.length >= 6) break;
    }
    if (currentHeading) flush();
  }

  // Fallbacks if parsing yielded little.
  if (sections.length === 0) {
    sections.push({
      heading: "Overview",
      content: "This entry could not be fully parsed. Open it on the source wiki for the complete article."
    });
  }
  return {
    title,
    category: "Archive Entry",
    faction: source.label,
    classification: "VERIDICAL ARCHIVE",
    warningLevel: "STANDARD",
    summary,
    sections: sections.slice(0, 6),
    keyFacts: keyFacts.slice(0, 8),
    relatedTopics: relatedTopics.slice(0, 10),
    quote: null,
    quoteSource: null,
    sourceLabel: source.label,
    sourceUrl: source.base + encodeURIComponent((title || "").replace(/ /g, "_"))
  };
}

// Convert a <p> node to text, turning internal wiki links into [[markers]].
function paragraphWithLinks(p) {
  let out = "";
  p.childNodes.forEach(child => {
    if (child.nodeType === 3) {
      out += child.textContent;
    } else if (child.nodeType === 1) {
      const el = child;
      const href = el.getAttribute?.("href") || "";
      const text = el.textContent || "";
      if (el.tagName === "A" && /\/wiki\//.test(href) && text.trim() && !href.includes(":")) {
        out += `[[${text.trim()}]]`;
      } else {
        out += text;
      }
    }
  });
  return out;
}

export { WIKI_SOURCES, wikiUrl, stripHtml, parseArticleToEntry, paragraphWithLinks };
