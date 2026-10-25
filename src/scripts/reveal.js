// Révélations à l'entrée dans l'écran (landing Noël), réversibles au scroll arrière.
// - [data-reveal="head"] : label qui monte, titre mot à mot sous masque, title tags qui se remplissent (comme l'accueil).
// - [data-reveal="title"] : titre seul, même révélation.
// - [data-reveal="up"] : élément qui monte en fondu ; ceux qui entrent ensemble arrivent en cascade.
// Les états de départ sont aussi posés en CSS (html.js, noel.css) : aucun flash avant l'initialisation.
import { gsap, ScrollTrigger, SplitText } from "./core.js";

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
      const split = SplitText.create(title, { type: "words", mask: "words", ignore: ".tag" });
      const tags = title.querySelectorAll(".tag");

      gsap.set(split.words, { yPercent: 110 });
      gsap.set(tags, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(title, { autoAlpha: 1 });
      const tl = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
      if (label) {
        gsap.set(label, { autoAlpha: 0, y: 12 });
        tl.to(label, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0);
      }
      tl.to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.06 }, 0.1).to(
        tags,
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, ease: "power3.out", stagger: 0.12 },
        0.55,
      );

      // end: "max" : si on saute au-delà du titre, la révélation est quand même jouée.
      ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        end: "max",
        onToggle: (self) => (self.isActive ? tl.play() : tl.reverse()),
      });
    });

    if (items.length) {
      gsap.set(items, { autoAlpha: 0, y: 36 });
      ScrollTrigger.batch(items, {
        start: "top 90%",
        end: "max",
        onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, overwrite: true }),
        onLeaveBack: (batch) => gsap.to(batch, { autoAlpha: 0, y: 36, duration: 0.4, ease: "power2.in", overwrite: true }),
      });
    }
  });
}
