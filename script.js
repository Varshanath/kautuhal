// Waitlist API expects JSON: name, email, standard, area, consent.
const WAITLIST_ENDPOINT = "https://kautuhal-backend.onrender.com/jointhewaitlist/";

const form = document.querySelector("#waitlist-form");
const thanks = document.querySelector("#waitlist-thanks");
const notice = document.querySelector("#form-notice");
const parentName = form.elements.name;
const email = form.elements.email;
const standard = form.elements.standard;
const area = form.elements.area;
const consent = form.elements.consent;

function setError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

function requiredError(field, label) {
  return field.value.trim() ? "" : `Please add ${label}.`;
}

function emailError() {
  const value = email.value.trim();
  if (!value) return "Please add your email address so we can reach you.";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address.";
}

function consentError() {
  return consent.checked ? "" : "Please confirm you’re the parent or guardian.";
}

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = !message;
}

parentName.addEventListener("input", () => {
  if (parentName.getAttribute("aria-invalid") === "true") {
    setError(parentName, requiredError(parentName, "your name"));
  }
});
email.addEventListener("input", () => {
  if (email.getAttribute("aria-invalid") === "true") setError(email, emailError());
});
standard.addEventListener("change", () => {
  setError(standard, requiredError(standard, "your child’s class"));
});
consent.addEventListener("change", () => setError(consent, consentError()));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showNotice("");
  setError(parentName, requiredError(parentName, "your name"));
  setError(email, emailError());
  setError(standard, requiredError(standard, "your child’s class"));
  setError(consent, consentError());

  const invalid = form.querySelector('[aria-invalid="true"]');
  if (invalid) {
    invalid.focus();
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const payload = {
      name: parentName.value.trim(),
      email: email.value.trim(),
      standard: standard.value,
      area: area.value.trim(),
      consent: consent.checked,
    };
    const response = await fetch(WAITLIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Waitlist returned ${response.status}`);
    form.hidden = true;
    thanks.hidden = false;
    thanks.focus();
  } catch {
    showNotice("Something went wrong and your details weren’t sent. Please try again.");
  } finally {
    button.disabled = false;
  }
});
