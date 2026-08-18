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

  `;
}

export { panelStyles };
