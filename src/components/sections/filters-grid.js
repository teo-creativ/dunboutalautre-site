// Grille des réalisations avec ses filtres (docs/copywriting/09-realisations.md) : une carte par projet (photo, titre, badge de catégorie),
// issue de src/data/realisations.js (les projets de l'accueil). Le titre est le lien accessible ; la photo est un lien à la souris seulement
// (tabindex -1, aria-hidden : même cible, docs/POINTS-A-VALIDER.md ligne 90). Les filtres sont des boutons aria-pressed, masqués tant que
// src/scripts/realisations-filter.js ne les active pas (sans JavaScript, tous les projets sont affichés). La catégorie vient de
// data.categories ; sans catégorie, le badge est [À compléter] et le projet n'apparaît que sous « Tous les projets ».
import { realisations } from "../../data/realisations.js";
import img from "../img.js";
import { linkTo } from "../links.js";
import { placeholder } from "../placeholder.js";
import { esc, fr } from "../utils.js";

const basename = (photo) => photo.split("/").at(-1);

export default ({ label, filters, categories, links, micro }, { index }) => {
  const id = `grid-${index}`;
  const labelOf = (key) => filters.find((f) => f.key === key)?.label;
  const cards = realisations
    .map((project) => {
      const slug = basename(project.photo);
      const category = categories[slug] ?? null;
      const to = linkTo(links[slug] ?? "#none");
      return `<li class="project" data-category="${category ?? "none"}" data-reveal="up" data-reveal-step="0.08">
            <article class="project__card">
              <a class="project__photo" href="${esc(to)}" tabindex="-1" aria-hidden="true">${img({ src: project.photo, alt: project.alt, class: "project__img", sizes: "(min-width: 901px) 30vw, 90vw" })}</a>
              <div class="project__body">
                <h3 class="project__title"><a class="project__link" href="${esc(to)}">${esc(fr(project.title))}</a></h3>
                <p class="project__badge">${category ? esc(labelOf(category)) : placeholder(`catégorie de ${project.title}`)}</p>
              </div>
            </article>
          </li>`;
    })
    .join("\n          ");
  const buttons = filters
    .map((f, i) => `<button class="filter" type="button" data-filter="${f.key}" aria-pressed="${i === 0}">${esc(fr(f.label))}</button>`)
    .join("\n            ");
  return `<section class="projects" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title" data-count-one="${esc(micro.countOne)}" data-count-many="${esc(micro.countMany)}">
        <div class="projects__inner">
          <h2 class="sr-only" id="${id}-title">${esc(label)}</h2>
          <div class="filters" role="group" aria-label="${esc(micro.groupLabel)}" hidden>
            ${buttons}
          </div>
          <p class="projects__count" role="status" aria-live="polite"></p>
          <ul class="projects__grid">
          ${cards}
          </ul>
          <p class="projects__empty" hidden>${esc(micro.empty)}</p>
        </div>
      </section>`;
};
