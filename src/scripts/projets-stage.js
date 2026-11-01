// Scène épinglée de la page Réalisations V4 (retours-v4/docs/01-REALISATIONS.md §1 à §4, frames realisations-01 à 15) : les photos du hero qui
// montent, la photo des tournesols qui grandit jusqu'au plein écran, son voile, puis le texte et le CTA forment une seule timeline pilotée par
// le scroll, comme les scènes de l'accueil (stage.js) et de Noël (noel-stage.js). Une unité de timeline vaut un écran de scroll : un seul
// pin, aucun espace vide. La section crème (projets-grid) n'est pas dans la scène : elle la suit dans la page, remontée d'un écran par
// une marge négative (projets-hero.css), et c'est le dernier écran de scroll de la scène qui la fait monter par-dessus la photo.
// Sans mouvement (prefers-reduced-motion) ou sans JavaScript, les deux blocs restent empilés (projets-hero.css).
import { gsap, ScrollTrigger, SplitText, scrollTo } from "./core.js";
import { setHeaderOverride } from "./header-theme.js";
import { keepScroll, scrollRatio } from "./scroll-memory.js";
import { fillTag } from "./tag.js";

// Calendrier (en écrans de scroll). rise : durée de la montée des photos du hero (leurs vitesses sont en data-speed). La carte de la photo
// 05 arrive par le bas à la vitesse de la page pendant `appearDur`, repose à sa place de la frame 03, puis s'ouvre en plein écran entre
// `grow` et `grow + growDur` (frames 04 à 07). Le titre s'efface pendant ce temps, le voile arrive ensuite, le texte après lui. `total`
// est la longueur de la scène : le dernier écran est celui de l'arrivée de la crème, le texte reste lisible avant elle.
const DESKTOP = {
  total: 4.2,
  rise: 1.7,
  title: 0.85, titleDur: 0.45,
  card: { width: 739 / 1728, top: 881 / 1030 }, appearDur: 0.62, grow: 0.62, growDur: 0.95,
  header: 1.4, veil: 1.6, veilDur: 0.3,
  text: 1.95, cta: 2.5,
};
// Mobile : trois photos plus petites, mêmes vitesses relatives, photo plein écran identique.
const MOBILE = {
  total: 3.4,
  rise: 1.4,
  title: 0.7, titleDur: 0.4,
  card: { width: 0.8, top: 0.78 }, appearDur: 0.5, grow: 0.5, growDur: 0.8,
  header: 1.0, veil: 1.35, veilDur: 0.25,
  text: 1.7, cta: 2.15,
};

const RADIUS = 14; // --radius-photo, tenu jusqu'au plein écran puis ramené à 0 sur les derniers pixels
const SQUARE = 0.04;

