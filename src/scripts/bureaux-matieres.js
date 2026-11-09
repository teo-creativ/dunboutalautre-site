// « Trois matières » de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §4 et §5, frames bureaux-18 à 33), repris par Design, Terrasses et Entretien. Une section épinglée,
// UNE timeline scrubée : des objets de progression (s.g croissance de la photo, s.v voile, s.t1 et s.t2 glissements, s.o recouvrement) dont
// render() déduit tout le reste. Seuls transform, opacity et clip-path bougent. Phases, en écrans de scroll (1 unité = 1 écran) :
//   texte seul sur l'orange 0,35 ; la photo monte et grandit 1,25 ; voile et première slide 0,3 ; pause 0,2 ; glissement 1 vers 2 : 1 ;
//   pause 0,2 ; glissement 2 vers 3 : 1 ; pause finale 0,3 ; la section crème suivante monte par-dessus : 1 (dernier écran du pin).
//
// Photo (frames 21 à 25, mesurées à 1728 x 1030) : ce n'est pas un cadre qui s'ouvre sur une image fixe, c'est l'image entière qui grandit
// (largeur 854, 1148, 1392, 1618, puis 1728 px, et le haut du bord à 863, 689, 542, 261, puis 0 px) : un `scale` depuis le haut et une
// translation, interpolés entre ces mesures (courbe monotone). Le `clip-path` ne sert qu'aux coins arrondis, à rayon constant de 12 px à
// l'écran. Les trois fonds sont empilés dans le même élément : la photo qui grandit est déjà le fond du slider (aucune coupure).
//
// Slider (retours V8, G6, retours-v8/docs/02-SLIDERS-ET-SECTIONS-ORANGE.md partie A), le même pour toutes les pages :
//  - changement de photo : JAMAIS deux photos à mi-opacité. Sur chaque glissement un voile sombre (.mat__dim, par-dessus le voile de lecture) monte pendant la
//    première moitié, au pic (SWAP_AT) la photo suivante prend la place de la précédente (opacité 1 et 0, l'écran est sombre : le changement ne se voit pas),
//    puis le voile redescend pendant que la photo entrante se pose (échelle ENTER_SCALE vers 1) ; le paragraphe sort juste avant l'échange et entre juste après ;
//  - le titre actif est centré sur le milieu de la fenêtre (la largeur de chaque titre est mesurée à chaque refresh), ses voisins sont à gauche et à droite, séparés de lui
//    par le même écart ; le bloc titre et paragraphe est centré verticalement dans la section par une grille (bureaux-matieres.css), les trois slides partagent les mêmes
//    rangées : le titre reste à la même hauteur d'une slide à l'autre.
import { gsap } from "./core.js";
import { loadLater } from "./bureaux-images.js";
import { MEDIA, clamp, lerp, markOverlap, monotone, overlapOptions, scaleSetter } from "./bureaux-scene.js";
import { claimHeader } from "./bureaux-header.js";
import { bandSolo, bandStatic, createBand } from "./bureaux-bande.js";

const REF_W = 1728;
const REF_H = 1030;

// Réglages du changement de photo, communs à toutes les variantes (part de la progression d'un glissement, de 0 à 1).
const SWAP_AT = 0.5; // instant de l'échange des photos : pic du voile
const DIM = 0.6; // opacité du voile d'échange à son pic, par-dessus le voile de lecture (0,45 : l'écran est alors assombri à 78 %)
const DIM_HOLD = 0.45; // le voile monte de 0 à 0,45 de la progression, tient jusqu'à 0,55, puis redescend (phases 1 à 3 du doc)
const SWAP = [0.4, 0.6]; // paragraphe : sort de 0,4 à 0,5, entre de 0,5 à 0,6 (jamais deux paragraphes lisibles en même temps)

