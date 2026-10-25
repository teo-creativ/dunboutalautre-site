import "../styles/main.css";
import "./core.js";
import { initCta } from "./cta.js";
import { initHeaderTheme } from "./header-theme.js";
import { initIntro } from "./intro.js";
import { initMenu } from "./menu.js";
import { initServices } from "./services.js";
import { initStage } from "./stage.js";

initCta();
initHeaderTheme(); // avant la scène : ses triggers se calculent après les pins (refreshPriority)
initMenu();
initStage();
initServices();
initIntro();
