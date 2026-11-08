// « Pourquoi végétaliser vos bureaux ? » de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §6, frames bureaux-34 et 35) : label, titre
// à pastille, puis quatre lignes (titre à gauche, paragraphe à droite) séparées par des filets. Toutes les lignes sont dans le HTML et lisibles :
// V8 (G7) : aucune ligne n'est active au repos. Sur ordinateur avec souris toutes les lignes sont éteintes (en sable) et la ligne survolée ou
// focalisée s'allume (en olive, soulignée d'orange), en CSS pur, comme la liste de l'accueil ; sans souris, sous 900 px ou sans JavaScript, toutes
// les lignes restent lisibles (bureaux-pourquoi.css). Le filet est un élément à part (aria-hidden) : il se dessine en scaleX au scroll.
// V6 (« Nos 5 créations » de Design) : la même liste. `variant` : mesures propres à la page (data-bx-variant) ; `hold` : la liste reste en
// place un écran pendant que la section suivante monte par-dessus (data-bx-hold, scripts/bureaux-hold.js) ; `endRule` : un filet sous la dernière
// ligne (frames design-05 à 08 ; Bureaux n'en a pas).
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, items, variant, hold, endRule }, { index }) => {
  const id = `bx-why-${index}`;
  const rows = items
    .map(
      ({ title: name, text }, i) => `<li class="why-row" data-reveal="up" data-reveal-y="24" data-reveal-step="0.1">${i ? '\n            <span class="why-row__rule" aria-hidden="true"></span>' : ""}
            <h3 class="why-row__title">${esc(name)}</h3>
            <p class="why-row__text">${frText(text)}</p>${endRule && i === items.length - 1 ? '\n            <span class="why-row__rule why-row__rule--end" aria-hidden="true"></span>' : ""}
          </li>`,
    )
    .join("\n          ");
  return `<section class="why" data-bx="pourquoi"${variant ? ` data-bx-variant="${esc(variant)}"` : ""}${hold ? " data-bx-hold" : ""} data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="why__inner">
          <div class="section-head" data-reveal="head">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title why__title" id="${id}-title">${titleHtml(title, tag)}</h2>
          </div>
          <ul class="why__list" role="list">
          ${rows}
          </ul>
        </div>
      </section>`;
};
