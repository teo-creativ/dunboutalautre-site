// Page Végétalisation de bureaux V5 : point d'entrée des animations propres à la page, un module par section (retours-v5/tasks/plan-bureaux.md).
// Chargé par import() depuis main.js, seulement quand la page porte [data-bx] : le bundle commun ne grossit pas pour les autres pages.
// L'ordre est celui de la page ; les épinglages d'abord, car le thème du header se calcule après eux (main.js).
import { initBureauxAvis } from "./bureaux-avis.js";
import { initBureauxBranding } from "./bureaux-branding.js";
import { initBureauxChiffres } from "./bureaux-chiffres.js";
import { initBureauxFormules } from "./bureaux-formules.js";
import { initBureauxGalerie } from "./bureaux-galerie.js";
import { initBureauxHero } from "./bureaux-hero.js";
import { initBureauxHold } from "./bureaux-hold.js";
import { initBureauxInstalle } from "./bureaux-installe.js";
import { initBureauxMatieres } from "./bureaux-matieres.js";
import { initBureauxPourquoi } from "./bureaux-pourquoi.js";
import { initBureauxStyles } from "./bureaux-styles.js";

export function initBureaux() {
  initBureauxHero();
  initBureauxChiffres();
  initBureauxInstalle();
  initBureauxHold(); // Design (V6) : tenue de « Nos 5 créations » sous l'orange, avant le pin des matières
  initBureauxStyles(); // Terrasses et Décoration (V7) : « Nos styles d'aménagement », épinglée, avant la scène suivante
  initBureauxFormules(); // Entretien (V7) : les formules épinglées et le disque orange, avant la scène des matières qui le prolonge
  initBureauxMatieres();
  initBureauxPourquoi();
  initBureauxAvis();
  initBureauxGalerie();
  initBureauxBranding(); // Design (V6) : la galerie suivie de la grande photo et du texte « Le branding végétal »
}
