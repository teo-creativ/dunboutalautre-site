// Corps d'une page secondaire : rend, dans l'ordre, les sections de src/data/pages/<page>.js. Un renderer par type de section, sous
// src/components/sections/. <!--@page-sections page="terrasses"--> dans <main>.
import { pages } from "../data/pages/index.js";
import ctaFinal from "./sections/cta-final.js";
import articleBody from "./sections/article-body.js";
import articles from "./sections/articles.js";
import cards from "./sections/cards.js";
import faq from "./sections/faq.js";
import figures from "./sections/figures.js";
import filtersGrid from "./sections/filters-grid.js";
import form from "./sections/form.js";
import gallery from "./sections/gallery.js";
import hero from "./sections/hero.js";
import intro from "./sections/intro.js";
import logos from "./sections/logos.js";
import offers from "./sections/offers.js";
import process from "./sections/process.js";
import project from "./sections/project.js";
import testimonials from "./sections/testimonials.js";

const renderers = { hero, intro, offers, cards, figures, form, project, articles, "article-body": articleBody, "filters-grid": filtersGrid, logos, testimonials, gallery, process, faq, "cta-final": ctaFinal };

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
