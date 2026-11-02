// « Pourquoi végétaliser vos bureaux ? » de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §6, frames bureaux-34 et 35) : label, titre
// à pastille, puis quatre lignes (titre à gauche, paragraphe à droite) séparées par des filets. Toutes les lignes sont dans le HTML et lisibles :
// la ligne active (en olive, soulignée d'orange) et les lignes éteintes (en sable) ne sont qu'un état de style, posé par
// scripts/bureaux-pourquoi.js avec mouvement sur ordinateur ; sans JavaScript, en mouvement réduit ou sous 900 px, toutes les lignes restent
// lisibles (bureaux-pourquoi.css). Le filet est un élément à part (aria-hidden) : il se dessine en scaleX au scroll.
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, items }, { index }) => {
  const id = `bx-why-${index}`;
  const rows = items
    .map(
      ({ title: name, text }, i) => `<li class="why-row" data-reveal="up" data-reveal-y="24" data-reveal-step="0.1">${i ? '\n            <span class="why-row__rule" aria-hidden="true"></span>' : ""}
            <h3 class="why-row__title">${esc(name)}</h3>
            <p class="why-row__text">${frText(text)}</p>
          </li>`,
    )
    .join("\n          ");
  return `<section class="why" data-bx="pourquoi" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
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
