// Galerie de 6 images en 3 colonnes décalées : 3 photos de Noël et 3 emplacements provisoires.
import { noel } from "../data/noel.js";
import { esc } from "./utils.js";
import img from "./img.js";
import { leaf } from "./leaf.js";

const tile = (t) => {
  if (t.placeholder) {
    return `<figure class="tile tile--todo" style="--ratio: ${t.ratio}" data-reveal="up">${leaf("tile__leaf")}<span class="tile__todo">Photo ${esc(noel.placeholder)}</span></figure>`;
  }
  const { src, alt } = noel.photos[t.photo];
  return `<figure class="tile" style="--ratio: 3 / 4" data-reveal="up"><div class="tile__frame">${img({ src, alt, sizes: "(min-width: 900px) 30vw, 90vw" })}</div></figure>`;
};

export default () => {
  const cols = [0, 2, 4].map((i) => `<div class="gallery__col">${noel.gallery.slice(i, i + 2).map(tile).join("")}</div>`);
  return `<div class="gallery__grid">
        ${cols.join("\n        ")}
      </div>`;
};
