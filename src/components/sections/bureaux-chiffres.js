// Chiffres clés de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §2, frames bureaux-03 à 05) : le balisage et les classes des
// chiffres clés de l'accueil (stats.css, carte de stats-cards.js), avec les valeurs de la page. Pas de #stats : src/scripts/stats.js,
// qui épingle et scrube la section de l'accueil, ne la voit pas. scripts/bureaux-chiffres.js fait arriver les cartes en cascade et
// compter les nombres, une fois ; sans animation (JavaScript absent, mouvement réduit), les valeurs finales sont dans le HTML.
import { card } from "../stats-cards.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, items }, { index }) => {
  const id = `bx-chiffres-${index}`;
  return `<section class="stats stats--bx" data-bx="chiffres" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="stats__intro">
          <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="stats__title" id="${id}-title">${titleHtml(title, tag)}</h2>
        </div>
        <ul class="stats__cards">
        ${items.map(card).join("\n        ")}
        </ul>
      </section>`;
};
