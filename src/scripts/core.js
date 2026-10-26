import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Mouvement réduit : lu à chaque usage (le réglage système peut changer en cours de visite).
const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
export const reducedMotion = () => reducedQuery.matches;

// Une seule instance de Lenis, pilotée par le ticker de GSAP pour rester synchrone avec ScrollTrigger.
// Créée par initCore() : l'enregistrement de ScrollTrigger et Lenis mesurent la page, ce qui forcerait sa première mise en page
// pendant l'évaluation du script. main.js les lance donc après le premier rendu.
let lenis;

export function initCore() {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // ScrollTrigger se recalculait de lui-même à DOMContentLoaded et à load : main.js lance un seul recalcul, quand tout est en place.
  ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: "visibilitychange,resize" });

  lenis = new Lenis({ smoothWheel: !reducedMotion() });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Défilement programmé : immédiat en mouvement réduit.
export const scrollTo = (target, options) => lenis.scrollTo(target, { immediate: reducedMotion(), ...options });

// Polices du site (head.js). SplitText coupe les lignes et ScrollTrigger mesure avec leurs métriques : on les attend avant
// d'initialiser, sinon un texte découpé avec la police de secours se recoupe mal quand la vraie police arrive.
// Seules les graisses réellement utilisées sont demandées. Résout false si elles tardent (réseau lent) : le site s'initialise
// quand même, et main.js relance les mesures à leur arrivée.
const FACES = ['300 1em Poppins', '400 1em Poppins', 'italic 400 1em "Playfair Display"'];
const SAMPLE = "Aéèêàçôîœ'’&·…";

export const fontsLoaded = (timeout = 3000) =>
  Promise.race([
    Promise.all(FACES.map((face) => document.fonts.load(face, SAMPLE))).then(() => true),
    new Promise((resolve) => setTimeout(() => resolve(false), timeout)),
  ]).catch(() => false);

export { gsap, ScrollTrigger, SplitText, lenis };
