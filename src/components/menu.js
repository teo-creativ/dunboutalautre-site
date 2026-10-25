// Menu plein écran (DESIGN.md §5.7, ANIMATIONS.md §9). Rendu fermé et inerte : src/scripts/menu.js l'ouvre.
// Les sous-liens de « Services » sont dans l'élément de liste de « Services » : en desktop ils se superposent à la colonne
// de droite, en mobile ils forment un accordéon sous le lien, avec un seul balisage.
// <!--@menu current="/"--> : current est le chemin de la page, marqué aria-current.
import { site, href } from "../data/site.js";
import { esc } from "./utils.js";
import img from "./img.js";

const link = (item, { sub = false, current } = {}) => {
  const count = item.count ? `<span class="menu-link__count">(${site.realisationsCount})</span>` : "";
  const classes = `menu-link${sub ? " menu-link--sub" : ""}`;
  const body = `<span class="menu-link__dot" aria-hidden="true"></span><span class="menu-link__body"><span class="menu-link__text">${esc(item.label)}</span>${count}</span>`;
  if (item.children) {
    return `<button class="${classes}" type="button" aria-expanded="false" aria-controls="menu-services" data-services-button>${body}</button>`;
  }
  const isCurrent = !sub && item.live && item.path === current;
  return `<a class="${classes}" href="${esc(href(item))}"${isCurrent ? ' aria-current="page"' : ""}>${body}</a>`;
};

export default ({ current = "/" } = {}) => {
  const sublinks = site.menuServices
    .map((s, i) => `<li style="--i: ${i}">${link(s, { sub: true })}</li>`)
    .join("\n              ");

  const items = site.nav
    .map((item) => {
      if (!item.children) return `<li class="menu__item">${link(item, { current })}</li>`;
      return `<li class="menu__item">
            ${link(item)}
            <div class="menu__panel menu__panel--services" id="menu-services">
              <p class="menu__label">SERVICES</p>
              <ul class="menu__sublinks">
              ${sublinks}
              </ul>
            </div>
          </li>`;
    })
    .join("\n          ");

  return `<nav class="menu" id="menu" aria-label="Menu principal" data-services="closed" data-lenis-prevent inert>
      <div class="menu__bg"></div>
      <div class="menu__line"></div>
      <div class="menu__inner">
        <div class="menu__col menu__col--links">
          <ul class="menu__links">
          ${items}
          </ul>
        </div>
        <div class="menu__col menu__col--aside">
          <div class="menu__panel menu__panel--default">
            <p class="menu__title">Parlons de la transformation de <span class="tag tag--orange">votre espace</span> ensemble.</p>
            <div class="menu__photo">${img({ src: "home-scroll/bw-lavande-tour-eiffel-large", alt: "", sizes: "(min-width: 900px) 42vw, 90vw", class: "menu__photo-img" })}</div>
            <p class="menu__label">CONTACT</p>
            <address class="menu__contact">
              <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>
              <a href="${esc(site.phone.href)}">${esc(site.phone.display)}</a>
            </address>
          </div>
        </div>
      </div>
    </nav>`;
};
