// Corps d'un article de blog : lien de retour, métadonnées (auteur, date, temps de lecture), photo de couverture, intertitres et
// paragraphes, puis le lien vers la page de service liée. Toutes les valeurs de l'article sont des todo() tant qu'il n'est pas rédigé :
// aucun texte inventé. Les libellés (micro) sont de la microcopie de navigation, à valider (docs/POINTS-A-VALIDER.md).
import img from "../img.js";
import { linkTo } from "../links.js";
import { frText, placeholder, text } from "../placeholder.js";
import { esc } from "../utils.js";

export default ({ photo, meta, body, service, micro }) => `<article class="article" data-header-theme="light" data-header-gradient="cream">
        <div class="article__inner">
          <p class="article__back"><a class="article__back-link" href="${esc(linkTo(micro.back.to))}">${esc(micro.back.label)}</a></p>
          <dl class="article__meta">
            ${["author", "date", "reading"].map((key) => `<div><dt>${esc(micro.meta[key])}</dt> <dd>${text(meta[key])}</dd></div>`).join("\n            ")}
          </dl>
          <figure class="article__cover">${photo ? img({ src: photo.src, alt: photo.alt, class: "article__img", sizes: "(min-width: 901px) 60vw, 90vw" }) : `<div class="placeholder-tile" aria-hidden="true"><span>Photo ${placeholder("photo de couverture")}</span></div>`}</figure>
          <div class="article__body">
          ${body.map((part) => `<h2 class="article__heading">${text(part.heading)}</h2>\n          <p class="article__text">${frText(part.text)}</p>`).join("\n          ")}
          </div>
          <p class="article__service">${esc(micro.serviceLead)} <a class="article__service-link" href="${esc(linkTo(service.to))}">${esc(service.label)}</a></p>
        </div>
      </article>`;
