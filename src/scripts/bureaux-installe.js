// « Ce qu'on installe » de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §3, frames bureaux-06 à 19). La section est épinglée et UNE
// seule timeline scrubée la pilote : un objet de progression `s.p` (0 à 1) dont render() déduit la position, la hauteur et l'inclinaison de
// chacune des 5 cartes. Seuls transform (x, y, rotation) et opacity bougent.
//
// Valeurs lues sur les frames (1728 x 1030, px à cette largeur, mises à l'échelle par `u`) :
//  - Départ (frame 06) : cartes 1 et 2 au repos, bord gauche à 167 et 909 px, carte 3 pas encore entrée. Arrivée (frame 17) : cartes 4 et 5 au
//    repos au même endroit (169 et 922 px mesurés). Chaque carte part de x0 et parcourt d (x = x0 - d * e(p)) avec son propre profil :
//    e(p) = p^accel, les cartes accélèrent pendant le parcours (pas de 200 px par image au début, 380 px à la fin), et les cartes 4 et 5, qui
//    s'arrêtent, atterrissent en douceur à partir de `land` (Hermite, pente nulle) au lieu de s'arrêter net. Les écarts entre cartes varient
//    donc comme sur les frames ; accel = 1 donne un mouvement linéaire. Positions recalées sur les frames 07 à 16 (écart d'au plus 100 px).
//  - Vague : y = 45 px * sin(2π e / 1,8) (descend puis revient, -15 à -27 px à l'arrivée comme sur la frame 17) ; inclinaison de la photo
//    = -celle de la carte, de +2° au départ à -2° à l'arrivée, jusqu'à ±4° entre les deux (2,5 cycles).
// Mobile et petits écrans (moins de 1100 px) : une carte à la fois au centre, vague réduite de moitié. Mouvement réduit : colonne, sans pin.
import { gsap, ScrollTrigger } from "./core.js";

const REF_W = 1728;
const REF_H = 1030;

// Timeline en écrans de scroll (1 unité = 1 écran). Le dernier écran est celui du recouvrement par la section suivante.
const WIDE = {
  total: 5, // 500vh (docs)
  move: 3.6, // traversée de l'écran
  hold: 0.4, // pause, cartes 4 et 5 immobiles (docs : environ 40vh)
  // Une entrée par carte : x0 = bord gauche au départ, d = déplacement total (vitesse propre), accel = exposant de la vitesse, land = part de la
  // traversée où l'atterrissage commence (1 : la carte sort de l'écran, elle ne s'arrête pas).
  cards: [
    { x0: 167, d: 1880, accel: 1.0, land: 1 },
    { x0: 909, d: 2327, accel: 1.15, land: 1 },
    { x0: 1790, d: 2700, accel: 1.35, land: 1 },
    { x0: 2469, d: 2300, accel: 1.15, land: 0.7 },
    { x0: 2957, d: 2048, accel: 1.35, land: 0.88 },
  ],
  waveY: 45, // px, doc : environ 40 (45 : les cartes 4 et 5 sont à -31 et -18 px de leur ligne de départ sur la frame 17)
  waveYPeriod: 1.8, // période de la vague, en unités de e
  psi: [0, -0.03, 0.04, 0.05, 0], // décalage de phase de la vague de chaque carte (cycles) : elles ne montent pas toutes ensemble
  twistRest: 2, // °, inclinaison au repos (frames 06 et 17)
  twistMore: 2, // ° en plus au plus fort du mouvement (frames 07 à 16 : 4 à 7°)
  twistCycles: 2.5, // demi-cycles : +2° au départ, -2° à l'arrivée
  delta: [0, 0.02, 0.04, -0.02, -0.03], // décalage de phase de l'inclinaison de chaque carte (cycles)
};
const SOLO = { total: 4.5, move: 3.2, hold: 0.3, waveY: 20, twist: 2 }; // une carte à la fois : vague réduite de moitié
const FADE_FROM = 0.15; // part du recouvrement où le titre et les cartes commencent à s'estomper (frame 18 : encore entiers)
const FADE_TO = 0.3; // opacité à la fin du recouvrement (frame 19 : 0,7 à 45 % du recouvrement)

const TAU = Math.PI * 2;

// Atterrissage : p^accel jusqu'à `land`, puis une courbe d'Hermite qui rejoint 1 avec une pente nulle.
const makeEase = ({ accel, land }) => {
  if (land >= 1) return (p) => p ** accel;
  const at = land ** accel;
  const slope = accel * land ** (accel - 1);
  const w = 1 - land;
  return (p) => {
    if (p <= land) return p ** accel;
    const t = (p - land) / w;
    const t2 = t * t;
    const t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * at + (t3 - 2 * t2 + t) * w * slope + (-2 * t3 + 3 * t2);
  };
};

