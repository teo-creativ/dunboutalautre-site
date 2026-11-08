// Animations de la fiche projet V4 (retours-v4/docs/02-CASE-STUDY.md) : le PDF montre peu d'états, elles sont proposées dans l'esprit des autres
// pages (révélations douces, masques de ligne, parallaxe légère). Un seul mouvement par élément, jamais de rebond, une seule fois (once) sauf
// les parallaxes, scrubées. Réutilise : intro.js (titre et header), tag.js (fillTag), SplitText en mode autoSplit (les lignes se recoupent
// seules au redimensionnement et à l'arrivée des polices) et reveal.js (titre et cartes de « Découvrez nos projets »).
// Mouvement réduit : rien n'est caché ni animé, la page est lisible telle quelle (fiche.css). Sous 900 px : parallaxe réduite de moitié, les
// photos de la galerie se révèlent chacune à leur tour, sans décalage entre elles.
import { afterIntro } from "./after-intro.js";
import { gsap, ScrollTrigger, SplitText } from "./core.js";
import { fillTag } from "./tag.js";

const RADIUS = 14; // --radius-photo
const HIDDEN = `inset(100% 0% 0% 0% round ${RADIUS}px)`; // le cadre est entièrement rogné par le bas
const SHOWN = `inset(0% 0% 0% 0% round ${RADIUS}px)`;
const START = "top 85%"; // une révélation part quand le haut du bloc atteint 85 % de la hauteur de l'écran

// Révélation d'une photo : le cadre se découvre du bas vers le haut (clip-path) pendant que l'image, un peu agrandie, se pose (scale).
const reveal = (figure, { duration = 1.2 } = {}) => {
  const frame = figure.querySelector(".fphoto__frame");
  const image = figure.querySelector(".fphoto__img");
  return gsap
    .timeline({ paused: true })
    .fromTo(frame, { clipPath: HIDDEN }, { clipPath: SHOWN, duration, ease: "expo.out" }, 0)
    .fromTo(image, { scale: 1.15 }, { scale: 1, duration: duration * 1.2, ease: "expo.out" }, 0);
};

// Parallaxe : l'image (115 % du cadre, fiche.css) glisse de -amplitude à +amplitude de sa hauteur pendant que le cadre traverse l'écran. Avec
// 7,5 % de marge de chaque côté, une amplitude de 6 % ne laisse jamais voir de vide.
const parallax = (figure, amplitude, direction = 1) =>
  gsap.fromTo(
    figure.querySelector(".fphoto__img"),
    { yPercent: -amplitude * direction },
    {
      yPercent: amplitude * direction,
      ease: "none",
      scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true },
    },
  );

// Ce qui est déjà à l'écran à l'ouverture (sur mobile, le bloc d'intro est à 66 % de la hauteur) attend la fin de la séquence d'en-tête, au lieu
// de jouer en même temps qu'elle : la porte s'ouvre 2,5 s après le début de l'intro, ou dès le premier scroll (un lecteur qui descend n'attend pas).
const gate = { open: false, queue: [] };
const openGate = () => {
  if (gate.open) return;
  gate.open = true;
  gate.queue.splice(0).forEach((fn) => fn());
};
const whenReady = (fn) => (gate.open ? fn() : gate.queue.push(fn));

// Photo qui se révèle à son entrée dans l'écran, puis parallaxe.
const photo = (figure, { amplitude, direction, duration } = {}) => {
  const tl = reveal(figure, { duration });
  ScrollTrigger.create({ trigger: figure, start: START, once: true, onEnter: () => whenReady(() => tl.play()) });
  parallax(figure, amplitude, direction);
};

// Bloc de texte (intro, défi) : la pastille d'abord, puis le titre mot à mot sous masque, puis les paragraphes ligne par ligne, et les mots
// clés passent à l'orange en dernier. Les pièces sont créées en pause, un seul déclencheur les joue ensemble (leurs retards les enchaînent) ;
// autoSplit recoupe le texte si la largeur ou les polices changent, en recréant l'animation là où elle en était, d'où `parts`.
const textBlock = (block) => {
  const title = block.querySelector(".ftext__title");
  const tag = title.querySelector(".tag");
  const parts = {}; // animations courantes : autoSplit remplace celle d'un texte recoupé
  let fired = false; // le déclencheur est parti : une animation créée ensuite (polices arrivées après coup) se joue aussitôt
  const start = (animation) => animation && (fired ? animation.play() : null);

  // 1. Pastille : elle se remplit de gauche à droite (scale de 0,92 vers 1, sans rotation), comme partout sur le site.
  const pill = gsap.timeline({ paused: true });
  pill.fromTo(tag, { scale: 0.92 }, { scale: 1, duration: 0.7, ease: "power3.out" }, 0);
  fillTag(pill, tag, 0, { duration: 0.7 });

  // 2. Titre : les mots montent depuis leur masque ; la pastille, ignorée, n'est pas déplacée.
  SplitText.create(title, {
    type: "words",
    mask: "words",
    wordsClass: "split-word",
    ignore: ".tag",
    aria: "none",
    autoSplit: true,
    onSplit: (split) => {
      parts.title = gsap.fromTo(split.words, { yPercent: 110 }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.06, delay: 0.15, paused: true });
      start(parts.title);
      return parts.title;
    },
  });

  // 3. Paragraphes (lignes sous masque), puis 4. mots clés : du texte du paragraphe vers l'orange (0,5 s, une fois), à la fin de la montée.
  const paragraphs = [...block.querySelectorAll(".ftext__p")];
  SplitText.create(paragraphs, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    aria: "none",
    autoSplit: true,
    onSplit: (split) => {
      const keywords = split.elements.flatMap((element) => [...element.querySelectorAll(".kw")]);
      const lit = keywords.length ? getComputedStyle(keywords[0]).color : null;
      const plain = getComputedStyle(paragraphs[0]).color;
      const tl = gsap.timeline({ delay: 0.55, paused: true });
      tl.fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0);
      if (keywords.length) tl.fromTo(keywords, { color: plain }, { color: lit, duration: 0.5, ease: "power2.out", clearProps: "color" }, ">-0.2");
      parts.paragraphs = tl;
      start(tl);
      return tl;
    },
  });

  ScrollTrigger.create({
    trigger: block,
    start: START,
    once: true,
    onEnter: () =>
      whenReady(() => {
        fired = true;
        [pill, parts.title, parts.paragraphs].forEach((animation) => animation?.play());
      }),
  });
};

