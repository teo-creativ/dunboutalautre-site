// Section orange (ANIMATIONS.md §4 et §5) : les photos traversent l'écran en perspective, puis la photo large grandit
// comme une carte jusqu'à devenir le fond de la section. Le voile et le texte qui suivent sont dans approach.js.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";
import { fillTag } from "./tag.js";

// Titre et CTA, révélés juste après la fin du cercle, comme dans l'intro.
export function addOrangeText(tl, { stage, T }) {
  const title = stage.querySelector(".experience__title");
  const tag = title.querySelector(".tag");
  const cta = stage.querySelector(".experience__content .cta");
  const split = SplitText.create(title, { type: "words", mask: "words", wordsClass: "split-word", ignore: ".tag", aria: "none" });

  tl.fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: T.titleDur, ease: "power3.out", stagger: 0.04 }, T.title);
  fillTag(tl, tag, T.title + 0.2, { duration: 0.25 });
  tl
    // Opacité seule : le CTA reste atteignable au clavier avant son entrée (stage.js amène alors le scroll jusqu'à lui).
    // Sans clic possible tant qu'il est invisible : il passerait sinon par-dessus le CTA du hero.
    .fromTo(cta, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.25, ease: "power3.out" }, T.cta)
    .set(cta, { pointerEvents: "auto" }, T.cta);
}

const PERSPECTIVE = 1200; // même valeur que .experience__photos en CSS

