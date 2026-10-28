/* URI Music Course Sequence Planner — app logic (sequence-driven) */
(function () {
  "use strict";

  const { TERMS, TERM_IDS, COURSES, DEGREES } = window.PLANNER_DATA;
  const UPPER_DIVISION = window.PLANNER_DATA.UPPER_DIVISION || { history: [], theory: [] };
  const RESOLUTIONS = window.PLANNER_DATA.RESOLUTIONS || {};
  // Read fresh each call: the live rotation sheet may have replaced this list.
  function majorEnsembles() { return window.PLANNER_DATA.MAJOR_ENSEMBLES || []; }
  function isMajorEnsembleSlot(label) { return !!label && /major\s+ensemble/i.test(label); }
  const SEQUENCES = window.PLANNER_SEQUENCES || {};
  const GENED = window.PLANNER_GENED || { GENED_OUTCOMES: [], GENED_COURSES: {} };

  // ---- State -------------------------------------------------------------
  // entries: [{ id, code|null, label, cr, term, alt?, choose?, gened? }]
  //   Each entry is one placed box in the term grid. Code may be null for
  //   gen-ed / non-MUS / fill-in blocks. `term` is the term id it sits in.
  const state = {
    degree: "",
    startTerm: TERM_IDS[1], // default: Fall 2027 (typical freshman start)
    showTentative: true,
    availOnly: false,
    entries: [],
    extraTerms: 0, // extra semesters appended past the rotation window
    seq: 1, // id counter
  };

  const LS_KEY = "uri-music-planner-v2";

  // Special non-semester bucket id for transfer credits and curriculum
  // modifications (waivers / substitutions). Not part of the term sequence.
  const MODS_TERM = "MODS";

  // ---- DOM ---------------------------------------------------------------
  const el = {
    degree: document.getElementById("degree-select"),
    start: document.getElementById("start-select"),
    tentative: document.getElementById("toggle-tentative"),
    availOnly: document.getElementById("toggle-availonly"),
    autofill: document.getElementById("btn-autofill"),
    print: document.getElementById("btn-print"),
    reset: document.getElementById("btn-reset"),
    save: document.getElementById("btn-save"),
    open: document.getElementById("btn-open"),
    codeDialog: document.getElementById("code-dialog"),
    codeBody: document.getElementById("code-body"),
    codeTitle: document.getElementById("code-title"),
    codeClose: document.getElementById("code-close"),
    codeBackdrop: document.getElementById("code-backdrop"),
    empty: document.getElementById("empty-state"),
    planner: document.getElementById("planner"),
    degreeTitle: document.getElementById("degree-title"),
    requirements: document.getElementById("requirements"),
    termGrid: document.getElementById("term-grid"),
    catalogPanel: document.getElementById("catalog-panel"),
    catalogContent: document.getElementById("catalog-content"),
    progressFill: document.getElementById("progress-fill"),
    progressText: document.getElementById("progress-text"),
    picker: document.getElementById("picker"),
    pickerBody: document.getElementById("picker-body"),
    pickerTitle: document.getElementById("picker-title"),
    pickerClose: document.getElementById("picker-close"),
    pickerBackdrop: document.getElementById("picker-backdrop"),
    sourceStatus: document.getElementById("source-status"),
  };

  // ---- Helpers -----------------------------------------------------------
  // Extra terms appended past the end of the projected rotation (for students
  // who stay longer than the standard plan). Ids are "X1", "X2", ... and we
  // continue the Fall/Spring pattern from the last rotation term.
  function extraTermList() {
    const n = state.extraTerms || 0;
    if (!n) return [];
    const last = TERMS[TERMS.length - 1]; // Spring 2031
    const out = [];
    let season = last.season, year = last.year;
    for (let i = 1; i <= n; i++) {
      if (season === "Spring") { season = "Fall"; } // same year: Spring -> Fall
      else { season = "Spring"; year += 1; }        // Fall -> next Spring
      out.push({ id: "X" + i, label: `${season} ${year}`, season, year, extra: true });
    }
    return out;
  }

  function activeTerms() {
    const i = TERM_IDS.indexOf(state.startTerm);
    return TERMS.slice(i < 0 ? 0 : i).concat(extraTermList());
  }

  function termLabel(id) {
    const t = TERMS.find((x) => x.id === id);
    if (t) return t.label;
    const x = extraTermList().find((e) => e.id === id);
    return x ? x.label : id;
  }
  function creditValue(crStr) { const m = String(crStr).match(/\d+/); return m ? parseInt(m[0], 10) : 0; }

  function courseAvailability(code, termId) {
    const c = COURSES[code];
    if (!c) return "unknown";
    const v = c.terms[termId];
    if (v === "X") return "ok";
    if (v === "?") return "tentative";
    return "none";
  }

  function newId() { return "e" + state.seq++; }

  // Classify an upper-division placeholder label into which approved list(s)
  // apply: "history", "theory", "either", or null for non-upper-div blocks.
  function upperDivKind(label) {
    if (!label) return null;
    const l = label.toLowerCase();
    if (!/upper[-\s]?division/.test(l)) return null;
    const hasHist = /history/.test(l);
    const hasTheory = /theory/.test(l);
    if (hasHist && hasTheory) return "either";       // "...History or Theory"
    if (hasHist) return "history";
    if (hasTheory) return "theory";
    // generic "Upper-Division MUS course" -> allow either list
    if (/\bmus\b/.test(l)) return "either";
    return null;
  }

  // The approved course codes available for a given upper-div kind.
  function upperDivOptions(kind) {
    if (kind === "history") return UPPER_DIVISION.history.slice();
    if (kind === "theory") return UPPER_DIVISION.theory.slice();
    // "either": union (dedup), history first then theory
    const seen = new Set(), out = [];
    [...UPPER_DIVISION.history, ...UPPER_DIVISION.theory].forEach((c) => { if (!seen.has(c)) { seen.add(c); out.push(c); } });
    return out;
  }

  // ---- Build entries from a degree's recommended sequence ----------------
  function entriesFromSequence() {
    const seq = SEQUENCES[state.degree];
    const active = activeTerms();
    if (!seq || !active.length) return [];
    const out = [];
    seq.forEach((semester, idx) => {
      const term = active[Math.min(idx, active.length - 1)];
      if (!term) return;
      semester.forEach((item) => {
        const code = item.code || null;
        const cr = code && COURSES[code] ? COURSES[code].cr : (item.cr || "3");
        const label = code
          ? (COURSES[code] ? COURSES[code].title : "")
          : (item.label || "Course");
        // For a Major Ensemble slot, use the current department-wide list
        // (live from the rotation sheet, or the built-in fallback) rather than
        // the list baked into the sequence.
        let chooseList = item.choose || null;
        if (isMajorEnsembleSlot(item.label)) {
          const me = majorEnsembles().filter((c) => COURSES[c]);
          if (me.length) chooseList = me;
        }
        out.push({
          id: newId(),
          code,
          label,
          cr,
          term: term.id,
          alt: item.alt || null,
          choose: chooseList,
          chooseLabel: item.label || null,
          gened: !!item.gened,
          upperDiv: code ? null : upperDivKind(item.label),
        });
      });
    });
    return out;
  }

  // ---- Persistence -------------------------------------------------------
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }
  function load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) Object.assign(state, JSON.parse(raw));
    } catch (e) {}
  }

  // ---- Save code (portable, serverless) ----------------------------------
  // The student's plan is packed INTO the code itself, so there's no server:
  // the code is the save file. Format:  URIMUSIC1-<base64url payload>-<chk>
  // with dashes inserted every few chars for readability. We store only what's
  // needed to rebuild the plan, keeping the code as short as we reasonably can.

  const CODE_PREFIX = "URIMUSIC1"; // bump the digit if the format ever changes

  // Gzip helpers using the browser's built-in CompressionStream when present.
  // Plans are very repetitive JSON, so this shrinks codes ~6-8x. If the browser
  // lacks CompressionStream (older ones), we fall back to uncompressed and tag
  // the code so decoding still knows what to do.
  async function gzip(str) {
    if (typeof CompressionStream === "undefined") return null;
    const cs = new CompressionStream("gzip");
    const writer = cs.writable.getWriter();
    writer.write(new TextEncoder().encode(str)); writer.close();
    const buf = await new Response(cs.readable).arrayBuffer();
    let bin = ""; new Uint8Array(buf).forEach((b) => (bin += String.fromCharCode(b)));
    return bin;
  }
  async function gunzip(bin) {
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    const ds = new DecompressionStream("gzip");
    const writer = ds.writable.getWriter();
    writer.write(bytes); writer.close();
    const buf = await new Response(ds.readable).arrayBuffer();
    return new TextDecoder().decode(buf);
  }
  // base64url over a binary string
  function b64urlFromBin(bin) {
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function binFromB64url(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    return atob(s);
  }

  // We store terms by their INDEX in the full TERM_IDS list (1 char) and, for
  // ordinary catalog courses, only the code + term — the title and credits are
  // re-derived from COURSES on load. Only custom gen-ed / fill-in blocks (which
  // aren't in the catalog) carry their own label/credits. This keeps codes short.
  // Encode a term for the save code: real terms -> index number; the mods
  // bucket -> "M"; extra added semesters keep their "X1"/"X2" id as a string.
  function encodeTerm(termId) {
    if (termId === MODS_TERM) return "M";
    if (isExtraTerm(termId)) return termId;      // e.g. "X2"
    return TERM_IDS.indexOf(termId);
  }
  function decodeTerm(t) {
    if (t === "M") return MODS_TERM;
    if (typeof t === "string" && /^X\d+$/.test(t)) return t;
    return typeof t === "number" ? TERM_IDS[t] : t;
  }

  function planToPayload() {
    const e = state.entries.map((en) => {
      const t = encodeTerm(en.term);
      if (en.code && COURSES[en.code]) {
        // catalog course: just code + term (+ swap/choose metadata if present)
        const o = { c: en.code, t };
        if (en.alt) o.a = en.alt;
        if (en.choose) o.h = en.choose;
        if (en.chooseLabel) o.cl = en.chooseLabel;
        if (en.resolution) o.rz = en.resolution; // e.g. a transferred-in MUS course
        return o;
      }
      // custom block (gen-ed / fill-in / non-MUS): keep its own label + credits
      const o = { l: en.label || "", r: en.cr || "", t };
      if (en.gened) o.g = 1;
      if (en.genedCode) o.gc = en.genedCode;      // chosen gen-ed course code
      if (en.outcomes) o.oc = en.outcomes;        // its outcome codes
      if (en.upperDiv) o.ud = en.upperDiv;        // upper-div kind: history/theory/either
      if (en.udCode) o.uc = en.udCode;            // chosen upper-div course code
      if (en.resolution) o.rz = en.resolution;    // mods-bank resolution path
      if (en.alt) o.a = en.alt;
      if (en.choose) o.h = en.choose;
      if (en.chooseLabel) o.cl = en.chooseLabel;
      return o;
    });
    return { d: state.degree, s: TERM_IDS.indexOf(state.startTerm), e, x: state.extraTerms || 0 };
  }

  function payloadToPlan(p) {
    if (!p || typeof p !== "object" || !Array.isArray(p.e)) throw new Error("This code is missing its plan data.");
    if (p.d && !DEGREES[p.d]) throw new Error("This code is for a program this planner doesn't recognize.");
    state.degree = p.d || "";
    state.startTerm = TERM_IDS[p.s] !== undefined ? TERM_IDS[p.s] : (p.s || TERM_IDS[1]);
    state.extraTerms = p.x || 0;
    let n = 0;
    state.entries = p.e.map((o, i) => {
      n = i + 1;
      const term = decodeTerm(o.t);
      const code = o.c && COURSES[o.c] ? o.c : null;
      return {
        id: "e" + (i + 1),
        code,
        label: code ? COURSES[code].title : (o.l || ""),
        cr: code ? COURSES[code].cr : (o.r || "3"),
        term,
        alt: o.a || null,
        choose: o.h || null,
        chooseLabel: o.cl || null,
        gened: code ? false : !!o.g,
        genedCode: o.gc || null,
        outcomes: o.oc || null,
        upperDiv: code ? null : (o.ud || null),
        udCode: o.uc || null,
        resolution: o.rz || null,
      };
    });
    state.seq = n + 1;
  }

  // base64url helpers that handle Unicode safely
  function b64urlEncode(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64urlDecode(s) {
    s = s.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const bin = atob(s);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  // short checksum so an obviously-mistyped code is rejected before loading
  function checksum(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
    return h.toString(36).slice(0, 4).toUpperCase();
  }

  // Code body starts with a 1-char flag: "g" = gzipped, "p" = plain.
  async function makeCode() {
    const json = JSON.stringify(planToPayload());
    let flag = "p";
    let body;
    const gz = await gzip(json);
    if (gz !== null) { flag = "g"; body = b64urlFromBin(gz); }
    else { body = b64urlEncode(json); }
    const payload = flag + body;
    const chk = checksum(payload);
    return `${CODE_PREFIX}-${payload}-${chk}`;
  }

  async function parseCode(input) {
    // Strip whitespace only. NOTE: base64url uses "-" as a data character, so
    // we must not remove dashes — we split on the PREFIX and the final "-".
    const cleaned = String(input).trim().replace(/\s+/g, "");
    if (!/^URIMUSIC1-/i.test(cleaned)) throw new Error("That doesn't look like a plan code.");
    const afterPrefix = cleaned.slice("URIMUSIC1-".length);
    const dash = afterPrefix.lastIndexOf("-");
    if (dash < 1) throw new Error("That doesn't look like a plan code.");
    const payload = afterPrefix.slice(0, dash);
    const chk = afterPrefix.slice(dash + 1).toUpperCase();
    if (!/^[A-Za-z0-9]{4}$/.test(chk)) throw new Error("That doesn't look like a plan code.");
    if (checksum(payload) !== chk) throw new Error("This code looks incomplete or mistyped.");
    const flag = payload[0];
    const body = payload.slice(1);
    let json;
    if (flag === "g") json = await gunzip(binFromB64url(body));
    else if (flag === "p") json = b64urlDecode(body);
    else throw new Error("Unrecognized code format.");
    return JSON.parse(json);
  }

  // ---- Auto-fill ---------------------------------------------------------
  function autoFill() {
    state.extraTerms = 0; // a fresh recommended sequence resets added semesters
    state.entries = entriesFromSequence();
    render();
  }

  // ---- Rendering ---------------------------------------------------------
  function render() {
    const hasDeg = !!DEGREES[state.degree];
    el.empty.classList.toggle("hidden", hasDeg);
    el.planner.classList.toggle("hidden", !hasDeg);
    if (!hasDeg) { save(); return; }
    el.degreeTitle.textContent = DEGREES[state.degree].name;
    renderTerms();
    renderRequirements();
    renderProgress();
    renderCatalog();
    save();
  }

  // Official catalog requirement text for the selected degree, pulled LIVE from
  // the URI catalog (see catalog.js). Falls back to a link if offline.
  function renderCatalog() {
    const panel = el.catalogPanel;
    if (!panel) return;
    const info = typeof window.getCatalogInfo === "function" ? window.getCatalogInfo(state.degree) : null;
    if (!info) { panel.classList.add("hidden"); return; }
    panel.classList.remove("hidden");
    const link = info.url
      ? `<p class="catalog-link"><a href="${info.url}" target="_blank" rel="noopener">View the official page on the URI catalog ↗</a></p>`
      : "";
    let body;
    if (info.description && info.description.trim()) {
      const paras = info.description
        .split(/\n{2,}/)
        .map((p) => p.trim())
        .filter(Boolean)
        .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`)
        .join("");
      body = `<div class="catalog-text">${paras}</div>`;
    } else if (info.live === false) {
      body = `<p class="help">Couldn&rsquo;t load the live catalog text right now &mdash; use the official link below for the current requirements.</p>`;
    } else {
      body = `<p class="help">The official requirement text for this program is on the URI catalog.</p>`;
    }
    const src = info.live
      ? `<p class="catalog-src">Pulled live from the URI catalog.</p>`
      : "";
    el.catalogContent.innerHTML =
      (info.title ? `<h4 class="catalog-h">${escapeHtml(info.title)}</h4>` : "") +
      body + link + src;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function buildTermCard(termId, label, opts) {
    opts = opts || {};
    const here = state.entries.filter((e) => e.term === termId);
    let credits = 0;
    here.forEach((e) => (credits += creditValue(e.cr)));

    const card = document.createElement("div");
    card.className = "term" + (opts.mods ? " term-mods" : "") + (opts.extra ? " term-extra" : "");
    const over = !opts.mods && credits > 18;
    const creditLabel = `${credits} cr`;
    // Extra (added) semesters get an "added" tag; the very last one can be removed.
    const extraTag = opts.extra ? `<span class="extra-tag">added</span>` : "";
    const removeBtn = opts.removable ? `<button class="term-remove" title="Remove this semester" aria-label="Remove this semester">&times;</button>` : "";
    card.innerHTML =
      `<div class="term-head"><span class="name">${label}${extraTag}</span>` +
      `<span class="term-head-right"><span class="credits ${over ? "over" : ""}">${creditLabel}</span>${removeBtn}</span></div>`;

    const zone = document.createElement("div");
    zone.className = "dropzone";
    zone.dataset.term = termId;

    if (opts.note) {
      const note = document.createElement("p");
      note.className = "mods-note";
      note.innerHTML = opts.note;
      zone.appendChild(note);
    }

    if (here.length === 0 && !opts.note) {
      zone.innerHTML = `<p class="placeholder-hint">Drop a course here, or use the + button</p>`;
    } else if (opts.mods) {
      // In the mods bank, each course gets a resolution selector + instructions.
      here.forEach((entry) => {
        const wrap = document.createElement("div");
        wrap.className = "mods-item";
        wrap.appendChild(renderEntry(entry, termId));
        wrap.appendChild(renderResolution(entry));
        zone.appendChild(wrap);
      });
    } else {
      here.forEach((entry) => zone.appendChild(renderEntry(entry, termId)));
    }

    const add = document.createElement("button");
    add.className = "add-entry";
    add.type = "button";
    add.textContent = opts.mods ? "+ add transfer / modified course" : "+ add course";
    add.addEventListener("click", () => openAddPicker(termId));
    zone.appendChild(add);

    zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
    zone.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("drag-over");
      const id = e.dataTransfer.getData("text/plain");
      const entry = state.entries.find((x) => x.id === id);
      if (entry) { entry.term = termId; render(); }
    });

    const rm = card.querySelector(".term-remove");
    if (rm) rm.addEventListener("click", (e) => { e.stopPropagation(); removeLastExtraTerm(); });

    card.appendChild(zone);
    return card;
  }

  function renderTerms() {
    el.termGrid.innerHTML = "";
    const i = TERM_IDS.indexOf(state.startTerm);
    const rotationTerms = TERMS.slice(i < 0 ? 0 : i);
    rotationTerms.forEach((term) => {
      el.termGrid.appendChild(buildTermCard(term.id, term.label));
    });

    // Extra (added) semesters, each tagged; only the very last is removable.
    const extras = extraTermList();
    extras.forEach((term, idx) => {
      const note = idx === 0
        ? "Added semester &mdash; beyond the projected course schedule, so course availability can&rsquo;t be checked here. Confirm offerings with the department."
        : null;
      el.termGrid.appendChild(
        buildTermCard(term.id, term.label, { extra: true, note, removable: idx === extras.length - 1 })
      );
    });

    // "Add a semester" tile.
    const addSem = document.createElement("button");
    addSem.className = "add-semester";
    addSem.type = "button";
    addSem.innerHTML = `<span class="plus">+</span> Add a semester`;
    addSem.title = "Append another term after the last one";
    addSem.addEventListener("click", addExtraTerm);
    el.termGrid.appendChild(addSem);

    // The curriculum-modifications bucket always comes last, full width.
    const modsNote =
      "Drag courses here that you <strong>transferred in</strong>, or that you plan to " +
      "<strong>waive or substitute</strong>. For each course, choose how you&rsquo;re resolving it " +
      "and you&rsquo;ll get the steps and the right URI form: a <em>transfer-credit re-evaluation</em> " +
      "for transferred work, or a <em>curriculum modification</em> for a waiver/substitution. " +
      "These aren&rsquo;t tied to a semester, and anything here must be approved by the department.";
    el.termGrid.appendChild(
      buildTermCard(MODS_TERM, "Transfer credit & curriculum modifications", { mods: true, note: modsNote })
    );
  }

  function addExtraTerm() {
    state.extraTerms = (state.extraTerms || 0) + 1;
    render();
  }

  function removeLastExtraTerm() {
    const extras = extraTermList();
    if (!extras.length) return;
    const lastId = extras[extras.length - 1].id;
    const occupied = state.entries.some((e) => e.term === lastId);
    if (occupied && !confirm("This semester has courses in it. Remove it and move those courses back to the last projected term?")) return;
    // move any entries out of the removed term back to the final rotation term
    if (occupied) {
      const i = TERM_IDS.indexOf(state.startTerm);
      const fallback = (extras.length > 1 ? extras[extras.length - 2].id : TERMS[TERMS.length - 1].id);
      state.entries.forEach((e) => { if (e.term === lastId) e.term = fallback; });
    }
    state.extraTerms = Math.max(0, (state.extraTerms || 0) - 1);
    render();
  }

  function isExtraTerm(termId) { return typeof termId === "string" && /^X\d+$/.test(termId); }

  function renderEntry(entry, termId) {
    // Availability is meaningless in the mods/transfer bucket and in extra
    // semesters past the rotation window (no projected data there), so don't flag.
    const noFlags = termId === MODS_TERM || isExtraTerm(termId);
    const avail = (entry.code && !noFlags) ? courseAvailability(entry.code, termId) : "unknown";
    const node = document.createElement("div");
    node.className = "placed-course" +
      (entry.gened ? " gened" : "") +
      (avail === "tentative" ? " warn-term" : "") +
      (avail === "none" ? " bad-term" : "");
    node.setAttribute("draggable", "true");
    node.dataset.id = entry.id;

    const isGenedSlot = !!entry.gened;
    const hasGenedPick = isGenedSlot && entry.genedCode;
    const isUdSlot = !!entry.upperDiv;
    const hasUdPick = isUdSlot && entry.udCode && COURSES[entry.udCode];
    const codeText = entry.code
      ? entry.code
      : (hasGenedPick ? entry.genedCode
        : (hasUdPick ? entry.udCode
          : (entry.choose ? (entry.chooseLabel || "Choose") : entry.label)));
    const titleText = entry.code
      ? entry.label
      : (hasGenedPick ? GENED.GENED_COURSES[entry.genedCode]?.t || ""
        : (hasUdPick ? COURSES[entry.udCode].title
          : (entry.choose ? "pick a course" : (isGenedSlot || isUdSlot ? entry.label : ""))));

    let flag = "";
    if (avail === "none") flag = `<span class="pc-flag bad">⚠ Not projected this term</span>`;
    else if (avail === "tentative") flag = `<span class="pc-flag warn">? Tentative this term</span>`;

    // outcome codes for a chosen gen-ed course, e.g. (A3, C3)
    const outs = (entry.outcomes && entry.outcomes.length) ? entry.outcomes : (hasGenedPick ? (GENED.GENED_COURSES[entry.genedCode]?.o || []) : []);
    const outChip = outs.length ? `<span class="pc-out">(${outs.join(", ")})</span>` : "";

    const canSwap = entry.alt || entry.choose;
    const canPickGened = isGenedSlot && !entry.choose && !entry.alt;
    const canPickUd = isUdSlot && !entry.choose && !entry.alt;

    if (titleText) node.title = (entry.code ? entry.code + " — " : "") + titleText;

    node.innerHTML =
      `<span class="pc-code">${codeText}${outChip}</span>` +
      `<span class="pc-cr">${entry.cr} cr</span>` +
      (titleText ? `<span class="pc-title">${titleText}</span>` : "") +
      flag +
      `<span class="pc-actions">` +
      (canSwap ? `<button class="mini-btn swap" title="Change course">swap</button>` : "") +
      (canPickGened ? `<button class="mini-btn gedpick" title="Choose a Gen Ed course">${hasGenedPick ? "change" : "choose"}</button>` : "") +
      (canPickUd ? `<button class="mini-btn udpick" title="Choose an approved upper-division course">${hasUdPick ? "change" : "choose"}</button>` : "") +
      `<button class="remove-btn" title="Remove" aria-label="Remove">&times;</button>` +
      `</span>`;

    node.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", entry.id);
      e.dataTransfer.effectAllowed = "move";
    });
    node.querySelector(".remove-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      state.entries = state.entries.filter((x) => x.id !== entry.id);
      render();
    });
    const swap = node.querySelector(".swap");
    if (swap) swap.addEventListener("click", (e) => { e.stopPropagation(); openSwapPicker(entry); });
    const ged = node.querySelector(".gedpick");
    if (ged) ged.addEventListener("click", (e) => { e.stopPropagation(); openGenedPicker(entry); });
    const ud = node.querySelector(".udpick");
    if (ud) ud.addEventListener("click", (e) => { e.stopPropagation(); openUpperDivPicker(entry); });
    return node;
  }

  // Resolution panel for a course in the Transfer / Curriculum-Modification
  // bank: a selector for how it's being handled, plus the matching
  // instructions and the correct URI form link.
  function renderResolution(entry) {
    const wrap = document.createElement("div");
    wrap.className = "resolution";
    const chosen = entry.resolution || "";
    const opts =
      `<option value="">— how are you resolving this? —</option>` +
      Object.keys(RESOLUTIONS).map((k) =>
        `<option value="${k}"${k === chosen ? " selected" : ""}>${escapeHtml(RESOLUTIONS[k].label)}</option>`
      ).join("");

    let detail = "";
    if (chosen && RESOLUTIONS[chosen]) {
      const r = RESOLUTIONS[chosen];
      const links = r.links.map((l) =>
        `<a href="${l.url}" target="_blank" rel="noopener">${escapeHtml(l.text)} ↗</a>`
      ).join("");
      detail =
        `<p class="resolution-text">${escapeHtml(r.instructions)}</p>` +
        `<div class="resolution-links">${links}</div>`;
    }

    wrap.innerHTML =
      `<select class="resolution-select" aria-label="Resolution for ${escapeHtml(entry.label || "this course")}">${opts}</select>` +
      detail;

    wrap.querySelector(".resolution-select").addEventListener("change", (e) => {
      entry.resolution = e.target.value || null;
      render();
    });
    return wrap;
  }

  // ---- Requirements checklist (coverage view) ----------------------------
  // Shows each requirement group and ticks off how many matching courses are
  // in the plan, so students see what's still missing after editing.
  function renderRequirements() {
    const deg = DEGREES[state.degree];
    el.requirements.innerHTML = "";
    const placedCodes = state.entries.map((e) => e.code).filter(Boolean);

    deg.groups.forEach((group) => {
      const div = document.createElement("div");
      div.className = "req-group";

      // figure out expected count and how many are covered
      let needed = 0, have = 0, items = [];
      group.courses.forEach((item) => {
        const rep = item.repeat || 1;
        if (item.code) {
          needed += rep;
          const codes = [item.code, ...(item.alt || [])];
          const got = Math.min(rep, placedCodes.filter((c) => codes.includes(c)).length);
          have += got;
          items.push({ text: item.code + (item.alt ? " / " + item.alt.join("/") : ""), got, rep });
        } else if (item.choose) {
          needed += item.choose;
          const got = Math.min(item.choose, placedCodes.filter((c) => item.from.includes(c)).length);
          have += got;
          items.push({ text: `${item.choose}× from ${item.from.join(", ")}`, got, rep: item.choose });
        } else if (item.placeholder) {
          needed += rep;
          items.push({ text: item.placeholder, got: 0, rep, fill: true });
        }
      });

      const done = needed > 0 && have >= needed;
      div.innerHTML =
        `<h4>${group.label} ` +
        (needed ? `<span class="req-count ${done ? "done" : ""}">${have}/${needed}</span>` : "") +
        `</h4>` +
        (group.note ? `<p class="req-note">${group.note}</p>` : "");
      el.requirements.appendChild(div);
    });

    renderGenedChecklist();
  }

  // Gen-ed outcome coverage: each of the 12 outcomes (+ Grand Challenge) must be
  // met by at least 3 credits. We tick off any outcome covered by a gen-ed
  // course the student placed (via its outcome codes).
  function renderGenedChecklist() {
    if (!GENED.GENED_OUTCOMES.length) return;
    // which outcomes are covered by placed gen-ed courses?
    const covered = {};
    state.entries.forEach((e) => {
      const outs = e.outcomes || (e.genedCode && GENED.GENED_COURSES[e.genedCode] ? GENED.GENED_COURSES[e.genedCode].o : null);
      if (outs) outs.forEach((o) => (covered[o] = (covered[o] || 0) + 1));
    });

    const div = document.createElement("div");
    div.className = "req-group gened-req";
    const metCount = GENED.GENED_OUTCOMES.filter((o) => covered[o.code]).length;
    const total = GENED.GENED_OUTCOMES.length;
    let html =
      `<h4>Gen Ed outcomes ` +
      `<span class="req-count ${metCount >= total ? "done" : ""}">${metCount}/${total}</span></h4>` +
      `<p class="req-note">40 credits total; each outcome needs at least 3 credits. Use a General Education slot&rsquo;s <em>choose</em> button to pick a course that counts for one.</p>` +
      `<ul class="gened-list-ck">`;
    GENED.GENED_OUTCOMES.forEach((o) => {
      const on = !!covered[o.code];
      html += `<li class="${on ? "met" : ""}"><span class="ck">${on ? "✓" : "○"}</span> <strong>${o.code}</strong> ${escapeHtml(o.name)}</li>`;
    });
    html += `</ul>`;
    div.innerHTML = html;
    el.requirements.appendChild(div);
  }

  function renderProgress() {
    const active = activeTerms();
    let total = 0;
    active.forEach((t) => state.entries.filter((e) => e.term === t.id).forEach((e) => (total += creditValue(e.cr))));
    const goal = DEGREES[state.degree].credits;
    const pct = Math.max(0, Math.min(100, Math.round((total / goal) * 100)));
    el.progressFill.style.width = pct + "%";
    const musCr = state.entries.filter((e) => e.code).reduce((s, e) => s + creditValue(e.cr), 0);
    el.progressText.textContent =
      `${total} credits planned of ${goal} · ${state.entries.length} courses · ${musCr} MUS credits`;
  }

  // ---- Pickers -----------------------------------------------------------
  let pickerMode = null; // "add" | "swap"
  let pickerTerm = null;
  let pickerEntry = null;

  function openAddPicker(termId) {
    pickerMode = "add"; pickerTerm = termId; pickerEntry = null;
    renderAddPicker();
    showPicker();
  }
  function openSwapPicker(entry) {
    pickerMode = "swap"; pickerEntry = entry; pickerTerm = entry.term;
    renderSwapPicker();
    showPicker();
  }
  function showPicker() {
    el.picker.classList.remove("hidden");
    el.pickerBackdrop.classList.remove("hidden");
    el.pickerClose.focus();
  }
  function closePicker() {
    el.picker.classList.add("hidden");
    el.pickerBackdrop.classList.add("hidden");
    pickerMode = null; pickerEntry = null;
  }

  function renderSwapPicker() {
    const entry = pickerEntry;
    el.pickerTitle.textContent = "Change course";
    const options = entry.alt
      ? [entry.code, ...entry.alt].filter(Boolean)
      : (entry.choose || []);
    el.pickerBody.innerHTML =
      `<p class="help" style="margin-bottom:10px">Pick which course fills this slot in ${termLabel(entry.term)}.</p>` +
      options.map((c) => {
        const t = COURSES[c] ? COURSES[c].title : "";
        const a = courseAvailability(c, entry.term);
        const tag = a === "ok" ? `<span class="status ok">offered</span>`
          : a === "tentative" ? `<span class="status tentative">tentative</span>`
          : `<span class="status none">not this term</span>`;
        return `<div class="term-opt"><div><strong>${c}</strong> ${t} ${tag}</div>` +
          `<button class="btn" data-code="${c}">Use</button></div>`;
      }).join("");
    el.pickerBody.querySelectorAll("button[data-code]").forEach((b) => {
      b.addEventListener("click", () => {
        const c = b.dataset.code;
        entry.code = c;
        entry.label = COURSES[c] ? COURSES[c].title : entry.label;
        entry.cr = COURSES[c] ? COURSES[c].cr : entry.cr;
        closePicker(); render();
      });
    });
  }

  // Build the <option> list of gen-ed courses, each labeled with its outcome
  // codes, optionally filtered by outcome and/or a text search.
  function genedOptions(filterOutcome, search) {
    const q = (search || "").toLowerCase().trim();
    const codes = Object.keys(GENED.GENED_COURSES).filter((c) => {
      const g = GENED.GENED_COURSES[c];
      if (filterOutcome && !g.o.includes(filterOutcome)) return false;
      if (q && !(c.toLowerCase().includes(q) || g.t.toLowerCase().includes(q))) return false;
      return true;
    });
    if (!codes.length) return `<option value="">(no matching gen-ed courses)</option>`;
    // Show all matches (the full list is ~670 options, which renders fine).
    return codes.map((c) => {
      const g = GENED.GENED_COURSES[c];
      return `<option value="${c}">${c} — ${escapeHtml(g.t)} (${g.o.join(", ")})</option>`;
    }).join("");
  }

  function renderAddPicker() {
    el.pickerTitle.textContent = "Add a course to " + termLabel(pickerTerm);
    const musOpts = Object.keys(COURSES).map((c) => {
      const a = pickerTerm === MODS_TERM ? "unknown" : courseAvailability(c, pickerTerm);
      const dot = a === "ok" ? "●" : a === "tentative" ? "◐" : a === "none" ? "○" : "·";
      return `<option value="${c}">${dot} ${c} — ${COURSES[c].title} (${COURSES[c].cr} cr)</option>`;
    }).join("");

    const outcomeOpts = `<option value="">Any outcome</option>` +
      GENED.GENED_OUTCOMES.map((o) => `<option value="${o.code}">${o.code} — ${escapeHtml(o.name)}</option>`).join("");

    el.pickerBody.innerHTML =
      // MUS course
      `<div class="picker-choose"><label for="add-course">Music (MUS) course</label>` +
      `<select id="add-course" size="1"><option value="">— choose a MUS course —</option>${musOpts}</select>` +
      `<p class="help">● offered this term · ◐ tentative · ○ not projected this term</p></div>` +

      // Gen-ed course picker
      `<div class="picker-choose gened-pick"><label>General Education course</label>` +
      `<div class="gened-filters">` +
      `<select id="gened-outcome">${outcomeOpts}</select>` +
      `<input id="gened-search" type="text" placeholder="search name or code…" />` +
      `</div>` +
      `<select id="gened-course" size="1">${genedOptions("", "")}</select>` +
      `<p class="help">Each option shows what it counts for, e.g. <strong>(A3, C3)</strong>. Pick a course and it&rsquo;s added with those outcomes.</p></div>` +

      // free-text non-MUS block
      `<div class="picker-choose"><label for="add-other">…or a custom block (non-MUS / placeholder)</label>` +
      `<input id="add-other" type="text" placeholder="e.g. Free Elective" />` +
      `<label for="add-other-cr" style="margin-top:6px">Credits</label>` +
      `<input id="add-other-cr" type="number" min="0" max="18" value="3" style="width:90px" /></div>` +

      `<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px">` +
      `<button class="btn ghost" id="add-cancel">Cancel</button>` +
      `<button class="btn" id="add-confirm">Add</button></div>`;

    // live-filter the gen-ed dropdown
    const refilter = () => {
      const o = el.pickerBody.querySelector("#gened-outcome").value;
      const s = el.pickerBody.querySelector("#gened-search").value;
      el.pickerBody.querySelector("#gened-course").innerHTML = genedOptions(o, s);
    };
    el.pickerBody.querySelector("#gened-outcome").addEventListener("change", refilter);
    el.pickerBody.querySelector("#gened-search").addEventListener("input", refilter);

    el.pickerBody.querySelector("#add-cancel").addEventListener("click", closePicker);
    el.pickerBody.querySelector("#add-confirm").addEventListener("click", () => {
      const mus = el.pickerBody.querySelector("#add-course").value;
      const ge = el.pickerBody.querySelector("#gened-course").value;
      const other = el.pickerBody.querySelector("#add-other").value.trim();
      if (mus && COURSES[mus]) {
        state.entries.push({ id: newId(), code: mus, label: COURSES[mus].title, cr: COURSES[mus].cr, term: pickerTerm });
      } else if (ge && GENED.GENED_COURSES[ge]) {
        const g = GENED.GENED_COURSES[ge];
        state.entries.push({ id: newId(), code: null, genedCode: ge, label: `${ge} — ${g.t}`, cr: "3", term: pickerTerm, gened: true, outcomes: g.o });
      } else if (other) {
        const cr = el.pickerBody.querySelector("#add-other-cr").value || "3";
        state.entries.push({ id: newId(), code: null, label: other, cr: String(cr), term: pickerTerm, gened: true });
      }
      closePicker(); render();
    });
  }

  // A dedicated gen-ed picker for filling an existing "General Education" slot.
  function openGenedPicker(entry) {
    pickerMode = "gened"; pickerEntry = entry; pickerTerm = entry.term;
    el.pickerTitle.textContent = "Choose a General Education course";
    const outcomeOpts = `<option value="">Any outcome</option>` +
      GENED.GENED_OUTCOMES.map((o) => `<option value="${o.code}">${o.code} — ${escapeHtml(o.name)}</option>`).join("");
    el.pickerBody.innerHTML =
      `<p class="help" style="margin-bottom:8px">Pick a course to fill this General Education slot. Each option shows the outcome(s) it satisfies, e.g. <strong>(A3, C3)</strong>.</p>` +
      `<div class="gened-filters">` +
      `<select id="gp-outcome">${outcomeOpts}</select>` +
      `<input id="gp-search" type="text" placeholder="search name or code…" />` +
      `</div>` +
      `<select id="gp-course" size="10" class="gened-list">${genedOptions("", "")}</select>` +
      `<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px">` +
      `<button class="btn ghost" id="gp-cancel">Cancel</button>` +
      `<button class="btn" id="gp-use">Use this course</button></div>`;
    const refilter = () => {
      el.pickerBody.querySelector("#gp-course").innerHTML =
        genedOptions(el.pickerBody.querySelector("#gp-outcome").value, el.pickerBody.querySelector("#gp-search").value);
    };
    el.pickerBody.querySelector("#gp-outcome").addEventListener("change", refilter);
    el.pickerBody.querySelector("#gp-search").addEventListener("input", refilter);
    el.pickerBody.querySelector("#gp-cancel").addEventListener("click", closePicker);
    el.pickerBody.querySelector("#gp-use").addEventListener("click", () => {
      const code = el.pickerBody.querySelector("#gp-course").value;
      if (code && GENED.GENED_COURSES[code]) {
        const g = GENED.GENED_COURSES[code];
        entry.genedCode = code;
        entry.label = `${code} — ${g.t}`;
        entry.outcomes = g.o;
      }
      closePicker(); render();
    });
    showPicker();
  }

  // Picker for an upper-division History/Theory slot, limited to the
  // faculty-approved lists (data.js UPPER_DIVISION).
  function openUpperDivPicker(entry) {
    pickerMode = "upperdiv"; pickerEntry = entry; pickerTerm = entry.term;
    const kind = entry.upperDiv || "either";
    const kindLabel = kind === "history" ? "Music History" : kind === "theory" ? "Music Theory" : "History or Theory";
    el.pickerTitle.textContent = `Choose an approved Upper-Division ${kindLabel} course`;

    function optionsFor(k) {
      return upperDivOptions(k).map((c) => {
        const t = COURSES[c] ? COURSES[c].title : "";
        const sel = entry.udCode === c ? " selected" : "";
        return `<option value="${c}"${sel}>${c} — ${escapeHtml(t)}</option>`;
      }).join("");
    }

    // For an "either" slot, let the student flip between the two lists.
    const toggle = kind === "either"
      ? `<div class="gened-filters"><select id="ud-kind">` +
        `<option value="either">All approved (History + Theory)</option>` +
        `<option value="history">Music History only</option>` +
        `<option value="theory">Music Theory only</option>` +
        `</select></div>`
      : "";

    el.pickerBody.innerHTML =
      `<p class="help" style="margin-bottom:8px">Approved by the URI Music Faculty (April 18, 2025). Pick the course that will fill this ${escapeHtml(kindLabel)} requirement.</p>` +
      toggle +
      `<select id="ud-course" size="8" class="gened-list">${optionsFor(kind)}</select>` +
      `<div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px">` +
      `<button class="btn ghost" id="ud-cancel">Cancel</button>` +
      `<button class="btn" id="ud-use">Use this course</button></div>`;

    const kindSel = el.pickerBody.querySelector("#ud-kind");
    if (kindSel) kindSel.addEventListener("change", () => {
      el.pickerBody.querySelector("#ud-course").innerHTML = optionsFor(kindSel.value);
    });
    el.pickerBody.querySelector("#ud-cancel").addEventListener("click", closePicker);
    el.pickerBody.querySelector("#ud-use").addEventListener("click", () => {
      const code = el.pickerBody.querySelector("#ud-course").value;
      if (code && COURSES[code]) {
        entry.udCode = code;
        entry.cr = COURSES[code].cr;
      }
      closePicker(); render();
    });
    showPicker();
  }

  // ---- Save / Load code dialog -------------------------------------------
  function openCodeDialog(mode) {
    if (mode === "save") renderSaveView();
    else renderLoadView();
    el.codeDialog.classList.remove("hidden");
    el.codeBackdrop.classList.remove("hidden");
    el.codeClose.focus();
  }
  function closeCodeDialog() {
    el.codeDialog.classList.add("hidden");
    el.codeBackdrop.classList.add("hidden");
  }

  async function renderSaveView() {
    if (!DEGREES[state.degree] || !state.entries.length) {
      el.codeTitle.textContent = "Nothing to save yet";
      el.codeBody.innerHTML =
        `<p class="help">Pick a degree and build a plan first, then come back to get your code.</p>` +
        `<div style="text-align:right;margin-top:12px"><button class="btn" id="code-ok">OK</button></div>`;
      el.codeBody.querySelector("#code-ok").addEventListener("click", closeCodeDialog);
      return;
    }
    const degName = DEGREES[state.degree].name;
    el.codeTitle.textContent = "Your plan code";
    el.codeBody.innerHTML = `<p class="help">Preparing your code…</p>`;
    const code = await makeCode();
    el.codeBody.innerHTML =
      `<p class="help" style="margin-bottom:10px">This code is your saved plan for <strong>${degName}</strong>. ` +
      `Keep it somewhere safe. To open this plan again — even on another computer — click <em>Load a code</em> and paste it in.</p>` +
      `<textarea id="code-out" class="code-box" readonly rows="4">${code}</textarea>` +
      `<div class="code-actions">` +
      `<button class="btn" id="code-copy">Copy code</button>` +
      `<button class="btn ghost" id="code-download">Download as file</button>` +
      `<span id="code-copied" class="code-copied hidden">Copied ✓</span>` +
      `</div>` +
      `<p class="help" style="margin-top:10px">Tip: the code is long because it holds your whole plan. Copying or downloading it is easier than typing.</p>`;

    el.codeBody.querySelector("#code-copy").addEventListener("click", async () => {
      const ta = el.codeBody.querySelector("#code-out");
      try {
        await navigator.clipboard.writeText(ta.value);
      } catch (e) {
        ta.select(); document.execCommand && document.execCommand("copy");
      }
      const note = el.codeBody.querySelector("#code-copied");
      note.classList.remove("hidden");
      setTimeout(() => note.classList.add("hidden"), 1800);
    });
    el.codeBody.querySelector("#code-download").addEventListener("click", () => {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const tag = state.degree.replace(/[^a-z0-9]+/gi, "-");
      a.href = url; a.download = `uri-music-plan-${tag}.txt`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  function renderLoadView() {
    el.codeTitle.textContent = "Load a plan code";
    el.codeBody.innerHTML =
      `<p class="help" style="margin-bottom:10px">Paste the code you saved earlier (or drop in your downloaded file&rsquo;s contents). This will replace whatever is on screen now.</p>` +
      `<textarea id="code-in" class="code-box" rows="4" placeholder="URIMUSIC1-..."></textarea>` +
      `<p id="code-error" class="code-error hidden"></p>` +
      `<div class="code-actions">` +
      `<button class="btn" id="code-load">Load this plan</button>` +
      `<button class="btn ghost" id="code-cancel">Cancel</button>` +
      `</div>`;
    el.codeBody.querySelector("#code-cancel").addEventListener("click", closeCodeDialog);
    el.codeBody.querySelector("#code-load").addEventListener("click", async () => {
      const input = el.codeBody.querySelector("#code-in").value;
      const errEl = el.codeBody.querySelector("#code-error");
      try {
        const payload = await parseCode(input);
        payloadToPlan(payload);
        // reflect loaded degree/start in the controls, then render
        el.degree.value = state.degree || "";
        el.start.value = state.startTerm || TERM_IDS[1];
        if (DEGREES[state.degree]) reflowToStart();
        closeCodeDialog();
        render();
      } catch (e) {
        errEl.textContent = (e && e.message) ? e.message : "Couldn't read that code.";
        errEl.classList.remove("hidden");
      }
    });
  }

  // ---- Controls ----------------------------------------------------------
  function populateSelectors() {
    Object.keys(DEGREES).forEach((key) => {
      const o = document.createElement("option");
      o.value = key; o.textContent = DEGREES[key].name;
      el.degree.appendChild(o);
    });
    TERMS.forEach((t) => {
      const o = document.createElement("option");
      o.value = t.id; o.textContent = t.label;
      el.start.appendChild(o);
    });
  }

  function reflowToStart() {
    // When the start term changes, shift the whole plan so semester 1 lands on
    // the new start term, preserving the relative term offsets students set.
    const active = activeTerms();
    const bounded = new Set(active.map((t) => t.id));
    state.entries.forEach((e) => {
      if (e.term === MODS_TERM) return; // mods bucket isn't a semester; leave it
      if (!bounded.has(e.term)) e.term = active[active.length - 1].id;
    });
  }

  function bindControls() {
    el.degree.addEventListener("change", () => {
      const changed = state.degree !== el.degree.value;
      state.degree = el.degree.value;
      if (changed && DEGREES[state.degree]) {
        autoFill(); // fresh recommended sequence
      } else {
        render();
      }
    });
    el.start.addEventListener("change", () => {
      state.startTerm = el.start.value;
      if (DEGREES[state.degree]) autoFill(); // re-lay the sequence from the new start
      else render();
    });
    el.tentative.addEventListener("change", () => { state.showTentative = el.tentative.checked; save(); });
    el.availOnly.addEventListener("change", () => { state.availOnly = el.availOnly.checked; save(); });
    el.print.addEventListener("click", () => window.print());
    el.autofill.addEventListener("click", () => {
      if (state.entries.length && !confirm("Reset to the recommended sequence? This replaces your current edits.")) return;
      autoFill();
    });
    el.reset.addEventListener("click", () => {
      if (!confirm("Clear the whole plan?")) return;
      state.entries = []; render();
    });
    el.save.addEventListener("click", () => openCodeDialog("save"));
    el.open.addEventListener("click", () => openCodeDialog("load"));
    el.codeClose.addEventListener("click", closeCodeDialog);
    el.codeBackdrop.addEventListener("click", closeCodeDialog);
    el.pickerClose.addEventListener("click", closePicker);
    el.pickerBackdrop.addEventListener("click", closePicker);
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!el.picker.classList.contains("hidden")) closePicker();
      if (!el.codeDialog.classList.contains("hidden")) closeCodeDialog();
    });
  }

  // Show where the course schedule came from (live sheet vs built-in copy).
  function showSourceStatus(status) {
    const el2 = el.sourceStatus;
    if (!el2) return;
    if (!status || !status.configured) {
      el2.textContent = "Using the built-in course schedule (no live sheet configured).";
      el2.className = "source-status builtin";
      return;
    }
    if (status.live) {
      el2.textContent = `Live course schedule loaded from the department sheet — ${status.courses} courses.`;
      el2.className = "source-status live";
    } else {
      el2.textContent =
        "Couldn't reach the live sheet; using the built-in course schedule." +
        (status.error ? ` (${status.error})` : "");
      el2.className = "source-status builtin";
    }
  }

  async function init() {
    load();
    // Wait for the live sheet to load (or fail) before building the UI, so the
    // rotation the student sees matches the chair's current sheet. The loader
    // mutates window.PLANNER_DATA.COURSES in place, so our COURSES reference
    // already reflects any live updates once this resolves.
    let status = null;
    try {
      if (window.PLANNER_LIVE_READY) status = await window.PLANNER_LIVE_READY;
    } catch (e) { /* fall back to built-in silently */ }
    showSourceStatus(status);

    // Catalog text loads from the official site in the background; when it
    // arrives, refresh the catalog panel if a degree is already showing.
    if (window.PLANNER_CATALOG_READY) {
      window.PLANNER_CATALOG_READY.then(() => {
        if (DEGREES[state.degree]) renderCatalog();
      }).catch(() => {});
    }

    populateSelectors();
    bindControls();
    el.degree.value = state.degree || "";
    el.start.value = state.startTerm || TERM_IDS[1];
    el.tentative.checked = state.showTentative;
    el.availOnly.checked = state.availOnly;
    if (DEGREES[state.degree]) reflowToStart();
    render();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
