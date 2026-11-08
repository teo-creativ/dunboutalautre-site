// « Trois matières » de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §4 et §5, frames bureaux-18 à 33). Une section épinglée,
// UNE timeline scrubée : des objets de progression (s.g croissance de la photo, s.v voile, s.t1 et s.t2 glissements, s.o recouvrement) dont
// render() déduit tout le reste. Seuls transform, opacity et clip-path bougent. Phases, en écrans de scroll (1 unité = 1 écran) :
//   texte seul sur l'orange 0,35 ; la photo monte et grandit 1,25 ; voile et première slide 0,3 ; pause 0,2 ; glissement 1 vers 2 : 1 ;
//   pause 0,2 ; glissement 2 vers 3 : 1 ; pause finale 0,3 ; la section crème suivante monte par-dessus : 1 (dernier écran du pin).
//
// Photo (frames 21 à 25, mesurées à 1728 x 1030) : ce n'est pas un cadre qui s'ouvre sur une image fixe, c'est l'image entière qui grandit
// (largeur 854, 1148, 1392, 1618, puis 1728 px, et le haut du bord à 863, 689, 542, 261, puis 0 px) : un `scale` depuis le haut et une
// translation, interpolés entre ces mesures (courbe monotone). Le `clip-path` ne sert qu'aux coins arrondis, à rayon constant de 12 px à
// l'écran. Les trois fonds sont empilés dans le même élément : la photo qui grandit est déjà le fond du slider (aucune coupure).
// Slider : le rail est rigide (pas de 920 px entre titres ; le titre actif est centré à x = 909, centre du slider qui commence à 90 px ; les autres à 0,4) ; sur chaque glissement le
// fond suivant monte de 0 à 1 d'opacité par-dessus le précédent, qui reste dessous (aucun flash), et le paragraphe change autour du fondu (SWAP).
import { gsap } from "./core.js";
import { loadLater } from "./bureaux-images.js";
import { MEDIA, clamp, lerp, monotone, scaleSetter } from "./bureaux-scene.js";
import { claimHeader } from "./bureaux-header.js";
import { createBand } from "./bureaux-bande.js";

const REF_W = 1728;
const REF_H = 1030;

