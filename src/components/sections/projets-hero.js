// Scène d'ouverture de la page Réalisations (V4, frames realisations-01 à 15) : hero orange « Nos projets. » (V8 : sans compteur) dont les photos montent à
// des vitesses différentes, puis la photo des tournesols qui grandit jusqu'au plein écran et porte le texte et le CTA. C'est le même
// principe que la landing Noël : position des photos en variables CSS (x, w en vw ; y en svh ; ratio), vitesse en data-speed, lues par
// src/scripts/projets-stage.js, qui les épingle dans une seule scène. Sans animation (mouvement réduit, sans JavaScript, ou sous la
// largeur où elle est désactivée), les deux blocs restent empilés et lisibles (projets-hero.css).
// Le titre porte .hero__title : src/scripts/intro.js le révèle comme celui des autres pages.
import { readFileSync } from "node:fs";
import { cta } from "../cta.js";
import img from "../img.js";
import { photoVars, placePhotos } from "../gallery.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

const manifestUrl = new URL("../../../public/assets/optimized/manifest.json", import.meta.url);
// Largeur sur hauteur d'une image : le CSS dimensionne la grande photo en « cover » à partir d'elle, et le script en tire sa carte.
const ratioOf = (src) => {
  const entry = JSON.parse(readFileSync(manifestUrl, "utf8"))[src];
  if (!entry) throw new Error(`projets-hero : « ${src} » absent du manifeste (lancer npm run images)`);
  return (entry.w / entry.h).toFixed(4);
};

export default ({ heading, photos, big, label, statement, tag, cta: ctaLabel }) => {
  // Retours V8 (G5, components/gallery.js) : deux photos d'une même colonne forment une pile (`under`, `gap` dans les données) : celle du dessous part sous l'autre, à l'écart de sa
  // hauteur, et ne monte pas plus vite : aucune ne se recouvre, au chargement comme au scroll, quelle que soit la taille de l'écran. Position et dimensions sont en CSS dès le premier rendu.
  const placed = placePhotos(photos);
  const items = photos
    .map(
      (p, i) =>
        `<li class="phero__photo" style="${photoVars(placed[i])}" data-speed="${placed[i].wide.speed}"${p.mobile ? "" : ' data-mobile="off"'}>${img({ src: p.src, alt: p.alt, sizes: "(min-width: 901px) 21vw, 40vw", loading: "eager" })}</li>`,
    )
    .join("\n            ");
  return `<div class="pstage" id="pstage">
        <section class="phero" aria-labelledby="phero-title">
          <div class="phero__inner">
            <h1 class="hero__title phero__title" id="phero-title">${esc(fr(heading))}</h1>
          </div>
          <ul class="phero__photos">
            ${items}
          </ul>
          <div class="phero__top" aria-hidden="true"></div>
        </section>
        <section class="pphoto" aria-labelledby="pphoto-title">
          <div class="pphoto__media" style="--ratio: ${ratioOf(big.src)}">
            ${img({ src: big.src, alt: big.alt, class: "pphoto__img", sizes: "100vw" })}
            <div class="pphoto__veil"></div>
            <div class="pphoto__dim"></div>
          </div>
          <div class="pphoto__content">
            <p class="label label--light"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="pphoto__title" id="pphoto-title">${titleHtml(statement, tag, "cream")}</h2>
            ${cta({ label: ctaLabel, variant: "on-orange" })}
          </div>
        </section>
      </div>`;
};
