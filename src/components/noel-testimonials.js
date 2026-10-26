// Témoignages (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md §6, frame noel-page-16), générés depuis src/data/noel.js.
// Carrousel accessible : région « carousel », un seul avis visible à la fois (les autres portent l'attribut hidden), zone aria-live
// polite pour annoncer le changement, boutons précédent et suivant, position « Avis 2 sur 4 » lue par les lecteurs d'écran dans
// chaque avis. Sans JavaScript, les quatre avis sont affichés l'un sous l'autre (feuille <noscript> de noel-seo.js) et les flèches,
// inutiles, restent cachées : src/scripts/testimonials.js les montre. Pas de lecture automatique.
import { readFileSync } from "node:fs";
import { noel } from "../data/noel.js";
import { esc } from "./utils.js";

// Icône de guillemets : SVG inline, couleur pilotée par currentColor (le fichier porte le hex de l'orange en dur).
const icon = readFileSync(new URL("../../public/assets/brand/icon-testimonial.svg", import.meta.url), "utf8")
  .replace(/<svg[^>]*>/, '<svg class="testi__icon" viewBox="0 0 70 57" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">')
  .replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="currentColor"');

const chevron = (direction) =>
  `<svg viewBox="0 0 10 16" width="10" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${direction === "left" ? "M8 1.5 1.8 8 8 14.5" : "M2 1.5 8.2 8 2 14.5"}"/></svg>`;

const { label, items } = noel.testimonials;

const slides = items
  .map(
    (t, i) => `<figure class="testi__slide" role="group" aria-roledescription="avis" aria-label="Avis ${i + 1} sur ${items.length}"${t.fictif ? ' data-fictif="true"' : ""}${i ? " hidden" : ""}>
              <p class="sr-only">Avis ${i + 1} sur ${items.length}</p>
              <blockquote class="testi__quote"><p>${esc(t.quote)}</p></blockquote>
              <figcaption class="testi__author"><span class="testi__name">${esc(t.name)}</span><span class="testi__role">${esc(t.role)}</span></figcaption>
            </figure>`,
  )
  .join("\n            ");

export default () => `<section id="temoignages" class="testi" data-header-theme="light" data-header-gradient="cream" aria-roledescription="carousel" aria-labelledby="testi-label">
        <div class="testi__inner">
          <div class="testi__side">
            ${icon}
            <div class="testi__nav" hidden>
              <button class="testi__arrow testi__arrow--prev" type="button" aria-label="Avis précédent">${chevron("left")}</button>
              <button class="testi__arrow testi__arrow--next" type="button" aria-label="Avis suivant">${chevron("right")}</button>
            </div>
          </div>
          <div class="testi__main">
            <h2 class="label" id="testi-label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</h2>
            <div class="testi__slides" aria-live="polite">
            ${slides}
            </div>
          </div>
        </div>
      </section>`;