export function initBureauxInstalle() {
  const section = document.querySelector('[data-bx="installe"]');
  if (!section) return;
  const head = section.querySelector(".install__head");
  const track = section.querySelector(".install__track");
  const items = [...section.querySelectorAll(".install-card")].map((el) => ({
    el,
    x: gsap.quickSetter(el, "x", "px"),
    y: gsap.quickSetter(el, "y", "px"),
    photo: gsap.quickSetter(el.querySelector(".install-card__photo"), "rotation", "deg"),
    body: gsap.quickSetter(el.querySelector(".install-card__body"), "rotation", "deg"),
  }));
  // La scène est écrite pour 5 cartes (trajets propres à chacune, WIDE.cards) : avec un autre nombre, les cartes restent en colonne.
  if (items.length !== WIDE.cards.length) return;

  const mm = gsap.matchMedia();
  mm.add(
    {
      wide: "(min-width: 1100px) and (prefers-reduced-motion: no-preference)",
      solo: "(max-width: 1099px) and (prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      const T = conditions.wide ? WIDE : SOLO;
      const root = document.documentElement;
      const classes = conditions.wide ? ["bx-install-anim"] : ["bx-install-anim", "bx-install-solo"];
      root.classList.add(...classes);
      // Les photos sont toutes chargées d'avance : celles des cartes 3 à 5 sont hors écran, à droite, et arriveraient sinon avec retard.
      section.querySelectorAll("img").forEach((img) => {
        img.loading = "eager";
      });

      // Échelle de la scène : celle de la maquette (1728 x 1030), réduite pour que tout tienne dans l'écran.
      const scale = () => Math.min(document.documentElement.clientWidth / REF_W, window.innerHeight / REF_H);
      const eases = WIDE.cards.map(makeEase);
      const s = { p: 0 };
      let u = scale();

      const renderWide = () => {
        items.forEach((c, k) => {
          const e = eases[k](s.p);
          const y = WIDE.waveY * u * Math.sin(TAU * (e / WIDE.waveYPeriod + WIDE.psi[k]));
          const twist = (WIDE.twistRest + WIDE.twistMore * Math.sin(Math.PI * e)) * Math.cos(TAU * (WIDE.twistCycles * e + WIDE.delta[k]));
          c.x((WIDE.cards[k].x0 - WIDE.cards[k].d * e) * u);
          c.y(y);
          c.photo(twist);
          c.body(-twist);
        });
      };
      // Une carte à la fois : la carte `k` est au centre quand f = k. Pas de vitesses propres ni de pente : un pas régulier.
      const renderSolo = () => {
        const f = s.p * (items.length - 1);
        const pitch = items[0].el.offsetWidth + document.documentElement.clientWidth * 0.1;
        items.forEach((c, k) => {
          const d = k - f;
          c.x(d * pitch);
          c.y(-SOLO.waveY * Math.sin((Math.PI * d) / 2));
          const twist = SOLO.twist * Math.cos(Math.PI * d);
          c.photo(twist);
          c.body(-twist);
        });
      };
      const render = conditions.wide ? renderWide : renderSolo;
      const sync = () => {
        u = scale();
        section.style.setProperty("--bx-u", `${u}px`);
        // Une carte à la fois : les cartes sont centrées dans la place qui reste sous le titre (3 lignes sur un téléphone).
        if (!conditions.wide) section.style.setProperty("--bx-head-bottom", `${head.offsetTop + head.offsetHeight + 26}px`);
        render();
      };
      sync();

      const total = T.total;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const length = total * section.offsetHeight;
            // Lu par le thème du header : la zone dure tant que la section est seule à l'écran, donc sans le dernier écran du pin, où la
            // section suivante (orange, header blanc) monte par-dessus : sinon le header garde son thème olive un écran de trop.
            section.dataset.pinLength = (T.move + T.hold) * section.offsetHeight;
            return `+=${length}`;
          },
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: sync,
          // will-change seulement pendant que la section est épinglée et animée.
          onToggle: (self) => items.forEach((c) => (c.el.style.willChange = self.isActive ? "transform" : "")),
        },
      });
      tl.to(s, { p: 1, duration: T.move, onUpdate: render }, 0);
      // Recouvrement : la section suivante monte par-dessus (marge négative, bureaux-installe.css) ; le titre et les cartes s'estompent.
      const overlap = total - T.move - T.hold;
      tl.to([head, track], { opacity: FADE_TO, duration: overlap * (1 - FADE_FROM) }, T.move + T.hold + overlap * FADE_FROM).set({}, {}, total);

      // Point d'accroche : la section suivante (celle des trois matières, refaite à l'étape suivante) remonte d'un écran.
      const wrap = section.closest(".pin-spacer") ?? section;
      const next = wrap.nextElementSibling;
      next?.classList.add("bx-overlap");

      return () => {
        next?.classList.remove("bx-overlap");
        root.classList.remove(...classes);
        delete section.dataset.pinLength;
        section.style.removeProperty("--bx-u");
        section.style.removeProperty("--bx-head-bottom");
        items.forEach((c) => {
          c.el.style.willChange = "";
          gsap.set([c.el, c.el.querySelector(".install-card__photo"), c.el.querySelector(".install-card__body")], { clearProps: "transform" });
        });
        gsap.set([head, track], { clearProps: "opacity" });
      };
    },
  );
}
