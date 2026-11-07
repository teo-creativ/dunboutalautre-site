// Paragraphe à pastilles : chaque pastille est une sous-chaîne exacte du texte, la ponctuation qui la suit lui reste collée (comme titleHtml).
// Partagé par la galerie de Design (« Le branding végétal ») et le texte sur photo des pages Terrasses et Décoration (V7).
import { tag as tagHtml } from "./tag.js";
import { esc, fr } from "./utils.js";

export const withTags = (text, tags) => {
  let rest = text;
  let html = "";
  for (const { text: word, variant } of tags) {
    const at = rest.indexOf(word);
    if (at < 0) throw new Error(`tags-text : pastille « ${word} » absente du texte`);
    const after = rest.slice(at + word.length);
    const punctuation = after.match(/^[.,;:!?…)»]+/)?.[0] ?? "";
    html += `${esc(fr(rest.slice(0, at)))}<span class="nobr">${tagHtml({ text: word, variant })}${esc(punctuation)}</span>`;
    rest = after.slice(punctuation.length);
  }
  return html + esc(fr(rest));
};
