// Soulignement orange qui se dessine de gauche à droite et se retire vers la droite (réalisations, univers, étapes de la timeline).
// Le trait est un élément .uline (underline.css) dont deux variables CSS (--l et --r, en %) rognent les bords gauche et droit. Elles
// sont animées par un objet simple recopié dans le style : GSAP perd la trace d'une variable CSS dont le tween est interrompu (son
// cache n'est plus à jour, un set final restait sans effet), ce qui laissait un trait coincé après un scroll rapide.
import { gsap } from "./core.js";

export function createMark(line) {
  const state = { l: 0, r: 100 }; // 0 / 100 : trait invisible, 0 / 0 : trait entier
  const paint = () => {
    line.style.setProperty("--l", state.l);
    line.style.setProperty("--r", state.r);
  };
  const reset = () => {
    state.l = 0;
    state.r = 100;
    paint();
  };
  paint();

  return {
    // Dessine de gauche à droite. Interrompt un retrait en cours : le trait repart de là où il en est.
    show(duration = 0.45) {
      gsap.killTweensOf(state);
      gsap.to(state, { l: 0, r: 0, duration, ease: "power3.out", onUpdate: paint });
    },
    // Retire vers la droite, puis se remet prêt à être redessiné depuis la gauche.
    hide(duration = 0.35) {
      gsap.killTweensOf(state);
      gsap.to(state, { l: 100, r: 0, duration, ease: "power2.in", onUpdate: paint, onComplete: reset });
    },
    // Sans animation : état initial (trait entier ou absent).
    set(on) {
      gsap.killTweensOf(state);
      state.l = 0;
      state.r = on ? 0 : 100;
      paint();
    },
    kill: () => gsap.killTweensOf(state),
  };
}
