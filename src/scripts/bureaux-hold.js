// Tenue d'un écran (V6, « Nos 5 créations » de la page Design, frames design-05 à 08) : la section reste en place, immobile, pendant que la
// section suivante (orange) monte par-dessus. Même technique que l'avis de Bureaux (bureaux-avis.js) et le hero : la section est épinglée par
// son BAS (elle peut être plus haute que l'écran, elle n'est jamais coupée), la suivante reçoit bx-overlap (marge négative, bureaux-installe.css),
// donc le scroll total n'augmente pas. Pas de fondu : sur les frames la liste garde toute son opacité sous l'orange.
// Sous 900 px ou en mouvement réduit : aucun épinglage, les sections restent empilées. Doit être appelé avant le pin de la section suivante
// (les pins se créent dans l'ordre de la page).
import { gsap, ScrollTrigger } from "./core.js";
import { MEDIA, bottomPin, overlapNext, overlapOptions, slowArrival } from "./bureaux-scene.js";

export function initBureauxHold() {
  const section = document.querySelector("[data-bx-hold]");
  if (!section) return;

  const mm = gsap.matchMedia();
  mm.add(MEDIA.wide, () => {
    const root = document.documentElement;
    root.classList.add("bx-hold-anim"); // la section suivante remonte d'un écran (bureaux-installe.css)

    // Épinglage par le bas pendant un écran au moins (réglable par page : data-overlap-screens, bureaux-scene.js), la section suivante monte par-dessus.
    const { screens, scrub } = overlapOptions(section);
    const pin = ScrollTrigger.create(bottomPin(section, {}, screens));
    const release = overlapNext(section, screens);
    // Retours V8 : la section qui arrive (Design : l'orange « Naturel, stabilisé ou artificiel ») peut mettre plus d'un écran à arriver (bureaux-scene.js : slowArrival).
    const arrive = slowArrival((section.closest(".pin-spacer") ?? section).nextElementSibling, { start: () => pin.start, screens, scrub });

    return () => {
      arrive();
      release();
      root.classList.remove("bx-hold-anim");
      pin.kill();
    };
  });
}
