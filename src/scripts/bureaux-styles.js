// Section « styles » (V7 : Terrasses et Décoration, retours-v7/docs/02-TERRASSES.md §3, frames terrasses-06 à 09, decoration-06 à 08) : la section est épinglée et l'entrée
// active de la liste avance avec le scroll. L'état est discret (une entrée active à la fois, jamais scrubé) : chaque entrée a sa timeline en pause (hauteur et opacité
// de la description, comme les offres de Noël dans universes.js), jouée à l'ouverture et rejouée à l'envers à la fermeture, donc une interruption repart de l'état en
// cours ; la puce, le soulignement et le décalage du titre sont en CSS (bureaux-styles.css, classe .is-active). Si l'entrée a sa propre image, l'image change en fondu
// (opacité seule, 0,6 s) ; avec une seule image rien ne bouge. La liste est ouverte au clavier : le focus d'une entrée l'active, et l'emporte sur le scroll.
// Durées, en écrans de scroll (1 écran = la hauteur de la section) : une attente, 0,55 écran par entrée, une tenue de la dernière. Pas de recouvrement : la section
// suivante (la bande de photos) arrive dans le flux, comme sur la frame 08.
// Sous 900 px ou en mouvement réduit : aucun épinglage, la liste reste entière (html n'a pas la classe bx-sty-anim).
import { gsap, ScrollTrigger } from "./core.js";

const PRE = 0.25; // écrans avant la première bascule
const STEP = 0.55; // écrans par entrée
const POST = 0.35; // écrans de tenue de la dernière entrée
const OVERLAP = 1; // data-overlap : la section suivante monte par-dessus pendant un dernier écran (Décoration, frame 08), sans fondu : la liste reste entière

export function initBureauxStyles() {
  const section = document.querySelector('[data-bx="styles"]');
  if (!section) return;
  const rows = [...section.querySelectorAll(".sty-row")];
  const photos = [...section.querySelectorAll(".sty__img")];
  if (rows.length < 2) return;
  const overlap = section.hasAttribute("data-overlap");
  const total = PRE + rows.length * STEP + POST + (overlap ? OVERLAP : 0);

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const root = document.documentElement;
    root.classList.add("bx-sty-anim");

    const items = rows.map((row) => {
      const text = row.querySelector(".sty-row__text");
      const tl = gsap
        .timeline({ paused: true })
        .fromTo(text, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.6, ease: "power3.inOut" }, 0)
        .fromTo(row, { "--act": 0 }, { "--act": 1, duration: 0.6, ease: "power3.inOut" }, 0); // marges de l'entrée ouverte (bureaux-styles.css)
      return { row, tl, open: false };
    });

    let shown = Math.max(0, photos.findIndex((img) => !img.classList.contains("is-hidden")));
    const showPhoto = (i) => {
      const target = Number(rows[i].dataset.photo);
      if (photos.length < 2 || target === shown) return;
      photos.forEach((img, k) => gsap.to(img, { opacity: k === target ? 1 : 0, duration: 0.6, ease: "power2.inOut", overwrite: "auto" }));
      shown = target;
    };

    let current = -1;
    let scrolled = 0;
    let focused = -1;
    const activate = (next) => {
      if (next === current) return;
      current = next;
      items.forEach((item, i) => {
        const on = i === next;
        item.row.classList.toggle("is-active", on);
        if (on === item.open) return;
        item.open = on;
        item.tl.timeScale(on ? 1 : 1.5)[on ? "play" : "reverse"]();
      });
      showPhoto(next);
    };
    const show = () => activate(focused >= 0 ? focused : scrolled);
    // Les descriptions partent fermées, sauf celle de l'entrée de départ (posée sans animation).
    activate(0);
    items[0].tl.progress(1);

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
    const next = overlap ? (section.closest(".pin-spacer") ?? section).nextElementSibling : null;
    next?.classList.add("bx-overlap");

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
      next?.classList.remove("bx-overlap");
      section.removeAttribute("inert");
      trigger.kill();
      listeners.forEach((off) => off());
      items.forEach(({ row, tl }) => {
        tl.kill();
        row.classList.remove("is-active");
        gsap.set(row.querySelector(".sty-row__text"), { clearProps: "height,opacity" });
        row.style.removeProperty("--act");
      });
      gsap.set(photos, { clearProps: "opacity" });
      delete section.dataset.pinLength;
      root.classList.remove("bx-sty-anim");
    };
  });
}
