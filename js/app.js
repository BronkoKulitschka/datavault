import { APP_VERSION } from "./version.js";
import { imageIdFor, sigilGeometry } from "./sigil.js";
import {
  WIKI_SOURCES,
  wikiUrl,
  stripHtml,
  parseArticleToEntry,
  paragraphWithLinks,
  searchWiki,
  searchAllWikis,
  loadCategoryFrom,
  loadCategoryMerged,
  fetchArticle,
} from "./wiki.js";
import { FACTIONS } from "./data/factions.js";
import { SEARCH_CATEGORIES, INDEX_TYPES } from "./data/search.js";
import { CATEGORY_MAP } from "./data/categories.js";
import { IMPORTANT_MAP } from "./data/important.js";
import { MINOR_FACTIONS } from "./data/minor-factions.js";
import { TIMELINE } from "./data/timeline.js";
import { FACTION_INDEX_TYPES, PLACEHOLDER_QUERIES } from "./data/misc.js";
import { DEFAULTS, OPTION_GROUPS, ladeOptionen, speichereOptionen, vergissOptionen } from "./options.js";
import { baseStyles } from "./styles/base.js";
import { panelStyles } from "./styles/panels.js";
import { timelineStyles } from "./styles/timeline.js";
import { headerStyles } from "./styles/header.js";
import { articleStyles } from "./styles/article.js";
import { contentStyles } from "./styles/content.js";

// React kommt als globales Objekt vom CDN.
const { useState, useEffect, useRef, useMemo } = React;

