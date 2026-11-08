// « Nos formules d'abonnement » de la page Entretien (V7, frames entretien-05 à 09, zoom 06) : étiquette et titre à pastille centrés, puis des
// cartes côte à côte (une carte blanche par formule, la formule mise en avant est orange), chacune avec son titre, une phrase, une liste à
// puces orange et un bouton « Demander un devis ». Pas de prix : c'est voulu. Chaque carte porte `featured` (carte orange, bouton blanc) ou
// non (carte blanche, bouton orange plein). Toutes les cartes ont la même hauteur (grille) : le bouton est calé en bas.
// Avec mouvement sur ordinateur, la section est épinglée et un disque orange part du centre de l'écran et grandit jusqu'à tout recouvrir
// (scripts/bureaux-formules.js, scripts/bureaux-cercle.js) : `.fml__disc` en est l'élément (décoratif, aria-hidden). Sans animation (JavaScript
// absent, mouvement réduit, moins de 900 px) il n'est pas affiché et la section orange suivante prend la suite.
import { cta } from "../cta.js";
import { linkTo } from "../links.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, cards, variant }, { index }) => {
  const id = `fml-${index}`;
  const items = cards
    .map(
      ({ title: name, text, items: list, cta: button, featured }) => `<li class="fml-card${featured ? " fml-card--featured" : ""}" data-reveal="up" data-reveal-step="0.1">
              <h3 class="fml-card__title">${esc(name)}</h3>
              <p class="fml-card__text">${frText(text)}</p>
              <ul class="fml-card__list" role="list">
                ${list.map((item) => `<li>${frText(item)}</li>`).join("\n                ")}
              </ul>
              ${cta({ label: button.label, variant: featured ? "on-orange" : "solid", href: linkTo(button.to), attrs: `aria-label="${esc(button.label)} : formule ${esc(name)}"` })}
            </li>`,
    )
    .join("\n            ");
  return `<section class="fml" data-bx="formules"${variant ? ` data-bx-variant="${esc(variant)}"` : ""} data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="fml__inner">
          <div class="section-head" data-reveal="head">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title fml__title" id="${id}-title">${titleHtml(title, tag)}</h2>
          </div>
          <ul class="fml__list" role="list">
            ${items}
          </ul>
        </div>
        <div class="fml__disc" aria-hidden="true"></div>
      </section>`;
};
