/*
 * URI Music Course Sequence Planner — LIVE SOURCE (Google Sheets)
 * =================================================================
 *
 * The department chair keeps the planner up to date by editing ONE Google
 * Sheet: the "URI MUSIC PROJECTED COURSE ROTATION" they already maintain. On
 * page load the planner reads the published sheet and the live rotation
 * REPLACES the built-in course availability / titles / credits. If the fetch
 * fails (offline, URL not set, or opened as a bare file://), the planner
 * silently falls back to the built-in data in data.js, so it never breaks.
 *
 * WHAT THE SHEET DRIVES:  which courses run in which term (X / ? / blank),
 * plus each course's title and credits. The recommended degree SEQUENCES stay
 * in sequences.js (they rarely change). Students can still drag/edit freely.
 *
 * -----------------------------------------------------------------------------
 * HOW TO PUBLISH (one time, by the sheet owner)
 * -----------------------------------------------------------------------------
 *   File ▸ Share ▸ Publish to web ▸ (Entire document) ▸ Comma-separated values
 *   ▸ Publish. Copy the link. Paste it into CONFIG.PUBLISHED_URL below. Both the
 *   ".../pubhtml" link and a ".../pub?output=csv" link work — the loader figures
 *   out the CSV form automatically.
 *
 * After that, the chair just edits the sheet. Changes appear on the next page
 * load (Google can take a few minutes to refresh the published copy).
 *
 * -----------------------------------------------------------------------------
 * EXPECTED ROTATION COLUMNS (this is the sheet's existing layout)
 * -----------------------------------------------------------------------------
 *   CODE | COURSE | S27 | F27 | S28 | F28 | S29 | F29 | S30 | F30 | S31 | CREDITS | ...
 *   - A term cell holds  X  (offered),  ?  (tentative), or blank (not offered).
 *   - Section header rows (01, 02, ...) and the color-legend rows are ignored.
 *   - Gen-ed tags written in the COURSE name like "(A4, C3)" are picked up
 *     automatically as attributes.
 */

