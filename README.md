# URI Music Course Sequence Planner

A static web app that lets students (or advisors working with students) build a
term-by-term course plan for any URI Music degree, from the department's
recommended sequences and the live projected course rotation.

## What's in this folder

This folder (`site/`) is the complete, self-contained website. Nothing else is
needed to run it. The files:

| File | What it does |
|------|--------------|
| `index.html` | The page itself |
| `styles.css` | All styling / the compact layout |
| `app.js` | The planner logic (drag/drop, save codes, pickers) |
| `data.js` | Courses, degrees, term list, upper-division & major-ensemble fallbacks |
| `sequences.js` | Each degree's recommended 8-semester layout |
| `gened.js` | The Gen Ed course list (A1–D1, G) — yearly snapshot |
| `catalog.js` | Pulls official requirement text live from the URI catalog |
| `live-source.js` | Pulls the course rotation live from the department Google Sheet |

## How it stays up to date (no code changes needed)

- **Course rotation, titles, credits, major-ensemble flags** come live from the
  department's published Google Sheet (configured in `live-source.js`). Edit the
  sheet → the planner updates on next load.
- **Official degree requirement text** comes live from the URI catalog.
- If either source is unreachable, the planner falls back to built-in copies, so
  it never breaks.

Things that are yearly snapshots and need a manual refresh when they change:
- The **Gen Ed course list** (`gened.js`) — re-scrape when the approved list changes.
- The **recommended sequences** (`sequences.js`) — edit if the plan of study changes.

## Running it

It must be served over https:// (not opened as a file), because it fetches live
data. Any static host works. See `DEPLOY.md` for step-by-step hosting
instructions (free GitHub Pages pilot).

## Important

This is a planning aid, not an official degree audit. Students must verify every
requirement with their advisor and the Department of Music. Official requirements
live in the University Catalog.
