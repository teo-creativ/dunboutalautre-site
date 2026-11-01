// Bloc photo et coordonnées de la page Contact (retours-v4/docs/03-CONTACT.md §3, frames contact-04 à 10) : la photo, collée au bord gauche
// de l'écran et arrondie à droite seulement, s'ouvre de gauche à droite en montant (src/scripts/contact.js) ; les coordonnées apparaissent
// ensuite ligne par ligne. Les valeurs sont lues dans src/data/site.js (e-mail, téléphone, Instagram), jamais écrites ici : les valeurs
// définitives sont à trancher (docs/POINTS-A-VALIDER.md). Chaque ligne est un lien (mailto:, tel:, Instagram) ; l'Instagram s'affiche sans « @ ».
import img from "../img.js";
import { site } from "../../data/site.js";
import { esc } from "../utils.js";

const ICON = `<svg class="coords__icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="0.9" aria-hidden="true" focusable="false"><rect x="1.6" y="1.6" width="12.8" height="12.8" rx="3.6"/><circle cx="8" cy="8" r="3.1"/><circle cx="11.8" cy="4.2" r="0.5" fill="currentColor" stroke="none"/></svg>`;

// `hint` : texte pour les lecteurs d'écran seulement (le nom de la plateforme, que l'icône porte à l'oeil).
const line = (href, text, { icon = "", hint = "", external = false } = {}) =>
  `<li class="coords__item"><a class="coords__link" href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${hint ? `<span class="sr-only">${esc(hint)} : </span>` : ""}<span class="coords__mask"><span class="coords__text">${icon}<span>${esc(text)}</span></span></span>${external ? '<span class="sr-only"> (nouvel onglet)</span>' : ""}</a></li>`;

export default ({ label, photo }, { index }) => {
  const id = `coords-${index}`;
  return `<section class="coords" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-label">
        <div class="coords__photo">
          <div class="coords__frame">
            ${img({ src: photo.src, alt: photo.alt, sizes: "(min-width: 901px) 41vw, 90vw", class: "coords__img", loading: "lazy" })}
          </div>
        </div>
        <div class="coords__body">
          <h2 class="coords__label" id="${id}-label">${esc(label)}</h2>
          <ul class="coords__list">
            ${line(`mailto:${site.email}`, site.email)}
            ${line(site.phone.href, site.phone.display)}
            ${line(site.instagram.href, site.instagram.label.replace(/^@/, ""), { icon: ICON, hint: "Instagram", external: true })}
          </ul>
        </div>
      </section>`;
};
