// TODO: paste the waitlist URL here (Google Form, Tally or similar). Until it's
// set, nothing is sent or stored, and submitting says the waitlist isn't open.
// Fields sent: parent_name, contact, child_class, area, consent.
const WAITLIST_ENDPOINT = "";

const form = document.querySelector("#waitlist-form");
const thanks = document.querySelector("#waitlist-thanks");
const notice = document.querySelector("#form-notice");
const contact = form.elements.contact;
const consent = form.elements.consent;

function setError(field, message) {
  const error = document.querySelector(`#${field.id}-error`);
  error.textContent = message;
  error.hidden = !message;
  field.setAttribute("aria-invalid", String(Boolean(message)));
}

function contactError() {
  const value = contact.value.trim();
  if (!value) return "Please add a WhatsApp number or email so we can reach you.";
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const isPhone = /^[+\d][\d\s()-]*$/.test(value) && value.replace(/\D/g, "").length >= 10;
  return isEmail || isPhone ? "" : "Please enter a valid WhatsApp number or email.";
}

function consentError() {
  return consent.checked ? "" : "Please confirm you’re the parent or guardian.";
}

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = !message;
}

contact.addEventListener("input", () => {
  if (contact.getAttribute("aria-invalid") === "true") setError(contact, contactError());
});
consent.addEventListener("change", () => setError(consent, consentError()));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  showNotice("");
  setError(contact, contactError());
  setError(consent, consentError());

  const invalid = form.querySelector('[aria-invalid="true"]');
  if (invalid) {
    invalid.focus();
    return;
  }

  if (!WAITLIST_ENDPOINT) {
    showNotice("The waitlist isn’t open yet, so your details weren’t sent. Please check back soon.");
    return;
  }

  const button = form.querySelector("button");
  button.disabled = true;
  try {
    const response = await fetch(WAITLIST_ENDPOINT, { method: "POST", body: new FormData(form) });
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
