// Corps d'une page secondaire : rend, dans l'ordre, les sections de src/data/pages/<page>.js. Un renderer par type de section, sous
// src/components/sections/. <!--@page-sections page="terrasses"--> dans <main>.
import { pages } from "../data/pages/index.js";
import ctaFinal from "./sections/cta-final.js";
import faq from "./sections/faq.js";
import hero from "./sections/hero.js";
import intro from "./sections/intro.js";
import offers from "./sections/offers.js";
import process from "./sections/process.js";

const renderers = { hero, intro, offers, process, faq, "cta-final": ctaFinal };

export default ({ page }) => {
  const data = pages[page];
  if (!data) throw new Error(`page-sections : page « ${page} » absente de src/data/pages/index.js`);
  return data.sections
    .map((section, index) => {
      const render = renderers[section.type];
      if (!render) throw new Error(`page-sections : type de section inconnu « ${section.type} » (${page}, n° ${index + 1})`);
      return render(section, { page: data, index });
    })
    .join("\n      ");
};
