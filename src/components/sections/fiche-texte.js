// Bloc de texte de la fiche projet (intro « Un défilé qui prend racine. », défi) : titre centré avec sa pastille, paragraphes centrés dont les mots
// clés passent à l'orange (une étoile les entoure dans les données). src/scripts/fiche.js révèle la pastille, puis le titre mot à mot, puis
// les paragraphes ligne par ligne, puis allume les mots clés.
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

// Texte échappé, typographie française, mots clés enveloppés : « *une ambiance végétale* » devient <span class="kw">…</span>.
const rich = (text) => esc(fr(text)).replace(/\*([^*]+)\*/g, '<span class="kw">$1</span>');

export default ({ variant, heading, tag, paragraphs }, { index }) => `<section class="ftext ftext--${esc(variant)}" data-header-theme="light" data-header-gradient="cream" aria-labelledby="ftext-title-${index}">
        <h2 class="ftext__title" id="ftext-title-${index}">${titleHtml(heading, tag, "orange")}</h2>
        <div class="ftext__body">
          ${paragraphs.map((text) => `<p class="ftext__p">${rich(text)}</p>`).join("\n          ")}
        </div>
      </section>`;
