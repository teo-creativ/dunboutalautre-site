// Galerie « Vos bureaux deviennent vivant » de la page Bureaux V5 (retours-v5/docs/03-SECTIONS-6-A-10.md §9, frames bureaux-43 à 48 et 54). Même
// technique que le flux vertical de Noël (noel-flux.js), sans le cercle : la section est épinglée, l'étiquette, le titre et le bouton restent
// fixes au centre, et les photos montent du bas de l'écran à des vitesses différentes (une photo de vitesse 100 suit la page), derrière le texte,
// puis sortent par le haut (sous le header : son dégradé orange les estompe, frames 46, 47 et 54). Seule la translation y bouge, par une timeline
// scrubée ; les positions de départ, les tailles et le recadrage sont en CSS (bureaux-galerie.css), mesurés sur les frames.
// Phases, en écrans de scroll : les photos montent 3 écrans (2,5 sous 900 px), puis la FAQ crème monte par-dessus pendant un écran, soit 400vh
// en ordinateur et 350vh en mobile (le doc indique 450vh : à 450vh la dernière photo sortirait 0,6 écran avant la FAQ, alors que sur la frame
// 47 elle sort pendant que la FAQ commence à monter) ; pendant cette montée le texte s'estompe, de 41 % à 72 % de la montée (frames 48 et 49 : 0,81
// de l'opacité à 47 % de la montée, 0,35 à 61 %). La section suivante reçoit la marque bx-overlap (marge négative, bureaux-installe.css).
// Sous 900 px : trois photos plus petites (les autres portent data-mobile="off"). Mouvement réduit, JavaScript absent : texte, puis photos en
// grille, rien d'épinglé.
import { gsap } from "./core.js";

const PHOTOS = { wide: 3, solo: 2.5 }; // durée de la montée des photos, en écrans de scroll
const OVERLAP = 1; // la FAQ monte par-dessus : le dernier écran du pin
const FADE = [0.41, 0.72]; // part de la montée de la FAQ où le texte s'estompe

export function initBureauxGalerie() {
  const section = document.querySelector('[data-bx="galerie"]');
  if (!section) return;
  const content = section.querySelector(".gal__content");
  const photos = [...section.querySelectorAll(".gal__photo")];
  if (!content || !photos.length) return;

  const mm = gsap.matchMedia();
  mm.add(
    {
      wide: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      solo: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      const root = document.documentElement;
      const rise = conditions.wide ? PHOTOS.wide : PHOTOS.solo;
      const total = rise + OVERLAP;
      const visible = photos.filter((li) => li.dataset.mobile !== "off" || conditions.wide);
      root.classList.add("bx-gal-anim");

      // Les quatre photos (850 Ko en 480 px) sont lues d'avance, une fois la page chargée et en priorité basse : le haut de page passe avant.
      const preload = () =>
        visible.forEach((li) => {
          const image = li.querySelector("img");
          image.fetchPriority = "low";
          image.loading = "eager";
        });
      const later = () => ("requestIdleCallback" in window ? requestIdleCallback(preload, { timeout: 3000 }) : setTimeout(preload, 1500));
      if (document.readyState === "complete") later();
      else window.addEventListener("load", later, { once: true });

      // Distance de montée de chaque photo : sa vitesse (svh par écran de scroll) fois la durée de la montée, en écrans de scroll.
      const speed = (li) => Number((conditions.wide ? li.dataset.speed : li.dataset.speedMobile) ?? li.dataset.speed) / 100;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const height = section.offsetHeight;
            // Lu par le thème du header : la zone de la section dure tant qu'elle est seule à l'écran, donc sans le dernier écran du pin, où la
            // FAQ monte par-dessus.
            section.dataset.pinLength = rise * height;
            return `+=${total * height}`;
          },
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            // will-change seulement pendant que la scène est active
            visible.forEach((li) => (li.style.willChange = self.isActive ? "transform" : ""));
          },
        },
      });
      visible.forEach((li) => {
        tl.fromTo(li, { y: 0 }, { y: () => -speed(li) * rise * section.offsetHeight, duration: rise }, 0);
      });
      tl.to(content, { opacity: 0, duration: (FADE[1] - FADE[0]) * OVERLAP }, rise + FADE[0] * OVERLAP).set({}, {}, total);

      // Point d'accroche : la FAQ remonte d'un écran par-dessus la galerie.
      const wrap = section.closest(".pin-spacer") ?? section;
      const next = wrap.nextElementSibling;
      next?.classList.add("bx-overlap");

      return () => {
        next?.classList.remove("bx-overlap");
        root.classList.remove("bx-gal-anim");
        delete section.dataset.pinLength;
        gsap.set([content, ...photos], { clearProps: "transform,opacity,willChange" });
      };
    },
  );
}
