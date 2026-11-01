// Page Contact V4 : titre collé à gauche, formulaire à droite (retours-v4/docs/03-CONTACT.md, frames contact-01 à 03), généré depuis
// src/data/pages/contact.js. Le titre est le h1 de la page : il porte .hero__title, src/scripts/intro.js le révèle comme celui des autres
// pages. Choix unique en puces : radios dans un fieldset (les deux obligatoires) ; le budget, désélectionnable, est un groupe de boutons à
// aria-pressed. Champs à filet bas ; les quatre coordonnées ont un libellé flottant (il se lit comme le placeholder de la maquette, puis
// monte au-dessus du texte : toujours visible). Les erreurs sont écrites dans une zone aria-live déjà présente. Sans JavaScript le bouton
// d'envoi reste désactivé (rien ne part, rien ne se recharge). La validation et l'envoi simulé sont dans src/scripts/contact-form.js.
import { cta } from "../cta.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

const mark = (group, optionalLabel) => (group.optional ? ` <span class="cgroup__optional">(${esc(optionalLabel)})</span>` : "");
const required = (group) => (group.optional ? "" : ' data-required="true"');
const error = (field) => `<p class="cerror" id="err-${field}" aria-live="polite"></p>`;

const radios = (group) =>
  group.options
    .map(
      (option, i) =>
        `<label class="pill"><input class="pill__input" type="radio" name="${group.field}" value="${esc(option.key)}" id="f-${group.field}-${i}" required${option.key === group.selected ? " checked" : ""}><span class="pill__text">${esc(fr(option.label))}</span></label>`,
    )
    .join("\n              ");

const toggles = (group) =>
  group.options
    .map(
      (option) =>
        `<button class="pill pill--toggle" type="button" aria-pressed="false" data-value="${esc(option.key)}"><span class="pill__text">${esc(fr(option.label))}</span></button>`,
    )
    .join("\n              ");

const choice = (group, optionalLabel) => `<fieldset class="cgroup" data-cgroup data-field="${group.field}" data-kind="${group.kind}"${required(group)}${group.kind === "radio" ? ' role="radiogroup" aria-required="true"' : ""}>
            <legend class="cgroup__legend">${esc(group.legend)}${mark(group, optionalLabel)}</legend>
            <div class="cpills">
              ${group.kind === "radio" ? radios(group) : toggles(group)}
            </div>
            ${error(group.field)}
          </fieldset>`;

// Champ à légende au-dessus (lieu, délai, message) : le filet est un calque, l'orange du focus le recouvre en scaleX.
const field = (item, optionalLabel) => {
  const area = item.kind === "textarea";
  const control = area
    ? `<textarea class="cinput cinput--area" id="f-${item.field}" name="${item.field}" rows="3"></textarea>`
    : `<input class="cinput" id="f-${item.field}" name="${item.field}" type="${item.type ?? "text"}"${item.autocomplete ? ` autocomplete="${item.autocomplete}"` : ""}>`;
  return `<div class="cgroup cfield" data-cgroup data-field="${item.field}" data-kind="${item.type ?? item.kind}">
            <label class="cgroup__legend" for="f-${item.field}">${esc(item.label)}${mark(item, optionalLabel)}</label>
            <div class="cline">${control}</div>
            ${error(item.field)}
          </div>`;
};

// Coordonnées : libellé flottant, l'entrée porte placeholder=" " pour que :placeholder-shown sache si elle est vide.
const floating = (item) => {
  const type = item.type ?? "text";
  const extra = type === "tel" ? ' inputmode="tel"' : type === "email" ? ' inputmode="email" autocapitalize="off" spellcheck="false"' : "";
  return `<div class="cfield cfield--float" data-field="${item.field}" data-kind="${type}" data-required="true">
                <div class="cline">
                  <input class="cinput" id="f-${item.field}" name="${item.field}" type="${type}" placeholder=" "${item.autocomplete ? ` autocomplete="${item.autocomplete}"` : ""}${extra} required aria-required="true">
                  <label class="cfloat" for="f-${item.field}">${esc(item.label)}</label>
                </div>
                ${error(item.field)}
              </div>`;
};

export default ({ label, heading, tag, groups, submit, optionalLabel, micro }, { index }) => {
  const id = `contact-${index}`;
  const body = groups
    .map((group) =>
      group.kind === "radio" || group.kind === "toggle"
        ? choice(group, optionalLabel)
        : group.kind === "fields"
          ? `<fieldset class="cgroup" data-cgroup>
            <legend class="cgroup__legend">${esc(group.legend)}</legend>
            <div class="cgrid">
              ${group.fields.map(floating).join("\n              ")}
            </div>
          </fieldset>`
          : field(group, optionalLabel),
    )
    .join("\n          ");
  const button = cta({ label: submit, variant: "on-cream", tag: "button", className: "cform__submit", attrs: `disabled data-label="${esc(submit)}" data-sending="${esc(micro.sending)}"` }).replace('type="button"', 'type="submit"');
  return `<section class="contact" id="formulaire" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="contact__grid">
          <div class="contact__side">
            <p class="label contact__label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h1 class="hero__title contact__title" id="${id}-title">${titleHtml(heading, tag)}</h1>
          </div>
          <div class="contact__main">
            <form class="cform" novalidate aria-labelledby="${id}-title" data-notice="${esc(micro.notice)}" data-messages="${esc(JSON.stringify(micro.messages))}">
          ${body}
          <div class="cform__trap" aria-hidden="true"><label for="f-website">Ne pas remplir ce champ</label><input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
          <div class="cform__actions" data-cgroup>
            ${button}
          </div>
          <p class="cform__summary" role="status" aria-live="polite" tabindex="-1"></p>
            </form>
          </div>
        </div>
      </section>`;
};
