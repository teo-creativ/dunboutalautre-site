# DESIGN.md : design system D'un Bout À L'autre

Sources : maquettes Figma du fondateur (frames dans `references/`), synthèse d'identité de la cliente (`references/identite/`). Valeurs de pixel mesurées sur un canvas de **1728 px** de large (ordinateur portable 16"), à convertir en `clamp()` fluides.

## 1. Esprit

Studio créatif haut de gamme, chaleureux, vivant. Fond olive profond, orange vermillon éclatant, crème. Photos en **noir et blanc grainé** pour l'effet éditorial, le végétal ressort par les touches d'orange. Typographie à deux voix : Poppins léger (sobre, moderne) + Playfair Display italique (accent expressif dans des « title tags » en forme de pilule inclinée). Beaucoup d'air, grands titres, animations fluides au scroll.

## 2. Couleurs (tokens, `src/styles/tokens.css`)

| Token | Valeur | Usage |
|---|---|---|
| `--olive` | `#5E530E` | Fond principal sombre (hero, menu, footer), texte sur fond clair |
| `--olive-deep` | `#4C430B` | Texte actif/survol sur fond crème, filets actifs, soulignements |
| `--orange` | `#FC4C00` | Accent : cercle de transition, title tags, points, soulignements, survol des CTA, section 2 |
| `--cream` | `#FEF1E0` | Fond clair (services, chiffres clés), fond des title tags clairs |
| `--white` | `#FFFFFF` | CTA par défaut, texte sur fond sombre, cartes de chiffres |
| `--sand` | `#C9BDA0` | Texte inactif sur fond crème (lignes de service non survolées) |
| `--olive-line` | `#766C2F` | Filets et feuilles décoratives sur fond olive |
| `--blue` | `#B2D4E0` | Bleu ciel de la palette initiale : **réserve**, non utilisé dans les maquettes actuelles |
| `--grey-line` | `#D2D2D2` | Filets fins entre lignes de service (inactifs) |

Règles : l'orange n'est jamais utilisé en grand aplat en dehors de la section 2 et de la transition. Texte courant sur olive : blanc ou crème. Texte courant sur crème : olive. Ne pas ajouter d'autres couleurs sans l'accord du fondateur ; si une couleur manque, extraire la valeur exacte des frames et la déclarer en token.

## 3. Typographie

- **Poppins** : tout le texte. Poids **300 (Light)** pour les grands titres et le menu, **400** pour le texte courant, **500** (rare) pour boutons et labels courts.
- **Playfair Display *Italic*** (400/500) : uniquement dans les **title tags** (mots mis en avant dans un titre) et pour de petits accents.
- Labels de section : Poppins 400, majuscules, 14 à 15 px, espacement des lettres +0,02em, précédés d'un point orange (`• SERVICES`).
- Échelle (référence 1728 px, à rendre fluide avec `clamp()`) :

| Rôle | Taille | Poids | Interligne |
|---|---|---|---|
| H1 hero | ~80 px | 400 | 1,25 |
| Titre section 2 (« On crée de véritables… ») | ~64 px | 400 | 1,25 |
| Texte « Notre approche » | ~44 px | 300/400 | 1,6 |
| Liens du menu | ~88 px | 300 | 1,65 |
| Sous-liens du menu | ~34 px | 300 | 1,6 |
| Titre de ligne de service | ~44 px | 300/400 | 1 |
| Description de service | 15 à 16 px | 400 | 1,5 |
| Chiffre clé | ~72 px | 300 | 1 |
| Ligne de positionnement (hero) | ~22 px, majuscules | 300 | 1 |
| Texte de CTA | 18 à 20 px | 400 | 1 |
| Label de section | 14 px, majuscules | 400 | 1 |

## 4. Espacements, rayons, ombres

- Marges latérales de page : **68 px** à 1728 (≈ 4 vw), jusqu'à 24 px sur mobile.
- Grille : 12 colonnes, gouttière 24 px.
- Rayons : photos et cartes **14 à 16 px** ; cartes de chiffres **28 px** ; CTA et pilules **999 px** ; title tags : rayon élevé (~40 px, quasi pilule).
- Ombre carte de chiffres : `0 12px 40px rgba(76, 67, 11, .10)`.
- Photos : N&B grainé tel que fourni, jamais recolorisées par CSS.

