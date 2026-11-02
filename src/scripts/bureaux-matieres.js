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
import { gsap, ScrollTrigger } from "./core.js";
import { setHeaderOverride } from "./header-theme.js";

const REF_W = 1728;
const REF_H = 1030;

const PHASE = { pre: 0.35, grow: 1.25, veil: 0.3, hold1: 0.2, glide: 1, hold2: 0.2, hold3: 0.3, overlap: 1 };
const TOTAL = PHASE.pre + PHASE.grow + PHASE.veil + PHASE.hold1 + PHASE.glide + PHASE.hold2 + PHASE.glide + PHASE.hold3 + PHASE.overlap;

// Mesures des frames 21 à 25, et leur point de départ sous l'écran : p = progression de la croissance.
const GROW_P = [0, 0.2, 0.4, 0.6, 0.8, 1];
const GROW_TOP = [1030, 863, 689, 542, 261, 0]; // px à 1030 de haut : bord haut de la photo
const GROW_SCALE = [0.494, 0.494, 0.664, 0.806, 0.936, 1]; // largeur de la photo / largeur de l'écran
const GROW_DX = [0, -0.5, -5.5, -5.5, -18, 0]; // px à 1728 : la photo est un peu à gauche du centre en route (marges 37 et 74 px sur la frame 24)
const RADIUS = 12; // px à l'écran, jusqu'à 80 % de la croissance, puis il se résorbe
const HEAD_FADE = [0.5, 0.8]; // le titre s'estompe de 1 à 0 entre ces deux points de la croissance (frames 22 à 24)
const VEIL_FROM = 0.25; // le texte du slider entre quand le voile atteint cette part
const RISE = 12; // px, montée du texte qui entre et du paragraphe qui change
const PITCH = 920; // px à 1728, entre deux titres
const ENTER_SCALE = 1.06; // échelle de départ du fond qui entre (le doc : 1,06)
const INACTIVE = 0.4; // opacité d'un titre qui n'est pas au centre
const TITLE_DY = [0, 19, 15]; // px à 1728 : sur les frames le titre des slides 2 et 3 est plus bas que celui de la 1 (pastilles à 469 et 466 px contre 449)
const GLIDE = 0.6; // part du glissement où les titres bougent ; le fond se fond ensuite (0,5 à 1)
// Changement de paragraphe (sortie puis entrée) : frame 29 = fond 2 à 26 % avec le nouveau texte déjà là ; frame 32 = fond 3 à 54 % avec l'ancien
// texte encore là. Le premier glissement change donc de texte avant la moitié du fondu, le second après.
const SWAP = [
  [0.45, 0.65],
  [0.8, 1],
];
const HEADER_PHOTO = 0.95; // à partir de cette part de la croissance, la photo couvre le header : dégradé « photo »
const HEADER_RELEASE = 0.94; // part du recouvrement où le crème atteint le header : on rend la main aux sections

const clamp = (v, lo = 0, hi = 1) => Math.min(Math.max(v, lo), hi);
const lerp = (a, b, t) => a + (b - a) * t;
// quickSetter(..., "scale") ne pose rien : l'échelle passe par scaleX et scaleY.
const scaleSetter = (el) => {
  const sx = gsap.quickSetter(el, "scaleX");
  const sy = gsap.quickSetter(el, "scaleY");
  return (v) => {
    sx(v);
    sy(v);
  };
};
const glideEase = gsap.parseEase("power2.inOut"); // mouvement à l'écran : ease-in-out

// Courbe monotone (Fritsch-Carlson) passant par les mesures : pas de dépassement entre deux frames.
const monotone = (xs, ys) => {
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
const topAt = monotone(GROW_P, GROW_TOP);
const scaleAt = monotone(GROW_P, GROW_SCALE);
const dxAt = monotone(GROW_P, GROW_DX);

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
    textOp: slides.map((s) => gsap.quickSetter(s.text, "opacity")),
  };

  const mm = gsap.matchMedia();
  mm.add(
    {
      wide: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      solo: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      const root = document.documentElement;
      root.classList.add("bx-mat-anim");
      // Les trois fonds (1,2 Mo en 2000 px) sont chargés d'avance, pour qu'aucun flash n'apparaisse au changement de fond, mais en priorité basse
      // et une fois la page chargée : la section est à plusieurs écrans du haut, la photo du hero et les polices passent avant.
      const preload = () =>
        section.querySelectorAll("img").forEach((img) => {
          img.fetchPriority = "low";
          img.loading = "eager";
        });
      const later = () => ("requestIdleCallback" in window ? requestIdleCallback(preload, { timeout: 3000 }) : setTimeout(preload, 1500));
      if (document.readyState === "complete") later();
      else window.addEventListener("load", later, { once: true });

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
        slides.forEach((_, k) => {
          const d = k - f;
          set.titleX[k](d * pitch);
          set.titleY[k](RISE * (1 - enter) + TITLE_DY[k] * (conditions.wide ? u : 0));
          set.titleOp[k](lerp(1, INACTIVE, clamp(Math.abs(d))) * enter);
          set.textOp[k](textOp[k]);
          set.textY[k](textY[k]);
        });

        // ---------- Les fonds : le suivant monte par-dessus, le précédent reste dessous ----------
        const bg = [1, clamp((s.t1 - 0.5) / 0.5), clamp((s.t2 - 0.5) / 0.5)];
        figures.forEach((_, k) => {
          set.fig[k](bg[k]);
          if (k) set.figScale[k](ENTER_SCALE - (ENTER_SCALE - 1) * bg[k]); // le fond qui entre se pose de ENTER_SCALE à 1
        });

        // ---------- Header : blanc sur l'orange (dégradé orange), puis dégradé photo ; olive quand le crème arrive ----------
        const wantPhoto = s.g >= HEADER_PHOTO && s.o < HEADER_RELEASE;
        const state = wantPhoto ? (s.v < VEIL_FROM ? "photo" : "off") : null;
        if (state !== headerState) {
          headerState = state;
          setHeaderOverride(state ? { theme: "dark", gradient: state } : null);
        }
      };
      const sync = () => {
        u = scale();
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
        setHeaderOverride(null);
        root.classList.remove("bx-mat-anim");
        delete section.dataset.pinLength;
        section.style.removeProperty("--bx-u");
        photo.style.cssText = "";
        gsap.set([head, veil, ...figures, ...figures.map((f) => f.querySelector("img")), ...slides.flatMap((x) => [x.title, x.text])], { clearProps: "transform,opacity" });
      };
    },
  );
}
