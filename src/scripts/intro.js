// Animation de chargement des pages (ANIMATIONS.md §2) : header, ligne de positionnement, titre mot à mot sous masque,
// title tags qui apparaissent, CTA. Les éléments sont masqués en CSS (html.js) jusqu'à ce que GSAP les reprenne.
// La landing Noël ajoute le sous-titre, le téléphone et la photo en arche, qui se dévoile de bas en haut.
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
  const quote = q(".header__quote"); // CTA persistant de la landing Noël (absent de l'accueil)
  const leaves = q(".hero__leaves");
  const tagline = q(".hero__tagline");
  const lead = q(".hero__lead");
  const phone = q(".hero__phone");
  const photo = q(".hero__photo");
  const photoImg = photo?.querySelector("img");
  const cta = q(".hero__inner .cta");
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  const tags = title.querySelectorAll(".tag");
  // Rotation finale du tag, lue dans le CSS (--tag-rotate) : l'animation part de 0 et y revient exactement.
  const tagRotation = (_index, tag) => parseFloat(getComputedStyle(tag).getPropertyValue("--tag-rotate"));
  const header = [logo, menu, quote].filter(Boolean);
  const rises = [lead, phone].filter(Boolean);

  // États de départ en styles inline, puis on retire la classe js : le CSS ne masque plus rien, GSAP a pris le relais.
  gsap.set(header, { autoAlpha: 0, y: 12 });
  gsap.set(leaves, { opacity: 0 });
  if (tagline) gsap.set(tagline, { autoAlpha: 0 });
  if (rises.length) gsap.set(rises, { autoAlpha: 0, y: 20 }); // vide sur l'accueil : GSAP avertirait d'une cible absente
  gsap.set(split.words, { yPercent: 110 });
  gsap.set(title, { autoAlpha: 1 });
  gsap.set(tags, { autoAlpha: 0, scale: 0.7, rotation: 0 });
  hideTags(tags);
  gsap.set(cta, { autoAlpha: 0, y: 24 });
  if (photo) {
    gsap.set(photo, { opacity: 1, clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(photoImg, { scale: 1.3 });
  }
  endIntro();

  const tl = gsap
    .timeline({
      defaults: { ease: "expo.out" },
      // Les styles inline de l'intro sont retirés : le CSS reprend (rotation des tags, survol des CTA).
      onComplete: () => {
        gsap.set([...header, leaves, tagline, ...rises, split.words, title, tags, cta, photo].filter(Boolean), {
          clearProps: "opacity,visibility,transform,clipPath",
        });
        clearTags(tags);
      },
    })
    .to(header, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0)
    .to(leaves, { opacity: 1, duration: 1.6, ease: "power2.out" }, 0)
    .to(split.words, { yPercent: 0, duration: 1.1, stagger: 0.07 }, 0.2)
    // Tag : il s'incline et grossit avec un léger rebond pendant que son fond se dessine de gauche à droite (pilule).
    .to(tags, { autoAlpha: 1, scale: 1, rotation: tagRotation, duration: 0.7, ease: "back.out(1.6)", stagger: 0.12 }, 0.75)
    .to(cta, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.1);

  tags.forEach((tag, i) => fillTag(tl, tag, 0.75 + i * 0.12));
  if (tagline) tl.to(tagline, { autoAlpha: 1, duration: 0.8, ease: "power2.out" }, 0.1);
  if (lead) tl.to(lead, { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.9);
  if (phone) tl.to(phone, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.3);
  if (photo) {
    tl.to(photo, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, ease: "expo.inOut" }, 0.25).to(
      photoImg,
      { scale: 1, duration: 2, ease: "expo.out" },
      0.25,
    );
  }
}