function Warhammer40KEncyclopedia() {
  // Einmalig beim Start aus dem Geraetespeicher lesen.
  const [options, setOptions] = useState(ladeOptionen);
  const [optionsGruppe, setOptionsGruppe] = useState(OPTION_GROUPS[0].id);

  // Startfraktion aus den Einstellungen, sonst die erste.
  const [activeFaction, setActiveFaction] = useState(() => {
    const gemerkt = FACTIONS.find(f => f.id === options.startFaction);
    return gemerkt || FACTIONS[0];
  });
  const [showOptions, setShowOptions] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const setOption = (key, value) => setOptions(o => ({
    ...o,
    [key]: value
  }));

  // Jede Aenderung sofort sichern, damit nichts verloren geht,
  // wenn die App im Hintergrund beendet wird.
  useEffect(() => {
    speichereOptionen(options);
  }, [options]);
  const [query, setQuery] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [category, setCategory] = useState("All");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [indexData, setIndexData] = useState(null);
  const [searchHits, setSearchHits] = useState(null);
  const [indexLoading, setIndexLoading] = useState(false);
  const [activeIndexType, setActiveIndexType] = useState(null);
  const [indexFilter, setIndexFilter] = useState("");
  const [minorFilter, setMinorFilter] = useState("");
  const inputRef = useRef(null);

  // Optionaler Startfokus. Nur einmal, und nicht wenn Bewegung
  // reduziert ist — die aufspringende Tastatur waere sonst stoerend.
  useEffect(() => {
    if (options.autoFocus && inputRef.current) inputRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const cacheRef = useRef({});
  const topRef = useRef(null);
  const colors = activeFaction.colors;

  // Scroll the view back to the top whenever a new entry or index is shown,
  // or when the active faction changes.
  useEffect(() => {
    const scroll = () => {
      if (typeof window !== "undefined") {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
      if (topRef.current?.scrollIntoView) {
        topRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    };
    requestAnimationFrame(scroll);
  }, [results, indexData, searchHits, activeFaction]);
  const switchFaction = faction => {
    setAnimating(true);
    setTimeout(() => {
      setActiveFaction(faction);
      setAnimating(false);
      setIndexData(null);
      setActiveIndexType(null);
      setResults(null);
      setSearchHits(null);
      setError(null);
    }, 300);
  };
  const goHome = () => {
    setResults(null);
    setError(null);
    setQuery("");
    setIndexData(null);
    setActiveIndexType(null);
    setSearchHits(null);
    if (inputRef.current) inputRef.current.focus();
  };
  const loadIndex = async indexType => {
    setIndexLoading(true);
    setError(null);
    setResults(null);
    setIndexData(null);
    setSearchHits(null);
    setActiveIndexType(indexType);
    setIndexFilter("");
    try {
      // Look up the real wiki categories for this faction + topic.
      const catMap = (CATEGORY_MAP[activeFaction.id] || {})[indexType.id];
      let entries = [];
      if (catMap) {
        // Load the FULL category list from both wikis, merged.
        const merged = await loadCategoryMerged({
          fandom: catMap.fandom,
          lexicanum: catMap.lexicanum
        });
        entries = merged.map(e => ({
          name: e.title,
          sources: e.sources,
          source: e.sources[0]
        }));
      }

      // Pin curated important names on top (force-add if missing from the list).
      const important = (IMPORTANT_MAP[activeFaction.id] || {})[indexType.id] || [];
      const haveKeys = new Set(entries.map(e => e.name.toLowerCase()));
      const importantSet = new Set(important.map(n => n.toLowerCase()));
      const importantEntries = important.map(name => {
        const existing = entries.find(e => e.name.toLowerCase() === name.toLowerCase());
        return existing || {
          name,
          sources: WIKI_SOURCES,
          source: WIKI_SOURCES[0],
          forced: true
        };
      });
      // Remaining (non-important) entries, alphabetical.
      const rest = entries.filter(e => !importantSet.has(e.name.toLowerCase()));

      // Fallback: if no category configured/returned, use the old keyword search.
      if (!entries.length && !important.length) {
        const term = `${activeFaction.shortName} ${indexType.query}`;
        const hits = await searchAllWikis(term, 18);
        setIndexData({
          indexTitle: `${indexType.label} — ${activeFaction.shortName}`,
          entries: hits.map(h => ({
            name: h.title,
            blurb: h.snippet,
            source: h.source
          }))
        });
        return;
      }
      setIndexData({
        indexTitle: `${indexType.label} — ${activeFaction.shortName}`,
        important: importantEntries,
        entries: rest,
        totalCount: importantEntries.length + rest.length
      });
    } catch (err) {
      setError("THE INDEX HAS FAILED. The machine spirit reports: " + (err?.message || "unknown disturbance.") + " — Often a cross-origin (CORS) restriction in the preview; works in the standalone app.");
      setActiveIndexType(null);
    } finally {
      setIndexLoading(false);
    }
  };

  // Fetch and display a specific article by exact title from a given source.
  const openArticle = async (title, preferredSource = null) => {
    const cacheKey = `article|${title.toLowerCase()}`;
    if (cacheRef.current[cacheKey]) {
      setError(null);
      setSearchHits(null);
      setIndexData(null);
      setActiveIndexType(null);
      setResults(cacheRef.current[cacheKey]);
      return;
    }
    setIsLoading(true);
    setError(null);
    setResults(null);
    setSearchHits(null);
    // Reihenfolge: ausdruecklich gewuenschte Quelle zuerst, sonst die
    // in den Einstellungen bevorzugte, sonst die Standardreihenfolge.
    const bevorzugt = preferredSource || (options.preferredSource !== "auto"
      ? WIKI_SOURCES.find(s => s.id === options.preferredSource)
      : null);
    const order = bevorzugt ? [bevorzugt, ...WIKI_SOURCES.filter(s => s.id !== bevorzugt.id)] : WIKI_SOURCES;
    let lastErr = null;
    for (const source of order) {
      try {
        const parse = await fetchArticle(source, title);
        const entry = parseArticleToEntry(parse, source);
        cacheRef.current[cacheKey] = entry;
        setResults(entry);
        setIsLoading(false);
        const hist = {
          query: title,
          faction: activeFaction.id,
          category,
          timestamp: Date.now()
        };
        setHistory(prev => [hist, ...prev.filter(h => h.query !== title).slice(0, 9)]);
        return;
      } catch (err) {
        lastErr = err;
      }
    }
    setError("THE ARCHIVE IS SEALED. The machine spirit reports: " + (lastErr?.message || "the record could not be retrieved.") + " — This is often a cross-origin (CORS) restriction in the preview; it will work in the standalone app.");
    setIsLoading(false);
  };

  // Run a search across both wikis and show the list of matching records.
  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    setResults(null);
    setIndexData(null);
    setActiveIndexType(null);
    setSearchHits(null);
    try {
      const hits = await searchAllWikis(searchQuery.trim(), 12);
      setSearchHits({
        term: searchQuery.trim(),
        items: hits
      });
      const entry = {
        query: searchQuery,
        faction: activeFaction.id,
        category,
        timestamp: Date.now()
      };
      setHistory(prev => [entry, ...prev.filter(h => h.query !== searchQuery).slice(0, 9)]);
    } catch (err) {
      setError("THE ARCHIVE SEARCH FAILED. The machine spirit reports: " + (err?.message || "no signal from the noosphere.") + " — This is often a cross-origin (CORS) restriction in the preview; it will work in the standalone app.");
    } finally {
      setIsLoading(false);
    }
  };
  const warningColors = {
    CLASSIFIED: colors.primary,
    HERETICAL: "#CC2200",
    XENOS: "#00CED1",
    STANDARD: "#666"
  };

  // Turns "[[Term]]" markers into clickable links that trigger a new search.
  const renderLinkedText = text => {
    if (!text) return null;
    const parts = String(text).split(/(\[\[[^\]]+\]\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[\[([^\]]+)\]\]$/);
      if (match) {
        const term = match[1].trim();
        return /*#__PURE__*/React.createElement("span", {
          key: i,
          className: "lore-link",
          role: "link",
          tabIndex: 0,
          onClick: () => openArticle(term),
          onKeyDown: e => {
            if (e.key === "Enter") openArticle(term);
          }
        }, term);
      }
      return part;
    });
  };

  // Draws one procedural sigil. Nothing is loaded from anywhere — the whole
  // figure is computed from the article name and painted as inline SVG.
  const ArticleSigil = ({
    seed,
    variant = 0
  }) => {
    const g = useMemo(() => sigilGeometry(seed, variant), [seed, variant]);
    if (!seed) return null;
    const line = colors.primary;
    return /*#__PURE__*/React.createElement("div", {
      className: "article-sigil",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 200 200",
      width: "100%",
      height: "100%",
      preserveAspectRatio: "xMidYMid meet"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "100",
      cy: "100",
      r: "92",
      fill: "none",
      stroke: line,
      strokeWidth: "0.6",
      opacity: "0.45"
    }), g.ticks.map((t, i) => /*#__PURE__*/React.createElement("line", {
      key: "t" + i,
      x1: t.x1,
      y1: t.y1,
      x2: t.x2,
      y2: t.y2,
      stroke: line,
      strokeWidth: "0.7",
      opacity: "0.4"
    })), g.spokes.map((s, i) => /*#__PURE__*/React.createElement("line", {
      key: "s" + i,
      x1: s.x1,
      y1: s.y1,
      x2: s.x2,
      y2: s.y2,
      stroke: line,
      strokeWidth: "0.6",
      opacity: "0.28"
    })), g.rings.map((r, i) => /*#__PURE__*/React.createElement("polygon", {
      key: "r" + i,
      points: r.points,
      fill: "none",
      stroke: line,
      strokeWidth: "0.9",
      opacity: r.op
    })), /*#__PURE__*/React.createElement("circle", {
      cx: "100",
      cy: "100",
      r: String(g.coreRing),
      fill: "none",
      stroke: line,
      strokeWidth: "0.8",
      opacity: "0.55"
    }), /*#__PURE__*/React.createElement("polygon", {
      points: g.core,
      fill: line,
      opacity: "0.22",
      stroke: line,
      strokeWidth: "1",
      strokeOpacity: "0.7"
    }), g.bars.map((w, i) => /*#__PURE__*/React.createElement("rect", {
      key: "b" + i,
      x: String(100 - w / 2),
      y: String(150 + i * 7),
      width: String(w),
      height: "2",
      fill: line,
      opacity: "0.35"
    }))));
  };
  const css =
    baseStyles(colors, options) +
    panelStyles(colors, options) +
    timelineStyles(colors, options) +
    headerStyles(colors, options) +
    articleStyles(colors, options) +
    contentStyles(colors, options);

  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, css), /*#__PURE__*/React.createElement("div", {
    className: [
      "w40k-app",
      options.reduceMotion ? "no-motion" : "",
      options.highContrast ? "hoher-kontrast" : "",
      options.largeTargets ? "grosse-ziele" : "",
      options.underlineLinks ? "verweise-unterstrichen" : "",
      options.serifBody ? "serifen" : "",
      options.roundedCorners ? "" : "eckig"
    ].filter(Boolean).join(" "),
    style: {
      opacity: animating ? 0 : 1,
      transition: options.reduceMotion ? "none" : "opacity 0.3s"
    }
  }, showTimeline && /*#__PURE__*/React.createElement("div", {
    className: "options-overlay",
    onClick: () => setShowTimeline(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "options-panel timeline-panel",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "options-head"
  }, /*#__PURE__*/React.createElement("span", null, "⧗ ZEITLEISTE"), /*#__PURE__*/React.createElement("button", {
    className: "options-close",
    onClick: () => setShowTimeline(false)
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "timeline-intro"
  }, "Die Geschichte der Galaxis — vom Krieg im Himmel bis zur Ära Indomitus. Tippe ein Ereignis an, um den vollständigen Artikel zu öffnen."), /*#__PURE__*/React.createElement("div", {
    className: "timeline"
  }, TIMELINE.map((ev, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "tl-event",
    onClick: () => {
      setShowTimeline(false);
      openArticle(ev.article);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-dot"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tl-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-date"
  }, ev.date, " · ", ev.era), /*#__PURE__*/React.createElement("span", {
    className: "tl-title"
  }, ev.title), /*#__PURE__*/React.createElement("span", {
    className: "tl-blurb"
  }, ev.blurb))))))), showInfo && /*#__PURE__*/React.createElement("div", {
    className: "options-overlay",
    onClick: () => setShowInfo(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "options-panel info-panel",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "options-head"
  }, /*#__PURE__*/React.createElement("span", null, "ℹ HANDBUCH"), /*#__PURE__*/React.createElement("button", {
    className: "options-close",
    onClick: () => setShowInfo(false)
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "info-body"
  }, /*#__PURE__*/React.createElement("h3", null, "Datavault"), /*#__PURE__*/React.createElement("p", {
    className: "info-ver"
  }, "Version ", APP_VERSION, " · Prototyp"), /*#__PURE__*/React.createElement("p", null, "Eine Enzyklopädie für das Warhammer-40.000-Universum. Alle Inhalte werden live aus den Community-Wikis geladen."), /*#__PURE__*/React.createElement("h4", null, "◆ Fraktionen"), /*#__PURE__*/React.createElement("p", null, "Oben wählst du eine der sechs Fraktionen: Imperium, Chaos, Aeldari, Orks, Necrons und T'au. Jede hat ihr eigenes Farbschema und eigene Archive."), /*#__PURE__*/React.createElement("h4", null, "◆ Suche"), /*#__PURE__*/React.createElement("p", null, "Über das Suchfeld findest du Artikel aus beiden Wikis. Tippe einen Begriff ein und wähle aus den Treffern."), /*#__PURE__*/React.createElement("h4", null, "◆ Index-Übersichten"), /*#__PURE__*/React.createElement("p", null, "Jede Fraktion hat sechs Kategorien: Personen, Welten & Orte, Technologie, Waffen, Organisationen und Schlachten. Ein Tipp darauf lädt die vollständige Liste aus dem Wiki."), /*#__PURE__*/React.createElement("p", null, "Ganz oben stehen im Block ", /*#__PURE__*/React.createElement("b", null, "★ WICHTIGE"), " die zentralen Einträge. Darunter folgt die vollständige alphabetische Liste. Mit dem Filterfeld suchst du schnell in langen Listen."), /*#__PURE__*/React.createElement("h4", null, "◆ Artikel"), /*#__PURE__*/React.createElement("p", null, "Ein Tipp auf einen Eintrag öffnet den Artikeltext. Querverweise im Text sind anklickbar und führen zu verwandten Einträgen. Jeder Artikel nennt seine Quelle mit Link zum Original-Wiki."), /*#__PURE__*/React.createElement("h4", null, "◆ Zeitleiste ⧗"), /*#__PURE__*/React.createElement("p", null, "Die Schaltfläche unter der Fraktionsleiste öffnet die Chronik der Galaxis — von der Frühzeit bis zur aktuellen Ära. Ein Tipp auf ein Ereignis öffnet den vollständigen Artikel."), /*#__PURE__*/React.createElement("h4", null, "◆ Optionen ⚙"), /*#__PURE__*/React.createElement("p", null, "Über das Zahnrad erreichst du vier Bereiche: Darstellung (Schrift, Zeilenabstand, Textbreite), CRT-Effekte (Helligkeit, Leuchten, Scanlines, Flackern), Verhalten (Startfraktion, bevorzugtes Wiki, Sigillen) und Barrierefreiheit (hoher Kontrast, Bewegung, größere Schaltflächen). Alle Einstellungen bleiben auf diesem Gerät erhalten."), /*#__PURE__*/React.createElement("h4", null, "◆ Quellen"), /*#__PURE__*/React.createElement("p", null, "Artikeltexte werden live aus dem Warhammer-40k-Fandom-Wiki und aus Lexicanum geladen und stehen unter CC-BY-SA; die Quelle ist bei jedem Artikel verlinkt. Diese App speichert keine Inhalte und enth\u00e4lt kein fremdes Bildmaterial \u2014 alle Grafiken werden zur Laufzeit selbst erzeugt. Warhammer 40.000 und alle zugeh\u00f6rigen Namen, Marken und Bilder sind Eigentum von Games Workshop Ltd. Datavault ist ein inoffizielles, nicht-kommerzielles Fan-Projekt und steht in keiner Verbindung zu Games Workshop."), /*#__PURE__*/React.createElement("p", {
    className: "info-foot"
  }, "✠ Wissen ist Macht — bewahre es gut ✠")))), showOptions && /*#__PURE__*/React.createElement("div", {
    className: "options-overlay",
    onClick: () => setShowOptions(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "options-panel options-panel-gross",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "options-head"
  }, /*#__PURE__*/React.createElement("span", null, "\u2699 OPTIONEN"), /*#__PURE__*/React.createElement("button", {
    className: "options-close",
    onClick: () => setShowOptions(false),
    "aria-label": "Optionen schließen"
  }, "\u2715")),

  // Reiterleiste der Gruppen
  /*#__PURE__*/React.createElement("div", {
    className: "options-tabs",
    role: "tablist"
  }, OPTION_GROUPS.map(gruppe => /*#__PURE__*/React.createElement("button", {
    key: gruppe.id,
    className: `options-tab ${optionsGruppe === gruppe.id ? "active" : ""}`,
    role: "tab",
    "aria-selected": optionsGruppe === gruppe.id,
    onClick: () => setOptionsGruppe(gruppe.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "options-tab-symbol"
  }, gruppe.symbol), gruppe.titel))),

  // Inhalt der gewaehlten Gruppe — baut sich aus OPTION_GROUPS auf
  /*#__PURE__*/React.createElement("div", {
    className: "options-body"
  }, OPTION_GROUPS.filter(g => g.id === optionsGruppe).map(gruppe => /*#__PURE__*/React.createElement("div", {
    key: gruppe.id,
    className: "options-group"
  }, gruppe.optionen.map(o => {
    // Abhaengige Optionen ausblenden, wenn ihr Schalter aus ist
    if (o.nurWenn && !options[o.nurWenn]) return null;

    if (o.typ === "regler") {
      return /*#__PURE__*/React.createElement("div", {
        key: o.key,
        className: "option-row"
      }, /*#__PURE__*/React.createElement("label", {
        htmlFor: "opt-" + o.key
      }, o.label, ": ", /*#__PURE__*/React.createElement("b", null, options[o.key], o.einheit || "")), /*#__PURE__*/React.createElement("input", {
        id: "opt-" + o.key,
        type: "range",
        min: String(o.min),
        max: String(o.max),
        step: String(o.schritt || 1),
        value: options[o.key],
        onChange: e => setOption(o.key, Number(e.target.value))
      }), o.hinweis && /*#__PURE__*/React.createElement("div", {
        className: "option-hint"
      }, o.hinweis));
    }

    if (o.typ === "schalter") {
      return /*#__PURE__*/React.createElement("div", {
        key: o.key,
        className: "option-row toggle",
        role: "switch",
        tabIndex: 0,
        "aria-checked": Boolean(options[o.key]),
        onClick: () => setOption(o.key, !options[o.key]),
        onKeyDown: e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOption(o.key, !options[o.key]);
          }
        }
      }, /*#__PURE__*/React.createElement("label", null, o.label), /*#__PURE__*/React.createElement("span", {
        className: `switch ${options[o.key] ? "on" : ""}`
      }, /*#__PURE__*/React.createElement("span", {
        className: "knob"
      })), o.hinweis && /*#__PURE__*/React.createElement("div", {
        className: "option-hint"
      }, o.hinweis));
    }

    if (o.typ === "auswahl") {
      return /*#__PURE__*/React.createElement("div", {
        key: o.key,
        className: "option-row"
      }, /*#__PURE__*/React.createElement("label", null, o.label), /*#__PURE__*/React.createElement("div", {
        className: "option-choices"
      }, o.werte.map(w => /*#__PURE__*/React.createElement("button", {
        key: w.wert,
        className: `option-choice ${options[o.key] === w.wert ? "active" : ""}`,
        onClick: () => setOption(o.key, w.wert)
      }, w.label))), o.hinweis && /*#__PURE__*/React.createElement("div", {
        className: "option-hint"
      }, o.hinweis));
    }

    return null;
  })))),

  /*#__PURE__*/React.createElement("button", {
    className: "options-reset",
    onClick: () => {
      vergissOptionen();
      setOptions({ ...DEFAULTS });
    }
  }, "\u25c4 Alles zurücksetzen"), /*#__PURE__*/React.createElement("div", {
    className: "options-note"
  }, "Einstellungen werden auf diesem Gerät gespeichert."))), /*#__PURE__*/React.createElement("header", {
    className: "header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "header-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "logo-area",
    onClick: goHome,
    title: "Return to archives"
  }, /*#__PURE__*/React.createElement("span", {
    className: "aquila"
  }, activeFaction.symbol), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "logo-text"
  }, "DATAVAULT"), /*#__PURE__*/React.createElement("div", {
    className: "logo-sub"
  }, "ARCHIVE TERMINAL · ", APP_VERSION))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "14px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "'Cinzel', serif",
      fontSize: "9px",
      letterSpacing: "2px",
      color: colors.text + "55",
      textAlign: "right"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      color: colors.primary,
      fontSize: "8px"
    }
  }, "ACTIVE FACTION"), /*#__PURE__*/React.createElement("div", {
    style: {
      color: colors.accent
    }
  }, activeFaction.name.toUpperCase())), /*#__PURE__*/React.createElement("button", {
    className: "gear-btn",
    onClick: () => setShowInfo(true),
    title: "Info & Handbuch",
    "aria-label": "Info und Handbuch"
  }, "ℹ"), /*#__PURE__*/React.createElement("button", {
    className: "gear-btn",
    onClick: () => setShowOptions(true),
    title: "Optionen",
    "aria-label": "Optionen"
  }, "⚙"))), /*#__PURE__*/React.createElement("div", {
    className: "faction-bar"
  }, FACTIONS.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: `faction-btn ${activeFaction.id === f.id ? "active" : ""}`,
    onClick: () => switchFaction(f)
  }, /*#__PURE__*/React.createElement("span", {
    className: "faction-symbol"
  }, f.symbol), f.shortName))), /*#__PURE__*/React.createElement("div", {
    className: "timeline-bar"
  }, /*#__PURE__*/React.createElement("button", {
    className: "timeline-btn",
    onClick: () => setShowTimeline(true)
  }, /*#__PURE__*/React.createElement("span", {
    className: "timeline-btn-symbol"
  }, "\u29d7"), /*#__PURE__*/React.createElement("span", {
    className: "timeline-btn-text"
  }, /*#__PURE__*/React.createElement("b", null, "ZEITLEISTE"), /*#__PURE__*/React.createElement("span", {
    className: "timeline-btn-sub"
  }, "Chronik der Galaxis \u2014 War in Heaven bis Era Indomitus")), /*#__PURE__*/React.createElement("span", {
    className: "timeline-btn-pfeil"
  }, "\u25b8")))), /*#__PURE__*/React.createElement("main", {
    className: "main-content"
  }, /*#__PURE__*/React.createElement("div", {
    ref: topRef,
    style: {
      position: "absolute",
      top: 0
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("div", {
    className: "search-section"
  }, /*#__PURE__*/React.createElement("span", {
    className: "search-label"
  }, "⬛ Query the Archive"), /*#__PURE__*/React.createElement("div", {
    className: "search-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "search-input-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "terminal-prompt"
  }, ">"), /*#__PURE__*/React.createElement("input", {
    ref: inputRef,
    className: "search-input has-prompt",
    value: query,
    onChange: e => setQuery(e.target.value),
    onFocus: () => setInputFocused(true),
    onBlur: () => setInputFocused(false),
    onKeyDown: e => e.key === "Enter" && handleSearch(),
    placeholder: inputFocused ? "" : "AWAITING QUERY..."
  }), !query && !inputFocused && /*#__PURE__*/React.createElement("span", {
    className: "terminal-cursor"
  }, "█")), /*#__PURE__*/React.createElement("button", {
    className: "search-btn",
    onClick: () => handleSearch(),
    disabled: isLoading || !query.trim()
  }, isLoading ? "QUERYING..." : "SEARCH")), /*#__PURE__*/React.createElement("div", {
    className: "category-row"
  }, SEARCH_CATEGORIES.map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat,
    className: `cat-btn ${category === cat ? "active" : ""}`,
    onClick: () => setCategory(cat)
  }, cat))), !results && !isLoading && /*#__PURE__*/React.createElement("div", {
    className: "placeholder-chips"
  }, PLACEHOLDER_QUERIES.map(q => /*#__PURE__*/React.createElement("button", {
    key: q,
    className: "chip",
    onClick: () => {
      setQuery(q);
      handleSearch(q);
    }
  }, q)))), isLoading && /*#__PURE__*/React.createElement("div", {
    className: "loading-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "loading-symbol"
  }, activeFaction.symbol), /*#__PURE__*/React.createElement("div", {
    className: "loading-text"
  }, "Consulting the Omnissiah's Archives..."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: colors.text + "44",
      fontFamily: "'Cinzel', serif",
      letterSpacing: "2px"
    }
  }, "ARCHIVE ACCESS IN PROGRESS")), error && !isLoading && /*#__PURE__*/React.createElement("div", {
    className: "error-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "error-icon"
  }, "☠"), /*#__PURE__*/React.createElement("div", {
    className: "error-text"
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "back-btn",
    style: {
      marginTop: "16px",
      marginBottom: 0
    },
    onClick: goHome
  }, "◄ Back to Archives")), !results && !isLoading && !error && !indexData && !indexLoading && !searchHits && /*#__PURE__*/React.createElement("div", {
    className: "browse-mode"
  }, /*#__PURE__*/React.createElement("div", {
    className: "welcome-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "welcome-symbol"
  }, activeFaction.symbol), /*#__PURE__*/React.createElement("div", {
    className: "welcome-title"
  }, "The Archive Awaits"), /*#__PURE__*/React.createElement("div", {
    className: "welcome-subtitle"
  }, "Knowledge is Power — Guard it Well"), /*#__PURE__*/React.createElement("div", {
    className: "welcome-desc"
  }, "Access the sacred archives of the ", activeFaction.name, ". Search above, browse an index of all entries, or pick a curated topic below."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: "14px",
      fontFamily: "'Cinzel', serif",
      fontSize: "9px",
      letterSpacing: "2px",
      color: colors.text + "44"
    }
  }, activeFaction.description.toUpperCase())), activeFaction.id === "minor" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "browse-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "browse-eyebrow"
  }, "⬛ Übersicht"), /*#__PURE__*/React.createElement("span", {
    className: "browse-faction-name"
  }, "Die kleineren Fraktionen der Galaxis")), /*#__PURE__*/React.createElement("input", {
    className: "index-filter",
    placeholder: "> FRAKTION FILTERN...",
    value: minorFilter,
    onChange: e => setMinorFilter(e.target.value)
  }), /*#__PURE__*/React.createElement("div", {
    className: "minor-list"
  }, MINOR_FACTIONS.filter(f => !minorFilter.trim() || f.title.toLowerCase().includes(minorFilter.trim().toLowerCase()) || f.blurb.toLowerCase().includes(minorFilter.trim().toLowerCase())).sort((a, b) => a.title.localeCompare(b.title)).map((f, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "minor-entry",
    onClick: () => openArticle(f.title)
  }, /*#__PURE__*/React.createElement("span", {
    className: "minor-entry-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "minor-entry-name"
  }, f.title), /*#__PURE__*/React.createElement("span", {
    className: "minor-entry-blurb"
  }, f.blurb)), /*#__PURE__*/React.createElement("span", {
    className: "minor-entry-arrow"
  }, "➤"))))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "browse-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "browse-eyebrow"
  }, "⬛ Browse the Index"), /*#__PURE__*/React.createElement("span", {
    className: "browse-faction-name"
  }, "All entries of the ", activeFaction.shortName)), /*#__PURE__*/React.createElement("div", {
    className: "index-grid"
  }, [...(FACTION_INDEX_TYPES[activeFaction.id] || []), ...INDEX_TYPES].map(it => /*#__PURE__*/React.createElement("button", {
    key: it.id,
    className: "index-card",
    onClick: () => loadIndex(it)
  }, /*#__PURE__*/React.createElement("span", {
    className: "index-card-icon"
  }, it.icon), /*#__PURE__*/React.createElement("span", {
    className: "index-card-label"
  }, it.label), /*#__PURE__*/React.createElement("span", {
    className: "index-card-desc"
  }, it.desc))))), activeFaction.id !== "minor" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "browse-header",
    style: {
      marginTop: "28px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "browse-eyebrow"
  }, "⬛ Featured Topics"), /*#__PURE__*/React.createElement("span", {
    className: "browse-faction-name"
  }, activeFaction.name)), /*#__PURE__*/React.createElement("div", {
    className: "browse-grid"
  }, activeFaction.browse?.map((item, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "browse-card",
    onClick: () => {
      setQuery(item.topic);
      handleSearch(item.topic);
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "browse-card-icon"
  }, item.icon), /*#__PURE__*/React.createElement("span", {
    className: "browse-card-tag"
  }, item.tag), /*#__PURE__*/React.createElement("span", {
    className: "browse-card-title"
  }, item.title), /*#__PURE__*/React.createElement("span", {
    className: "browse-card-arrow"
  }, "Access ➤"))))), history.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "browse-header",
    style: {
      marginTop: "28px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "browse-eyebrow"
  }, "⬛ Recent Queries")), /*#__PURE__*/React.createElement("div", {
    className: "recent-row"
  }, history.slice(0, 8).map((h, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "chip",
    onClick: () => {
      setQuery(h.query);
      handleSearch(h.query);
    }
  }, h.query))))), searchHits && !isLoading && !results && /*#__PURE__*/React.createElement("div", {
    className: "result-container"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-btn",
    onClick: goHome
  }, "◄ Back to Archives"), /*#__PURE__*/React.createElement("div", {
    className: "index-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "index-header-icon"
  }, "⌕"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "index-header-title"
  }, "Search: ", searchHits.term), /*#__PURE__*/React.createElement("div", {
    className: "index-header-sub"
  }, searchHits.items.length, " records found across the archives"))), /*#__PURE__*/React.createElement("div", {
    className: "index-list"
  }, searchHits.items.map((hit, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "index-entry",
    onClick: () => openArticle(hit.title, hit.source)
  }, /*#__PURE__*/React.createElement("span", {
    className: "index-entry-num"
  }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    className: "index-entry-body"
  }, /*#__PURE__*/React.createElement("span", {
    className: "index-entry-name"
  }, hit.title), /*#__PURE__*/React.createElement("span", {
    className: "index-entry-blurb"
  }, hit.snippet)), /*#__PURE__*/React.createElement("span", {
    className: "source-badge"
  }, hit.source.id === "lexicanum" ? "LEX" : "FAN"))))), indexLoading && /*#__PURE__*/React.createElement("div", {
    className: "loading-container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "loading-symbol"
  }, activeIndexType?.icon || activeFaction.symbol), /*#__PURE__*/React.createElement("div", {
    className: "loading-text"
  }, "Compiling the ", activeIndexType?.label, " Index..."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: "11px",
      color: colors.text + "44",
      fontFamily: "'Cinzel', serif",
      letterSpacing: "2px"
    }
  }, "CROSS-REFERENCING THE ARCHIVES")), indexData && !indexLoading && !results && /*#__PURE__*/React.createElement("div", {
    className: "result-container"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-btn",
    onClick: goHome
  }, "◄ Back to Archives"), /*#__PURE__*/React.createElement("div", {
    className: "index-header"
  }, /*#__PURE__*/React.createElement("span", {
    className: "index-header-icon"
  }, activeIndexType?.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "index-header-title"
  }, indexData.indexTitle || activeIndexType?.label), /*#__PURE__*/React.createElement("div", {
    className: "index-header-sub"
  }, activeFaction.name, " — ", indexData.totalCount ?? (indexData.entries?.length || 0), " entries"))), (indexData.important || indexData.entries) && /*#__PURE__*/React.createElement("input", {
    className: "index-filter",
    placeholder: "> FILTER ENTRIES...",
    value: indexFilter,
    onChange: e => setIndexFilter(e.target.value)
  }), indexData.important && indexData.important.length > 0 && (() => {
    const f = indexFilter.trim().toLowerCase();
    const shown = f ? indexData.important.filter(e => e.name.toLowerCase().includes(f)) : indexData.important;
    if (!shown.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "index-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "index-group-head important"
    }, "★ WICHTIGE"), shown.map((entry, i) => /*#__PURE__*/React.createElement("button", {
      key: "imp" + i,
      className: "index-entry",
      onClick: () => openArticle(entry.name, entry.source)
    }, /*#__PURE__*/React.createElement("span", {
      className: "index-entry-num"
    }, "★"), /*#__PURE__*/React.createElement("span", {
      className: "index-entry-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "index-entry-name"
    }, entry.name), /*#__PURE__*/React.createElement("span", {
      className: "index-entry-src"
    }, entry.sources?.map(s => s.id === "lexicanum" ? "LEX" : "FAN").join(" · "))), /*#__PURE__*/React.createElement("span", {
      className: "index-entry-arrow"
    }, "➤"))));
  })(), (() => {
    const f = indexFilter.trim().toLowerCase();
    const list = f ? (indexData.entries || []).filter(e => e.name.toLowerCase().includes(f)) : indexData.entries || [];
    if (!list.length) return null;
    return /*#__PURE__*/React.createElement("div", {
      className: "index-list"
    }, /*#__PURE__*/React.createElement("div", {
      className: "index-group-head"
    }, "ALLE EINTRÄGE"), list.map((entry, i) => /*#__PURE__*/React.createElement("button", {
      key: i,
      className: "index-entry",
      onClick: () => openArticle(entry.name, entry.source)
    }, /*#__PURE__*/React.createElement("span", {
      className: "index-entry-num"
    }, String(i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
      className: "index-entry-body"
    }, /*#__PURE__*/React.createElement("span", {
      className: "index-entry-name"
    }, entry.name), entry.blurb ? /*#__PURE__*/React.createElement("span", {
      className: "index-entry-blurb"
    }, entry.blurb) : entry.sources ? /*#__PURE__*/React.createElement("span", {
      className: "index-entry-src"
    }, entry.sources.map(s => s.id === "lexicanum" ? "LEX" : "FAN").join(" · ")) : null), /*#__PURE__*/React.createElement("span", {
      className: "index-entry-arrow"
    }, "➤"))));
  })()), results && !isLoading && /*#__PURE__*/React.createElement("div", {
    className: "result-container"
  }, /*#__PURE__*/React.createElement("button", {
    className: "back-btn",
    onClick: goHome
  }, "◄ Back to Archives"), /*#__PURE__*/React.createElement("div", {
    className: "result-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "result-classification"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: colors.text + "66"
    }
  }, results.classification), /*#__PURE__*/React.createElement("span", {
    className: "warning-badge",
    style: {
      borderColor: warningColors[results.warningLevel] || colors.primary,
      color: warningColors[results.warningLevel] || colors.primary
    }
  }, results.warningLevel)), /*#__PURE__*/React.createElement("div", {
    className: "result-title"
  }, results.title), /*#__PURE__*/React.createElement("div", {
    className: "result-meta"
  }, /*#__PURE__*/React.createElement("span", null, "◈ ", results.category), /*#__PURE__*/React.createElement("span", null, "◈ ", results.faction)), /*#__PURE__*/options.showSigils && /*#__PURE__*/React.createElement(ArticleSigil, {
    seed: imageIdFor(results.title),
    variant: 0
  }), /*#__PURE__*/React.createElement("div", {
    className: "result-summary"
  }, renderLinkedText(results.summary)), results.sourceUrl && /*#__PURE__*/React.createElement("a", {
    className: "source-link",
    href: results.sourceUrl,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "◈ Source: ", results.sourceLabel, " — read full article ↗")), results.quote && /*#__PURE__*/React.createElement("div", {
    className: "quote-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "quote-text"
  }, results.quote), /*#__PURE__*/React.createElement("div", {
    className: "quote-source"
  }, "— ", results.quoteSource)), /*#__PURE__*/React.createElement("div", {
    className: "content-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "sections-col"
  }, results.sections?.map((section, i) => /*#__PURE__*/React.createElement("div", {
    key: i
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-heading"
  }, section.heading), /*#__PURE__*/React.createElement("div", {
    className: "section-content"
  }, renderLinkedText(section.content))), i === 0 && /*#__PURE__*/options.showSigils && /*#__PURE__*/React.createElement(ArticleSigil, {
    seed: imageIdFor(results.title),
    variant: 1
  }), i === 1 && /*#__PURE__*/options.showSigils && /*#__PURE__*/React.createElement(ArticleSigil, {
    seed: imageIdFor(results.title),
    variant: 2
  })))), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-col"
  }, results.keyFacts?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "keyfacts-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "keyfacts-heading"
  }, "Key Data"), results.keyFacts.map((fact, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "keyfact-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fact-label"
  }, fact.label), /*#__PURE__*/React.createElement("span", {
    className: "fact-value"
  }, fact.value)))), results.relatedTopics?.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "related-block"
  }, /*#__PURE__*/React.createElement("div", {
    className: "related-heading"
  }, "Related Topics"), results.relatedTopics.map((topic, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "related-item",
    onClick: () => openArticle(topic)
  }, /*#__PURE__*/React.createElement("span", {
    className: "related-dot"
  }), topic))))))), /*#__PURE__*/React.createElement("footer", {
    className: "footer"
  }, "DATAVAULT — ", activeFaction.name, " — ", APP_VERSION, " — Inoffizielles, nicht-kommerzielles Fan-Projekt")));
}

export { Warhammer40KEncyclopedia };
