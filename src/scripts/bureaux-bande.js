// Bande de photos de la page Terrasses (V7, retours-v7/docs/02-TERRASSES.md §4, frames terrasses-08 à 20), première moitié de la scène de scripts/bureaux-matieres.js
// (profil « terrasses ») : la section est épinglée et cette phase est pilotée par un seul nombre, b, de 0 à 1, que la scène fait avancer avec le scroll.
//   - b de 0 à RISE (= p_align) : le contenu (titre, phrase, deux rangées) monte à la vitesse du scroll jusqu'à ce que la 2e rangée soit presque en haut de l'écran (frames 13
//     à 16 : la 1re rangée sort, il n'en reste qu'un liséré sous le header), et les rangées défilent LATÉRALEMENT, en sens opposés, au rythme du scroll (retours V8) ;
//   - à RISE : les rangées s'arrêtent et la photo de l'olivier (au centre de l'écran, voir plus bas) est prise par le cadre agrandi de la scène (la photo du premier fond, de même
//     rapport), qui prend sa place au pixel près ; l'original est masqué (frame 16) ;
//   - b de RISE à 1 : les autres photos s'estompent pendant que le cadre grandit, centré, de la taille de la rangée (570 x 360 px) à celle de la frame 17 (702 x 441 px). À b = 1 la
//     scène reprend la main : la photo grandit jusqu'au plein écran.
// Retours V8 (retours-v8/docs/05-SCENOGRAPHIE-TERRASSES-DECORATION.md) : les rangées ne tournent plus toutes seules (animation CSS infinie, indépendante du scroll : la photo de l'olivier
// pouvait être n'importe où quand la transition démarrait, d'où un recentrage latéral). Elles sont finies et pilotées par b, et leur point d'arrivée est CALCULÉ : à p_align le centre de
// l'olivier (la copie du milieu de la rangée du bas) tombe exactement sur le milieu de la fenêtre (mesure refaite à chaque recalcul des positions, `invalidateOnRefresh` de la scène), à
// toute largeur d'écran ; l'ancre de la rangée du haut (la 2e photo de sa copie du milieu) est aussi centrée, entière. Le départ est l'arrivée moins une distance fixe (DIST largeurs
// d'écran) dans le sens opposé de la rangée : plus de boucle, la rangée a trois copies du jeu et en couvre toujours l'écran. Aucun mouvement latéral de la photo cible ensuite.
// Sous 900 px (scripts/bureaux-matieres.js : `bandSolo`) une seule rangée (celle de l'olivier) suit le même principe, sans épinglage ; en mouvement réduit (`bandStatic`) les rangées
// sont fixes, l'olivier centré.
// Les rangées montent et s'estompent sans mesure fixe en px : tout est relu à chaque recalcul des positions (sync), l'échelle suit la largeur de l'écran.
import { gsap, ScrollTrigger } from "./core.js";
import { clamp, lerp } from "./bureaux-scene.js";

const RISE = 0.75; // p_align : part de la phase où le contenu monte et les rangées défilent (le reste : fondu et agrandissement du cadre)
const STOP = 105 / 1030; // la 2e rangée s'arrête avec son bord haut à cette part de la hauteur (frames 15 et 16 : 105 px sur 1030)
const FADE_FROM = RISE; // les voisines commencent à s'estomper quand les rangées s'arrêtent
const DIST = 1.4; // distance de défilement des rangées, en largeurs d'écran
const ease = gsap.parseEase("power2.inOut");
const slide = gsap.parseEase("sine.out"); // les rangées ralentissent en arrivant à leur place

// Les rangées de la bande : leur piste, leur sens (1 : vers la droite, -1 : vers la gauche), leur ancre (l'olivier pour la rangée du bas, la 2e photo de la copie du milieu pour l'autre).
const rowsOf = (band) =>
  [...band.querySelectorAll(".band__row")].map((row) => {
    const track = row.querySelector(".band__track");
    const items = [...track.children];
    const hero = items.filter((el) => el.hasAttribute("data-band-hero"));
    const set = items.length / 3; // le jeu de photos est répété trois fois
    return { row, track, dir: row.classList.contains("band__row--left") ? -1 : 1, anchor: hero.length ? hero[Math.min(1, hero.length - 1)] : items[Math.min(set + 1, items.length - 1)], start: 0, end: 0 };
  });

// Positions de départ et d'arrivée de chaque piste (px), mesurées à plat : l'ancre au milieu de la fenêtre à l'arrivée, DIST largeurs d'écran plus loin au départ.
function measureRows(rows) {
  const vw = document.documentElement.clientWidth;
  rows.forEach((r) => gsap.set(r.track, { x: 0 }));
  rows.forEach((r) => {
    const rowLeft = r.row.getBoundingClientRect().left;
    const box = r.anchor.getBoundingClientRect();
    r.end = vw / 2 - (box.left + box.width / 2 - rowLeft) - rowLeft; // le centre de l'ancre sur le milieu de la fenêtre
    r.start = r.end - r.dir * DIST * vw;
  });
}

