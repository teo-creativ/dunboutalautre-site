// Révélations à l'entrée dans l'écran (landing Noël), réversibles au scroll arrière.
// - [data-reveal="head"] : label qui monte, titre mot à mot sous masque, title tags qui se remplissent (comme l'accueil).
// - [data-reveal="title"] : titre seul, même révélation.
// - [data-reveal="up"] : élément qui monte en fondu ; ceux qui entrent ensemble arrivent en cascade.
// Les états de départ sont aussi posés en CSS (html.js, noel.css) : aucun flash avant l'initialisation.
// Opacité seule (jamais visibility) : un contenu pas encore révélé reste dans l'arbre d'accessibilité et atteignable au clavier,
// le navigateur le fait défiler dans l'écran, ce qui déclenche sa révélation.
import { gsap, ScrollTrigger, SplitText } from "./core.js";
import { fillTag, hideTags } from "./tag.js";

export function initReveal() {
  const heads = [...document.querySelectorAll('[data-reveal="head"], [data-reveal="title"]')];
  const items = [...document.querySelectorAll('[data-reveal="up"]')];
  if (!heads.length && !items.length) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    heads.forEach((el) => {
      const isHead = el.dataset.reveal === "head";
      const title = isHead ? el.querySelector(".section-title") : el;
      const label = isHead ? el.querySelector(".label") : null;
      const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
      const tags = title.querySelectorAll(".tag");

      gsap.set(split.words, { yPercent: 110 });
      hideTags(tags);
      gsap.set(title, { opacity: 1 });
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      if (label) {
        gsap.set(label, { opacity: 0, y: 12 });
        tl.to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0);
      }
      tl.to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.1);
      tags.forEach((tag, i) => fillTag(tl, tag, 0.55 + i * 0.12));

      // end: "max" : si on saute au-delà du titre, la révélation est quand même jouée.
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "max",
        onToggle: (self) => (self.isActive ? tl.play() : tl.reverse()),
      });
    });

    if (items.length) {
      gsap.set(items, { opacity: 0, y: 36 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        end: "max",
        // Décalage plafonné : après un saut (ancre, focus clavier), un grand lot ne met pas plus d'une demi-seconde à se révéler.
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: (i) => Math.min(i * 0.12, 0.5), overwrite: true }),
        onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 36, duration: 0.4, ease: "power2.in", overwrite: true }),
      });

      // Clavier : au bord bas de l'écran, un élément focalisé n'a pas encore franchi le seuil de révélation. Il apparaît
      // aussitôt : le focus ne doit jamais se trouver sur un élément invisible.
      const reveal = (e) => gsap.to(e.currentTarget, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
      items.forEach((item) => item.addEventListener("focusin", reveal));
      return () => items.forEach((item) => item.removeEventListener("focusin", reveal));
    }
  });
}