// Deux jeux de mesures lues sur les frames : « bureaux » (V5, frames bureaux-18 à 33, valeurs par défaut) et « design » (V6, frames design-09 à
// 24, section portant data-bx-variant="design"). Le code de la scène ne change pas : il lit le profil de sa section.
const PROFILES = {
  bureaux: {
    // Phases, en écrans de scroll (1 unité = 1 écran) : texte seul, la photo monte et grandit, voile et première slide, pauses, deux glissements,
    // puis la section suivante monte par-dessus (dernier écran du pin).
    PHASE: { pre: 0.35, grow: 1.25, veil: 0.3, hold1: 0.2, glide: 1, hold2: 0.2, hold3: 0.3, overlap: 1 },
    // Mesures des frames 21 à 25, et leur point de départ sous l'écran : p = progression de la croissance.
    GROW_P: [0, 0.2, 0.4, 0.6, 0.8, 1],
    GROW_TOP: [1030, 863, 689, 542, 261, 0], // px à 1030 de haut : bord haut de la photo
    GROW_SCALE: [0.494, 0.494, 0.664, 0.806, 0.936, 1], // largeur de la photo / largeur de l'écran
    GROW_DX: [0, -0.5, -5.5, -5.5, -18, 0], // px à 1728 : la photo est un peu à gauche du centre en route (marges 37 et 74 px sur la frame 24)
    ZOOM: null, // zoom de l'image dans la photo (Design seulement)
    RAIL: null, // positions propres des titres du slider (Design seulement) ; sinon un rail rigide de pas PITCH
    TEXT_OFF: null, // décalage propre du paragraphe de chaque slide (Design seulement)
    RADIUS: 12, // px à l'écran, jusqu'à 80 % de la croissance, puis il se résorbe
    HEAD_FADE: [0.5, 0.8], // le titre s'estompe de 1 à 0 entre ces deux points de la croissance (frames 22 à 24)
    VEIL_FROM: 0.25, // le texte du slider entre quand le voile atteint cette part
    RISE: 12, // px, montée du texte qui entre et du paragraphe qui change
    PITCH: 920, // px à 1728, entre deux titres
    ENTER_SCALE: 1.06, // échelle de départ du fond qui entre (le doc : 1,06)
    INACTIVE: 0.4, // opacité d'un titre qui n'est pas au centre
    TITLE_DY: [0, 19, 15], // px à 1728 : sur les frames le titre des slides 2 et 3 est plus bas que celui de la 1 (pastilles à 469 et 466 px contre 449)
    GLIDE: 0.6, // part du glissement où les titres bougent ; le fond se fond ensuite (0,5 à 1)
    // Changement de paragraphe (sortie puis entrée) : frame 29 = fond 2 à 26 % avec le nouveau texte déjà là ; frame 32 = fond 3 à 54 % avec l'ancien
    // texte encore là. Le premier glissement change donc de texte avant la moitié du fondu, le second après.
    SWAP: [
      [0.45, 0.65],
      [0.8, 1],
    ],
    HEADER_PHOTO: 0.95, // à partir de cette part de la croissance, la photo couvre le header : dégradé « photo »
    HEADER_RELEASE: 0.94, // part du recouvrement où le crème atteint le header : on rend la main aux sections
  },
  design: {
    PHASE: { pre: 0.35, grow: 1.0, veil: 0.3, hold1: 0.2, glide: 1, hold2: 0.2, hold3: 0.3, overlap: 1 },
    // Frames 10 à 13 (p = 0,25 ; 0,5 ; 0,75 ; 1) : bord haut de la photo à 802, 549, 249 puis 0 px, largeur 979, 1439, 1629 puis 1728 px, centrée.
    GROW_P: [0, 0.25, 0.5, 0.75, 1],
    GROW_TOP: [1030, 801, 548, 248, 0],
    GROW_SCALE: [0.568, 0.568, 0.834, 0.944, 1],
    GROW_DX: [0, 0, 0, 0, 0],
    // L'image entre dans la photo à sa largeur (frames 10 à 12 : sa largeur est celle de la photo, le logo Studapart fait 0,37 de sa largeur), puis
    // grossit de 20 % en fin de croissance, ancrée en haut au centre (frame 13 : logo de 767 px).
    ZOOM: { p: [0, 0.75, 1], v: [1, 1, 1.2], ratio: 2000 / 1100 }, // ratio : largeur / hauteur de l'image (fond-01)
    RADIUS: 12,
    HEAD_FADE: [0.3, 0.7],
    VEIL_FROM: 0.25,
    RISE: 12,
    PITCH: 920,
    ENTER_SCALE: 1.06,
    INACTIVE: 0.5,
    TITLE_DY: [0, 22, 15.5],
    GLIDE: 0.6,
    // Frames 15 à 21 : les titres sont alignés à gauche (bord de la boîte à 767,5 px quand le titre est actif), et le rail n'est pas rigide : à
    // un même instant le titre qui sort a fait 0,71 de son trajet et celui qui entre 0,52 (frame 16), 0,66 et 0,38 au second glissement (frame
    // 19) ; avec la courbe de glissement (power2.inOut) cela fait un retard de 0,16 et de 0,20 : l'entrant suit le sortant de 0,18 du glissement. nodes : par titre, [distance au centre en titres, bord gauche
    // de sa boîte en px à 1728] (parqué à gauche, actif, parqué à droite : mesures des frames 15, 16, 18, 19 et 21).
    RAIL: {
      left: 767.5,
      lag: 0.18,
      nodes: [
        [[-2, -920], [-1, -80], [0, 767.5]], // Naturel
        [[-2, -915], [-1, -71], [0, 768.3], [1, 1573]], // Stabilisé
        [[0, 767.3], [1, 1510], [2, 2350]], // Artificiel
      ],
    },
    // Le paragraphe de la troisième slide est centré à 899 px (frame 21), les autres à 908 ; sa première ligne est 2 px plus haut.
    TEXT_OFF: { x: [0, 0, -9], y: [0, 0, -2] },
    SWAP: [
      [0.45, 0.65],
      [0.8, 1],
    ],
    HEADER_PHOTO: 0.95,
    HEADER_RELEASE: 0.94,
  },
};

