// Menu plein écran (ANIMATIONS.md §9) : ouverture et fermeture en une timeline inversée, état de « Services »,
// focus piégé, Échap, inert sur le reste de la page. Les survols des liens sont en CSS (menu.css).
import { gsap, SplitText, lenis, scrollTo } from "./core.js";
import { setCtaLabel } from "./cta.js";
import { lockHeaderTheme, unlockHeaderTheme } from "./header-theme.js";
import { fillTag } from "./tag.js";

const CLOSE_SPEED = 2.6; // fermeture d'environ 0,5 s pour une ouverture de 1,3 s (les easings expo sont très avancés tôt)
const CLOSE_DELAY = 250; // ms avant de refermer la liste Services, pour éviter le clignotement en traversant l'écart
const FOCUSABLE = "a[href], button:not([disabled])";

export function initMenu() {
  const menu = document.getElementById("menu");
  const header = document.getElementById("header");
  const button = header?.querySelector(".header__menu");
  if (!menu || !button) return;

  const page = ["main", "footer"].map((id) => document.getElementById(id)).filter(Boolean);
  const root = document.documentElement;
  let isOpen = false;
  let tl = null;
  let closeSpeed = CLOSE_SPEED;

  // ---------- Timeline d'ouverture (inversée pour fermer) ----------

  const buildFull = () => {
    const q = (selector) => menu.querySelectorAll(selector);
    const title = menu.querySelector(".menu__title");
    const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
    const tag = title.querySelector(".tag");
    const links = q(".menu__links > .menu__item > .menu-link");

    const open = gsap
      .timeline({ paused: true, defaults: { ease: "expo.out" } })
      .set(menu, { autoAlpha: 1 }, 0)
      // Fond : fondu et balayage circulaire depuis le coin haut droit, sans coupure sèche.
      .fromTo(q(".menu__bg"), { clipPath: "circle(0% at 96% 4%)" }, { clipPath: "circle(150% at 96% 4%)", duration: 0.9 }, 0)
      .fromTo(q(".menu__bg"), { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power1.out" }, 0)
      .fromTo(q(".menu__line"), { scaleY: 0 }, { scaleY: 1, duration: 0.8 }, 0.1)
      // Liens de gauche : montée depuis un masque.
      .fromTo(links, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.07 }, 0.15)
      // Colonne de droite : titre mot à mot, tag qui se remplit, photo qui se dévoile, puis coordonnées.
      .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 0.8, stagger: 0.045 }, 0.25)
      .fromTo(q(".menu__photo"), { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9 }, 0.3)
      .fromTo(q(".menu__photo-img"), { scale: 1.15 }, { scale: 1, duration: 1.1 }, 0.3)
      .fromTo(
        q(".menu__panel--default > .menu__label, .menu__contact a"),
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.06 },
        0.55,
      );
    fillTag(open, tag, 0.55, { duration: 0.6 });
    return open;
  };

  // Mouvement réduit : un simple fondu de 200 ms, sans balayage ni cascade.
  const buildReduced = () =>
    gsap.timeline({ paused: true }).fromTo(menu, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, ease: "none" });

  const mm = gsap.matchMedia();
  mm.add({ motion: "(prefers-reduced-motion: no-preference)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
    const { reduce } = ctx.conditions;
    tl = reduce ? buildReduced() : buildFull();
    closeSpeed = reduce ? 1 : CLOSE_SPEED;
    return () => { tl = null; };
  });

  // ---------- Bouton : « Menu » devient « Fermer » avec un fondu court ----------

  const swapButton = (label, expanded) => {
    const text = button.querySelector(".cta__layer--base .cta__text");
    gsap
      .timeline()
      .to(text, { opacity: 0, duration: 0.12, overwrite: true })
      .add(() => {
        // L'état ouvert retire la pilule et le point : il bascule quand le texte est invisible, sans saut visible.
        button.setAttribute("aria-expanded", String(expanded));
        setCtaLabel(button, label);
      })
      .to(text, { opacity: 1, duration: 0.25, clearProps: "opacity" });
  };

  // ---------- Ouverture et fermeture ----------

  const setPageInert = (value) => page.forEach((el) => { el.inert = value; });

  const open = () => {
    if (isOpen || !tl) return;
    isOpen = true;

    // Sans barre de défilement, la page s'élargit : on compense pour que le header reste en place.
    root.style.setProperty("--sbw", `${window.innerWidth - root.clientWidth}px`);
    lenis.stop();

    setPageInert(true);
    menu.inert = false;
    lockHeaderTheme("dark");
    swapButton("Fermer", true);
    tl.timeScale(1).play();
    // Le menu ne devient visible qu'au prochain rendu de la timeline, et un élément masqué ne reçoit pas le focus.
    gsap.delayedCall(0, () => isOpen && menu.querySelector(".menu__links a, .menu__links button")?.focus({ preventScroll: true }));
  };

  const close = ({ restoreFocus = true } = {}) => {
    if (!isOpen || !tl) return;
    isOpen = false;

    setServices({ hover: false, focus: false, pinned: false }, 0);
    menu.inert = true;
    setPageInert(false);
    swapButton("Menu", false);
    if (restoreFocus) button.focus({ preventScroll: true });
    lenis.start();
    root.style.removeProperty("--sbw");
    tl.timeScale(closeSpeed).reverse().eventCallback("onReverseComplete", unlockHeaderTheme);
  };

  button.addEventListener("click", () => (isOpen ? close() : open()));

  document.addEventListener("keydown", (e) => {
    if (!isOpen) return;
    if (e.key === "Escape") {
      close();
      return;
    }
    if (e.key !== "Tab") return;

    // Focus piégé : le header (logo et bouton Fermer) et le menu forment un seul cycle.
    const visible = (el) => el.getClientRects().length > 0 && getComputedStyle(el).visibility !== "hidden" && !el.closest("[inert]");
    const items = [...header.querySelectorAll(FOCUSABLE), ...menu.querySelectorAll(FOCUSABLE)].filter(visible);
    const first = items[0];
    const last = items.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  // Liens factices (#) : on ferme sans naviguer. Lien vers la page courante : on ferme et on remonte en haut.
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const target = a.getAttribute("href");
    if (target === "#") {
      e.preventDefault();
      close();
    } else if (new URL(a.href).pathname === location.pathname && !a.protocol.startsWith("mailto") && a.origin === location.origin) {
      e.preventDefault();
      close();
      scrollTo(0);
    }
  });

  // ---------- État de « Services » : survol, clavier (focus visible) ou bascule au toucher et au clic ----------

  const servicesButton = menu.querySelector("[data-services-button]");
  const servicesPanel = menu.querySelector("#menu-services");
  const services = { hover: false, focus: false, pinned: false };
  let servicesTimer;

  // delay : durée avant de refermer, annulée si la liste est de nouveau survolée ou focalisée.
  function setServices(next, delay = CLOSE_DELAY) {
    Object.assign(services, next);
    clearTimeout(servicesTimer);
    const apply = () => {
      const expanded = services.hover || services.focus || services.pinned;
      menu.dataset.services = expanded ? "open" : "closed";
      servicesButton?.setAttribute("aria-expanded", String(expanded));
    };
    const wantsOpen = services.hover || services.focus || services.pinned;
    if (wantsOpen || delay === 0) apply();
    else servicesTimer = setTimeout(apply, delay);
  }

  if (servicesButton && servicesPanel) {
    const zone = servicesButton.closest(".menu__item");

    if (matchMedia("(hover: hover)").matches) {
      servicesButton.addEventListener("mouseenter", () => setServices({ hover: true }));
      servicesButton.addEventListener("mouseleave", () => setServices({ hover: false }));
      servicesPanel.addEventListener("mouseenter", () => setServices({ hover: true }));
      servicesPanel.addEventListener("mouseleave", () => setServices({ hover: false }));
      // Survoler un autre lien principal referme la liste, même si Services avait été épinglé par un clic.
      menu.querySelectorAll(".menu__links > .menu__item > .menu-link:not([data-services-button])").forEach((a) =>
        a.addEventListener("mouseenter", () => setServices({ hover: false, pinned: false })),
      );
      // Quitter les deux colonnes referme aussi la liste.
      menu.querySelector(".menu__inner").addEventListener("mouseleave", () => setServices({ hover: false, pinned: false }));
    }

    servicesButton.addEventListener("click", () => setServices({ pinned: !services.pinned }, 0));
    // Au clavier seulement (focus visible) : un clic à la souris donne aussi le focus au bouton et ne doit pas épingler la liste.
    zone.addEventListener("focusin", (e) => e.target.matches(":focus-visible") && setServices({ focus: true }));
    zone.addEventListener("focusout", () => setServices({ focus: false }));
  }
}
