// Bandeau de confiance : logos clients en niveaux de gris. Le HTML est une simple rangée ; src/scripts/marquee.js la
// duplique et la fait défiler. Le logo d'Eataly manque : texte provisoire avec la mention [À compléter].
import { noel } from "../data/noel.js";
import { esc } from "./utils.js";

const item = (logo) =>
  logo.text
    ? `<li class="trust__item"><span class="trust__text">${esc(logo.name)}</span><span class="trust__todo">${esc(noel.placeholder)}</span></li>`
    : `<li class="trust__item"><img class="trust__logo trust__logo--${logo.tone} trust__logo--${logo.size}" src="/assets/logos-clients/${logo.file}" width="${logo.w}" height="${logo.h}" alt="${esc(logo.name)}" loading="lazy" decoding="async" /></li>`;

export default () => `<ul class="trust__list">
          ${noel.trust.map(item).join("\n          ")}
        </ul>`;
