// Thème du header selon la section sous lui (ANIMATIONS.md §11) : logo crème et bouton on-olive sur les fonds sombres,
// logo olive et bouton on-cream sur les fonds crème. Le thème sombre est le défaut ; seules les sections claires
// se déclarent (data-header-theme="light").
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

export function initHeaderTheme() {
  header = document.getElementById("header");
  buttons = header ? [...header.querySelectorAll(".header__menu, .header__quote")] : [];
  if (!header || !buttons.length) return;

  // Le thème se déduit de l'ensemble des sections claires actives : deux sections claires voisines ne font pas clignoter.
  const triggers = [...document.querySelectorAll('[data-header-theme="light"]')].map((section) =>
    ScrollTrigger.create({
      trigger: section,
      start: `top ${HEADER_CENTER}px`,
      // Une section claire épinglée (data-pin-length, en px, posé par son propre pin) reste à l'écran pendant tout son pin.
      end: () => `bottom+=${Number(section.dataset.pinLength) || 0} ${HEADER_CENTER}px`,
      // Calculé après les triggers épinglés, dont les espacements décalent les sections suivantes.
      refreshPriority: -1,
      onToggle: () => {
        current = triggers.some((t) => t.isActive) ? "light" : "dark";
        if (!locked) apply(current);
      },
    }),
  );
}
