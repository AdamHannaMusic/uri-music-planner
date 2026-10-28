/*
 * Course Rotation Builder — URI Music chair admin (standalone).
 * =============================================================
 * A chair-facing workspace to lay the department's sections onto URI's
 * standard meeting-time blocks and catch conflicts before the schedule goes
 * to Enrollment Services. Self-contained; it reuses the planner's course data
 * (data.js) and the live rotation sheet, but never touches the student app.
 *
 * Conflicts detected (live):
 *   - Instructor double-booked (same instructor, overlapping block)
 *   - Room clash (same room, overlapping block)
 *   - Degree-path collision (two courses the same cohort takes together land
 *     on the same block, so students couldn't take both)
 *
 * Persistence: localStorage for now (per browser). Export/Import moves the
 * whole rotation as JSON, and sections export as CSV. Cloud save (Google
 * Apps Script) is a planned follow-up.
 */
(function () {
  "use strict";

  // ---- Passphrase gate (NOT security; deters casual visitors) -------------
  const GATE_PASSPHRASE = "rhody-chair";   // change me; real auth comes later
  const GATE_KEY = "uri-rotadmin-ok";

  // ---- URI STANDARD MEETING BLOCKS ----------------------------------------
  // Source: URI Registration & Records — Classrooms & Scheduling.
  //   MWF 50-min blocks on the hour 8am–5pm; TR 75-min blocks; plus evening.
  // Each block: id, days[], label, start/end in minutes-from-midnight.
  function mins(h, m) { return h * 60 + (m || 0); }
  function blockMWF(hour12, pm) {
    const h = pm ? (hour12 === 12 ? 12 : hour12 + 12) : hour12;
    return { days: ["M", "W", "F"], start: mins(h, 0), end: mins(h, 50) };
  }
  const STANDARD_BLOCKS = [];
  // MWF 8..5  (8,9,10,11,12,1,2,3,4,5) — 12 is noon, 1–5 are PM.
  [[8,0],[9,0],[10,0],[11,0],[12,0],[1,1],[2,1],[3,1],[4,1],[5,1]].forEach(([hr, pm]) => {
    const b = blockMWF(hr, pm);
    STANDARD_BLOCKS.push({ id: "MWF" + hr + (pm ? "p" : "a"), group: "MWF", label: "MWF " + hr, ...b });
  });
  // TR 75-min blocks.
  [["8:00","9:15",mins(8,0),mins(9,15)],
   ["9:30","10:45",mins(9,30),mins(10,45)],
   ["11:00","12:15",mins(11,0),mins(12,15)],
   ["12:30","1:45",mins(12,30),mins(13,45)],
   ["2:00","3:15",mins(14,0),mins(15,15)],
   ["3:30","4:45",mins(15,30),mins(16,45)],
   ["5:00","6:15",mins(17,0),mins(18,15)]].forEach((t, i) => {
    STANDARD_BLOCKS.push({ id: "TR" + i, group: "TR", days: ["T", "R"], label: "TR " + t[0] + "–" + t[1], start: t[2], end: t[3] });
  });
  // Non-standard evening blocks (space permitting).
  [["M",mins(16,0),mins(18,45),"M 4:00–6:45"],
   ["T",mins(17,0),mins(19,45),"T 5:00–7:45"],
   ["W",mins(16,0),mins(18,45),"W 4:00–6:45"],
   ["R",mins(17,0),mins(19,45),"R 5:00–7:45"]].forEach((t, i) => {
    STANDARD_BLOCKS.push({ id: "EVE" + i, group: "Evening", days: [t[0]], label: t[3], start: t[1], end: t[2], evening: true });
  });

  function blockById(id) { return STANDARD_BLOCKS.find((b) => b.id === id); }
  // Do two blocks share any day AND overlap in time?
  function blocksConflict(a, b) {
    if (!a || !b) return false;
    const sharedDay = a.days.some((d) => b.days.includes(d));
    if (!sharedDay) return false;
    return a.start < b.end && b.start < a.end;
  }

  const MODALITIES = ["In-person", "Online (sync)", "Online (async)", "Hybrid"];

  // ---- Data from the planner ----------------------------------------------
  const DATA = window.PLANNER_DATA || {};
  const COURSES = DATA.COURSES || {};
  const DEGREES = DATA.DEGREES || {};
  const TERMS = DATA.TERMS || [];
  const SEQUENCES = window.PLANNER_SEQUENCES || {};

  // ---- State (persisted in localStorage) ----------------------------------
  const LS_KEY = "uri-rotadmin-v1";
  const state = {
    term: (TERMS[1] && TERMS[1].id) || (TERMS[0] && TERMS[0].id) || "F27",
    sections: [],   // [{ id, code, section, instructor, room, modality, blockId|null, term }]
    changes: [],    // [{ id, text, stage, date }]
    seq: 1,
  };
  function newId(p) { return (p || "s") + (state.seq++); }
  function save() { try { localStorage.setItem(LS_KEY, JSON.stringify(state)); } catch (e) {} }
  function load() {
    try { const raw = localStorage.getItem(LS_KEY); if (raw) Object.assign(state, JSON.parse(raw)); } catch (e) {}
  }

  // ---- DOM ----
  const $ = (id) => document.getElementById(id);

  // ========================================================================
  // CONFLICT DETECTION
  // ========================================================================
  // For the current term's scheduled sections, find every conflicting pair.
  function computeConflicts() {
    const scheduled = state.sections.filter((s) => s.term === state.term && s.blockId);
    const conflicts = [];               // { kind, a, b, detail }
    const perSection = {};              // sectionId -> [reasons]

    function flag(a, b, kind, detail) {
      conflicts.push({ kind, a, b, detail });
      (perSection[a.id] = perSection[a.id] || []).push({ kind, detail, other: b });
      (perSection[b.id] = perSection[b.id] || []).push({ kind, detail, other: a });
    }

    for (let i = 0; i < scheduled.length; i++) {
      for (let j = i + 1; j < scheduled.length; j++) {
        const a = scheduled[i], b = scheduled[j];
        const ba = blockById(a.blockId), bb = blockById(b.blockId);
        if (!blocksConflict(ba, bb)) continue;   // no time overlap → no conflict

        // Instructor double-booked
        if (a.instructor && b.instructor &&
            a.instructor.trim().toLowerCase() === b.instructor.trim().toLowerCase()) {
          flag(a, b, "instructor", `${a.instructor} is teaching ${label(a)} and ${label(b)} at the same time`);
        }
        // Room clash (ignore online rooms / blanks)
        if (a.room && b.room && isPhysical(a.room) && isPhysical(b.room) &&
            a.room.trim().toLowerCase() === b.room.trim().toLowerCase()) {
          flag(a, b, "room", `Room ${a.room} is booked for ${label(a)} and ${label(b)} at the same time`);
        }
        // Degree-path collision: a cohort takes both courses together.
        const cohorts = sharedCohorts(a.code, b.code);
        if (cohorts.length) {
          flag(a, b, "path", `${a.code} and ${b.code} overlap for ${cohorts[0]} — students on that path can't take both`);
        }
      }
    }
    return { conflicts, perSection };
  }
  function isPhysical(room) { return !/online|async|remote|tbd|n\/?a/i.test(room || ""); }
  function label(s) { return s.code + (s.section ? " §" + s.section : ""); }

  // Which degree+year cohorts take BOTH codes in the SAME semester of their
  // recommended sequence? Returns human labels like "Composition, Year 2".
  function sharedCohorts(codeA, codeB) {
    if (!codeA || !codeB || codeA === codeB) return [];
    const out = [];
    Object.keys(SEQUENCES).forEach((degKey) => {
      const seq = SEQUENCES[degKey];
      const degName = (DEGREES[degKey] && DEGREES[degKey].name) || degKey;
      seq.forEach((semester, idx) => {
        const codes = semester.map(itemCode).filter(Boolean);
        if (codes.includes(codeA) && codes.includes(codeB)) {
          out.push(`${degName}, ${yearLabel(idx)}`);
        }
      });
    });
    return out;
  }
  function itemCode(item) { return item.code || null; }  // choose/alt slots have no single code
  function yearLabel(semIdx) {
    const yr = Math.floor(semIdx / 2) + 1;
    const names = ["Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
    return (names[yr - 1] || ("Year " + yr)) + (semIdx % 2 === 0 ? " (fall)" : " (spring)");
  }

  // ========================================================================
  // RENDER
  // ========================================================================
  function render() {
    renderTermPicker();
    const { perSection } = computeConflicts();
    renderGrid(perSection);
    renderTray(perSection);
    renderConflictBanner();
    renderChangeLog();
    save();
  }

  function renderTermPicker() {
    const sel = $("term-picker");
    if (sel.dataset.ready) { sel.value = state.term; return; }
    sel.innerHTML = TERMS.map((t) => `<option value="${t.id}">${t.label}</option>`).join("");
    sel.value = state.term;
    sel.dataset.ready = "1";
    sel.addEventListener("change", () => { state.term = sel.value; render(); });
  }

  function renderGrid(perSection) {
    const grid = $("sched-grid");
    // Group blocks into columns MWF / TR / Evening.
    const groups = [["MWF", "MWF (50 min)"], ["TR", "Tue/Thu (75 min)"], ["Evening", "Evening / non-standard"]];
    grid.innerHTML = groups.map(([g, title]) => {
      const blocks = STANDARD_BLOCKS.filter((b) => b.group === g);
      const cells = blocks.map((b) => {
        const here = state.sections.filter((s) => s.term === state.term && s.blockId === b.id);
        const chips = here.map((s) => sectionChip(s, perSection)).join("");
        return `<div class="slot" data-block="${b.id}">
                  <div class="slot-label">${b.label}</div>
                  <div class="slot-drop" data-block="${b.id}">${chips || '<span class="slot-empty">—</span>'}</div>
                </div>`;
      }).join("");
      return `<div class="sched-col"><h3>${title}</h3>${cells}</div>`;
    }).join("");

    // wire drop targets
    grid.querySelectorAll(".slot-drop").forEach((zone) => {
      zone.addEventListener("dragover", (e) => { e.preventDefault(); zone.classList.add("drag-over"); });
      zone.addEventListener("dragleave", () => zone.classList.remove("drag-over"));
      zone.addEventListener("drop", (e) => {
        e.preventDefault(); zone.classList.remove("drag-over");
        const id = e.dataTransfer.getData("text/plain");
        const s = state.sections.find((x) => x.id === id);
        if (s) { s.blockId = zone.dataset.block; render(); }
      });
    });
    wireChips();
  }

  function sectionChip(s, perSection) {
    const reasons = perSection[s.id] || [];
    const bad = reasons.length ? " conflict" : "";
    const kinds = [...new Set(reasons.map((r) => r.kind))];
    const badge = kinds.length ? `<span class="chip-flag" title="${esc(reasons.map(r=>r.detail).join('\n'))}">⚠ ${kinds.join(", ")}</span>` : "";
    return `<div class="sec-chip${bad}" draggable="true" data-id="${s.id}">
      <span class="sec-chip-main">${esc(label(s))}</span>
      <span class="sec-chip-meta">${esc([s.instructor, s.room, s.modality].filter(Boolean).join(" · ") || "no details")}</span>
      ${badge}
    </div>`;
  }

  function renderTray(perSection) {
    const list = $("tray-list");
    const unsched = state.sections.filter((s) => s.term === state.term && !s.blockId);
    if (!unsched.length) { list.innerHTML = `<p class="tray-empty">Everything is scheduled. 🎉</p>`; return; }
    list.innerHTML = unsched.map((s) => sectionChip(s, perSection)).join("");
    wireChips();
  }

  function wireChips() {
    document.querySelectorAll(".sec-chip").forEach((chip) => {
      chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", chip.dataset.id);
        e.dataTransfer.effectAllowed = "move";
      });
      chip.addEventListener("click", () => openSectionDialog(chip.dataset.id));
    });
  }

  function renderConflictBanner() {
    const { conflicts } = computeConflicts();
    const banner = $("conflict-banner");
    if (!conflicts.length) {
      banner.className = "conflict-banner ok";
      banner.innerHTML = `✓ No conflicts in ${termName(state.term)}.`;
      banner.classList.remove("hidden");
      return;
    }
    // dedupe identical details
    const seen = new Set();
    const lines = conflicts.filter((c) => { const k = c.kind + c.detail; if (seen.has(k)) return false; seen.add(k); return true; })
      .map((c) => `<li class="cf-${c.kind}">${esc(c.detail)}</li>`).join("");
    banner.className = "conflict-banner bad";
    banner.innerHTML = `<strong>${seen.size} conflict${seen.size === 1 ? "" : "s"} in ${termName(state.term)}:</strong><ul>${lines}</ul>`;
    banner.classList.remove("hidden");
  }

  function renderChangeLog() {
    const list = $("change-list");
    if (!state.changes.length) { list.innerHTML = `<li class="cl-empty">No changes logged yet.</li>`; return; }
    list.innerHTML = state.changes.slice().reverse().map((c) =>
      `<li class="cl-item">
        <span class="cl-stage cl-${c.stage.replace(/[^a-z]/gi,'').toLowerCase()}">${esc(c.stage)}</span>
        <span class="cl-text">${esc(c.text)}</span>
        <span class="cl-date">${esc(c.date)}</span>
        <button class="cl-del" data-id="${c.id}" title="Remove" aria-label="Remove">&times;</button>
      </li>`).join("");
    list.querySelectorAll(".cl-del").forEach((b) => b.addEventListener("click", () => {
      state.changes = state.changes.filter((x) => x.id !== b.dataset.id); render();
    }));
  }

  // ========================================================================
  // SECTION EDITOR
  // ========================================================================
  function openSectionDialog(id) {
    const s = id ? state.sections.find((x) => x.id === id) : null;
    const isNew = !s;
    const draft = s || { id: newId(), code: "", section: "", instructor: "", room: "", modality: MODALITIES[0], blockId: null, term: state.term };
    $("sec-title").textContent = isNew ? "Add a section" : `${label(draft)}`;
    const courseOpts = `<option value="">— choose a course —</option>` +
      Object.keys(COURSES).sort().map((c) => `<option value="${c}"${c === draft.code ? " selected" : ""}>${c} — ${esc(COURSES[c].title)}</option>`).join("");
    const modOpts = MODALITIES.map((m) => `<option value="${m}"${m === draft.modality ? " selected" : ""}>${m}</option>`).join("");
    $("sec-body").innerHTML =
      `<div class="sec-form">
        <label>Course <select id="f-code">${courseOpts}</select></label>
        <label>Section # <input id="f-section" type="text" value="${esc(draft.section)}" placeholder="01" /></label>
        <label>Instructor <input id="f-instructor" type="text" value="${esc(draft.instructor)}" placeholder="Last name" /></label>
        <label>Room <input id="f-room" type="text" value="${esc(draft.room)}" placeholder="e.g. FAC 200, or 'Online'" /></label>
        <label>Modality <select id="f-modality">${modOpts}</select></label>
        <div class="sec-form-actions">
          ${isNew ? "" : `<button class="btn ghost danger" id="f-delete">Delete section</button>`}
          <span style="flex:1"></span>
          <button class="btn ghost" id="f-cancel">Cancel</button>
          <button class="btn" id="f-save">${isNew ? "Add" : "Save"}</button>
        </div>
      </div>`;
    showDialog("sec");

    $("f-save").addEventListener("click", () => {
      draft.code = $("f-code").value;
      if (!draft.code) { $("f-code").focus(); return; }
      draft.section = $("f-section").value.trim();
      draft.instructor = $("f-instructor").value.trim();
      draft.room = $("f-room").value.trim();
      draft.modality = $("f-modality").value;
      draft.term = state.term;
      if (isNew) state.sections.push(draft);
      closeDialog("sec"); render();
    });
    $("f-cancel").addEventListener("click", () => closeDialog("sec"));
    const del = $("f-delete");
    if (del) del.addEventListener("click", () => {
      state.sections = state.sections.filter((x) => x.id !== draft.id);
      closeDialog("sec"); render();
    });
  }

  // ========================================================================
  // EXPORT / IMPORT
  // ========================================================================
  function openIO(mode) {
    $("io-title").textContent = mode === "import" ? "Import" : "Export";
    if (mode === "export") {
      const csv = sectionsToCsv();
      const json = JSON.stringify(state, null, 2);
      $("io-body").innerHTML =
        `<p class="help">Copy the CSV for a spreadsheet, or the JSON to back up / move the whole workspace (sections, changes, everything).</p>
         <h4>Sections (CSV)</h4>
         <textarea class="code-box" rows="6" readonly>${esc(csv)}</textarea>
         <h4 style="margin-top:12px">Full workspace (JSON)</h4>
         <textarea class="code-box" rows="6" readonly>${esc(json)}</textarea>
         <div class="io-actions"><button class="btn" id="io-dl-csv">Download CSV</button>
         <button class="btn ghost" id="io-dl-json">Download JSON</button></div>`;
      $("io-dl-csv").addEventListener("click", () => download("rotation-sections.csv", csv, "text/csv"));
      $("io-dl-json").addEventListener("click", () => download("rotation-workspace.json", json, "application/json"));
    } else {
      $("io-body").innerHTML =
        `<p class="help">Paste a previously exported <strong>JSON workspace</strong> to restore it. This replaces the current workspace.</p>
         <textarea id="io-in" class="code-box" rows="10" placeholder="Paste JSON here…"></textarea>
         <p id="io-err" class="gate-error hidden">That didn't parse as a valid workspace.</p>
         <div class="io-actions"><button class="btn ghost" id="io-cancel">Cancel</button>
         <button class="btn" id="io-load">Load</button></div>`;
      $("io-cancel").addEventListener("click", () => closeDialog("io"));
      $("io-load").addEventListener("click", () => {
        try {
          const obj = JSON.parse($("io-in").value);
          if (!obj || !Array.isArray(obj.sections)) throw new Error("bad");
          Object.assign(state, { term: obj.term || state.term, sections: obj.sections, changes: obj.changes || [], seq: obj.seq || 1 });
          closeDialog("io"); render();
        } catch (e) { $("io-err").classList.remove("hidden"); }
      });
    }
    showDialog("io");
  }

  function sectionsToCsv() {
    const head = ["Term", "Course", "Title", "Section", "Instructor", "Room", "Modality", "MeetingBlock", "Days", "Time"];
    const rows = state.sections.filter((s) => s.term === state.term).map((s) => {
      const b = blockById(s.blockId);
      const title = COURSES[s.code] ? COURSES[s.code].title : "";
      const days = b ? b.days.join("") : "";
      const time = b ? (fmt(b.start) + "–" + fmt(b.end)) : "";
      return [termName(s.term), s.code, title, s.section, s.instructor, s.room, s.modality, b ? b.label : "(unscheduled)", days, time]
        .map(csvCell).join(",");
    });
    return [head.join(","), ...rows].join("\n");
  }
  function csvCell(v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function fmt(m) { let h = Math.floor(m / 60), mm = m % 60; const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12; return h + ":" + String(mm).padStart(2, "0") + ap; }
  function download(name, text, type) {
    const blob = new Blob([text], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  // ---- helpers ----
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function termName(id) { const t = TERMS.find((x) => x.id === id); return t ? t.label : id; }
  function showDialog(p) { $(p + "-backdrop").classList.remove("hidden"); $(p + "-dialog").classList.remove("hidden"); }
  function closeDialog(p) { $(p + "-backdrop").classList.add("hidden"); $(p + "-dialog").classList.add("hidden"); }

  // ========================================================================
  // INIT
  // ========================================================================
  function bind() {
    $("btn-add-section").addEventListener("click", () => openSectionDialog(null));
    $("btn-export").addEventListener("click", () => openIO("export"));
    $("btn-import").addEventListener("click", () => openIO("import"));
    $("sec-close").addEventListener("click", () => closeDialog("sec"));
    $("sec-backdrop").addEventListener("click", () => closeDialog("sec"));
    $("io-close").addEventListener("click", () => closeDialog("io"));
    $("io-backdrop").addEventListener("click", () => closeDialog("io"));
    $("change-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const text = $("change-text").value.trim();
      if (!text) return;
      state.changes.push({ id: newId("c"), text, stage: $("change-stage").value, date: new Date().toISOString().slice(0, 10) });
      $("change-text").value = "";
      render();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      closeDialog("sec"); closeDialog("io");
    });
  }

  function startApp() {
    $("gate").classList.add("hidden");
    $("admin-app").classList.remove("hidden");
    load();
    bind();
    render();
    // Reflect where the course list came from once the live sheet resolves.
    const srcEl = $("admin-source");
    const n = Object.keys(COURSES).length;
    srcEl.textContent = `Course list: ${n} courses loaded.`;
    if (window.PLANNER_LIVE_READY) {
      window.PLANNER_LIVE_READY.then((status) => {
        const n2 = Object.keys(COURSES).length;
        srcEl.textContent = status && status.live
          ? `Course list: ${n2} courses — live from the department rotation sheet.`
          : `Course list: ${n2} courses — built-in copy (live sheet not reachable).`;
        render(); // course list may have changed
      }).catch(() => {});
    }
  }

  function initGate() {
    const gate = $("gate");
    if (sessionStorage.getItem(GATE_KEY) === "1") { startApp(); return; }
    $("gate-form").addEventListener("submit", (e) => {
      e.preventDefault();
      if ($("gate-input").value.trim() === GATE_PASSPHRASE) {
        try { sessionStorage.setItem(GATE_KEY, "1"); } catch (e2) {}
        startApp();
      } else {
        $("gate-error").classList.remove("hidden");
        $("gate-input").value = "";
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initGate);
  else initGate();
})();