// Deux jeux de mesures lues sur les frames : « bureaux » (V5, frames bureaux-18 à 33, valeurs par défaut) et « design » (V6, frames design-09 à
// 24, section portant data-bx-variant="design"). Le code de la scène ne change pas : il lit le profil de sa section. Les mesures de position des titres et des
// paragraphes des frames (décalages, rail de Design) ont cédé la place au centrage exact de V8.
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
    GROW_EASE: "none", // courbe de la croissance de la photo (V8 : Design l'adoucit)
    RADIUS: 12, // px à l'écran, jusqu'à 80 % de la croissance, puis il se résorbe
    HEAD_FADE: [0.5, 0.8], // le titre s'estompe de 1 à 0 entre ces deux points de la croissance (frames 22 à 24)
    VEIL_FROM: 0.25, // le texte du slider entre quand le voile atteint cette part
    RISE: 12, // px, montée du texte qui entre et du paragraphe qui change
    RAIL_GAP: 220, // px à 1728, entre le bord d'un titre et celui de son voisin (ordinateur ; sous 900 px un titre occupe un écran)
    ENTER_SCALE: 1.06, // échelle de départ du fond qui entre (le doc : 1,06)
    INACTIVE: 0.4, // opacité d'un titre qui n'est pas au centre
    GLIDE: 0.6, // part du glissement où les titres bougent ; l'échange des photos tombe à SWAP_AT
    HEADER_PHOTO: 0.95, // à partir de cette part de la croissance, la photo couvre le header : dégradé « photo »
    HEADER_RELEASE: 0.94, // part du recouvrement où le crème atteint le header : on rend la main aux sections
  },
  design: {
    // Retours V8 (Design fb-03) : le titre se lit AVANT que la photo ne monte (texte seul 0,9 écran au lieu de 0,35, le titre se révèle pendant l'arrivée de l'orange : reveal-on-enter) et la photo
    // monte plus lentement (1,5 écran au lieu de 1, x1,5), en douceur au départ et à l'arrivée (sine.inOut) : elle n'apparaît plus d'un coup. Le titre s'estompe avant qu'elle ne le touche (le bord haut
    // de la photo passe sous le titre vers 38 % de la croissance) : plus de titre coupé par la photo.
    PHASE: { pre: 0.9, grow: 1.5, veil: 0.3, hold1: 0.2, glide: 1, hold2: 0.2, hold3: 0.3, overlap: 1 },
    GROW_EASE: "sine.inOut",
    // Frames 10 à 13 (p = 0,25 ; 0,5 ; 0,75 ; 1) : bord haut de la photo à 802, 549, 249 puis 0 px, largeur 979, 1439, 1629 puis 1728 px, centrée.
    GROW_P: [0, 0.25, 0.5, 0.75, 1],
    GROW_TOP: [1030, 801, 548, 248, 0],
    GROW_SCALE: [0.568, 0.568, 0.834, 0.944, 1],
    GROW_DX: [0, 0, 0, 0, 0],
    // L'image entre dans la photo à sa largeur (frames 10 à 12 : sa largeur est celle de la photo, le logo Studapart fait 0,37 de sa largeur), puis
    // grossit de 20 % en fin de croissance, ancrée en haut au centre (frame 13 : logo de 767 px).
    ZOOM: { p: [0, 0.75, 1], v: [1, 1, 1.2], ratio: 2000 / 1100 }, // ratio : largeur / hauteur de l'image (fond-01)
    RADIUS: 12,
    HEAD_FADE: [0.08, 0.34], // frames : 0,3 à 0,7 ; V8 : avant le contact de la photo
    VEIL_FROM: 0.25,
    RISE: 12,
    RAIL_GAP: 220,
    ENTER_SCALE: 1.06,
    INACTIVE: 0.5,
    GLIDE: 0.6,
    HEADER_PHOTO: 0.95,
    HEADER_RELEASE: 0.94,
  },
};

// Terrasses (V7, frames terrasses-17 à 28) : la bande de photos (scripts/bureaux-bande.js) précède la croissance de la photo, sur le crème. La photo part de la taille de
// la frame 17 (702 x 441 px, centrée, bord haut à 138 px : le cadre a le rapport de son image, voir bureaux-matieres.css) puis grandit en gardant son bord haut jusqu'à la
// frame 18 (1 200 x 753 px) avant de monter au plein écran (frame 19).
// PHASE.pre : montée et défilement des rangées jusqu'à p_align (75 %), puis fondu et agrandissement centré de l'olivier (25 %).
// Retours V8 : les rangées sont pilotées par le scroll (scripts/bureaux-bande.js) et la phase passe de 1,1 à 2,8 écrans (au moins 2,5 pour l'ensemble de la bande) : chaque photo a le temps
// d'être vue (les rangées parcourent 1,4 largeur d'écran en 2,1 écrans) ; l'olivier est au milieu de l'écran à p_align : le cadre ne bouge plus latéralement ensuite (GROW_DX à 0).
PROFILES.terrasses = {
  ...PROFILES.bureaux,
  BAND: true,
  PHASE: { pre: 2.8, grow: 1.0, veil: 0.3, hold1: 0.2, glide: 1, hold2: 0.2, hold3: 0.3, overlap: 1 },
  GROW_P: [0, 0.5, 1],
  GROW_TOP: [138, 138, 0], // px à 1030 de haut : bord haut du cadre
  GROW_SCALE: [0.406, 0.699, 1], // largeur du cadre / largeur de l'écran (frame 18 : 1 208 x 760 px)
  GROW_DX: [0, 0, 0], // px à 1728 : sur la frame 18 le cadre est centré à 844 px (-20), mais V8 veut aucun mouvement latéral de la photo cible : toujours centré
  INACTIVE: 0.5,
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
  // Le texte n'apparaît qu'aux deux tiers du voile (frame 15 : voile à 45 %, pas de texte ; frame 16 : texte entier).
  VEIL_FROM: 0.62,
};

