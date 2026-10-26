// Remplissage d'un title tag (retours-v2 01 §2) : le fond de la pilule (.tag__bg) se dessine de gauche à droite en clip-path
// avec un rayon de pilule (les extrémités restent des demi-cercles, contrairement à un scaleX), puis le texte (.tag__text)
// apparaît. Partagé par l'intro, la section orange, « Notre approche », les chiffres clés, le menu et les révélations.
import { gsap } from "./core.js";

const PILL = "999px"; // --radius-pill
export const TAG_HIDDEN = `inset(0% 100% 0% 0% round ${PILL})`;
export const TAG_SHOWN = `inset(0% 0% 0% 0% round ${PILL})`;

const parts = (tag) => ({ bg: tag.querySelector(".tag__bg"), text: tag.querySelector(".tag__text") });

// État de départ : fond replié, texte transparent. À appeler avant de jouer fillTag quand l'élément doit rester caché d'ici là.
export function hideTags(tags) {
  const list = [...tags].map(parts);
  gsap.set(list.map((p) => p.bg), { clipPath: TAG_HIDDEN });
  gsap.set(list.map((p) => p.text), { opacity: 0, y: 6 });
}

// Remet le style d'origine (le CSS reprend : fond plein, texte visible).
export function clearTags(tags) {
  const list = [...tags].map(parts);
  gsap.set(list.flatMap((p) => [p.bg, p.text]), { clearProps: "clipPath,opacity,transform" });
}

// Ajoute à une timeline le remplissage d'un tag à l'instant `at` : le fond d'abord, le texte vers la moitié du trajet.
export function fillTag(tl, tag, at, { duration = 0.7, ease = "power3.out" } = {}) {
  const { bg, text } = parts(tag);
  return tl
    .fromTo(bg, { clipPath: TAG_HIDDEN }, { clipPath: TAG_SHOWN, duration, ease }, at)
    .fromTo(text, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: duration * 0.6, ease: "power2.out" }, at + duration * 0.45);
}
