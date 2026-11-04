// Tenue d'un écran (V6, « Nos 5 créations » de la page Design, frames design-05 à 08) : la section reste en place, immobile, pendant que la
// section suivante (orange) monte par-dessus. Même technique que l'avis de Bureaux (bureaux-avis.js) et le hero : la section est épinglée par
// son BAS (elle peut être plus haute que l'écran, elle n'est jamais coupée), la suivante reçoit bx-overlap (marge négative, bureaux-installe.css),
// donc le scroll total n'augmente pas. Pas de fondu : sur les frames la liste garde toute son opacité sous l'orange.
// Sous 900 px ou en mouvement réduit : aucun épinglage, les sections restent empilées. Doit être appelé avant le pin de la section suivante
// (les pins se créent dans l'ordre de la page).
import { gsap, ScrollTrigger } from "./core.js";

export function initBureauxHold() {
  const section = document.querySelector("[data-bx-hold]");
  if (!section) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const root = document.documentElement;
    root.classList.add("bx-hold-anim"); // la section suivante remonte d'un écran (bureaux-installe.css)

    const pin = ScrollTrigger.create({
      trigger: section,
      start: "bottom bottom",
      end: () => `+=${window.innerHeight}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
    // La zone du header s'arrête quand la section suivante atteint le header : c'est le bord bas de la section qui y arrive à ce moment-là
    // (1 px de débord, comme entre deux sections voisines : header-theme.js). Le pin est ce recouvrement, il n'ajoute rien à la zone.
    section.dataset.pinLength = 1;

    // Point d'accroche : la section suivante remonte d'un écran par-dessus la liste.
    const wrap = section.closest(".pin-spacer") ?? section;
    const next = wrap.nextElementSibling;
    next?.classList.add("bx-overlap");

    return () => {
      next?.classList.remove("bx-overlap");
      delete section.dataset.pinLength;
      root.classList.remove("bx-hold-anim");
      pin.kill();
    };
  });
}
