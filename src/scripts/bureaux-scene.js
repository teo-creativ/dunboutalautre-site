// Briques communes aux scènes épinglées des pages Bureaux et Design (chunk bureaux.js) : requêtes de media, petites fonctions de calcul, montée des
// photos d'une galerie, épinglage par le bas avec recouvrement par la section suivante. Chaque scène garde ses propres mesures (profils, constantes) ;
// ce fichier ne contient que ce qui était écrit deux fois.
import { gsap, ScrollTrigger } from "./core.js";
import { claimHeader } from "./bureaux-header.js";

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

// Réglages de l'arrivée d'une section par-dessus une autre (retours V8, partie C de retours-v8/docs/02-SLIDERS-ET-SECTIONS-ORANGE.md) : toute arrivée de section en
// recouvrement dure au moins un écran de scroll (100 % de la hauteur de l'écran), avec un scrub lissé (1) et un mouvement ample, jamais brusque. Ces valeurs se règlent par
// page, sur la section recouverte : data-overlap-screens (durée en écrans de scroll, au moins 1 ; 1,2 pour Bureaux après les témoignages, par exemple) et data-overlap-scrub
// (lissage), posés depuis les données de la page (`overlapScreens`, `overlapScrub` d'une section, components/page-sections.js). `base` : les valeurs propres à la scène.
export const OVERLAP_MIN = 1;
export const OVERLAP_SCRUB = 1;
// data-overlap-hold : palier de lecture, en écrans de scroll, pendant lequel la section recouverte reste seule à l'écran avant que l'autre n'arrive (témoignages de Bureaux).
export function overlapOptions(section, base = {}) {
  const screens = Math.max(OVERLAP_MIN, Number(section.dataset.overlapScreens) || base.screens || OVERLAP_MIN);
  const scrub = Number(section.dataset.overlapScrub) || base.scrub || OVERLAP_SCRUB;
  const hold = Math.max(0, Number(section.dataset.overlapHold) || base.hold || 0);
  return { screens, scrub, hold };
}

// Arrivée ralentie (retours V8, partie C) : une section pleine hauteur qui monte par-dessus une autre suit le scroll un pour un, sa course visible ne peut donc pas dépasser un écran.
// Pour qu'elle dure `screens` écrans (1,2 pour Bureaux après les témoignages, 1,5 pour Design), elle est retardée par un transform y : sa position visible est celle d'une progression
// u (0 à 1) lissée par un scrub, `sine.inOut` (voir arriveEase), dont la durée est `screens` écrans de scroll à partir de `start()` (le scroll où son bord haut touche le bas de l'écran), moins sa position
// naturelle (celle du scroll), qui est donc annulée à chaque image : l'orange ne saute jamais, elle glisse plus lentement, jamais au-dessus de sa place naturelle (y >= 0).
// Le header : tant que le bord haut de la section n'a pas atteint le header, c'est la section recouverte qui est dessous (`from`), alors que la position naturelle l'y a déjà amenée :
// la demande « arrivee » de bureaux-header.js garde son thème jusque-là. Renvoie la fonction qui défait tout.
// Courbe : doux au départ et à l'arrivée (« inOut »), mais pas `power2.inOut` comme le demande le doc : sa pente au milieu est 3, donc 2,5 fois la vitesse du scroll pour 1,2 écran
// (2,3 mesurés sur Bureaux) : l'orange arriverait plus vite qu'avant au milieu. `sine.inOut` a une pente de 1,57 au plus (1,3 fois pour 1,2 écran, 1,05 pour 1,5).
const arriveEase = gsap.parseEase("sine.inOut");
const HEADER_LINE = 55; // le bord haut de la section atteint le centre du header (header-theme.js)
export function slowArrival(target, { start, screens, scrub = OVERLAP_SCRUB, from = { theme: "light", gradient: "cream" } }) {
  if (!target || screens < OVERLAP_MIN + 0.01) return () => {};
  const state = { u: 0 };
  const apply = () => {
    const h = window.innerHeight;
    const s = window.scrollY;
    const natural = clamp(h - (s - start()), 0, h); // position naturelle du bord haut de la section
    const wanted = h * (1 - arriveEase(state.u)); // position voulue, lissée
    gsap.set(target, { y: wanted - natural });
    claimHeader("arrivee", s >= start() - 1 && wanted > HEADER_LINE ? from : null);
  };
  // Les positions de ScrollTrigger se mesurent sans décalage : le transform est retiré le temps du recalcul.
  const reset = () => gsap.set(target, { y: 0 });
  ScrollTrigger.addEventListener("refreshInit", reset);
  const tween = gsap.to(state, {
    u: 1,
    ease: "none",
    onUpdate: apply,
    scrollTrigger: { start: () => start(), end: () => start() + screens * window.innerHeight, scrub, invalidateOnRefresh: true, onRefresh: apply },
  });
  window.addEventListener("scroll", apply, { passive: true }); // un défilement natif (clavier, tactile) ne passe pas par Lenis : la position naturelle est relue aussitôt
  return () => {
    window.removeEventListener("scroll", apply);
    ScrollTrigger.removeEventListener("refreshInit", reset);
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(target, { clearProps: "transform" });
    claimHeader("arrivee", null);
  };
}