const glideEase = gsap.parseEase("power2.inOut"); // mouvement à l'écran : ease-in-out
// Voile d'échange : 0 aux deux bouts du glissement, 1 de DIM_HOLD à 1 - DIM_HOLD (courbe en cloche, pic à SWAP_AT).
const dimAt = (t) => glideEase(clamp((t < SWAP_AT ? t : 1 - t) / DIM_HOLD));

// Position (centre du titre, px depuis le milieu de la fenêtre) de chaque titre k quand le titre j est actif : le titre actif est au milieu ; ses voisins sont placés bord à bord
// avec le même écart `gap` de chaque côté. Sous 900 px (`solo`), un titre occupe un écran : le pas est la largeur de la fenêtre.
export function railOffsets(widths, gap, solo, viewport) {
  return widths.map((_, j) =>
    widths.map((__, k) => {
      if (k === j) return 0;
      if (solo) return (k - j) * viewport;
      const [a, b] = k > j ? [j, k] : [k, j];
      let x = 0;
      for (let m = a; m < b; m++) x += widths[m] / 2 + gap + widths[m + 1] / 2;
      return k > j ? x : -x;
    }),
  );
}

export function initBureauxMatieres() {
  const section = document.querySelector('[data-bx="matieres"]');
  if (!section) return;
  const head = section.querySelector(".mat__head");
  const photo = section.querySelector(".mat__photo");
  const figures = [...section.querySelectorAll(".mat__bg")];
  const veil = section.querySelector(".mat__veil");
  const dim = section.querySelector(".mat__dim");
  const slides = [...section.querySelectorAll(".mat-slide")].map((el) => ({
    el,
    title: el.querySelector(".mat-slide__title"),
    text: el.querySelector(".mat-slide__text"),
  }));
  if (figures.length !== 3 || slides.length !== 3) return; // la scène est écrite pour trois matières

  // Profil de la section (data-bx-variant) : les noms sont ceux des constantes de V5, le reste du code n'a pas changé.
  const { PHASE, BAND, HEAD_IN, GROW_EASE, GROW_P, GROW_TOP, GROW_SCALE, GROW_DX, ZOOM, RADIUS, HEAD_FADE, VEIL_FROM, RISE, RAIL_GAP, ENTER_SCALE, INACTIVE, GLIDE, HEADER_PHOTO, HEADER_RELEASE } =
    PROFILES[section.dataset.bxVariant] ?? PROFILES.bureaux;
  // Arrivée de la section suivante par-dessus : au moins 1 écran, lissage 1 (réglables par page, overlapOptions).
  const { screens: OVERLAP, scrub } = overlapOptions(section, { screens: PHASE.overlap });
  const TOTAL = PHASE.pre + PHASE.grow + PHASE.veil + PHASE.hold1 + PHASE.glide + PHASE.hold2 + PHASE.glide + PHASE.hold3 + OVERLAP;
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
    dim: dim ? gsap.quickSetter(dim, "opacity") : () => {},
    head: head ? gsap.quickSetter(head, "opacity") : () => {}, // Terrasses : la bande remplace le texte sur l'orange
    fig: figures.map((f) => gsap.quickSetter(f, "opacity")),
    figScale: figures.map((f) => scaleSetter(f.querySelector("img"))),
    titleX: slides.map((s) => gsap.quickSetter(s.title, "x", "px")),
    titleY: slides.map((s) => gsap.quickSetter(s.title, "y", "px")),
    titleOp: slides.map((s) => gsap.quickSetter(s.title, "opacity")),
    textY: slides.map((s) => gsap.quickSetter(s.text, "y", "px")),
    textOp: slides.map((s) => gsap.quickSetter(s.text, "opacity")),
  };

  const mm = gsap.matchMedia();
  mm.add(
    MEDIA,
    ({ conditions }) => {
      // Terrasses : sous 900 px la bande et les trois fonds restent empilés, sans épinglage (le relais de la bande est écrit pour l'ordinateur) ; une seule rangée suit le scroll (bandSolo).
      if (BAND && !conditions.wide) return bandSolo(section);
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
      const bandCtl = BAND ? createBand(section, { target, length: () => PHASE.pre * section.offsetHeight }) : null;
      const scale = () => Math.min(document.documentElement.clientWidth / REF_W, window.innerHeight / REF_H);
      let u = scale();
      let rail = railOffsets(slides.map(() => 0), 0, !conditions.wide, document.documentElement.clientWidth); // mesuré à chaque refresh (sync)
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
        const enter = clamp((s.v - VEIL_FROM) / (1 - VEIL_FROM)); // le texte entre avec le voile
        const swap = (t) => [clamp((t - SWAP[0]) / ((SWAP[1] - SWAP[0]) / 2)), clamp((t - (SWAP[0] + SWAP[1]) / 2) / ((SWAP[1] - SWAP[0]) / 2))]; // [sortie, entrée]
        const swap1 = swap(s.t1);
        const swap2 = swap(s.t2);
        const textOp = [(1 - swap1[0]) * enter, swap1[1] * (1 - swap2[0]) * enter, swap2[1] * enter];
        const textY = [-RISE * swap1[0] + RISE * (1 - enter), RISE * (1 - swap1[1]) - RISE * swap2[0], RISE * (1 - swap2[1])];
        // Rail : entre deux matières, chaque titre glisse de sa place à sa place suivante (décalages mesurés, voir railOffsets).
        const i = Math.min(Math.floor(f), slides.length - 2);
        slides.forEach((_, k) => {
          set.titleX[k](lerp(rail[i][k], rail[i + 1][k], f - i));
          set.titleY[k](RISE * (1 - enter));
          set.titleOp[k](lerp(1, INACTIVE, clamp(Math.abs(k - f))) * enter);
          set.textOp[k](textOp[k]);
          set.textY[k](textY[k]);
        });

        // ---------- Les fonds : voile sombre, échange au pic, la photo entrante se pose ----------
        // Une seule photo est visible à la fois (opacité 1 ou 0, jamais entre les deux) : le fond suivant prend la place du précédent quand le voile est au plus sombre.
        set.dim(DIM * Math.max(dimAt(s.t1), dimAt(s.t2)));
        const shown = s.t2 >= SWAP_AT ? 2 : s.t1 >= SWAP_AT ? 1 : 0;
        figures.forEach((_, k) => {
          set.fig[k](k === shown ? 1 : 0);
          if (k) set.figScale[k](ENTER_SCALE - (ENTER_SCALE - 1) * glideEase(clamp(((k === 1 ? s.t1 : s.t2) - SWAP_AT) / (1 - SWAP_AT)))); // se pose de ENTER_SCALE à 1 après l'échange
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
        // Largeur de chaque titre (la grille les centre ; leur place sur le rail se déduit de leurs largeurs), mesurée au refresh : police, largeur d'écran.
        rail = railOffsets(slides.map((x) => x.title.offsetWidth), RAIL_GAP * u, !conditions.wide, document.documentElement.clientWidth);
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
            section.dataset.pinLength = length - OVERLAP * section.offsetHeight;
            return `+=${length}`;
          },
          pin: true,
          scrub, // 1 par défaut : lissage du slider (retours V8 : 0,8 à 1,2)
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: sync,
          onToggle: (self) => {
            photo.style.willChange = self.isActive ? "transform" : ""; // will-change seulement pendant que la scène est active
            bandCtl?.active(self.isActive);
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
      phase({ g: 1, ease: GROW_EASE }, PHASE.grow);
      phase({ v: 1 }, PHASE.veil);
      at += PHASE.hold1;
      phase({ t1: 1 }, PHASE.glide);
      at += PHASE.hold2;
      phase({ t2: 1 }, PHASE.glide);
      at += PHASE.hold3;
      phase({ o: 1 }, OVERLAP);
      tl.set({}, {}, TOTAL);

      // Point d'accroche : la section qui suit (Pourquoi végétaliser) remonte d'un écran par-dessus la photo.
      const wrap = section.closest(".pin-spacer") ?? section;
      const releaseNext = markOverlap(wrap.nextElementSibling, OVERLAP);

      return () => {
        releaseNext();
        claimHeader("matieres", null);
        bandCtl?.destroy();
        root.classList.remove("bx-mat-anim");
        delete section.dataset.pinLength;
        section.style.removeProperty("--bx-u");
        photo.style.cssText = "";
        gsap.set([...(head ? [head] : []), veil, ...(dim ? [dim] : []), ...figures, ...figures.map((f) => f.querySelector("img")), ...slides.flatMap((x) => [x.title, x.text])], { clearProps: "transform,opacity" });
      };
    },
  );
  // Mouvement réduit : la scène n'existe pas, les rangées de la bande sont fixes et l'olivier est centré (retours V8).
  if (BAND) mm.add("(prefers-reduced-motion: reduce)", () => bandStatic(section));
}
