// Section crème de la page Réalisations (V4, frames realisations-14 à 19) : 7 filtres géants (boutons à bascule, compteur entre
// parenthèses) et la grille des cartes. Tout est rendu dans l'état de départ du script (src/scripts/projets-grid.js) : filtre « Tous »,
// 8 cartes visibles, le reste en `hidden`, grille repliée (dégradé) et bouton « Voir plus » présents. Rien ne bouge donc au chargement.
// Sans JavaScript, la page de realisations/index.html débloque les cartes, masque filtres et bouton et retire le dégradé.
// Le titre est le lien accessible d'une carte ; la photo est un lien à la souris seulement (tabindex -1, aria-hidden : même cible).
import { cta } from "../cta.js";
import img from "../img.js";
import { linkTo } from "../links.js";
import { frText } from "../placeholder.js";
import { esc, fr } from "../utils.js";

export default ({ label, filters, items, pageSize, more, micro }, { index }) => {
  const id = `projets-${index}`;
  const labelOf = (key) => filters.find((f) => f.key === key)?.label;
  const count = (key) => (key === "all" ? items.length : items.filter((item) => item.category === key).length);

  const buttons = filters
    .map(
      (f, i) =>
        `<button class="pfilter" type="button" data-filter="${esc(f.key)}" aria-pressed="${i === 0}"><span class="pfilter__text">${esc(fr(f.label))}</span><span class="pfilter__count">(${count(f.key)})</span></button>`,
    )
    .join("\n            ");

  const cards = items
    .map((item, i) => {
      const to = linkTo(item.to ?? "#none");
      const todo = item.todo ? " data-todo" : "";
      return `<li class="pcard" data-category="${esc(item.category)}"${todo}${i >= pageSize ? " hidden" : ""}>
              <article class="pcard__inner">
                <a class="pcard__photo" href="${esc(to)}" tabindex="-1" aria-hidden="true">${img({ src: item.photo.src, alt: item.photo.alt, class: "pcard__img", sizes: "(min-width: 901px) 680px, 92vw" })}</a>
                <div class="pcard__body">
                  <h3 class="pcard__title"><a class="pcard__link" href="${esc(to)}">${frText(item.title)}</a></h3>
                  <p class="pcard__category">${esc(fr(labelOf(item.category)))}</p>
                </div>
              </article>
            </li>`;
    })
    .join("\n            ");

  const button = cta({ label: more, variant: "solid", tag: "button", className: "pmore__btn" });
  return `<section class="projets" id="projets" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-title" data-page-size="${pageSize}" data-shown="${esc(micro.shown)}" data-shown-one="${esc(micro.shownOne)}" data-more="${esc(micro.more)}" data-more-one="${esc(micro.moreOne)}">
        <div class="projets__inner">
          <h2 class="label" id="${id}-title"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</h2>
          <div class="pfilters" role="group" aria-label="${esc(micro.groupLabel)}">
            ${buttons}
          </div>
          <div class="pgrid" data-collapsed>
            <ul class="pgrid__list">
            ${cards}
            </ul>
          </div>
          <div class="pmore">${button}</div>
          <p class="sr-only" role="status" aria-live="polite" data-status></p>
        </div>
      </section>`;
};
