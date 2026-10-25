// Les 5 univers de Noël. Trois d'entre eux n'ont pas encore de photo : un aplat de couleur avec la feuille décorative
// et la mention [À compléter] tient la place (docs/CONTENU-NOEL.md).
import { noel } from "../data/noel.js";
import { esc } from "./utils.js";
import img from "./img.js";
import { leaf } from "./leaf.js";

const media = (u) => {
  const n = `<span class="universe__n" aria-hidden="true">${u.n}</span>`;
  if (u.photo) {
    const { src, alt } = noel.photos[u.photo];
    return `<div class="universe__media">${img({ src, alt, sizes: "(min-width: 900px) 40vw, 90vw" })}${n}</div>`;
  }
  return `<div class="universe__media universe__media--${u.tone}">${leaf("universe__leaf")}<span class="universe__todo">Photo ${esc(noel.placeholder)}</span>${n}</div>`;
};

const card = (u) => `<li class="universe" data-reveal="up">
          ${media(u)}
          <div class="universe__body">
            <h3 class="universe__title"><span>${esc(u.title)}</span></h3>
            <p class="universe__text">${esc(u.text)}</p>
            <p class="universe__for-label">Idéal pour</p>
            <ul class="universe__chips">
              ${u.for.map((f) => `<li>${esc(f)}</li>`).join("\n              ")}
            </ul>
          </div>
        </li>`;

export default () => `<ul class="universes__list">
        ${noel.universes.map(card).join("\n        ")}
      </ul>`;
