// ==========================================================================
// Grundlagen: Ruecksetzung, Sigillen, CRT-Effekte, Bewegungsoption.
// ==========================================================================

// Wird mit dem Farbschema der aktiven Fraktion und den
// Anzeigeoptionen aufgerufen und liefert fertiges CSS.
function baseStyles(colors, options) {
  return `
    * { box-sizing: border-box; margin: 0; padding: 0; }

    .article-sigil {
      display: block;
      width: 100%;
      max-width: 640px;
      aspect-ratio: 4 / 3;
      margin: 16px 0;
      padding: 10px;
      border: 1px solid ${colors.primary}66;
      box-shadow: 0 0 18px ${colors.glow};
      background:
        repeating-linear-gradient(
          0deg,
          ${colors.primary}0d 0px,
          ${colors.primary}0d 1px,
          transparent 1px,
          transparent 4px
        ),
        ${colors.surface};
    }

    .article-sigil svg {
      display: block;
      filter: drop-shadow(0 0 4px ${colors.glow});
    }
    
    .w40k-app {
      min-height: 100vh;
      position: relative;
      background: ${colors.bg};
      background-image:
        radial-gradient(ellipse at 50% 40%, ${colors.glow.replace("0.4", "0.18")} 0%, transparent 75%),
        radial-gradient(ellipse at 50% 120%, ${colors.glow.replace("0.4", "0.10")} 0%, transparent 65%);
      font-family: 'Share Tech Mono', 'Source Serif 4', monospace;
      font-size: ${options.fontScale}%;
      color: ${colors.text};
      text-shadow: 0 0 1px ${colors.glow.replace("0.4", "0.5")};
      transition: ${options.reduceMotion ? "none" : "all 0.4s ease"};
      filter: brightness(${options.brightness / 100}) contrast(1.04);
    }

    /* CRT scanlines overlay */
    .w40k-app::before {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9998;
      display: ${options.scanlines ? "block" : "none"};
      background: repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0) 0px,
        rgba(0,0,0,0) 2px,
        rgba(0,0,0,0.09) 3px,
        rgba(0,0,0,0.09) 4px
      );
      mix-blend-mode: multiply;
    }

    /* CRT vignette + flicker */
    .w40k-app::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 9999;
      background: radial-gradient(ellipse at center, transparent 70%, rgba(0,0,0,0.28) 100%);
      animation: ${options.flicker && !options.reduceMotion ? "crtflicker 3s infinite steps(40)" : "none"};
    }

    @keyframes crtflicker {
      0%   { opacity: 1; }
      8%   { opacity: 0.92; }
      9%   { opacity: 1; }
      18%  { opacity: 1; }
      19%  { opacity: 0.88; }
      20%  { opacity: 0.95; }
      21%  { opacity: 0.90; }
      22%  { opacity: 1; }
      40%  { opacity: 1; }
      41%  { opacity: 0.93; }
      42%  { opacity: 1; }
      58%  { opacity: 1; }
      59%  { opacity: 0.84; }
      60%  { opacity: 0.95; }
      61%  { opacity: 1; }
      75%  { opacity: 1; }
      76%  { opacity: 0.92; }
      77%  { opacity: 1; }
      90%  { opacity: 1; }
      91%  { opacity: 0.89; }
      92%  { opacity: 0.95; }
      93%  { opacity: 1; }
    }

    /* subtle brightness pulse on the whole screen */
    .w40k-app {
      animation: crtpulse 4s infinite ease-in-out;
    }
    @keyframes crtpulse {
      0%, 100% { filter: brightness(1); }
      47% { filter: brightness(1); }
      48% { filter: brightness(1.08); }
      49% { filter: brightness(0.96); }
      50% { filter: brightness(1); }
    }

    @media (prefers-reduced-motion: reduce) {
      .w40k-app::after { animation: none; }
      .w40k-app { animation: none; }
    }
    /* Manual "reduce motion" option */
    .w40k-app.no-motion,
    .w40k-app.no-motion * {
      animation: none !important;
      transition: none !important;
    }

  `;
}

export { baseStyles };
