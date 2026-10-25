// Chiffres clés (ANIMATIONS.md §7) : la section est épinglée, le titre se révèle mot à mot, puis les trois cartes entrent
// une à une par le bas et s'empilent en se chevauchant. Leur rotation part d'une valeur plus forte et revient à celle de
// repos pendant que les nombres comptent depuis 0. Une unité de timeline vaut un écran de scroll.
import { gsap, SplitText } from "./core.js";

const DESKTOP = {
  total: 2,
  title: 0.05, titleDur: 0.3,
  // start et duration : entrée de la carte ; rot : rotation de départ, plus forte que celle de repos (CSS --card-rotate).
  cards: [
    { start: 0.3, duration: 0.6, rot: -7 },
    { start: 0.8, duration: 0.6, rot: 6 },
    { start: 1.3, duration: 0.6, rot: -7 },
  ],
};
const MOBILE = {
  total: 1.4,
  title: 0.02, titleDur: 0.2,
  cards: [
    { start: 0.2, duration: 0.4, rot: -6 },
    { start: 0.5, duration: 0.4, rot: 5 },
    { start: 0.8, duration: 0.4, rot: -6 },
  ],
};

export function initStats() {
  const section = document.getElementById("stats");
  if (!section) return;

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      const T = conditions.desktop ? DESKTOP : MOBILE;
      const root = document.documentElement;
      root.classList.add("stats-anim");

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => {
            const length = T.total * section.offsetHeight;
            section.dataset.pinLength = length; // lu par le thème du header : la section reste à l'écran pendant son pin
            return `+=${length}`;
          },
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Titre : mots depuis un masque, puis le tag « inoubliable » qui se remplit.
      const title = section.querySelector(".stats__title");
      const tag = title.querySelector(".tag");
      const split = SplitText.create(title, { type: "words", mask: "words", ignore: ".tag" });
      tl.fromTo(section.querySelector(".stats__intro .label"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" }, T.title)
        .fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: T.titleDur, ease: "power3.out", stagger: 0.04 }, T.title)
        .fromTo(tag, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.2, ease: "power3.out" }, T.title + T.titleDur * 0.6);

      // Cartes : entrée par le bas, rotation qui s'ajuste, compteur de 0 à la valeur.
      section.querySelectorAll(".stat-card").forEach((card, i) => {
        const { start, duration, rot } = T.cards[i];
        const restRotation = parseFloat(getComputedStyle(card).getPropertyValue("--card-rotate"));
        const value = card.querySelector("[data-value]");
        tl.fromTo(
          card,
          { y: () => window.innerHeight - card.offsetTop + 60, rotation: rot },
          { y: 0, rotation: restRotation, duration, ease: "power2.out" },
          start,
        ).fromTo(
          value,
          { textContent: 0 },
          { textContent: Number(value.dataset.value), snap: { textContent: 1 }, duration: duration * 0.9, ease: "power1.out" },
          start + duration * 0.1,
        );
      });

      tl.set({}, {}, T.total);

      return () => {
        root.classList.remove("stats-anim");
        delete section.dataset.pinLength;
        // Le retour à l'état d'origine d'un compteur remet son point de départ (0) : on rétablit la valeur finale.
        section.querySelectorAll("[data-value]").forEach((el) => { el.textContent = el.dataset.value; });
      };
    },
  );
}