export function createBand(section, { target, length }) {
  const band = section.querySelector(".mat__band");
  const content = band?.querySelector(".band__content");
  const heroes = band ? [...band.querySelectorAll("[data-band-hero]")] : [];
  if (!band || !content || !heroes.length) return null;
  const heroRow = heroes[0].closest(".band__row");
  const rows = rowsOf(band);
  const setY = gsap.quickSetter(content, "y", "px");
  const setX = rows.map((r) => gsap.quickSetter(r.track, "x", "px"));

  let rise = 0; // px dont le contenu monte
  let taken = null; // { item, left, top, w } : la photo de l'olivier mesurée au moment du relais (px, repère de la section)

  const unfreeze = () => {
    if (!taken) return;
    taken.item.classList.remove("is-taken");
    taken = null;
  };

  // Recalcul : de combien le contenu doit monter, et où s'arrêtent les rangées. Mesuré contenu à plat, relativement à la bande (la position de la page n'y change rien).
  const sync = () => {
    unfreeze();
    gsap.set(content, { y: 0 });
    measureRows(rows);
    const top = heroRow.getBoundingClientRect().top - band.getBoundingClientRect().top;
    rise = Math.max(0, top - STOP * band.getBoundingClientRect().height);
  };

  const freeze = () => {
    if (taken) return;
    const middle = window.innerWidth / 2;
    const item = heroes.reduce((best, el) => {
      const r = el.getBoundingClientRect();
      const b = best.getBoundingClientRect();
      return Math.abs(r.left + r.width / 2 - middle) < Math.abs(b.left + b.width / 2 - middle) ? el : best;
    });
    const r = item.getBoundingClientRect();
    taken = { item, left: r.left, top: r.top - band.getBoundingClientRect().top, w: r.width };
    item.classList.add("is-taken");
  };

  // b : progression de la phase. Renvoie null tant que le cadre de la photo n'a pas pris le relais, sinon son rectangle { left, top, w } (px, repère de la section).
  const render = (b) => {
    // Le contenu monte à la vitesse du scroll (length() : la phase entière, en px de scroll), puis s'arrête.
    setY(-Math.min(rise, b * length()));
    const t = slide(clamp(b / RISE));
    rows.forEach((r, i) => setX[i](lerp(r.start, r.end, t)));
    band.style.setProperty("--band-fade", String(1 - clamp((b - FADE_FROM) / (1 - FADE_FROM))));
    if (b < RISE) {
      unfreeze();
      return null;
    }
    freeze();
    const to = target();
    const k = ease(clamp((b - RISE) / (1 - RISE)));
    return { left: lerp(taken.left, to.left, k), top: lerp(taken.top, to.top, k), w: lerp(taken.w, to.w, k) };
  };

  // will-change seulement pendant que la scène est active.
  const active = (on) => {
    const value = on ? "transform" : "";
    content.style.willChange = value;
    rows.forEach((r) => (r.track.style.willChange = value));
  };

  const destroy = () => {
    unfreeze();
    band.style.removeProperty("--band-fade");
    gsap.set(content, { clearProps: "transform" });
    rows.forEach((r) => gsap.set(r.track, { clearProps: "transform,willChange" }));
    content.style.willChange = "";
  };

  return { sync, render, destroy, active };
}

// Sous 900 px (retours V8, « une rangée, même principe ») : la scène n'est pas épinglée. La rangée de l'olivier (la 2e, l'autre est masquée par bureaux-bande.css) défile avec le scroll de
// la bande : de sa position de départ à celle où l'olivier est au milieu de la fenêtre, atteinte quand le milieu de la bande est au milieu de l'écran. Renvoie la fonction qui défait tout.
export function bandSolo(section) {
  const band = section.querySelector(".mat__band");
  if (!band) return () => {};
  const rows = rowsOf(band).filter((r) => r.row.classList.contains("band__row--left"));
  if (!rows.length) return () => {};
  const setX = gsap.quickSetter(rows[0].track, "x", "px");
  const state = { p: 0 };
  const render = () => setX(lerp(rows[0].start, rows[0].end, clamp(state.p)));
  const sync = () => {
    measureRows(rows);
    render();
  };
  sync();
  const tween = gsap.to(state, {
    p: 1,
    ease: "none",
    onUpdate: render,
    scrollTrigger: { trigger: band, start: "top bottom", end: "center center", scrub: 1, invalidateOnRefresh: true, onRefresh: sync },
  });
  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(rows[0].track, { clearProps: "transform" });
  };
}

// Mouvement réduit : rangées fixes, l'olivier (et l'ancre de l'autre rangée) centré. Recentré au redimensionnement. Renvoie la fonction qui défait tout.
export function bandStatic(section) {
  const band = section.querySelector(".mat__band");
  if (!band) return () => {};
  const rows = rowsOf(band);
  const place = () => {
    measureRows(rows);
    rows.forEach((r) => gsap.set(r.track, { x: r.end }));
  };
  place();
  let timer;
  const onResize = () => {
    clearTimeout(timer);
    timer = setTimeout(place, 150);
  };
  window.addEventListener("resize", onResize);
  return () => {
    clearTimeout(timer);
    window.removeEventListener("resize", onResize);
    rows.forEach((r) => gsap.set(r.track, { clearProps: "transform" }));
  };
}
