// Photos du flux vertical de la landing Noël (retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md §4), générées depuis src/data/noel.js.
// Position et taille en variables CSS (x, w en vw ; y en svh ; ratio ; mx, mw, my sous 900 px), vitesse de montée en data-speed, lue par
// src/scripts/noel-flux.js. Une photo sans version mobile porte data-mobile="off" : le CSS la masque sous 900 px. Sans animation
// (mouvement réduit), les photos sont une grille simple (noel-stage.css).
import { noel } from "../data/noel.js";
import img from "./img.js";

const items = noel.flux.photos
  .map((p) => {
    const vars = { x: p.x, y: p.y, w: p.w, ratio: p.ratio, ...(p.mobile && { mx: p.mobile.x, mw: p.mobile.w, my: p.mobile.y }) };
    const style = Object.entries(vars)
      .filter(([, value]) => value !== undefined)
      .map(([name, value]) => `--${name}: ${value}`)
      .join("; ");
    const mobile = p.mobile ? "" : ' data-mobile="off"';
    return `<li class="flux__photo" style="${style}" data-speed="${p.speed}"${mobile}>${img({ src: p.src, alt: p.alt, sizes: "(min-width: 901px) 22vw, 44vw" })}</li>`;
  })
  .join("\n          ");

export default () => `<ul class="flux__photos">
          ${items}
        </ul>`;
