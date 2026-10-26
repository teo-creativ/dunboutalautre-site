// Header fixe : logo à gauche, bouton Menu à droite. Le thème (data-theme) et le dégradé de lisibilité (data-gradient, deux
// calques qui se fondent l'un dans l'autre) sont pilotés par src/scripts/header-theme.js, l'ouverture du menu par src/scripts/menu.js.
// <!--@header quote="Demander un devis Noël"--> ajoute un CTA persistant à gauche du bouton Menu (landing Noël).
import { site } from "../data/site.js";
import { cta } from "./cta.js";
import { esc } from "./utils.js";
import { wordmark } from "./logo.js";

export default ({ quote } = {}) => `<a class="skip-link" href="#main">Aller au contenu</a>
    <header class="header" id="header" data-theme="dark" data-gradient="off">
      <div class="header__grad header__grad--cream" aria-hidden="true"></div>
      <div class="header__grad header__grad--olive" aria-hidden="true"></div>
      <a class="header__logo" href="/" aria-label="${esc(site.name)}, accueil">${wordmark("header__logo-svg")}</a>
      <div class="header__actions">
        ${quote ? `${cta({ label: quote, className: "header__quote" })}\n        ` : ""}${cta({ label: "Menu", tag: "button", className: "header__menu", attrs: 'aria-expanded="false" aria-controls="menu"' })}
      </div>
    </header>`;
