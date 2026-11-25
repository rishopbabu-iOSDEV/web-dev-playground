// js/contact.js: the contact form, connected to POST /api/messages (Module 9).
const contactForm = document.querySelector("#contact-form");
const sendButton = document.querySelector("#send");
const formStatus = document.querySelector("#form-status");
const fieldNames = ["name", "email", "message"];

// Course 2's page-side checks (for the visitor's speed). The server ALWAYS checks again.
function validateForm(name, email, message) {
  clearFieldErrors();
  const bad = [];
  if (!name) bad.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) bad.push("email");
  if (!message) bad.push("message");
  showFieldErrors(Object.fromEntries(bad.map((f) => [f, "invalid"])));
  return bad.length === 0;
}

function clearFieldErrors() {
  for (const name of fieldNames) {
    document.querySelector(`#${name}`)?.removeAttribute("aria-invalid");
    document.querySelector(`#${name}-error`)?.classList.remove("show");
  }
}

// The server says WHICH fields; the page says HOW (its own Course 2 sentence, not Pydantic's English).
function showFieldErrors(fields) {
  for (const name of Object.keys(fields)) {
    const input = document.querySelector(`#${name}`);
    const message = document.querySelector(`#${name}-error`);
    if (!input || !message) continue;
    input.setAttribute("aria-invalid", "true");
    message.classList.add("show");
  }
  const first = contactForm.querySelector("[aria-invalid='true']");
  if (first) first.focus();
}

if (SOURCE === "snapshot") {
  // Wrap the controls in a <fieldset>: disabling a fieldset disables every control inside it.
  contactForm.querySelector("fieldset").disabled = true;
  formStatus.textContent = "The contact form works on the live version, running on the owner's computer.";
}

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = contactForm.elements.name.value.trim();
  const email = contactForm.elements.email.value.trim();
  const message = contactForm.elements.message.value.trim();
  if (!validateForm(name, email, message)) return;
  sendButton.disabled = true; // Module 7's double-click problem, solved where it starts
  formStatus.textContent = "Sending…";
  try {
    const sent = await postJSON(`${API_BASE}/api/messages`, { name, email, message });
    contactForm.reset(); // reset ONLY on success: a failed send keeps every word
    formStatus.textContent = `Thank you! Your message was received (reference #${sent.id}).`;
  } catch (error) {
    if (error.fields) showFieldErrors(error.fields);
    formStatus.textContent = messageFor(error);
  } finally {
    sendButton.disabled = false; // runs on success AND failure, so the button always comes back
  }
});
