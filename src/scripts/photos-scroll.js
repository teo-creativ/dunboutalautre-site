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

export function addPhotos(tl, { stage, T }) {
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

  // Photo large : elle apparaît par le bas sous la forme d'une carte, puis grandit. Le cadre (clip-path) et l'image
  // (échelle et position) grandissent ensemble, donc la carte montre d'abord la photo entière, comme sur les frames 07 à 10.
  const media = stage.querySelector(".approach__media");
  const photo = media.querySelector("img");
  const pose = () => {
    const w = stage.clientWidth;
    const h = height();
    const cardW = w * T.card.width;
    const cardH = cardW / T.card.ratio;
    const top = h * T.card.top;
    return { w, h, cardW, cardH, top, side: (w - cardW) / 2 };
  };
  // Les deux extrémités du clip-path sont écrites en toutes lettres (4 insets et un rayon) : à partir de la valeur relue dans
  // le style, que Chrome abrège (« inset(a b c round r) »), GSAP associait le rayon à l'inset gauche et le perdait en route.
  // Le rayon de 14 px (--radius-photo) tient jusqu'au plein écran, il ne tombe à 0 qu'une fois l'écran rempli.
  const cardClip = () => {
    const p = pose();
    return `inset(${p.top}px ${p.side}px ${p.h - p.top - p.cardH}px ${p.side}px round 14px)`;
  };
  const fullRounded = "inset(0px 0px 0px 0px round 14px)";
  const fullSquare = "inset(0px 0px 0px 0px round 0px)";
  const SQUARE = 0.04; // les derniers pixels de scroll de l'agrandissement : les coins de l'écran passent de 14 px à 0

  tl.set(media, { clipPath: cardClip }, 0)
    .set(photo, { scale: () => pose().cardW / pose().w, y: () => pose().top + pose().cardH / 2 - pose().h / 2 }, 0)
    .fromTo(media, { y: () => pose().h - pose().top + 24 }, { y: 0, duration: T.appearDur, ease: "power2.out" }, T.appear)
    .fromTo(media, { clipPath: cardClip }, { clipPath: fullRounded, duration: T.growDur, ease: "power2.inOut" }, T.grow)
    .fromTo(media, { clipPath: fullRounded }, { clipPath: fullSquare, duration: SQUARE, ease: "none" }, T.grow + T.growDur)
    .to(photo, { scale: 1, y: 0, duration: T.growDur, ease: "power2.inOut" }, T.grow);

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
