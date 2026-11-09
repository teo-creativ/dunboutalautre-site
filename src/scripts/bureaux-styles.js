// Section « styles » (V7 : Terrasses et Décoration, retours-v7/docs/02-TERRASSES.md §3, frames terrasses-06 à 09, decoration-06 à 08) : la section est épinglée et l'entrée
// active de la liste avance avec le scroll. L'état est discret (une entrée active à la fois, jamais scrubé). La mise en page de l'entrée ouverte (description, marges) change
// d'un coup, par classe (bureaux-styles.css) ; le mouvement est un FLIP en transform seul : les lignes partent de leur ancienne place et glissent vers la nouvelle
// (aucune hauteur, marge ni position animée), la description apparaît en fondu (opacité, en CSS). Une interruption repart de la position en cours. La puce, le
// soulignement et le décalage du titre sont en CSS (classe .is-active). Si l'entrée a sa propre image, l'image change par voile sombre et échange (V8, G6 : le voile monte, les images
// s'échangent à son pic, il redescend ; jamais deux photos à demi transparentes) ; avec une seule image rien ne bouge. La liste est ouverte au clavier : le focus d'une entrée l'active, et l'emporte sur le scroll.
// Durées, en écrans de scroll (1 écran = la hauteur de la section) : une attente, 0,55 écran par entrée (data-step de la section : 1 pour Noël), une tenue de la dernière. Pas de recouvrement : la section
// suivante (la bande de photos) arrive dans le flux, comme sur la frame 08.
// Sous 900 px ou en mouvement réduit : aucun épinglage, la liste reste entière (html n'a pas la classe bx-sty-anim).
import { gsap, ScrollTrigger } from "./core.js";
import { markOverlap, overlapOptions } from "./bureaux-scene.js";

const PRE = 0.25; // écrans avant la première bascule
const DEFAULT_STEP = 0.55; // écrans par entrée, par défaut (data-step de la section)
const VEIL = { up: 0.3, down: 0.45, peak: 0.6 }; // voile d'échange des images : montée, descente (s), opacité au pic (--veil-dim est plein, bureaux-styles.css)
const POST = 0.35; // écrans de tenue de la dernière entrée

export function initBureauxStyles() {
  const section = document.querySelector('[data-bx="styles"]');
  if (!section) return;
  const rows = [...section.querySelectorAll(".sty-row")];
  const photos = [...section.querySelectorAll(".sty__img")];
  const veil = section.querySelector(".sty__veil");
  const STEP = Number(section.dataset.step) || DEFAULT_STEP;
  if (rows.length < 2) return;
  // data-overlap : la section suivante monte par-dessus pendant un dernier écran (Décoration, frame 08), sans fondu : la liste reste entière. Durée : au moins 1 écran, réglable par page
  // (data-overlap-screens, bureaux-scene.js).
  const overlap = section.hasAttribute("data-overlap");
  const { screens: OVERLAP } = overlapOptions(section);
  const total = PRE + rows.length * STEP + POST + (overlap ? OVERLAP : 0);

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const root = document.documentElement;
    root.classList.add("bx-sty-anim");

    // FLIP : on mesure les lignes, on change la mise en page d'un coup, puis chaque ligne repart de sa place d'avant (transform seul, la position en cours est reprise).
    const flip = (change) => {
      const before = rows.map((row) => row.getBoundingClientRect().top);
      change();
      rows.forEach((row, i) => {
        const dy = before[i] - row.getBoundingClientRect().top;
        if (Math.abs(dy) < 0.5) return;
        gsap.fromTo(row, { y: Number(gsap.getProperty(row, "y")) + dy }, { y: 0, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
      });
    };

    // Échange d'images : le voile sombre monte par-dessus la photo sortante (qui reste à 100 %), les images s'échangent au pic, le voile redescend. Une interruption repart du voile en cours.
    let shown = Math.max(0, photos.findIndex((img) => !img.classList.contains("is-hidden")));
    let swap = null;
    const showPhoto = (i) => {
      const target = Number(rows[i].dataset.photo);
      if (photos.length < 2 || !veil || target === shown) return;
      shown = target;
      swap?.kill();
      swap = gsap
        .timeline()
        .to(veil, { opacity: VEIL.peak, duration: VEIL.up, ease: "power2.in", overwrite: "auto" })
        .add(() => photos.forEach((img, k) => gsap.set(img, { opacity: k === target ? 1 : 0 })))
        .to(veil, { opacity: 0, duration: VEIL.down, ease: "power2.out" });
    };

    let current = -1;
    let scrolled = 0;
    let focused = -1;
    const activate = (next, animate = true) => {
      if (next === current) return;
      current = next;
      const apply = () => rows.forEach((row, i) => row.classList.toggle("is-active", i === next));
      if (animate) flip(apply);
      else apply();
      showPhoto(next);
    };
    const show = () => activate(focused >= 0 ? focused : scrolled);
    // Les descriptions partent fermées, sauf celle de l'entrée de départ (posée sans mouvement).
    activate(0, false);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => {
        const length = total * section.offsetHeight;
        // Lu par le thème du header : la section reste à l'écran tant qu'elle est seule (sans le dernier écran du recouvrement).
        section.dataset.pinLength = length - (overlap ? OVERLAP * section.offsetHeight : 0);
        return `+=${length}`;
      },
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Recouverte par la section suivante (dernier écran), la liste n'est plus atteignable : un focus y serait invisible.
        if (overlap) section.toggleAttribute("inert", self.progress * total > total - OVERLAP * 0.9);
        scrolled = Math.min(rows.length - 1, Math.max(0, Math.floor((self.progress * total - PRE) / STEP)));
        show();
      },
    });

    // Point d'accroche : la section suivante remonte d'un écran par-dessus (bureaux-installe.css).
    const releaseNext = markOverlap(overlap ? (section.closest(".pin-spacer") ?? section).nextElementSibling : null, OVERLAP);

    const listeners = rows.map((row, i) => {
      row.tabIndex = 0; // atteignable au clavier : le focus active l'entrée (anneau de focus-visible, base.css)
      const on = [
        ["focusin", () => ((focused = i), show())],
        ["focusout", () => ((focused = -1), show())],
      ];
      on.forEach(([type, fn]) => row.addEventListener(type, fn));
      return () => {
        on.forEach(([type, fn]) => row.removeEventListener(type, fn));
        row.removeAttribute("tabindex");
      };
    });

    return () => {
      releaseNext();
      section.removeAttribute("inert");
      trigger.kill();
      listeners.forEach((off) => off());
      gsap.killTweensOf(rows);
      gsap.set(rows, { clearProps: "transform" });
      rows.forEach((row) => row.classList.remove("is-active"));
      swap?.kill();
      gsap.set([...photos, ...(veil ? [veil] : [])], { clearProps: "opacity" });
      delete section.dataset.pinLength;
      root.classList.remove("bx-sty-anim");
    };
  });
}
