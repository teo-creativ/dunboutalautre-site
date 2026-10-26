// Nos univers (retours-v2/docs/05-NOEL-ANIMATIONS.md §F) : la section crème arrive depuis la droite, par-dessus le flux orange. Celui-ci
// glisse de 10 % vers la gauche pendant la superposition (profondeur) et son titre s'estompe. À l'arrivée, la photo-carte finit sa
// mise en place, puis le label, le titre (mots depuis un masque, tag qui se remplit) et la liste (montée de 16 px, en cascade) se
// révèlent, toujours en scrub. Les interactions (survol, focus, tap) sont dans universes.js.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";
import { fillTag } from "./tag.js";

export function addUnivers(tl, { stage, T }) {
  const layer = stage.querySelector(".univers");
  const card = layer.querySelector(".univers__card");
  const flux = stage.querySelector(".flux");
  const label = layer.querySelector(".univers__body > .label");
  const title = layer.querySelector(".univers__title");
  const tag = title.querySelector(".tag");
  const items = layer.querySelectorAll(".universe");
  const at = T.univers;

  tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: T.universDur, ease: "none" }, at)
    // Les photos du flux (pas le titre, qui reste en place sur les frames 12 et 13) glissent de 10 % de la largeur vers la gauche.
    .to(flux.querySelector(".flux__photos"), { x: () => -0.1 * stage.clientWidth, duration: T.universDur, ease: "none" }, at)
    .to(flux.querySelector(".flux__content"), { opacity: 0.4, duration: T.universDur, ease: "none" }, at)
    // À l'arrivée, la photo-carte finit sa mise en place.
    .fromTo(card, { scale: 0.94, opacity: 0.6 }, { scale: 1, opacity: 1, duration: T.universDur, ease: "none" }, at)
    // La section ne reçoit survol et clic qu'une fois en place (la couche est sans événements tant qu'elle recouvre le flux).
    .set(layer, { pointerEvents: "auto" }, at + T.universDur);

  // Label, titre et liste : l'état de départ est posé par le premier rendu de la timeline, la section est hors écran.
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, at + 0.35)
    .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 0.3, ease: "power3.out", stagger: 0.04 }, at + 0.38);
  fillTag(tl, tag, at + 0.55, { duration: 0.25 });
  // Opacité seule : un bouton pas encore révélé reste dans l'arbre d'accessibilité et atteignable au clavier (noel-stage.js amène le scroll).
  tl.fromTo(items, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out", stagger: 0.06 }, at + 0.45);
}
