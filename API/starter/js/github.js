// js/github.js: the GitHub card, through the proxy when the API is live (Module 9).
const GITHUB_MAX_AGE = 15 * 60 * 1000; // the page's own cache: 15 minutes, per browser

function cacheRead(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function cacheWrite(key, data) {
  try { localStorage.setItem(key, JSON.stringify({ at: Date.now(), data })); } catch { /* storage full or blocked */ }
}
const isFresh = (saved, maxAge) => saved && Date.now() - saved.at < maxAge;

// An adapter: two shapes in (our proxy, GitHub's own), one shape out. Like fetchAwards.
function toCard(data) {
  return {
    name: data.name || data.login,
    login: data.login,
    repos: data.public_repos,
    url: data.url || data.html_url,
    recent: data.repos || [],
  };
}

function renderGitHubCard(card) {
  const box = document.querySelector("#github-card");
  if (!box) return;
  const links = card.recent.map((repo) => {
    const item = el("li");
    const link = el("a", repo.name); // repository names come from GitHub: render with el(), always
    link.href = repo.html_url;
    item.append(link);
    return item;
  });
  const list = el("ul");
  list.append(...links);
  box.replaceChildren(el("strong", card.name), el("span", ` (${card.repos} public repositories)`), list);
}

async function loadGitHubActivity() {
  const saved = cacheRead("github-card");
  if (isFresh(saved, GITHUB_MAX_AGE)) return renderGitHubCard(saved.data);
  // Live: the proxy first (token on the server), then GitHub directly. The card survives a stopped API.
  const sources = SOURCE === "api"
    ? [`${API_BASE}/api/github`, `https://api.github.com/users/${GITHUB_USER}`]
    : [`https://api.github.com/users/${GITHUB_USER}`];
  for (const url of sources) {
    try {
      const card = toCard(await getJSON(url, 5000));
      cacheWrite("github-card", card);
      return renderGitHubCard(card);
    } catch (error) {
      console.warn(`${url} failed`, error);
    }
  }
  if (saved) return renderGitHubCard(saved.data); // stale beats nothing
  setStatus("github-status", "GitHub activity isn't available right now.");
}

document.addEventListener("DOMContentLoaded", loadGitHubActivity);
