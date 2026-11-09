// Scène « Votre logo ou identité de marque reconstitué en végétaux » puis « Le branding végétal » de la page Design (V6, frames design-24 à 33,
// retours-v6/docs/01-SECTIONS.md §4 et §5). UNE section épinglée, UNE timeline scrubée, car les deux moments se chevauchent : la grande photo
// commence à monter par le bas pendant que la dernière photo de la galerie sort par le haut (frame 27). Phases, en écrans de scroll (1 unité = 1
// écran) : les photos montent à des vitesses propres derrière le titre fixe (comme bureaux-galerie.js, section de Bureaux) ; la grande photo
// monte du bas à la vitesse du scroll en s'élargissant jusqu'au plein écran, le titre et le bouton s'estompent par-dessous ; le voile ; le
// texte entre par lignes puis les pastilles (comme « Notre approche », approach.js) ; une pause ; la section crème suivante monte par-dessus.
// Seuls transform, opacity et clip-path bougent. Une section de galerie sans .gal__grow (Bureaux) n'est pas concernée : bureaux-galerie.js.
//
// Mesures des frames à 1728 x 1030. Galerie : à l'entrée du pin (la frame 24 en est à 42 px : titre et photos y sont 42 px plus bas) les photos
// sont à (x, y) = (66, 262), (1388, 356), (-54, 777) et (1151, 905) px, la première de 312 x 355, les autres de 340 x 453, 469 x 351 et 347 x 463 ; elles montent de 341 px, puis 408, 284 et 301 px
// entre les frames suivantes (299 px au lieu de 341 depuis l'entrée du pin), les trois dernières ensemble (même vitesse), la première 13 % moins
// vite, et dérivent de 0,042 px vers la droite par pixel monté (x + 14 px entre les frames 24 et 25). La grande photo montant à la vitesse du
// scroll (222 px de montée entre les frames 27 et 28 pendant que la dernière photo en monte 301), les photos montent 1,36 fois plus vite que la page. La grande photo (frames 27 à 30) monte à la vitesse du scroll (910, 688, 469 puis 0 px :
// une droite) ; sa largeur est 791, 1129, 1517 puis 1728 px, son centre à 860, 856, 856 puis 863 px. L'image y entre à la largeur de la photo (frames
// 28 et 29 : écart de moins d'un pixel), puis grossit de 19 % en fin de croissance (frame 30 : 2 064 px de large, ancrée à 36 % de la hauteur).
import { gsap, SplitText } from "./core.js";
import { loadLater } from "./bureaux-images.js";
import { claimHeader } from "./bureaux-header.js";
import { MEDIA, addPhotoRise, clamp, markOverlap, monotone, overlapOptions, scaleSetter } from "./bureaux-scene.js";
import { fillTag } from "./tag.js";

const REF_W = 1728;
const REF_H = 1030;

const RISE = { wide: 1.8, solo: 1.6 }; // durée de la montée des photos, en écrans
// V8 (G5) : plus de dérive vers la droite des photos (0,042 px par px monté sur les frames) : elle ramenait les photos de gauche sur le titre.
const GROW_AT = 0.59; // la grande photo entre par le bas (frame 27 à 0,71 écran : 120 px sous le bord)
const GROW = 1.0; // montée du bas au haut à la vitesse du scroll
const FADE = [0.7, 1.25]; // le titre et le bouton s'estompent (1 à la frame 27, 0,5 à la 28, 0,25 à la 29)
const VEIL = 0.3;
const TEXT_GAP = 0.1; // le texte commence juste après le plein écran
const TEXT = 0.65; // durée de l'entrée du texte : étiquette, lignes, mots, pastilles
const HOLD = 0.55;
// La section crème monte par-dessus (frames 32 et 33), dernier écran du pin : durée (au moins 1 écran) et lissage réglables par page (overlapOptions, bureaux-scene.js).
const VEIL_FROM = 0.25; // le header n'a plus besoin du dégradé « photo » quand le voile atteint cette part
const COVERED = 0.66; // part de la croissance où le titre et le bouton sont recouverts et ont fini de s'estomper (écran 1,25 de la scène)
const HEADER_PHOTO = 0.95;
const HEADER_RELEASE = 0.94;
const RADIUS = 12; // px à l'écran, jusqu'à 80 % de la croissance, puis il se résorbe

