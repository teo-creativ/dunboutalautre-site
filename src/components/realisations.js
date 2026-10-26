// Section Réalisations de l'accueil : liste de titres à gauche, pile de photos à droite, générées depuis src/data/realisations.js.
// Un seul balisage pour tous les modes : en desktop avec mouvement, src/scripts/realisations.js épingle la section et fait défiler
// les deux colonnes ensemble ; en mobile ou en mouvement réduit, le CSS les entrelace en cartes (titre puis photo), voir realisations.css.
// Les titres sont les liens accessibles ; les photos sont des liens à la souris seulement (tabindex -1, aria-hidden), car chaque
// photo mène au même endroit que son titre (docs/POINTS-A-VALIDER.md, ligne 90).
import { realisations } from "../data/realisations.js";
import { href } from "../data/site.js";
import { esc } from "./utils.js";
import img from "./img.js";

const titles = realisations
  .map(
    (r, i) => `<li class="real-title" style="--i: ${i}">
              <a class="real-title__link" href="${esc(href(r))}">
                <span class="real-title__dot" aria-hidden="true"></span>
                <span class="real-title__text">${esc(r.title)}<span class="real-title__line" aria-hidden="true"></span></span>
              </a>
            </li>`,
  )
  .join("\n            ");

const photos = realisations
  .map(
    (r, i) => `<li class="real-photo" style="--i: ${i}">
              <a href="${esc(href(r))}" tabindex="-1" aria-hidden="true">${img({ src: r.photo, alt: r.alt, sizes: "(min-width: 901px) 43.3vw, 100vw" })}</a>
            </li>`,
  )
  .join("\n            ");

export default () => `<section id="realisations" class="realisations" data-header-gradient="olive" aria-labelledby="realisations-label">
        <div class="realisations__pin">
          <h2 class="label label--light realisations__label" id="realisations-label"><span class="label__dot" aria-hidden="true"></span>RÉALISATIONS</h2>
          <div class="realisations__window">
            <ul class="realisations__list">
            ${titles}
            </ul>
          </div>
          <div class="realisations__media" aria-hidden="true">
            <ul class="realisations__photos">
            ${photos}
            </ul>
          </div>
          <div class="realisations__dim" aria-hidden="true"></div>
        </div>
      </section>`;
