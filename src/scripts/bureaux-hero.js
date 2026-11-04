// Hero de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §1, frames bureaux-01 à 04). L'entrée est celle des autres hero
// (intro.js). Sortie : le hero reste en place un écran de scroll pendant que la section crème « Chiffres clés » monte par-dessus et
// que son contenu s'estompe. Même technique que « Nos univers » sur la page Noël : le hero est épinglé un écran de plus (le
// pin-spacer ajoute cet écran), la section suivante remonte d'un écran par une marge négative (bureaux-hero.css), donc le scroll total
// n'augmente pas. Sans mouvement ou sous 900 px : pas d'épinglage, les sections restent empilées.
import { gsap } from "./core.js";

// Opacité du contenu mesurée sur les frames : 1 à 15 % de la sortie (frame 02), 0,77 à 37 % (frame 03), 0,59 à 63 % (frame 04), soit une
// pente constante de 0,15 à 1. Le contenu ne bouge pas : il est à la même ordonnée sur les frames 01, 03 et 04 (le doc parlait de -40 px,
// la frame fait foi, docs/POINTS-A-VALIDER.md).
const FADE_FROM = 0.15; // part de la sortie où l'estompage commence
const FADE_TO = 0.3; // opacité quand le crème a tout recouvert

export function initBureauxHero() {
  const hero = document.querySelector('[data-bx="hero"]');
  const next = hero?.nextElementSibling; // la section qui monte par-dessus (lue avant le pin, qui insère un espaceur)
  if (!hero || !next) return;
  const inner = hero.querySelector(".hero__inner");

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const root = document.documentElement;
    root.classList.add("bx-hero-anim"); // la section crème remonte d'un écran (bureaux-hero.css)
    // Bureaux : la section est .stats--bx, que le CSS connaît. Autre page (Design, V6) : on la marque, la règle est la même (bx-hero-next).
    const mark = !next.matches('[data-bx="chiffres"]');
    if (mark) next.classList.add("bx-hero-next");
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: () => `+=${hero.offsetHeight}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(inner, { opacity: 1 }, { opacity: FADE_TO, duration: 1 - FADE_FROM }, FADE_FROM)
      .set({}, {}, 1); // fixe la durée de la timeline à 1 : l'estompage finit avec le pin
    return () => {
      if (mark) next.classList.remove("bx-hero-next");
      root.classList.remove("bx-hero-anim");
    };
  });
}
