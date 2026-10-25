// Références de Noël (4 lignes, même principe que la liste des services) et emplacement du témoignage client.
import { noel } from "../data/noel.js";
import { esc } from "./utils.js";

const row = (r) => `<li class="ref" data-reveal="up">
          <h3 class="ref__name">${esc(r.name)}</h3>
          <p class="ref__text">${esc(r.text)}</p>
          <span class="ref__rule" aria-hidden="true"></span>
        </li>`;

export default () => `<ul class="refs__list">
        ${noel.references.map(row).join("\n        ")}
      </ul>
      <figure class="refs__quote" data-reveal="up">
        <blockquote><p>${esc(noel.testimonial.quote)}</p></blockquote>
        <figcaption>${esc(noel.testimonial.author)}</figcaption>
      </figure>`;
