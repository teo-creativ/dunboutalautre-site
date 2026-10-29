// Nos univers (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md §4), générée depuis src/data/noel.js : photo-carte à gauche, label, titre
// et liste des cinq univers à droite. Chaque univers est un bouton (aria-expanded, aria-controls) suivi de son sous-titre dans une
// région associée : src/scripts/universes.js en ouvre un seul à la fois (survol, focus, tap). Sans JavaScript, tous les sous-titres
// sont affichés. Le balisage de l'univers ouvert par défaut porte déjà l'état actif (couleur), pour éviter tout saut à l'initialisation.
// La section suit la scène épinglée dans le flux de la page ; c'est le scroll qui la fait monter par-dessus l'orange (noel-stage.css).
// universSection() rend n'importe quelle liste d'offres (titre déjà balisé, photo ou, faute de photo, une tuile « Photo [À compléter] »)
// pour les pages secondaires ; l'export par défaut rend les univers de Noël, octet pour octet comme avant.
import { noel } from "../data/noel.js";
import { esc, fr } from "./utils.js";
import img from "./img.js";
import { placeholder } from "./placeholder.js";
import { tag } from "./tag.js";

const { label, photo, items, default: initial } = noel.univers; // valeurs par défaut : les univers de la landing Noël

export const universSection = ({ label, titleHtml, photo, items, initial }) => {
// Photos distinctes (une seule pour l'instant) : l'indice de la photo de chaque univers sert au fondu enchaîné.
const photos = [...new Map(items.map((u) => u.photo ?? photo).filter(Boolean).map((p) => [p.src, p])).values()];
const photoIndex = (u) => Math.max(0, photos.findIndex((p) => p.src === (u.photo ?? photo)?.src));

const list = items
  .map((u, i) => {
    const open = i === initial;
    return `<li class="universe${open ? " is-active" : ""}" data-photo="${photoIndex(u)}">
              <button class="universe__btn" type="button" id="universe-${i}" aria-expanded="${open}" aria-controls="universe-panel-${i}">
                <span class="universe__dot" aria-hidden="true"></span>
                <span class="universe__text">${esc(u.title)}<span class="uline" aria-hidden="true"></span></span>
              </button>
              <div class="universe__panel" id="universe-panel-${i}" role="region" aria-labelledby="universe-${i}"><p>${esc(fr(u.text))}</p></div>
            </li>`;
  })
  .join("\n            ");

const figure = photos.length
  ? photos
      .map((p, i) => img({ src: p.src, alt: p.alt, class: i === photoIndex(items[initial]) ? "" : "is-hidden", sizes: "(min-width: 901px) 36vw, 90vw" }))
      .join("")
  : `<div class="placeholder-tile" aria-hidden="true"><span>Photo ${placeholder("photo")}</span></div>`;

return `<section id="univers" class="univers" data-header-theme="light" data-header-gradient="cream" aria-labelledby="univers-title">
        <div class="univers__inner">
          <div class="univers__body">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title univers__title" id="univers-title">${titleHtml}</h2>
            <ul class="universes">
            ${list}
            </ul>
          </div>
          <figure class="univers__card">${figure}</figure>
        </div>
      </section>`;
};

export default () =>
  universSection({ label, titleHtml: `Choisissez l'univers de ${tag({ text: "votre Noël", variant: "orange" })}.`, photo, items, initial });
