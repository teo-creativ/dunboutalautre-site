// Section « styles » (V7 : « Nos styles d'aménagement » de Terrasses et de Décoration ; frames terrasses-06 à 09 et decoration-06 à 08) : une image à
// gauche, l'étiquette, le titre à pastille et la liste des styles à droite. La section est épinglée (scripts/bureaux-styles.js) : l'entrée active
// (puce orange, titre souligné, description) avance avec le scroll et, si elle a sa propre image, l'image change en fondu. Chaque entrée porte son
// titre, sa description et, facultatif, `photo` et `alt` (sinon l'image de la section) ; `proposition: true` signale un texte proposé, à valider.
// Toutes les entrées et leurs descriptions sont dans le DOM : sans animation (JavaScript absent, mouvement réduit, moins de 900 px) la liste est
// entière, chaque description visible.
import img from "../img.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, photo, alt, items, initial = 0 }, { index }) => {
  const id = `sty-${index}`;
  // Images distinctes (dans l'ordre des entrées) : le numéro de celle d'une entrée sert au fondu enchaîné.
  const photos = [...new Map(items.map((item) => [item.photo ?? photo, item.photo ? item.alt : alt])).entries()];
  const indexOf = (item) => photos.findIndex(([src]) => src === (item.photo ?? photo));
  const figures = photos
    .map(([src, text], i) => img({ src, alt: text, class: `sty__img${i === indexOf(items[initial]) ? "" : " is-hidden"}`, sizes: "(min-width: 901px) 36vw, 90vw" }))
    .join("\n          ");
  const rows = items
    .map(
      (item, i) => `<li class="sty-row" data-photo="${indexOf(item)}">
              <h3 class="sty-row__title">${esc(item.title)}</h3>
              <p class="sty-row__text">${frText(item.text)}</p>
            </li>`,
    )
    .join("\n            ");
  return `<section class="sty" data-bx="styles" data-initial="${initial}" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="sty__inner">
          <figure class="sty__photo">
          ${figures}
          </figure>
          <div class="sty__body">
            <div class="section-head" data-reveal="head">
              <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
              <h2 class="section-title sty__title" id="${id}-title">${titleHtml(title, tag)}</h2>
            </div>
            <ul class="sty__list" role="list">
            ${rows}
            </ul>
          </div>
        </div>
      </section>`;
};
