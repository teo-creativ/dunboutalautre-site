import "../styles/main.css";
import "./core.js";
import { initCta } from "./cta.js";
import { initFooterReveal } from "./footer-reveal.js";
import { initHeaderTheme } from "./header-theme.js";
import { initIntro } from "./intro.js";
import { initMenu } from "./menu.js";
import { initServices } from "./services.js";
import { initStage } from "./stage.js";
import { initStats } from "./stats.js";

initCta();
initMenu();
initStage();
initServices();
initStats();
initFooterReveal();
initHeaderTheme(); // après les pins : ses triggers en dépendent (refreshPriority et data-pin-length)
initIntro();
