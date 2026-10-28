# Deploying the planner for free (GitHub Pages) — step by step

This gets your planner onto a real `https://...` web address, for free, under
**your own personal account** so it stays yours regardless of URI. Plan on about
15 minutes the first time. You do not need to be technical — just follow along.

Everything you publish lives in THIS `site/` folder. The PDFs, spreadsheets, and
other source material one level up are NOT published.

---

## Part 1 — One-time setup

### 1. Make a free GitHub account (if you don't have one)
- Go to https://github.com and sign up with a **personal** email (not your URI
  email, so you keep it if you ever leave URI).
- Pick a username you're happy with — it becomes part of your web address, e.g.
  username `amhanna` → site at `https://amhanna.github.io/...`.

### 2. Create a new repository
- Click the **+** (top right) → **New repository**.
- Repository name: `uri-music-planner`
- Set it to **Public** (required for free GitHub Pages).
- Do NOT check "Add a README" (this folder already has one).
- Click **Create repository**. Leave that page open — you'll need the commands it shows.

---

## Part 2 — Upload the site

You have two ways. **Option A (drag-and-drop) is easiest and needs no commands.**

### Option A — Upload in the browser (no command line)
1. On your new empty repository page, click **"uploading an existing file"**
   (it's a link in the middle of the page).
2. Open this `site/` folder on your computer, select ALL the files inside it
   (index.html, styles.css, the `.js` files, README.md), and drag them into the
   browser upload box.
3. At the bottom, click **Commit changes**.

### Option B — Command line (if you prefer)
Open Terminal, then run these one at a time. Replace `YOURNAME` with your GitHub
username.

```
cd "/Users/adam.hanna/Desktop/Degree Worksheet Project with Kiro/site"
git init
git add .
git commit -m "Initial deploy of URI Music planner"
git branch -M main
git remote add origin https://github.com/YOURNAME/uri-music-planner.git
git push -u origin main
```
(The first push will ask you to sign in to GitHub in your browser.)

---

## Part 3 — Turn on the website

1. In your repository, click **Settings** (top menu).
2. In the left sidebar, click **Pages**.
3. Under "Build and deployment" → "Source", choose **Deploy from a branch**.
4. Branch: pick **main** and folder **/ (root)**. Click **Save**.
5. Wait ~1–2 minutes. The page will show your live URL, something like:
   **`https://YOURNAME.github.io/uri-music-planner/`**

That link is your planner. Share it with advisors. It works on any device.

---

## Updating the site later

- The course rotation and catalog text update **automatically** from the Google
  Sheet and URI catalog — you don't touch GitHub for those.
- Only if a `.js` data file changes (e.g. yearly Gen Ed list) do you re-upload:
  repeat Part 2 Option A with the changed file(s), or run:
  ```
  git add . && git commit -m "Update data" && git push
  ```

---

## Keeping ownership

Because the repository is under your personal GitHub account, you own it. If you
ever buy a domain (e.g. `urimusicplanner.com`), it can be pointed at this same
site in GitHub Pages → Settings → Pages → Custom domain. Nothing about the app
changes.

---

## The advisor workflow (pilot)

No logins exist yet — the **save code is the plan**. Recommended process:
1. Advisor opens the site, builds/edits a plan with the student.
2. Click **Save / get my code**, copy the code.
3. Keep a simple tracking spreadsheet: one row per student with Name, Code, Term.
   That spreadsheet is your record of who has which plan.
4. When the student returns, paste their code into **Load a code**, make changes,
   Save, and update the code in your tracking sheet.

This lets you (or advisors) reopen and fix any student's plan, without students
needing to hang onto anything. If you later want true student logins (plans
saved to an account, reachable from any device), that's a backend upgrade — ask
and it can be built on top of this without redoing the planner.
