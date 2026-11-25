// js/api.js (version 2): every fetch on the site goes through here.
// getResponse() and getJSON() keep working, so every Module 3 caller (weather, posts) is unaffected.

async function request(url, { method = "GET", body, timeoutMs = 8000 } = {}) {
  const options = { method, signal: AbortSignal.timeout(timeoutMs) };
  if (body !== undefined) {
    options.headers = { "Content-Type": "application/json" }; // what REST Client sent in Module 7
    options.body = JSON.stringify(body);
  }
  let response;
  try {
    response = await fetch(url, options); // a JSON POST makes the browser send OPTIONS first (preflight)
  } catch (cause) {
    const error = new Error("No response");
    error.reason = cause.name === "TimeoutError" ? "timeout" : "network";
    throw error;
  }
  if (!response.ok) {
    const error = new Error(`HTTP ${response.status}`);
    error.reason = "http";
    error.status = response.status;
    try {
      const data = await response.json();
      if (data.error) { // Module 8's one error format
        error.code = data.error.code;
        error.serverMessage = data.error.message;
        error.fields = data.error.fields || {};
      }
    } catch {
      // not our format (a hotel Wi-Fi page, a crash): the status is enough. Never crash while handling an error.
    }
    throw error;
  }
  if (response.status === 204) return response; // no body to check
  const type = response.headers.get("Content-Type") || "";
  if (!type.includes("application/json")) {
    const error = new Error(`Expected JSON, got ${type}`);
    error.reason = "format";
    throw error;
  }
  return response;
}

const getResponse = (url, timeoutMs) => request(url, { timeoutMs });
const getJSON = async (url, timeoutMs) => (await getResponse(url, timeoutMs)).json();
const postJSON = async (url, body) => (await request(url, { method: "POST", body })).json();

function messageFor(error) {
  if (error.reason === "timeout") return "This is taking too long. Please try again.";
  if (error.reason === "network") return "We can't reach the service right now.";
  if (error.status === 404) return "We couldn't find that.";
  if (error.status === 409) return "That conflicts with something that already exists."; // new in Module 9
  if (error.status === 422) return "Please check the highlighted fields."; // new in Module 9
  if (error.status === 429 || error.status === 403) return "Too many requests. Please wait a minute.";
  if (error.status >= 500) return "The service is having problems. Please try later.";
  return "Something went wrong.";
}