export function initFiche() {
  const head = document.querySelector(".fhead");
  if (!head) return;

  // La porte des blocs déjà visibles à l'ouverture : voir `gate`. Un scroll (y compris la reprise de position) l'ouvre aussitôt.
  afterIntro(() => gsap.delayedCall(2.5, openGate));
  window.addEventListener("scroll", openGate, { once: true, passive: true });

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      const mobile = Boolean(conditions.mobile);
      const half = mobile ? 0.5 : 1; // parallaxe réduite de moitié sous 900 px

      // ---------- En-tête (au chargement, après l'intro) ----------
      // Le titre est celui d'intro.js. Ici : fil d'Ariane en fondu, filet qui se dessine, infos en cascade, puis la photo héros se découvre,
      // juste après l'en-tête. Les états de départ sont aussi posés en CSS (html.js, fiche.css) : rien n'apparaît avant son tour.
      const crumbs = head.querySelector('[data-fiche="crumbs"]');
      const rule = head.querySelector('[data-fiche="rule"]');
      const infos = [...head.querySelectorAll('[data-fiche="info"]')];
      const hero = document.querySelector(".fphoto--hero");
      gsap.set(crumbs, { opacity: 0 });
      gsap.set(infos, { opacity: 0, y: 16 });
      gsap.set(rule, { scaleX: 0 });
      const heroFrame = hero?.querySelector(".fphoto__frame");
      const heroImage = hero?.querySelector(".fphoto__img");
      if (hero) {
        gsap.set(heroFrame, { clipPath: HIDDEN });
        gsap.set(heroImage, { scale: 1.15 });
      }

      afterIntro(() => {
        const tl = gsap.timeline();
        tl.to(crumbs, { opacity: 1, duration: 0.8, ease: "power2.out" }, 0)
          .to(rule, { scaleX: 1, duration: 1, ease: "power3.inOut" }, 0.9) // le titre monte pendant ce temps
          .to(infos, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 }, 1.3);
        if (hero) {
          // La photo se découvre juste après l'en-tête (la cascade des infos finit vers 2,4 s ; elle démarre à 2 s, en fin de cascade).
          tl.to(heroFrame, { clipPath: SHOWN, duration: 1.2, ease: "expo.out" }, 2.0).to(heroImage, { scale: 1, duration: 1.44, ease: "expo.out" }, 2.0);
        }
      });
      if (hero) parallax(hero, 6 * half);

      // ---------- Photos isolées, textes ----------
      document.querySelectorAll(".fphoto--solo:not(.fphoto--hero)").forEach((figure) => photo(figure, { amplitude: 6 * half }));
      document.querySelectorAll(".ftext").forEach(textBlock);

      // ---------- Galerie : deux photos (gauche puis droite, parallaxes opposées), puis la large, plus lente ----------
      const [left, right] = document.querySelectorAll(".fphoto--left, .fphoto--right");
      const wide = document.querySelector(".fphoto--wide");
      if (left && right) {
        if (mobile) {
          // Une colonne : chaque photo à son tour, sans décalage entre elles.
          photo(left, { amplitude: 4 * half, direction: 1 });
          photo(right, { amplitude: 4 * half, direction: -1 });
        } else {
          const tls = [reveal(left), reveal(right)];
          ScrollTrigger.create({
            trigger: left.parentElement,
            start: START,
            once: true,
            onEnter: () =>
              whenReady(() => {
                tls[0].play();
                gsap.delayedCall(0.15, () => tls[1].play()); // la gauche d'abord
              }),
          });
          parallax(left, 4, 1);
          parallax(right, 4, -1); // sens opposé : l'une monte, l'autre descend
        }
      }
      if (wide) photo(wide, { amplitude: 4 * half, duration: 1.4 });
    },
  );
}