// Révélation des photos d'une galerie qui montent (retours V8, partie B ; `reveal: true` de la section, DESIGN.md §5.12) : chaque photo se révèle par clip-path de bas en haut, avec son image qui
// revient de 1,15 à 1, pendant qu'elle entre dans l'écran (de son bord haut au bas de l'écran à 0,42 écran plus haut), donc au fur et à mesure de sa montée et non d'un coup à l'arrivée de la
// section : plusieurs photos entrent bien après (départ à plus de 100 svh). Lue sur la position réelle de chaque photo à chaque image (la section recouvre une autre, puis est épinglée), seulement
// quand la section est à l'écran. Le transform de la photo (sa montée) reste libre. Renvoie la fonction qui défait tout.
export function revealPhotos(section, photos, { always = false } = {}) {
  if (!always && section.dataset.reveal !== "enter") return () => {}; // always : une scène qui n'a pas de [data-reveal] sur sa section (Noël : le flux dans la scène épinglée)
  const items = photos.map((li) => ({ li, img: li.querySelector("img") }));
  const update = () => {
    const h = window.innerHeight;
    const box = section.getBoundingClientRect();
    if (box.top > h + 200 || box.bottom < -200) return;
    const tops = items.map(({ li }) => li.getBoundingClientRect().top); // toutes les positions d'abord, puis les styles : une seule mise en page par image
    items.forEach(({ li, img }, i) => {
      const p = clamp((h * 0.98 - tops[i]) / (0.42 * h));
      li.style.clipPath = p >= 1 ? "" : `inset(${((1 - p) * 100).toFixed(2)}% 0 0 0)`;
      if (img) img.style.transform = p >= 1 ? "" : `scale(${(1.15 - 0.15 * p).toFixed(4)})`;
    });
  };
  update();
  gsap.ticker.add(update);
  return () => {
    gsap.ticker.remove(update);
    items.forEach(({ li, img }) => {
      li.style.clipPath = "";
      if (img) img.style.transform = "";
    });
  };
}

// Marque la section qui arrive par-dessus (bx-overlap : marge négative de `screens` écrans, bureaux-installe.css). Renvoie la fonction qui défait tout.
export function markOverlap(next, screens = OVERLAP_MIN) {
  next?.classList.add("bx-overlap");
  if (screens !== 1) next?.style.setProperty("--overlap", screens);
  return () => {
    next?.classList.remove("bx-overlap");
    next?.style.removeProperty("--overlap");
  };
}

// Épinglage par le bas : la section (qui peut être plus haute que l'écran, elle n'est jamais coupée) reste en place `screens` écrans (un par défaut) pendant que la suivante
// monte par-dessus. `extra` : scrub, etc. À passer à ScrollTrigger.create ou à `scrollTrigger` d'une timeline.
export const bottomPin = (section, extra = {}, screens = OVERLAP_MIN) => ({
  trigger: section,
  start: "bottom bottom",
  end: () => `+=${screens * window.innerHeight}`,
  pin: true,
  anticipatePin: 1,
  invalidateOnRefresh: true,
  ...extra,
});

// Recouvrement : la section qui suit reçoit bx-overlap (marge négative, bureaux-installe.css) et la zone du header de la section épinglée s'arrête
// quand elle atteint le header (le pin est ce recouvrement, il n'ajoute rien à la zone : 1 px de débord, comme entre deux sections voisines, voir
// header-theme.js). Renvoie la fonction qui défait tout. À appeler avant que la section suivante ne soit épinglée.
export function overlapNext(section, screens = OVERLAP_MIN) {
  section.dataset.pinLength = 1;
  const wrap = section.closest(".pin-spacer") ?? section;
  const release = markOverlap(wrap.nextElementSibling, screens);
  return () => {
    release();
    delete section.dataset.pinLength;
  };
}
