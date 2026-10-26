// Nos univers (retours-v2/docs/05-NOEL-ANIMATIONS.md §G) : un seul univers est toujours ouvert. Il est piloté par la souris sur ordinateur
// (survol), par le focus et les flèches au clavier, et par le tap sur tactile et sous 900 px (accordéon). L'univers ouvert passe en
// olive-deep avec un point orange, son texte glisse de 1,4 vw, son soulignement se dessine et son sous-titre se déploie. Quand on passe
// d'un titre à un autre, l'ancien joue l'animation inverse EN MÊME TEMPS que le nouveau joue l'activation. Une timeline par univers
// (play et reverse) : une interruption repart de l'état en cours, sans saut ni clignotement. Quand la souris quitte la liste, l'univers
// ouvert reste ouvert.
// Le fond est en CSS (universes.css : couleur de l'univers ouvert). L'arrivée de la section est dans noel-univers.js.
import { gsap, ScrollTrigger, reducedMotion } from "./core.js";
import { createMark } from "./mark.js";

const REVERSE = 1.35;
const hoverQuery = window.matchMedia("(hover: hover) and (min-width: 901px)");
const compactQuery = window.matchMedia("(hover: none), (max-width: 900px)");

export function initUniverses() {
  const section = document.getElementById("univers");
  if (!section) return;

  const buttons = [...section.querySelectorAll(".universe__btn")];
  const photos = [...section.querySelectorAll(".univers__card img")];
  const speed = reducedMotion() ? 5 : 1; // mouvement réduit : les mêmes changements d'état, en fondu très court

  // Largeur du décalage du texte, lue dans le CSS (--shift, en vw ou en rem) : c'est le padding droit du bouton.
  const shift = (btn) => parseFloat(getComputedStyle(btn).paddingRight);

  const items = [...section.querySelectorAll(".universe")].map((li) => {
    const btn = li.querySelector(".universe__btn");
    const panel = li.querySelector(".universe__panel");
    const mark = createMark(li.querySelector(".uline"));
    // Toutes les animations se terminent au même instant (0,5 s) : en sens inverse elles démarrent donc ensemble, et l'ancien univers
    // se referme dès que le nouveau s'ouvre. Le point arrive un peu après le début du glissement du texte à l'ouverture.
    const tl = gsap
      .timeline({ paused: true, defaults: { ease: "power3.out" } })
      .fromTo(li.querySelector(".universe__dot"), { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 0.15)
      .fromTo(li.querySelector(".universe__text"), { x: 0 }, { x: () => shift(btn), duration: 0.45 }, 0.05)
      .fromTo(panel, { height: 0, autoAlpha: 0, y: 6 }, { height: "auto", autoAlpha: 1, y: 0, duration: 0.45 }, 0.05);
    return { li, btn, tl, mark };
  });

  // Univers ouvert au chargement : celui du balisage (« Noël immersif ») sur ordinateur, le premier sur tactile et en mobile.
  let current = Math.max(0, items.findIndex(({ li }) => li.classList.contains("is-active")));
  const first = compactQuery.matches ? 0 : current;
  items.forEach(({ li, btn, tl, mark }, i) => {
    const open = i === first;
    li.classList.toggle("is-active", open);
    btn.setAttribute("aria-expanded", String(open));
    tl.progress(open ? 1 : 0);
    mark.set(open);
  });
  current = first;

  // Fondu enchaîné entre les photos des univers (une seule photo pour l'instant : rien à faire).
  const showPhoto = (i) => {
    if (photos.length < 2) return;
    const target = Number(items[i].li.dataset.photo);
    gsap.to(photos, { opacity: (k) => (k === target ? 1 : 0), duration: 0.5 / speed, ease: "power2.inOut", overwrite: true });
  };
  showPhoto(current);

  const activate = (next) => {
    if (next === current) return;
    const old = items[current];
    const now = items[next];
    old.li.classList.remove("is-active");
    old.btn.setAttribute("aria-expanded", "false");
    old.tl.timeScale(REVERSE * speed).reverse(); // la fermeture est un peu plus rapide que l'ouverture
    old.mark.hide(0.35 / speed);
    now.li.classList.add("is-active");
    now.btn.setAttribute("aria-expanded", "true");
    now.tl.timeScale(speed).play();
    now.mark.show(0.45 / speed);
    current = next;
    showPhoto(next);
  };

  // Survol : sur un vrai mouvement de la souris au-dessus du titre (le bouton), jamais sur un simple changement de mise en page. Quand un
  // univers s'ouvre ou se ferme, les titres se décalent : un élément qui arrive sous une souris immobile émet un mouseenter et en
  // activerait un autre, en cascade. Un mouvement, lui, a des coordonnées différentes.
  let lastX = -1;
  let lastY = -1;
  items.forEach(({ btn }, i) => {
    btn.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || !hoverQuery.matches) return;
      if (e.clientX === lastX && e.clientY === lastY) return;
      lastX = e.clientX;
      lastY = e.clientY;
      activate(i);
    });
  });

  items.forEach(({ btn }, i) => {
    btn.addEventListener("click", () => activate(i));
    btn.addEventListener("focus", () => activate(i));
    // Clavier : flèches haut et bas, Début et Fin passent d'un titre à l'autre (le focus ouvre l'univers).
    btn.addEventListener("keydown", (e) => {
      const to = { ArrowDown: (i + 1) % items.length, ArrowUp: (i - 1 + items.length) % items.length, Home: 0, End: items.length - 1 }[e.key];
      if (to === undefined) return;
      e.preventDefault();
      buttons[to].focus();
    });
  });

  // Les hauteurs (sous-titres) et le décalage dépendent de la largeur et des polices : relues après un redimensionnement et à l'arrivée
  // tardive des polices, sans changer d'état.
  let timer;
  const measure = () => items.forEach(({ tl }) => { const p = tl.progress(); tl.invalidate().progress(p); });
  const onResize = () => { clearTimeout(timer); timer = setTimeout(measure, 150); };
  window.addEventListener("resize", onResize);
  window.addEventListener("dbal:relayout", measure);

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
