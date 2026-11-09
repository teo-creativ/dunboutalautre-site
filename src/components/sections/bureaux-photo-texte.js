// Texte sur photo plein écran (V7 : « Le branding végétal » de Terrasses, « Notre volonté » de Décoration ; frames terrasses-02 à 06 et
// decoration-02 à 06) : la photo monte par-dessus le hero, qui reste en place (scripts/bureaux-hero.js), puis la section est tenue un écran pendant
// que la suivante (« styles ») monte par-dessus (scripts/bureaux-hold.js, `data-bx-hold`). Sous le voile : une étiquette et un paragraphe à deux
// pastilles, l'une orange à texte crème, l'autre crème à texte orange (`tags`, sous-chaînes exactes du texte). Tout est dans le DOM, sans animation
// propre : le texte monte avec la photo.
// V8 : `reveal` (Terrasses) pose le composant reveal-on-enter (scripts/reveal-on-enter.js) : l'étiquette et le paragraphe (lignes sous masque, pastilles droites) se révèlent quand la
// section arrive, la photo (avec son voile, dans `ptx__media`, pour qu'ils soient rognés ensemble) par clip-path de bas en haut avec une parallaxe douce.
import img from "../img.js";
import { withTags } from "../tags-text.js";
import { esc } from "../utils.js";

export default ({ label, photo, alt, text, tags, variant, reveal }, { index }) => {
  const id = `ptx-${index}`;
  const part = (name) => (reveal ? ` data-reveal-part="${name}"` : "");
  const figure = `<figure class="ptx__photo">${img({ src: photo, alt, sizes: "100vw" })}</figure>
        <div class="ptx__veil" aria-hidden="true"></div>`;
  return `<section class="ptx" data-bx="ptx" data-bx-hold${reveal ? ' data-reveal="enter" data-reveal-start="top 55%"' : ""}${variant ? ` data-bx-variant="${esc(variant)}"` : ""} aria-labelledby="${id}-label">
        ${reveal ? `<div class="ptx__media"${part("photo")}>
        ${figure}
        </div>` : figure}
        <div class="ptx__text">
          <p class="label label--light" id="${id}-label"${part("eyebrow")}><span class="label__dot" aria-hidden="true"></span>${esc(label)}</p>
          <p class="ptx__p"${part("title")}>${withTags(text, tags)}</p>
        </div>
      </section>`;
};
