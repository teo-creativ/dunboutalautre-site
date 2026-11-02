// Avis de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §8, frames bureaux-36, 41 et 42). Le bloc d'avis reste en place un écran de
// scroll pendant que la galerie orange monte par-dessus (le texte de l'avis s'estompe sous le bord qui monte, frame 42) : même technique
// que le hero et « Nos univers ». L'avis est épinglé quand son BAS atteint le bas de l'écran (comme le haut, quand il fait un écran de haut) : un
// avis plus haut que l'écran n'est jamais coupé. La section suivante (la galerie) reçoit la marque bx-overlap, qui la remonte d'un écran
// (marge négative, bureaux-installe.css), donc le scroll total n'augmente pas. L'entrée du bloc (icône, citation par lignes, nom) et le
// changement d'avis sont ceux de testimonials.js, non modifiés. Sous 900 px ou en mouvement réduit : aucun épinglage, les sections restent empilées.
import { gsap } from "./core.js";

// Opacité mesurée sur la frame 42 (l'orange a monté de 54 % de l'écran) : l'icône à 0,38 et la citation à 0,64, soit 0,5 en moyenne. Une pente
// constante de 1 à 0,1 sur toute la montée donne 0,51 à ce point.
const FADE_TO = 0.1; // opacité de l'avis quand l'orange a tout recouvert

export function initBureauxAvis() {
  const section = document.querySelector('[data-bx="avis"]');
  if (!section || !document.querySelector('[data-bx="galerie"]')) return;

  const mm = gsap.matchMedia();
  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    const root = document.documentElement;
    const inner = section.querySelector(".testi__inner");
    root.classList.add("bx-avis-anim"); // l'avis occupe l'écran et la galerie remonte d'un écran (bureaux-avis.css, bureaux-installe.css)
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "bottom bottom",
          end: () => `+=${window.innerHeight}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      .fromTo(inner, { opacity: 1 }, { opacity: FADE_TO, duration: 1 }, 0)
      .set({}, {}, 1);
    // La zone du header s'arrête quand la galerie atteint le header : le pin est ce recouvrement, il n'ajoute rien à la zone de l'avis (1 px de
    // débord, comme entre deux sections voisines : header-theme.js).
    section.dataset.pinLength = 1;

    const wrap = section.closest(".pin-spacer") ?? section;
    const next = wrap.nextElementSibling;
    next?.classList.add("bx-overlap");

    return () => {
      next?.classList.remove("bx-overlap");
      delete section.dataset.pinLength;
      root.classList.remove("bx-avis-anim");
      gsap.set(inner, { clearProps: "opacity" });
    };
  });
}
