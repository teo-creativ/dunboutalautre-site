// Thème du header selon la section sous lui (ANIMATIONS.md §11) : logo crème et bouton on-olive sur les fonds sombres,
// logo olive et bouton on-cream sur les fonds crème. Le thème sombre est le défaut ; seules les sections claires
// se déclarent (data-header-theme="light").
// Dégradé de lisibilité sous le logo (retours-v2 01 §5) : une section déclare data-header-gradient="cream | olive | orange | photo | off".
// Sans déclaration, rien (off). Quand plusieurs sections couvrent le trait du header (une section qui en recouvre une autre
// épinglée), c'est la dernière dans le DOM qui l'emporte : elle est au-dessus.
// Une scène épinglée dont les fonds changent sans que la page défile (la scène de l'accueil : la photo qui grandit) pose un état à
// la main avec setHeaderOverride, qui prime sur les sections. Sur la landing Noël, Nos univers monte par le scroll : elle se déclare
// comme une section claire.
import { ScrollTrigger } from "./core.js";

const HEADER_CENTER = 55; // le trait de changement passe par le centre du header, à 1728 px de large

let header;
let buttons; // bouton Menu
let current = "dark"; // thème donné par les sections
let zoneGradient = "off"; // dégradé donné par les sections
let override = null; // { theme, gradient } posé par une scène, ou null
let locked = false;

const apply = (theme) => {
  header.dataset.theme = theme;
  buttons.forEach((button) => { button.dataset.variant = theme === "light" ? "on-cream" : "on-olive"; });
};

// Pose le thème et le dégradé : l'état d'une scène l'emporte sur celui des sections, le menu ouvert sur les deux.
const render = () => {
  if (!header) return;
  if (!locked) apply(override?.theme ?? current);
  header.dataset.gradient = override?.gradient ?? zoneGradient;
};

// Le menu ouvert force le thème sombre (fond olive) sans perdre celui de la section en cours.
export const lockHeaderTheme = (theme) => {
  locked = true;
  apply(theme);
};
export const unlockHeaderTheme = () => {
  locked = false;
  render();
};

// state : { theme: "dark" | "light", gradient: "cream" | "olive" | "orange" | "photo" | "off" }, ou null pour rendre la main aux sections.
export const setHeaderOverride = (state) => {
  override = state;
  render();
};

// Zone où une section est « sous le header » : de son bord haut qui passe par le centre du header jusqu'à son bord bas.
// Une section épinglée (data-pin-length, en px, posé par son propre pin) reste à l'écran pendant tout son pin.
// refreshPriority : calculé après les triggers épinglés, dont les espacements décalent les sections suivantes.
const zone = (section) => ({
  trigger: section,
  start: `top ${HEADER_CENTER}px`,
  end: () => `bottom+=${Number(section.dataset.pinLength) || 0} ${HEADER_CENTER}px`,
  refreshPriority: -1,
});

export function initHeaderTheme() {
  header = document.getElementById("header");
  buttons = header ? [...header.querySelectorAll(".header__menu")] : [];
  if (!header || !buttons.length) return;

  // Le thème se déduit de l'ensemble des sections claires actives : deux sections claires voisines ne font pas clignoter.
  // Les listes existent avant les déclencheurs : une page qui s'ouvre sur une section claire (la fiche projet) a son premier déclencheur déjà
  // actif à sa création, donc son onToggle part avant que la liste ne soit remplie.
  const triggers = [];
  const gradients = [];
  const updateTheme = () => {
    current = triggers.some((t) => t.isActive) ? "light" : "dark";
    render();
  };
  // Dégradé : la dernière section active dans l'ordre du DOM donne sa couleur, aucune section active : off.
  const updateGradient = () => {
    const active = gradients.filter((t) => t.isActive).at(-1);
    zoneGradient = active ? active.trigger.dataset.headerGradient : "off";
    render();
  };
  document.querySelectorAll('[data-header-theme="light"]').forEach((section) => triggers.push(ScrollTrigger.create({ ...zone(section), onToggle: updateTheme })));
  document.querySelectorAll("[data-header-gradient]").forEach((section) => gradients.push(ScrollTrigger.create({ ...zone(section), onToggle: updateGradient })));
  updateTheme(); // état de départ, listes complètes : sections claires déjà actives comprises
  updateGradient();
}
