// Titre dont une expression est mise en title tag. Le tag est une sous-chaîne exacte du titre : la phrase du copywriting n'est jamais
// modifiée (scripts/check-site.js le contrôle). Aucun espace n'est ajouté ni retiré autour du tag.
// La ponctuation qui suit le tag lui reste collée (span.nobr) : sans cela, quand le tag remplit la ligne, le point final passe seul
// à la ligne suivante.
import { tag } from "./tag.js";
import { esc, fr } from "./utils.js";

export const titleHtml = (title, tagText, variant = "orange") => {
  const at = tagText ? title.indexOf(tagText) : -1;
  if (at < 0) return esc(fr(title));
  const after = title.slice(at + tagText.length);
  const punctuation = after.match(/^[.,;:!?…)»]+/)?.[0] ?? "";
  return `${esc(fr(title.slice(0, at)))}<span class="nobr">${tag({ text: tagText, variant })}${esc(punctuation)}</span>${esc(fr(after.slice(punctuation.length)))}`;
};
