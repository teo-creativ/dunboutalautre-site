// Nos univers, arrivée (retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md §6) : la section crème suit la scène épinglée dans le flux de la page,
// remontée d'un écran par une marge négative (noel-stage.css) : pendant le dernier écran de scroll de la scène, c'est le scroll lui-même
// qui la fait monter du bas, par-dessus l'orange. Rien n'est animé pour son déplacement. Ici : le titre orange s'efface pendant qu'elle
// monte, puis, sur ordinateur, son contenu se révèle (label, titre par mots avec son tag, liste en cascade) à l'entrée dans l'écran,
// réversible. Sous 900 px, universes.js révèle déjà chaque bloc à son entrée dans l'écran.
// Les interactions (survol, focus, tap) sont dans universes.js.
import { gsap, ScrollTrigger, SplitText } from "./core.js";
import { fillTag, hideTags } from "./tag.js";

export function addUnivers(stage, { reveal }) {
  const layer = document.getElementById("univers");
  if (!layer) return;

  // Le titre orange et le CTA s'effacent de l'arrivée de la crème (son bord haut au bas de l'écran) jusqu'à 30 % de la hauteur : ils
  // ne restent jamais visibles sous elle. refreshPriority : calculé après le pin de la scène, dont l'espacement décale la section.
  gsap.to(stage.querySelector(".flux__content"), {
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: layer, start: "top bottom", end: "top 30%", scrub: true, refreshPriority: -1 },
  });
  if (!reveal) return;

  const label = layer.querySelector(".univers__body > .label");
  const title = layer.querySelector(".univers__title");
  const tags = title.querySelectorAll(".tag");
  const items = layer.querySelectorAll(".universe");

  // Opacité seule pour la liste : un bouton pas encore révélé reste dans l'arbre d'accessibilité et atteignable au clavier.
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  gsap.set(label, { opacity: 0, y: 12 });
  gsap.set(split.words, { yPercent: 110 });
  hideTags(tags);
  gsap.set(items, { opacity: 0, y: 16 });
  const entry = gsap.timeline({ paused: true });
  entry.to(label, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0)
    .to(split.words, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06 }, 0.1)
    .to(items, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out", stagger: 0.1 }, 0.4);
  tags.forEach((tag, i) => fillTag(entry, tag, 0.55 + i * 0.12));
  // end: "max" : si on saute au-delà de l'arrivée, la révélation est quand même jouée.
  ScrollTrigger.create({
    trigger: layer,
    start: "top 85%",
    end: "max",
    refreshPriority: -1,
    onToggle: (self) => (self.isActive ? entry.play() : entry.reverse()),
  });
}
