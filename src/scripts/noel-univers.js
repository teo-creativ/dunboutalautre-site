// Nos univers (retours-v2/docs/05-NOEL-ANIMATIONS.md §F) : la section crème arrive depuis la droite, par-dessus le flux orange. Celui-ci
// glisse de 10 % vers la gauche pendant la superposition (profondeur) et son titre s'estompe. Le contenu de la section (photo-carte,
// titre, liste des univers et leurs survols) est complété au prompt 05 ; ce fichier porte pour l'instant l'arrivée.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).

export function addUnivers(tl, { stage, T }) {
  const layer = stage.querySelector(".univers");
  const card = layer.querySelector(".univers__card");
  const flux = stage.querySelector(".flux");

  tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: T.universDur, ease: "none" }, T.univers)
    // Les photos du flux (pas le titre, qui reste en place sur les frames 12 et 13) glissent de 10 % de la largeur vers la gauche.
    .to(flux.querySelector(".flux__photos"), { x: () => -0.1 * stage.clientWidth, duration: T.universDur, ease: "none" }, T.univers)
    .to(flux.querySelector(".flux__content"), { opacity: 0.4, duration: T.universDur, ease: "none" }, T.univers)
    // À l'arrivée, la photo-carte finit sa mise en place.
    .fromTo(card, { scale: 0.94, opacity: 0.6 }, { scale: 1, opacity: 1, duration: T.universDur, ease: "none" }, T.univers);
}
