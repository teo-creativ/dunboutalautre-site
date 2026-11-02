// Page Végétalisation de bureaux V5 : point d'entrée des animations propres à la page, un module par section (retours-v5/tasks/plan-bureaux.md).
// Chargé par import() depuis main.js, seulement quand la page porte [data-bx] : le bundle commun ne grossit pas pour les autres pages.
// L'ordre est celui de la page ; les épinglages d'abord, car le thème du header se calcule après eux (main.js).
import { initBureauxChiffres } from "./bureaux-chiffres.js";
import { initBureauxHero } from "./bureaux-hero.js";
import { initBureauxInstalle } from "./bureaux-installe.js";

export function initBureaux() {
  initBureauxHero();
  initBureauxChiffres();
  initBureauxInstalle();
}
