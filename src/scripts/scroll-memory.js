// Position de scroll : mémoire entre deux visites (rechargement, retour arrière) et conservation pendant une reconstruction.
// Au rechargement ou au retour arrière, la page revient où on l'a quittée. Le navigateur ne peut pas
// le faire seul : les pins ajoutent de la hauteur après coup (head.js passe scrollRestoration en manuel, avant tout rendu).
// La position est restaurée sans animation, et les animations liées au scroll (scrub) sont amenées d'un coup à leur état,
// sans le rattrapage d'une seconde qu'elles joueraient depuis le haut. Pendant ce temps la page est masquée (html.restoring,
// posée par head.js avec la même clé) : on ne voit ni le haut de page ni le saut.
import { lenis, ScrollTrigger } from "./core.js";

const key = `dbal:scroll:${location.pathname}`; // même clé dans components/head.js
const store = {
  get: () => { try { return Number(sessionStorage.getItem(key)) || 0; } catch { return 0; } },
  set: (y) => { try { sessionStorage.setItem(key, String(y)); } catch { /* stockage indisponible : pas de reprise */ } },
};

export function rememberScroll() {
  const save = () => store.set(Math.round(window.scrollY));
  window.addEventListener("pagehide", save);
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && save());
}

// Saute à une position sans animation, et amène d'un coup les animations liées au scroll à leur état.
function jumpTo(y) {
  lenis.resize(); // les pins viennent de changer la hauteur de page : sans cela Lenis tronquerait y à son ancienne limite
  lenis.scrollTo(y, { immediate: true, force: true });
  ScrollTrigger.update();
  // getTween() vaut 0 (pas undefined) sans lissage numérique (scrub: true ou aucun) : seul un vrai tween est amené à son terme.
  ScrollTrigger.getAll().forEach((trigger) => trigger.getTween() && trigger.getTween().progress(1));
}

// À appeler une fois les positions de ScrollTrigger calculées. Renvoie la position restaurée (0 : on est en haut).
export function restoreScroll() {
  const navigation = performance.getEntriesByType("navigation")[0]?.type;
  if (navigation !== "reload" && navigation !== "back_forward") return 0;
  const y = store.get();
  if (y <= 0) return 0;
  jumpTo(y);
  return y;
}

const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

// Point de lecture, en proportion de la page (les hauteurs changent avec la largeur : les pixels n'ont plus de sens).
export const scrollRatio = () => (maxScroll() > 0 ? window.scrollY / maxScroll() : 0);

// Exécute une reconstruction qui retire puis repose les pins (largeur changée, zoom) sans perdre le point de lecture :
// sans cela le navigateur écrase la position pendant que la page est raccourcie, et on se retrouve vers le haut.
// ratio : le point de lecture noté avant que ScrollTrigger ne recalcule de lui-même (par défaut, celui d'à présent).
export function keepScroll(rebuild, ratio = scrollRatio()) {
  rebuild();
  ScrollTrigger.refresh();
  jumpTo(ratio * maxScroll());
}
