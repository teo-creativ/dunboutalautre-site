// Bloc de texte d'une page secondaire : un ou plusieurs paragraphes, avec en option un label et un titre (title tag compris).
// Sans label ni titre (l'intro de Terrasses n'a qu'un paragraphe), le bloc n'est pas une section nommée : un <div> suffit.
import { titleHtml } from "../title.js";
import { esc, fr } from "../utils.js";

export default ({ label, title, tag, paragraphs }, { index }) => {
  const id = `intro-${index}`;
  const named = Boolean(label);
  const head = !named
    ? ""
    : title
      ? `<div class="section-head" data-reveal="head">
            <p class="label"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
            <h2 class="section-title intro__title" id="${id}-title">${titleHtml(title, tag)}</h2>
          </div>`
      : `<h2 class="label" id="${id}-title"><span class="label__dot" aria-hidden="true"></span>${esc(label)}</h2>`;
  const body = paragraphs.map((p) => `<p class="intro__text" data-reveal="up">${esc(fr(p))}</p>`).join("\n          ");
  return `<${named ? "section" : "div"} class="intro" data-header-theme="light" data-header-gradient="cream"${named ? ` aria-labelledby="${id}-title"` : ""}>
        <div class="intro__inner">
          ${head}
          ${body}
        </div>
      </${named ? "section" : "div"}>`;
};
