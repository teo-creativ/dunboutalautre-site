// Cartes de texte d'une page secondaire : label, titre (title tag compris), phrase d'introduction facultative, puis des cartes blanches
// (titre, texte, et en option : logo du client, liste de faits « Durée : … », lien, ligne « Idéal pour »). Aucune icône : le design n'en
// fournit pas. Les valeurs peuvent être des todo(). Un `logo` null est un logo non fourni : [À compléter] ; absent, la carte n'en a pas.
import { logos } from "../../data/logos.js";
import { linkTo } from "../links.js";
import { frText, placeholder, text } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

// Colonnes : une par carte jusqu'à 4, trois au-delà (5 cartes : 3 puis 2).
const columns = (count) => (count <= 4 ? count : 3);

const logoOf = (card) => {
  if (!("logo" in card)) return "";
  if (!card.logo) return `\n            <p class="card__logo card__logo--missing">${placeholder(`logo ${card.title}`)}</p>`;
  const file = logos[card.logo];
  if (!file) throw new Error(`cards : logo « ${card.logo} » absent de src/data/logos.js`);
  return `\n            <img class="card__logo" src="/assets/logos-clients/${file.file}" width="${file.w}" height="${file.h}" alt="" loading="lazy" />`;
};

const factsOf = (card) =>
  card.facts
    ? `\n            <dl class="card__facts">${card.facts.map(({ label, value }) => `<div><dt>${esc(label)}</dt> <dd>${frText(value)}</dd></div>`).join("")}</dl>`
    : "";

export default ({ label, title, tag, lead, items, useLabel = "Idéal pour" }, { index }) => {
  const id = `cards-${index}`;
  const cards = items
    .map(
      (card) => `<li class="card" data-reveal="up" data-reveal-step="0.1">${logoOf(card)}
            <h3 class="card__title">${text(card.title)}</h3>
            <p class="card__text">${frText(card.text)}</p>${factsOf(card)}${card.link ? `\n            <p class="card__more"><a class="card__link" href="${esc(linkTo(card.link.to))}">${esc(fr(card.link.label))}</a></p>` : ""}${card.use ? `\n            <p class="card__use"><span class="card__use-label">${esc(useLabel)}</span> ${frText(card.use)}</p>` : ""}
          </li>`,
    )
    .join("\n          ");
  return `<section class="cards" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="cards__inner">
          <div class="section-head" data-reveal="head">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title cards__title" id="${id}-title">${titleHtml(title, tag)}</h2>
          </div>${lead ? `\n          <p class="cards__lead" data-reveal="up">${esc(fr(lead))}</p>` : ""}
          <ul class="cards__list" style="--cols: ${columns(items.length)}">
          ${cards}
          </ul>
        </div>
      </section>`;
};
