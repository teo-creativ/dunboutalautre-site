// Avis de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §8, frames bureaux-36, 41 et 42). Le bloc d'avis reste en place un écran de
// scroll pendant que la galerie orange monte par-dessus (le texte de l'avis s'estompe sous le bord qui monte, frame 42) : même technique
// que le hero et « Nos univers ». L'avis est épinglé quand son BAS atteint le bas de l'écran (comme le haut, quand il fait un écran de haut) : un
// avis plus haut que l'écran n'est jamais coupé. La section suivante (la galerie) reçoit la marque bx-overlap, qui la remonte d'un écran
// (marge négative, bureaux-installe.css), donc le scroll total n'augmente pas. L'entrée du bloc (icône, citation par lignes, nom) et le
// changement d'avis sont ceux de testimonials.js, non modifiés. Sous 900 px ou en mouvement réduit : aucun épinglage, les sections restent empilées.
// Retours V8 (partie C, Bureaux fb-04) : le pin est allongé d'un palier de lecture (`overlapHold`, en écrans : l'avis reste seul à l'écran, entier) puis la galerie arrive plus lentement
// (`overlapScreens` écrans, `scrub: 1`, `power2.inOut`, bureaux-scene.js : slowArrival). Valeurs de la page dans ses données ; sans elles, un écran et pas de palier comme avant.
import { gsap } from "./core.js";
import { MEDIA, bottomPin, overlapNext, overlapOptions, slowArrival } from "./bureaux-scene.js";

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
    root.classList.add("bx-avis-anim"); // l'avis occupe l'écran et la galerie remonte par-dessus (bureaux-avis.css, bureaux-installe.css)
    // Durée de la montée de la galerie : au moins un écran, lissage 1 (retours V8, partie C) ; la page peut l'allonger (data-overlap-screens, bureaux-scene.js).
    const { screens, scrub, hold } = overlapOptions(section);
    const tl = gsap
      .timeline({
        defaults: { ease: "none" },
        scrollTrigger: bottomPin(
          section,
          {
            scrub,
            // Lu par le thème du header : la zone de l'avis dure pendant le palier, puis s'arrête quand la galerie atteint le header (elle y est déjà à la fin du palier plus un écran).
            end: () => {
              section.dataset.pinLength = hold * window.innerHeight + 1;
              return `+=${(hold + screens) * window.innerHeight}`;
            },
          },
          hold + screens,
        ),
      })
      .fromTo(inner, { opacity: 1 }, { opacity: FADE_TO, duration: screens }, hold)
      .set({}, {}, hold + screens);
    // La galerie remonte par-dessus l'avis ; la zone du header de l'avis s'arrête quand elle atteint le header (bureaux-scene.js).
    const release = overlapNext(section, screens);
    // Elle arrive plus lentement qu'un écran de scroll si la page le demande : son bord haut touche le bas de l'écran à la fin du palier.
    const arrive = slowArrival((section.closest(".pin-spacer") ?? section).nextElementSibling, { start: () => tl.scrollTrigger.start + hold * window.innerHeight, screens, scrub });

    return () => {
      arrive();
      release();
      root.classList.remove("bx-avis-anim");
      gsap.set(inner, { clearProps: "opacity" });
    };
  });
}
