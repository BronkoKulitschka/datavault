// ==========================================================================
// Zuordnung Index-Typ -> echte Wiki-Kategorien.
// ==========================================================================


/* ============================================================================
 * CATEGORY OVERVIEWS — real wiki categories per faction & topic.
 * The index types above map to actual MediaWiki categories here, so an index
 * click loads the FULL category list (not a keyword search), with important
 * names pinned on top. "fandom"/"lexicanum" must match the wikis EXACTLY.
 * Imperium is fully researched; other factions are best-effort and may need
 * correcting (verify the category name on the wiki if a list comes back empty).
 * ========================================================================== */
const CATEGORY_MAP = {
  imperium: {
    personae: {
      fandom: "Category:Imperial Characters",
      lexicanum: "Category:Characters (Imperial)"
    },
    worlds: {
      fandom: "Category:Imperial planets",
      lexicanum: "Category:Planets (Imperial)"
    },
    tech: {
      fandom: "Category:Imperial Technology",
      lexicanum: "Category:Technology"
    },
    weapons: {
      fandom: "Category:Imperial weapons",
      lexicanum: "Category:Weapons"
    },
    organisations: {
      fandom: "Category:Imperium",
      lexicanum: "Category:Imperial Organisations"
    },
    battles: {
      fandom: "Category:Imperial Campaigns",
      lexicanum: "Category:Battles"
    }
  },
  chaos: {
    personae: {
      fandom: "Category:Chaos Characters",
      lexicanum: "Category:Characters (Chaos)"
    },
    worlds: {
      fandom: "Category:Daemon Worlds",
      lexicanum: ""
    },
    tech: {
      fandom: "Category:Chaos Technology",
      lexicanum: ""
    },
    weapons: {
      fandom: "Category:Chaos Weapons",
      lexicanum: ""
    },
    organisations: {
      fandom: "Category:Chaos",
      lexicanum: ""
    },
    battles: {
      fandom: "Category:Campaigns",
      lexicanum: ""
    }
  },
  eldar: {
    personae: {
      fandom: "Category:Eldar Characters",
      lexicanum: "Category:Characters (Craftworld Eldar)"
    },
    worlds: {
      fandom: "Category:Craftworlds",
      lexicanum: ""
    },
    tech: {
      fandom: "Category:Eldar Technology",
      lexicanum: ""
    },
    weapons: {
      fandom: "Category:Eldar Weapons",
      lexicanum: ""
    },
    organisations: {
      fandom: "Category:Eldar",
      lexicanum: ""
    },
    battles: {
      fandom: "Category:Campaigns",
      lexicanum: ""
    }
  },
  orks: {
    personae: {
      fandom: "Category:Ork Characters",
      lexicanum: "Category:Characters (Ork)"
    },
    worlds: {
      fandom: "Category:Ork Tribes",
      lexicanum: ""
    },
    tech: {
      fandom: "Category:Ork Technology",
      lexicanum: ""
    },
    weapons: {
      fandom: "Category:Ork Weapons",
      lexicanum: ""
    },
    organisations: {
      fandom: "Category:Ork",
      lexicanum: ""
    },
    battles: {
      fandom: "Category:Campaigns",
      lexicanum: ""
    }
  },
  necrons: {
    personae: {
      fandom: "Category:Necron Characters",
      lexicanum: "Category:Characters (Necron)"
    },
    worlds: {
      fandom: "Category:Necron Dynasty",
      lexicanum: ""
    },
    tech: {
      fandom: "Category:Necron Technology",
      lexicanum: ""
    },
    weapons: {
      fandom: "Category:Necron Weapons",
      lexicanum: ""
    },
    organisations: {
      fandom: "Category:Necron",
      lexicanum: ""
    },
    battles: {
      fandom: "Category:Campaigns",
      lexicanum: ""
    }
  },
  tau: {
    personae: {
      fandom: "Category:Tau Characters",
      lexicanum: "Category:Characters (Tau)"
    },
    worlds: {
      fandom: "Category:Tau Sept",
      lexicanum: ""
    },
    tech: {
      fandom: "Category:Tau Technology",
      lexicanum: ""
    },
    weapons: {
      fandom: "Category:Tau Weapons",
      lexicanum: ""
    },
    organisations: {
      fandom: "Category:Tau",
      lexicanum: ""
    },
    battles: {
      fandom: "Category:Campaigns",
      lexicanum: ""
    }
  },
  minor: {
    personae: {
      fandom: "Category:Races",
      lexicanum: "Category:Minor Alien Species and Factions"
    },
    worlds: {
      fandom: "Category:Leagues of Votann",
      lexicanum: ""
    },
    tech: {
      fandom: "Category:Kroot",
      lexicanum: ""
    },
    weapons: {
      fandom: "Category:Genestealer Cult",
      lexicanum: ""
    },
    organisations: {
      fandom: "Category:Factions",
      lexicanum: "Category:Species and Factions"
    },
    battles: {
      fandom: "Category:Campaigns",
      lexicanum: ""
    }
  }
};

// Curated important names, pinned to the top of each overview.

export { CATEGORY_MAP };
