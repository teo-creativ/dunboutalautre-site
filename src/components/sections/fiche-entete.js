// En-tête de la fiche projet (V4, frame case-study-01) : fil d'Ariane (retour à la liste, puis la catégorie du projet), titre, ligne de 5 infos
// et le filet qui la ferme. Le titre porte .hero__title : src/scripts/intro.js le révèle comme celui des autres pages et retire la classe js ;
// src/scripts/fiche.js anime ensuite le fil d'Ariane, le filet et les infos (data-fiche). Le lien de retour ouvre la liste avec le filtre de
// la catégorie déjà choisi (?categorie=, lu par src/scripts/projets-grid.js) : sans page Réalisations en ligne, il reste « # » comme les autres.
import { linkTo } from "../links.js";
import { esc, fr } from "../utils.js";

export default ({ back, category, heading, infos }, { index }) => {
  const to = linkTo(back.to);
  const href = to === "#" ? "#" : `${to}?categorie=${encodeURIComponent(back.filter)}`;
  const rows = infos
    .map(
      (info) => `<div class="fhead__info" data-fiche="info"><dt class="fhead__label">${esc(fr(info.label))}</dt><dd class="fhead__value">${esc(fr(info.value))}</dd></div>`,
    )
    .join("\n          ");
  return `<section class="fhead" data-header-theme="light" data-header-gradient="cream" aria-labelledby="fhead-title-${index}">
        <nav class="fhead__crumbs" aria-label="Fil d'Ariane" data-fiche="crumbs">
          <ol>
            <li><a class="label label--lg fhead__back" href="${esc(href)}"><span class="label__dot" aria-hidden="true"></span>${esc(back.label)}</a></li>
            <li class="label label--lg fhead__here" aria-current="page"><span class="label__dot" aria-hidden="true"></span>${esc(category)}</li>
          </ol>
        </nav>
        <h1 class="hero__title fhead__title" id="fhead-title-${index}">${esc(fr(heading))}</h1>
        <dl class="fhead__infos">
          ${rows}
        </dl>
        <div class="fhead__rule" aria-hidden="true" data-fiche="rule"></div>
      </section>`;
};
