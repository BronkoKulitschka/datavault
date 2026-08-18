// ==========================================================================
// Artikelansicht: Kopf, Zitate, Abschnitte, Infokasten.
// ==========================================================================

// Wird mit dem Farbschema der aktiven Fraktion und den
// Anzeigeoptionen aufgerufen und liefert fertiges CSS.
function articleStyles(colors, options) {
  return `
    .result-container { animation: fadeIn 0.4s ease; }

    .back-btn {
      background: transparent;
      border: 1px solid ${colors.border}66;
      color: ${colors.primary};
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 8px 16px;
      cursor: pointer;
      margin-bottom: 14px;
      transition: all 0.2s;
    }
    .back-btn:hover {
      background: ${colors.glow.replace("0.4", "0.12")};
      border-color: ${colors.primary};
      color: ${colors.accent};
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .result-header {
      border: 1px solid ${colors.border};
      background: ${colors.surface};
      padding: 24px;
      margin-bottom: 16px;
      position: relative;
      overflow: hidden;
    }
    .result-header::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, transparent, ${colors.accent}, transparent);
    }

    .result-classification {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 5px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .warning-badge {
      padding: 2px 8px;
      border: 1px solid;
      font-size: 8px;
      letter-spacing: 2px;
    }

    .result-title {
      font-family: 'Cinzel Decorative', serif;
      font-size: 28px;
      color: ${colors.accent};
      text-shadow: 0 0 20px ${colors.glow};
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .result-meta {
      display: flex;
      gap: 16px;
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 2px;
      color: ${colors.text}dd;
      text-transform: uppercase;
      flex-wrap: wrap;
    }
    .result-meta span { display: flex; align-items: center; gap: 4px; }

    .result-summary {
      margin-top: 16px;
      font-family: 'Source Serif 4', Georgia, serif;
      font-style: italic;
      font-size: 15px;
      line-height: 1.7;
      color: ${colors.text}cc;
      border-left: 3px solid ${colors.primary};
      padding-left: 16px;
      text-shadow: none;
    }

    .quote-block {
      border: 1px solid ${colors.border}44;
      background: ${colors.glow.replace("0.4", "0.05")};
      padding: 16px 20px;
      margin: 16px 0;
      position: relative;
    }
    .quote-block::before {
      content: '"';
      font-family: 'Cinzel Decorative', serif;
      font-size: 48px;
      color: ${colors.primary}99;
      position: absolute;
      top: -8px;
      left: 12px;
      line-height: 1;
    }

    .quote-text {
      font-style: italic;
      font-size: 13px;
      color: ${colors.text}bb;
      line-height: 1.6;
      padding-left: 16px;
    }
    .quote-source {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 2px;
      color: ${colors.primary};
      margin-top: 8px;
      text-align: right;
    }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 280px;
      gap: 16px;
    }

    @media (max-width: 700px) {
      .content-grid { grid-template-columns: 1fr; }
      .search-container { flex-direction: column; }
      .result-title { font-size: 20px; }
    }

    .sections-col {}

    .section-block {
      border: 1px solid ${colors.border}44;
      background: ${colors.surface};
      margin-bottom: 12px;
    }

    .section-heading {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 3px;
      color: ${colors.primary};
      text-transform: uppercase;
      padding: 10px 16px;
      border-bottom: 1px solid ${colors.border}33;
      background: ${colors.glow.replace("0.4", "0.08")};
    }

    .section-content {
      padding: 14px 16px;
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 13.5px;
      line-height: 1.85;
      color: ${colors.text}dd;
      text-shadow: none;
    }

    .lore-link {
      color: ${colors.accent};
      cursor: pointer;
      border-bottom: 1px dotted ${colors.primary}88;
      transition: all 0.15s;
      text-decoration: none;
      font-weight: 600;
      padding: 0 1px;
    }
    .lore-link:hover {
      background: ${colors.glow.replace("0.4", "0.18")};
      border-bottom-style: solid;
      text-shadow: 0 0 8px ${colors.glow};
    }
    .lore-link:focus-visible {
      outline: 1px solid ${colors.accent};
      outline-offset: 2px;
    }
    .result-summary .lore-link { color: ${colors.accent}; }

    .sidebar-col {}

    .keyfacts-block {
      border: 1px solid ${colors.border};
      background: ${colors.surface};
      margin-bottom: 12px;
    }

    .keyfacts-heading {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 3px;
      color: ${colors.accent};
      text-transform: uppercase;
      padding: 8px 14px;
      border-bottom: 1px solid ${colors.border};
      background: ${colors.glow.replace("0.4", "0.1")};
    }

    .keyfact-row {
      display: flex;
      justify-content: space-between;
      padding: 7px 14px;
      border-bottom: 1px solid ${colors.border}22;
      gap: 8px;
    }
    .keyfact-row:last-child { border-bottom: none; }

    .fact-label {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 1px;
      color: ${colors.text}bb;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .fact-value {
      font-size: 11px;
      color: ${colors.text}ee;
      text-align: right;
    }

    .related-block {
      border: 1px solid ${colors.border}44;
      background: ${colors.surface};
    }

    .related-heading {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 3px;
      color: ${colors.primary};
      text-transform: uppercase;
      padding: 8px 14px;
      border-bottom: 1px solid ${colors.border}33;
    }

    .related-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-bottom: 1px solid ${colors.border}11;
      cursor: pointer;
      transition: all 0.15s;
      font-size: 12px;
      color: ${colors.text}e6;
    }
    .related-item:last-child { border-bottom: none; }
    .related-item:hover { background: ${colors.glow.replace("0.4", "0.1")}; color: ${colors.text}; }
    .related-dot {
      width: 4px; height: 4px;
      background: ${colors.primary};
      border-radius: 50%;
      flex-shrink: 0;
    }

    .error-block {
      border: 1px solid #CC2200;
      background: #180808;
      padding: 24px;
      text-align: center;
    }
    .error-icon { font-size: 32px; margin-bottom: 12px; }
    .error-text {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 2px;
      color: #CC2200;
      text-transform: uppercase;
      line-height: 1.8;
    }

    .welcome-block {
      border: 1px solid ${colors.border}44;
      background: ${colors.surface};
      padding: 28px 32px;
      text-align: center;
      margin-bottom: 24px;
    }

    .welcome-symbol {
      font-size: 44px;
      color: ${colors.accent};
      text-shadow: 0 0 24px ${colors.glow}, 0 0 48px ${colors.glow};
      margin-bottom: 12px;
      display: block;
    }

    .browse-header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      margin-bottom: 14px;
      border-bottom: 1px solid ${colors.border}33;
      padding-bottom: 8px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .browse-eyebrow {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 4px;
      color: ${colors.primary};
      text-transform: uppercase;
    }
    .browse-faction-name {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 2px;
      color: ${colors.text}aa;
      text-transform: uppercase;
    }

    .browse-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 10px;
    }

    .browse-card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      text-align: left;
      gap: 6px;
      padding: 16px;
      background: ${colors.surface};
      border: 1px solid ${colors.border}44;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;
      min-height: 130px;
    }
    .browse-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, ${colors.accent}, transparent);
      opacity: 0;
      transition: opacity 0.2s;
    }
    .browse-card:hover {
      border-color: ${colors.primary};
      background: ${colors.glow.replace("0.4", "0.08")};
      transform: translateY(-2px);
      box-shadow: 0 6px 20px ${colors.glow.replace("0.4", "0.15")};
    }
    .browse-card:hover::before { opacity: 1; }
    .browse-card:hover .browse-card-icon {
      transform: scale(1.1);
      text-shadow: 0 0 24px ${colors.glow};
    }
    .browse-card:hover .browse-card-arrow { opacity: 1; color: ${colors.accent}; }

    .browse-card-icon {
      font-size: 28px;
      color: ${colors.primary};
      line-height: 1;
      transition: all 0.2s;
    }
    .browse-card-tag {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 2px;
      color: ${colors.text}bb;
      text-transform: uppercase;
      border: 1px solid ${colors.border}44;
      padding: 2px 6px;
    }
    .browse-card-title {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      letter-spacing: 0.5px;
      color: ${colors.text}ee;
      line-height: 1.3;
      margin-top: auto;
    }
    .browse-card-arrow {
      font-family: 'Cinzel', serif;
      font-size: 8px;
      letter-spacing: 2px;
      color: ${colors.text}99;
      text-transform: uppercase;
      opacity: 0.6;
      transition: all 0.2s;
    }

    .recent-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

  `;
}

export { articleStyles };
