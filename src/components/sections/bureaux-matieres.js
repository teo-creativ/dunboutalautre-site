// « Trois matières, un même objectif » de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §4 et §5, frames bureaux-18 à 33).
// Une seule section : le texte sur fond orange, la photo qui grandit du bas jusqu'au plein écran (les trois fonds empilés, un seul
// élément, aucune coupure), le voile, puis les trois slides (titre à pastille et paragraphe chacun, tous dans le DOM). Les titres glissent
// sur un rail et les fonds se fondent (scripts/bureaux-matieres.js). Sans animation (JavaScript absent, mouvement réduit) : le texte sur
// l'orange, puis trois blocs empilés, chacun sur sa photo (bureaux-matieres.css). Les images sont lues en lazy ; le script les passe en
// eager dès l'initialisation pour qu'elles soient chargées avant d'entrer à l'écran (aucun flash au changement de fond).
// V6 (page Design) : la même section. `variant` : jeu de mesures propre à la page (data-bx-variant, scripts/bureaux-matieres.js) ; `tag` de
// chaque slide est facultatif (Design : titres seuls, sans pastille).
// V7 (page Terrasses, frames terrasses-08 à 28) : `band` remplace le texte sur l'orange par la bande de photos « Les spécificités des terrasses
// parisiennes » (titre, phrase, deux rangées qui défilent en sens opposé) sur fond crème ; la photo de l'olivier de la bande est celle du premier
// fond (`hero: true`), qui prend le relais sans coupure puis grandit (scripts/bureaux-bande.js, appelé par scripts/bureaux-matieres.js). `sliderLabel` : nom du
// carrousel pour les lecteurs d'écran (« Les trois contraintes » sur Terrasses).
import img, { imgSize } from "../img.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

const COPIES = 3; // jeu de photos répété : la rangée boucle sans saut (deux copies masquées aux lecteurs d'écran)
const ITEM_RATIO = 1.578; // rapport des photos de la bande sur la maquette (568 x 360 px) ; la photo de l'olivier garde le sien

const bandRow = (photos, row) => {
  const ratios = photos.map(({ photo, hero }) => (hero ? (({ w, h }) => w / h)(imgSize(photo)) : ITEM_RATIO));
  const sum = ratios.reduce((a, b) => a + b, 0);
  const items = [];
  for (let copy = 0; copy < COPIES; copy++) {
    photos.forEach(({ photo, alt, hero }, i) => {
      const first = copy === 0;
      items.push(
        `<li class="band__item" style="--r: ${ratios[i].toFixed(4)}"${hero ? " data-band-hero" : ""}${first ? "" : ' aria-hidden="true"'}>${img({ src: photo, alt: first ? alt : "", sizes: "(min-width: 901px) 34vw, 60vw" })}</li>`,
      );
    });
  }
  return `<div class="band__row band__row--${row ? "left" : "right"}" style="--sum: ${sum.toFixed(4)}; --n: ${photos.length}">
              <ul class="band__track" role="list">
                ${items.join("\n                ")}
              </ul>
            </div>`;
};

const bandBlock = ({ label, title, tag, lead, rows }, id) => `<div class="mat__band">
          <div class="band__content">
            <div class="band__head section-head" data-reveal="head">
              <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
              <h2 class="section-title band__title" id="${id}-title">${titleHtml(title, tag)}</h2>
            </div>
            <p class="band__lead" data-reveal="up">${frText(lead)}</p>
            <div class="band__rows">
            ${rows.map(bandRow).join("\n            ")}
            </div>
          </div>
        </div>`;

export default ({ label, title, tag, items, variant, band, sliderLabel = "Les trois matières" }, { index }) => {
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
  const head = band
    ? bandBlock(band, id)
    : `<div class="mat__head section-head" data-reveal="head">
          <p class="label label--light label--lg"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="section-title" id="${id}-title">${titleHtml(title, tag, "cream")}</h2>
        </div>`;
  return `<section class="mat" data-bx="matieres"${variant ? ` data-bx-variant="${esc(variant)}"` : ""} ${band ? 'data-header-theme="light" data-header-gradient="cream"' : 'data-header-gradient="orange"'} aria-labelledby="${id}-title">
        ${head}
        <div class="mat__photo">
          ${photos}
          <div class="mat__veil" aria-hidden="true"></div>
        </div>
        <div class="mat__slider" role="group" aria-roledescription="carousel" aria-label="${esc(sliderLabel)}">
          ${slides}
        </div>
      </section>`;
};
