// Filtres, grille et « Voir plus » de la page Réalisations V4 (retours-v4/docs/01-REALISATIONS.md §5 à §7, frames realisations-14 à 19).
// L'état de départ est déjà dans le HTML (projets-grid.js, côté build) : filtre « Tous », 8 cartes, le reste en `hidden`, grille repliée.
// Ici : un clic de filtre fait sortir les cartes qui ne correspondent plus (opacité et léger y), réorganise les autres avec Flip de GSAP
// (importé à la demande : il n'est pas dans le bundle des autres pages), puis fait entrer les nouvelles. « Voir plus » retire le dégradé
// et révèle le lot suivant en cascade. Toute interaction termine d'abord l'animation en cours : l'état final est recalculé depuis
// (filtre, limite), jamais déduit de ce qui est à l'écran. Mouvement réduit : mêmes états, sans animation.
import { gsap, ScrollTrigger, reducedMotion, scrollTo } from "./core.js";

let flipPromise;
const loadFlip = () => (flipPromise ??= import("gsap/Flip").then(({ Flip }) => (gsap.registerPlugin(Flip), Flip)));

export function initProjetsGrid() {
  const section = document.getElementById("projets");
  const bar = section?.querySelector(".pfilters");
  if (!bar) return;

  const buttons = [...bar.querySelectorAll(".pfilter")];
  const grid = section.querySelector(".pgrid");
  const cards = [...grid.querySelectorAll(".pcard")];
  const more = section.querySelector(".pmore");
  const status = section.querySelector("[data-status]");
  const size = Number(section.dataset.pageSize);
  const text = (name) => section.dataset[name];

  // État : filtre actif, nombre de cartes autorisées, grille repliée (dégradé) ou non.
  let key = "all";
  let limit = size;
  let collapsed = true;
  let busy = null; // { kill() } de l'animation en cours
  let ticket = 0; // invalide un clic de filtre qui attendait le chargement de Flip si un autre est arrivé entre-temps

  const matching = () => cards.filter((card) => key === "all" || card.dataset.category === key);
  const visible = () => matching().slice(0, limit);
  const hasMore = () => matching().length > limit;
  const announce = (message) => (status.textContent = message);

  // Écrit l'état final dans le DOM (idempotent) : cartes visibles, dégradé, bouton.
  const apply = () => {
    const shown = new Set(visible());
    cards.forEach((card) => (card.hidden = !shown.has(card)));
    grid.toggleAttribute("data-collapsed", collapsed);
    grid.style.setProperty("--fade", collapsed ? "1" : "0");
    more.hidden = !hasMore();
  };

  // Termine l'animation en cours et rend la main à un DOM propre.
  const settle = () => {
    ticket++;
    busy?.kill();
    busy = null;
    gsap.killTweensOf([...cards, grid, more]);
    gsap.set([...cards, more], { clearProps: "opacity,transform" });
    grid.style.minHeight = "";
    apply();
  };

  // La hauteur de la page a changé : les déclencheurs de scroll qui suivent (footer) sont à recalculer, et le scroll ne doit pas dépasser la fin.
  const relayout = () => {
    ScrollTrigger.refresh();
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (window.scrollY > max) scrollTo(max, { duration: 0.6 });
  };

  // ?categorie=scenographie (lien de retour de la fiche projet) : le filtre est déjà choisi à l'ouverture, sans animation. Une valeur inconnue
  // est ignorée. Avant le premier calcul des positions de ScrollTrigger (main.js), donc sans effet sur les déclencheurs qui suivent.
  const wanted = new URLSearchParams(location.search).get("categorie");
  if (wanted && wanted !== "all" && buttons.some((button) => button.dataset.filter === wanted)) {
    key = wanted;
    collapsed = hasMore();
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === key)));
    apply();
  }

  // ---------- Filtre ----------
  const onFilter = async (next) => {
    if (next === key) return;
    settle();
    const mine = ticket;
    const before = visible();
    key = next;
    limit = size;
    collapsed = hasMore();
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.filter === key)));
    const after = visible();
    announce(after.length === 1 ? text("shownOne") : text("shown").replace("{n}", after.length));

    if (reducedMotion()) {
      apply();
      relayout();
      return;
    }
    const Flip = await loadFlip();
    if (mine !== ticket) return; // un autre clic a pris le relais

    const leaving = before.filter((card) => !after.includes(card));
    const entering = after.filter((card) => !before.includes(card));
    const staying = after.filter((card) => before.includes(card));
    grid.style.minHeight = `${grid.offsetHeight}px`; // la page ne se raccourcit pas pendant le mouvement
    const state = staying.length ? Flip.getState(staying) : null;

    const swap = () => {
      apply();
      if (entering.length) gsap.set(entering, { opacity: 0 }); // une liste vide ferait avertir GSAP d'une cible absente
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set([...cards, more], { clearProps: "opacity,transform" });
          grid.style.minHeight = "";
          busy = null;
          relayout();
        },
      });
      if (state) tl.add(Flip.from(state, { duration: 0.7, ease: "power3.inOut" }), 0);
      if (entering.length) tl.fromTo(entering, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, state ? 0.25 : 0);
      busy = { kill: () => tl.kill() };
    };

    if (leaving.length) {
      const out = gsap.to(leaving, { opacity: 0, y: -14, duration: 0.25, ease: "power2.in", stagger: 0.02, onComplete: swap });
      busy = { kill: () => out.kill() };
    } else {
      swap();
    }
  };

  buttons.forEach((button) => button.addEventListener("click", () => onFilter(button.dataset.filter)));
  // Flip se charge dès que la main arrive sur les filtres : le premier clic n'attend pas le réseau.
  if (!reducedMotion()) ["pointerenter", "focusin"].forEach((type) => bar.addEventListener(type, loadFlip, { once: true }));

  // ---------- Voir plus ----------
  more.querySelector("button").addEventListener("click", () => {
    settle();
    const before = visible();
    limit += size;
    collapsed = false;
    const added = visible().filter((card) => !before.includes(card));
    const last = !hasMore();
    announce(added.length === 1 ? text("moreOne") : text("more").replace("{n}", added.length));

    if (reducedMotion()) {
      apply();
      relayout();
    } else {
      added.forEach((card) => (card.hidden = false));
      gsap.set(added, { opacity: 0 });
      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(added, { clearProps: "opacity,transform" });
          busy = null;
          apply();
          relayout();
        },
      });
      tl.to(grid, { "--fade": 0, duration: 0.8, ease: "power2.out" }, 0) // le dégradé se retire en douceur
        .fromTo(added, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.1);
      if (last) tl.to(more, { opacity: 0, duration: 0.4, ease: "power2.out" }, 0.1); // plus rien à charger : le bouton s'efface
      busy = { kill: () => tl.kill() };
    }
    // Le bouton disparaît avec le dernier lot : le focus passe à la première nouvelle carte, sans faire défiler la page.
    if (last) added[0]?.querySelector(".pcard__link")?.focus({ preventScroll: true });
  });
}
