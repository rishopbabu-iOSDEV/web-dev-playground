// js/config.js: where does the data come from? (Module 9)
// Load this FIRST on every data page:  <script src="js/config.js" defer></script>
// "defer" runs scripts in order after the page is parsed, so these values exist when resume.js runs.
const API_BASE = "http://127.0.0.1:8000"; // deploy the API later? Change this ONE line.
const GITHUB_USER = "your-github-username"; // used by the snapshot-mode GitHub card

// Live Server serves the page from 127.0.0.1 (or localhost). Anywhere else (GitHub Pages) is public.
const IS_LOCAL = ["127.0.0.1", "localhost"].includes(window.location.hostname);

// ?source=snapshot lets you test the public behaviour without deploying.
const REQUESTED = new URLSearchParams(window.location.search).get("source");

// Local -> try the API. Any other host (or ?source=snapshot) -> straight to the snapshot.
// On a visitor's computer 127.0.0.1 is THEIR machine: a request there can only fail, slowly.
const SOURCE = REQUESTED === "snapshot" || !IS_LOCAL ? "snapshot" : "api";
