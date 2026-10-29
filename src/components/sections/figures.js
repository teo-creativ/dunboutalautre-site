// Chiffres clés d'une page secondaire (E1 du plan) : cartes statiques, sans compteur animé ni #stats. src/scripts/stats.js suppose
// trois cartes, un titre à tag et des nombres ; ici un chiffre peut manquer (« +X projets » : todo()). Le titre de la section est son label.
import { frText, text } from "../placeholder.js";
import { esc } from "../utils.js";

export default ({ label, items }, { index }) => {
  const id = `figures-${index}`;
  const cards = items
    .map(
      ({ head, text: body }) => `<li class="figure" data-reveal="up" data-reveal-step="0.1">
            <p class="figure__head">${head.map(text).join("")}</p>
            <p class="figure__text">${frText(body)}</p>
          </li>`,
    )
    .join("\n          ");
  return `<section class="figures" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="figures__inner">
          <h2 class="label" id="${id}-title" data-reveal="up"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</h2>
          <ul class="figures__list">
          ${cards}
          </ul>
        </div>
      </section>`;
};