// Courbes de la grande photo, en part g de la croissance (frames 27 à 30 : g = 0,118 ; 0,333 ; 0,546 ; 1).
const G = [0, 0.118, 0.333, 0.546, 1];
const topAt = monotone(G, [1030, 910, 688, 469, 0]); // px à 1030 de haut
const scaleAt = monotone(G, [0.458, 0.458, 0.653, 0.878, 1]); // largeur de la photo / largeur de l'écran
const dxAt = monotone(G, [-4, -4, -8, -8, 0]); // px à 1728
const ZOOM_END = 1.194; // grossissement de l'image en fin de croissance (frame 30)
const zoomNorm = monotone([0, 0.55, 1], [0, 0, 1]);
const ORIGIN_Y = 0.36; // le grossissement est ancré à 36 % de la hauteur (frame 30 : l'image est décalée de 72 px vers le haut)
const IMG_RATIO = 2000 / 1132; // largeur / hauteur de fond-04

export function initBureauxBranding() {
  const section = document.querySelector('[data-bx="galerie"]');
  const grow = section?.querySelector(".gal__grow");
  if (!section || !grow) return;
  const content = section.querySelector(".gal__content");
  const photos = [...section.querySelectorAll(".gal__photo")];
  const box = grow.querySelector(".gal__grow-photo");
  const img = box?.querySelector("img");
  const veil = grow.querySelector(".gal__grow-veil");
  const label = grow.querySelector(".gal__grow-text .label");
  const text = grow.querySelector(".gal__grow-p");
  if (!content || !photos.length || !img || !veil || !label || !text) return;

  const set = {
    y: gsap.quickSetter(box, "y", "px"),
    x: gsap.quickSetter(box, "x", "px"),
    scale: scaleSetter(box),
    zoom: scaleSetter(img),
    veil: gsap.quickSetter(veil, "opacity"),
  };

  const mm = gsap.matchMedia();
  mm.add(
    MEDIA,
    ({ conditions }) => {
      const root = document.documentElement;
      const rise = conditions.wide ? RISE.wide : RISE.solo;
      const visible = photos.filter((li) => li.dataset.mobile !== "off" || conditions.wide);
      root.classList.add("bx-gal-anim"); // positions des photos et recouvrement de la section suivante (bureaux-galerie.css, bureaux-installe.css)

      // Les photos (300 Ko en 480 px) et la grande photo sont lues d'avance (bureaux-images.js).
      loadLater([...visible.map((li) => li.querySelector("img")), img]);

      const { screens: OVERLAP, scrub } = overlapOptions(section);
      const growEnd = GROW_AT + GROW;
      const textAt = growEnd + TEXT_GAP;
      const overlapAt = textAt + TEXT + HOLD;
      const total = overlapAt + OVERLAP;

      const s = { g: 0, v: 0, o: 0 };
      let kEnd = ZOOM_END;
      let headerState = null; // null : les sections décident ; "photo" : photo claire sous le logo ; "off" : le voile suffit
      let covered = false; // le titre et le bouton sont sous la photo

      const render = () => {
        const h = window.innerHeight;
        const w = document.documentElement.clientWidth;
        const sc = scaleAt(s.g);
        set.y((topAt(s.g) / REF_H) * h);
        set.x((dxAt(s.g) * w) / REF_W);
        set.scale(sc);
        box.style.clipPath = s.g < 1 ? `inset(0 round ${(RADIUS / sc) * clamp((1 - s.g) / (1 - 0.8))}px)` : "none";
        if (conditions.wide) set.zoom(1 + (kEnd - 1) * zoomNorm(s.g));
        set.veil(s.v);
        // Recouvert et invisible, le bouton ne doit plus recevoir le focus clavier (un anneau de focus que personne ne voit) : inerte tant que la photo le couvre.
        if ((s.g >= COVERED) !== covered) {
          covered = s.g >= COVERED;
          content.toggleAttribute("inert", covered);
        }

        // Header : blanc sur l'orange (dégradé orange), puis dégradé « photo » sur la photo claire, puis le voile suffit ; la main est rendue aux
        // sections quand la section crème atteint le header.
        const wantPhoto = s.g >= HEADER_PHOTO && s.o < HEADER_RELEASE;
        const state = wantPhoto ? (s.v < VEIL_FROM ? "photo" : "off") : null;
        if (state !== headerState) {
          headerState = state;
          claimHeader("branding", state);
        }
      };
      const sync = () => {
        // Sur un écran plus haut que 16:10, l'image à la largeur de la photo ne couvre plus la hauteur : le grossissement final monte jusqu'à la couvrir.
        const vw = document.documentElement.clientWidth;
        const vh = window.innerHeight;
        const imgH = vw / IMG_RATIO;
        const origin = ORIGIN_Y * vh;
        const cover = imgH > origin ? (vh - origin) / (imgH - origin) : 1;
        kEnd = Math.max(ZOOM_END, cover * 1.005);
        render();
      };
      sync();

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const height = section.offsetHeight;
            // Lu par le thème du header : la zone de la section dure tant qu'elle est seule à l'écran, donc sans le dernier écran du pin, où la
            // section crème monte par-dessus.
            section.dataset.pinLength = (total - OVERLAP) * height;
            return `+=${total * height}`;
          },
          pin: true,
          scrub, // 1 par défaut (retours V8)
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: sync,
          onToggle: (self) => {
            // will-change seulement pendant que la scène est active
            const value = self.isActive ? "transform" : "";
            visible.forEach((li) => (li.style.willChange = value));
            box.style.willChange = value;
          },
        },
      });

      // Galerie : les photos montent sur les côtés du titre fixe (chaque photo à sa vitesse, bureaux-scene.js).
      addPhotoRise(tl, visible, { wide: conditions.wide, rise, section });
      // Le titre et le bouton s'estompent sous la grande photo (opacité seule : ils restent dans l'arbre d'accessibilité).
      tl.to(content, { opacity: 0, duration: FADE[1] - FADE[0] }, FADE[0]);

      // Grande photo, voile, recouvrement : des objets de progression, render() en déduit tout.
      tl.to(s, { g: 1, duration: GROW, onUpdate: render }, GROW_AT);
      tl.to(s, { v: 1, duration: VEIL, onUpdate: render }, growEnd);
      tl.to(s, { o: 1, duration: OVERLAP, onUpdate: render }, overlapAt);

      // Texte : l'étiquette, les lignes qui montent une à une sous leur masque, les mots de 25 % à 100 %, puis les pastilles qui se remplissent
      // (même écriture que « Notre approche », approach.js, dont les durées sont déjà en écrans).
      const tags = [...text.querySelectorAll(".tag")];
      const split = SplitText.create(text, { type: "lines,words", mask: "lines", linesClass: "split-line", ignore: ".tag", aria: "none" });
      const words = split.words.filter((word) => !word.querySelector(".tag"));
      tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, textAt)
        .fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power3.out", stagger: 0.1 }, textAt + 0.05)
        .fromTo(words, { opacity: 0.25 }, { opacity: 1, duration: 0.25, ease: "none", stagger: 0.009 }, textAt + 0.15);
      tags.forEach((tag, i) => {
        const at = textAt + 0.25 + i * 0.22;
        // Le point collé au tag fait partie de son « mot » : il apparaît avec le fond, pas avant.
        const word = split.words.find((w) => w.contains(tag));
        if (word) tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, at);
        fillTag(tl, tag, at, { duration: 0.22 });
      });
      tl.set({}, {}, total);

      // Point d'accroche : la section crème (processus) remonte d'un écran par-dessus la photo.
      const wrap = section.closest(".pin-spacer") ?? section;
      const releaseNext = markOverlap(wrap.nextElementSibling, OVERLAP);

      return () => {
        releaseNext();
        claimHeader("branding", null);
        content.removeAttribute("inert");
        root.classList.remove("bx-gal-anim");
        delete section.dataset.pinLength;
        box.style.cssText = "";
        gsap.set([content, label, veil, img, ...photos], { clearProps: "transform,opacity,willChange" });
      };
    },
  );
}
