// Avis de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §8, frames bureaux-36, 41 et 42). Le bloc d'avis reste en place un écran de
// scroll pendant que la galerie orange monte par-dessus (le texte de l'avis s'estompe sous le bord qui monte, frame 42) : même technique
// que le hero et « Nos univers ». L'avis est épinglé quand son BAS atteint le bas de l'écran (comme le haut, quand il fait un écran de haut) : un
// avis plus haut que l'écran n'est jamais coupé. La section suivante (la galerie) reçoit la marque bx-overlap, qui la remonte d'un écran
// (marge négative, bureaux-installe.css), donc le scroll total n'augmente pas. L'entrée du bloc (icône, citation par lignes, nom) et le
// changement d'avis sont ceux de testimonials.js, non modifiés. Sous 900 px ou en mouvement réduit : aucun épinglage, les sections restent empilées.
import { gsap } from "./core.js";
import { MEDIA, bottomPin, overlapNext } from "./bureaux-scene.js";

// Opacité mesurée sur la frame 42 (l'orange a monté de 54 % de l'écran) : l'icône à 0,38 et la citation à 0,64, soit 0,5 en moyenne. Une pente
// constante de 1 à 0,1 sur toute la montée donne 0,51 à ce point.
const FADE_TO = 0.1; // opacité de l'avis quand l'orange a tout recouvert

export function initBureauxAvis() {
  const section = document.querySelector('[data-bx="avis"]');
  // L'avis n'est épinglé que si la galerie le recouvre : c'est la section qui le suit (sur la page Design la galerie est avant l'avis, et la
  // FAQ crème qui suit n'a rien à recouvrir).
  if (!section || !section.nextElementSibling?.matches('[data-bx="galerie"]')) return;

  const mm = gsap.matchMedia();
  mm.add(MEDIA.wide, () => {
    const root = document.documentElement;
    const inner = section.querySelector(".testi__inner");
    root.classList.add("bx-avis-anim"); // l'avis occupe l'écran et la galerie remonte d'un écran (bureaux-avis.css, bureaux-installe.css)
    gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: bottomPin(section, { scrub: 0.6 }),
      })
      .fromTo(inner, { opacity: 1 }, { opacity: FADE_TO, duration: 1 }, 0)
      .set({}, {}, 1);
    // La galerie remonte d'un écran par-dessus l'avis ; la zone du header de l'avis s'arrête quand elle atteint le header (bureaux-scene.js).
    const release = overlapNext(section);

    return () => {
      release();
      root.classList.remove("bx-avis-anim");
      gsap.set(inner, { clearProps: "opacity" });
    };
  });
}
