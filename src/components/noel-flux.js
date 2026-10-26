// Photos du flux horizontal de la landing Noël (retours-v2/docs/05-NOEL-ANIMATIONS.md §E), générées depuis src/data/noel.js.
// Position de départ et taille en variables CSS (x et w en vw, y et h en svh, lues aussi par src/scripts/noel-flux.js), vitesse en
// data-speed. La vignette (thumb) n'a pas d'image : c'est la photo « Notre volonté » qui rétrécit et prend sa place. Cet élément
// masqué ne porte que sa position, lue par la scène. En mobile et en mouvement réduit, les quatre autres photos sont en grille.
import { noel } from "../data/noel.js";
import img from "./img.js";

const items = noel.flux.photos
  .map((p) => {
    const style = `--x: ${p.x}; --y: ${p.y}; --w: ${p.w}; --h: ${p.h}`;
    if (p.thumb) return `<li class="flux__photo flux__photo--thumb" style="${style}" data-speed="${p.speed}" hidden></li>`;
    return `<li class="flux__photo" style="${style}" data-speed="${p.speed}">${img({ src: p.src, alt: p.alt, sizes: "(min-width: 901px) 22vw, 44vw" })}</li>`;
  })
  .join("\n          ");

export default () => `<ul class="flux__photos">
          ${items}
        </ul>`;
