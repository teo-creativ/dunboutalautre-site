// Formulaire de devis guidé (docs/copywriting/10-contact-et-devis.md), généré depuis src/data/pages/contact.js : groupes de cases à
// cocher et de boutons radio en pilules (fieldset et legend), champs texte avec étiquette, message, coordonnées. Les champs que le
// copywriting ne marque pas « optionnel » sont obligatoires (aria-required) ; la validation est dans src/scripts/contact-form.js
// (novalidate : pas de bulles du navigateur). Sans JavaScript, le bouton d'envoi reste désactivé : rien ne part, rien ne se recharge.
// La confirmation (micro.notice) et les messages d'erreur (micro.messages) sont de la microcopie en données, lue par le script.
import { cta } from "../cta.js";
import { esc, fr } from "../utils.js";

const mark = (group, optionalLabel) => (group.optional ? ` <span class="form__optional">(${esc(optionalLabel)})</span>` : "");
const required = (group) => (group.optional ? "" : ' data-required="true"');

const options = (group) =>
  group.options
    .map(
      (option, i) => `<label class="pill"><input class="pill__input" type="${group.kind}" name="${group.field}" value="${esc(option.key)}" id="f-${group.field}-${i}"><span class="pill__text">${esc(fr(option.label))}</span></label>`,
    )
    .join("\n              ");

const choice = (group, optionalLabel) => `<fieldset class="form__group" data-field="${group.field}" data-kind="${group.kind}"${required(group)}>
            <legend class="form__legend">${esc(group.legend)}${mark(group, optionalLabel)}</legend>
            <div class="form__pills">
              ${options(group)}
            </div>
            <p class="form__error" id="err-${group.field}" hidden></p>
          </fieldset>`;

const field = (item, optionalLabel, group = item) => {
  const isArea = item.kind === "textarea";
  const control = isArea
    ? `<textarea class="form__control" id="f-${item.field}" name="${item.field}" rows="5"${item.optional ? "" : ' required aria-required="true"'}></textarea>`
    : `<input class="form__control" id="f-${item.field}" name="${item.field}" type="${item.type ?? "text"}"${item.autocomplete ? ` autocomplete="${item.autocomplete}"` : ""}${item.optional ? "" : ' required aria-required="true"'}>`;
  return `<div class="form__field" data-field="${item.field}" data-kind="${item.type ?? item.kind}"${required(item)}>
            <label class="form__label" for="f-${item.field}">${esc(item.label)}${mark(item, optionalLabel)}</label>
            ${control}
            <p class="form__error" id="err-${item.field}" hidden></p>
          </div>`;
};

export default ({ label, groups, submit, optionalLabel, micro }, { index }) => {
  const id = `form-${index}`;
  const body = groups
    .map((group) =>
      group.kind === "checkbox" || group.kind === "radio"
        ? choice(group, optionalLabel)
        : group.kind === "fields"
          ? `<fieldset class="form__group form__group--fields">
            <legend class="form__legend">${esc(group.legend)}</legend>
            <div class="form__grid">
          ${group.fields.map((item) => field(item, optionalLabel)).join("\n          ")}
            </div>
          </fieldset>`
          : field(group, optionalLabel),
    )
    .join("\n          ");
  const button = cta({ label: submit, variant: "on-cream", tag: "button", className: "form__submit", attrs: "disabled" }).replace('type="button"', 'type="submit"');
  return `<section class="contact" id="formulaire" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="contact__inner">
          <h2 class="label" id="${id}-title" data-reveal="up"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</h2>
          <form class="form" novalidate data-reveal="up" data-notice="${esc(micro.notice)}" data-messages="${esc(JSON.stringify(micro.messages))}" aria-labelledby="${id}-title">
          <div class="form__summary" tabindex="-1" hidden></div>
          ${body}
          <div class="form__actions">
            ${button}
          </div>
          <p class="form__status" role="status" aria-live="polite" tabindex="-1"></p>
          </form>
        </div>
      </section>`;
};
