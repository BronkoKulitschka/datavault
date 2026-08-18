// ==========================================================================
// Kopfbereich, Fraktionsleiste und Suchmaske.
// ==========================================================================

// Wird mit dem Farbschema der aktiven Fraktion und den
// Anzeigeoptionen aufgerufen und liefert fertiges CSS.
function headerStyles(colors, options) {
  return `
    .header {
      border-bottom: 2px solid ${colors.border};
      background: ${colors.surface};
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 4px 20px ${colors.glow};
    }

    .header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 24px;
    }

    .logo-area {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .logo-area:hover { opacity: 0.75; }

    .aquila {
      font-size: 28px;
      color: ${colors.accent};
      text-shadow: 0 0 12px ${colors.glow}, 0 0 24px ${colors.glow};
      transition: all 0.3s;
      line-height: 1;
    }

    .logo-text {
      font-family: 'Cinzel Decorative', serif;
      font-size: 11px;
      letter-spacing: 3px;
      color: ${colors.primary};
      text-transform: uppercase;
      line-height: 1.3;
    }
    .logo-sub {
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 4px;
      color: ${colors.text}dd;
    }

    .faction-bar {
      display: flex;
      gap: 0;
      overflow-x: auto;
      scrollbar-width: none;
      border-top: 1px solid ${colors.border}33;
    }
    .faction-bar::-webkit-scrollbar { display: none; }

    .faction-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: transparent;
      border: none;
      border-right: 1px solid ${colors.border}22;
      color: ${colors.text}bb;
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 1px;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;
      text-transform: uppercase;
    }
    .faction-btn:hover {
      background: ${colors.glow.replace("0.4", "0.1")};
      color: ${colors.text}cc;
    }
    .faction-btn.active {
      background: ${colors.glow.replace("0.4", "0.2")};
      color: ${colors.accent};
      border-bottom: 2px solid ${colors.accent};
    }
    .faction-symbol { font-size: 14px; }

    .main-content { padding: 32px 24px; max-width: 960px; margin: 0 auto; }

    .search-section { margin-bottom: 32px; }

    .search-label {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 4px;
      color: ${colors.primary};
      text-transform: uppercase;
      margin-bottom: 8px;
      display: block;
    }

    .search-container {
      display: flex;
      gap: 8px;
      align-items: stretch;
    }

    .search-input-wrap {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
    }

    .terminal-prompt {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Share Tech Mono', monospace;
      font-size: 16px;
      color: ${colors.primary};
      text-shadow: 0 0 8px ${colors.glow};
      pointer-events: none;
      z-index: 2;
    }

    .search-input.has-prompt {
      padding-left: 32px;
    }

    .terminal-cursor {
      position: absolute;
      left: 32px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Share Tech Mono', monospace;
      font-size: 15px;
      color: ${colors.accent};
      text-shadow: 0 0 10px ${colors.glow}, 0 0 18px ${colors.glow};
      pointer-events: none;
      animation: cursorblink 1.1s steps(1) infinite;
      z-index: 2;
    }

    .search-input.has-prompt::placeholder {
      padding-left: 18px;
    }
    .search-input.has-prompt {
      text-indent: 18px;
    }
    .search-input.has-prompt:focus {
      text-indent: 0;
    }

    @keyframes cursorblink {
      0%, 50% { opacity: 1; }
      50.01%, 100% { opacity: 0; }
    }

    @media (prefers-reduced-motion: reduce) {
      .terminal-cursor { animation: none; }
    }

    .search-input {
      width: 100%;
      padding: 14px 48px 14px 16px;
      background: ${colors.surface};
      border: 1px solid ${colors.border}66;
      color: ${colors.text};
      font-family: 'Share Tech Mono', monospace;
      font-size: 15px;
      letter-spacing: 0.5px;
      outline: none;
      transition: all 0.2s;
    }
    .search-input:focus {
      border-color: ${colors.primary};
      box-shadow: 0 0 0 2px ${colors.glow}, inset 0 0 20px ${colors.glow.replace("0.4", "0.05")};
    }
    .search-input::placeholder { color: ${colors.text}aa; font-style: italic; }

    .search-btn {
      padding: 14px 28px;
      background: ${colors.primary};
      border: none;
      color: ${colors.bg};
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 2px;
      cursor: pointer;
      font-weight: 700;
      text-transform: uppercase;
      transition: all 0.2s;
    }
    .search-btn:hover { filter: brightness(1.2); box-shadow: 0 0 20px ${colors.glow}; }
    .search-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .category-row {
      display: flex;
      gap: 6px;
      margin-top: 10px;
      flex-wrap: wrap;
    }

    .cat-btn {
      padding: 4px 12px;
      background: transparent;
      border: 1px solid ${colors.border}44;
      color: ${colors.text}dd;
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 1px;
      cursor: pointer;
      text-transform: uppercase;
      transition: all 0.2s;
    }
    .cat-btn.active {
      background: ${colors.glow.replace("0.4", "0.2")};
      border-color: ${colors.primary};
      color: ${colors.accent};
    }

    .placeholder-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      margin-top: 16px;
    }

    .chip {
      padding: 5px 12px;
      background: ${colors.surface};
      border: 1px solid ${colors.border}33;
      color: ${colors.text}bb;
      font-size: 11px;
      cursor: pointer;
      font-family: 'Cinzel', serif;
      font-size: 9px;
      letter-spacing: 0.5px;
      transition: all 0.15s;
    }
    .chip:hover { border-color: ${colors.primary}; color: ${colors.text}cc; }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px;
      gap: 16px;
    }

    .loading-symbol {
      font-size: 48px;
      color: ${colors.accent};
      text-shadow: 0 0 30px ${colors.glow};
      animation: pulse 1.5s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 0.5; transform: scale(0.95); }
      50% { opacity: 1; transform: scale(1.05); }
    }

    .loading-text {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      letter-spacing: 4px;
      color: ${colors.primary};
      text-transform: uppercase;
      animation: blink 1.2s step-end infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
    }

  `;
}

export { headerStyles };
