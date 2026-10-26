// « Notre volonté » (retours-v2/docs/05-NOEL-ANIMATIONS.md §B à §D) : la photo plein écran monte sur le hero épinglé, qui s'estompe ;
// le texte se révèle ligne à ligne avec ses title tags, tient le temps de la lecture, puis disparaît pendant que la photo
// rétrécit et glisse vers le coin bas gauche, où elle devient la première photo du flux (noel-flux.js la fait ensuite défiler).
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";
import { fillTag } from "./tag.js";

// Frame 06 (mesurée) : la photo occupe 77 % de la largeur et 86 % de la hauteur, collée à gauche, marges haute et basse de 7 %.
const REDUCED_W = 0.77;
const REDUCED_H = 0.86;
const RADIUS = 14; // --radius-photo, pendant toute la réduction

const inset = (top, right, bottom, left, radius) => `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;

export function addVolonte(tl, { stage, T }) {
  const hero = stage.querySelector(".hero");
  const heroContent = hero.querySelector(".hero__inner");
  const layer = stage.querySelector(".volonte");
  const media = layer.querySelector(".volonte__media");
  const inner = layer.querySelector(".volonte__inner");
  const photo = inner.querySelector("img");
  const veil = inner.querySelector(".volonte__veil");
  const label = layer.querySelector(".label");
  const text = layer.querySelector(".volonte__text");
  const tags = [...text.querySelectorAll(".tag")];
  const thumb = stage.querySelector(".flux__photo--thumb");
  const rotations = tags.map((tag) => parseFloat(getComputedStyle(tag).getPropertyValue("--tag-rotate")));

  // ---------- B : la photo monte sur le hero (frames 02 et 03) ----------
  // Le hero reste épinglé, son contenu s'estompe et monte un peu. Dès que la photo couvre l'écran, le hero est masqué : c'est le
  // fond orange du flux, dessous, qui apparaît quand la photo rétrécit. Opacité seule pour le contenu (le h1 reste dans l'arbre
  // d'accessibilité), le CTA, qu'on pourrait encore focaliser ou cliquer, disparaît pour de bon.
  tl.fromTo(layer, { yPercent: 100 }, { yPercent: 0, duration: T.rise, ease: "none" }, 0)
    .fromTo(photo, { scale: 1.12 }, { scale: 1, duration: T.rise, ease: "none" }, 0)
    .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: T.rise, ease: "none" }, 0)
    .to(heroContent, { opacity: 0, y: -40, scale: 0.96, duration: T.heroFade, ease: "power1.out" }, 0)
    .set(heroContent.querySelector(".cta"), { visibility: "hidden" }, T.heroFade)
    .set(hero, { opacity: 0 }, T.rise);

  // ---------- C : le texte (frames 04 et 05) ----------
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

  // Disparition progressive au scroll : les lignes montent de 30 px en s'effaçant, avec un léger décalage de ligne à ligne.
  tl.to([label, ...split.lines], { opacity: 0, y: -30, duration: 0.3, ease: "power1.in", stagger: 0.05 }, T.textOut);

  // ---------- D : la photo rétrécit et glisse vers le coin bas gauche (frames 06 et 07) ----------
  // Le cadre (clip-path) et son contenu (échelle et position de l'intérieur) bougent ensemble : on voit la photo entière rétrécir.
  // Pose 1 (frame 06) : 77 % de la largeur, collée à gauche, centrée en hauteur. Pose 2 (frame 07) : la vignette du flux, dont la
  // position est portée par l'élément masqué .flux__photo--thumb (coupée par le bord gauche et le bord bas). Les coins sont
  // arrondis de 14 px dès le début de la réduction. Les deux extrémités de chaque clip-path sont écrites en toutes lettres
  // (4 insets et un rayon) : GSAP associe sinon mal le rayon à une valeur abrégée par Chrome.
  const geo = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const cs = getComputedStyle(thumb);
    const v = (name) => parseFloat(cs.getPropertyValue(name));
    return { w, h, left: (v("--x") / 100) * w, top: (v("--y") / 100) * h, width: (v("--w") / 100) * w, height: (v("--h") / 100) * h };
  };
  const full = () => inset(0, 0, 0, 0, 0);
  const fullRounded = () => inset(0, 0, 0, 0, RADIUS);
  const pose1 = () => {
    const { w, h } = geo();
    const top = (h - h * REDUCED_H) / 2;
    return inset(top, w - w * REDUCED_W, top, 0, RADIUS);
  };
  const pose2 = () => {
    const g = geo();
    return inset(g.top, g.w - (g.left + g.width), g.h - (g.top + g.height), g.left, RADIUS);
  };
  const top1 = () => (geo().h - geo().h * REDUCED_H) / 2;
  const half = T.shrinkDur / 2;

  // Les coins passent de 0 à 14 px juste avant la réduction (0,06 écran), puis restent à 14 px : jamais de coin carré une fois la photo
  // en mouvement, jamais de rayon qui se « construit » pendant la réduction.
  tl.fromTo(media, { clipPath: full }, { clipPath: fullRounded, duration: 0.06, ease: "none" }, T.shrink - 0.06)
    .fromTo(media, { clipPath: fullRounded }, { clipPath: pose1, duration: half, ease: "power2.inOut", immediateRender: false }, T.shrink)
    // L'image remplit la hauteur du cadre (échelle de 0,86) : sa droite est rognée de 10 %, comme la photo cover de la frame 06.
    .fromTo(inner, { scale: 1, x: 0, y: 0 }, { scale: REDUCED_H, x: 0, y: top1, duration: half, ease: "power2.inOut" }, T.shrink)
    .fromTo(
      media,
      { clipPath: pose1 },
      { clipPath: pose2, duration: half, ease: "power2.inOut", immediateRender: false },
      T.shrink + half,
    )
    .fromTo(
      inner,
      { scale: REDUCED_H, x: 0, y: top1 },
      {
        scale: () => geo().height / geo().h, // la photo entière a la hauteur de la vignette
        x: () => geo().left,
        y: () => geo().top,
        duration: half,
        ease: "power2.inOut",
        immediateRender: false,
      },
      T.shrink + half,
    )
    // Le voile s'efface pendant la réduction : la vignette est à pleine lumière (frames 06 et 07).
    .to(veil, { opacity: 0, duration: 0.4, ease: "none" }, T.shrink);
}