export function initProjetsStage() {
  const stage = document.getElementById("pstage");
  if (!stage) return;

  const mm = gsap.matchMedia();
  mm.add(
    {
      desktop: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
      mobile: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
    },
    ({ conditions }) => {
      const T = conditions.desktop ? DESKTOP : MOBILE;
      const root = document.documentElement;
      root.classList.add("pstage-anim");

      const build = () => {
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () => `+=${T.total * stage.offsetHeight}`,
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            refreshPriority: 1, // la scène est reconstruite au changement de largeur : elle doit rester calculée avant les triggers qui la suivent
            onToggle: (self) => stage.classList.toggle("is-live", self.isActive), // will-change seulement pendant la scène (projets-hero.css)
          },
        });
        const unit = () => stage.offsetHeight; // un écran de scroll
        addHero(tl, stage, T, unit);
        addPhoto(tl, stage, T);
        addText(tl, stage, T);
        tl.set({}, {}, T.total); // fixe la durée : 1 unité de timeline = 1 écran de scroll

        // Le logo croise la photo claire pendant qu'elle grandit, avant que le voile ne l'assombrisse : le dégradé sombre du header couvre
        // cet intervalle (même réglage que l'accueil, stage.js), puis le voile prend le relais.
        ScrollTrigger.create({
          start: () => tl.scrollTrigger.start + T.header * unit(),
          end: () => tl.scrollTrigger.start + (T.veil + T.veilDur) * unit(),
          onToggle: (self) => setHeaderOverride(self.isActive ? { gradient: "photo" } : null),
        });

        // L'arrivée de la crème : le texte s'efface et la photo s'assombrit (frames 12 à 14), du bord haut de la crème au bas de l'écran
        // jusqu'à 30 % de la hauteur. refreshPriority : calculé après le pin de la scène, dont l'espacement décale la section.
        const grid = document.getElementById("projets");
        if (grid) {
          const arrival = { trigger: grid, start: "top bottom", end: "top 30%", scrub: true, refreshPriority: -1 };
          gsap.to(stage.querySelector(".pphoto__content"), { opacity: 0, ease: "none", scrollTrigger: arrival });
          gsap.to(stage.querySelector(".pphoto__dim"), { opacity: 0.55, ease: "none", scrollTrigger: { ...arrival } });
        }

        // Clavier : le CTA vit dans la scène épinglée, invisible tant que le scroll n'est pas arrivé à son entrée. Quand il reçoit le focus
        // avant, on amène le scroll jusqu'à l'instant où il est visible.
        const cta = stage.querySelector(".pphoto__content .cta");
        const onCtaFocus = () => {
          const target = tl.scrollTrigger.start + (T.cta + 0.4) * unit();
          if (window.scrollY < target) scrollTo(target, { immediate: true }); // instantané : une animation Lenis écraserait le saut natif du Tab suivant
        };
        cta.addEventListener("focus", onCtaFocus);
        return () => {
          cta.removeEventListener("focus", onCtaFocus);
          setHeaderOverride(null);
          stage.classList.remove("is-live");
        };
      };

      // Le texte est découpé en lignes : quand la largeur change, les retours à la ligne aussi, donc on reconstruit tout (même principe que
      // stage.js). Un changement de hauteur seul est géré par invalidateOnRefresh. Idem si les polices arrivent après l'initialisation.
      let scope = gsap.context(build);
      let width = window.innerWidth;
      let timer;
      const rebuild = (ratio) =>
        keepScroll(() => {
          scope.revert();
          scope = gsap.context(build);
        }, ratio);
      let reading; // point de lecture noté au premier événement : ScrollTrigger recalcule de lui-même 200 ms plus tard
      const onResize = () => {
        reading ??= scrollRatio();
        clearTimeout(timer);
        timer = setTimeout(() => {
          const ratio = reading;
          reading = undefined;
          if (window.innerWidth === width) return;
          width = window.innerWidth;
          rebuild(ratio);
        }, 300);
      };
      const onRelayout = () => rebuild();
      window.addEventListener("resize", onResize);
      window.addEventListener("dbal:relayout", onRelayout);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("dbal:relayout", onRelayout);
        scope.revert();
        root.classList.remove("pstage-anim");
      };
    },
  );
}

// ---------- Hero : les photos montent, le titre s'efface ----------
// Chaque photo monte en ligne droite pendant toute la fenêtre `rise`, à sa vitesse (data-speed, en svh par écran de scroll : 100 suit la
// page). Elles partent de leur place de la frame 01 : à 100 la photo la plus basse sort en 1,3 écran, elle est partie bien avant la fin.
function addHero(tl, stage, T, unit) {
  [...stage.querySelectorAll(".phero__photo")]
    .filter((li) => li.offsetHeight > 0) // sous 900 px, une photo est masquée
    .forEach((li) => {
      const distance = () => (Number(li.dataset.speed) / 100) * T.rise * unit();
      tl.fromTo(li, { y: 0 }, { y: () => -distance(), duration: T.rise, ease: "none" }, 0);
    });
  // Opacité seule sur le conteneur : le h1 reste dans l'arbre d'accessibilité, et intro.js, qui nettoie le h1, ne s'y frotte pas.
  tl.to(stage.querySelector(".phero__inner"), { opacity: 0, duration: T.titleDur, ease: "power1.in" }, T.title);
}

