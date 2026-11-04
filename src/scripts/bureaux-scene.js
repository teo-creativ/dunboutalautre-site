// Briques communes aux scènes épinglées des pages Bureaux et Design (chunk bureaux.js) : requêtes de media, petites fonctions de calcul, montée des
// photos d'une galerie, épinglage par le bas avec recouvrement par la section suivante. Chaque scène garde ses propres mesures (profils, constantes) ;
// ce fichier ne contient que ce qui était écrit deux fois.
import { gsap } from "./core.js";

// Deux cas pour chaque scène : ordinateur avec mouvement, et écran étroit avec mouvement (sans mouvement, rien n'est épinglé).
export const MEDIA = {
  wide: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
  solo: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
};

export const clamp = (v, lo = 0, hi = 1) => Math.min(Math.max(v, lo), hi);
export const lerp = (a, b, t) => a + (b - a) * t;

// quickSetter(..., "scale") ne pose rien : l'échelle passe par scaleX et scaleY.
export const scaleSetter = (el) => {
  const sx = gsap.quickSetter(el, "scaleX");
  const sy = gsap.quickSetter(el, "scaleY");
  return (v) => {
    sx(v);
    sy(v);
  };
};

// Courbe monotone (Fritsch-Carlson) passant par les mesures : pas de dépassement entre deux frames.
export const monotone = (xs, ys) => {
  const n = xs.length;
  const d = xs.slice(1).map((x, i) => (ys[i + 1] - ys[i]) / (x - xs[i]));
  const m = ys.map((_, i) => (i === 0 ? d[0] : i === n - 1 ? d[n - 2] : d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2));
  d.forEach((di, i) => {
    if (di === 0) return (m[i] = m[i + 1] = 0);
    const a = m[i] / di;
    const b = m[i + 1] / di;
    const h = Math.hypot(a, b);
    if (h > 3) {
      m[i] = (3 / h) * a * di;
      m[i + 1] = (3 / h) * b * di;
    }
  });
  return (x) => {
    const v = clamp(x, xs[0], xs[n - 1]);
    let i = 0;
    while (i < n - 2 && v > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i];
    const t = (v - xs[i]) / h;
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
};

// Montée des photos d'une galerie (Bureaux, Design) : chaque photo monte en ligne droite de sa vitesse (svh par écran de scroll, 100 = la vitesse de
// la page ; data-speed, ou data-speed-mobile sous 900 px) pendant `rise` écrans, du début de la timeline. `drift` : dérive vers la droite par pixel
// monté (Design : x + 14 px entre les frames 24 et 25 pour 299 px de montée) ; sans elle, seule la translation y bouge.
export function addPhotoRise(tl, photos, { wide, rise, section, drift = 0 }) {
  const speed = (li) => Number((wide ? li.dataset.speed : li.dataset.speedMobile) ?? li.dataset.speed) / 100;
  photos.forEach((li) => {
    const to = { y: () => -speed(li) * rise * section.offsetHeight, duration: rise };
    if (drift) to.x = () => drift * speed(li) * rise * section.offsetHeight;
    tl.fromTo(li, drift ? { y: 0, x: 0 } : { y: 0 }, to, 0);
  });
}

// Épinglage par le bas : la section (qui peut être plus haute que l'écran, elle n'est jamais coupée) reste en place un écran pendant que la suivante
// monte par-dessus. `extra` : scrub, etc. À passer à ScrollTrigger.create ou à `scrollTrigger` d'une timeline.
export const bottomPin = (section, extra = {}) => ({
  trigger: section,
  start: "bottom bottom",
  end: () => `+=${window.innerHeight}`,
  pin: true,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  ...extra,
});

// Recouvrement : la section qui suit reçoit bx-overlap (marge négative, bureaux-installe.css) et la zone du header de la section épinglée s'arrête
// quand elle atteint le header (le pin est ce recouvrement, il n'ajoute rien à la zone : 1 px de débord, comme entre deux sections voisines, voir
// header-theme.js). Renvoie la fonction qui défait tout. À appeler avant que la section suivante ne soit épinglée.
export function overlapNext(section) {
  section.dataset.pinLength = 1;
  const wrap = section.closest(".pin-spacer") ?? section;
  const next = wrap.nextElementSibling;
  next?.classList.add("bx-overlap");
  return () => {
    next?.classList.remove("bx-overlap");
    delete section.dataset.pinLength;
  };
}
