// Curseur feuille (retours-v8/docs/01-CURSEUR-FEUILLE.md, G1) : la feuille du « O » de BOUT suit le pointeur fin (souris, stylet) sur grand écran.
// Module navigateur, importé par src/scripts/main.js : ce n'est pas un composant injectable (<!--@cursor--> n'existe pas). Un seul élément DOM
// (div.cursor et son SVG), ajouté au body, aucune dépendance. Styles : src/styles/cursor.css.
//
// Forme : le tracé est lu dans public/assets/brand/leaf.svg, extrait du wordmark du logo (même chemin que celui du « O » de BOUT), jamais redessiné.
// Point actif : le CENTRE de la feuille (le doc laisse le choix entre la pointe et le centre). Un clic tombe donc exactement sous le centre de la
// feuille, y compris sur un bouton de 40 px de haut : la feuille étant presque carrée, une pointe décalerait le point de clic de 12 à 14 px.
//
// Couleur : deux calques superposés, « ink » (olive foncé liseré crème, pour les fonds clairs) et « paper » (crème liseré olive foncé, pour les fonds
// sombres, orange et les photos). Le liseré garantit 3:1 même quand le fond n'est pas celui qu'on attendait. Le passage de l'un à l'autre est un
// fondu d'opacité de 150 ms (aucune propriété de peinture animée). Le thème se lit sur l'élément sous le pointeur, une fois par frame au plus :
//   1. [data-cursor-theme="light|dark|orange|photo"] (le plus proche), pour une zone que les règles suivantes ne devinent pas ;
//   2. .cta, .tag (pastilles orange ou blanches) et les photos (img et video d'au moins 20 000 px²) : paper ;
//   3. le header : le dégradé et le thème que header-theme.js y pose (menu ouvert : paper) ;
//   4. la section sous le pointeur : data-header-gradient, sinon data-header-theme (les mêmes attributs que le header, aucun attribut de plus) ;
//   5. la page elle-même (html, body, main) : fond crème, donc ink ; tout le reste : paper (le thème sombre est le défaut du header aussi).
//
// États (data-state sur .cursor, transformations par GSAP, transform seul) : repos, lien ou bouton, texte, glisser. Clic : impulsion x0,8.
// Mouvement réduit : aucun amorti, aucune rotation, aucune échelle ni impulsion ; la feuille suit la souris et ne change que de couleur.
import { gsap, reducedMotion } from "../scripts/core.js";
import leafSource from "../../public/assets/brand/leaf.svg?raw";

// Actif seulement avec un pointeur fin et précis, au-dessus de 900 px, hors contraste forcé du système.
const ACTIVE = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 901px) and (not (forced-colors: active))");

const REST_ANGLE = -20; // degrés : l'inclinaison naturelle de la feuille au repos
const TURN = 0.9; // degrés de rotation par pixel parcouru entre deux frames
const MAX_TURN = 20; // degrés : l'écart maximal avec l'inclinaison de repos
const FOLLOW = { duration: 0.22, ease: "power3" }; // amorti du suivi (0,18 à 0,25 s dans le doc)
const PHOTO_MIN_AREA = 20000; // px² : en dessous, une image est un logo ou une icône, pas une photo
const SETTLE = 90; // ms sans mouvement avant que la feuille reprenne son inclinaison de repos

const SCALE = { idle: 1, link: 1.8, text: 0.6, drag: 1 };
const LEAF_STRETCH = { x: 1.7, y: 0.8 }; // la feuille allongée de l'état « glisser »

const INTERACTIVE = [
  "a[href]", "button:not(:disabled)", "summary", "label[for]", "select",
  '[role="button"]', '[role="tab"]', '[role="link"]',
  'input:is([type="checkbox"], [type="radio"], [type="submit"], [type="button"], [type="range"])',
  "[data-cursor]", // lien, bouton et zone déclarée à la main : data-cursor="cta | text | drag"
  '[aria-roledescription="carousel"]', // les carrousels et sliders de la page sont déjà déclarés en ARIA : zone de glisser
].join(", ");
const TEXT = [
  "p", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "figcaption", "dt", "dd", "address", "textarea",
  'input:not([type]), input:is([type="text"], [type="email"], [type="tel"], [type="url"], [type="search"], [type="number"])',
].join(", ");
// Un contrôle inerte (flèches du carrousel à un seul avis, bouton d'envoi en cours) ne doit pas se présenter comme cliquable : leurs styles le disent déjà.
const INERT = '[aria-disabled="true"], [aria-busy="true"]';
const PAPER_SURFACES = ".cta, .tag";
const SCHEME_OF_THEME = { light: "ink", dark: "paper", orange: "paper", photo: "paper" };

// ---------- Le tracé : lu dans leaf.svg ----------
const viewBox = leafSource.match(/viewBox="([^"]+)"/)[1];
const outline = leafSource.match(/<path[^>]* d="([^"]+)"/)[1];
const stroke = Number(leafSource.match(/stroke-width="([\d.]+)"/)[1]);
const [vx, vy, vw, vh] = viewBox.split(/\s+/).map(Number);
const cx = vx + vw / 2;
const cy = vy + vh / 2;
const ORIGIN = `${cx} ${cy}`;

