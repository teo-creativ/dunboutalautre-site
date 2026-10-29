// Fiche projet : le parcours Avant, Projet, Après (docs/copywriting/09-realisations.md). Trois blocs empilés, chacun avec son titre, sa
// photo (ou, faute de photo, la tuile « Photo [À compléter] ») et une liste de faits (terme, valeur). Tout est piloté par la section de
// données : une valeur inconnue est un todo(). Le lien de retour (micro.back) est de la microcopie de navigation, à valider.
import img from "../img.js";
import { linkTo } from "../links.js";
import { frText, placeholder } from "../placeholder.js";
import { esc, fr } from "../utils.js";

const media = (photo) =>
  photo
    ? `<figure class="case__media">${img({ src: photo.src, alt: photo.alt, class: "case__img", sizes: "(min-width: 901px) 45vw, 90vw" })}</figure>`
    : `<figure class="case__media"><div class="placeholder-tile" aria-hidden="true"><span>Photo ${placeholder("photo")}</span></div></figure>`;

const block = ({ heading, photo, facts }, n) => `<section class="case__block" aria-labelledby="case-${n}-title" data-reveal="up">
            ${media(photo)}
            <div class="case__body">
              <h2 class="case__title" id="case-${n}-title"><span class="case__step" aria-hidden="true">${n}</span>${esc(heading)}</h2>
              <dl class="case__facts">
                ${facts.map(({ label, value }) => `<div class="case__fact"><dt>${esc(fr(label))}</dt><dd>${frText(value)}</dd></div>`).join("\n                ")}
              </dl>
            </div>
          </section>`;

export default ({ avant, projet, apres, micro }) => `<div class="case" data-header-theme="light" data-header-gradient="cream">
        <div class="case__inner">
          <p class="case__back"><a class="case__back-link" href="${esc(linkTo(micro.back.to))}">${esc(micro.back.label)}</a></p>
          ${[avant, projet, apres].map((part, i) => block(part, i + 1)).join("\n          ")}
        </div>
      </div>`;