// ---------- Photo : carte qui arrive, s'ouvre en plein écran, voile ----------
// Même technique que la photo large de l'accueil (photos-scroll.js) : le cadre (clip-path) et l'image (scale et y) grandissent ensemble, donc
// la carte montre d'abord la photo entière. Le rayon de 14 px tient jusqu'au plein écran, il ne tombe à 0 qu'une fois l'écran rempli.
function addPhoto(tl, stage, T) {
  const media = stage.querySelector(".pphoto__media");
  const photo = media.querySelector(".pphoto__img");
  const veil = media.querySelector(".pphoto__veil");
  const ratio = parseFloat(media.style.getPropertyValue("--ratio"));

  const pose = () => {
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const cardW = w * T.card.width;
    const cardH = cardW / ratio;
    const top = h * T.card.top;
    return { w, h, cardW, cardH, top, side: (w - cardW) / 2 };
  };
  // Les extrémités du clip-path sont écrites en toutes lettres (4 insets et un rayon) : à partir de la valeur relue dans le style, que Chrome
  // abrège, GSAP associerait le rayon à l'inset gauche et le perdrait en route. Le bas de la carte est sous l'écran : son inset est négatif.
  const cardClip = () => {
    const p = pose();
    return `inset(${p.top}px ${p.side}px ${p.h - p.top - p.cardH}px ${p.side}px round ${RADIUS}px)`;
  };
  const fullRounded = `inset(0px 0px 0px 0px round ${RADIUS}px)`;
  const fullSquare = "inset(0px 0px 0px 0px round 0px)";
  // L'image est dimensionnée en « cover » (projets-hero.css) : l'échelle qui la ramène à la carte est cardW sur sa largeur réelle.
  const cardScale = () => pose().cardW / photo.offsetWidth;
  const cardY = () => pose().top + pose().cardH / 2 - pose().h / 2; // le centre de l'image au centre de la carte

  tl.set(media, { clipPath: cardClip }, 0)
    .set(photo, { scale: cardScale, y: cardY }, 0)
    // La carte monte du bas à la vitesse de la page : elle part assez bas pour entrer quand les premières photos ont déjà bougé.
    .fromTo(media, { y: () => T.appearDur * pose().h }, { y: 0, duration: T.appearDur, ease: "none" }, 0)
    .fromTo(media, { clipPath: cardClip }, { clipPath: fullRounded, duration: T.growDur, ease: "power1.inOut" }, T.grow)
    .fromTo(media, { clipPath: fullRounded }, { clipPath: fullSquare, duration: SQUARE, ease: "none" }, T.grow + T.growDur)
    .to(photo, { scale: 1, y: 0, duration: T.growDur, ease: "power1.inOut" }, T.grow)
    // Voile sombre quand l'écran est plein (frames 08 et 09), pour la lisibilité du texte et du logo.
    .fromTo(veil, { opacity: 0 }, { opacity: 1, duration: T.veilDur, ease: "none" }, T.veil);
}

// ---------- Texte : label, titre ligne par ligne avec sa pastille, CTA ----------
// Même séquence que « Notre volonté » de Noël (noel-volonte.js) : label, lignes sous masque, pastille qui se remplit de gauche à droite avec
// une rotation d'entrée de ±4° vers ±2°.
function addText(tl, stage, T) {
  const content = stage.querySelector(".pphoto__content");
  const label = content.querySelector(".label");
  const title = content.querySelector(".pphoto__title");
  const tags = [...title.querySelectorAll(".tag")];
  const cta = content.querySelector(".cta");
  const rotations = tags.map((tag) => parseFloat(getComputedStyle(tag).getPropertyValue("--tag-rotate")));

  const split = SplitText.create(title, { type: "lines,words", mask: "lines", linesClass: "split-line", ignore: ".tag", aria: "none" });
  tl.fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out" }, T.text)
    .fromTo(split.lines, { yPercent: 105 }, { yPercent: 0, duration: 0.3, ease: "power3.out", stagger: 0.07 }, T.text + 0.05);
  tags.forEach((tag, i) => {
    const at = T.text + 0.3 + i * 0.2;
    tl.fromTo(tag, { rotation: rotations[i] * 2 }, { rotation: rotations[i], duration: 0.25, ease: "power3.out" }, at);
    // Seul un tag suivi directement d'une ponctuation est enveloppé dans un « mot » avec elle : il apparaît avec le fond, pas avant.
    const word = split.words.find((w) => w.contains(tag));
    if (word) tl.fromTo(word, { opacity: 0 }, { opacity: 1, duration: 0.05, ease: "none" }, at);
    fillTag(tl, tag, at, { duration: 0.25 });
  });
  // Opacité seule : le CTA reste atteignable au clavier avant son entrée (le focus amène alors le scroll jusqu'à lui). Sans clic possible
  // tant qu'il est invisible : la couche qui le porte ne capte rien (projets-hero.css).
  tl.fromTo(cta, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" }, T.cta).set(cta, { pointerEvents: "auto" }, T.cta);
}
