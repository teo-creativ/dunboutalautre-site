// Galerie « Vos bureaux deviennent vivant » de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §9, frames bureaux-43 à 48 et 54) :
// fond orange, étiquette, titre à pastille crème et bouton fixes au centre, et quatre photos qui montent derrière eux (même technique que le flux
// vertical de Noël, sans le cercle : scripts/bureaux-galerie.js). Position et taille de chaque photo en variables CSS (x et w en vw, y en svh,
// ratio ; mx, my, mw sous 900 px) et vitesse de montée en data-speed, comme les photos de Noël ; une photo sans version mobile porte
// data-mobile="off" (trois photos seulement sur un écran étroit). `sizes` suit la largeur réelle de chaque photo : à 1x, la photo de gauche (32 vw)
// est lue en 800 px et non en 480 (elle serait agrandie d'un sixième). Sans animation (mouvement réduit, JavaScript absent) : le texte, puis les
// photos en grille (bureaux-galerie.css).
import { cta } from "../cta.js";
import img from "../img.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, cta: button, photos }, { index }) => {
  const id = `bx-gal-${index}`;
  const items = photos
    .map(({ photo, alt, x, y, w, ratio, speed, mobile }) => {
      const vars = { x, y, w, ratio, ...(mobile && { mx: mobile.x, my: mobile.y, mw: mobile.w }) };
      const style = Object.entries(vars)
        .map(([name, value]) => `--${name}: ${value}`)
        .join("; ");
      return `<li class="gal__photo" style="${style}" data-speed="${speed}"${mobile ? ` data-speed-mobile="${mobile.speed}"` : ' data-mobile="off"'}>${img({ src: photo, alt, sizes: `(min-width: 901px) ${w}vw, ${mobile ? mobile.w : 40}vw` })}</li>`;
    })
    .join("\n          ");
  return `<section class="gal" data-bx="galerie" data-header-gradient="orange" aria-labelledby="${id}-title">
        <div class="gal__content">
          <p class="label label--light"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="section-title gal__title" id="${id}-title">${titleHtml(title, tag, "cream")}</h2>
          <div class="gal__cta">${cta({ label: button, variant: "on-orange" })}</div>
        </div>
        <ul class="gal__photos" role="list">
          ${items}
        </ul>
      </section>`;
};
