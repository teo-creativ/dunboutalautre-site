// FAQ en accordéon accessible : un bouton par question (aria-expanded, aria-controls), un panneau par réponse.
// L'ouverture anime la hauteur jusqu'à « auto » puis rend la main au CSS : le panneau suit ensuite le redimensionnement.
// Clavier : Entrée et Espace (natifs), flèches haut et bas, Début et Fin pour passer d'une question à l'autre.
import { gsap, ScrollTrigger, reducedMotion } from "./core.js";

export function initFaq() {
  const list = document.querySelector(".faq__list");
  if (!list) return;

  const triggers = [...list.querySelectorAll(".faq__trigger")];
  // La page change de hauteur : les positions des animations au scroll sont à recalculer, une fois l'animation finie.
  const refresh = () => ScrollTrigger.refresh();

  const toggle = (button, open, animate = true) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    const answer = panel.firstElementChild;
    button.setAttribute("aria-expanded", String(open));
    gsap.killTweensOf([panel, answer]);

    if (!animate || reducedMotion()) {
      panel.hidden = !open;
      gsap.set([panel, answer], { clearProps: "height,opacity,visibility,transform" });
      return;
    }

    if (open) {
      if (panel.hidden) {
        panel.hidden = false;
        gsap.set(panel, { height: 0 });
        gsap.set(answer, { autoAlpha: 0, y: 14 });
      }
      gsap.to(panel, {
        height: "auto",
        duration: 0.7,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(panel, { clearProps: "height" });
          refresh();
        },
      });
      gsap.to(answer, { autoAlpha: 1, y: 0, duration: 0.6, delay: 0.1, ease: "power3.out" });
    } else {
      gsap.to(answer, { autoAlpha: 0, duration: 0.2 });
      gsap.to(panel, {
        height: 0,
        duration: 0.45,
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
    if (button) toggle(button, button.getAttribute("aria-expanded") !== "true");
  });

  list.addEventListener("keydown", (e) => {
    const index = triggers.indexOf(document.activeElement);
    if (index < 0) return;
    const target = { ArrowDown: (index + 1) % triggers.length, ArrowUp: (index - 1 + triggers.length) % triggers.length, Home: 0, End: triggers.length - 1 }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    triggers[target].focus();
  });

  // La première réponse est ouverte d'emblée : on voit tout de suite à quoi sert la section.
  toggle(triggers[0], true, false);
}