export function addPhotos(tl, { stage, T, refreshers, cleanups }) {
  const height = () => stage.clientHeight;

  // Cartes : chacune a sa vitesse et sa profondeur. Elle part sous l'écran et sort par le haut, en ligne droite : le
  // lissage vient du scrub. dx est le micro-décalage horizontal pendant la traversée.
  // La perspective rapproche du centre une carte reculée (z < 0) : les trajectoires sont donc calculées en coordonnées
  // d'écran, puis converties, pour que la carte entre hors champ et passe par sa pose CSS (frame 04) à l'instant `rest`.
  const cards = stage.querySelectorAll(".float-photo");
  const MARGIN = 40;
  // Retours V8 (G5) : aucune carte n'en recouvre une autre, au chargement comme au scroll. Deux cartes de la même colonne forment une pile : la seconde porte `under` (l'indice de la carte du dessus). Une
  // pile monte D'UN BLOC : toutes ses cartes gardent entre elles l'écart de leur pose de repos (frame 04, experience.css : une hauteur de carte plus 2,4 vw ou 6 vw), au chargement sous l'écran, pendant la
  // montée et à la sortie, à la vitesse de la carte du dessous (sa trajectoire est celle d'avant, seulement prolongée ; celle du dessus ralentit de 11 % environ) et avec son `rest` : l'écart ne change jamais, quelle que soit la taille de l'écran. Les
  // cartes d'une pile gardent chacune leur profondeur (z), leur inclinaison et leur dérive. Une carte seule est inchangée.
  const byIndex = new Map(T.cards.map((c) => [c.index, c]));
  const topOf = (i) => (byIndex.get(i).under === undefined ? i : topOf(byIndex.get(i).under)); // la carte du dessus de la pile
  const centerY = (i) => cards[i].offsetTop + cards[i].offsetHeight / 2; // centre de la carte dans sa pose de repos
  const pileOf = (i) => T.cards.map((c) => c.index).filter((j) => topOf(j) === topOf(i));
  const bottomOf = (i) => pileOf(i).reduce((a, b) => (centerY(b) > centerY(a) ? b : a)); // la carte du dessous de la pile
  const projection = (z) => {
    const k = PERSPECTIVE / (PERSPECTIVE - z); // facteur de projection
    return { k, scale: 1 + (1 / k - 1) * 0.5 }; // on compense la moitié du recul : la profondeur se voit sans réduire trop les cartes
  };
  const halfOf = (i) => (cards[i].offsetHeight * projection(byIndex.get(i).z).k * projection(byIndex.get(i).z).scale) / 2; // demi-hauteur à l'écran
  const geometryOf = (i) => {
    const { k } = projection(byIndex.get(i).z);
    const h = height();
    const cx = stage.clientWidth / 2;
    const cy = h / 2;
    const top = topOf(i);
    const bottom = bottomOf(i);
    const xc = cards[i].offsetLeft + cards[i].offsetWidth / 2;
    const yc = centerY(i);
    const fromTop = h + MARGIN + halfOf(top); // centre de la carte du dessus, juste sous le bord bas
    const toBottom = -MARGIN - halfOf(bottom); // centre de la carte du dessous, juste au-dessus du bord haut
    const from = fromTop + (yc - centerY(top)); // la carte garde l'écart de sa pose de repos avec celle du dessus...
    const to = toBottom + (yc - centerY(bottom)); // ... et avec celle du dessous
    const path = fromTop - toBottom - centerY(top) + centerY(bottom); // trajet commun à toute la pile
    const toLayout = (screenY) => cy + (screenY - cy) / k - yc;
    return { x: cx + (xc - cx) / k - xc, y0: toLayout(from), y1: toLayout(to), rest: (from - yc) / path, path };
  };
  T.cards.forEach(({ index, z, rx, rot, dx }) => {
    const { scale } = projection(z);
    const lead = byIndex.get(bottomOf(index)); // `rest` et `duration` de la pile : ceux de la carte du dessous (la seule visible aux repères de la frame 04 et du scroll à 20 %)
    const g = geometryOf(index);
    const length = (lead.duration * g.path) / (height() + 2 * MARGIN + 2 * halfOf(bottomOf(index))); // même vitesse que la carte du dessous seule : sa trajectoire est prolongée, pas accélérée
    tl.fromTo(
      cards[index],
      { y: () => geometryOf(index).y0, x: () => geometryOf(index).x - dx / 2, z, scale, rotationX: rx, rotation: rot },
      { y: () => geometryOf(index).y1, x: () => geometryOf(index).x + dx / 2, duration: length, ease: "none" },
      lead.rest - g.rest * length,
    );
  });

  // Photo large (retours V8) : elle apparaît par le bas sous la forme d'une carte (la même que sur les frames 07 à 10 : 38 % de la largeur, rapport 1,81, posée à 70 % de la hauteur), puis
  // s'ouvre jusqu'au plein écran. Le cadre (clip-path de .approach__media, en pixels d'écran) et la photo (le cadre .approach__frame, dont l'échelle et le décalage sont calculés à chaque image)
  // grandissent ensemble, dans l'espace de la photo large (home-photo-5-extended, 2709 x 1497) : la fenêtre part d'une bande du portrait (home-photo-5, qui est un recadrage exact de la photo
  // large, x 0 à 1000 et y 62 à 1332) et s'ouvre sur toute la photo, cadrée « cover » à l'écran. La lavande reste donc au même endroit visuel du début à la fin : la photo large est dessous en
  // permanence, le portrait par-dessus (mêmes pixels) tant que la fenêtre est petite, puis il s'efface : aucun saut de recadrage. L'échelle ne varie que de 0,96 à 1 (à 1728 x 1030) : c'est la fenêtre
  // qui s'ouvre, la photo ne zoome pas. Coins : le clip-path est posé sur le média, qui n'est pas mis à l'échelle : son rayon est en pixels d'écran, sans compensation. Il part de 24 px, passe
  // à 30 px au plein écran (jamais à 0 pendant la croissance, `power2.inOut` comme la fenêtre), et ne se resserre vers 0 que quand les services recouvrent la photo (fin de la scène).
  const media = stage.querySelector(".approach__media");
  const frame = media.querySelector(".approach__frame");
  const cardPhoto = frame.querySelector(".approach__photo--card");
  const fullPhoto = frame.querySelector(".approach__photo--full");
  const WIDE = { w: 2709, h: 1497 }; // photo large
  const PORTRAIT = { x: 0, y: 62, w: 1000, h: 1270 }; // place du portrait dans la photo large (recalage au pixel, écart de 1,3 / 255)
  const FOCAL = 0.5; // la bande du portrait montrée par la carte est centrée à cette part de sa hauteur (la hampe de la lavande)
  const R0 = 24; // rayon au départ, en px
  const R1 = 30; // rayon des angles de l'écran au plein écran, en px (28 à 32)
  const state = { p: 0, q: 0 }; // p : ouverture de la fenêtre (0 carte, 1 plein écran), q : resserrement des coins
  const lerp = (a, b, t) => a + (b - a) * t;
  let size = ""; // taille du cadre déjà posée
  const render = () => {
    const w = stage.clientWidth;
    const h = height();
    const c = Math.max(w / WIDE.w, h / WIDE.h); // échelle « cover » de la photo large à l'écran
    const fw = WIDE.w * c;
    const fh = WIDE.h * c;
    const fx = (w - fw) / 2;
    const fy = (h - fh) / 2;
    if (size !== `${fw}x${fh}x${fx}x${fy}`) {
      size = `${fw}x${fh}x${fx}x${fy}`;
      Object.assign(frame.style, { width: `${fw}px`, height: `${fh}px`, left: `${fx}px`, top: `${fy}px` });
    }
    // Fenêtre sur l'écran : de la carte au plein écran.
    const cardW = w * T.card.width;
    const cardH = cardW / T.card.ratio;
    const screen = { x: lerp((w - cardW) / 2, 0, state.p), y: lerp(h * T.card.top, 0, state.p), w: lerp(cardW, w, state.p), h: lerp(cardH, h, state.p) };
    // Fenêtre dans le cadre (pixels du cadre à l'échelle 1) : de la bande du portrait à l'écran entier.
    const bandW = PORTRAIT.w * c;
    const bandH = bandW / T.card.ratio;
    const band = { x: PORTRAIT.x * c, y: PORTRAIT.y * c + (PORTRAIT.h * c - bandH) * FOCAL, w: bandW, h: bandH };
    const view = { x: lerp(band.x, -fx, state.p), y: lerp(band.y, -fy, state.p), w: lerp(band.w, w, state.p), h: lerp(band.h, h, state.p) };
    const s = screen.w / view.w; // échelle du cadre : la fenêtre du cadre remplit la fenêtre de l'écran
    const tx = screen.x - fx - s * view.x;
    const ty = screen.y + screen.h / 2 - fy - s * (view.y + view.h / 2);
    frame.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
    const radius = lerp(R0, R1, state.p) * (1 - state.q);
    // Quatre insets et un rayon écrits en toutes lettres (le bas de la carte est sous l'écran : son inset est négatif).
    media.style.clipPath = `inset(${screen.y}px ${w - screen.x - screen.w}px ${h - screen.y - screen.h}px ${screen.x}px round ${radius}px)`;
    // Le portrait (mêmes pixels que la photo large) n'est utile qu'au début, avant que la photo large soit chargée ; il s'efface à mi-chemin si elle est là.
    cardPhoto.style.opacity = state.p >= 0.5 && fullPhoto.complete && fullPhoto.naturalWidth > 0 ? "0" : "";
  };
  render();
  refreshers?.push(render); // recalculé à chaque refresh du ScrollTrigger (stage.js) : la hauteur de l'écran peut changer sans reconstruction
  cleanups?.push(() => {
    // Sans scène (mouvement réduit, écran étroit sans animation) : la photo large est un simple fond (approach.css).
    media.style.clipPath = "";
    frame.removeAttribute("style");
    cardPhoto.style.opacity = "";
  });

  tl.fromTo(media, { y: () => height() - height() * T.card.top + 24 }, { y: 0, duration: T.appearDur, ease: "power2.out" }, T.appear)
    .to(state, { p: 1, duration: T.growDur, ease: "power2.inOut", onUpdate: render }, T.grow)
    // Les angles ne se resserrent vers 0 que sur la seconde moitié de l'arrivée des services, quand ils recouvrent presque toute la photo.
    .to(state, { q: 1, duration: T.overlap * 0.45, ease: "power2.inOut", onUpdate: render }, T.total - T.overlap + T.overlap * 0.45);

  // Voile orange sous le logo : une photo qui sort par le haut ne passe plus sous un logo illisible. Il apparaît quand le cercle
  // a couvert l'écran, et la photo plein écran de « Notre approche » le recouvre ensuite (couche supérieure).
  tl.fromTo(stage.querySelector(".experience__top"), { opacity: 0 }, { opacity: 1, duration: 0.1, ease: "none" }, T.circle - 0.1);

  // Pendant l'agrandissement, le titre et le CTA s'effacent en place : la photo passe devant eux. Opacité seule pour le titre
  // (il reste dans l'arbre d'accessibilité), le CTA est masqué à la fin du fondu.
  const content = stage.querySelector(".experience__content");
  tl.to(content, { opacity: 0, duration: T.contentFadeDur, ease: "power1.in" }, T.contentFade).set(
    content.querySelector(".cta"),
    { visibility: "hidden" },
    T.contentFade + T.contentFadeDur,
  );
}
