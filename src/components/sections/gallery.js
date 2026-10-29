// Galerie d'aperçu d'une page secondaire : une grille de photos (composant img : dimensions explicites, chargement différé) ou, quand la
// photo n'existe pas encore, une tuile « Photo [À compléter] », puis un bouton vers la page des réalisations. Légende facultative
// (todo() si elle est à fournir). Le label est le titre de la section : le copywriting n'en donne pas d'autre.
import { cta } from "../cta.js";
import img from "../img.js";
import { linkTo } from "../links.js";
import { placeholder, frText } from "../placeholder.js";
import { esc } from "../utils.js";

export default ({ label, items, cta: button }, { index }) => {
  const id = `gallery-${index}`;
  const tiles = items
    .map(
      ({ photo, caption }) => `<li class="gallery__item" data-reveal="up" data-reveal-step="0.08">
            <figure class="gallery__figure">
              ${photo ? img({ src: photo.src, alt: photo.alt, class: "gallery__img", sizes: "(min-width: 901px) 30vw, 45vw" }) : `<div class="placeholder-tile" aria-hidden="true"><span>Photo ${placeholder("photo")}</span></div>`}${caption ? `\n              <figcaption class="gallery__caption">${frText(caption)}</figcaption>` : ""}
            </figure>
          </li>`,
    )
    .join("\n          ");
  return `<section class="gallery" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="gallery__inner">
          <h2 class="label" id="${id}-title" data-reveal="up"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</h2>
          <ul class="gallery__grid">
          ${tiles}
          </ul>
          <div class="gallery__cta" data-reveal="up">${cta({ label: button.label, variant: "on-cream", href: linkTo(button.to) })}</div>
        </div>
      </section>`;
};
