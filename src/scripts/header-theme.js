// Thème du header selon la section sous lui (ANIMATIONS.md §11) : logo crème et bouton on-olive sur les fonds sombres,
// logo olive et bouton on-cream sur les fonds crème. Le thème sombre est le défaut ; seules les sections claires
// se déclarent (data-header-theme="light").
// Dégradé de lisibilité sous le logo (retours-v2 01 §5) : une section déclare data-header-gradient="cream | olive | off".
// Sans déclaration, rien (off). Quand plusieurs sections couvrent le trait du header (une section qui en recouvre une autre
// épinglée), c'est la dernière dans le DOM qui l'emporte : elle est au-dessus.
import { ScrollTrigger } from "./core.js";

const HEADER_CENTER = 55; // le trait de changement passe par le centre du header, à 1728 px de large

let header;
let buttons; // bouton Menu, et CTA persistant de la landing Noël s'il existe
let current = "dark";
let locked = false;

const apply = (theme) => {
  header.dataset.theme = theme;
  buttons.forEach((button) => { button.dataset.variant = theme === "light" ? "on-cream" : "on-olive"; });
};

// Le menu ouvert force le thème sombre (fond olive) sans perdre celui de la section en cours.
export const lockHeaderTheme = (theme) => {
  locked = true;
  apply(theme);
};
export const unlockHeaderTheme = () => {
  locked = false;
  apply(current);
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
  buttons = header ? [...header.querySelectorAll(".header__menu, .header__quote")] : [];
  if (!header || !buttons.length) return;

  // Le thème se déduit de l'ensemble des sections claires actives : deux sections claires voisines ne font pas clignoter.
  const triggers = [...document.querySelectorAll('[data-header-theme="light"]')].map((section) =>
    ScrollTrigger.create({
      ...zone(section),
      onToggle: () => {
        current = triggers.some((t) => t.isActive) ? "light" : "dark";
        if (!locked) apply(current);
      },
    }),
  );

  // Dégradé : la dernière section active dans l'ordre du DOM donne sa couleur, aucune section active : off.
  const gradients = [...document.querySelectorAll("[data-header-gradient]")].map((section) =>
    ScrollTrigger.create({ ...zone(section), onToggle: updateGradient }),
  );
  function updateGradient() {
    const active = gradients.filter((t) => t.isActive).at(-1);
    header.dataset.gradient = active ? active.trigger.dataset.headerGradient : "off";
  }
  updateGradient();
}
