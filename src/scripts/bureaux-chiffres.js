// Chiffres clés de la page Bureaux V5 (retours-v5/docs/02-SECTIONS-1-A-5.md §2, frames bureaux-03 à 05). Les trois cartes arrivent en
// cascade par le bas (fondu, montée de 60 px, rotation qui se redresse) et les nombres comptent de 0 à leur valeur, une fois, quand la
// section entre dans l'écran ; le retour en arrière rejoue la timeline à l'envers. Pas d'épinglage : ce n'est pas la section de l'accueil
// (stats.js, qui reste intacte). Sans mouvement ou sans JavaScript, les valeurs finales sont dans le HTML.
// Tassement : pendant que la section monte sur le hero, son contenu est 100 px plus haut que sa place de repos (label à 115 px du bord crème
// sur les frames 02 à 04) ; sur la dernière partie de la montée il descend à sa place, centré dans l'écran (frame 05).
import { gsap, ScrollTrigger } from "./core.js";

const START_ROTATION = [-7, 6, -7]; // rotation de départ, plus forte que celle de repos (--card-rotate, stats.css), comme à l'accueil
const RISE = 60; // px
const CARD = 0.9; // durée de l'entrée d'une carte, s
const STEP = 0.15; // décalage entre deux cartes, s
const COUNT = 1.6; // durée du compteur, s
const SETTLE = 100 / 1030; // décalage de montée du contenu, en part de la hauteur de l'écran (100 px à 1728 x 1030)
const SETTLE_START = "top 37%"; // le tassement commence quand le bord crème est à 37 % de l'écran (380 px sur la frame 04)

export function initBureauxChiffres() {
  const section = document.querySelector('[data-bx="chiffres"]');
  if (!section) return;
  const cards = [...section.querySelectorAll(".stat-card")];
  if (!cards.length) return;

  const mm = gsap.matchMedia();
  mm.add(
    { motion: "(prefers-reduced-motion: no-preference)", settle: "(min-width: 901px) and (prefers-reduced-motion: no-preference)" },
    ({ conditions }) => {
      const tl = gsap.timeline({ paused: true });
      cards.forEach((card, i) => {
        const rest = parseFloat(getComputedStyle(card).getPropertyValue("--card-rotate")) || 0; // stats.css n'en définit que trois : une 4e carte reste droite
        const value = card.querySelector("[data-value]");
        tl.fromTo(card, { opacity: 0, y: RISE, rotation: START_ROTATION[i] ?? -7 }, { opacity: 1, y: 0, rotation: rest, duration: CARD, ease: "power3.out" }, i * STEP).fromTo(
          value,
          { textContent: 0 },
          { textContent: Number(value.dataset.value), snap: { textContent: 1 }, duration: COUNT, ease: "power2.out" },
          i * STEP,
        );
      });

      // end: "max" : la timeline reste jouée tant qu'on est sous le début de la section ; onEnter et onLeaveBack (et non onToggle) la
      // laissent jouée tout en bas de la page, où un trigger à « max » se désactive.
      ScrollTrigger.create({
        trigger: section,
        start: "top 90%",
        end: "max",
        invalidateOnRefresh: true,
        onEnter: () => tl.play(),
        onLeaveBack: () => tl.reverse(),
      });

      // Le contenu (label, titre, cartes) est le seul à bouger : la section et son fond crème restent à leur place.
      if (conditions.settle) {
        gsap.fromTo(
          section.querySelectorAll(".stats__intro, .stats__cards"),
          { y: () => -SETTLE * window.innerHeight },
          { y: 0, ease: "none", scrollTrigger: { trigger: section, start: SETTLE_START, end: "top top", scrub: true, invalidateOnRefresh: true } },
        );
      }

      return () => {
        // Le retour à l'état d'origine d'un compteur remet son point de départ (0) : on rétablit la valeur finale.
        section.querySelectorAll("[data-value]").forEach((el) => {
          el.textContent = el.dataset.value;
        });
      };
    },
  );
}
