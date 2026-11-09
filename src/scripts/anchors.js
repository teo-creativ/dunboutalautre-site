// Liens d'ancre (V8, bouton « Découvrir les ateliers » du hero d'Ateliers) : un clic sur <a href="#id"> mène au début de la section d'id « id » par le scroll de Lenis (le saut natif ne
// connaît pas les sections épinglées). La position est celle de l'emplacement de la section dans la page (son espaceur d'épinglage s'il en a un) : c'est l'instant où elle atteint le haut de
// l'écran. Le focus la suit (sans défilement supplémentaire), pour que le clavier arrive dans la section. « # » seul est un lien fictif (main.js) : ignoré. Mouvement réduit : saut immédiat (core.js).
import { scrollTo } from "./core.js";

export function initAnchors() {
  document.addEventListener("click", (e) => {
    const link = e.target.closest?.('a[href^="#"]');
    const id = link?.getAttribute("href").slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;
    e.preventDefault();
    const slot = target.closest(".pin-spacer") ?? target;
    scrollTo(Math.round(slot.getBoundingClientRect().top + window.scrollY));
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
  });
}
