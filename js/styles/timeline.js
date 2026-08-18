// ==========================================================================
// Zeitleiste.
// ==========================================================================

// Wird mit dem Farbschema der aktiven Fraktion und den
// Anzeigeoptionen aufgerufen und liefert fertiges CSS.
function timelineStyles(colors, options) {
  return `
    /* Timeline */
    .timeline-intro {
      font-family: 'Source Serif 4', serif; font-size: 12px;
      color: ${colors.text}bb; line-height: 1.6; margin-bottom: 18px;
    }
    .timeline {
      position: relative;
      padding-left: 22px;
      border-left: 2px solid ${colors.primary}44;
    }
    .tl-event {
      display: block; width: 100%; text-align: left;
      position: relative;
      background: transparent; border: none; cursor: pointer;
      padding: 0 0 22px 8px;
    }
    .tl-dot {
      position: absolute; left: -31px; top: 3px;
      width: 12px; height: 12px; border-radius: 50%;
      background: ${colors.primary};
      box-shadow: 0 0 10px ${colors.glow};
      border: 2px solid ${colors.bg};
    }
    .tl-body { display: block; }
    .tl-date {
      display: block; font-family: 'Share Tech Mono', monospace;
      font-size: 10px; letter-spacing: 1px; color: ${colors.primary};
      text-transform: uppercase; margin-bottom: 3px;
    }
    .tl-title {
      display: block; font-family: 'Cinzel', serif; font-size: 15px;
      color: ${colors.accent}; margin-bottom: 4px;
    }
    .tl-blurb {
      display: block; font-family: 'Source Serif 4', serif;
      font-size: 12px; line-height: 1.55; color: ${colors.text}cc;
    }
    .tl-event:hover .tl-title { text-shadow: 0 0 8px ${colors.glow}; }
    .tl-event:hover .tl-dot { background: ${colors.accent}; }

  `;
}

export { timelineStyles };
