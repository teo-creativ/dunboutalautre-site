// Section « styles » (V7 : Terrasses et Décoration, retours-v7/docs/02-TERRASSES.md §3, frames terrasses-06 à 09, decoration-06 à 08 ; V8 : Noël, Ateliers) : la section est épinglée et l'entrée
// active de la liste avance avec le scroll. L'état est discret (une entrée active à la fois, jamais scrubé). La mise en page de l'entrée ouverte (description, marges) change
// d'un coup, par classe (bureaux-styles.css) ; le mouvement est un FLIP en transform seul : les lignes partent de leur ancienne place et glissent vers la nouvelle
// (aucune hauteur, marge ni position animée), la description apparaît en fondu (opacité, en CSS). Une interruption repart de la position en cours. La puce, le
// soulignement et le décalage du titre sont en CSS (classe .is-active). Si l'entrée a sa propre image, l'image change par voile sombre et échange (V8, G6 : le voile monte, les images
// s'échangent à son pic, il redescend ; jamais deux photos à demi transparentes) ; avec une seule image rien ne bouge. La liste est ouverte au clavier : le focus d'une entrée l'active, et l'emporte sur le scroll.
// Durées, en écrans de scroll (1 écran = la hauteur de la section) : une attente, 0,55 écran par entrée (data-step de la section : 1 pour Noël), une tenue de la dernière. Pas de recouvrement : la section
// suivante (la bande de photos) arrive dans le flux, comme sur la frame 08.
// Sous 900 px ou en mouvement réduit : aucun épinglage, la liste reste entière (html n'a pas la classe bx-sty-anim).
// V8, `layout: "tabs"` (Ateliers : data-layout="tabs", barre d'onglets Terrarium, Kokedama, Couronne de fleurs, Jardin sous verre) : mêmes mécaniques (épinglage, entrée active au scroll, image par entrée, voile
// d'échange), mais l'entrée active est un onglet (role="tab", aria-selected) et son panneau (role="tabpanel"), les panneaux étant empilés dans la même cellule (aucun saut de hauteur). Un clic sur un onglet
// (ou une flèche, Début, Fin) mène la page au point de l'onglet (Lenis) : pendant ce défilement l'onglet voulu reste actif, les onglets intermédiaires ne s'allument pas. Sous 900 px ou en mouvement réduit :
// aucun épinglage, ce sont des onglets ordinaires (un clic montre le panneau, l'image change sans voile) ; sans JavaScript, tous les panneaux sont empilés et lisibles, la barre d'onglets est absente.
// Plusieurs sections « styles » peuvent se suivre sur une page (Ateliers : onglets, puis Ateliers de Noël en liste).
import { gsap, ScrollTrigger, scrollTo } from "./core.js";
import { markOverlap, overlapOptions } from "./bureaux-scene.js";

const PRE = 0.25; // écrans avant la première bascule
const DEFAULT_STEP = 0.55; // écrans par entrée, par défaut (data-step de la section)
const VEIL = { up: 0.3, down: 0.45, peak: 0.6 }; // voile d'échange des images : montée, descente (s), opacité au pic (--veil-dim est plein, bureaux-styles.css)
const POST = 0.35; // écrans de tenue de la dernière entrée
const JUMP_MS = 1800; // durée maximale pendant laquelle un clic sur un onglet garde la main sur le scroll

export function initBureauxStyles() {
  document.querySelectorAll('[data-bx="styles"]').forEach(initSection);
}

