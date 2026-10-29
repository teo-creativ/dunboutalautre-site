// Cartes de texte d'une page secondaire : label, titre (title tag compris), phrase d'introduction facultative, puis des cartes blanches
// (titre, texte, ligne « Idéal pour » facultative). Aucune icône : le design n'en fournit pas. Les valeurs peuvent être des todo().
import { frText, text } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

// Colonnes : une par carte jusqu'à 4, trois au-delà (5 cartes : 3 puis 2).
const columns = (count) => (count <= 4 ? count : 3);

export default ({ label, title, tag, lead, items, useLabel = "Idéal pour" }, { index }) => {
  const id = `cards-${index}`;
  const cards = items
    .map(
      (card) => `<li class="card" data-reveal="up" data-reveal-step="0.1">
            <h3 class="card__title">${text(card.title)}</h3>
            <p class="card__text">${frText(card.text)}</p>${card.use ? `\n            <p class="card__use"><span class="card__use-label">${esc(useLabel)}</span> ${frText(card.use)}</p>` : ""}
          </li>`,
    )
    .join("\n          ");
  return `<section class="cards" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="cards__inner">
          <div class="section-head" data-reveal="head">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title cards__title" id="${id}-title">${titleHtml(title, tag)}</h2>
          </div>${lead ? `\n          <p class="cards__lead" data-reveal="up">${esc(fr(lead))}</p>` : ""}
          <ul class="cards__list" style="--cols: ${columns(items.length)}">
          ${cards}
          </ul>
        </div>
      </section>`;
};
