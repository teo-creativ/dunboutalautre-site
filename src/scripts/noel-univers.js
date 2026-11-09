// Nos univers, arrivée (retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md §6) : la section crème suit la scène épinglée dans le flux de la page,
// remontée d'un écran par une marge négative (noel-stage.css) : pendant le dernier écran de scroll de la scène, c'est le scroll lui-même
// qui la fait monter du bas, par-dessus l'orange. Rien n'est animé pour son déplacement. Ici : le titre orange s'efface pendant qu'elle monte.
// V8 : la section est le composant « styles » partagé (scripts/bureaux-styles.js : épinglée, l'univers actif avance avec le scroll) ; son en-tête
// se révèle par le [data-reveal="head"] commun (reveal.js). Il n'y a plus de code de survol, de focus ni de tap propre à Noël.
import { gsap } from "./core.js";

export function addUnivers(stage) {
  const layer = document.getElementById("univers");
  if (!layer) return;

  // Le titre orange et le CTA s'effacent de l'arrivée de la crème (son bord haut au bas de l'écran) jusqu'à 30 % de la hauteur : ils
  // ne restent jamais visibles sous elle. refreshPriority : calculé après le pin de la scène, dont l'espacement décale la section.
  gsap.to(stage.querySelector(".flux__content"), {
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: layer, start: "top bottom", end: "top 30%", scrub: true, refreshPriority: -1 },
  });
}
