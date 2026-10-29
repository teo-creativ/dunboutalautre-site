// Frise de logos clients d'une page secondaire (« RÉFÉRENCES CLIENTS »), ou, tant que la liste est à fournir, une ligne `empty` en [À compléter] : label, titre (title tag compris), logos en niveaux de gris
// (DESIGN.md §5.9) et bouton vers les réalisations. Chaque client est { name } avec { logo } (clé de src/data/logos.js) ; sans logo
// fourni, son nom s'affiche en texte avec [À compléter]. src/scripts/logos.js en fait un défilement continu (sans JavaScript ou en
// mouvement réduit : la liste reste statique et passe à la ligne).
import { cta } from "../cta.js";
import { logos } from "../../data/logos.js";
import { linkTo } from "../links.js";
import { placeholder } from "../placeholder.js";
import { titleHtml } from "../title.js";
import { esc } from "../utils.js";

const base = "/assets/logos-clients";

export default ({ label, title, tag, items, empty, cta: button }, { index }) => {
  const id = `logos-${index}`;
  const list = items
    .map(({ name, logo }) => {
      const file = logo && logos[logo];
      if (logo && !file) throw new Error(`logos : « ${logo} » absent de src/data/logos.js`);
      return file
        ? `<li class="logo"><img class="logo__img" src="${base}/${file.file}" width="${file.w}" height="${file.h}" alt="${esc(file.name)}" loading="lazy" /></li>`
        : `<li class="logo logo--missing"><span class="logo__name">${esc(name)}</span>${placeholder(`logo ${name}`)}</li>`;
    })
    .join("\n          ");
  return `<section class="logos" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title">
        <div class="logos__inner">
          ${
            title
              ? `<div class="section-head" data-reveal="head">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title logos__title" id="${id}-title">${titleHtml(title, tag)}</h2>
          </div>`
              : `<h2 class="label" id="${id}-title" data-reveal="up"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</h2>`
          }
          ${
            items.length
              ? `<ul class="logos__list" role="list">
          ${list}
          </ul>`
              : `<p class="logos__empty" data-reveal="up">${esc(empty.text)} ${placeholder(empty.value.todo)}</p>`
          }${button ? `\n          <div class="logos__cta" data-reveal="up">${cta({ label: button.label, variant: "on-cream", href: linkTo(button.to) })}</div>` : ""}
        </div>
      </section>`;
};
