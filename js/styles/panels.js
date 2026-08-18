// ==========================================================================
// Zahnrad, Optionsfenster und Handbuch.
// ==========================================================================

// Wird mit dem Farbschema der aktiven Fraktion und den
// Anzeigeoptionen aufgerufen und liefert fertiges CSS.
function panelStyles(colors, options) {
  return `
    /* Gear button in header */
    .gear-btn {
      background: transparent;
      border: 1px solid ${colors.primary}66;
      color: ${colors.primary};
      font-size: 18px;
      width: 38px; height: 38px;
      border-radius: 4px;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: ${options.reduceMotion ? "none" : "all 0.15s"};
    }
    .gear-btn:hover { background: ${colors.glow}; box-shadow: 0 0 10px ${colors.glow}; }

    /* Options overlay + panel */
    .options-overlay {
      position: fixed; inset: 0; z-index: 10000;
      background: rgba(0,0,0,0.75);
      display: flex; align-items: flex-start; justify-content: center;
      padding: 20px;
      overflow-y: auto;
    }
    .options-panel {
      background: ${colors.surface};
      border: 1px solid ${colors.primary};
      box-shadow: 0 0 30px ${colors.glow};
      max-width: 420px; width: 100%;
      padding: 20px;
      margin: 12px 0;
    }
    .options-head {
      display: flex; justify-content: space-between; align-items: center;
      font-family: 'Cinzel', serif; font-size: 15px; letter-spacing: 2px;
      color: ${colors.accent};
      border-bottom: 1px solid ${colors.primary}44;
      padding-bottom: 12px; margin-bottom: 16px;
    }
    .options-close {
      background: transparent; border: 1px solid ${colors.primary}66;
      color: ${colors.primary}; cursor: pointer;
      width: 30px; height: 30px; font-size: 14px;
    }
    .option-row { margin-bottom: 18px; }
    .option-row label {
      display: block; font-size: 12px; letter-spacing: 1px;
      color: ${colors.text}; margin-bottom: 8px;
    }
    .option-row input[type="range"] {
      width: 100%; accent-color: ${colors.primary};
    }
    .option-row.toggle {
      display: flex; justify-content: space-between; align-items: center;
      cursor: pointer;
    }
    .option-row.toggle label { margin-bottom: 0; cursor: pointer; }
    .switch {
      width: 46px; height: 24px; border-radius: 12px;
      background: ${colors.bg}; border: 1px solid ${colors.primary}66;
      position: relative; transition: ${options.reduceMotion ? "none" : "all 0.15s"};
      flex-shrink: 0;
    }
    .switch .knob {
      position: absolute; top: 2px; left: 2px;
      width: 18px; height: 18px; border-radius: 50%;
      background: ${colors.primary}88;
      transition: ${options.reduceMotion ? "none" : "all 0.15s"};
    }
    .switch.on { background: ${colors.primary}; }
    .switch.on .knob { left: 24px; background: ${colors.bg}; }
    .options-reset {
      width: 100%; margin-top: 8px; padding: 10px;
      background: transparent; border: 1px solid ${colors.primary}66;
      color: ${colors.text}; font-family: 'Cinzel', serif;
      font-size: 11px; letter-spacing: 2px; cursor: pointer;
    }
    .options-reset:hover { background: ${colors.glow}; }
    .options-note {
      text-align: center; font-size: 10px; color: ${colors.text}cc;
      margin-top: 12px; letter-spacing: 1px;
    }

    /* Info / handbook panel */
    .info-body h3 {
      font-family: 'Cinzel', serif; color: ${colors.accent};
      font-size: 20px; letter-spacing: 1px; margin-bottom: 2px;
    }
    .info-body .info-ver {
      font-size: 10px; letter-spacing: 2px; color: ${colors.primary};
      text-transform: uppercase; margin-bottom: 14px;
    }
    .info-body h4 {
      font-family: 'Cinzel', serif; color: ${colors.primary};
      font-size: 13px; letter-spacing: 1px;
      margin: 18px 0 6px;
    }
    .info-body p {
      font-family: 'Source Serif 4', serif;
      font-size: 13px; line-height: 1.65;
      color: ${colors.text}dd; margin-bottom: 8px;
    }
    .info-body b { color: ${colors.accent}; }
    .info-body .info-foot {
      text-align: center; font-family: 'Cinzel', serif;
      color: ${colors.primary}; font-size: 12px; letter-spacing: 1px;
      margin-top: 20px; padding-top: 14px;
      border-top: 1px solid ${colors.primary}33;
    }


    /* ── Erweitertes Optionsfenster ─────────────────────────── */
    .options-panel-gross {
      width: min(460px, 94vw);
      max-height: 88vh;
      display: flex;
      flex-direction: column;
    }

    .options-tabs {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2px;
      padding: 10px 12px 0;
      flex-shrink: 0;
    }

    .options-tab {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 8px 2px;
      background: transparent;
      border: 1px solid ${colors.primary}33;
      border-bottom: none;
      color: ${colors.text}bb;
      font-family: inherit;
      font-size: 9px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      cursor: pointer;
      transition: ${options.reduceMotion ? "none" : "all 0.15s ease"};
    }

    .options-tab-symbol { font-size: 14px; line-height: 1; }

    .options-tab:hover { color: ${colors.text}; border-color: ${colors.primary}66; }

    .options-tab.active {
      background: ${colors.primary}1f;
      border-color: ${colors.primary};
      color: ${colors.primary};
      box-shadow: inset 0 -2px 0 ${colors.primary};
    }

    .options-body {
      flex: 1;
      overflow-y: auto;
      padding: 4px 4px 0;
      border-top: 1px solid ${colors.primary}44;
      margin-top: -1px;
    }

    .options-group { display: block; }

    .option-hint {
      grid-column: 1 / -1;
      margin-top: 4px;
      font-size: 9px;
      line-height: 1.5;
      letter-spacing: 0.4px;
      color: ${colors.text}99;
      font-style: italic;
    }

    .option-choices {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-top: 6px;
    }

    .option-choice {
      padding: 6px 11px;
      background: transparent;
      border: 1px solid ${colors.border}88;
      border-radius: 2px;
      color: ${colors.text}cc;
      font-family: inherit;
      font-size: 10px;
      letter-spacing: 1px;
      cursor: pointer;
      transition: ${options.reduceMotion ? "none" : "all 0.15s ease"};
    }

    .option-choice:hover { border-color: ${colors.primary}; color: ${colors.text}; }

    .option-choice.active {
      background: ${colors.primary}22;
      border-color: ${colors.primary};
      color: ${colors.primary};
    }

    .options-body .option-row:last-child { border-bottom: none; }

  `;
}

export { panelStyles };
