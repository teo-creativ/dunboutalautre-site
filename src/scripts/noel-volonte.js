// « Notre volonté » (retours-v2/docs/05-NOEL-ANIMATIONS.md §B et §C, retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md §2) : la photo plein écran
// monte sur le hero épinglé, qui s'estompe ; le texte se révèle ligne à ligne avec ses title tags, puis reste en place : c'est le cercle
// orange (noel-flux.js) qui le recouvre. Sous 900 px le hero est hors de la scène : la photo est déjà en place, seul le texte se révèle.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";
import { fillTag } from "./tag.js";

export function addVolonte(tl, { stage, T }) {
  const hero = stage.querySelector(".hero");
  const layer = stage.querySelector(".volonte");
  const photo = layer.querySelector(".volonte__photo");
  const veil = layer.querySelector(".volonte__veil");
  const label = layer.querySelector(".label");
  const text = layer.querySelector(".volonte__text");
  const tags = [...text.querySelectorAll(".tag")];
  const rotations = tags.map((tag) => parseFloat(getComputedStyle(tag).getPropertyValue("--tag-rotate")));

  // ---------- B : la photo monte sur le hero (frames 02 et 03) ----------
  // Le hero reste épinglé, son contenu s'estompe et monte un peu. Dès que la photo couvre l'écran, le hero est masqué.
  // Opacité seule pour le contenu (le h1 reste dans l'arbre d'accessibilité), le CTA, qu'on pourrait encore focaliser ou cliquer,
  // disparaît pour de bon.
  if (hero) {
    const heroContent = hero.querySelector(".hero__inner");
    tl.fromTo(layer, { yPercent: 100 }, { yPercent: 0, duration: T.rise, ease: "none" }, 0)
      .fromTo(photo, { scale: 1.12 }, { scale: 1, duration: T.rise, ease: "none" }, 0)
      .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: T.rise, ease: "none" }, 0)
      .to(heroContent, { opacity: 0, y: -40, scale: 0.96, duration: T.heroFade, ease: "power1.out" }, 0)
      .set(heroContent.querySelector(".cta"), { visibility: "hidden" }, T.heroFade)
      .set(hero, { opacity: 0 }, T.rise);
  }

  // ---------- C : le texte ----------
  const split = SplitText.create(text, { type: "lines,words", mask: "lines", linesClass: "split-line", ignore: ".tag", aria: "none" });
  tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, T.text)
    .fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power3.out", stagger: 0.07 }, T.text + 0.05);

  // Les tags se remplissent de gauche à droite en pilule, avec une rotation d'entrée de ±4° vers ±2°. Le mot du tag (le tag et son
  // ponctuation collée) apparaît avec le fond, pas avant.
  tags.forEach((tag, i) => {
    const at = T.text + 0.3 + i * 0.2;
    tl.fromTo(tag, { rotation: rotations[i] * 2 }, { rotation: rotations[i], duration: 0.25, ease: "power3.out" }, at);
    // Seul un tag suivi directement d'une ponctuation est enveloppé dans un « mot » avec elle.
    const word = split.words.find((w) => w.contains(tag));
    if (word) tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, at);
    fillTag(tl, tag, at, { duration: 0.25 });
  });
}
