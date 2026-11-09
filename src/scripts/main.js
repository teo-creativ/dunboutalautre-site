import "../styles/main.css";
import { ScrollTrigger, fontsLoaded, initCore } from "./core.js";
import { initCursor } from "../components/cursor.js";
import { initContact } from "./contact.js";
import { initContactForm } from "./contact-form.js";
import { initCta } from "./cta.js";
import { initFaq } from "./faq.js";
import { initFiche } from "./fiche.js";
import { initFooterReveal } from "./footer-reveal.js";
import { initHeaderTheme } from "./header-theme.js";
import { initIntro } from "./intro.js";
import { initLogos } from "./logos.js";
import { initMenu } from "./menu.js";
import { initNoelStage } from "./noel-stage.js";
import { initProcess } from "./process.js";
import { initReducedMotion } from "./reduced-motion.js";
import { initProjetsGrid } from "./projets-grid.js";
import { initProjetsStage } from "./projets-stage.js";
import { initRealisations } from "./realisations.js";
import { initReveal } from "./reveal.js";
import { initRevealOnEnter } from "./reveal-on-enter.js";
import { restoreScroll, rememberScroll } from "./scroll-memory.js";
import { initServices } from "./services.js";
import { initSkipLink } from "./skip-link.js";
import { initStage } from "./stage.js";
import { initStats } from "./stats.js";
import { initTestimonials } from "./testimonials.js";
import { initUniverses } from "./universes.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// Rend la main au navigateur entre deux groupes d'initialisation : il peut peindre et répondre, aucune tâche ne reste longue.
const nextTask = () => (globalThis.scheduler?.yield ? scheduler.yield() : wait(0));
// Après le premier rendu : la première mise en page se fait hors de nos tâches (le hero est masqué par html.js, rien ne clignote).
const afterFirstPaint = () => new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve)));
const loaded = document.readyState === "complete" ? Promise.resolve() : new Promise((resolve) => addEventListener("load", resolve, { once: true }));
// Page Végétalisation de bureaux : ses animations sont un chunk à part, chargé seulement quand la page porte [data-bx] (même principe que
// Flip dans projets-grid.js). Il se télécharge pendant les polices et le premier rendu ; le bundle commun ne grossit pas.
const bureaux = document.querySelector("[data-bx]") ? import("./bureaux.js") : null;

async function boot() {
  rememberScroll();
  initSkipLink();
  await afterFirstPaint();
  initCore();
  const fontsOk = await fontsLoaded();
  const bx = bureaux ? await bureaux : null;

  // Ordre utile : les pins avant ce qui dépend de leur position (header-theme : refreshPriority et data-pin-length).
  // Landing Noël : chaque module ne fait rien si ses éléments sont absents de la page.
  const groups = [
    [initCta, initMenu, initCursor],
    [initStage, initNoelStage, initProjetsStage, ...(bx ? [bx.initBureaux] : [])],
    [initRealisations, initServices, initStats, initUniverses],
    [initProcess, initTestimonials, initReveal, initRevealOnEnter, initFaq, initLogos, initContactForm, initContact, initProjetsGrid, initFiche],
    [initReducedMotion, initFooterReveal, initHeaderTheme],
  ];
  for (const group of groups) {
    group.forEach((init) => init());
    await nextTask();
  }

  // Un seul recalcul des positions, avant l'intro : polices en place, mises en page terminées.
  await Promise.race([loaded, wait(1000)]);
  ScrollTrigger.refresh();
  const restored = restoreScroll() > 0;
  document.documentElement.classList.remove("restoring");
  initIntro({ skip: restored });

  // Réseau lent : les polices arrivent après l'initialisation, les textes découpés et les mesures sont à refaire.
  if (!fontsOk) document.fonts.ready.then(() => window.dispatchEvent(new Event("dbal:relayout")));
}

boot();

// Liens fictifs (#) : le prototype ne renvoie pas en haut de page.
document.addEventListener("click", (e) => {
  if (e.target.closest?.('a[href="#"]')) e.preventDefault();
});
