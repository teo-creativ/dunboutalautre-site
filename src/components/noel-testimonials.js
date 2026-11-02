// Témoignages (retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md §6, frame noel-page-16), générés depuis src/data/noel.js.
// Carrousel accessible : région « carousel », un seul avis visible à la fois (les autres portent l'attribut hidden), zone aria-live
// polite pour annoncer le changement, boutons précédent et suivant, position « Avis 2 sur 4 » lue par les lecteurs d'écran dans
// chaque avis. Sans JavaScript, les quatre avis sont affichés l'un sous l'autre (feuille <noscript> de noel-seo.js) et les flèches,
// inutiles, restent cachées : src/scripts/testimonials.js les montre. Pas de lecture automatique.
// testimonialsSection() rend n'importe quels avis pour les pages secondaires (valeurs possibles : todo()) ; un avis unique reçoit
// data-single, que page.css utilise pour garder les flèches cachées. L'export par défaut rend ceux de Noël, octet pour octet comme avant.
// `bx` (page Bureaux V5, frames 36 et 41) : le bloc porte data-bx="avis" (scripts/bureaux-avis.js l'épingle pendant que la galerie monte par-dessus),
// ses flèches restent visibles même avec un seul avis, alors inertes (aria-disabled), et un avis peut porter le logo de son client (`logo`, clé de
// src/data/logos.js) après le poste. Sans `bx`, aucune de ces sorties : le HTML de Noël et des autres pages ne change pas.
import { readFileSync } from "node:fs";
import { logos } from "../data/logos.js";
import { noel } from "../data/noel.js";
import { text } from "./placeholder.js";
import { esc } from "./utils.js";

// Icône de guillemets : SVG inline, couleur pilotée par currentColor (le fichier porte le hex de l'orange en dur).
const icon = readFileSync(new URL("../../public/assets/brand/icon-testimonial.svg", import.meta.url), "utf8")
  .replace(/<svg[^>]*>/, '<svg class="testi__icon" viewBox="0 0 70 57" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">')
  .replace(/fill="#[0-9A-Fa-f]{6}"/g, 'fill="currentColor"');

const chevron = (direction) =>
  `<svg viewBox="0 0 10 16" width="10" height="16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${direction === "left" ? "M8 1.5 1.8 8 8 14.5" : "M2 1.5 8.2 8 2 14.5"}"/></svg>`;

const { label, items } = noel.testimonials; // valeurs par défaut : les avis de la landing Noël

const logoOf = (t) => {
  if (!t.logo) return "";
  const file = logos[t.logo];
  if (!file) throw new Error(`testimonials : logo « ${t.logo} » absent de src/data/logos.js`);
  return ` <img class="testi__logo" src="/assets/logos-clients/${file.file}" width="${file.w}" height="${file.h}" alt="${esc(file.name)}" loading="lazy" />`;
};

export const testimonialsSection = ({ label, items, bx }) => {

const slides = items
  .map(
    (t, i) => `<div class="testi__slide" role="group" aria-roledescription="avis" aria-label="Avis ${i + 1} sur ${items.length}"${t.fictif ? ' data-fictif="true"' : ""}${i ? " hidden" : ""}>
              <p class="sr-only">Avis ${i + 1} sur ${items.length}</p>
              <figure class="testi__figure">
                <blockquote class="testi__quote"><p>${text(t.quote)}</p></blockquote>
                <figcaption class="testi__author"><span class="testi__name">${text(t.name)}</span><span class="testi__role">${text(t.role)}${logoOf(t)}</span></figcaption>
              </figure>
            </div>`,
  )
  .join("\n            ");

// Un seul avis : les flèches ne servent à rien, la page les cache (data-single) sauf avec `bx`, où la maquette les montre : inertes.
const inert = bx && items.length === 1 ? ' aria-disabled="true"' : "";

return `<section id="temoignages" class="testi"${bx ? ' data-bx="avis"' : ""} data-header-theme="light" data-header-gradient="cream" aria-roledescription="carousel" aria-labelledby="testi-label"${items.length === 1 && !bx ? " data-single" : ""}>
        <div class="testi__inner">
          <div class="testi__side">
            ${icon}
            <div class="testi__nav" hidden>
              <button class="testi__arrow testi__arrow--prev" type="button" aria-label="Avis précédent"${inert}>${chevron("left")}</button>
              <button class="testi__arrow testi__arrow--next" type="button" aria-label="Avis suivant"${inert}>${chevron("right")}</button>
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
};

export default () => testimonialsSection({ label, items });
