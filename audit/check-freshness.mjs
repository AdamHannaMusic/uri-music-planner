#!/usr/bin/env node
/*
 * Freshness checker for the URI Music planner.
 * ============================================
 * Reads freshness-manifest.json, fetches each external dependency, and flags:
 *   - DEAD    : the URL no longer responds OK (likely moved/removed)
 *   - MARKER  : the page no longer contains an expected text marker
 *               (a sign it was restructured — the data we derived may be stale)
 *   - CHANGED : (for trackContentHash items) the content changed since the last
 *               run — informational; expected for the rotation sheet, worth a
 *               look for policy pages
 *   - OK      : responded fine and markers still present
 *
 * It NEVER edits the planner's data. It prints a report and writes two files:
 *   freshness-report.md    human-readable findings (used by the GitHub Action)
 *   freshness-state.json   a baseline of content hashes for next-run diffing
 *
 * Usage:
 *   node check-freshness.mjs            # check + print + write report
 *   node check-freshness.mjs --quiet    # write files, minimal stdout
 *
 * Exit code: 0 if nothing needs attention, 1 if any DEAD/MARKER issues
 * (so the CI/Action can decide whether to open an issue).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST = path.join(HERE, "freshness-manifest.json");
const STATE = path.join(HERE, "freshness-state.json");
const REPORT = path.join(HERE, "freshness-report.md");
const QUIET = process.argv.includes("--quiet");

function log(...a) { if (!QUIET) console.log(...a); }

function sha(s) { return crypto.createHash("sha256").update(s).digest("hex").slice(0, 16); }

async function fetchText(url, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "User-Agent": "uri-music-planner-freshness-check" },
    });
    const text = res.headers.get("content-type")?.includes("application/pdf")
      ? "" // don't hash PDF bytes as text; status is what matters for PDFs
      : await res.text().catch(() => "");
    return { status: res.status, ok: res.ok, text, finalUrl: res.url };
  } catch (e) {
    return { status: 0, ok: false, text: "", error: String(e && e.message || e) };
  } finally {
    clearTimeout(to);
  }
}

async function main() {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  let state = {};
  try { state = JSON.parse(fs.readFileSync(STATE, "utf8")); } catch (e) { state = {}; }
  const nextState = {};

  const results = [];
  for (const dep of manifest.dependencies) {
    log(`Checking ${dep.id} … ${dep.url}`);
    const r = await fetchText(dep.url);
    const issues = [];

    // 1) reachable?
    if (!r.ok || r.status === 0) {
      issues.push({ level: "DEAD", msg: `No OK response (status ${r.status}${r.error ? ", " + r.error : ""}).` });
    }

    // 2) expected markers present? (skip for hostOnly / PDF / failed fetch)
    if (r.ok && !dep.hostOnly && Array.isArray(dep.watch) && r.text) {
      const missing = dep.watch.filter((w) => !r.text.includes(w));
      if (missing.length) {
        issues.push({ level: "MARKER", msg: `Missing expected text: ${missing.map((m) => JSON.stringify(m)).join(", ")}. Page may have been restructured.` });
      }
    }

    // 3) content drift (informational) for tracked items
    let changed = false;
    if (dep.trackContentHash && r.ok && r.text) {
      const h = sha(r.text.replace(/\s+/g, " ").trim());
      nextState[dep.id] = h;
      const prev = state[dep.id];
      if (prev && prev !== h) { changed = true; issues.push({ level: "CHANGED", msg: "Content changed since the last check." }); }
      else if (!prev) { /* first time — record baseline, no flag */ }
    }

    results.push({ dep, status: r.status, issues, changed });
  }

  // Write the new baseline (merge: keep hashes we didn't recompute).
  const merged = { ...state, ...nextState };
  fs.writeFileSync(STATE, JSON.stringify(merged, null, 2) + "\n");

  // Build report
  const needsAttention = results.filter((x) => x.issues.some((i) => i.level === "DEAD" || i.level === "MARKER"));
  const changedOnly = results.filter((x) => x.issues.length && !x.issues.some((i) => i.level === "DEAD" || i.level === "MARKER"));
  const clean = results.filter((x) => !x.issues.length);

  const now = new Date().toISOString().slice(0, 10);
  let md = `# URI Music planner — freshness check (${now})\n\n`;
  md += `Automated check of the external URI sources the planner depends on. `;
  md += `**This flags items to review — it does not change any data.** Verify each flagged item on URI's site and update the noted file.\n\n`;

  if (needsAttention.length) {
    md += `## ⚠ Needs attention (${needsAttention.length})\n\n`;
    for (const x of needsAttention) {
      md += `### ${x.dep.label}\n`;
      md += `- **ID:** \`${x.dep.id}\` · **URL:** ${x.dep.url}\n`;
      x.issues.forEach((i) => { md += `- **${i.level}:** ${i.msg}\n`; });
      if (x.dep.note) md += `- **What to do:** ${x.dep.note}\n`;
      md += `\n`;
    }
  } else {
    md += `## ✓ No dead links or restructured pages detected\n\n`;
  }

  if (changedOnly.length) {
    md += `## ℹ Content changed (informational — review if it's a policy page)\n\n`;
    for (const x of changedOnly) {
      md += `- **${x.dep.label}** (\`${x.dep.id}\`) changed since last check. ${x.dep.note || ""}\n`;
    }
    md += `\n`;
  }

  md += `## Checked OK (${clean.length})\n\n`;
  clean.forEach((x) => { md += `- ${x.dep.label} (\`${x.dep.id}\`)\n`; });
  md += `\n---\n_Generated by site/audit/check-freshness.mjs. Add or edit watched items in freshness-manifest.json._\n`;

  fs.writeFileSync(REPORT, md);

  // stdout summary
  console.log(`\nFreshness check complete: ${needsAttention.length} need attention, ${changedOnly.length} changed, ${clean.length} OK.`);
  if (needsAttention.length) {
    console.log("Items needing attention:");
    needsAttention.forEach((x) => console.log(`  - [${x.issues.map((i) => i.level).join("/")}] ${x.dep.id}: ${x.dep.label}`));
  }
  console.log(`Report written to ${path.relative(process.cwd(), REPORT)}`);

  process.exit(needsAttention.length ? 1 : 0);
}

main().catch((e) => { console.error("Freshness check failed:", e); process.exit(2); });
