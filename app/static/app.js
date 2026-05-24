// Switchback plan generator — client-side controller.
//
// Two modes:
//   - "live": form posts to /api/plan and /api/workout.fit (needs FastAPI backend)
//   - "demo": serves a baked sample plan, no backend required. Activated by
//     adding ?demo=1 to the URL, or automatically when the page is opened
//     from a static host (no /api/healthz endpoint).

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" };

const $ = (sel) => document.querySelector(sel);
const els = {
  form: $("#plan-form"),
  submit: $("#submit-btn"),
  demoBtn: $("#demo-btn"),
  empty: $("#empty-state"),
  loading: $("#loading-state"),
  plan: $("#plan"),
  error: $("#form-error"),
  modePill: $("#mode-pill"),
};

let mode = "live";

async function detectMode() {
  const params = new URLSearchParams(location.search);
  if (params.has("demo")) return setMode("demo");
  try {
    const r = await fetch("/healthz", { method: "GET" });
    if (r.ok) return setMode("live");
  } catch (_) { /* ignore */ }
  return setMode("demo");
}

function setMode(m) {
  mode = m;
  if (m === "demo") {
    els.modePill.hidden = false;
    els.modePill.textContent = "demo mode";
  }
  return m;
}

function showError(msg) {
  els.error.hidden = false;
  els.error.textContent = msg;
}
function clearError() {
  els.error.hidden = true;
  els.error.textContent = "";
}

function setBusy(busy) {
  els.submit.disabled = busy;
  els.submit.querySelector(".btn-label").textContent = busy ? "Drafting…" : "Generate plan";
  els.loading.hidden = !busy;
  if (busy) {
    els.empty.hidden = true;
    els.plan.hidden = true;
    els.plan.innerHTML = "";
  }
}

async function loadSample() {
  // Relative to this module so it resolves both behind FastAPI and on
  // static hosts (raw.githack, GitHub Pages, etc.).
  const url = new URL("sample-plan.json", import.meta.url);
  const r = await fetch(url);
  if (!r.ok) throw new Error("Couldn't load sample plan.");
  return r.json();
}

async function generatePlan(payload) {
  if (mode === "demo") {
    await new Promise((r) => setTimeout(r, 800));
    return loadSample();
  }
  const r = await fetch("/api/plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.detail || `Request failed (${r.status})`);
  }
  return r.json();
}

async function downloadFit(workout, btn) {
  if (mode === "demo") {
    showError(".FIT download requires the backend. Run the server locally or deploy to test downloads.");
    return;
  }
  btn.disabled = true;
  const label = btn.textContent;
  btn.textContent = "…";
  try {
    const r = await fetch("/api/workout.fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workout }),
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      throw new Error(err.detail || `Failed (${r.status})`);
    }
    const blob = await r.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${workout.name.replace(/[^a-z0-9_-]+/gi, "_")}.fit`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (e) {
    showError(`.FIT export failed: ${e.message}`);
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
}

// --- Rendering -------------------------------------------------------------

function el(tag, props = {}, ...kids) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "html") node.innerHTML = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else if (v === false || v == null) continue;
    else node.setAttribute(k, v);
  }
  for (const kid of kids.flat()) {
    if (kid == null || kid === false) continue;
    if (kid instanceof Node) node.appendChild(kid);
    else node.appendChild(document.createTextNode(String(kid)));
  }
  return node;
}

function renderWorkout(w) {
  const isRest = w.type === "rest";
  const stats = [];
  if (w.duration_min > 0) stats.push(`${w.duration_min} min`);
  if (w.distance_km) stats.push(`${w.distance_km} km`);

  return el(
    "div",
    { class: `workout ${isRest ? "is-rest" : ""}` },
    el("div", { class: "workout-day" }, DAY_LABELS[w.day] || w.day),
    el(
      "div",
      { class: "workout-body" },
      el(
        "div",
        { class: "workout-title" },
        el("span", { class: "workout-name" }, w.name),
        stats.length > 0
          ? el("span", { class: "workout-stats" }, stats.join(" · "))
          : null,
        isRest
          ? null
          : el(
              "span",
              { class: `intensity-chip intensity-${w.intensity}` },
              w.intensity,
            ),
      ),
      el("div", { class: "workout-desc" }, w.description),
    ),
    isRest
      ? null
      : el(
          "button",
          {
            class: "fit-btn",
            type: "button",
            onclick: (e) => downloadFit(w, e.currentTarget),
            title: "Download as Garmin .FIT workout",
          },
          ".FIT",
        ),
  );
}

function renderWeek(week) {
  const ordered = [...week.workouts].sort(
    (a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day),
  );
  return el(
    "section",
    { class: "week" },
    el(
      "header",
      { class: "week-header" },
      el(
        "h3",
        { class: "week-title" },
        `Week ${week.week_num}`,
        el("small", {}, week.phase.replace("_", " ")),
      ),
      el("div", { class: "week-stats" }, el("strong", {}, `${week.total_km} km`)),
    ),
    el("div", { class: "week-focus" }, week.focus),
    el("div", { class: "workouts" }, ...ordered.map(renderWorkout)),
  );
}

function renderPlan(plan) {
  els.plan.innerHTML = "";
  els.empty.hidden = true;
  els.loading.hidden = true;
  els.plan.hidden = false;

  const stats = [
    el("span", {}, el("strong", {}, plan.total_weeks), " weeks"),
  ];
  if (plan.race_date) stats.push(el("span", {}, "race: ", el("strong", {}, plan.race_date)));

  els.plan.appendChild(
    el(
      "div",
      { class: "plan-meta" },
      el("h2", { class: "plan-goal" }, plan.goal),
      el("div", { class: "plan-stats" }, ...stats),
    ),
  );
  for (const w of plan.weeks) els.plan.appendChild(renderWeek(w));
  if (plan.notes) {
    els.plan.appendChild(el("div", { class: "plan-notes" }, plan.notes));
  }
}

// --- Form handling ---------------------------------------------------------

function readForm() {
  const data = new FormData(els.form);
  const num = (k) => {
    const v = data.get(k);
    return v === "" || v == null ? null : Number(v);
  };
  const str = (k) => {
    const v = data.get(k);
    return v === "" || v == null ? null : String(v);
  };
  return {
    goal_description: str("goal_description") || "",
    race_date: str("race_date"),
    weeks_until_race: num("weeks_until_race"),
    weekly_km: num("weekly_km"),
    longest_run_km: num("longest_run_km"),
  };
}

els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();
  const payload = readForm();
  if (!payload.goal_description.trim()) {
    showError("Describe your goal — even a short sentence helps.");
    return;
  }
  setBusy(true);
  try {
    const plan = await generatePlan(payload);
    renderPlan(plan);
  } catch (err) {
    showError(err.message);
    els.empty.hidden = false;
  } finally {
    setBusy(false);
  }
});

els.demoBtn.addEventListener("click", async () => {
  clearError();
  setBusy(true);
  try {
    const plan = await loadSample();
    renderPlan(plan);
  } catch (err) {
    showError(err.message);
    els.empty.hidden = false;
  } finally {
    setBusy(false);
  }
});

detectMode();
