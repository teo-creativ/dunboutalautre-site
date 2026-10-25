// Hero vers section orange (ANIMATIONS.md §3) : un cercle orange grandit depuis le titre jusqu'à couvrir l'écran,
// pendant que le contenu du hero s'estompe plus vite que lui.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).

export function addCircle(tl, { stage, T }) {
  const circle = stage.querySelector(".hero-circle");
  const content = stage.querySelector(".hero__inner");
  const leaves = stage.querySelector(".hero__bg");
  const width = () => stage.clientWidth;
  const height = () => stage.clientHeight;
  const radius = () => circle.offsetWidth / 2;

  tl.fromTo(
    circle,
    // Le centre dérive de (60 %, 45 %) vers (50 %, 48 %) en grandissant, comme sur les frames 02 et 03.
    { scale: 0, x: () => width() * 0.6 - radius(), y: () => height() * 0.45 - radius() },
    { scale: 1, x: () => width() * 0.5 - radius(), y: () => height() * 0.48 - radius(), duration: T.circle, ease: "power2.in" },
    0,
  )
    .to(content, { autoAlpha: 0, y: -40, scale: 0.96, duration: T.heroFade, ease: "power1.out" }, 0)
    .to(leaves, { opacity: 0, duration: T.leavesFade, ease: "none" }, 0);
}
