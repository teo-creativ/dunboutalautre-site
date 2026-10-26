// Scène épinglée de la landing Noël (retours-v2/docs/05-NOEL-ANIMATIONS.md §A à §F) : le hero, la photo « Notre volonté », le flux
// orange et l'arrivée de Nos univers forment une seule timeline pilotée par le scroll, comme la scène de l'accueil (stage.js). Une
// unité de timeline vaut un écran de scroll : un seul pin, aucun espace vide entre les étapes et aucun flash au dégagement.
// Desktop avec mouvement seulement. Ailleurs (mobile, mouvement réduit), les sections restent empilées (noel-stage.css).
import { gsap, ScrollTrigger, scrollTo } from "./core.js";
import { keepScroll, scrollRatio } from "./scroll-memory.js";
import { setHeaderOverride } from "./header-theme.js";
import { addVolonte } from "./noel-volonte.js";
import { addFlux } from "./noel-flux.js";
import { addUnivers } from "./noel-univers.js";

// Calendrier (en écrans de scroll). Photo qui monte sur le hero 1, lecture du texte (révélation, tenue d'environ 0,6 écran,
// disparition), réduction de la photo 1, flux de photos 2, arrivée des univers 0,6.
const DESKTOP = {
  total: 5.8,
  rise: 1, heroFade: 0.7,
  text: 0.8, textOut: 1.9,
  shrink: 2.1, shrinkDur: 1.0,
  photosIn: 2.65,
  title: 2.7, cta: 3.15,
  flux: 3.1, fluxDur: 2.05,
  univers: 5.15, universDur: 0.6,
};
const HEADER_CENTER = 55; // même valeur que header-theme.js
const LOGO_CLEARED = 0.72; // part de l'arrivée des univers à partir de laquelle la crème a recouvert le logo

export function initNoelStage() {
  const stage = document.getElementById("nstage");
  if (!stage) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const T = DESKTOP;
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
        },
      });
      const st = tl.scrollTrigger;

      const ctx = { stage, T };
      addVolonte(tl, ctx);
      addFlux(tl, ctx);
      addUnivers(tl, ctx);
      tl.set({}, {}, T.total); // fixe la durée : 1 unité de timeline = 1 écran de scroll

      // Header : dès que la crème a dépassé le logo (elle arrive de la droite et le logo est à gauche, à 25 % de la largeur), le logo et le
      // bouton passent en thème clair avec le dégradé crème, jusqu'à ce que la scène quitte le header une fois désépinglée (le CTA final,
      // orange, reprend alors la main).
      ScrollTrigger.create({
        start: () => st.start + ((T.univers + T.universDur * LOGO_CLEARED) / T.total) * (st.end - st.start),
        end: () => st.end + stage.offsetHeight - HEADER_CENTER,
        refreshPriority: -1,
        onToggle: (self) => setHeaderOverride(self.isActive ? { theme: "light", gradient: "cream" } : null),
      });

      // Clavier : le CTA du flux vit dans la scène épinglée, invisible tant que le scroll n'est pas arrivé à son entrée. Quand il reçoit
      // le focus avant, on amène le scroll jusqu'à l'instant où il est visible.
      const cta = stage.querySelector(".flux__content .cta");
      const onFocus = () => {
        const target = st.start + (T.cta + 0.4) * stage.offsetHeight;
        if (window.scrollY < target) scrollTo(target, { immediate: true }); // instantané : une animation Lenis écraserait le saut natif du Tab suivant
      };
      cta.addEventListener("focus", onFocus);
      return () => {
        cta.removeEventListener("focus", onFocus);
        setHeaderOverride(null);
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
  });
}
