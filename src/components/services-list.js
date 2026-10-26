// Liste des 6 services de l'accueil, générée depuis src/data/site.js. Chaque ligne est un lien.
import { site, href } from "../data/site.js";
import { esc } from "./utils.js";

const rows = site.services
  .map(
    (s) => `<li>
          <a class="service-row" href="${esc(href(s))}">
            <span class="service-row__n" aria-hidden="true">${s.n}</span>
            <span class="service-row__title" data-text="${esc(s.label)}">${esc(s.label)}</span>
            <span class="service-row__text">${esc(s.text)}</span>
            <span class="service-row__rule" aria-hidden="true"></span>
          </a>
        </li>`,
  )
  .join("\n        ");

export default () => `<ul class="services__list">
        ${rows}
      </ul>`;
