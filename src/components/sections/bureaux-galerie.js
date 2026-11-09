// Galerie « Vos bureaux deviennent vivant » de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §9, frames bureaux-43 à 48 et 54) :
// fond orange, étiquette, titre à pastille crème et bouton fixes au centre, et quatre photos qui montent derrière eux (même technique que le flux
// vertical de Noël, sans le cercle : scripts/bureaux-galerie.js). Position et taille de chaque photo en variables CSS (x et w en vw, y en svh,
// ratio ; mx, my, mw sous 900 px) et vitesse de montée en data-speed, comme les photos de Noël ; une photo sans version mobile porte
// data-mobile="off" (trois photos seulement sur un écran étroit). `sizes` suit la largeur réelle de chaque photo : à 1x, la photo de gauche (32 vw)
// est lue en 800 px et non en 480 (elle serait agrandie d'un sixième). Sans animation (mouvement réduit, JavaScript absent) : le texte, puis les
// photos en grille (bureaux-galerie.css).
import { cta } from "../cta.js";
import { linkTo } from "../links.js";
import img from "../img.js";
import { photoVars, placePhotos } from "../gallery.js";
import { withTags } from "../tags-text.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

// V7 (Décoration) : `cta` peut être { label, to } pour un bouton qui mène à une autre page (linkTo) ; une chaîne garde le bouton vers le contact.
// V6 (page Design, « logo reconstitué » puis « Le branding végétal », frames design-24 à 33) : la même galerie, sans étiquette (`label` facultatif),
// suivie d'une grande photo qui grandit jusqu'au plein écran puis d'un texte à pastilles (`grow`, scripts/bureaux-branding.js : une seule scène
// épinglée). `variant` : jeu de mesures propre à la page (data-bx-variant). Sans `grow` ni `label`, le HTML est celui de Bureaux.
// V8 : `reveal` (Bureaux, Design) pose le composant reveal-on-enter (scripts/reveal-on-enter.js) sur l'étiquette, le titre et le bouton, déclenchés quand la section arrive (data-reveal-start) ;
// les photos se révèlent par clip-path au fur et à mesure de leur entrée dans l'écran, scrubées avec la montée (bureaux-scene.js : revealPhotos), pas à l'arrivée de la section : elles
// entrent bien après (certaines partent à plus de 100 svh).
export default ({ label, title, tag, cta: button, photos, variant, grow, reveal }, { index }) => {
  const id = `bx-gal-${index}`;
  // Position, écart sous la photo du dessus et vitesse de chaque photo : components/gallery.js (V8, G5 : aucune photo n'en recouvre une autre ni le texte).
  const placed = placePhotos(photos);
  const items = photos
    .map(({ photo, alt }, i) => {
      const { wide, mobile } = placed[i];
      return `<li class="gal__photo" style="${photoVars(placed[i])}" data-speed="${wide.speed}"${mobile ? ` data-speed-mobile="${mobile.speed}"` : ' data-mobile="off"'}>${img({ src: photo, alt, sizes: `(min-width: 901px) ${wide.w}vw, ${mobile ? mobile.w : 40}vw` })}</li>`;
    })
    .join("\n          ");
  const growHtml = grow
    ? `
        <div class="gal__grow">
          <figure class="gal__grow-photo">${img({ src: grow.photo, alt: grow.alt, sizes: "100vw" })}</figure>
          <div class="gal__grow-veil" aria-hidden="true"></div>
          <div class="gal__grow-text">
            <p class="label label--light"><span class="label__dot" aria-hidden="true"></span>${esc(grow.label)}</p>
            <p class="gal__grow-p">${withTags(grow.text, grow.tags)}</p>
          </div>
        </div>`
    : "";
  const part = (name) => (reveal ? ` data-reveal-part="${name}"` : "");
  return `<section class="gal" data-bx="galerie"${reveal ? ' data-reveal="enter" data-reveal-start="top 55%"' : ""}${variant ? ` data-bx-variant="${esc(variant)}"` : ""} data-header-gradient="orange" aria-labelledby="${id}-title">
        <div class="gal__content">
          ${label ? `<p class="label label--light"${part("eyebrow")}><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          ` : ""}<h2 class="section-title gal__title" id="${id}-title"${part("title")}>${titleHtml(title, tag, "cream")}</h2>
          <div class="gal__cta"${part("cta")}>${typeof button === "string" ? cta({ label: button, variant: "on-orange" }) : cta({ label: button.label, variant: "on-orange", href: linkTo(button.to) })}</div>
        </div>
        <ul class="gal__photos" role="list">
          ${items}
        </ul>${growHtml}
      </section>`;
};
