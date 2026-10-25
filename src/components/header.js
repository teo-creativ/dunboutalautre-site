// Header fixe : logo à gauche, bouton Menu à droite. Le thème (data-theme) est piloté par src/scripts/header-theme.js,
// l'ouverture du menu par src/scripts/menu.js.
// <!--@header quote="Demander un devis Noël"--> ajoute un CTA persistant à gauche du bouton Menu (landing Noël).
import { site } from "../data/site.js";
import { cta } from "./cta.js";
import { esc } from "./utils.js";
import { wordmark } from "./logo.js";

export default ({ quote } = {}) => `<header class="header" id="header" data-theme="dark">
      <a class="header__logo" href="/" aria-label="${esc(site.name)}, accueil">${wordmark("header__logo-svg")}</a>
      <div class="header__actions">
        ${quote ? `${cta({ label: quote, className: "header__quote" })}\n        ` : ""}${cta({ label: "Menu", tag: "button", className: "header__menu", attrs: 'aria-expanded="false" aria-controls="menu"' })}
      </div>
    </header>`;
