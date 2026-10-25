// Scène épinglée de l'accueil : hero, cercle orange, photos en perspective et photo qui grandit forment une seule
// timeline pilotée par le scroll. Une unité de timeline vaut un écran de scroll, donc un seul pin, aucun espace vide
// entre le hero et la section orange, et aucun flash au dégagement du pin.
import { gsap, ScrollTrigger } from "./core.js";
import { addCircle } from "./hero-circle.js";
import { addOrangeText, addPhotos } from "./photos-scroll.js";

// Calendrier (en écrans de scroll). Desktop : 4,2 écrans, dont 3 pour la section orange et la photo qui grandit.
// Mobile : 2 écrans, avec 2 photos seulement (ANIMATIONS.md §12).
const DESKTOP = {
  total: 4.2,
  circle: 1, heroFade: 0.45, leavesFade: 0.6,
  title: 1, titleDur: 0.35, cta: 1.2,
  // Carte : rest est l'instant où elle atteint sa pose CSS (frame 04), duration règle sa vitesse (plus courte = plus
  // rapide), z négatif la recule (plus petite, plus lente en apparence).
  cards: [
    { index: 0, rest: 2, duration: 1.54, z: -200, rx: 6, rot: -1.5, dx: 40 },
    { index: 1, rest: 2, duration: 1.45, z: -100, rx: 4, rot: 2, dx: -50 },
    { index: 2, rest: 2.05, duration: 1.74, z: -300, rx: 8, rot: -2, dx: 30 },
    { index: 3, rest: 2.1, duration: 1.37, z: 0, rx: 3, rot: 1.5, dx: -40 },
  ],
  // Photo large : carte de 38 % de la largeur, ratio 1,81:1, posée à 70 % de la hauteur (frame 07).
  card: { width: 0.384, ratio: 1.81, top: 0.7 },
  appear: 2.55, appearDur: 0.4, grow: 2.95, growDur: 0.6,
  contentFade: 3.05, contentFadeDur: 0.4,
  veil: 3.55, veilDur: 0.3, text: 3.85, textDur: 0.35,
};

const MOBILE = {
  total: 2,
  circle: 0.7, heroFade: 0.32, leavesFade: 0.42,
  title: 0.7, titleDur: 0.3, cta: 0.85,
  cards: [
    { index: 0, rest: 1.15, duration: 0.85, z: -150, rx: 4, rot: -1.5, dx: 20 },
    { index: 2, rest: 1.25, duration: 0.9, z: -250, rx: 6, rot: 2, dx: -20 },
  ],
  card: { width: 0.8, ratio: 1.81, top: 0.72 },
  appear: 1.15, appearDur: 0.25, grow: 1.4, growDur: 0.4,
  contentFade: 1.45, contentFadeDur: 0.25,
  veil: 1.7, veilDur: 0.15, text: 1.85, textDur: 0.15,
};

export function initStage() {
  const stage = document.getElementById("stage");
  if (!stage) return;

  // Le pin ajoute de la hauteur de page : on ne laisse pas le navigateur restaurer un scroll calculé sans elle.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      const T = conditions.desktop ? DESKTOP : MOBILE;
      const root = document.documentElement;
      root.classList.add("stage-anim");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: () => `+=${T.total * stage.offsetHeight}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const ctx = { stage, T };
      addCircle(tl, ctx);
      addOrangeText(tl, ctx);
      addPhotos(tl, ctx);
      tl.set({}, {}, T.total); // fixe la durée : 1 unité de timeline = 1 écran de scroll

      // Les polices changent la hauteur du texte : les positions mesurées sont à relire quand elles sont chargées.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => root.classList.remove("stage-anim");
    },
  );
}
