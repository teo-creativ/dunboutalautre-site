// FAQ en accordéon. Chaque réponse est dans un panneau `hidden` : src/scripts/faq.js l'ouvre avec une animation.
// Sans JavaScript, le <noscript> de noel-seo.js affiche toutes les réponses.
import { noel } from "../data/noel.js";
import { esc } from "./utils.js";

const item = ({ q, a }, i) => `<div class="faq__item" data-reveal="up">
          <h3 class="faq__q">
            <button class="faq__trigger" type="button" id="faq-q${i + 1}" aria-expanded="false" aria-controls="faq-a${i + 1}">
              <span class="faq__q-text">${esc(q)}</span>
              <span class="faq__icon" aria-hidden="true"></span>
            </button>
          </h3>
          <div class="faq__panel" id="faq-a${i + 1}" role="region" aria-labelledby="faq-q${i + 1}" hidden>
            <p class="faq__a">${esc(a)}</p>
          </div>
        </div>`;

export default () => `<div class="faq__list">
        ${noel.faq.map(item).join("\n        ")}
      </div>`;