// Terrasses (V7, frames terrasses-17 à 28) : la bande de photos (scripts/bureaux-bande.js) précède la croissance de la photo, sur le crème. La photo part de la taille de
// la frame 17 (702 x 441 px, centrée, bord haut à 138 px : le cadre a le rapport de son image, voir bureaux-matieres.css) puis grandit en gardant son bord haut jusqu'à la
// frame 18 (1 200 x 753 px) avant de monter au plein écran (frame 19). Le texte du slider a les mesures de Bureaux (titres à 50 % de la hauteur sur les frames 21 à 27).
// PHASE.pre : montée des rangées (0,69 écran), puis fondu et recentrage de l'olivier (0,4 écran).
PROFILES.terrasses = {
  ...PROFILES.bureaux,
  BAND: true,
  PHASE: { pre: 1.1, grow: 1.0, veil: 0.3, hold1: 0.2, glide: 1, hold2: 0.2, hold3: 0.3, overlap: 1 },
  GROW_P: [0, 0.5, 1],
  GROW_TOP: [138, 138, 0], // px à 1030 de haut : bord haut du cadre
  GROW_SCALE: [0.406, 0.699, 1], // largeur du cadre / largeur de l'écran (frame 18 : 1 208 x 760 px)
  GROW_DX: [0, -20, 0], // px à 1728 : à la frame 18 le cadre est centré à 844 px, pas à 864
  INACTIVE: 0.5,
  TITLE_DY: [0, 24, 18],
};

// Entretien (V7, frames entretien-10 à 24) : « Quels végétaux entretient-on ? » arrive sur l'orange que le disque des formules a posé (scripts/bureaux-formules.js), puis la photo monte
// et grandit comme sur Bureaux, titres à pastille et paragraphes aux mesures de Bureaux. Croissance de la photo : frames 11 à 14 (p = 0,25 ; 0,5 ; 0,75 ; 1),
// bord haut à 743, 545, 247 puis 0 px, largeur 1 164, 1 510, 1 632 puis 1 728 px, centre à x = 878,5 sur la frame 11 (14,5 px à droite) puis 863,5 et 862,5 px.
// Rythme : les frames sont espacées de 410 px de scroll (0,4 écran) : la photo atteint 743 px (p = 0,25) à la frame 11, soit 0,8 écran après le début du pin, et p = 1 à la frame 14 :
// texte seul 0,39 écran, croissance 1,59 écran (Bureaux : 0,35 et 1,25). Le voile s'installe plus lentement (0,45 de voile sur la frame 15, 410 px après la fin de la croissance, et complet sur la 16 : 0,7 écran) et le premier
// glissement commence 0,85 écran après la fin de la croissance (frame 17 : titres à 60 % de leur course, frame 18 : fond à 50 %) ; pause de 0,23 écran avant le second (frame 20 : titres à 50 %, frame 21 : fond à 40 %), puis 0,24 écran
// avant que le crème ne monte (frame 23 : bord haut à 764 px, soit 266 px de recouvrement, frame 24 : 528 px).
// HEAD_IN : le titre n'est pas là au début du pin (frame 09 : écran tout orange, le disque vient de finir) mais sur la frame 10 : il apparaît en fondu pendant les premiers 0,25 écran.
PROFILES.entretien = {
  ...PROFILES.bureaux,
  PHASE: { pre: 0.39, grow: 1.59, veil: 0.7, hold1: 0.15, glide: 1, hold2: 0.23, hold3: 0.24, overlap: 1 },
  HEAD_IN: 0.25,
  GROW_P: [0, 0.25, 0.5, 0.75, 1],
  GROW_TOP: [1030, 743, 545, 247, 0],
  GROW_SCALE: [0.6736, 0.6736, 0.8738, 0.9444, 1],
  GROW_DX: [14.5, 14.5, -0.5, -1.5, 0],
  // Texte du slide (frames 16, 19 et 22, mesures du premier mot blanc et des lignes du paragraphe comparées au rendu de Bureaux) : le texte n'apparaît qu'aux deux tiers du voile (frame 15 : voile à 45 %,
  // pas de texte ; frame 16 : texte entier), les titres ne sont pas centrés au même point (centres à 909, 853 et 864 px : décalages de +3, -53 et -45 px), plus ou moins hauts que ceux de Bureaux (-11, +1 et -11 px, soit
  // TITLE_DY de -11, 20 et 4), et les paragraphes sont centrés à 877, 863 et 862 px, 2, 20 et 10 px plus bas (largeurs de chaque slide : bureaux-matieres.css).
  VEIL_FROM: 0.62,
  TITLE_DX: [3, -53, -45],
  TITLE_DY: [-10, 20, 4],
  TEXT_OFF: { x: [-32, -45.5, -47], y: [3, 20, 10] },
};

