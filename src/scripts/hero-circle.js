// Hero vers section orange (ANIMATIONS.md §3, retours-v2 01 §1) : un cercle orange grandit depuis le centre exact de l'écran
// jusqu'à couvrir tout le viewport, pendant que le contenu du hero s'estompe plus vite que lui.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).

const DOT = 70; // diamètre du point orange qui apparaît d'abord, en px
const DOT_RISE = 0.05; // part de la timeline pour passer de rien au point

export function addCircle(tl, { stage, T }) {
  const circle = stage.querySelector(".hero-circle");
  const content = stage.querySelector(".hero__inner");
  const cta = content.querySelector(".cta");
  const leaves = stage.querySelector(".hero__bg");
  const radius = () => circle.offsetWidth / 2;
  const dotScale = () => DOT / circle.offsetWidth;

  // Le centre du cercle est celui du viewport (50 %, 50 %), au chargement comme au resize : x et y sont relus par invalidateOnRefresh.
  tl.set(circle, { x: () => stage.clientWidth / 2 - radius(), y: () => stage.clientHeight / 2 - radius() }, 0)
    // Le point apparaît dès les premiers pixels de scroll, puis grandit en accélérant jusqu'à couvrir l'écran.
    .fromTo(circle, { scale: 0 }, { scale: dotScale, duration: DOT_RISE, ease: "power2.out" }, 0)
    .to(circle, { scale: 1, duration: T.circle - DOT_RISE, ease: "power2.in" }, DOT_RISE)
    // Opacité seule : le titre reste dans l'arbre d'accessibilité (navigation par titres) une fois le hero quitté.
    // Seul le CTA, qu'on pourrait encore focaliser ou cliquer, disparaît pour de bon.
    .to(content, { opacity: 0, y: -40, scale: 0.96, duration: T.heroFade, ease: "power1.out" }, 0)
    .set(cta, { visibility: "hidden" }, T.heroFade)
    .to(leaves, { opacity: 0, duration: T.leavesFade, ease: "none" }, 0);
}
