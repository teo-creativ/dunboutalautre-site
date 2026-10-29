// Titre dont une expression est mise en title tag. Le tag est une sous-chaîne exacte du titre : la phrase du copywriting n'est jamais
// modifiée (scripts/check-site.js le contrôle). Aucun espace n'est ajouté ni retiré autour du tag.
import { tag } from "./tag.js";
import { esc, fr } from "./utils.js";

export const titleHtml = (title, tagText, variant = "orange") => {
  const at = tagText ? title.indexOf(tagText) : -1;
  if (at < 0) return esc(fr(title));
  return `${esc(fr(title.slice(0, at)))}${tag({ text: tagText, variant })}${esc(fr(title.slice(at + tagText.length)))}`;
};
