// Disque qui grandit (V7, page Entretien, frames entretien-06 à 09) : la section est épinglée `length` écrans, un disque (l'élément `disc`, qui remplit la
// section et porte la couleur) part d'un point et grandit avec le scroll jusqu'à tout recouvrir ; les cartes dessous ne bougent pas. Fonction réutilisable :
// elle ne connaît ni la section ni sa couleur, seulement un centre (px dans la section, recalculé à chaque rafraîchissement) et une couleur facultative
// (une valeur CSS, de préférence un jeton : « var(--olive) »). Seul `clip-path` bouge : le rayon va de 0 au coin le plus éloigné du centre ; `radius(p)` donne
// la part du rayon final à la progression p (linéaire par défaut ; Entretien : courbe lue sur les frames 07 et 08, 398,5 et 730 px sur 1 014 px au plein écran). `onProgress(p, { cx, cy, r, rMax })` est appelée à chaque mise à jour
// et au rafraîchissement : elle sert au header et à l'inertie des cartes. Sans mouvement (mouvement réduit, moins de 900 px) la fonction n'est pas appelée :
// le disque n'existe pas (display: none) et la section suivante, de la même couleur, suit directement.
import { gsap } from "./core.js";

export function circleReveal(section, { disc, length = 1, center, color, radius = (p) => p, onProgress }) {
  if (color) disc.style.setProperty("--disc", color);
  const s = { p: 0 };
  const geo = { cx: 0, cy: 0, rMax: 0 };

  const measure = () => {
    const w = section.clientWidth;
    const h = section.clientHeight;
    const c = center ? center({ w, h }) : { x: w / 2, y: h / 2 };
    geo.cx = c.x;
    geo.cy = c.y;
    // +2 px : le bord du disque ne laisse pas un liseré au coin le plus éloigné au plein écran.
    geo.rMax = Math.max(Math.hypot(c.x, c.y), Math.hypot(w - c.x, c.y), Math.hypot(c.x, h - c.y), Math.hypot(w - c.x, h - c.y)) + 2;
  };
  const render = () => {
    const r = radius(s.p) * geo.rMax;
    disc.style.clipPath = `circle(${r.toFixed(1)}px at ${geo.cx.toFixed(1)}px ${geo.cy.toFixed(1)}px)`;
    onProgress?.(s.p, { cx: geo.cx, cy: geo.cy, r, rMax: geo.rMax });
  };
  measure();
  render();

  const tl = gsap.timeline({
    defaults: { ease: "none", onUpdate: render },
    scrollTrigger: {
      trigger: section,
      start: "top top",
      end: () => {
        const px = length * window.innerHeight;
        section.dataset.pinLength = px; // lu par le thème du header : la zone de la section dure tout le pin
        return `+=${px}`;
      },
      pin: true,
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onRefresh: () => {
        measure();
        render();
      },
      onToggle: (self) => {
        disc.style.willChange = self.isActive ? "clip-path" : ""; // will-change seulement pendant que la scène est active
      },
    },
  });
  tl.to(s, { p: 1, duration: 1 });

  return {
    scrollTrigger: tl.scrollTrigger,
    measure,
    destroy() {
      tl.scrollTrigger?.kill();
      tl.kill();
      delete section.dataset.pinLength;
      disc.style.clipPath = "";
      disc.style.willChange = "";
      disc.style.removeProperty("--disc");
    },
  };
}