// Un calque : la feuille (liseré, corps plein, contour, point central) et deux flèches pour l'état « glisser ». Les couleurs viennent du CSS.
const layer = (name) => `<g class="cursor__layer cursor__layer--${name}">
      <g class="cursor__leaf">
        <path class="cursor__edge" d="${outline}" stroke-width="${stroke + 4}"/>
        <path class="cursor__body" d="${outline}"/>
        <path class="cursor__ring" d="${outline}" stroke-width="${stroke}"/>
        <circle class="cursor__dot" cx="${cx}" cy="${cy}" r="${stroke * 1.2}"/>
      </g>
      <g class="cursor__arrows">
        <path class="cursor__edge" d="${arrows()}" stroke-width="${stroke * 0.8 + 3}"/>
        <path class="cursor__ring" d="${arrows()}" stroke-width="${stroke * 0.8}"/>
      </g>
    </g>`;

// Deux chevrons, un de chaque côté de la feuille allongée.
function arrows() {
  const reach = (vw / 2) * LEAF_STRETCH.x * 0.95 + stroke * 2;
  const side = (sign) => {
    const x = cx + sign * reach;
    return `M${x - sign * 4} ${cy - 8}L${x + sign * 4} ${cy}L${x - sign * 4} ${cy + 8}`;
  };
  return `${side(-1)}${side(1)}`;
}

function build() {
  const root = document.createElement("div");
  root.className = "cursor";
  root.setAttribute("aria-hidden", "true");
  root.dataset.state = "idle";
  root.dataset.scheme = "paper";
  root.style.setProperty("--cursor-ratio", String(vh / vw));
  root.innerHTML = `<svg class="cursor__svg" viewBox="${viewBox}" fill="none" focusable="false">
    ${layer("ink")}
    ${layer("paper")}
  </svg>`;
  document.body.append(root);
  return root;
}

// ---------- État ----------
let root;
let svg;
let leaves;
let moveX;
let moveY;
let turn;
let controller = null;
let visible = false;
let keyboard = false;
let px = null; // dernière position du pointeur (px)
let py = null;
let moved = 0; // pixels parcourus horizontalement depuis la dernière frame
let target = null; // élément sous le pointeur, donné par le dernier pointermove
let fresh = false; // true : target vient d'un pointermove, sinon on le relit (défilement)
let frame = 0;
let idle = 0;
let state = "idle";
let scheme = "paper";
let dot = false;

// ---------- Lecture de ce qui est sous le pointeur ----------
const isPhoto = (el) => {
  if (!el.matches("img, video")) return false;
  const box = el.getBoundingClientRect();
  return box.width * box.height >= PHOTO_MIN_AREA;
};

// Le header est au-dessus de la section : sa couleur de fond est celle du dégradé que header-theme.js lui donne (menu ouvert : olive).
const headerScheme = () => {
  const header = document.getElementById("header");
  if (header.querySelector('.header__menu[aria-expanded="true"]')) return "paper";
  const { gradient, theme } = header.dataset;
  if (gradient && gradient !== "off") return gradient === "cream" ? "ink" : "paper";
  return theme === "light" ? "ink" : "paper";
};

const schemeOf = (el) => {
  const declared = el.closest("[data-cursor-theme]");
  if (declared) return SCHEME_OF_THEME[declared.dataset.cursorTheme] ?? "paper";
  if (el.closest(PAPER_SURFACES) || isPhoto(el)) return "paper";
  if (el.closest("#header")) return headerScheme();
  const zone = el.closest("[data-header-gradient], [data-header-theme]");
  if (!zone) return el.matches("html, body, main") ? "ink" : "paper";
  const gradient = zone.dataset.headerGradient;
  if (gradient) return gradient === "cream" ? "ink" : "paper";
  return zone.dataset.headerTheme === "light" ? "ink" : "paper";
};

const stateOf = (el) => {
  const hit = el.closest(INTERACTIVE);
  if (hit?.matches(INERT)) return "idle";
  if (hit) {
    const own = hit.dataset.cursor;
    if (own === "text" || own === "drag") return own;
    if (!own && hit.matches('[aria-roledescription="carousel"]')) return "drag";
    return "link";
  }
  return el.closest(TEXT) ? "text" : "idle";
};

// ---------- Rendu ----------
const setState = (next) => {
  const before = state;
  state = next;
  root.dataset.state = next;
  if (reducedMotion()) return;
  gsap.to(svg, { scale: SCALE[next], duration: next === "link" ? 0.35 : 0.3, ease: next === "link" ? "back.out(1.7)" : "power3.out", overwrite: "auto" });
  gsap.to(leaves, {
    scaleX: next === "drag" ? LEAF_STRETCH.x : 1,
    scaleY: next === "drag" ? LEAF_STRETCH.y : 1,
    svgOrigin: ORIGIN,
    duration: 0.35,
    ease: "power3.out",
    overwrite: "auto",
  });
  // Petite transformation de la feuille à l'arrivée sur un lien : un quart de tour puis retour (0,35 s).
  if (next === "link" && before !== "link") {
    gsap
      .timeline()
      .to(leaves, { rotation: 32, svgOrigin: ORIGIN, duration: 0.14, ease: "power2.out", overwrite: "auto" })
      .to(leaves, { rotation: 0, duration: 0.21, ease: "back.out(2)" });
  }
};

