// « Ce qu'on installe dans vos bureaux » de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §3, frames bureaux-06 à 19) : un
// titre, puis 5 cartes « photo + carte blanche de texte ». Sans animation (JavaScript absent, mouvement réduit) les cartes sont l'une
// sous l'autre ; scripts/bureaux-installe.js épingle la section et les fait traverser l'écran de droite à gauche.
// Aucune carte de ce type n'existe sur l'accueil (les services y sont des lignes) : le composant est neuf, au style des cartes de
// chiffres clés (carte blanche, rayon, ombre, rotation). `use` : trois mots-clés séparés par une virgule, rendus en liste à puces.
import img from "../img.js";
import { frText } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

export default ({ label, title, tag, items }, { index }) => {
  const id = `bx-installe-${index}`;
  const cards = items
    .map(
      ({ title: name, text, use, photo, alt }) => `<li class="install-card">
          ${img({ src: photo, alt, class: "install-card__photo", sizes: "(min-width: 901px) 18vw, 86vw" })}
          <div class="install-card__body">
            <h3 class="install-card__title">${esc(name)}</h3>
            <p class="install-card__text">${frText(text)}</p>
            <ul class="install-card__uses">${use
              .split(", ")
              .map((word) => `<li>${esc(word)}</li>`)
              .join("")}</ul>
          </div>
        </li>`,
    )
    .join("\n        ");
  return `<section class="install" data-bx="installe" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="install__head section-head" data-reveal="head">
          <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <h2 class="section-title" id="${id}-title">${titleHtml(title, tag)}</h2>
        </div>
        <ul class="install__track">
        ${cards}
        </ul>
      </section>`;
};
