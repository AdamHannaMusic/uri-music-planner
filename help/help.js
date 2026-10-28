/*
 * URI Music Advising — Help assistant (ENGINE)
 * ============================================
 * A self-contained chat helper. It matches a student's question to the vetted
 * knowledge base (help-data.js) and replies with a concise answer + the
 * official URI link(s). It never invents answers and always points to an
 * authoritative source; uncertain questions get a "check with your advisor"
 * fallback. No network calls, no AI service — everything runs in the browser.
 *
 * Exposes window.initHelpAssistant(), called by app.js after the page loads.
 */
(function () {
  "use strict";

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  // Tiny stopword list so matching focuses on meaningful words.
  const STOP = new Set((
    "a an the is are do does did how what when where which who whom i my me " +
    "to of for in on at and or if can could should would will my mine you your " +
    "it this that with about need do get take takes have has am"
  ).split(/\s+/));

  // Light stemmer so plurals/variants match: juries->jury, recitals->recital,
  // credits->credit, ensembles->ensemble, classes->class.
  function stem(w) {
    if (w.length <= 3) return w;
    if (w.endsWith("ies")) return w.slice(0, -3) + "y";   // juries -> jury
    if (w.endsWith("ses")) return w.slice(0, -2);          // classes -> class
    if (w.endsWith("es") && w.length > 4) return w.slice(0, -2); // courses -> cours(e)
    if (w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1); // credits -> credit
    return w;
  }

  function tokenize(s) {
    return (s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
      .filter((w) => w && !STOP.has(w))
      .map(stem));
  }

  // Inverse-document-frequency weights: a word that appears in few FAQs is more
  // distinctive (e.g. "transfer", "probation", "19") than a common one
  // ("credit", "course", "music"). Computed once, lazily, over all FAQs.
  // The QUESTION text is weighted more heavily than the answer, since the
  // question is the best signal of what a FAQ is about.
  let IDF = null, FAQ_INDEX = null;
  function buildIndex(faqs) {
    const df = {};               // document frequency per word
    FAQ_INDEX = faqs.map((f) => {
      const qw = tokenize(f.q);
      const aw = tokenize(f.a);
      const weight = {};         // word -> term weight within this FAQ
      qw.forEach((w) => (weight[w] = (weight[w] || 0) + 3)); // question words count triple
      aw.forEach((w) => (weight[w] = (weight[w] || 0) + 1));
      Object.keys(weight).forEach((w) => (df[w] = (df[w] || 0) + 1));
      return { f, weight };
    });
    const N = faqs.length;
    IDF = {};
    Object.keys(df).forEach((w) => { IDF[w] = Math.log(1 + N / df[w]); });
  }

  function bestMatches(HELP, query, n) {
    if (!FAQ_INDEX) buildIndex(HELP.HELP_FAQS);
    const qWords = tokenize(query);
    if (!qWords.length) return [];

    const scored = FAQ_INDEX.map(({ f, weight }) => {
      let s = 0;
      qWords.forEach((w) => {
        const idf = IDF[w] || Math.log(1 + HELP.HELP_FAQS.length); // unseen word = rare
        if (weight[w]) {
          s += weight[w] * idf;
        } else {
          // light stem match for plurals/variants, at reduced value
          for (const fw in weight) {
            if (fw.length > 4 && w.length > 4 && (fw.startsWith(w) || w.startsWith(fw))) {
              s += 0.5 * (weight[fw]) * (IDF[fw] || 1);
              break;
            }
          }
        }
      });
      return { f, s };
    }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s);

    return scored.slice(0, n).map((x) => x.f);
  }

  // ---- Computed answers (degree-specific, from the planner's own data) ----
  // For "how many / which" questions, we read the selected degree's actual
  // requirements and state the real number, then link the source. This beats a
  // vague "it varies" pointer. If no degree is selected, we give a short
  // per-degree breakdown instead.

  // Pull the count/detail of a requirement group whose label matches a regex.
  function groupsMatching(groups, re) {
    return (groups || []).filter((g) => re.test(g.label) || (g.note && re.test(g.note)));
  }

  // Summarize a group into "N semester(s)" using choose/repeat counts.
  function groupCount(g) {
    let n = 0;
    (g.courses || []).forEach((item) => {
      if (item.choose) n += item.choose;
      else if (item.repeat) n += item.repeat;
      else n += 1;
    });
    return n;
  }

  const MUSIC_FORMS = { text: "Music Department — academics", url: "https://web.uri.edu/music/academics/" };
  const CATALOG = { text: "URI Catalog", url: "https://web.uri.edu/catalog/" };

  // Each computed intent: keywords to trigger it, and a builder(ctx) -> {html, links}.
  const COMPUTED = [
    {
      id: "major_ensemble",
      kw: ["ensemble", "ensembles", "major ensemble"],
      build(ctx) {
        const link = [MUSIC_FORMS];
        const eligible = ctx.majorEnsembles && ctx.majorEnsembles.length
          ? ctx.majorEnsembles.map((c) => c.replace("MUS ", "")).join(", ") : null;
        const eligNote = eligible ? ` Courses that currently count as a major ensemble: MUS ${eligible}.` : "";
        if (ctx.degreeName) {
          const gs = groupsMatching(ctx.groups, /ensemble/i);
          if (!gs.length) return { html: `For <strong>${esc(ctx.degreeName)}</strong>, see the ensemble requirement on your worksheet.`, links: link };
          const parts = gs.map((g) => {
            const n = groupCount(g);
            return `<strong>${esc(g.label)}</strong>${g.note ? " — " + esc(g.note) : ""}`;
          });
          return {
            html: `For <strong>${esc(ctx.degreeName)}</strong>: ${parts.join("; ")}.${eligNote}`,
            links: link,
          };
        }
        // no degree selected: per-degree breakdown of the main "Major Ensemble" group
        const rows = ctx.allDegrees.map((d) => {
          const g = (d.groups || []).find((g) => /major ensemble/i.test(g.label));
          if (!g) return null;
          return `${esc(d.name)}: ${esc(g.label.replace(/^Major Ensemble\s*/i, "").replace(/[()]/g, "") || "see worksheet")}`;
        }).filter(Boolean);
        return {
          html: "Major-ensemble requirements vary by degree. Pick your degree at the top for the exact number, or here's the rundown:<br>" +
            rows.map((r) => "• " + r).join("<br>") + eligNote,
          links: link,
        };
      },
    },
    {
      id: "applied",
      kw: ["applied", "lessons", "210", "410", "private lessons", "applied music"],
      build(ctx) {
        const link = [MUSIC_FORMS];
        if (ctx.degreeName) {
          const gs = groupsMatching(ctx.groups, /applied/i);
          if (!gs.length) return null;
          const parts = gs.map((g) => `<strong>${esc(g.label)}</strong>${g.note ? " — " + esc(g.note) : ""}`);
          return { html: `For <strong>${esc(ctx.degreeName)}</strong>: ${parts.join("; ")}. Applied lessons (MUS 210/410) are 2 credits each.`, links: link };
        }
        return null; // let FAQ handle the generic case
      },
    },
    {
      id: "convocation",
      kw: ["convocation", "mus 300", "300"],
      build(ctx) {
        const link = [MUSIC_FORMS];
        if (ctx.degreeName) {
          const gs = groupsMatching(ctx.groups, /convocation/i);
          if (!gs.length) return null;
          const g = gs[0];
          return { html: `For <strong>${esc(ctx.degreeName)}</strong>: ${esc(g.label)}${g.note ? " — " + esc(g.note) : ""} (MUS 300, 0 credits).`, links: link };
        }
        return null;
      },
    },
    {
      id: "recital",
      kw: ["recital", "recitals", "350", "450", "junior recital", "senior recital"],
      build(ctx) {
        const link = [{ text: "Music Department — Forms", url: "https://web.uri.edu/music/forms/" }];
        const base = "Most degrees require a Junior Recital (MUS 350) and a Senior Recital (MUS 450), both 0 credits. Performance degrees weight them most heavily; your worksheet shows which apply.";
        if (ctx.degreeName) {
          const has = groupsMatching(ctx.groups, /350|450|recital/i);
          return { html: `For <strong>${esc(ctx.degreeName)}</strong>: ${base}`, links: link };
        }
        return { html: base, links: link };
      },
    },
    {
      id: "total_credits",
      kw: ["total credits", "how many credits", "credits to graduate", "credits do i need", "degree credits"],
      build(ctx) {
        if (ctx.degreeName && ctx.credits) {
          return {
            html: `<strong>${esc(ctx.degreeName)}</strong> requires <strong>${ctx.credits} credits</strong> total (URI's minimum for a bachelor's is 120; some Music degrees require more). Confirm against your catalog year.`,
            links: [CATALOG, { text: "University Manual 8.2", url: "https://web.uri.edu/manual/chapter-8/chapter-8-2/" }],
          };
        }
        return null;
      },
    },
    {
      id: "upper_div",
      kw: ["upper division", "upper-division", "history course", "theory course", "upper div"],
      build(ctx) {
        const ud = ctx.upperDivision;
        if (!ud) return null;
        const hist = (ud.history || []).join(", ");
        const thy = (ud.theory || []).join(", ");
        return {
          html: `Approved <strong>upper-division History</strong> courses: ${esc(hist)}.<br>` +
            `Approved <strong>upper-division Theory</strong> courses: ${esc(thy)}.<br>` +
            `Your worksheet says how many of each your degree needs — use the "choose" button on those slots in the planner.`,
          links: [CATALOG],
        };
      },
    },
    {
      id: "piano_prof",
      kw: ["piano proficiency", "proficiency", "class piano", "171", "172", "271", "272", "keyboard"],
      build(ctx) {
        return {
          html: "Piano proficiency is met by passing MUS 171, 172, 271, and 272 — or, if placed at the 272 level, by passing all seven piano proficiency exams by the fall of your junior year.",
          links: [CATALOG, MUSIC_FORMS],
        };
      },
    },
  ];

  // Try to answer directly from planner data. Returns {html, links} or null.
  function computedAnswer(query) {
    const words = new Set(tokenize(query));
    const raw = query.toLowerCase();
    // find the best-matching intent by keyword hits
    let best = null, bestHits = 0;
    COMPUTED.forEach((intent) => {
      let hits = 0;
      intent.kw.forEach((k) => {
        if (k.includes(" ")) { if (raw.includes(k)) hits += 2; }
        else if (words.has(k) || words.has(stem(k))) hits += 1;
      });
      if (hits > bestHits) { bestHits = hits; best = intent; }
    });
    if (!best || bestHits === 0) return null;
    const ctx = (typeof window.getPlannerContext === "function") ? window.getPlannerContext() : {};
    try { return best.build(ctx); } catch (e) { return null; }
  }

  window.initHelpAssistant = function () {
    const HELP = window.PLANNER_HELP;
    const panel = document.getElementById("help-panel");
    const log = document.getElementById("help-log");
    const form = document.getElementById("help-form");
    const input = document.getElementById("help-input");
    const minBtn = document.getElementById("help-min");
    if (!HELP || !panel || !log || !form || !input) return;

    // The chat has no mascot images now; a reply's mood instead drives the
    // Maestro Rhody in the page banner (window.setBannerPose, defined in app.js).
    function setHeaderPose(pose) {
      if (typeof window.setBannerPose === "function") window.setBannerPose(pose, 3500);
    }

    function bubble(who, html, pose) {
      const b = document.createElement("div");
      b.className = "help-bubble " + who;
      b.innerHTML = html;
      log.appendChild(b);
      log.scrollTop = log.scrollHeight;
      if (who === "bot" && pose) setHeaderPose(pose);
      return b;
    }

    // Decide which pose fits a reply, based on the question + the answer links.
    function poseFor(query, links, isFallback) {
      if (isFallback) return "shrug";
      const q = query.toLowerCase();
      if (/graduat|on track|finish|credits? (do|to)|gpa|recital|convocation|celebrat|congrat/.test(q)) return "celebrate";
      if (/how many|which|requirement|ensemble|gen ed|general education|theory|history course|upper.?division|credits? (for|in)/.test(q)) return "teach";
      if (links && links.length) return "point"; // has an official source to point to
      return "explain";                          // general info reply
    }

    function linksHtml(links) {
      if (!links || !links.length) return "";
      return `<div class="help-links">` +
        links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener">${esc(l.text)} ↗</a>`).join("") +
        `</div>`;
    }

    function suggestionChips() {
      const wrap = document.createElement("div");
      wrap.className = "help-chips";
      HELP.HELP_SUGGESTED.forEach((q) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "help-chip";
        chip.textContent = q;
        chip.addEventListener("click", () => answer(q));
        wrap.appendChild(chip);
      });
      log.appendChild(wrap);
      log.scrollTop = log.scrollHeight;
    }

    function answer(query) {
      bubble("user", esc(query));
      // Let Maestro Rhody visibly "think" for a full beat (>= 5s) so the
      // thinking animation reads clearly, then deliver the answer with a pose
      // that matches its mood.
      setHeaderPose("think");
      const thinking = bubble("bot", "<span class=\"help-typing\">Maestro Rhody is thinking…</span>", "think");
      setTimeout(() => { thinking.remove(); deliver(query); }, 5000);
    }

    function deliver(query) {
      // 1) Try a direct, degree-specific answer computed from the planner's data.
      const computed = computedAnswer(query);
      if (computed && computed.html) {
        bubble("bot", computed.html + linksHtml(computed.links), poseFor(query, computed.links, false));
        return;
      }

      // 2) Otherwise fall back to the vetted FAQ knowledge base.
      const matches = bestMatches(HELP, query, 3);
      if (!matches.length) {
        bubble("bot", esc(HELP.HELP_FALLBACK.a) + linksHtml(HELP.HELP_FALLBACK.links), "shrug");
        return;
      }
      const top = matches[0];
      bubble("bot", esc(top.a) + linksHtml(top.links), poseFor(query, top.links, false));
      // Offer the next best as "related" so near-misses still help.
      const related = matches.slice(1);
      if (related.length) {
        const wrap = document.createElement("div");
        wrap.className = "help-related";
        wrap.innerHTML = `<span class="help-related-label">Related:</span>`;
        related.forEach((f) => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "help-chip sm";
          chip.textContent = f.q;
          chip.addEventListener("click", () => answer(f.q));
          wrap.appendChild(chip);
        });
        log.appendChild(wrap);
        log.scrollTop = log.scrollHeight;
      }
    }

    // --- initial open state with greeting + suggested questions ---
    bubble("bot",
      "🎵 Hi, I&rsquo;m <strong>Maestro Rhody</strong>, your URI Music advising assistant. " +
      "Ask me about courses, degree requirements, juries, recitals, Gen Ed, transfer credit, " +
      "ensembles, deadlines, graduation &mdash; and I&rsquo;ll give you a straight answer plus the " +
      "official URI page. I&rsquo;m a planning aid, not official advising, so always confirm with " +
      "your advisor.");
    const starter = document.createElement("p");
    starter.className = "help-starter-label";
    starter.textContent = "Try one of these:";
    log.appendChild(starter);
    suggestionChips();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = input.value.trim();
      if (!q) return;
      input.value = "";
      answer(q);
    });

    // Minimize / restore. The chat starts MINIMIZED (an inviting prompt bar);
    // clicking the header opens it, and the button toggles it closed again.
    const head = document.getElementById("help-head");
    function setMinimized(min) {
      panel.classList.toggle("minimized", min);
      if (minBtn) minBtn.textContent = min ? "▢" : "–";
      if (head) {
        head.setAttribute("aria-expanded", String(!min));
        head.setAttribute("aria-label", min ? "Open Maestro Rhody chat" : "Minimize Maestro Rhody chat");
      }
      // When opening, focus the input so students can type right away.
      if (!min && input) setTimeout(() => input.focus(), 50);
    }
    if (head) {
      head.addEventListener("click", () => setMinimized(!panel.classList.contains("minimized")));
    }
    // Reflect the initial (minimized) state.
    setMinimized(panel.classList.contains("minimized"));
  };
})();
