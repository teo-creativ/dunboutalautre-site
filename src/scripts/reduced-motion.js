// Mouvement réduit (ANIMATIONS.md §12) : aucun pin, aucune parallaxe, aucune cascade (chaque module s'efface de lui-même).
// Les blocs hors écran à l'ouverture apparaissent par un fondu de 200 ms en entrant dans l'écran, rien de plus.
// Ceux déjà visibles ne bougent pas, et sans JavaScript tout reste affiché.
import { gsap, ScrollTrigger } from "./core.js";

const BLOCKS = ".experience__content, .approach__content, .real-title, .real-photo, .service-row, .stats__intro, .stat-card, [data-reveal]";

export function initReducedMotion() {
  gsap.matchMedia().add("(prefers-reduced-motion: reduce)", () => {
    const blocks = [...document.querySelectorAll(BLOCKS)].filter((el) => el.getBoundingClientRect().top > window.innerHeight);
    if (!blocks.length) return;
    gsap.set(blocks, { opacity: 0 });
    ScrollTrigger.batch(blocks, {
      start: "top 92%",
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, duration: 0.2, ease: "none", overwrite: true }),
    });
  });
}
