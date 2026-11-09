// Démo de reveal-on-enter (tests/reveal-demo.html) : les mêmes styles et le même noyau (GSAP, ScrollTrigger, Lenis) que le site, puis le composant. Comme sur le site, html.js
// (posé par le <head>) est retiré quand l'initialisation est faite : les états de départ ne tiennent plus que par le script.
import "../src/styles/main.css";
import { ScrollTrigger, initCore } from "../src/scripts/core.js";
import { initRevealOnEnter } from "../src/scripts/reveal-on-enter.js";

initCore();
initRevealOnEnter();
ScrollTrigger.refresh();
requestAnimationFrame(() => document.documentElement.classList.remove("js"));
