import "../styles/main.css";
import "./core.js";
import { initCta } from "./cta.js";
import { initFaq } from "./faq.js";
import { initFooterReveal } from "./footer-reveal.js";
import { initHeaderTheme } from "./header-theme.js";
import { initIntro } from "./intro.js";
import { initMarquee } from "./marquee.js";
import { initMenu } from "./menu.js";
import { initParallax } from "./parallax.js";
import { initProcess } from "./process.js";
import { initReveal } from "./reveal.js";
import { initServices } from "./services.js";
import { initStage } from "./stage.js";
import { initStats } from "./stats.js";

initCta();
initMenu();
initStage();
initServices();
initStats();
// Landing Noël : chaque module ne fait rien si ses éléments sont absents de la page.
initReveal();
initMarquee();
initProcess();
initParallax();
initFaq();
initFooterReveal();
initHeaderTheme(); // après les pins : ses triggers en dépendent (refreshPriority et data-pin-length)
initIntro();

// Liens fictifs (#) : le prototype ne renvoie pas en haut de page.
document.addEventListener("click", (e) => {
  if (e.target.closest?.('a[href="#"]')) e.preventDefault();
});
