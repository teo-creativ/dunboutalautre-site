// Index du blog : l'article mis en avant (le premier, en grand format) puis la grille des articles. Une carte = photo (ou tuile
// « Photo [À compléter] »), date, titre, extrait, lien. Date et extrait sont à fournir (todo). Le titre est le lien accessible ; la photo
// est un lien à la souris seulement. Les deux intitulés de section (« ARTICLE MIS EN AVANT », « LES 4 ARTICLES DE LANCEMENT ») sont les
// titres de structure du copywriting : seuls les lecteurs d'écran les entendent. Un article sans page pointe vers « # ».
import { linkTo } from "../links.js";
import { frText, placeholder } from "../placeholder.js";
import { esc, fr } from "../utils.js";

const tile = () => `<div class="placeholder-tile" aria-hidden="true"><span>Photo ${placeholder("photo de l'article")}</span></div>`;

const card = (item, readLabel, kind) => {
  const to = esc(linkTo(item.path));
  return `<article class="article-card article-card--${kind}">
            <a class="article-card__photo" href="${to}" tabindex="-1" aria-hidden="true">${tile()}</a>
            <div class="article-card__body">
              <p class="article-card__date">${frText(item.date)}</p>
              <h3 class="article-card__title"><a class="article-card__link" href="${to}">${esc(fr(item.title))}</a></h3>
              <p class="article-card__excerpt">${frText(item.excerpt)}</p>
              <p class="article-card__more"><a class="article-card__read" href="${to}" aria-hidden="true" tabindex="-1">${esc(readLabel)}</a></p>
            </div>
          </article>`;
};

export default ({ featuredLabel, gridLabel, readFeatured, readMore, items }, { index }) => {
  const id = `articles-${index}`;
  const [featured, ...others] = items;
  return `<section class="articles" data-header-theme="light" data-header-gradient="cream" aria-labelledby="${id}-featured ${id}-grid">
        <div class="articles__inner">
          <h2 class="sr-only" id="${id}-featured">${esc(featuredLabel)}</h2>
          <div class="articles__featured" data-reveal="up">
          ${card(featured, readFeatured, "featured")}
          </div>
          <h2 class="sr-only" id="${id}-grid">${esc(gridLabel)}</h2>
          <ul class="articles__grid">
          ${others.map((item) => `<li data-reveal="up" data-reveal-step="0.1">${card(item, readMore, "grid")}</li>`).join("\n          ")}
          </ul>
        </div>
      </section>`;
};
