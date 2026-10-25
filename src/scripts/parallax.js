// Parallaxe douce des photos de la landing Noël : l'image, plus haute que son cadre, glisse de quelques pour cent pendant
// que le cadre traverse l'écran (transform seulement). Le hero part de la position haute de la page, les autres de l'entrée
// dans l'écran.
import { gsap } from "./core.js";

export function initParallax() {
  const heroPhoto = document.querySelector(".hero--noel .hero__photo img");
  const tiles = [...document.querySelectorAll(".gallery .tile img")];
  if (!heroPhoto && !tiles.length) return;

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    if (heroPhoto) {
      gsap.fromTo(
        heroPhoto,
        { yPercent: -4 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: ".hero--noel", start: "top top", end: "bottom top", scrub: true },
        },
      );
    }
    tiles.forEach((img) => {
      gsap.fromTo(
        img,
        { yPercent: -5 },
        {
          yPercent: 5,
          ease: "none",
          scrollTrigger: { trigger: img.closest(".tile"), start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    });
  });
}
