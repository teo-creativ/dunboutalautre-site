// Section « styles » (V7 : « Nos styles d'aménagement » de Terrasses et de Décoration ; frames terrasses-06 à 09 et decoration-06 à 08 ; V8 : « Choisissez l'univers de votre Noël. ») : une image à
// gauche, l'étiquette, le titre à pastille et la liste des styles à droite. La section est épinglée (scripts/bureaux-styles.js) : l'entrée active
// (puce orange, titre souligné, description) avance avec le scroll et, si elle a sa propre image, l'image change par voile sombre et échange (jamais deux photos à demi transparentes). Chaque entrée porte son
// titre, sa description et, facultatif, `photo` et `alt` (sinon l'image de la section) ; `proposition: true` signale un texte proposé, à valider.
// Toutes les entrées et leurs descriptions sont dans le DOM : sans animation (JavaScript absent, mouvement réduit, moins de 900 px) la liste est
// entière, chaque description visible ; sous 900 px l'image est au-dessus de la liste. `overlap` (Décoration) : la section suivante (la galerie orange) monte par-dessus pendant un dernier écran d'épinglage ;
// `variant` : jeu de mesures propre à la page (data-bx-variant) ; `step` : écrans de scroll par entrée (0,55 par défaut, 1 pour Noël) ; `anchor` : id de la section (Noël : #univers).
// V8, `layout: "tabs"` (Ateliers) : les entrées sont des onglets horizontaux (barre role="tablist" sous le titre centré), chacune avec son titre court (`heading`), sa description et ses puces (`bullets`),
// l'image à gauche et le panneau à droite ; mêmes mécaniques que la liste (épinglage, image par entrée). Sans JavaScript la barre d'onglets est absente et les panneaux sont empilés.
import img from "../img.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, photo, alt, items, initial = 0, overlap = false, variant, step, anchor, layout = "list" }, { index }) => {
  const id = `sty-${index}`;
  // Images distinctes (dans l'ordre des entrées) : le numéro de celle d'une entrée sert à l'échange.
  const photos = [...new Map(items.map((item) => [item.photo ?? photo, item.photo ? item.alt : alt])).entries()];
  const indexOf = (item) => photos.findIndex(([src]) => src === (item.photo ?? photo));
  const figures = photos
    .map(([src, text], i) => img({ src, alt: text, class: `sty__img${i === indexOf(items[initial]) ? "" : " is-hidden"}`, sizes: "(min-width: 901px) 36vw, 90vw" }))
    .join("\n          ");
  const tabs = layout === "tabs";
  const tabBar = tabs
    ? items
        .map((item, i) => `<button class="sty-tab" type="button" role="tab" id="${id}-tab-${i}" aria-selected="${i === initial}" aria-controls="${id}-panel-${i}"${i === initial ? "" : ' tabindex="-1"'}>${esc(item.title)}</button>`)
        .join("\n            ")
    : "";
  const panels = tabs
    ? items
        .map(
          (item, i) => `<div class="sty-panel${i === initial ? " is-active" : ""}" role="tabpanel" id="${id}-panel-${i}" aria-labelledby="${id}-tab-${i}" data-photo="${indexOf(item)}">
              <p class="sty-panel__name" aria-hidden="true">${esc(item.title)}</p>
              <h3 class="sty-panel__title">${frText(item.heading)}</h3>
              <p class="sty-panel__text">${frText(item.text)}</p>
              <ul class="sty-panel__list" role="list">
                ${item.bullets.map((bullet) => `<li>${frText(bullet)}</li>`).join("\n                ")}
              </ul>
            </div>`,
        )
        .join("\n            ")
    : "";
  const rows = items
    .map(
      (item, i) => `<li class="sty-row" data-photo="${indexOf(item)}">
              <h3 class="sty-row__title">${esc(item.title)}</h3>
              <p class="sty-row__text">${frText(item.text)}</p>
            </li>`,
    )
    .join("\n            ");
  // Le voile d'échange n'existe que s'il y a plusieurs images (il est invisible tant que le script ne l'allume pas).
  const veil = photos.length > 1 ? '\n          <span class="sty__veil" aria-hidden="true"></span>' : "";
  if (tabs) {
    return `<section${anchor ? ` id="${esc(anchor)}"` : ""} class="sty sty--tabs" data-bx="styles" data-layout="tabs" data-initial="${initial}"${step ? ` data-step="${step}"` : ""}${variant ? ` data-bx-variant="${esc(variant)}"` : ""} data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="sty__inner">
          <div class="section-head sty__head" data-reveal="head">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title sty__title" id="${id}-title">${titleHtml(title, tag)}</h2>
          </div>
          <div class="sty__tabs" role="tablist" aria-labelledby="${id}-title">
            ${tabBar}
          </div>
          <div class="sty__stage">
            <figure class="sty__photo">
          ${figures}${veil}
            </figure>
            <div class="sty__panels">
            ${panels}
            </div>
          </div>
        </div>
      </section>`;
  }
  return `<section${anchor ? ` id="${esc(anchor)}"` : ""} class="sty" data-bx="styles" data-initial="${initial}"${step ? ` data-step="${step}"` : ""}${overlap ? " data-overlap" : ""}${variant ? ` data-bx-variant="${esc(variant)}"` : ""} data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="sty__inner">
          <figure class="sty__photo">
          ${figures}${veil}
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
