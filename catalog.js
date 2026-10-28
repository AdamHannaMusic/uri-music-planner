/*
 * URI Music Course Sequence Planner — LIVE official catalog descriptions
 * ======================================================================
 *
 * Pulls the formal degree-requirement text straight from URI's official
 * catalog (powered by Kuali) so advisors never have to update it by hand.
 * When the catalog is updated, the planner shows the new text on next load.
 *
 * It works because the catalog's data API is public (no login):
 *   current catalog id:  GET https://uri.kuali.co/api/v1/catalog/public/catalogs/current
 *   a program + its specializations:
 *                        GET https://uri.kuali.co/api/v1/catalog/program/<catalogId>/<programId>
 *
 * The two Music programs (B.M. and B.A.) each return every specialization
 * (Classical Guitar, Jazz, ... Music Therapy / Music, History & Lit, Jazz
 * Studies) with its full description. We fetch both, then match each of our
 * degree keys to its specialization by title.
 *
 * If the catalog can't be reached, we fall back to a short built-in note plus
 * the official link, so the panel still works offline.
 */

(function () {
  "use strict";

  const API = "https://uri.kuali.co/api/v1/catalog";
  // Program ids (stable identifiers from the catalog URLs).
  const BM_PID = "HkQVnRsKuY";
  const BA_PID = "HkQhAsK_t";
  // Public catalog pages to link out to (the live, always-current source).
  const BM_URL = "https://web.uri.edu/catalog/#/programs/" + BM_PID;
  const BA_URL = "https://web.uri.edu/catalog/#/programs/" + BA_PID;

  // Map each planner degree key -> { program, title, url }.
  // `title` must match the specialization's title in the catalog (we match
  // case-insensitively and ignore extra spaces, so small wording drift is ok).
  const MAP = {
    classical_guitar:       { url: BM_URL, pid: BM_PID, title: "Music Performance Classical Guitar" },
    jazz_performance:       { url: BM_URL, pid: BM_PID, title: "Music Performance Jazz" },
    orchestral_performance: { url: BM_URL, pid: BM_PID, title: "Music Performance Orchestral Instrument" },
    piano_performance:      { url: BM_URL, pid: BM_PID, title: "Music Performance Piano" },
    voice_performance:      { url: BM_URL, pid: BM_PID, title: "Music Performance Voice" },
    composition:            { url: BM_URL, pid: BM_PID, title: "Music Composition" },
    music_education:        { url: BM_URL, pid: BM_PID, title: "Music Education" },
    music_therapy:          { url: BM_URL, pid: BM_PID, title: "Music Therapy" },
    ba_music_option:        { url: BA_URL, pid: BA_PID, title: "Music" },
    ba_history_lit:         { url: BA_URL, pid: BA_PID, title: "Music History and Literature" },
    ba_jazz_studies:        { url: BA_URL, pid: BA_PID, title: "Jazz Studies" },
  };

  // Human-readable fallback titles if the live fetch fails.
  const FALLBACK_TITLE = {
    classical_guitar: "Music Performance — Classical Guitar (B.M.)",
    jazz_performance: "Music Performance — Jazz (B.M.)",
    orchestral_performance: "Music Performance — Orchestral Instrument (B.M.)",
    piano_performance: "Music Performance — Piano (B.M.)",
    voice_performance: "Music Performance — Voice (B.M.)",
    composition: "Music Composition (B.M.)",
    music_education: "Music Education (B.M.)",
    music_therapy: "Music Therapy (B.M.)",
    ba_music_option: "Music — Music Option (B.A.)",
    ba_history_lit: "Music — Music History & Literature (B.A.)",
    ba_jazz_studies: "Music — Jazz Studies Option (B.A.)",
  };

  const norm = (s) => String(s || "").toLowerCase().replace(/\s+/g, " ").trim();

  // Filled in once the live data loads: degreeKey -> {title, description, url}
  const resolved = {};

  async function getJSON(url) {
    const res = await fetch(url, { credentials: "omit" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return res.json();
  }

  async function currentCatalogId() {
    const data = await getJSON(`${API}/public/catalogs/current`);
    // endpoint returns the current catalog object (or an array); be tolerant
    if (Array.isArray(data)) return data[0] && (data[0].id || data[0]._id);
    return data && (data.id || data._id);
  }

  // Build a title -> {description, degreeTitle, programDescription} index from a
  // program payload (which carries its specializations).
  function indexProgram(prog, intoByTitle) {
    const specs = Array.isArray(prog.specializations) ? prog.specializations : [];
    specs.forEach((sp) => {
      intoByTitle[norm(sp.title)] = {
        description: sp.description || "",
        specTitle: sp.title || "",
        programIntro: prog.description || "",
      };
    });
  }

  // The app awaits this; it never rejects (failure => built-in fallback note).
  window.PLANNER_CATALOG_READY = (async function () {
    const status = { live: false, error: null, count: 0 };
    try {
      const catId = await currentCatalogId();
      if (!catId) throw new Error("no current catalog id");
      const [bm, ba] = await Promise.all([
        getJSON(`${API}/program/${catId}/${BM_PID}`),
        getJSON(`${API}/program/${catId}/${BA_PID}`),
      ]);
      const byTitle = {};
      indexProgram(bm, byTitle);
      indexProgram(ba, byTitle);

      Object.keys(MAP).forEach((key) => {
        const m = MAP[key];
        const hit = byTitle[norm(m.title)];
        if (hit) {
          resolved[key] = { title: hit.specTitle || FALLBACK_TITLE[key], description: hit.description, url: m.url, live: true };
          status.count++;
        }
      });
      status.live = status.count > 0;
    } catch (e) {
      status.error = e && e.message ? e.message : String(e);
    }
    return status;
  })();

  // Public accessor the app uses. Returns the live entry if we have it, else a
  // graceful fallback (title + official link only).
  window.getCatalogInfo = function (degreeKey) {
    if (resolved[degreeKey]) return resolved[degreeKey];
    const m = MAP[degreeKey];
    if (!m) return null;
    return { title: FALLBACK_TITLE[degreeKey] || "", description: "", url: m.url, live: false };
  };
})();
