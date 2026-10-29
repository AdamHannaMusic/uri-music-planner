# Freshness auditor

Keeps the planner from silently going stale. It checks the external URI
sources the tool depends on and **flags items to review — it never edits the
planner's data.** A human (you, or Kiro in a working session) applies any
changes.

## What's here

- **`freshness-manifest.json`** — every external URI dependency (links, the
  rotation sheet, the catalog API, the standard meeting-time page, the majors
  list). Each entry says where it's used and what to do if it's flagged. *Add a
  dependency here when you add a new external URL to the app.*
- **`check-freshness.mjs`** — fetches each dependency and flags:
  - **DEAD** — the URL no longer responds OK (moved/removed)
  - **MARKER** — an expected bit of text is gone (page restructured)
  - **CHANGED** — tracked content changed since last run (informational;
    expected for the rotation sheet, worth a look for policy pages)
- **`freshness-state.json`** — content-hash baseline for change detection
  (committed so each run can diff against the last).
- **`freshness-report.md`** — the latest human-readable findings.

## Run it yourself anytime

```
cd site/audit
node check-freshness.mjs
```

Exit code is 0 if nothing needs attention, 1 if there are DEAD/MARKER issues.

## Automatic schedule

`site/.github/workflows/freshness.yml` runs the check near the start of each
semester (Jan 5, Jun 1, Sep 1) and on demand. When it finds DEAD/MARKER issues
it opens (or updates) a GitHub Issue labeled `freshness` with the report.

### One-time GitHub setup (needs the repo owner)

1. Repo **Settings → Actions → General → Workflow permissions** → choose
   **Read and write permissions** (lets the job commit the baseline and open
   issues). Save.
2. The schedule starts automatically. To test now: **Actions tab → "Semester
   freshness check" → Run workflow**.

When an issue appears, verify each flagged item on URI's site and update the
file named in the report (usually `site/data.js`). Then the next run goes
quiet again.
