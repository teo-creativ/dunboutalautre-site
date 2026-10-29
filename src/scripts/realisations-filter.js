// Filtres de la page Réalisations : un bouton à bascule par catégorie (aria-pressed), les cartes hors catégorie sont masquées (attribut hidden),
// le décompte est annoncé dans une zone role="status". Une catégorie sans projet affiche le message d'état vide, annoncé de même.
// Sans JavaScript la barre reste masquée et tous les projets sont affichés. Pas d'animation : le filtre doit répondre tout de suite, et
// les cartes portent déjà leur révélation au scroll (data-reveal). Les textes (décompte, état vide) viennent de src/data/pages/realisations.js.
import { ScrollTrigger } from "./core.js";

export function initRealisationsFilter() {
  const section = document.querySelector(".projects");
  const bar = section?.querySelector(".filters");
  if (!bar) return;

  const buttons = [...bar.querySelectorAll(".filter")];
  const items = [...section.querySelectorAll(".project")];
  const count = section.querySelector(".projects__count");
  const emptyText = section.querySelector(".projects__empty").textContent.trim();
  const { countOne, countMany } = section.dataset;
  bar.hidden = false;

  const apply = (key) => {
    let shown = 0;
    items.forEach((item) => {
      const match = key === "all" || item.dataset.category === key;
      item.hidden = !match;
      if (match) shown++;
    });
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === key)));
    count.textContent = shown === 0 ? emptyText : shown === 1 ? countOne : countMany.replace("{n}", shown);
    // La hauteur de la page a changé : les déclencheurs de scroll qui suivent (bandeau final, footer) sont à recalculer.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  buttons.forEach((button) => button.addEventListener("click", () => apply(button.dataset.filter)));
}