(function () {
  "use strict";

  // ======== CONFIG — the chair's published rotation sheet ========
  const CONFIG = {
    // Paste the "Publish to web" link here (pubhtml or pub?output=csv both ok):
    PUBLISHED_URL:
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRT6pdXeqoXOvnA7xp1SUMOmHrBlcQ0gMZ1VF-pJGDQy8VA_nbCgsxOYUGWVl_kdxf_V4nvQDIUlDaq/pubhtml",
  };
  // ===============================================================

  const TERM_IDS = (window.PLANNER_DATA && window.PLANNER_DATA.TERM_IDS) || [];

  // Turn whatever published link was pasted into a CSV endpoint.
  function csvUrl(u) {
    if (!u) return null;
    if (/output=csv/.test(u)) return u;
    // .../pubhtml  or  .../pub  ->  .../pub?output=csv
    return u.replace(/\/pubhtml.*$/, "/pub?output=csv").replace(/\/pub(\?.*)?$/, "/pub?output=csv");
  }

  // ---- Minimal RFC-4180 CSV parser (quotes, commas, newlines) ----
  function parseCSV(text) {
    const rows = [];
    let row = [], field = "", i = 0, q = false;
    while (i < text.length) {
      const ch = text[i];
      if (q) {
        if (ch === '"') { if (text[i + 1] === '"') { field += '"'; i += 2; continue; } q = false; i++; continue; }
        field += ch; i++; continue;
      }
      if (ch === '"') { q = true; i++; continue; }
      if (ch === ",") { row.push(field); field = ""; i++; continue; }
      if (ch === "\r") { i++; continue; }
      if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += ch; i++;
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }

  // Pull gen-ed attribute tags out of a course title like "Foo (A4, C3)".
  function extractAttrs(title) {
    const attrs = [];
    const m = title.match(/\(([^)]*)\)/g);
    if (m) {
      m.forEach((grp) => {
        grp.replace(/[()]/g, "").split(/[\s,]+/).forEach((tok) => {
          if (/^(A[1-4]|B[1-4]|C[1-3]|D1|G)$/.test(tok)) attrs.push(tok);
        });
      });
    }
    return attrs;
  }

  // Find the header row (the one whose first cell is exactly "CODE") and map
  // each term id to its column index.
  function locateColumns(rows) {
    for (let r = 0; r < rows.length; r++) {
      const first = (rows[r][0] || "").trim().toUpperCase();
      if (first === "CODE") {
        const header = rows[r].map((h) => (h || "").trim());
        const termCol = {};
        let creditCol = -1, majorEnsCol = -1;
        header.forEach((h, c) => {
          const H = h.toUpperCase();
          if (TERM_IDS.includes(H)) termCol[H] = c;
          if (H === "CREDITS" || H === "CREDIT" || H === "CR") creditCol = c;
          if (H === "MAJOR ENSEMBLE" || H === "MAJOR ENSEMBLES") majorEnsCol = c;
        });
        return { headerRow: r, termCol, creditCol, majorEnsCol };
      }
    }
    return null;
  }

  // Apply the rotation CSV onto window.PLANNER_DATA.COURSES (in place). Also
  // reads the "MAJOR ENSEMBLE" column into window.PLANNER_DATA.MAJOR_ENSEMBLES
  // (the set of courses the department currently counts as a major ensemble).
  function applyRotation(rows) {
    const loc = locateColumns(rows);
    if (!loc) throw new Error('No "CODE" header row found');
    const COURSES = window.PLANNER_DATA.COURSES;
    const majorEns = [];
    let n = 0;
    for (let r = loc.headerRow + 1; r < rows.length; r++) {
      const cells = rows[r];
      const code = (cells[0] || "").trim().toUpperCase().replace(/\s+/g, " ");
      // skip section headers (01, 02, ...) and blank/legend rows
      if (!/^MUS\s/.test(code)) continue;
      const rawTitle = (cells[1] || "").trim();
      const title = rawTitle.replace(/\s*\([^)]*\)\s*$/, "").trim() || rawTitle;
      const terms = {};
      Object.keys(loc.termCol).forEach((tid) => {
        const v = (cells[loc.termCol[tid]] || "").trim().toUpperCase();
        if (v === "X") terms[tid] = "X";
        else if (v === "?") terms[tid] = "?";
      });
      let cr = loc.creditCol >= 0 ? (cells[loc.creditCol] || "").trim() : "";
      // Department rule: applied lessons (MUS 210/410) are always 2 credits for
      // majors, so normalize away the sheet's "1-2" range for these.
      if ((code === "MUS 210" || code === "MUS 410") && /^1-2$/.test(cr)) cr = "2";
      const prev = COURSES[code] || {};
      COURSES[code] = {
        title: title || prev.title || code,
        cr: cr || prev.cr || "3",
        attrs: extractAttrs(rawTitle).length ? extractAttrs(rawTitle) : (prev.attrs || []),
        terms,
      };
      // major-ensemble flag from the dedicated column
      if (loc.majorEnsCol >= 0) {
        const me = (cells[loc.majorEnsCol] || "").trim().toUpperCase();
        if (me === "X") majorEns.push(code);
      }
      n++;
    }
    // Only override the built-in list if the sheet actually had the column
    // with at least one marked course; otherwise keep the fallback.
    if (loc.majorEnsCol >= 0 && majorEns.length) {
      window.PLANNER_DATA.MAJOR_ENSEMBLES = majorEns;
    }
    return n;
  }

  async function fetchCSV(url) {
    const res = await fetch(url, { credentials: "omit", redirect: "follow" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    return parseCSV(await res.text());
  }

  // The app awaits this promise before rendering. It resolves to a status
  // object; it never rejects (failures just mean the built-in data is used).
  window.PLANNER_LIVE_READY = (async function () {
    const status = { live: false, courses: 0, configured: false, error: null };
    const url = csvUrl(CONFIG.PUBLISHED_URL);
    if (!url) { status.error = "No live sheet configured"; return status; }
    status.configured = true;
    try {
      const rows = await fetchCSV(url);
      status.courses = applyRotation(rows);
      status.live = status.courses > 0;
    } catch (e) {
      status.error = e && e.message ? e.message : String(e);
    }
    return status;
  })();
})();
