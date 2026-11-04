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
  const { PHASE, GROW_P, GROW_TOP, GROW_SCALE, GROW_DX, ZOOM, RAIL, TEXT_OFF, RADIUS, HEAD_FADE, VEIL_FROM, RISE, PITCH, ENTER_SCALE, INACTIVE, TITLE_DY, GLIDE, SWAP, HEADER_PHOTO, HEADER_RELEASE } =
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
    head: gsap.quickSetter(head, "opacity"),
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
      const root = document.documentElement;
      root.classList.add("bx-mat-anim");
      // Les trois fonds (1,2 Mo en 2000 px) sont chargés d'avance : aucun flash au changement de fond (bureaux-images.js).
      loadLater(section.querySelectorAll("img"));

      const s = { g: 0, v: 0, t1: 0, t2: 0, o: 0 };
      const scale = () => Math.min(document.documentElement.clientWidth / REF_W, window.innerHeight / REF_H);
      let u = scale();
      let headerState = null; // null : les sections décident ; "photo" : photo claire sous le logo ; "off" : le voile suffit

      const render = () => {
        // ---------- La photo : monte et grandit, puis c'est le fond du slider ----------
        const h = window.innerHeight;
        const sc = scaleAt(s.g);
        set.photoY((topAt(s.g) / REF_H) * h);
        set.photoScale(sc);
        set.photoX((dxAt(s.g) * document.documentElement.clientWidth) / REF_W);
        const growing = s.g < 1;
        photo.style.clipPath = growing ? `inset(0 round ${(RADIUS / sc) * clamp((1 - s.g) / (1 - 0.8))}px)` : "none";
        set.head(1 - clamp((s.g - HEAD_FADE[0]) / (HEAD_FADE[1] - HEAD_FADE[0])));
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
          set.titleX[k](railF ? (railX(RAIL.nodes[k], d) - RAIL.left) * u : d * pitch);
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
        root.classList.remove("bx-mat-anim");
        delete section.dataset.pinLength;
        section.style.removeProperty("--bx-u");
        photo.style.cssText = "";
        gsap.set([head, veil, ...figures, ...figures.map((f) => f.querySelector("img")), ...slides.flatMap((x) => [x.title, x.text])], { clearProps: "transform,opacity" });
      };
    },
  );
}