## 5. Composants

### 5.1 Title tag (mot mis en avant)
**Vraie pilule** inclinée de **±2°** (`border-radius: var(--radius-pill)`, extrémités en demi-cercles, jamais un rectangle), **Playfair Display Italic** (taille = taille du titre), `display:inline-block`, padding `0.04em 0.5em 0.1em`, `line-height: 1.2`. Balisage unique (`src/components/tag.js`, `<!--@tag text="…" variant="orange"-->`) : `.tag > .tag__bg + .tag__text`. Le fond se dessine en `clip-path` avec rayon de pilule (`src/scripts/tag.js`), jamais en `scaleX`. Aucun espace entre le tag et la ponctuation qui suit, aucun parent en `overflow: hidden` (les masques de SplitText sont agrandis par `.split-word-mask` et `.split-line-mask`).
- Variante **claire** : fond `--cream`, texte `--orange` (ex. « végétal », « végétales », « vous ressemble »).
- Variante **orange** : fond `--orange`, texte `--cream` (ex. « scénographie », « on s'occupe de tout », « votre espace », « inoubliable »).
- Rotation en alternance : claire `-2°`, orange `+2°`. Exemple hero : « Design [végétal] & [scénographie] pour les entreprises. »

### 5.2 Bouton CTA (pilule)
- Défaut (sur fond olive/orange/photo) : fond `--white`, texte `--orange`, **point orange** `•` à gauche, hauteur ~50 px, padding horizontal ~22 px, texte 18 à 20 px.
- Comportement au survol : voir `docs/ANIMATIONS.md` §10. Le point à gauche grandit en cercle jusqu'à remplir toute la pilule, le fond devient orange, le texte devient blanc et réapparaît avec une petite animation de texte.
- **Variantes selon le fond** (attribut `data-variant`) :

| Variante | Fond de section | Repos | Survol (remplissage) |
|---|---|---|---|
| `on-olive` | olive, photo sombre | fond blanc, texte et point orange | remplissage orange, texte blanc |
| `on-orange` | orange | fond blanc, texte et point orange | remplissage olive, texte crème |
| `on-cream` | crème, blanc | fond olive, texte crème, point orange | remplissage orange, texte blanc |

### 5.3 Header
- Fixe, transparent, `z-index` élevé. À gauche le **logo wordmark** `public/assets/brand/logo-wordmark-cream.svg` (≈ 370 px de large à 1728, le « O » de BØUT est une feuille). À droite un bouton **« • Menu »** : pilule blanche, texte orange, point orange.
- Quand le menu est ouvert, « Menu » devient « Fermer » (texte crème sans pilule, aligné à droite).
- Sur fond crème (sections claires), le logo et le bouton doivent rester lisibles : le logo passe en olive (utiliser `mix-blend-mode: difference` ou une classe de thème pilotée par ScrollTrigger, au choix, mais sans clignotement).

### 5.4 Fond du hero
`public/assets/brand/bg-hero-leaves.svg` (et `@2x.png`) : fond olive avec **4 feuilles décoratives** en contour (couleur `--olive-line`) découpées aux 4 coins. Le motif reprend la forme du « O » du logo. Pas d'autre décor.

### 5.5 Ligne de service (liste « SERVICES »)
Ligne = titre | description courte, séparée par un filet fin (sans numéros, le titre est aligné à gauche sur la marge de la section).
- Inactif : titre `--sand`, description `--sand`, filet `--grey-line`.
- Actif (survol) : titre et description `--olive-deep` (opacité 100 %), filet du bas `--olive-deep` 1 px, **soulignement orange** (3 px) sous le titre, qui se dessine de gauche à droite.
- Au repos, aucune ligne n'est survolée : toutes à une opacité intermédiaire (voir §ANIMATIONS 6).

### 5.6 Carte de chiffre clé
Carte blanche, rayon 28 px, padding 32 px, légère rotation (entre −2° et +1,5°), chiffre orange en Poppins Light ~72 px (le suffixe « ans » ou « % » à taille réduite pour « ans »), texte gris olive 16 px sous le chiffre. Voir `references/menu/services-rows-et-chiffres-cles.png`.

### 5.7 Menu plein écran
Deux colonnes séparées par un **filet vertical** `--olive-line` (1 px), fond `--olive`.
- Gauche : liens énormes (Accueil, Services, Réalisations, Contact, Blog). Lien actif : point orange à gauche, texte décalé vers la droite (~35 px), soulignement orange épais.
- Retours V8 : plus de compteur « (32) » à droite de « Réalisations » (menu), ni dans le titre de la page Réalisations (« Nos projets. »).
- Droite, état par défaut : titre « Parlons de la transformation de [votre espace] ensemble. » (title tag orange), photo N&B arrondie, label « CONTACT » (gris), e-mail et téléphone.
- Droite, au survol de « Services » : la colonne de droite est remplacée par le label « SERVICES » et la liste des 7 sous-liens. Voir `references/menu/`.

### 5.8 Footer
Footer V2 (`retours-v2/docs/03-FOOTER-V2.md`, design `retours-v2/references/design/footer-v2-design.png`, 1728 x 553). Fond `--olive`, texte **blanc**, filets `--olive-line`. Bloc principal de deux moitiés séparées par un filet vertical à 50 % : à gauche le titre « Parlons de [votre espace] ensemble. » (Poppins Light 48 px, title tag orange), le CTA `on-olive` « Discutons de votre projet » et le wordmark blanc (≈ 370 px) en bas ; à droite trois colonnes SERVICES (7 liens), NAVIGATION (4 liens) et RÉSEAUX (Instagram et Facebook avec pictos), labels en `--grey-label` (20 px, majuscules), liens en blanc 20 px au pas de 45 px. Barre basse de 51 px sous un filet : copyright et liens légaux en `--grey-label` 16 px. Au survol et au focus, un soulignement orange de 2 px se dessine de gauche à droite. Plus d'e-mail ni de téléphone (ils restent dans le menu). Hauteur : `--footer-main-h` + `--footer-bar-h` dans `tokens.css`, remplacée par la mesure de `footer-reveal.js`. Mobile : une colonne, sans filet vertical ni révélation.

### 5.8 bis Section Réalisations (accueil)
Fond `--olive`. Label « • RÉALISATIONS » blanc (20 px, point blanc). Liste de 5 titres Poppins 300 blanc (≈ 2,84 vw, pas de 5,2 vw) à gauche, marge 9,5 vw ; titre actif : point `--orange` de 0,9 vw, texte décalé de 2,2 vw, soulignement `--orange` de 3 px. Pile de photos à droite (bord gauche à 56,7 vw, largeur 43,3 vw, ratio 5/4, rayon 14 px sur les coins gauches, 2,2 vw d'écart). Détails et animation : `docs/ANIMATIONS.md` §6 bis.

### 5.9 Logos clients
Frise défilante (marquee) en niveaux de gris, `filter: grayscale(1)` (et `brightness`/`contrast` si nécessaire), fond clair. Les logos sont dans `public/assets/logos-clients/` (certains fichiers ont un fond blanc : utiliser `mix-blend-mode: multiply` sur fond crème). Les logos d'Eataly, de l'ONF et de l'Ambassade d'Italie manquent : prévoir un emplacement texte provisoire.

### 5.10 Curseur feuille (V8)
La feuille du « O » de BOUT (tracé de `public/assets/brand/leaf.svg`, extrait du wordmark, jamais redessiné) remplace le curseur système quand le pointeur est fin (souris, stylet) et l'écran fait plus de 900 px. 28 px (`--cursor-size`), pleine (`--cursor-fill: 1`), inclinée de -20°, point actif au centre. Deux jeux de couleurs fondus par l'opacité en 150 ms : `ink` (`--olive-deep`, liseré `--cream`) sur les fonds clairs, `paper` (`--cream`, liseré `--olive-deep`) sur les fonds sombres, orange, les photos, les CTA et les pastilles. Sur un lien ou un bouton : x1,8, contour (`--cursor-fill-link: 0`), un point central sur les CTA ; sur un texte : x0,6 ; sur un slider ou carrousel : allongée avec une flèche de chaque côté. Détails, états et garde-fous : `docs/ANIMATIONS.md` §11 quater. Code : `src/components/cursor.js`, `src/styles/cursor.css`.

### 5.11 Slider « Trois matières » (V8)
Un seul slider pour Bureaux, Design, Terrasses (titres sans pastille) et Entretien (`src/scripts/bureaux-matieres.js`, `src/styles/bureaux-matieres.css`). **Une seule photo est visible à la fois** : sur chaque glissement un voile sombre (`.mat__dim`, `--veil-dim`, opacité de 0 à 0,6 par-dessus le voile de lecture) monte, la photo suivante prend la place de la précédente au pic (opacité 1 et 0), puis le voile redescend pendant que la photo entrante se pose (échelle 1,06 vers 1). Le titre actif est **exactement centré** sur le milieu de la fenêtre ; ses voisins sont à gauche et à droite, atténués, séparés de lui par le même écart (`RAIL_GAP`, 220 px à 1728). Titre et paragraphe forment un bloc centré à la verticale dans la section (grille, rangées partagées par les trois slides : le titre reste à la même hauteur), écart fixe de 2 rem, paragraphe d'une soixantaine de caractères. Détails et mesures : `docs/ANIMATIONS.md` §11 quinquies.

### 5.12 Révélation à l'entrée (`reveal-on-enter`, V8)
Composant partagé pour une section qui arrive par-dessus une autre (orange ou plein écran) : le texte et les photos se révèlent au lieu d'être déjà là. Balisage : `data-reveal="enter"` sur la section, puis `data-reveal-part` = `eyebrow` (surtitre), `title` (titre en lignes sous masque, pastilles qui s'ouvrent ensuite par `clip-path`, jamais en pivotant), `text`, `cta`, `photo` (`clip-path` de bas en haut, média de 1,15 à 1) sur les éléments concernés. Réglages sur la section : `data-reveal-start` (défaut `top 75%`), `data-reveal-once="true"`, `data-reveal-delay`. État de départ en CSS (`src/styles/reveal-on-enter.css`, sous `html.js`), tout visible en mouvement réduit. Appliqué par `reveal: true` dans les données : Design (titre des matières, galerie « Votre logo »), Bureaux (galerie), Décoration (galerie « Vous recevez vos clients »), Terrasses (texte sur photo « Le branding végétal » : étiquette et paragraphe en lignes, pastilles droites ; la photo et son voile sont dans `.ptx__media`, rognés ensemble par `clip-path`, déclenchement `top 55%`) ; les photos d'une galerie qui monte sont révélées au fil de leur entrée dans l'écran (`revealPhotos`), pas à l'arrivée de la section. Entretien (titre du fond orange « Chaque installation a ses besoins. », `revealStart: "top top"` : la section est déjà en place sous le disque orange des formules, elle se révèle quand le disque a fini) et Noël (photos de l'orange : `revealPhotos` ; le titre et le bouton gardent la révélation de la scène épinglée) l'activent aussi ; Ateliers à son tour (bandeau final orange : option `reveal` de `cta-final`, `data-reveal-start="top 70%"`). La révélation joue à l'entrée (`onEnter`) et se défait au-dessus du départ (`onLeaveBack`) : une section tout en bas de la page ne se défait plus au défilement maximal. Une partie absente (une galerie n'a pas de paragraphe, le texte sur photo n'a pas de bouton) n'est pas animée : aucun avertissement GSAP « target not found ». Code : `src/scripts/reveal-on-enter.js` ; `createReveal(root)` renvoie la timeline pour un déclenchement propre à la page.

