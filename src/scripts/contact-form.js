// Formulaire de contact : puces, validation côté client et envoi simulé (balisage : src/components/sections/form.js, textes et messages :
// src/data/pages/contact.js). Aucune requête réseau, aucun stockage : l'envoi passe par submitContactForm (contact-submit.js), seul point à brancher.
// Obligatoire : la prestation, le type de projet et les quatre coordonnées ; le reste est optionnel (maquette). Sans JavaScript, le bouton
// d'envoi reste désactivé : ce script l'active.
import { ScrollTrigger, scrollTo } from "./core.js";
import { submitContactForm } from "./contact-submit.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneOk = (value) => {
  const digits = value.replace(/\D/g, "").length;
  return /^[+\d][\d\s().+-]*$/.test(value.trim()) && digits >= 6 && digits <= 15;
};

export function initContactForm() {
  const form = document.querySelector(".cform");
  if (!form) return;

  const messages = JSON.parse(form.dataset.messages);
  const summary = form.querySelector(".cform__summary");
  const submit = form.querySelector(".cform__submit");
  const blocks = [...form.querySelectorAll("[data-field]")];
  const trap = form.querySelector('input[name="website"]');
  submit.disabled = false;

  // ?prestation=bureaux : coche la prestation (par exemple depuis la landing Noël). Une clé inconnue est ignorée.
  const wanted = new URLSearchParams(location.search).get("prestation");
  const preset = wanted && form.querySelector(`input[name="prestation"][value="${CSS.escape(wanted)}"]`);
  if (preset) preset.checked = true;

  const controlsOf = (block) => [...block.querySelectorAll("input, textarea")];
  const kindOf = (block) => block.dataset.kind;
  const choiceOf = (block) => kindOf(block) === "radio" || kindOf(block) === "toggle";
  const valueOf = (block) => {
    if (kindOf(block) === "radio") return controlsOf(block).find((c) => c.checked)?.value ?? "";
    if (kindOf(block) === "toggle") return block.querySelector('[aria-pressed="true"]')?.dataset.value ?? "";
    return controlsOf(block)[0].value.trim();
  };

  const check = (block) => {
    const required = block.dataset.required === "true";
    const value = valueOf(block);
    if (!value) return required ? (kindOf(block) === "radio" ? messages.radio : messages.required) : "";
    if (kindOf(block) === "email" && !EMAIL.test(value)) return messages.email;
    if (kindOf(block) === "tel" && !phoneOk(value)) return messages.tel;
    return "";
  };

  // Un message par champ, dans la zone aria-live du champ (déjà présente, vide) : la lecture se déclenche à l'écriture du texte.
  const show = (block, message) => {
    const error = block.querySelector(".cerror");
    error.textContent = message;
    block.toggleAttribute("data-invalid", Boolean(message));
    const target = choiceOf(block) ? block : controlsOf(block)[0];
    if (message) {
      target.setAttribute("aria-invalid", "true");
      target.setAttribute("aria-describedby", error.id);
    } else {
      target.removeAttribute("aria-invalid");
      target.removeAttribute("aria-describedby");
    }
  };

  // Puces du budget : un bouton à aria-pressed, désélectionnable (un second clic retire le choix), une seule à la fois.
  form.querySelectorAll(".pill--toggle").forEach((button) => {
    button.addEventListener("click", () => {
      const was = button.getAttribute("aria-pressed") === "true";
      button.closest("[data-field]").querySelectorAll(".pill--toggle").forEach((other) => other.setAttribute("aria-pressed", "false"));
      button.setAttribute("aria-pressed", String(!was));
    });
  });

  // Message libre : trois lignes au moins, puis la zone grandit avec le texte.
  const area = form.querySelector("textarea");
  const grow = () => {
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight}px`; // le min-height du CSS garde les trois lignes
  };
  if (area) {
    area.addEventListener("input", grow);
    window.addEventListener("resize", grow);
  }

  const payload = () => Object.fromEntries(blocks.map((block) => [block.dataset.field, valueOf(block)]));

  // Amène un élément à 30 % de la hauteur de l'écran. Position absolue lue dans la page : après un changement de hauteur, Lenis garde un temps
  // l'ancienne position (le navigateur a ramené le scroll dans la page plus courte), un décalage relatif partirait donc de là.
  const bring = (el) => scrollTo(Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3)), { duration: 0.8 });

  const focusBlock = (block) => {
    const target = choiceOf(block) ? (block.querySelector("input:checked, [aria-pressed]") ?? controlsOf(block)[0]) : controlsOf(block)[0];
    bring(block);
    target.focus({ preventScroll: true });
  };

  const setSending = (on) => {
    submit.disabled = on;
    if (on) submit.setAttribute("aria-busy", "true");
    else submit.removeAttribute("aria-busy");
    const text = on ? submit.dataset.sending : submit.dataset.label;
    submit.querySelectorAll(".cta__text").forEach((node) => (node.textContent = text));
  };

  let sending = false;
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (sending) return;
    summary.textContent = "";
    const problems = blocks.filter((block) => {
      const message = check(block);
      show(block, message);
      return Boolean(message);
    });
    form.dataset.submitted = "true";
    if (problems.length) {
      summary.textContent = messages.summary;
      focusBlock(problems[0]);
      return;
    }

    // Champ piège rempli : un robot. On répond comme pour un envoi réussi, sans rien envoyer.
    const robot = Boolean(trap?.value);
    sending = true;
    setSending(true);
    try {
      if (!robot) await submitContactForm(payload());
      else await new Promise((resolve) => setTimeout(resolve, 800));
    } catch {
      sending = false;
      setSending(false);
      summary.textContent = messages.failed;
      submit.focus(); // le bouton désactivé avait le focus : il le retrouve, la personne peut réessayer
      return;
    }
    showConfirmation();
  });

  // La confirmation remplace le formulaire : la page raccourcit, on recalcule les positions puis on amène la confirmation à l'écran.
  const showConfirmation = () => {
    const done = document.createElement("p");
    done.className = "cdone";
    done.setAttribute("role", "status");
    done.tabIndex = -1;
    done.textContent = form.dataset.notice;
    form.replaceWith(done);
    ScrollTrigger.refresh(); // la page est plus courte : positions du titre collé, de la photo et du footer à recalculer
    requestAnimationFrame(() => requestAnimationFrame(() => bring(done))); // après la mise en page et le scroll ramené dans la page plus courte
    done.focus({ preventScroll: true });
  };

  // Après une première soumission, un champ en erreur se revalide à chaque frappe et une puce dès qu'on la choisit : l'erreur disparaît
  // sans attendre le prochain envoi.
  const revalidate = (event) => {
    if (form.dataset.submitted !== "true") return;
    const block = event.target.closest("[data-field]");
    if (block && (event.type === "change" || block.hasAttribute("data-invalid"))) show(block, check(block));
  };
  form.addEventListener("change", revalidate);
  form.addEventListener("input", revalidate);
}
