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
- Gauche : liens énormes (Accueil, Services, Réalisations (32), Contact, Blog). Lien actif : point orange à gauche, texte décalé vers la droite (~35 px), soulignement orange épais.
- « (32) » : petit nombre en italique (Poppins italique ou Playfair), à droite de « Réalisations », dynamique.
- Droite, état par défaut : titre « Parlons de la transformation de [votre espace] ensemble. » (title tag orange), photo N&B arrondie, label « CONTACT » (gris), e-mail et téléphone.
- Droite, au survol de « Services » : la colonne de droite est remplacée par le label « SERVICES » et la liste des 7 sous-liens. Voir `references/menu/`.

### 5.8 Footer
Fond `--olive`, texte crème. Contenu (d'après l'ancienne maquette, structure conservée) : grand titre « Parlons de votre espace ensemble. » avec title tag, CTA, e-mail, téléphone, liens de pages, « Paris & Île-de-France », Instagram, `© 2026 D'un bout à l'autre`, et **wordmark géant** « D'UN BØUT À L'AUTRE » en crème, rogné au bord inférieur de la page.

### 5.9 Logos clients
Frise défilante (marquee) en niveaux de gris, `filter: grayscale(1)` (et `brightness`/`contrast` si nécessaire), fond clair. Les logos sont dans `public/assets/logos-clients/` (certains fichiers ont un fond blanc : utiliser `mix-blend-mode: multiply` sur fond crème). Les logos d'Eataly, de l'ONF et de l'Ambassade d'Italie manquent : prévoir un emplacement texte provisoire.

## 6. Mouvement (principes généraux)

- Easings : entrées `expo.out` ou `power3.out`, sorties `power2.in`, scrub de scroll `none` avec `scrub: 0.6` à `1` pour du lissé.
- Durées : micro-interactions 0,35 à 0,6 s ; apparitions de texte 0,9 à 1,2 s ; transitions de menu 0,8 s.
- Stagger de texte : 0,05 à 0,08 s par mot ou par ligne.
- Tout élément animé doit avoir un état initial défini en CSS pour éviter tout flash avant l'initialisation JS.
- `prefers-reduced-motion: reduce` : pas de pin, pas de parallaxe, pas de cercle qui grandit ; fondus de 200 ms uniquement.

## 7. Contenu image

Photos N&B grainées de l'accueil : `public/assets/images/home-scroll/`. Photos couleur : `public/assets/images/photos/`. Pour la landing Noël, utiliser les photos `noel-*`. Texte alternatif en français décrivant la scène.
