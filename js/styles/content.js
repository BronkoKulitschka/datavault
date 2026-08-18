// ==========================================================================
// Index, Nebenfraktionen, Ordensfarben, Fusszeile.
// ==========================================================================

// Wird mit dem Farbschema der aktiven Fraktion und den
// Anzeigeoptionen aufgerufen und liefert fertiges CSS.
function contentStyles(colors, options) {
  return `
    /* ---- Index browse ---- */
    .index-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 8px;
    }
    .index-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 8px;
      padding: 18px 12px;
      background: ${colors.surface};
      border: 1px solid ${colors.border}55;
      cursor: pointer;
      transition: all 0.2s;
    }
    .index-card:hover {
      border-color: ${colors.primary};
      background: ${colors.glow.replace("0.4", "0.1")};
      transform: translateY(-2px);
      box-shadow: 0 6px 18px ${colors.glow.replace("0.4", "0.15")};
    }
    .index-card:hover .index-card-icon { text-shadow: 0 0 22px ${colors.glow}; transform: scale(1.1); }
    .index-card-icon {
      font-size: 30px;
      color: ${colors.accent};
      line-height: 1;
      transition: all 0.2s;
    }
    .index-card-label {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      letter-spacing: 1px;
      color: ${colors.text}ee;
      text-transform: uppercase;
    }
    .index-card-desc {
      font-size: 10px;
      color: ${colors.text}bb;
      line-height: 1.4;
    }

    .index-header {
      display: flex;
      align-items: center;
      gap: 16px;
      border: 1px solid ${colors.border};
      background: ${colors.surface};
      padding: 18px 22px;
      margin-bottom: 14px;
    }
    .index-header-icon {
      font-size: 36px;
      color: ${colors.accent};
      text-shadow: 0 0 20px ${colors.glow};
      line-height: 1;
    }
    .index-header-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: 20px;
      color: ${colors.primary};
      letter-spacing: 1px;
    }
    .index-header-sub {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 2px;
      color: ${colors.text}bb;
      text-transform: uppercase;
      margin-top: 4px;
    }

    .index-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 8px;
    }
    .index-entry {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      background: ${colors.surface};
      border: 1px solid ${colors.border}33;
      cursor: pointer;
      text-align: left;
      transition: all 0.15s;
    }
    .index-entry:hover {
      border-color: ${colors.primary};
      background: ${colors.glow.replace("0.4", "0.1")};
    }
    .index-entry:hover .index-entry-arrow { opacity: 1; color: ${colors.accent}; transform: translateX(2px); }
    .index-entry-num {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      color: ${colors.primary}dd;
      flex-shrink: 0;
      width: 22px;
    }
    .index-entry-body { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
    .index-entry-name {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 0.5px;
      color: ${colors.text}ee;
    }
    .index-entry-blurb {
      font-size: 11px;
      color: ${colors.text}dd;
      line-height: 1.4;
    }
    .index-entry-src {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      letter-spacing: 1px;
      color: ${colors.primary}aa;
    }
    .index-filter {
      width: 100%;
      padding: 12px 14px;
      margin-bottom: 14px;
      background: ${colors.surface || "#1e1605"};
      border: 1px solid ${colors.primary}66;
      color: ${colors.text};
      font-family: 'Share Tech Mono', monospace;
      font-size: 14px;
      letter-spacing: 1px;
      outline: none;
    }
    .index-filter:focus {
      border-color: ${colors.primary};
      box-shadow: 0 0 0 2px ${colors.glow};
    }
    .index-filter::placeholder { color: ${colors.text}aa; }

    /* Minor factions list */
    .minor-list { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
    .minor-entry {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 16px;
      background: ${colors.surface};
      border: 1px solid ${colors.border}44;
      cursor: pointer; text-align: left;
      transition: ${options.reduceMotion ? "none" : "all 0.15s"};
    }
    .minor-entry:hover {
      border-color: ${colors.primary};
      background: ${colors.glow};
    }
    .minor-entry-body { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .minor-entry-name {
      font-family: 'Cinzel', serif; font-size: 15px; letter-spacing: 1px;
      color: ${colors.accent};
    }
    .minor-entry-blurb {
      font-family: 'Source Serif 4', serif; font-size: 12px;
      color: ${colors.text}bb; line-height: 1.5;
    }
    .minor-entry-arrow { color: ${colors.primary}dd; font-size: 12px; flex-shrink: 0; }
    .index-group-head {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 2px;
      color: ${colors.accent};
      padding: 12px 0 6px;
      border-bottom: 1px solid ${colors.primary}33;
      margin-bottom: 4px;
    }
    .index-group-head.important {
      color: ${colors.bg || "#0a0700"};
      background: ${colors.primary};
      padding: 8px 12px;
      border: none;
      margin-bottom: 6px;
    }
    .index-entry-arrow {
      color: ${colors.text}99;
      font-size: 11px;
      opacity: 0.5;
      transition: all 0.15s;
      flex-shrink: 0;
    }

    .source-badge {
      font-family: 'Share Tech Mono', monospace;
      font-size: 9px;
      letter-spacing: 1px;
      color: ${colors.bg};
      background: ${colors.primary};
      padding: 2px 6px;
      flex-shrink: 0;
      align-self: center;
    }

    .source-link {
      display: inline-block;
      margin-top: 12px;
      font-family: 'Share Tech Mono', monospace;
      font-size: 11px;
      letter-spacing: 1px;
      color: ${colors.accent};
      text-decoration: none;
      border-bottom: 1px dotted ${colors.primary}88;
      padding-bottom: 1px;
    }
    .source-link:hover {
      text-shadow: 0 0 8px ${colors.glow};
      border-bottom-style: solid;
    }

    /* ---- Chapter / Legion colour cards ---- */
    .chapter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 10px;
    }
    .chapter-card {
      display: flex;
      gap: 0;
      background: ${colors.surface};
      border: 1px solid ${colors.border}44;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s;
      overflow: hidden;
      padding: 0;
    }
    .chapter-card:hover {
      border-color: ${colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${colors.glow.replace("0.4", "0.18")};
    }
    .chapter-swatch {
      width: 56px;
      flex-shrink: 0;
      display: flex;
      align-items: stretch;
      justify-content: flex-end;
      position: relative;
      border-right: 1px solid ${colors.border}55;
    }
    .chapter-swatch-trim {
      width: 14px;
      height: 100%;
    }
    .chapter-body {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 12px 14px;
      flex: 1;
      min-width: 0;
    }
    .chapter-name {
      font-family: 'Cinzel', serif;
      font-size: 14px;
      letter-spacing: 0.5px;
      color: ${colors.accent};
    }
    .chapter-blurb {
      font-size: 11px;
      color: ${colors.text}aa;
      line-height: 1.4;
    }
    .chapter-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      margin-top: 2px;
    }
    .chapter-tag {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 0.5px;
      color: ${colors.text}dd;
      border: 1px solid ${colors.border}33;
      padding: 2px 6px;
      text-transform: uppercase;
    }
    .chapter-colors {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }
    .chapter-color-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.5px;
      color: ${colors.text}bb;
      text-transform: uppercase;
    }
    .chip-dot {
      width: 10px;
      height: 10px;
      border: 1px solid ${colors.border}66;
      flex-shrink: 0;
    }

    .welcome-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: 20px;
      color: ${colors.primary};
      letter-spacing: 2px;
      margin-bottom: 8px;
    }

    .welcome-subtitle {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 5px;
      color: ${colors.text}aa;
      text-transform: uppercase;
      margin-bottom: 24px;
    }

    .welcome-desc {
      font-size: 13px;
      color: ${colors.text}e6;
      line-height: 1.7;
      max-width: 480px;
      margin: 0 auto;
    }

    .ornament {
      color: ${colors.primary}bb;
      font-size: 10px;
      letter-spacing: 8px;
      margin: 12px 0;
    }

    .footer {
      border-top: 1px solid ${colors.border}33;
      padding: 12px 24px;
      text-align: center;
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 2px;
      color: ${colors.text}88;
      text-transform: uppercase;
    }
  `;
}

export { contentStyles };
