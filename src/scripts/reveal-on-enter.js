// Composant `reveal-on-enter` (retours V8, partie B de retours-v8/docs/02-SLIDERS-ET-SECTIONS-ORANGE.md) : le texte et les photos d'une section qui arrive par-dessus une autre
// (orange ou plein écran) se révèlent à l'entrée, comme le reste du site, au lieu d'être déjà là. Il n'est PAS encore appliqué aux pages : chaque page l'active en posant les attributs
// ci-dessous (prompts 05 à 08).
//
// Balisage : data-reveal="enter" sur la section (ou le bloc), puis data-reveal-part sur ce qui se révèle, dans cet ordre de scène :
//   eyebrow : le surtitre (étiquette) : fondu et glissement de 12 px, 0,5 s ;
//   title   : le titre, en lignes sous masque (SplitText) qui montent de 100 %, décalage de 0,08 s, power3.out 0,9 s ; ses pastilles (.tag) s'ouvrent ensuite par clip-path, de gauche à
//             droite (0,6 s), jamais en pivotant (G2) ;
//   text    : le paragraphe : fondu et montée de 16 px, 0,15 s après la fin du titre ;
//   cta     : le bouton : comme le paragraphe, 0,1 s après lui ;
//   photo   : chaque photo se révèle par clip-path de bas en haut (inset(100% 0 0 0) vers inset(0)), 1 s, power3.inOut, pendant que son média (img ou video, premier enfant
//             qui en est un) revient de 1,15 à 1 (parallaxe douce), décalage de 0,12 s entre deux photos. Le transform de l'élément photo reste libre : la montée de scroll
//             des galeries (G5) y garde sa parallaxe.
// Réglages sur la section : data-reveal-start (départ du ScrollTrigger, "top 75%" par défaut), data-reveal-once="true" (joue une fois ; sinon la révélation se rejoue à l'entrée et se
// défait en sortant par le haut, comme le reste du site, reveal.js), data-reveal-delay (secondes avant le début, 0 par défaut). Plusieurs éléments peuvent porter le même part (deux
// photos, deux paragraphes) : ils se révèlent à la suite.
//
// L'état de départ est posé en CSS (styles/reveal-on-enter.css, html.js) puis par ce script avant la fin de l'intro : aucun flash du contenu final. Mouvement réduit : aucun état caché, rien
// ne bouge, tout est visible. `createReveal(root, options)` renvoie la timeline en pause, pour une page qui la déclenche elle-même (le recouvrement d'une section épinglée, par exemple) ;
// `initRevealOnEnter()` la branche sur un ScrollTrigger pour chaque [data-reveal="enter"].
import { gsap, ScrollTrigger, SplitText } from "./core.js";
import { fillTag, hideTags } from "./tag.js";

const HIDDEN = "inset(100% 0% 0% 0%)";
const SHOWN = "inset(0% 0% 0% 0%)";

const parts = (root, name) => [...root.querySelectorAll(`[data-reveal-part="${name}"]`)];
const media = (photo) => photo.querySelector("img, video");

export function createReveal(root, { delay = Number(root.dataset.revealDelay) || 0 } = {}) {
  const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });
  let at = delay;

  // Surtitre
  const eyebrows = parts(root, "eyebrow");
  if (eyebrows.length) {
    gsap.set(eyebrows, { opacity: 0, y: 12 });
    tl.to(eyebrows, { opacity: 1, y: 0, duration: 0.5 }, at);
  }

  // Titre : lignes sous masque, puis pastilles
  let textEnd = at + (eyebrows.length ? 0.15 : 0);
  parts(root, "title").forEach((title) => {
    const split = SplitText.create(title, { type: "lines", mask: "lines", linesClass: "split-line", ignore: ".tag", aria: "none" });
    const tags = [...title.querySelectorAll(".tag")];
    gsap.set(split.lines, { yPercent: 100 });
    hideTags(tags);
    gsap.set(title, { opacity: 1 });
    const start = textEnd + 0.1;
    tl.to(split.lines, { yPercent: 0, duration: 0.9, stagger: 0.08 }, start);
    const linesEnd = start + 0.9 + (split.lines.length - 1) * 0.08;
    tags.forEach((tag, i) => fillTag(tl, tag, linesEnd - 0.3 + i * 0.12, { duration: 0.6 }));
    textEnd = linesEnd + (tags.length ? 0.15 : 0); // les pastilles finissent à linesEnd + 0,3 + 0,12 par pastille : le paragraphe suit sans attendre la dernière
  });

  // Paragraphe et bouton : fondu et montée de 16 px
  const rise = [...parts(root, "text"), ...parts(root, "cta")];
  if (rise.length) {
    gsap.set(rise, { opacity: 0, y: 16 });
    tl.to(parts(root, "text"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, textEnd + 0.15);
    tl.to(parts(root, "cta"), { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 }, textEnd + 0.25);
  }

  // Photos : clip-path de bas en haut, média de 1,15 à 1
  parts(root, "photo").forEach((photo, i) => {
    const inner = media(photo);
    gsap.set(photo, { clipPath: HIDDEN });
    if (inner) gsap.set(inner, { scale: 1.15 });
    tl.to(photo, { clipPath: SHOWN, duration: 1, ease: "power3.inOut" }, delay + i * 0.12);
    if (inner) tl.to(inner, { scale: 1, duration: 1.2, ease: "power3.out" }, delay + i * 0.12);
  });

  return tl;
}

export function initRevealOnEnter() {
  const roots = [...document.querySelectorAll('[data-reveal="enter"]')];
  if (!roots.length) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    const timelines = new Map();
    roots.forEach((root) => {
      const tl = createReveal(root);
      timelines.set(root, tl);
      const once = root.dataset.revealOnce === "true";
      ScrollTrigger.create({
        trigger: root,
        start: root.dataset.revealStart || "top 75%",
        end: "max", // si on saute au-delà de la section, la révélation est quand même jouée
        once,
        onToggle: once ? undefined : (self) => (self.isActive ? tl.play() : tl.reverse()),
        onEnter: once ? () => tl.play() : undefined,
      });
    });
    // Clavier : un élément focalisé dans une section pas encore révélée la révèle aussitôt, le focus ne doit jamais se trouver sur un élément invisible.
    const reveal = (e) => timelines.get(e.currentTarget)?.play();
    roots.forEach((root) => root.addEventListener("focusin", reveal));
    return () => roots.forEach((root) => root.removeEventListener("focusin", reveal));
  });
}
