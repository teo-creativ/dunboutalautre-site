// « Notre approche » (ANIMATIONS.md §5 et §6) : le voile assombrit la photo plein écran, le texte se révèle ligne à ligne,
// puis les services remontent par-dessus pendant que le texte se réduit et que la photo s'assombrit et monte un peu.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";
import { fillTag } from "./tag.js";

export function addApproach(tl, { stage, T }) {
  const content = stage.querySelector(".approach__content");
  const label = content.querySelector(".label");
  const text = content.querySelector(".approach__text");
  const tags = [...text.querySelectorAll(".tag")];

  // Rotation finale des tags, lue dans le CSS avant que GSAP y touche.
  const rotations = tags.map((tag) => parseFloat(getComputedStyle(tag).getPropertyValue("--tag-rotate")));

  tl.fromTo(stage.querySelector(".approach__veil"), { opacity: 0 }, { opacity: 1, duration: T.veilDur, ease: "none" }, T.veil);

  // Texte : les lignes montent une à une sous leur masque, les mots passent de 25 % à 100 % d'opacité (effet de lecture).
  // Les tags sont exclus de la lecture : leur « mot » (le tag et son point) ne s'atténue pas, le fond du tag se remplit à part.
  const split = SplitText.create(text, { type: "lines,words", mask: "lines", linesClass: "split-line", ignore: ".tag", aria: "none" });
  const words = split.words.filter((word) => !word.querySelector(".tag"));
  tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, T.text)
    .fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power3.out", stagger: 0.1 }, T.text + 0.05)
    .fromTo(words, { opacity: 0.25 }, { opacity: 1, duration: 0.25, ease: "none", stagger: 0.009 }, T.text + 0.15);

  // Title tags : le fond (pilule) se remplit de gauche à droite en s'inclinant, puis le texte de la pilule apparaît.
  tags.forEach((tag, i) => {
    const at = T.text + 0.25 + i * 0.22;
    tl.fromTo(tag, { rotation: 0 }, { rotation: rotations[i], duration: 0.22, ease: "power3.out" }, at);
    // Le point collé au tag fait partie de son « mot » : il apparaît avec le fond, pas avant.
    tl.fromTo(split.words.find((word) => word.contains(tag)), { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, at);
    fillTag(tl, tag, at, { duration: 0.22 });
  });

  // Superposition : la section est épinglée en arrière-plan, les services remontent par-dessus (marge négative en CSS).
  const overlap = T.total - T.overlap;
  // Opacité seule : le texte reste dans l'arbre d'accessibilité une fois recouvert par les services.
  tl.to(content, { opacity: 0, scale: 0.92, duration: T.overlap * 0.8, ease: "power1.in" }, overlap)
    .fromTo(stage.querySelector(".approach__shade"), { opacity: 0 }, { opacity: 1, duration: T.overlap, ease: "none" }, overlap)
    .to(stage.querySelector(".approach__media img"), { yPercent: -8, duration: T.overlap, ease: "none" }, overlap);
}
