// Formulaire de devis (page Contact) : validation côté client et envoi simulé. Aucune requête réseau, aucun stockage.
// Le balisage est dans src/components/sections/form.js ; la confirmation (data-notice) et les messages d'erreur (data-messages) viennent
// de src/data/pages/contact.js. Obligatoire = tout champ que le copywriting ne marque pas « optionnel » (data-required).
// Sans JavaScript, le bouton d'envoi reste désactivé : ce script l'active.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneOk = (value) => {
  const digits = value.replace(/\D/g, "").length;
  return /^[+\d][\d\s().+-]*$/.test(value.trim()) && digits >= 6 && digits <= 15;
};

export function initContactForm() {
  const form = document.querySelector(".contact .form");
  if (!form) return;

  const messages = JSON.parse(form.dataset.messages);
  const notice = form.dataset.notice;
  const summary = form.querySelector(".form__summary");
  const status = form.querySelector(".form__status");
  const submit = form.querySelector(".form__submit");
  const blocks = [...form.querySelectorAll("[data-field]")];
  submit.disabled = false;

  // ?prestation=bureaux (ou plusieurs, séparées par des virgules) : coche la prestation, par exemple depuis la landing Noël.
  const wanted = (new URLSearchParams(location.search).get("prestation") ?? "").split(",").filter(Boolean);
  wanted.forEach((key) => {
    const input = form.querySelector(`input[name="prestation"][value="${CSS.escape(key)}"]`);
    if (input) input.checked = true;
  });

  const labelOf = (block) => (block.querySelector(".form__legend, .form__label")?.firstChild?.textContent ?? "").trim();
  const controlsOf = (block) => [...block.querySelectorAll("input, textarea")];

  const check = (block) => {
    const kind = block.dataset.kind;
    const required = block.dataset.required === "true";
    const controls = controlsOf(block);
    if (kind === "checkbox") return required && !controls.some((c) => c.checked) ? messages.checkbox : "";
    if (kind === "radio") return required && !controls.some((c) => c.checked) ? messages.radio : "";
    const value = controls[0].value.trim();
    if (!value) return required ? messages.required : "";
    if (kind === "email" && !EMAIL.test(value)) return messages.email;
    if (kind === "tel" && !phoneOk(value)) return messages.tel;
    return "";
  };

  const show = (block, message) => {
    const error = block.querySelector(".form__error");
    const choice = block.dataset.kind === "checkbox" || block.dataset.kind === "radio";
    error.textContent = message;
    error.hidden = !message;
    if (choice) {
      block.toggleAttribute("data-invalid", Boolean(message));
      if (message) block.setAttribute("aria-describedby", error.id);
      else block.removeAttribute("aria-describedby");
    } else {
      const control = controlsOf(block)[0];
      if (message) {
        control.setAttribute("aria-invalid", "true");
        control.setAttribute("aria-describedby", error.id);
      } else {
        control.removeAttribute("aria-invalid");
        control.removeAttribute("aria-describedby");
      }
    }
  };

  const firstControl = (block) => controlsOf(block)[0];

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";
    const problems = [];
    blocks.forEach((block) => {
      const message = check(block);
      show(block, message);
      if (message) problems.push({ block, message });
    });
    form.dataset.submitted = "true";

    if (problems.length) {
      summary.replaceChildren();
      const lead = document.createElement("p");
      lead.textContent = messages.summary;
      const list = document.createElement("ul");
      problems.forEach(({ block, message }) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        const target = firstControl(block);
        link.href = `#${target.id}`;
        link.textContent = `${labelOf(block)} : ${message}`;
        link.addEventListener("click", (e) => {
          e.preventDefault();
          target.focus();
        });
        item.append(link);
        list.append(item);
      });
      summary.append(lead, list);
      summary.hidden = false;
      summary.focus();
      return;
    }

    summary.hidden = true;
    summary.replaceChildren();
    // TODO: envoi réel (Webflow ou service de formulaires). Tant qu'il n'existe pas, rien n'est envoyé ni stocké, et la confirmation ne doit
    // jamais laisser croire qu'un message est parti (SUBMIT_NOTICE, src/data/pages/contact.js).
    status.textContent = notice;
    status.focus();
  });

  // Après une première soumission, chaque champ se revalide quand on le corrige : l'erreur disparaît sans attendre le prochain envoi.
  form.addEventListener("change", (event) => {
    if (form.dataset.submitted !== "true") return;
    const block = event.target.closest("[data-field]");
    if (block) show(block, check(block));
  });
  form.addEventListener("input", (event) => {
    if (form.dataset.submitted !== "true") return;
    const block = event.target.closest("[data-field]");
    if (block && block.querySelector(".form__error:not([hidden])")) show(block, check(block));
  });
}