function initSection(section) {
  const tabs = section.dataset.layout === "tabs";
  const rows = [...section.querySelectorAll(tabs ? ".sty-panel" : ".sty-row")];
  const tabEls = tabs ? [...section.querySelectorAll(".sty-tab")] : [];
  const photos = [...section.querySelectorAll(".sty__img")];
  const veil = section.querySelector(".sty__veil");
  const STEP = Number(section.dataset.step) || DEFAULT_STEP;
  if (rows.length < 2) return;
  // data-overlap : la section suivante monte par-dessus pendant un dernier écran (Décoration, frame 08), sans fondu : la liste reste entière. Durée : au moins 1 écran, réglable par page
  // (data-overlap-screens, bureaux-scene.js).
  const overlap = section.hasAttribute("data-overlap");
  const { screens: OVERLAP } = overlapOptions(section);
  const total = PRE + rows.length * STEP + POST + (overlap ? OVERLAP : 0);

  // Échange d'images : le voile sombre monte par-dessus la photo sortante (qui reste à 100 %), les images s'échangent au pic, le voile redescend. Une interruption repart du voile en cours.
  // `instant` (onglets sans épinglage) : l'image change tout de suite, sans voile.
  let shown = Math.max(0, photos.findIndex((img) => !img.classList.contains("is-hidden")));
  let swap = null;
  const setShown = (target) => photos.forEach((img, k) => gsap.set(img, { opacity: k === target ? 1 : 0 }));
  const showPhoto = (i, instant = false) => {
    const target = Number(rows[i].dataset.photo);
    if (photos.length < 2 || target === shown) return;
    shown = target;
    swap?.kill();
    if (instant || !veil) return setShown(target);
    swap = gsap
      .timeline()
      .to(veil, { opacity: VEIL.peak, duration: VEIL.up, ease: "power2.in", overwrite: "auto" })
      .add(() => setShown(target))
      .to(veil, { opacity: 0, duration: VEIL.down, ease: "power2.out" });
  };
  const resetPhotos = () => {
    swap?.kill();
    gsap.set([...photos, ...(veil ? [veil] : [])], { clearProps: "opacity" });
    shown = Math.max(0, photos.findIndex((img) => !img.classList.contains("is-hidden")));
  };

  // Onglets : l'état (classe, aria-selected, tabindex d'itinérance) suit l'entrée active.
  const markTabs = (next) => {
    tabEls.forEach((tab, i) => {
      tab.setAttribute("aria-selected", String(i === next));
      tab.tabIndex = i === next ? 0 : -1;
    });
  };

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const root = document.documentElement;
    root.classList.add("bx-sty-anim");
    if (tabs) {
      root.classList.add("bx-tabs-on");
      rows.forEach((row) => (row.tabIndex = 0)); // un panneau sans contrôle à l'intérieur est atteignable au clavier (motif WAI-ARIA des onglets) ; masqué, il est ignoré
    }

    // FLIP : on mesure les lignes, on change la mise en page d'un coup, puis chaque ligne repart de sa place d'avant (transform seul, la position en cours est reprise).
    // Les onglets n'en ont pas besoin : les panneaux sont empilés dans la même cellule.
    const flip = (change) => {
      if (tabs) return change();
      const before = rows.map((row) => row.getBoundingClientRect().top);
      change();
      rows.forEach((row, i) => {
        const dy = before[i] - row.getBoundingClientRect().top;
        if (Math.abs(dy) < 0.5) return;
        gsap.fromTo(row, { y: Number(gsap.getProperty(row, "y")) + dy }, { y: 0, duration: 0.6, ease: "power3.inOut", overwrite: "auto" });
      });
    };

    let current = -1;
    let scrolled = 0;
    let focused = -1;
    let forced = -1; // onglet voulu par un clic, tant que le défilement vers son point dure
    let forcedTimer = 0;
    const activate = (next, animate = true) => {
      if (next === current) return;
      current = next;
      const apply = () => {
        rows.forEach((row, i) => row.classList.toggle("is-active", i === next));
        if (tabs) markTabs(next);
      };
      if (animate) flip(apply);
      else apply();
      showPhoto(next);
    };
    const show = () => activate(forced >= 0 ? forced : focused >= 0 ? focused : scrolled);
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
        if (forced >= 0 && scrolled === forced) forced = -1; // arrivé au point de l'onglet : le scroll reprend la main
        show();
      },
    });

    // Point d'accroche : la section suivante remonte d'un écran par-dessus (bureaux-installe.css).
    const releaseNext = markOverlap(overlap ? (section.closest(".pin-spacer") ?? section).nextElementSibling : null, OVERLAP);

    // Liste : le focus d'une entrée l'active. Onglets : voir plus bas.
    const listeners = tabs
      ? []
      : rows.map((row, i) => {
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

    // Onglets : un clic mène la page au milieu du pas de l'onglet (le script active aussitôt l'onglet voulu, les onglets entre les deux ne s'allument pas).
    const jump = (i) => {
      forced = i;
      show();
      clearTimeout(forcedTimer);
      forcedTimer = setTimeout(() => ((forced = -1), show()), JUMP_MS);
      scrollTo(trigger.start + (PRE + (i + 0.5) * STEP) * section.offsetHeight);
    };
    const tabHandlers = tabEls.map((tab, i) => {
      const click = () => jump(i);
      const key = (e) => {
        const move = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: rows.length - 1 }[e.key];
        if (move === undefined) return;
        e.preventDefault();
        const to = (move + rows.length) % rows.length;
        tabEls[to].focus();
        jump(to);
      };
      tab.addEventListener("click", click);
      tab.addEventListener("keydown", key);
      return () => {
        tab.removeEventListener("click", click);
        tab.removeEventListener("keydown", key);
      };
    });

    return () => {
      clearTimeout(forcedTimer);
      releaseNext();
      section.removeAttribute("inert");
      trigger.kill();
      listeners.forEach((off) => off());
      tabHandlers.forEach((off) => off());
      gsap.killTweensOf(rows);
      gsap.set(rows, { clearProps: "transform" });
      rows.forEach((row) => row.classList.remove("is-active"));
      resetPhotos();
      delete section.dataset.pinLength;
      root.classList.remove("bx-sty-anim");
      if (tabs) {
        root.classList.remove("bx-tabs-on");
        rows.forEach((row) => row.removeAttribute("tabindex"));
      }
    };
  });

  // Onglets sans épinglage (sous 900 px, mouvement réduit) : des onglets ordinaires, un clic montre le panneau et son image.
  if (tabs) {
    mm.add("(max-width: 900px), (prefers-reduced-motion: reduce)", () => {
      const root = document.documentElement;
      root.classList.add("bx-tabs-on");
      rows.forEach((row) => (row.tabIndex = 0));
      let current = -1;
      const activate = (next) => {
        if (next === current) return;
        current = next;
        rows.forEach((row, i) => row.classList.toggle("is-active", i === next));
        markTabs(next);
        showPhoto(next, true);
      };
      activate(0);
      // La barre défile (mobile) : l'onglet choisi vient au centre, sans faire défiler la page.
      const choose = (i) => {
        activate(i);
        tabEls[i].scrollIntoView({ inline: "center", block: "nearest" });
      };
      const handlers = tabEls.map((tab, i) => {
        const click = () => choose(i);
        const key = (e) => {
          const move = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: rows.length - 1 }[e.key];
          if (move === undefined) return;
          e.preventDefault();
          const to = (move + rows.length) % rows.length;
          tabEls[to].focus();
          choose(to);
        };
        tab.addEventListener("click", click);
        tab.addEventListener("keydown", key);
        return () => {
          tab.removeEventListener("click", click);
          tab.removeEventListener("keydown", key);
        };
      });
      return () => {
        handlers.forEach((off) => off());
        rows.forEach((row) => row.classList.remove("is-active"));
        resetPhotos();
        rows.forEach((row) => row.removeAttribute("tabindex"));
        root.classList.remove("bx-tabs-on");
      };
    });
  }
}
