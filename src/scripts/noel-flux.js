// Flux vertical (retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md §4 et §5) : un cercle orange grandit au centre de l'écran et recouvre
// « Notre volonté » (écho du cercle de l'accueil, hero-circle.js). Sur l'orange plein, le titre et le CTA apparaissent au centre puis
// restent fixes, toujours au-dessus des photos, qui montent du bas à des vitesses différentes (profondeur) et sortent par le haut.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";
import { revealPhotos } from "./bureaux-scene.js";
import { fillTag } from "./tag.js";

const DOT = 0.02; // échelle de départ du cercle : un point de 38 px
const VEIL = 0.15; // durée d'apparition du voile sous le logo, en unités de timeline

export function addFlux(tl, { stage, T }) {
  const layer = stage.querySelector(".flux");
  const circle = layer.querySelector(".flux__circle");
  const veil = layer.querySelector(".flux__top");
  const title = layer.querySelector(".flux__title");
  const tag = title.querySelector(".tag");
  const cta = layer.querySelector(".flux__content .cta");
  const height = () => stage.clientHeight;

  // ---------- Cercle : de la taille d'un point à tout l'écran ----------
  // Centré sur l'écran comme le cercle de l'accueil (50 %, 50 %, frame 02). À l'échelle 1 il couvre juste les coins (noel-stage.css) :
  // l'orange est plein quand le cercle l'est, sans scroll perdu. Invisible (CSS) tant que sa phase n'a pas commencé.
  tl.set(circle, { xPercent: -50, yPercent: -50 }, 0)
    .set(circle, { visibility: "visible" }, T.circle)
    .fromTo(circle, { scale: DOT }, { scale: 1, duration: T.circleDur, ease: "none" }, T.circle)
    // Voile orange sous le logo : une photo qui monte sous le logo reste lisible. Il n'apparaît qu'une fois l'orange plein.
    .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: VEIL, ease: "none" }, T.circle + T.circleDur - VEIL);

  // ---------- Titre et CTA : mots depuis un masque, tag qui se remplit, CTA qui monte ----------
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });
  tl.fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 0.35, ease: "power3.out", stagger: 0.06 }, T.title);
  fillTag(tl, tag, T.title + 0.4, { duration: 0.3 });
  // Opacité seule : le CTA reste atteignable au clavier avant son entrée (noel-stage.js amène alors le scroll jusqu'à lui). Sans clic
  // possible tant qu'il est invisible : la couche qui le porte passe sinon par-dessus le CTA du hero.
  tl.fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, T.cta).set(cta, { pointerEvents: "auto" }, T.cta);

  // ---------- Photos : elles montent pendant toute la fenêtre, chacune à sa vitesse ----------
  // Montée linéaire (y) sur toute la fenêtre. Au départ, chaque photo est sous le bord bas de l'écran, plus ou moins loin (--y, en svh) :
  // elle entre dans l'écran quand sa dérive l'y amène, les premières tôt, les autres plus tard (le quinconce des frames 04 à 06).
  // Vitesse en svh par écran de scroll (data-speed) : une photo de 100 suit la page.
  // Sous 900 px la vitesse de la photo est celle de sa version mobile (data-speed-mobile, V8 G5 : une photo posée sous une autre ne monte jamais plus vite qu'elle, components/gallery.js).
  const narrow = window.matchMedia("(max-width: 900px)").matches;
  const photos = [...layer.querySelectorAll(".flux__photo")].filter((li) => li.offsetHeight > 0); // sous 900 px, certaines photos sont masquées
  photos.forEach((li) => {
    const speed = Number((narrow && li.dataset.speedMobile) || li.dataset.speed);
    const distance = () => (speed / 100) * T.photosDur * height();
    tl.fromTo(li, { y: 0 }, { y: () => -distance(), duration: T.photosDur, ease: "none" }, T.photos);
  });
  // V8 (reveal-on-enter, partie B de retours-v8/docs/02) : chaque photo se révèle par clip-path de bas en haut, son image revenant de 1,15 à 1, pendant qu'elle entre dans l'écran (sa
  // position réelle est lue à chaque image : le transform de sa montée reste libre). Renvoie la fonction qui défait tout.
  return revealPhotos(layer, photos, { always: true });
}
