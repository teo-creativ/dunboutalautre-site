// « Notre approche » (ANIMATIONS.md §5 et §6) : le voile assombrit la photo plein écran, le texte se révèle ligne à ligne,
// puis les services remontent par-dessus pendant que le texte se réduit et que la photo s'assombrit et monte un peu.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";

// "rgb(252, 76, 0)" devient "rgba(252, 76, 0, 0)" : on fond depuis la même teinte, sans passer par un noir transparent.
const clear = (color) => color.replace("rgb(", "rgba(").replace(")", ", 0)");

export function addApproach(tl, { stage, T }) {
  const content = stage.querySelector(".approach__content");
  const label = content.querySelector(".label");
  const text = content.querySelector(".approach__text");
  const tags = [...text.querySelectorAll(".tag")];

  // Couleur et rotation finales des tags, lues dans le CSS avant que GSAP y touche.
  const finals = tags.map((tag) => {
    const style = getComputedStyle(tag);
    return { color: style.color, rotation: parseFloat(style.getPropertyValue("--tag-rotate")) };
  });

  tl.fromTo(stage.querySelector(".approach__veil"), { opacity: 0 }, { opacity: 1, duration: T.veilDur, ease: "none" }, T.veil);

  // Texte : les lignes montent une à une sous leur masque, les mots passent de 25 % à 100 % d'opacité (effet de lecture).
  const split = SplitText.create(text, { type: "lines,words", mask: "lines", linesClass: "approach__line", ignore: ".tag" });
  tl.fromTo(label, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.15, ease: "power2.out" }, T.text)
    .fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power3.out", stagger: 0.1 }, T.text + 0.05)
    .fromTo(split.words, { opacity: 0.25 }, { opacity: 1, duration: 0.25, ease: "none", stagger: 0.009 }, T.text + 0.15);

  // Title tags : le fond se remplit de gauche à droite en s'inclinant, puis le texte de la pilule apparaît.
  tags.forEach((tag, i) => {
    const at = T.text + 0.25 + i * 0.22;
    tl.fromTo(
      tag,
      { clipPath: "inset(0% 100% 0% 0%)", rotation: 0, color: clear(finals[i].color) },
      { clipPath: "inset(0% 0% 0% 0%)", rotation: finals[i].rotation, duration: 0.22, ease: "power3.out" },
      at,
    ).to(tag, { color: finals[i].color, duration: 0.12, ease: "none" }, at + 0.18);
  });

  // Superposition : la section est épinglée en arrière-plan, les services remontent par-dessus (marge négative en CSS).
  const overlap = T.total - T.overlap;
  tl.to(content, { autoAlpha: 0, scale: 0.92, duration: T.overlap * 0.8, ease: "power1.in" }, overlap)
    .fromTo(stage.querySelector(".approach__shade"), { opacity: 0 }, { opacity: 1, duration: T.overlap, ease: "none" }, overlap)
    .to(stage.querySelector(".approach__media img"), { yPercent: -8, duration: T.overlap, ease: "none" }, overlap);
}
