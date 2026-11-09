// Photos du flux vertical de la landing Noël (retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md §4), générées depuis src/data/noel.js.
// Position et taille en variables CSS (x, w en vw ; y en svh ; ratio ; mx, mw, my sous 900 px), vitesse de montée en data-speed, lue par
// src/scripts/noel-flux.js. Une photo sans version mobile porte data-mobile="off" : le CSS la masque sous 900 px. Sans animation
// (mouvement réduit), les photos sont une grille simple (noel-stage.css).
import { noel } from "../data/noel.js";
import { photoVars, placePhotos } from "./gallery.js";
import img from "./img.js";

// Position, écart sous la photo du dessus et vitesse de chaque photo : components/gallery.js (V8, G5 : aucune photo n'en recouvre une autre ni le texte).
const placed = placePhotos(noel.flux.photos);
const items = noel.flux.photos
  .map((p, i) => {
    const { wide, mobile } = placed[i];
    return `<li class="flux__photo" style="${photoVars(placed[i])}" data-speed="${wide.speed}"${mobile ? ` data-speed-mobile="${mobile.speed}"` : ' data-mobile="off"'}>${img({ src: p.src, alt: p.alt, sizes: "(min-width: 901px) 22vw, 44vw" })}</li>`;
  })
  .join("\n          ");

export default () => `<ul class="flux__photos">
          ${items}
        </ul>`;
