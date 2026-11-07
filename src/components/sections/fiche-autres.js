// « Découvrez nos projets les plus iconiques. » en bas de la fiche projet : deux cartes de la page Réalisations (même carte, même survol : la
// feuille projets-grid.css s'applique) et le bouton vers la liste. Les cartes sont reprises par leur titre dans src/data/pages/realisations.js,
// une seule source. Révélations de src/scripts/reveal.js : titre comme sur Réalisations, cartes en fondu et montée de 40 px à 0,12 s d'écart,
// bouton ensuite. `variant` : jeu de mesures propre à une page (data-bx-variant, V7 : Scénographie et Décoration).
import { cta } from "../cta.js";
import { linkTo } from "../links.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";
import { realisationsPage } from "../../data/pages/realisations.js";
import { projetCard } from "./projets-grid.js";

export default ({ label, heading, tag, featured, more, variant }, { index }) => {
  const grid = realisationsPage.sections.find((section) => section.type === "projets-grid");
  const labelOf = (key) => grid.filters.find((f) => f.key === key)?.label;
  const cards = featured.map((title) => {
    const item = grid.items.find((candidate) => candidate.title === title);
    if (!item) throw new Error(`fiche-autres : la carte « ${title} » est absente de src/data/pages/realisations.js`);
    return projetCard(item, labelOf, { attrs: 'data-reveal="up" data-reveal-y="40" data-reveal-step="0.12"' });
  });
  return `<section class="fothers"${variant ? ` data-bx-variant="${esc(variant)}"` : ""} data-header-theme="light" data-header-gradient="cream" aria-labelledby="fothers-title-${index}">
        <div class="fothers__head" data-reveal="head">
          <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="section-title fothers__title" id="fothers-title-${index}">${titleHtml(heading, tag, "orange")}</h2>
        </div>
        <ul class="fothers__list">
          ${cards.join("\n          ")}
        </ul>
        <div class="fothers__more" data-reveal="up" data-reveal-y="40" data-reveal-step="0.12">${cta({ label: fr(more.label), variant: "solid", href: linkTo(more.to) })}</div>
      </section>`;
};
