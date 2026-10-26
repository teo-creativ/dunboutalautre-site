// Flux horizontal de photos (retours-v2/docs/05-NOEL-ANIMATIONS.md §D et §E) : sur le fond orange, le titre et le CTA apparaissent au
// centre puis restent fixes, toujours au-dessus des photos, qui défilent de la droite vers la gauche à des vitesses différentes
// (profondeur) et sortent par la gauche. La première est la photo « Notre volonté » devenue vignette (noel-volonte.js).
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";
import { fillTag } from "./tag.js";

// Distance parcourue par une photo de vitesse 1 sur toute la durée du flux, en largeurs d'écran. Mesurée sur les frames 07 à 11 :
// le portail (vitesse 1,5) parcourt 64 % de la largeur, d'où 0,43. Les photos parties de la droite ne sortent pas complètement avant
// l'arrivée des univers, comme sur les frames (docs/POINTS-A-VALIDER.md, ligne 85).
const TRAVEL = 0.43;

export function addFlux(tl, { stage, T }) {
  const layer = stage.querySelector(".flux");
  const title = layer.querySelector(".flux__title");
  const tag = title.querySelector(".tag");
  const cta = layer.querySelector(".flux__content .cta");
  const width = () => stage.clientWidth;

  // ---------- Titre et CTA : mots depuis un masque, tag qui se remplit, CTA qui monte ----------
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  tl.fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.06 }, T.title);
  fillTag(tl, tag, T.title + 0.4, { duration: 0.3 });
  // Opacité seule : le CTA reste atteignable au clavier avant son entrée (noel-stage.js amène alors le scroll jusqu'à lui). Sans clic
  // possible tant qu'il est invisible : la couche qui le porte passe sinon par-dessus le CTA du hero.
  tl.fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, T.cta).set(cta, { pointerEvents: "auto" }, T.cta);

  // ---------- Photos : elles apparaissent pendant la réduction, puis défilent ----------
  const photos = [...layer.querySelectorAll(".flux__photo:not(.flux__photo--thumb)")];
  tl.fromTo(photos, { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out", stagger: 0.06 }, T.photosIn);

  const travel = (el) => () => -TRAVEL * width() * Number(el.dataset.speed);
  photos.forEach((li) => tl.to(li, { x: travel(li), duration: T.fluxDur, ease: "none" }, T.flux));
  // La vignette est la grande photo « Notre volonté » : son cadre (clip-path) se déplace avec elle, à la vitesse de la vignette.
  const thumb = layer.querySelector(".flux__photo--thumb");
  tl.to(stage.querySelector(".volonte__media"), { x: travel(thumb), duration: T.fluxDur, ease: "none" }, T.flux);
}
