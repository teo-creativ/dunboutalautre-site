// Scène épinglée de la landing Noël (retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md) : « Notre volonté », le cercle orange et le flux de
// photos qui montent forment une seule timeline pilotée par le scroll, comme la scène de l'accueil (stage.js). Une unité de timeline
// vaut un écran de scroll : un seul pin, aucun espace vide entre les étapes. Nos univers n'est pas dans la scène : elle la suit dans la
// page, remontée d'un écran par une marge négative, et c'est le dernier écran de scroll de la scène qui la fait monter (noel-univers.js).
// Ordinateur : le hero fait partie de la scène (la photo monte dessus). Sous 900 px : le hero reste hors de la scène, qui commence à
// « Notre volonté ». Sans mouvement (prefers-reduced-motion), les sections restent empilées (noel-stage.css).
import { gsap, scrollTo } from "./core.js";
import { keepScroll, scrollRatio } from "./scroll-memory.js";
import { addVolonte } from "./noel-volonte.js";
import { addFlux } from "./noel-flux.js";
import { addUnivers } from "./noel-univers.js";

// Calendrier (en écrans de scroll). Ordinateur : photo qui monte sur le hero 1, lecture du texte (0,8 à 1,55 puis tenue d'environ
// 0,45 écran), cercle 2 à 3,2, titre quand le cercle est à 80 %, montée des photos 2,8 à 5,5 (les premières entrent quand le cercle est
// aux deux tiers). `total` est la longueur de la scène : le dernier écran est celui de l'arrivée des univers, et les dernières photos
// finissent de sortir à son tout début.
const DESKTOP = {
  total: 6.4,
  rise: 1, heroFade: 0.7,
  text: 0.8,
  circle: 2, circleDur: 1.2,
  title: 3, cta: 3.45,
  photos: 2.8, photosDur: 2.7,
  reveal: true,
};
// Mobile : la scène commence à « Notre volonté », déjà en place. 450 vh ; les photos finissent de sortir pendant l'arrivée des univers,
// sans jamais l'atteindre (elles sont en haut de l'écran, la crème monte du bas).
const MOBILE = {
  total: 4.5,
  text: 0.05,
  circle: 1.2, circleDur: 0.8,
  title: 1.85, cta: 2.2,
  photos: 1.75, photosDur: 2.35,
  reveal: false,
};

export function initNoelStage() {
  const root = document.getElementById("nstage");
  if (!root) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => scene(root, DESKTOP));
  mm.add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => scene(root.querySelector(".nstage__flow"), MOBILE));
}

function scene(stage, T) {
  const root = document.documentElement;
  root.classList.add("nstage-anim");

  const build = () => {
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
        refreshPriority: 1, // la scène est reconstruite au changement de largeur : elle doit rester calculée avant les triggers qui la suivent
        onToggle: (self) => stage.classList.toggle("is-live", self.isActive), // will-change seulement pendant la scène (noel-stage.css)
      },
    });
    const st = tl.scrollTrigger;

    const ctx = { stage, T };
    addVolonte(tl, ctx);
    addFlux(tl, ctx);
    tl.set({}, {}, T.total); // fixe la durée : 1 unité de timeline = 1 écran de scroll
    addUnivers(stage, T);

    // Clavier : le CTA du flux vit dans la scène épinglée, invisible tant que le scroll n'est pas arrivé à son entrée. Quand il reçoit
    // le focus avant, on amène le scroll jusqu'à l'instant où il est visible.
    const cta = stage.querySelector(".flux__content .cta");
    const onCtaFocus = () => {
      const target = st.start + (T.cta + 0.4) * stage.offsetHeight;
      if (window.scrollY < target) scrollTo(target, { immediate: true }); // instantané : une animation Lenis écraserait le saut natif du Tab suivant
    };
    cta.addEventListener("focus", onCtaFocus);
    return () => {
      cta.removeEventListener("focus", onCtaFocus);
      stage.classList.remove("is-live");
    };
  };

  // Le texte est découpé en lignes : quand la largeur change, les retours à la ligne aussi, donc on reconstruit tout (même principe que
  // stage.js). Un changement de hauteur seul est géré par invalidateOnRefresh. Idem si les polices arrivent après l'initialisation.
  let scope = gsap.context(build);
  let width = window.innerWidth;
  let timer;
  const rebuild = (ratio) =>
    keepScroll(() => {
      scope.revert();
      scope = gsap.context(build);
    }, ratio);
  let reading; // point de lecture noté au premier événement : ScrollTrigger recalcule de lui-même 200 ms plus tard
  const onResize = () => {
    reading ??= scrollRatio();
    clearTimeout(timer);
    timer = setTimeout(() => {
      const ratio = reading;
      reading = undefined;
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      rebuild(ratio);
    }, 300);
  };
  const onRelayout = () => rebuild();
  window.addEventListener("resize", onResize);
  window.addEventListener("dbal:relayout", onRelayout);

  return () => {
    clearTimeout(timer);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("dbal:relayout", onRelayout);
    scope.revert();
    root.classList.remove("nstage-anim");
  };
}
