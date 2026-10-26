# 01 : Correctifs de l'accueil (et composants partagés)

Captures de référence : `references/feedback-home/` (le nom de chaque fichier décrit le défaut).

## 1. Hero : le cercle orange part du centre
**Constat** (`01-cercle-orange-decale-a-droite.png`, `10-cercle-orange-origine-decalee.png`) : le cercle démarre vers 60 % de la largeur et 45 % de la hauteur, c'est incohérent avec le hero centré.

**À faire**
- Origine du cercle : **centre exact du viewport** (50 % de la largeur, 50 % de la hauteur), y compris au resize. Le cercle apparaît d'abord comme un petit point orange (≈ 70 px) au centre, puis grandit en scrub jusqu'à couvrir tout l'écran.
- Le point apparaît **sur le centre du H1 / du bloc de texte**, pas sur le côté. Si le bloc de texte n'est pas centré verticalement dans le viewport, le point reste quand même au centre du viewport.
- Calcul de l'échelle finale à partir de la distance du centre au coin le plus éloigné, recalculée avec `invalidateOnRefresh: true`.
- Le reste de l'animation (contenu du hero qui s'efface et monte légèrement, écran 100 % orange, section 2 qui prend le relais) ne change pas.

## 2. Title tags : de vraies pilules
**Constat** (`02-title-tags-hero-coins-inegaux.png`, `03-title-tag-vegetales-section-orange.png`, `05-title-tag-vegetales-zoom.png`, `07-title-tag-inoubliable-zoom.png`) : les title tags ressemblent à des rectangles aux coins inégaux (un coin presque carré, les autres arrondis), parfois coupés. Un espace parasite sépare aussi le tag du point final (« végétales . »). Causes probables : masque de SplitText ou `overflow: hidden` qui rogne le tag, animation de remplissage qui déforme le rayon, rotation sur un élément rogné.

**Spécification** (valable sur l'accueil, la page Noël, le footer, le menu et tous les futurs titres)
- Forme : `border-radius: 999px` (var `--radius-pill`), **jamais** un rectangle. Les deux extrémités sont des demi-cercles parfaits.
- Structure recommandée :
  ```html
  <span class="tag tag--orange"><span class="tag__bg"></span><span class="tag__text">votre espace</span></span>.
  ```
  Le fond est un pseudo-élément ou un `span` dédié (`tag__bg`, `inset: 0`, `border-radius: 999px`), le texte est au-dessus.
- Dimensions : `display: inline-block; padding: 0.04em 0.6em 0.1em; line-height: 1.2; white-space: nowrap; vertical-align: baseline`. Le padding horizontal doit être assez large pour que les italiques de Playfair (jambages du f, p, g, hampes) ne dépassent **jamais** du fond.
- Rotation : ±2° sur le tag entier (`transform: rotate(...)`), alternée (clair −2°, orange +2°). La rotation ne doit jamais rogner le tag.
- **Aucun parent avec `overflow: hidden`** autour d'un tag. Si SplitText masque les lignes (`mask: "lines"` ou wrappers à overflow hidden), ajouter un padding vertical et horizontal au masque (≈ 0.25em) ou utiliser `overflow: clip; overflow-clip-margin: 0.3em`, et vérifier qu'aucun tag n'est rogné pendant ni après l'animation. Si besoin, exclure les tags du split (`.tag` traité comme un bloc entier, animé à part).
- Remplissage animé (apparition) : animer le fond par `clip-path: inset(0 100% 0 0 round 999px)` vers `inset(0 0 0 0 round 999px)`. **Ne pas** utiliser `scaleX` (il déforme les demi-cercles). Le texte apparaît ensuite (opacité, légère montée).
- Ponctuation : **aucun espace** entre la fin du tag et le point (`</span>.`). Marges latérales du tag : `margin-inline: 0.12em`. Dans le footer, « ensemble » est suivi du point collé.
- Couleurs inchangées : tag clair (fond crème, texte orange, −2°), tag orange (fond orange, texte crème, +2°).
- Vérifier chaque tag existant du projet : hero (« végétal », « scénographie »), section orange (« végétales »), approche (« on s'occupe de tout », « vous ressemble »), chiffres (« inoubliable »), footer (« ensemble »), menu (« votre espace »), page Noël (tous).

## 3. Section orange : photos flottantes
**Constat** (`09-photos-flottantes-coin-carre-et-recouvrement-texte.png`)
- La photo de lavande (Tour Eiffel) a des **coins carrés**, alors que les autres sont arrondies.
- Une photo passe **par-dessus** le titre (« véritables ») et une autre sur le logo : illisible.

**À faire**
- Toutes les photos de cette section (flottantes et photo qui s'agrandit) ont `border-radius: var(--radius-photo)` (14 px) dès le départ, appliqué sur le conteneur de la photo **et** `overflow: hidden`. Pour la photo qui s'agrandit en plein écran : animer `clip-path: inset(... round 14px)` vers `round 0` seulement quand elle atteint 100 % de l'écran, jamais avant.
- Pendant le scroll, le texte (titre et CTA) est **toujours au-dessus des photos** (`z-index` supérieur). Les photos passent derrière le texte. Ajuster aussi les trajectoires pour que les photos évitent le plus possible la zone du titre.
- Le header reste au-dessus de tout, avec le dégradé du §5 si nécessaire.

## 4. Services : sans numéros
**Constat** (`06-logo-illisible-sur-services.png`) : les numéros 01 à 06 sont retirés.
- Supprimer la colonne des numéros. Le **titre du service est aligné à gauche** sur la marge de page (là où commençaient les numéros). La description reste à droite, les filets et les états de survol restent identiques (voir `DESIGN.md` §5.5).
- Mettre à jour `src/data/site.js` (ou équivalent) : le champ `n` n'est plus affiché.
- La ligne « Décors de Noël » n'est pas dans cette liste de l'accueil (6 lignes). Le menu garde ses 7 sous-liens.

## 5. Header : dégradé sous le logo
**Constat** (`06-logo-illisible-sur-services.png`) : sur la section Services, le logo se superpose aux lignes de service et devient illisible.

**À faire**
- Ajouter un **dégradé de lisibilité** sous la zone du header : bande `position: fixed; top: 0; left: 0; right: 0; height: clamp(110px, 13vh, 170px); pointer-events: none; z-index` sous le logo et le bouton mais au-dessus du contenu de la page.
- Dégradé vertical de la couleur du fond de la section vers transparent : `linear-gradient(to bottom, var(--hdr-grad) 0%, color-mix(in srgb, var(--hdr-grad) 85%, transparent) 35%, transparent 100%)`.
- Couleur et visibilité pilotées par la section sous le header (ScrollTrigger sur chaque section, attribut `data-header-gradient="cream | olive | off"`), avec transition d'opacité 0,35 s (pas de clignotement) :

| Section | Dégradé |
|---|---|
| Hero (olive), section orange, photos plein écran, footer | `off` (rien ne passe sous le logo, ou fond uni) |
| Réalisations (olive) | `olive` |
| Services, chiffres clés (crème) | `cream` |
| Page Noël : univers, fonctionnement, témoignages, FAQ (crème) | `cream` |
| Page Noël : flux horizontal (orange), CTA final (orange) | `off` |

- Le thème du logo et du bouton (clair/sombre) reste piloté comme avant. Le dégradé s'ajoute, il ne le remplace pas.
- Vérifier visuellement à plusieurs positions de scroll que le logo reste lisible, y compris à la jonction entre deux sections (pendant la superposition des services).

## 6. Footer
Voir `03-FOOTER-V2.md`.