### 5.13 Galeries de photos qui montent (V8)
Accueil, Noël, Bureaux, Design, Décoration : **aucune photo n'en recouvre une autre, ni le titre, ni le bouton, ni le header**, à toute taille d'écran. Les photos sont rangées en colonnes de chaque côté du texte (largeurs en vw qui ne se recouvrent pas) ; deux photos de la même colonne forment une pile : celle du dessous part sous celle du dessus, à l'écart de sa hauteur (en vw, donc le même sur tous les écrans) et ne monte jamais plus vite qu'elle (`src/components/gallery.js`, champs `under` et `gap` des données). Un photo peut déborder de l'écran. Le conteneur des photos est rogné sous le header (`--gallery-top`, 5,5 rem) et estompé sur `--gallery-fade` (4 rem) : une photo se fond dans l'orange avant le logo et le bouton Menu. Test : `tests/galeries.mjs`.

### 5.14 Section « styles » et cercle d'Entretien (V8, prompt 07)
**Section « styles »** (`components/sections/bureaux-styles.js`, `scripts/bureaux-styles.js`, `styles/bureaux-styles.css`) : image à gauche, étiquette, titre et liste à droite, épinglée, l'entrée active avance avec le scroll (une seule description ouverte, aucun survol). Terrasses, Décoration et, depuis la V8, Noël (« Choisissez l'univers de votre Noël. », `step: 1` : un écran de scroll par univers, 0,55 par défaut). Chaque entrée peut porter sa propre image (`photo`, `alt`) : l'image change alors par voile sombre et échange (`.sty__veil`, jeton `--veil-dim`), jamais deux photos à demi transparentes. Option `anchor` : id de la section (Noël : `#univers`, Ateliers : `#ateliers`). Plusieurs sections « styles » peuvent se suivre sur une page. Sous 900 px et en mouvement réduit : liste dépliée, image au-dessus, aucun épinglage. La feuille de style s'applique aussi à `body[data-page="noel"]`.
**Disposition en onglets** (V8, page Ateliers ; `layout: "tabs"`, `data-layout="tabs"`) : titre centré sur deux lignes, barre d'onglets horizontale (`role="tablist"`, boutons `role="tab"` avec `aria-selected`, onglet actif en olive-deep souligné d'orange, les autres en `--olive-soft`), puis l'image (rapport 1000 x 954) à gauche et le panneau de l'onglet actif à droite (titre court `heading`, description, trois puces `bullets` à pastille orange). Les panneaux sont empilés dans la même cellule : aucune variation de hauteur. Mesures lues sur la frame ateliers-04 en `--u` (le plus petit de la largeur et de la hauteur de l'écran sur 1728 x 1030). Comportement : voir `docs/ANIMATIONS.md` §11 quinquies. Sous 900 px : onglets en défilement horizontal, panneau dessous, aucun épinglage. Ne change pas la disposition en liste.
**Cercle d'Entretien** (`scripts/bureaux-formules.js`, `scripts/bureaux-cercle.js`) : un palier de lecture de 0,35 écran (`HOLD`) ouvre l'épinglage (cartes immobiles, titre entier, disque à rayon 0), puis le disque grandit pendant 2,4 écrans (`GROW`, lissage `SCRUB` 1,2). Il part du centre de la carte Confort mais est percé d'un trou à sa place : le texte de la carte n'est jamais coupé par le bord du cercle, son contenu se fond dans l'orange quand le disque l'a recouverte. Le header suit le rayon réel du disque. `circleReveal` accepte `hold` et `scrub`.

## 6. Mouvement (principes généraux)

- Easings : entrées `expo.out` ou `power3.out`, sorties `power2.in`, scrub de scroll `none` avec `scrub: 0.6` à `1` pour du lissé.
- Durées : micro-interactions 0,35 à 0,6 s ; apparitions de texte 0,9 à 1,2 s ; transitions de menu 0,8 s.
- Stagger de texte : 0,05 à 0,08 s par mot ou par ligne.
- Tout élément animé doit avoir un état initial défini en CSS pour éviter tout flash avant l'initialisation JS.
- `prefers-reduced-motion: reduce` : pas de pin, pas de parallaxe, pas de cercle qui grandit ; fondus de 200 ms uniquement.

## 7. Contenu image

Photos de l'accueil (V8 : couleur) : `public/assets/images/home/` (`home-photo-1` à `home-photo-5`, `home-photo-5-extended`). Photos couleur : `public/assets/images/photos/`. Pour la landing Noël, utiliser les photos `noel-*`. Texte alternatif en français décrivant la scène.
