// « Comment ça se passe » : la ligne de la timeline se dessine au scroll et chaque étape apparaît, une à une, quand la ligne
// atteint son point. Réversible. Sans animation (mouvement réduit, JavaScript absent), la ligne et les étapes sont visibles.
import { gsap, ScrollTrigger } from "./core.js";

const READ_LINE = "65%"; // la ligne se dessine jusqu'à ce niveau de l'écran

export function initProcess() {
  const section = document.getElementById("deroulement");
  const timeline = section?.querySelector(".process__timeline");
  if (!timeline) return;

  const steps = [...timeline.querySelectorAll(".step")];
  const line = timeline.querySelector(".process__line");
  const fill = timeline.querySelector(".process__line-fill");

  // Position verticale du point d'une étape dans la timeline (offsetTop : insensible aux transformations).
  const dotY = (step) => {
    const dot = step.querySelector(".step__dot");
    return step.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
  };

  // La ligne va du premier au dernier point, quelle que soit la hauteur du texte de la dernière étape.
  const layout = () => {
    line.style.top = `${dotY(steps[0])}px`;
    line.style.bottom = `${timeline.offsetHeight - dotY(steps.at(-1))}px`;
  };

  const mm = gsap.matchMedia();
  mm.add("(prefers-reduced-motion: no-preference)", () => {
    layout();
    // Avant le calcul des positions des triggers : la mise en page des polices ou d'une nouvelle largeur est relue.
    ScrollTrigger.addEventListener("refreshInit", layout);

    gsap.fromTo(
      fill,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: timeline,
          start: () => `top+=${dotY(steps[0])} ${READ_LINE}`,
          end: () => `top+=${dotY(steps.at(-1))} ${READ_LINE}`,
          scrub: 0.6,
        },
      },
    );

    steps.forEach((step) => {
      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .fromTo(step.querySelector(".step__body"), { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.9 }, 0)
        .fromTo(step.querySelector(".step__dot"), { scale: 0 }, { scale: 1, duration: 0.6, ease: "back.out(2.4)" }, 0);

      ScrollTrigger.create({
        trigger: timeline,
        start: () => `top+=${dotY(step)} ${READ_LINE}`,
        end: "max",
        onToggle: (self) => (self.isActive ? tl.play() : tl.reverse()),
      });
    });

    return () => {
      ScrollTrigger.removeEventListener("refreshInit", layout);
      line.style.removeProperty("top");
      line.style.removeProperty("bottom");
    };
  });
}
