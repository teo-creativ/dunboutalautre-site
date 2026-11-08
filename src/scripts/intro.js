// Animation de chargement des pages (ANIMATIONS.md §2) : header, ligne de positionnement, titre mot à mot sous masque,
// title tags qui apparaissent, CTA. Les éléments sont masqués en CSS (html.js) jusqu'à ce que GSAP les reprenne.
// La landing Noël ajoute le sous-titre, qui monte après le titre.
import { gsap, SplitText, reducedMotion } from "./core.js";
import { clearTags, fillTag, hideTags } from "./tag.js";

// Le CSS ne masque plus rien : le contenu est visible tel quel, sans animation.
const endIntro = () => {
  document.documentElement.classList.remove("js");
  clearTimeout(window.__introFailsafe);
};

// skip : la page est restaurée en milieu de parcours, le hero n'est plus à l'écran.
export function initIntro({ skip = false } = {}) {
  const title = document.querySelector(".hero__title");
  if (!title) return;
  if (skip || reducedMotion()) return endIntro();

  const q = (selector) => document.querySelector(selector);
  const logo = q(".header__logo");
  const menu = q(".header__menu");
  const leaves = q(".hero__leaves");
  const tagline = q(".hero__tagline");
  const lead = q(".hero__lead");
  const cta = q(".hero__inner .cta");
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  const tags = title.querySelectorAll(".tag");
  const header = [logo, menu].filter(Boolean);
  const rises = [lead].filter(Boolean);

  // États de départ en styles inline, puis on retire la classe js : le CSS ne masque plus rien, GSAP a pris le relais.
  gsap.set(header, { autoAlpha: 0, y: 12 });
  if (leaves) gsap.set(leaves, { opacity: 0 }); // pas de feuilles sur le hero orange de Réalisations
  if (tagline) gsap.set(tagline, { autoAlpha: 0 });
  if (rises.length) gsap.set(rises, { autoAlpha: 0, y: 20 }); // vide sur l'accueil : GSAP avertirait d'une cible absente
  gsap.set(split.words, { yPercent: 110 });
  gsap.set(title, { autoAlpha: 1 });
  if (tags.length) {
    gsap.set(tags, { autoAlpha: 0, scale: 0.7 });
    hideTags(tags); // le titre « Nos projets. » de Réalisations n'a pas de pastille
  }
  if (cta) gsap.set(cta, { autoAlpha: 0, y: 24 }); // pas de CTA dans le hero de Contact, Réalisations et Blog : rien à animer ni à signaler
  endIntro();

  const tl = gsap
    .timeline({
      defaults: { ease: "expo.out" },
      // Les styles inline de l'intro sont retirés : le CSS reprend (survol des CTA).
      onComplete: () => {
        gsap.set([...header, leaves, tagline, ...rises, split.words, title, ...tags, cta].filter(Boolean), {
          clearProps: "opacity,visibility,transform,clipPath",
        });
        if (tags.length) clearTags(tags);
      },
    })
    .to(header, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0)
    .to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.2);
  if (leaves) tl.to(leaves, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0);
  // Tag : il grossit avec un léger rebond, droit (aucune rotation, G2), pendant que son fond se dessine de gauche à droite (pilule).
  if (tags.length) tl.to(tags, { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.6)", stagger: 0.12 }, 0.75);
  if (cta) tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.1);

  tags.forEach((tag, i) => fillTag(tl, tag, 0.75 + i * 0.12));
  if (tagline) tl.to(tagline, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.1);
  if (lead) tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.9);
}
