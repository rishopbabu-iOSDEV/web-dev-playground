// js/resume.js: one page, one set of render functions, two data sources (Module 9).
const AWARDS_LIMIT = 5;
let awardsPage = 1;
const state = { resume: null, live: false };

function setStatus(id, text) {
  const node = document.querySelector("#" + id);
  if (node) node.textContent = text;
}

// Create an element whose content is TEXT, never markup (the XSS fix).
function el(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

/* ---------- where the data comes from ---------- */
async function loadResumeData() {
  if (SOURCE === "api") {
    try {
      // 3 seconds, not 8: locally the API answers in milliseconds. Slow means stopped.
      return { resume: await getJSON(`${API_BASE}/api/resume`, 3000), live: true };
    } catch (error) {
      console.warn("API unavailable; using the snapshot.", error); // inner catch: API down -> fall back
    }
  }
  return { resume: await getJSON("data/resume.json"), live: false };
}

function renderSource({ resume, live }) {
  // T00:00:00 (Module 2's trick): no UTC midnight, no off-by-one day.
  const generated = new Date(resume.generated_at + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  setStatus("data-source", live ? "Live from the Future Portfolio API" : `Published snapshot, updated ${generated}`);
}

/* ---------- renderers: every value from data goes through textContent ---------- */
function renderProfile(profile) {
  setStatus("profile-name", profile.full_name);
  setStatus("profile-headline", profile.headline);
}

function renderExperience(roles) {
  const list = document.querySelector("#experience");
  list.replaceChildren(...roles.map((role) => {
    const item = el("li");
    item.append(el("strong", role.role), el("span", ` at ${role.company} (${role.start_date} to ${role.end_date || "now"})`));
    return item;
  }));
}

function renderProjects(projects) {
  const list = document.querySelector("#projects");
  list.replaceChildren(...projects.map((project) => {
    const item = el("li");
    item.append(el("strong", project.project), el("span", ` (${project.role}, ${project.company})`)); // a template literal inside el() is safe
    const tags = el("ul", null, "tags");
    tags.append(...project.skills.map((skill) => el("li", skill, "tag")));
    item.append(tags);
    return item;
  }));
}

function renderAwards(awards) {
  const list = document.querySelector("#awards");
  list.replaceChildren(...awards.map((award) => {
    const item = el("li");
    item.append(el("strong", award.award), el("span", ` (${award.year}, ${award.category})`));
    return item;
  }));
}

/* ---------- one function, two sources: { items, total } either way ---------- */
async function fetchAwards({ category, page, limit }) {
  if (state.live) {
    const params = new URLSearchParams({ page, limit });
    if (category) params.set("category", category);
    const response = await getResponse(`${API_BASE}/api/awards?${params}`);
    return {
      items: await response.json(),
      total: Number(response.headers.get("X-Total-Count")), // readable only because Module 8 exposed it
    };
  }
  const matching = state.resume.awards.filter((award) => !category || award.category === category);
  return { items: matching.slice((page - 1) * limit, page * limit), total: matching.length };
}

async function loadAwards() {
  const category = new URLSearchParams(window.location.search).get("category");
  setStatus("awards-status", "Loading awards…");
  try {
    const { items, total } = await fetchAwards({ category, page: awardsPage, limit: AWARDS_LIMIT });
    const pages = Math.max(1, Math.ceil(total / AWARDS_LIMIT));
    renderAwards(items);
    setStatus("awards-pager", `Page ${awardsPage} of ${pages} (${total} awards)`);
    const prev = document.querySelector("#awards-prev"), next = document.querySelector("#awards-next");
    if (prev) prev.disabled = awardsPage <= 1;
    if (next) next.disabled = awardsPage >= pages;
    setStatus("awards-status", total === 0 ? "No awards in this category yet." : "");
  } catch (error) {
    setStatus("awards-status", error.code === "invalid_input" ? "That isn't one of the award categories." : messageFor(error));
  }
}

async function loadResume() {
  setStatus("resume-status", "Loading the resume…");
  try {
    Object.assign(state, await loadResumeData()); // outer catch: even the snapshot failed -> show it
    renderSource(state);
    renderProfile(state.resume.profile);
    renderExperience(state.resume.experience);
    renderProjects(state.resume.projects);
    await loadAwards();
    setStatus("resume-status", "");
  } catch (error) {
    setStatus("resume-status", messageFor(error));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelector("#awards-prev")?.addEventListener("click", () => { awardsPage -= 1; loadAwards(); });
  document.querySelector("#awards-next")?.addEventListener("click", () => { awardsPage += 1; loadAwards(); });
  loadResume();
});