const classify = (el) => {
  const nextScheme = schemeOf(el);
  if (nextScheme !== scheme) {
    scheme = nextScheme;
    root.dataset.scheme = nextScheme;
  }
  const nextState = stateOf(el);
  if (nextState !== state) setState(nextState);
  const nextDot = Boolean(el.closest(".cta"));
  if (nextDot !== dot) {
    dot = nextDot;
    root.toggleAttribute("data-dot", nextDot);
  }
};

// Une lecture et une écriture par frame, jamais plus : lecture de l'élément et de son thème d'abord, écritures ensuite.
const tick = () => {
  frame = 0;
  if (!visible || px === null) return;
  const el = fresh ? target : document.elementFromPoint(px, py);
  fresh = false;
  if (el) classify(el);
  if (!reducedMotion()) {
    const lean = Math.max(-MAX_TURN, Math.min(MAX_TURN, moved * TURN));
    turn((state === "drag" ? 0 : REST_ANGLE) + lean);
  }
  moved = 0;
};

const queue = () => {
  if (!frame) frame = requestAnimationFrame(tick);
};

const show = () => {
  visible = true;
  gsap.to(root, { opacity: 1, duration: 0.2, overwrite: "auto" });
};
const hide = () => {
  visible = false;
  gsap.to(root, { opacity: 0, duration: 0.2, overwrite: "auto" });
};

// ---------- Événements ----------
const onMove = (e) => {
  if (e.pointerType === "touch") return hide();
  if (keyboard) {
    if (e.clientX === px && e.clientY === py) return; // pas un vrai mouvement : le navigateur rejoue parfois le dernier
    keyboard = false;
    document.documentElement.classList.remove("cursor-keyboard");
  }
  const first = !visible;
  moved = first || px === null ? 0 : moved + e.clientX - px;
  px = e.clientX;
  py = e.clientY;
  target = e.target;
  fresh = true;
  if (first) {
    // Première apparition ou retour dans la fenêtre : la feuille se pose sous le pointeur, sans glisser depuis un coin.
    gsap.set(root, { x: px, y: py });
    show();
  } else if (reducedMotion()) {
    gsap.set(root, { x: px, y: py });
  } else {
    moveX(px);
    moveY(py);
  }
  queue();
  clearTimeout(idle);
  idle = setTimeout(queue, SETTLE);
};

const press = (down) => {
  if (!visible || reducedMotion()) return;
  gsap.to(root, { scale: down ? 0.8 : 1, duration: down ? 0.1 : 0.35, ease: down ? "power2.out" : "back.out(2.5)", overwrite: "auto" });
};
const onDown = (e) => e.pointerType !== "touch" && press(true);
const onUp = () => press(false);

// Touche Tab : le curseur système revient (le focus visible reste celui des styles existants), la feuille s'efface jusqu'au prochain mouvement.
const onKey = (e) => {
  if (e.key !== "Tab" || keyboard) return;
  keyboard = true;
  document.documentElement.classList.add("cursor-keyboard");
  hide();
};

function enable() {
  if (controller) return;
  if (!root) {
    root = build();
    svg = root.querySelector(".cursor__svg");
    leaves = root.querySelectorAll(".cursor__leaf");
    gsap.set(root, { x: 0, y: 0, force3D: true });
    gsap.set(svg, { rotation: REST_ANGLE });
    moveX = gsap.quickTo(root, "x", FOLLOW);
    moveY = gsap.quickTo(root, "y", FOLLOW);
    turn = gsap.quickTo(svg, "rotation", { duration: 0.45, ease: "power3" });
  }
  controller = new AbortController();
  const { signal } = controller;
  document.documentElement.classList.add("has-cursor");
  window.addEventListener("pointermove", onMove, { signal, passive: true }); // la seule écoute du mouvement
  window.addEventListener("pointerdown", onDown, { signal });
  window.addEventListener("pointerup", onUp, { signal });
  window.addEventListener("pointercancel", onUp, { signal });
  window.addEventListener("scroll", queue, { signal, passive: true }); // la page défile sous un pointeur immobile : le fond change
  window.addEventListener("keydown", onKey, { signal });
  document.documentElement.addEventListener("pointerleave", hide, { signal });
}

function disable() {
  if (!controller) return;
  controller.abort();
  controller = null;
  cancelAnimationFrame(frame);
  clearTimeout(idle);
  frame = 0;
  px = null;
  keyboard = false;
  visible = false;
  document.documentElement.classList.remove("has-cursor", "cursor-keyboard");
  gsap.set(root, { opacity: 0 });
}

export function initCursor() {
  if (window.top !== window.self) return; // aucun curseur personnalisé dans une iframe
  const sync = () => (ACTIVE.matches ? enable() : disable());
  ACTIVE.addEventListener("change", sync);
  sync();
}