const glideEase = gsap.parseEase("power2.inOut"); // mouvement à l'écran : ease-in-out
// Position (bord gauche de la boîte, px à 1728) d'un titre à la distance d du centre, par interpolation linéaire entre ses nodes [d, x].
const railX = (nodes, d) => {
  if (d <= nodes[0][0]) return nodes[0][1];
  for (let i = 1; i < nodes.length; i++) if (d <= nodes[i][0]) return lerp(nodes[i - 1][1], nodes[i][1], (d - nodes[i - 1][0]) / (nodes[i][0] - nodes[i - 1][0]));
  return nodes.at(-1)[1];
};

export function initBureauxMatieres() {
  const section = document.querySelector('[data-bx="matieres"]');
  if (!section) return;
  const head = section.querySelector(".mat__head");
  const photo = section.querySelector(".mat__photo");
  const figures = [...section.querySelectorAll(".mat__bg")];
  const veil = section.querySelector(".mat__veil");
  const slides = [...section.querySelectorAll(".mat-slide")].map((el) => ({
    el,
    title: el.querySelector(".mat-slide__title"),
    text: el.querySelector(".mat-slide__text"),
  }));
  if (figures.length !== 3 || slides.length !== 3) return; // la scène est écrite pour trois matières

  // Profil de la section (data-bx-variant) : les noms sont ceux des constantes de V5, le reste du code n'a pas changé.
  const { PHASE, BAND, HEAD_IN, TITLE_DX, GROW_P, GROW_TOP, GROW_SCALE, GROW_DX, ZOOM, RAIL, TEXT_OFF, RADIUS, HEAD_FADE, VEIL_FROM, RISE, PITCH, ENTER_SCALE, INACTIVE, TITLE_DY, GLIDE, SWAP, HEADER_PHOTO, HEADER_RELEASE } =
    PROFILES[section.dataset.bxVariant] ?? PROFILES.bureaux;
  const TOTAL = PHASE.pre + PHASE.grow + PHASE.veil + PHASE.hold1 + PHASE.glide + PHASE.hold2 + PHASE.glide + PHASE.hold3 + PHASE.overlap;
  const topAt = monotone(GROW_P, GROW_TOP);
  const scaleAt = monotone(GROW_P, GROW_SCALE);
  const dxAt = monotone(GROW_P, GROW_DX);
  // Zoom de l'image : 0 à 1 sur la courbe du profil, puis 1 à kEnd. kEnd est 1,2 sur la frame (1728 x 1030) ; sur un écran plus haut, l'image à la
  // largeur de la photo ne couvrirait plus la hauteur (bord bas orange) : il monte alors jusqu'à la couvrir (ancrée en haut).
  const zoomNorm = ZOOM ? monotone(ZOOM.p, ZOOM.v.map((v) => (v - 1) / (ZOOM.v.at(-1) - 1))) : null;
  let kEnd = ZOOM ? ZOOM.v.at(-1) : 1;

  const set = {
    photoY: gsap.quickSetter(photo, "y", "px"),
    photoX: gsap.quickSetter(photo, "x", "px"),
    photoScale: scaleSetter(photo),
    veil: gsap.quickSetter(veil, "opacity"),
    head: head ? gsap.quickSetter(head, "opacity") : () => {}, // Terrasses : la bande remplace le texte sur l'orange
    fig: figures.map((f) => gsap.quickSetter(f, "opacity")),
    figScale: figures.map((f) => scaleSetter(f.querySelector("img"))),
    titleX: slides.map((s) => gsap.quickSetter(s.title, "x", "px")),
    titleY: slides.map((s) => gsap.quickSetter(s.title, "y", "px")),
    titleOp: slides.map((s) => gsap.quickSetter(s.title, "opacity")),
    textY: slides.map((s) => gsap.quickSetter(s.text, "y", "px")),
    textX: slides.map((s) => gsap.quickSetter(s.text, "x", "px")),
    textOp: slides.map((s) => gsap.quickSetter(s.text, "opacity")),
  };

  const mm = gsap.matchMedia();
  mm.add(
    MEDIA,
    ({ conditions }) => {
      // Terrasses : sous 900 px la bande et les trois fonds restent empilés, sans épinglage (le relais de la bande est écrit pour l'ordinateur).
      if (BAND && !conditions.wide) return;
      const root = document.documentElement;
      root.classList.add("bx-mat-anim");
      // Les trois fonds (1,2 Mo en 2000 px) sont chargés d'avance : aucun flash au changement de fond (bureaux-images.js).
      loadLater(section.querySelectorAll("img"));

      const s = { b: 0, g: 0, v: 0, t1: 0, t2: 0, o: 0, h: HEAD_IN && conditions.wide ? 0 : 1 }; // h : entrée du titre (Entretien)
      // Rectangle de départ de la photo (g = 0), en px : le relais de la bande s'y arrête.
      const target = () => {
        const vw = document.documentElement.clientWidth;
        const w = scaleAt(0) * vw;
        return { left: (vw - w) / 2 + (dxAt(0) * vw) / REF_W, top: (topAt(0) / REF_H) * window.innerHeight, w };
      };
      const bandCtl = BAND ? createBand(section, { target }) : null;
      const scale = () => Math.min(document.documentElement.clientWidth / REF_W, window.innerHeight / REF_H);
      let u = scale();
      let headerState = null; // null : les sections décident ; "photo" : photo claire sous le logo ; "off" : le voile suffit

      const render = () => {
        // ---------- La photo : monte et grandit, puis c'est le fond du slider ----------
        const h = window.innerHeight;
        // Terrasses : tant que la bande défile (s.b < 1), le cadre de la photo suit le rectangle que la bande lui donne ; il est invisible avant le relais.
        const vw = document.documentElement.clientWidth;
        const rect = bandCtl ? bandCtl.render(s.b) : null;
        let sc;
        if (rect && s.b < 1) {
          sc = rect.w / vw;
          set.photoY(rect.top);
          set.photoScale(sc);
          set.photoX(rect.left - (vw - rect.w) / 2);
        } else {
          sc = scaleAt(s.g);
          set.photoY((topAt(s.g) / REF_H) * h);
          set.photoScale(sc);
          set.photoX((dxAt(s.g) * vw) / REF_W);
        }
        if (bandCtl) photo.style.opacity = rect ? "" : "0";
        const growing = s.g < 1;
        photo.style.clipPath = growing ? `inset(0 round ${(RADIUS / sc) * clamp((1 - s.g) / (1 - 0.8))}px)` : "none";
        set.head(s.h * (1 - clamp((s.g - HEAD_FADE[0]) / (HEAD_FADE[1] - HEAD_FADE[0]))));
        set.veil(s.v);

        // ---------- Le slider ----------
        const e1 = glideEase(clamp(s.t1 / GLIDE));
        const e2 = glideEase(clamp(s.t2 / GLIDE));
        const f = e1 + e2; // position du rail : 0 (matière 1 au centre) à 2
        const pitch = conditions.wide ? PITCH * u : document.documentElement.clientWidth;
        const enter = clamp((s.v - VEIL_FROM) / (1 - VEIL_FROM)); // le texte entre avec le voile
        const swap = (t, [from, to]) => [clamp((t - from) / ((to - from) / 2)), clamp((t - (from + to) / 2) / ((to - from) / 2))]; // [sortie, entrée]
        const swap1 = swap(s.t1, SWAP[0]);
        const swap2 = swap(s.t2, SWAP[1]);
        const textOp = [(1 - swap1[0]) * enter, swap1[1] * (1 - swap2[0]) * enter, swap2[1] * enter];
        const textY = [-RISE * swap1[0] + RISE * (1 - enter), RISE * (1 - swap1[1]) - RISE * swap2[0], RISE * (1 - swap2[1])];
        // Design (RAIL) : chaque titre a son propre trajet (sortant en avance, entrant en retard), position lue dans la table de ses nodes.
        const lagged = (t) => glideEase(clamp((t / GLIDE - (RAIL?.lag ?? 0)) / (1 - (RAIL?.lag ?? 0))));
        const railF = RAIL && conditions.wide ? [e1 + e2, lagged(s.t1) + e2, lagged(s.t1) + lagged(s.t2)] : null;
        slides.forEach((_, k) => {
          const d = railF ? k - railF[k] : k - f;
          set.titleX[k]((railF ? (railX(RAIL.nodes[k], d) - RAIL.left) * u : d * pitch) + (TITLE_DX && conditions.wide ? TITLE_DX[k] * u : 0));
          set.titleY[k](RISE * (1 - enter) + TITLE_DY[k] * (conditions.wide ? u : 0));
          set.titleOp[k](lerp(1, INACTIVE, clamp(Math.abs(d))) * enter);
          set.textOp[k](textOp[k]);
          set.textY[k](TEXT_OFF && conditions.wide ? textY[k] + TEXT_OFF.y[k] * u : textY[k]);
          if (TEXT_OFF && conditions.wide) set.textX[k](TEXT_OFF.x[k] * u);
        });

        // ---------- Les fonds : le suivant monte par-dessus, le précédent reste dessous ----------
        const bg = [1, clamp((s.t1 - 0.5) / 0.5), clamp((s.t2 - 0.5) / 0.5)];
        figures.forEach((_, k) => {
          set.fig[k](bg[k]);
          if (k) set.figScale[k](ENTER_SCALE - (ENTER_SCALE - 1) * bg[k]); // le fond qui entre se pose de ENTER_SCALE à 1
        });
        if (zoomNorm && conditions.wide) set.figScale[0](1 + (kEnd - 1) * zoomNorm(s.g)); // Design : l'image de la première photo grossit en fin de croissance (ancrée en haut)

        // ---------- Header : blanc sur l'orange (dégradé orange), puis dégradé photo ; olive quand le crème arrive ----------
        const wantPhoto = s.g >= HEADER_PHOTO && s.o < HEADER_RELEASE;
        const state = wantPhoto ? (s.v < VEIL_FROM ? "photo" : "off") : null;
        if (state !== headerState) {
          headerState = state;
          claimHeader("matieres", state);
        }
      };
      const sync = () => {
        u = scale();
        if (ZOOM) kEnd = Math.max(ZOOM.v.at(-1), ((window.innerHeight * ZOOM.ratio) / document.documentElement.clientWidth) * 1.005);
        section.style.setProperty("--bx-u", `${u}px`);
        bandCtl?.sync();
        render();
      };
      sync();

      const tl = gsap.timeline({
        defaults: { ease: "none", onUpdate: render },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const length = TOTAL * section.offsetHeight;
            // Lu par le thème du header : la zone de la section dure tant qu'elle est seule à l'écran, donc sans le dernier écran du pin, où la
            // section suivante monte par-dessus (sinon le header garde son thème un écran de trop).
            section.dataset.pinLength = length - PHASE.overlap * section.offsetHeight;
            return `+=${length}`;
          },
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: sync,
          onToggle: (self) => {
            photo.style.willChange = self.isActive ? "transform" : ""; // will-change seulement pendant que la scène est active
          },
        },
      });
      let at = 0;
      const phase = (vars, duration) => {
        tl.to(s, { ...vars, duration }, at);
        at += duration;
      };
      if (bandCtl) tl.to(s, { b: 1, duration: PHASE.pre }, 0); // Terrasses : la phase de la bande
      if (HEAD_IN && conditions.wide) tl.to(s, { h: 1, duration: HEAD_IN }, 0); // Entretien : le titre apparaît au début du pin
      at = PHASE.pre;
      phase({ g: 1 }, PHASE.grow);
      phase({ v: 1 }, PHASE.veil);
      at += PHASE.hold1;
      phase({ t1: 1 }, PHASE.glide);
      at += PHASE.hold2;
      phase({ t2: 1 }, PHASE.glide);
      at += PHASE.hold3;
      phase({ o: 1 }, PHASE.overlap);
      tl.set({}, {}, TOTAL);

      // Point d'accroche : la section qui suit (Pourquoi végétaliser) remonte d'un écran par-dessus la photo.
      const wrap = section.closest(".pin-spacer") ?? section;
      const next = wrap.nextElementSibling;
      next?.classList.add("bx-overlap");

      return () => {
        next?.classList.remove("bx-overlap");
        claimHeader("matieres", null);
        bandCtl?.destroy();
        root.classList.remove("bx-mat-anim");
        delete section.dataset.pinLength;
        section.style.removeProperty("--bx-u");
        photo.style.cssText = "";
        gsap.set([...(head ? [head] : []), veil, ...figures, ...figures.map((f) => f.querySelector("img")), ...slides.flatMap((x) => [x.title, x.text])], { clearProps: "transform,opacity" });
      };
    },
  );
}
