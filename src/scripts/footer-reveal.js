// Footer en révélation (ANIMATIONS.md §8) : fixé derrière le contenu, qui se décolle en fin de page. Le contenu du footer
// monte légèrement (parallaxe), le wordmark aussi. Si le footer ne tient pas dans un écran, ou en mobile, il reste statique.
// --footer-h (marge basse du contenu) est la hauteur mesurée du footer : les tokens en donnent une valeur de départ (footer V2,
// environ 32 vw), la mesure la corrige si les polices ou un petit écran changent sa hauteur.
import { gsap, ScrollTrigger, lenis } from "./core.js";

export function initFooterReveal() {
  const footer = document.getElementById("footer");
  const main = document.getElementById("main");
  if (!footer || !main) return;

  const root = document.documentElement;
  const mm = gsap.matchMedia();

  mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
    let scope = null;

    // Le footer fixé ne défile pas : on vérifie qu'il tient dans l'écran, sinon il resterait coupé et inaccessible.
    const fits = () => footer.offsetHeight <= window.innerHeight;

    const disable = () => {
      scope?.revert();
      scope = null;
      root.classList.remove("footer-reveal");
      root.style.removeProperty("--footer-h");
    };

    const enable = () => {
      root.classList.add("footer-reveal");
      if (!fits()) {
        root.classList.remove("footer-reveal");
        return;
      }
      root.style.setProperty("--footer-h", `${footer.offsetHeight}px`);
      scope = gsap.context(() => {
        gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: main,
              start: "bottom bottom", // le bas du contenu entre dans l'écran : le footer commence à se découvrir
              // Le footer est entièrement découvert en fin de page, quand le bas du contenu est à une hauteur de footer du bas de l'écran
              // (le footer V2 est plus bas qu'un écran : le bas du contenu ne sort plus par le haut).
              end: () => `bottom bottom-=${footer.offsetHeight}`,
              scrub: 0.6,
              invalidateOnRefresh: true,
              refreshPriority: -1, // après les pins : la hauteur du contenu les inclut
            },
          })
          .fromTo(footer.querySelector(".footer__main"), { yPercent: -20, opacity: 0.6 }, { yPercent: 0, opacity: 1 }, 0)
          .fromTo(footer.querySelector(".footer__wordmark"), { yPercent: 8 }, { yPercent: 0 }, 0);
      });
    };

    const update = () => {
      disable();
      enable();
      ScrollTrigger.refresh();
    };

    // Un lien du footer reçoit le focus au clavier alors qu'il est encore caché derrière le contenu : on descend le découvrir.
    const onFocusIn = () => {
      if (root.classList.contains("footer-reveal")) lenis.scrollTo(lenis.limit, { duration: 1 });
    };
    footer.addEventListener("focusin", onFocusIn);

    enable();
    let timer;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 200);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("dbal:relayout", update); // polices arrivées après l'initialisation (réseau lent)

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("dbal:relayout", update);
      footer.removeEventListener("focusin", onFocusIn);
      disable();
    };
  });
}
