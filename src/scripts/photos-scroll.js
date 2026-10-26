// Section orange (ANIMATIONS.md §4 et §5) : les photos traversent l'écran en perspective, puis la photo large grandit
// comme une carte jusqu'à devenir le fond de la section. Le voile et le texte qui suivent sont dans approach.js.
// Positions et durées sont exprimées en unités de la timeline maîtresse (1 unité = 1 écran de scroll).
import { SplitText } from "./core.js";

// Titre et CTA, révélés juste après la fin du cercle, comme dans l'intro.
export function addOrangeText(tl, { stage, T }) {
  const title = stage.querySelector(".experience__title");
  const tag = title.querySelector(".tag");
  const cta = stage.querySelector(".experience__content .cta");
  const split = SplitText.create(title, { type: "words", mask: "words", ignore: ".tag", aria: "none" });

  tl.fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: T.titleDur, ease: "power3.out", stagger: 0.04 }, T.title)
    .fromTo(tag, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.25, ease: "power3.out" }, T.title + 0.2)
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
  T.cards.forEach(({ index, rest, duration, z, rx, rot, dx }) => {
    const card = cards[index];
    const k = PERSPECTIVE / (PERSPECTIVE - z); // facteur de projection
    const scale = 1 + (1 / k - 1) * 0.5; // on compense la moitié du recul : la profondeur se voit sans réduire trop les cartes
    const geometry = () => {
      const h = height();
      const cx = stage.clientWidth / 2;
      const cy = h / 2;
      const xc = card.offsetLeft + card.offsetWidth / 2;
      const yc = card.offsetTop + card.offsetHeight / 2;
      const half = (card.offsetHeight * k * scale) / 2;
      const from = h + MARGIN + half; // centre à l'écran, juste sous le bord bas
      const to = -MARGIN - half; // centre à l'écran, juste au-dessus du bord haut
      const toLayout = (screenY) => cy + (screenY - cy) / k - yc;
      return { x: cx + (xc - cx) / k - xc, y0: toLayout(from), y1: toLayout(to), rest: (from - yc) / (from - to) };
    };
    tl.fromTo(
      card,
      { y: () => geometry().y0, x: () => geometry().x - dx / 2, z, scale, rotationX: rx, rotation: rot },
      { y: () => geometry().y1, x: () => geometry().x + dx / 2, duration, ease: "none" },
      rest - geometry().rest * duration,
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
  const cardClip = () => {
    const p = pose();
    return `inset(${p.top}px ${p.side}px ${p.h - p.top - p.cardH}px ${p.side}px round 14px)`;
  };
  const fullClip = "inset(0px 0px 0px 0px round 0px)";

  tl.set(media, { clipPath: cardClip }, 0)
    .set(photo, { scale: () => pose().cardW / pose().w, y: () => pose().top + pose().cardH / 2 - pose().h / 2 }, 0)
    .fromTo(media, { y: () => pose().h - pose().top + 24 }, { y: 0, duration: T.appearDur, ease: "power2.out" }, T.appear)
    .to(media, { clipPath: fullClip, duration: T.growDur, ease: "power2.inOut" }, T.grow)
    .to(photo, { scale: 1, y: 0, duration: T.growDur, ease: "power2.inOut" }, T.grow);

  // Pendant l'agrandissement, le titre et le CTA s'effacent en place : la photo passe devant eux. Opacité seule pour le titre
  // (il reste dans l'arbre d'accessibilité), le CTA est masqué à la fin du fondu.
  const content = stage.querySelector(".experience__content");
  tl.to(content, { opacity: 0, duration: T.contentFadeDur, ease: "power1.in" }, T.contentFade).set(
    content.querySelector(".cta"),
    { visibility: "hidden" },
    T.contentFade + T.contentFadeDur,
  );
}
