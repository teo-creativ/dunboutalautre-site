// Nos univers, interactions (retours-v2/docs/05-NOEL-ANIMATIONS.md §G, retours-v3/docs/03-UNIVERS-HOVER-FLUIDE.md) : un seul univers est
// toujours ouvert. Il est piloté par la souris sur ordinateur (survol, avec une intention de 60 ms), par le focus clavier et les flèches,
// et par le tap sur tactile et sous 900 px (accordéon). Une timeline GSAP en pause par univers décrit toute l'ouverture, d'un seul tenant :
// hauteur du sous-titre (de 0 à auto, par GSAP), lignes du sous-titre qui montent dans leur masque en cascade, fondu, mise en avant du titre
// (point, glissement, couleur, soulignement). L'ouverture la joue, la fermeture la rejoue à l'envers, un peu plus vite : une interruption
// repart de l'état en cours, sans saut, et l'ancien univers se referme en même temps que le nouveau s'ouvre. Aucune de ces animations n'est
// en CSS (la couleur non plus) : tout part au même instant, sur la même horloge. Quand la souris quitte la liste, l'univers ouvert reste ouvert.
// Le texte est découpé en lignes une seule fois, après le chargement des polices, puis refait quand la largeur change : jamais au survol.
// Le fond est en CSS (universes.css). L'arrivée de la section est dans noel-univers.js.
import { gsap, ScrollTrigger, SplitText, reducedMotion } from "./core.js";
import { createMark } from "./mark.js";

