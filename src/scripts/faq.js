// FAQ en accordéon accessible (retours-v2/docs/05-NOEL-ANIMATIONS.md §J) : un bouton par question (aria-expanded, aria-controls), un
// panneau par réponse (role region, aria-labelledby). UN SEUL panneau est ouvert à la fois, le premier d'emblée : ouvrir une réponse
// referme celle qui était ouverte, les deux animations se jouent ensemble. L'ouverture anime la hauteur jusqu'à « auto » (0,5 s,
// power3.inOut) puis rend la main au CSS : le panneau suit ensuite le redimensionnement. Le chevron pivote de 180° et change de fond
// en CSS (faq.css). Clavier : Entrée et Espace (natifs), flèches haut et bas, Début et Fin passent d'une question à l'autre.
// L'entrée (titre par mots, tag, carte d'aide, cartes en cascade) est dans reveal.js, par data-reveal.
import { gsap, ScrollTrigger, reducedMotion } from "./core.js";

const DURATION = 0.5;

export function initFaq() {
  const list = document.querySelector(".faq__list");
  if (!list) return;

  const triggers = [...list.querySelectorAll(".faq__trigger")];
  const panelOf = (button) => document.getElementById(button.getAttribute("aria-controls"));

  // La page change de hauteur : les positions des animations au scroll sont à recalculer, une fois les animations finies (une seule fois,
  // même quand une réponse s'ouvre pendant qu'une autre se ferme).
  let refreshTimer;
  const refresh = () => {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 80);
  };

  const toggle = (button, open, animate = true) => {
    const panel = panelOf(button);
    const answer = panel.firstElementChild;
    button.setAttribute("aria-expanded", String(open));
    gsap.killTweensOf([panel, answer]);

    if (!animate || reducedMotion()) {
      panel.hidden = !open;
      gsap.set([panel, answer], { clearProps: "height,opacity,visibility,transform" });
      refresh();
      return;
    }

    if (open) {
      if (panel.hidden) {
        panel.hidden = false;
        gsap.set(panel, { height: 0 });
        gsap.set(answer, { autoAlpha: 0, y: 10 });
      }
      gsap.to(panel, {
        height: "auto",
        duration: DURATION,
        ease: "power3.inOut",
        onComplete: () => {
          gsap.set(panel, { clearProps: "height" });
          refresh();
        },
      });
      gsap.to(answer, { autoAlpha: 1, y: 0, duration: DURATION, delay: 0.08, ease: "power3.out" });
    } else {
      gsap.to(answer, { autoAlpha: 0, duration: 0.2, ease: "power1.in" });
      gsap.to(panel, {
        height: 0,
        duration: DURATION,
        ease: "power3.inOut",
        onComplete: () => {
          panel.hidden = true;
          gsap.set([panel, answer], { clearProps: "height,opacity,visibility,transform" });
          refresh();
        },
      });
    }
  };

  list.addEventListener("click", (e) => {
    const button = e.target.closest(".faq__trigger");
    if (!button) return;
    // Un seul ouvert : on referme les autres. Cliquer la question ouverte la referme (aucun n'est alors ouvert).
    const open = button.getAttribute("aria-expanded") !== "true";
    if (open) triggers.filter((t) => t !== button && t.getAttribute("aria-expanded") === "true").forEach((t) => toggle(t, false));
    toggle(button, open);
  });

  list.addEventListener("keydown", (e) => {
    const index = triggers.indexOf(document.activeElement);
    if (index < 0) return;
    const target = { ArrowDown: (index + 1) % triggers.length, ArrowUp: (index - 1 + triggers.length) % triggers.length, Home: 0, End: triggers.length - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    triggers[target].focus();
  });

  // La première réponse est ouverte d'emblée : le balisage la donne déjà ouverte (sans saut), on aligne seulement l'état.
  toggle(triggers[0], true, false);
}
