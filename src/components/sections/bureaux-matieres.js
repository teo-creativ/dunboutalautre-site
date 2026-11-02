// « Trois matières, un même objectif » de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §4 et §5, frames bureaux-18 à 33).
// Une seule section : le texte sur fond orange, la photo qui grandit du bas jusqu'au plein écran (les trois fonds empilés, un seul
// élément, aucune coupure), le voile, puis les trois slides (titre à pastille et paragraphe chacun, tous dans le DOM). Les titres glissent
// sur un rail et les fonds se fondent (scripts/bureaux-matieres.js). Sans animation (JavaScript absent, mouvement réduit) : le texte sur
// l'orange, puis trois blocs empilés, chacun sur sa photo (bureaux-matieres.css). Les images sont lues en lazy ; le script les passe en
// eager dès l'initialisation pour qu'elles soient chargées avant d'entrer à l'écran (aucun flash au changement de fond).
import img from "../img.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, items }, { index }) => {
  const id = `bx-mat-${index}`;
  const photos = items
    .map(({ photo, alt }) => `<figure class="mat__bg">${img({ src: photo, alt, class: "mat__bg-img", sizes: "100vw" })}</figure>`)
    .join("\n          ");
  const slides = items
    .map(
      ({ title: name, tag: word, text }, i) => `<div class="mat-slide" role="group" aria-roledescription="slide" aria-label="${i + 1} sur ${items.length}">
            <h3 class="mat-slide__title">${titleHtml(name, word, "cream")}</h3>
            <p class="mat-slide__text">${frText(text)}</p>
          </div>`,
    )
    .join("\n          ");
  return `<section class="mat" data-bx="matieres" data-header-gradient="orange" aria-labelledby="${id}-title">
        <div class="mat__head section-head" data-reveal="head">
          <p class="label label--light label--lg"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="section-title" id="${id}-title">${titleHtml(title, tag, "cream")}</h2>
        </div>
        <div class="mat__photo">
          ${photos}
          <div class="mat__veil" aria-hidden="true"></div>
        </div>
        <div class="mat__slider" role="group" aria-roledescription="carousel" aria-label="Les trois matières">
          ${slides}
        </div>
      </section>`;
};