const CLOSE_SPEED = 1.5; // la fermeture joue la timeline 1,5 fois plus vite que l'ouverture (environ 0,6 s)
const INTENT = 0.06; // délai de survol avant l'ouverture : une souris qui traverse la liste en diagonale n'ouvre rien
const hoverQuery = window.matchMedia("(hover: hover) and (min-width: 901px)");
const compactQuery = window.matchMedia("(hover: none), (max-width: 900px)");
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export function initUniverses() {
  const section = document.getElementById("univers");
  if (!section) return;

  const buttons = [...section.querySelectorAll(".universe__btn")];
  const photos = [...section.querySelectorAll(".univers__card img")];

  // Largeur du décalage du texte, lue dans le CSS (--shift, en vw ou en rem) : c'est le padding droit du bouton.
  const shift = (btn) => parseFloat(getComputedStyle(btn).paddingRight);

  const items = [...section.querySelectorAll(".universe")].map((li) => ({
    li,
    btn: li.querySelector(".universe__btn"),
    panel: li.querySelector(".universe__panel"),
    dot: li.querySelector(".universe__dot"),
    text: li.querySelector(".universe__text"),
    mark: createMark(li.querySelector(".uline")),
    tl: gsap.timeline({ paused: true }),
    split: null,
    lines: [],
    open: false,
  }));

  // will-change seulement sur les lignes du sous-titre, et seulement le temps de l'animation.
  const live = (item, on) => item.lines.forEach((line) => (line.style.willChange = on ? "transform, opacity" : ""));

  // (Re)construit la timeline d'un univers : découpe du sous-titre en lignes, puis tous les mouvements. À refaire quand la largeur ou les
  // polices changent, car les retours à la ligne, et donc la hauteur du sous-titre, changent avec elles. L'état (ouvert ou fermé) est gardé.
  const build = (item) => {
    const { btn, panel, dot, text, mark, tl } = item;
    const reduced = reducedMotion();
    tl.pause().clear();
    item.split?.revert();
    live(item, false);

    const muted = token("--olive-muted");
    const deep = token("--olive-deep");

    if (reduced) {
      // Mouvement réduit : les mêmes changements d'état, en un fondu de 0,2 s, sans mouvement de lignes ni de texte.
      item.split = null;
      item.lines = [];
      tl.fromTo(panel, { height: 0 }, { height: "auto", duration: 0.01, ease: "none" }, 0.001)
        .fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "none" }, 0)
        .fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.2, ease: "none" }, 0)
        .fromTo(btn, { color: muted }, { color: deep, duration: 0.2, ease: "none" }, 0);
      mark.into(tl, 0, { duration: 0.2, ease: "none" });
    } else {
      item.split = SplitText.create(panel.querySelector("p"), { type: "lines", mask: "lines", linesClass: "split-line", aria: "none" });
      item.lines = item.split.lines;
      // Environ 0,95 s : la hauteur s'ouvre en 0,6 s (départ et arrivée doux : la liste ne saute jamais), les lignes montent de 0,10 à 0,90
      // en cascade de 0,06, le fondu part à 0,15, et la mise en avant du titre (couleur, glissement, soulignement, point) est en parallèle.
      tl.fromTo(panel, { height: 0 }, { height: "auto", duration: 0.6, ease: "power3.inOut" }, 0)
        .fromTo(panel, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, 0.15)
        .fromTo(item.lines, { yPercent: 100 }, { yPercent: 0, duration: 0.8, ease: "expo.out", stagger: 0.06 }, 0.1)
        .fromTo(btn, { color: muted }, { color: deep, duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(text, { x: 0 }, { x: () => shift(btn), duration: 0.5, ease: "power2.out" }, 0)
        .fromTo(dot, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.15);
      mark.into(tl, 0.05, { duration: 0.5 });
    }
    tl.eventCallback("onComplete", () => live(item, false)).eventCallback("onReverseComplete", () => live(item, false));
    tl.progress(item.open ? 1 : 0);
  };

  // Univers ouvert au chargement : celui du balisage (« Noël immersif ») sur ordinateur, le premier sur tactile et en mobile.
  const initial = Math.max(0, items.findIndex(({ li }) => li.classList.contains("is-active")));
  const first = compactQuery.matches ? 0 : initial;
  items.forEach((item, i) => {
    item.open = i === first;
    item.li.classList.toggle("is-active", item.open);
    item.btn.setAttribute("aria-expanded", String(item.open));
  });

  // Fondu enchaîné entre les photos des univers (une seule photo pour l'instant : rien à faire). La nouvelle arrive avec un léger zoom
  // arrière (1,06 vers 1), l'ancienne s'efface en même temps : toutes les images sont dans le DOM, superposées, aucun src ne change.
  let shown = Math.max(0, photos.findIndex((img) => !img.classList.contains("is-hidden")));
  const showPhoto = (i) => {
    if (photos.length < 2) return;
    const target = Number(items[i].li.dataset.photo);
    if (target === shown) return;
    const fast = reducedMotion();
    photos.forEach((img, k) => {
      if (k === target) {
        gsap.to(img, { opacity: 1, duration: fast ? 0.2 : 0.6, ease: fast ? "none" : "power2.inOut", overwrite: "auto" });
        if (!fast) gsap.fromTo(img, { scale: 1.06 }, { scale: 1, duration: 0.9, ease: "power3.out", overwrite: "auto" });
      } else {
        gsap.to(img, { opacity: 0, duration: fast ? 0.2 : 0.6, ease: fast ? "none" : "power2.inOut", overwrite: "auto" });
      }
    });
    shown = target;
  };

  const activate = (next) => {
    const now = items[next];
    if (now.open) return;
    // Un seul univers ouvert : les autres se ferment avec leur propre timeline (jamais en forçant des styles).
    items.forEach((item) => {
      if (!item.open) return;
      item.open = false;
      item.li.classList.remove("is-active");
      item.btn.setAttribute("aria-expanded", "false");
      live(item, true);
      item.tl.timeScale(CLOSE_SPEED).reverse();
    });
    now.open = true;
    now.li.classList.add("is-active");
    now.btn.setAttribute("aria-expanded", "true");
    live(now, true);
    now.tl.timeScale(1).play();
    showPhoto(next);
  };

  // Survol : sur un vrai mouvement de la souris au-dessus du titre (le bouton), jamais sur un simple changement de mise en page. Quand un
  // univers s'ouvre ou se ferme, les titres se décalent : un élément qui arrive sous une souris immobile émet un mouseenter et en
  // activerait un autre, en cascade. Un mouvement, lui, a des coordonnées différentes. L'ouverture attend 60 ms d'intention, annulée si
  // la souris quitte le titre avant.
  let lastX = -1;
  let lastY = -1;
  let intent = null; // { i, call }
  const cancelIntent = () => {
    intent?.call.kill();
    intent = null;
  };
  items.forEach(({ btn }, i) => {
    btn.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || !hoverQuery.matches) return;
      if (e.clientX === lastX && e.clientY === lastY) return;
      lastX = e.clientX;
      lastY = e.clientY;
      if (items[i].open || intent?.i === i) return;
      cancelIntent();
      intent = { i, call: gsap.delayedCall(INTENT, () => { intent = null; activate(i); }) };
    });
    btn.addEventListener("pointerleave", () => intent?.i === i && cancelIntent());
  });

  items.forEach(({ btn }, i) => {
    btn.addEventListener("click", () => { cancelIntent(); activate(i); });
    // Clavier : le focus visible ouvre l'univers (la même timeline que le survol, sans délai d'intention). Un clic donne aussi le focus,
    // mais passe par le gestionnaire ci-dessus. Quitter la liste au clavier laisse, comme à la souris, l'univers ouvert.
    btn.addEventListener("focus", () => btn.matches(":focus-visible") && activate(i));
    // Flèches haut et bas, Début et Fin passent d'un titre à l'autre.
    btn.addEventListener("keydown", (e) => {
      const to = { ArrowDown: (i + 1) % items.length, ArrowUp: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      buttons[to].focus();
    });
  });

  // Polices en place : découpe et mesures, une seule fois. Puis seulement quand la largeur change ou que les polices arrivent tard.
  document.fonts.ready.then(() => items.forEach(build));
  let timer;
  let width = window.innerWidth;
  const rebuild = () => items.forEach(build);
  const onResize = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.innerWidth === width) return;
      width = window.innerWidth;
      rebuild();
    }, 150);
  };
  window.addEventListener("resize", onResize);
  window.addEventListener("dbal:relayout", rebuild);

  // Sous 900 px (hors mouvement réduit, géré par reduced-motion.js) : apparition à l'entrée dans l'écran, comme les cartes des réalisations.
  gsap.matchMedia().add("(max-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
    const blocks = [...section.querySelectorAll(".univers__card, .univers__body > .label, .univers__title, .universe")];
    gsap.set(blocks, { opacity: 0, y: 24 });
    ScrollTrigger.batch(blocks, {
      start: "top 90%",
      end: "max",
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08, overwrite: true }),
      onLeaveBack: (batch) => gsap.to(batch, { opacity: 0, y: 24, duration: 0.4, ease: "power2.in", overwrite: true }),
    });
  });
}
