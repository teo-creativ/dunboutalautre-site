// Scène épinglée de l'accueil : hero, cercle orange, photos en perspective et photo qui grandit forment une seule
// timeline pilotée par le scroll. Une unité de timeline vaut un écran de scroll, donc un seul pin, aucun espace vide
// entre le hero et la section orange, et aucun flash au dégagement du pin.
import { gsap, ScrollTrigger, scrollTo } from "./core.js";
import { setHeaderOverride } from "./header-theme.js";
import { keepScroll, scrollRatio } from "./scroll-memory.js";
import { addCircle } from "./hero-circle.js";
import { addApproach } from "./approach.js";
import { addOrangeText, addPhotos } from "./photos-scroll.js";

// Calendrier (en écrans de scroll). Desktop : cercle 1, section orange et photo qui grandit 3, lecture du texte 1,4, puis
// 1 écran de superposition des services (overlap, compris dans total). Mobile : 2 photos seulement, pin de 1,9 écran
// avant une superposition d'un demi-écran (ANIMATIONS.md §12).
const DESKTOP = {
  total: 5.95, overlap: 1,
  circle: 1, heroFade: 0.45, leavesFade: 0.6,
  title: 1, titleDur: 0.35, cta: 1.2,
  // Carte : rest est l'instant où elle atteint sa pose CSS (frame 04), duration règle sa vitesse (plus courte = plus
  // rapide), z négatif la recule (plus petite, plus lente en apparence).
  cards: [
    { index: 0, rest: 2, duration: 1.54, z: -200, rx: 6, rot: -1.5, dx: 40 },
    { index: 1, rest: 2, duration: 1.45, z: -100, rx: 4, rot: 2, dx: -50 },
    // V8 (G5) : `under` : la carte est sous celle de sa colonne (2 sous 0 à gauche, 3 sous 1 à droite) : la pile monte d'un bloc, avec le `rest` et la `duration` de la carte du dessous (photos-scroll.js).
    { index: 2, rest: 2.05, duration: 1.74, z: -300, rx: 8, rot: -2, dx: 30, under: 0 },
    { index: 3, rest: 2.1, duration: 1.37, z: 0, rx: 3, rot: 1.5, dx: -40, under: 1 },
  ],
  // Photo large : carte de 38 % de la largeur, ratio 1,81:1, posée à 70 % de la hauteur (frame 07).
  card: { width: 0.384, ratio: 1.81, top: 0.7 },
  appear: 2.55, appearDur: 0.4, grow: 2.95, growDur: 0.6,
  contentFade: 3.05, contentFadeDur: 0.4,
  veil: 3.55, veilDur: 0.3, text: 3.85,
};

const MOBILE = {
  total: 2.4, overlap: 0.5,
  circle: 0.6, heroFade: 0.28, leavesFade: 0.36,
  title: 0.6, titleDur: 0.3, cta: 0.72,
  cards: [
    { index: 0, rest: 1, duration: 0.75, z: -150, rx: 4, rot: -1.5, dx: 20 },
    { index: 2, rest: 1.08, duration: 0.8, z: -250, rx: 6, rot: 2, dx: -20 },
  ],
  card: { width: 0.8, ratio: 1.81, top: 0.72 },
  appear: 0.95, appearDur: 0.2, grow: 1.15, growDur: 0.35,
  contentFade: 1.2, contentFadeDur: 0.2,
  veil: 1.5, veilDur: 0.1, text: 1.6,
};

export function initStage() {
  const stage = document.getElementById("stage");
  if (!stage) return;

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
      root.style.setProperty("--overlap", T.overlap); // marge négative des services, voir stage.css

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
            // La scène est reconstruite au changement de largeur : son pin est alors recréé après ceux qui la suivent (Réalisations,
            // chiffres clés). Sans priorité, il serait recalculé en dernier et les pins suivants partiraient d'une page trop courte.
            refreshPriority: 1,
          },
        });

        const ctx = { stage, T };
        addCircle(tl, ctx);
        addOrangeText(tl, ctx);
        addPhotos(tl, ctx);
        addApproach(tl, ctx);
        tl.set({}, {}, T.total); // fixe la durée : 1 unité de timeline = 1 écran de scroll

        // Le logo passe sur le ciel clair de la photo qui grandit avant que le voile ne l'assombrisse (1,4:1 mesuré à mi-course) :
        // le dégradé sombre du header couvre cet intervalle, puis le voile prend le relais (4,5:1).
        const unit = () => stage.offsetHeight;
        ScrollTrigger.create({
          start: () => tl.scrollTrigger.start + (T.grow + T.growDur * 0.7) * unit(),
          end: () => tl.scrollTrigger.start + (T.veil + T.veilDur) * unit(),
          onToggle: (self) => setHeaderOverride(self.isActive ? { gradient: "photo" } : null),
        });

        // Clavier : le CTA de la section orange vit dans la scène épinglée, invisible tant que le scroll n'est pas arrivé à son
        // entrée. Quand il reçoit le focus avant, on amène le scroll jusqu'à l'instant où il est visible.
        const cta = stage.querySelector(".experience__content .cta");
        const onFocus = () => {
          const target = tl.scrollTrigger.start + (T.cta + 0.4) * stage.offsetHeight;
          if (window.scrollY < target) scrollTo(target, { immediate: true }); // instantané : une animation Lenis écraserait le saut natif du Tab suivant
        };
        cta.addEventListener("focus", onFocus);
        return () => {
          cta.removeEventListener("focus", onFocus);
          setHeaderOverride(null);
        };
      };

      // Le texte est découpé en lignes : quand la largeur change, les retours à la ligne aussi, donc on reconstruit tout.
      // Un changement de hauteur seul (barre d'adresse mobile) est géré par invalidateOnRefresh, sans reconstruction.
      // Même chose si les polices arrivent après l'initialisation (réseau lent, événement dbal:relayout de main.js).
      let scope = gsap.context(build);
      let width = window.innerWidth;
      let timer;
      const rebuild = (ratio) =>
        keepScroll(() => {
          scope.revert();
          scope = gsap.context(build);
        }, ratio);
      // Le point de lecture est noté au premier événement : ScrollTrigger recalcule de lui-même 200 ms plus tard.
      let reading;
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
        root.classList.remove("stage-anim");
        root.style.removeProperty("--overlap");
      };
    },
  );
}
