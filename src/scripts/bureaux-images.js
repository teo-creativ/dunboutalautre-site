// Images hors écran de la page Bureaux V5 (photos des cartes, trois fonds du slider, photos de la galerie) : lues d'avance pour qu'aucune ne
// surgisse à l'entrée de sa scène (aucun flash au changement de fond), mais en priorité basse et une fois la page chargée, pour ne pas
// concurrencer le hero et les polices. Sans cela elles sont en lazy (rendu img.js) : leur scène est épinglée, elles arriveraient avec retard.
export function loadLater(images) {
  const list = [...images];
  const run = () =>
    list.forEach((img) => {
      img.fetchPriority = "low";
      img.loading = "eager";
    });
  const later = () => ("requestIdleCallback" in window ? requestIdleCallback(run, { timeout: 3000 }) : setTimeout(run, 1500));
  if (document.readyState === "complete") later();
  else window.addEventListener("load", later, { once: true });
}
