# ANIMATIONS.md : spécification des animations (Accueil)

Références : `references/frames/`, `references/menu/`, PDF dans `references/animations-pdf/`. Les valeurs ci-dessous sont des points de départ à affiner **à l'œil**, en comparant avec les frames. L'objectif est un rendu **fluide, dynamique, « vivant »**, pas une copie littérale de frames Figma (le fondateur précise que l'animation de transition Figma était « assez mal réalisée » : l'améliorer).

## 1. Principes et mise en place

- GSAP + ScrollTrigger + SplitText, Lenis branché sur ScrollTrigger (une seule boucle `gsap.ticker`, `lagSmoothing(0)`).
- `ScrollTrigger.config({ ignoreMobileResize: true })` ; `ScrollTrigger.normalizeScroll` seulement si nécessaire.
- Un fichier par animation dans `src/scripts/` : `intro.js`, `hero-circle.js`, `photos-scroll.js`, `approach.js`, `realisations.js`, `services.js`, `stats.js`, `footer-reveal.js`, `menu.js`, `cta.js`, `header-theme.js`.
- Tout est réversible au scroll arrière (scrub), sans saut.
- Ordre des sections dans le DOM : `hero` → `experience` (orange puis photos puis approche) → `realisations` (V2) → `services` → `stats` → `footer`.

## 2. Chargement de la page (intro)

1. Header : logo et bouton « Menu » en fondu et léger glissement (y 12 → 0), 0,8 s.
2. Ligne de positionnement (« PLANTES NATURELLES • VÉGÉTAUX STABILISÉS • … ») : fondu, 0,8 s, délai 0,1 s.
3. H1 « Design [végétal] & [scénographie] pour les entreprises. » : mots qui montent depuis un masque (`yPercent: 110 → 0`, stagger 0,07, `expo.out`, 1,1 s). Les deux **title tags** apparaissent ensuite avec `scale: 0.7 → 1`, `rotate: 0 → ±2°`, `opacity: 0 → 1` (0,7 s, `back.out(1.6)`), le fond du tag se dévoilant de gauche à droite (clip-path).
4. CTA : montée + fondu (0,8 s). Feuilles décoratives du fond : fondu lent, dérive très légère (± 10 px) en boucle (optionnel, discret).

## 3. Hero vers section orange (cercle qui envahit l'écran)

Frames : `home-animation-01` à `03`.
- Le hero est **épinglé** (`pin: true`, `scrub: 1`) sur ~**100 vh** de scroll.
- Un élément `.hero-circle` (orange `--orange`, `border-radius: 50%`) est placé au **centre exact du viewport (50 %, 50 %)**, y compris au resize (V2, `retours-v2/docs/01-CORRECTIFS-ACCUEIL.md` §1). Il apparaît d'abord comme un point d'environ 70 px (`scale: 0` à 0 de scroll, le point en 5 % de la timeline).
- Pendant le scroll : le point grandit jusqu'à `scale: 1`, la taille du cercle étant calculée pour couvrir tout le viewport depuis le centre (diamètre ≥ 2 × la distance au coin le plus éloigné). Easing `power2.in` pour une accélération naturelle.
- En parallèle : le contenu du hero (positionnement, H1, CTA) fait `opacity: 1 → 0`, `y: 0 → -40`, `scale: 1 → 0.96` sur les 45 premiers pour cent du trajet, plus rapidement que le cercle. Les feuilles de fond s'estompent.
- Le header (logo + « Menu ») reste visible par-dessus le cercle, inchangé.
- À la fin, tout l'écran est orange (`--orange`) et se prolonge **sans coupure** dans la section suivante (même couleur).
- Contrainte qualité : pas de bord crénelé, pas de flash olive au dégagement du pin, aucune variation de hauteur de page au resize (`invalidateOnRefresh: true`).

## 4. Section orange : titre, CTA et photos en perspective

Frames : `home-animation-04` à `07`.
- Contenu centré : titre « On crée de véritables expériences [végétales]. » (title tag clair), CTA « Discutons de votre projet » (variante `on-orange`). Le texte est révélé comme dans l'intro (mots depuis un masque) juste après la fin du cercle.
- Section épinglée sur ~**300 vh** de scroll (valeur max : 3 écrans de scroll, 2 si possible, à ajuster à l'œil).
- **Photos flottantes** (V8 : couleur, `public/assets/images/home/`, numérotation suivie) : emplacement 1 `home-photo-1` (Sacré-Cœur, graminées), 2 `home-photo-2` (ailes de fleurs séchées), 3 `home-photo-3` (façade fleurie), 4 `home-photo-4` (branche) ; `home-photo-5` est la carte de la photo finale (§5). Cartes de 280 à 360 px de large, ratio portrait (celui de la photo), rayon 14 px, ombre nulle. Retours V8 (G5, `DESIGN.md` §5.13) : les deux cartes d'une colonne (1 et 3 à gauche, 2 et 4 à droite) montent d'un bloc, à l'écart de leur pose de repos, jamais l'une sur l'autre ; aucune sous le header.
  - Conteneur avec `perspective: 1200px`.
  - Chaque carte démarre sous l'écran (`y: 120 vh`, `z: -300 à 0`, `rotateX` léger) et traverse l'écran vers le haut avec une **vitesse propre** (parallaxe : cartes plus « proches » plus rapides). Positions horizontales alternées gauche et droite, certaines **tronquées par le bord de l'écran** comme sur les frames (une carte à gauche à 104 px, une à droite coupée au bord, une en bas à gauche coupée, une en bas à droite).
  - Jamais plus de 3 à 4 cartes visibles en même temps. Aucune ne doit recouvrir le titre ni le CTA (zone centrale libre, ~40 % de la largeur).
  - Impression de **mouvement et de profondeur**, pas de vitesse excessive : `scrub: 1`.
  - Légère rotation individuelle (± 2°) et micro-décalage horizontal pendant la traversée.

## 5. Photo qui s'agrandit, dégradé noir, texte « Notre approche »

Frames : `home-animation-08` à `11`.
- La **dernière photo** (V8, couleur) est la lavande : `home-photo-5` (portrait) sur la carte, `home-photo-5-extended` (large, avec la Tour Eiffel) en plein écran. Elle apparaît par le **bas** au centre, taille d'une carte (38 % de la largeur, rapport 1,81), puis **s'agrandit** au scroll jusqu'à couvrir **toute la section** et devenir son fond. Le portrait est un recadrage exact de la photo large (x 0 à 1000, y 62 à 1332 sur 2709 x 1497, écart de 1,3 sur 255 mesuré) : la photo large est dessous en permanence, le portrait par-dessus au début, puis il s'efface (à mi-ouverture, si la photo large est chargée) : aucun saut de recadrage. L'ouverture est une **fenêtre** dans l'espace de la photo large (bande du portrait vers l'écran entier, échelle de 0,96 à 1 à 1728 x 1030), calculée à chaque image (`scripts/photos-scroll.js`), sur la même courbe `power2.inOut` et le même `scrub`.
- **Coins** (V8) : le `clip-path: inset(... round R)` est posé sur le média, qui n'est pas mis à l'échelle : R est en pixels d'écran, sans compensation. R part de 24 px, passe à 30 px au plein écran (jamais à 0 pendant la croissance), tient 30 px pendant le texte, et ne se resserre vers 0 que dans la seconde moitié de l'arrivée des services, quand ils recouvrent presque toute la photo.
- Implémentation d'origine (remplacée en V8 par la fenêtre ci-dessus) : une image `position: absolute; inset: 0` plein écran dont on anime `clip-path: inset(top right bottom left round 14px)` depuis un petit rectangle centré en bas vers `inset(0 round 0)`, plus un léger `scale: 1.15 → 1` sur l'image. Pas d'animation de `width`/`height`.
- Pendant l'agrandissement, le titre et le CTA orange montent légèrement et s'effacent (`opacity → 0`), car la photo passe devant.
- Une fois la photo plein écran : **dégradé noir** (`linear-gradient` de `rgba(0,0,0,.0)` à `rgba(0,0,0,.55)`, ou voile uniforme `.45`) dont l'opacité passe de 0 à 1 en scrub. Voile de fond doux, la photo reste visible.
- Puis le **bloc de texte** apparaît (centré, ~1100 px de large max) :
  - label `• NOTRE APPROCHE` (blanc, majuscules),
  - « De la conception à l'entretien, [on s'occupe de tout]. Une relation directe, un interlocuteur unique, et un résultat qui [vous ressemble]. C'est notre volonté pour chaque projet. »
  - 1ʳᵉ title tag **orange** (« on s'occupe de tout »), 2ᵉ title tag **clair** (« vous ressemble »).
  - Animation : lignes révélées une à une (SplitText, `yPercent: 100 → 0`, stagger 0,12), les **fonds des title tags se remplissent** de gauche à droite (scaleX du pseudo-élément 0 → 1) avec légère rotation, puis le texte de la pilule apparaît. Les mots non-pilule passent de `opacity .25` à `1` progressivement (effet de lecture au scroll, optionnel et subtil).
- Le texte reste lisible en permanence (contraste AA sur la photo grâce au voile).

## 6. Transition vers les services (superposition) et survol

> V2 : la section **Réalisations** (§6 bis) s'intercale. C'est elle qui remonte par-dessus « Notre approche » avec le mécanisme décrit ci-dessous, et les services remontent ensuite par-dessus elle, avec le même mécanisme et la même animation d'entrée.

Frames : `home-transition-1` à `3`, `references/menu/services-rows-et-chiffres-cles.png`.
- La section « Notre approche » reste **épinglée en arrière-plan** (pin sans espace ajouté) pendant que la section **Services (crème)** **remonte par-dessus** (superposition, `z-index` supérieur). Bord supérieur de la section crème droit.
- Pendant la superposition, le contenu de la section précédente : `opacity: 1 → 0`, `scale: 1 → 0.92` (le texte « se réduit »), la photo s'assombrit un peu (`brightness`) et bouge légèrement (`yPercent: 0 → -8`, parallaxe).
- Contenu de la section Services : label `• SERVICES` (orange), puis **6 lignes** (voir `docs/CONTENU-ACCUEIL.md`). À l'entrée, les lignes apparaissent en cascade (filet qui se dessine, texte qui monte, stagger 0,08).
- **Survol d'une ligne** (états exacts dans `DESIGN.md` §5.5) :
  - la ligne survolée : texte à 100 %, titre `--olive-deep`, **soulignement orange** qui se dessine de gauche à droite (0,45 s, `power3.out`), filet du bas `--olive-deep` ;
  - les autres lignes : couleurs `--sand`, opacité réduite (~0,35), transition 0,35 s ;
  - **au repos** (aucune ligne survolée) : toutes les lignes sont à une opacité intermédiaire lisible (~0,85, couleur `--olive`) ;
  - sur tactile : toutes les lignes à 100 %, pas de survol.
- Chaque ligne est un lien (`<a>`) vers la page de service (fictive pour l'instant). Les états de survol doivent exister aussi en `:focus-visible`.

## 6 bis. Section Réalisations (V2)

Source : `retours-v2/docs/02-SECTION-REALISATIONS.md`, `references/realisations-frames/` (mouvement), `references/design/realisations-etat-actif-couleurs.png` (couleurs et proportions). Données : `src/data/realisations.js`. Script : `src/scripts/realisations.js`.
- **Entrée** : la section olive remonte par-dessus « Notre approche » (marge négative `--overlap` en CSS, comme les services avant elle). Pendant la montée, le label apparaît, la liste arrive et la pile de photos monte de 30 % de la hauteur de l'écran. Le premier titre devient actif à 55 % de la montée.
- **Pin** (≈ 4,1 écrans) : liste de titres (gauche, marge 9,5 vw, fenêtre de 5 titres aux bords fondus) et pile de photos (droite, bord gauche à 56,7 vw, ratio 5/4, débord à droite) défilent dans **une seule timeline**, du même nombre de crans : quand le titre i est sur la ligne centrale (52 svh), la photo i est centrée. 0,7 écran par réalisation, tenue de 0,3 écran sur la dernière, puis 1 écran de superposition des services.
- **Titre actif** : celui qui est le plus proche de la ligne centrale, lu sur la position lissée de la timeline (hystérésis de 0,08 cran). Point orange (scale 0 → 1, 0,35 s, `back.out(2)`), texte décalé de 2,2 vw (0,45 s), soulignement orange dessiné de gauche à droite (0,45 s). Il se retire en sens inverse : point qui rétrécit, texte qui revient, trait qui part vers la droite (0,35 s). Les tweens d'un titre sont interrompus explicitement (`killTweensOf`) à chaque changement, et le trait est animé via un objet simple recopié dans des variables CSS.
- **Survol et focus** : mêmes états que le titre actif en aperçu. Au clavier, le focus amène le scroll à la réalisation du titre.
- **Aimantation** (`SNAP`, désactivable) : 140 ms après la fin du scroll, la page se pose sur la réalisation la plus proche, avec une amorce dans le sens du geste (plus de 10 % d'un cran suffit). Faite avec `lenis.scrollTo` (0,5 s, `power2.inOut`), car le snap de ScrollTrigger se bat avec le lissage de Lenis. Aucune aimantation pendant la tenue et la superposition.
- **Sortie** : un voile olive (opacité 0 → 0,4, équivalent à 1 → 0,6 sur le contenu) et la liste qui rétrécit de 4 % autour du dernier titre, pendant que les services remontent.
- **< 900 px ou mouvement réduit** : pas de pin, les mêmes éléments s'entrelacent en cartes (titre puis photo 16/10) dans une grille ; point et soulignement visibles en permanence ; apparition en fondu et montée de 24 px (mobile avec mouvement).

## 7. Chiffres clés (cartes qui se superposent)

- Section crème, label `• CHIFFRES CLÉS`, titre à gauche « Nous transformons vos idées en expérience [inoubliable]. », **3 cartes** à droite (voir `DESIGN.md` §5.6).
- Section **épinglée** ~**200 vh**. Les cartes entrent **une par une depuis le bas** et **s'empilent en se chevauchant** (chaque carte recouvre légèrement la précédente, décalage vertical ~ −10 px de recouvrement), avec une **rotation individuelle** (ex. −2°, +1°, −1,5°) qui s'ajuste pendant l'entrée (rotation de départ plus forte → rotation finale).
- Les nombres comptent de 0 à leur valeur (`+70`, `+10 ans`, `100%`) pendant l'entrée de chaque carte (`snap`, 1,2 s).
- Le titre apparaît par mots (comme l'intro), le title tag « inoubliable » se remplit comme aux autres endroits.

## 8. Footer en « révélation » (sous-position)

- Principe : la section « Chiffres clés » est **au-dessus** du footer et **se décolle** pour le dévoiler.
- Structure : `main { position: relative; z-index: 2; background: var(--cream); margin-bottom: var(--footer-h); }` ; `footer { position: fixed; inset: auto 0 0 0; z-index: 1; }` (hauteur naturelle). `--footer-h` est la hauteur mesurée du footer (resize inclus), avec une valeur de départ dans `tokens.css`.
- Pendant le scroll final : le contenu du footer a un léger **parallaxe** (`yPercent: -20 → 0`) et `opacity .6 → 1`, le wordmark monte de 8 à 0 %. Le footer V2 (553 px à 1728) est plus bas qu'un écran : la révélation va de « le bas du contenu entre dans l'écran » à « le bas du contenu est à une hauteur de footer du bas de l'écran », soit la fin de la page (V1 : le footer avait la hauteur de l'écran et la fin était « le bas du contenu sort par le haut »).
- Le footer doit rester accessible au clavier et aux lecteurs d'écran (ne pas le masquer avec `display: none`).
- Attention : sur la landing Noël, réutiliser le même composant.

## 9. Menu plein écran

Références : `references/menu/*.png`.
**Ouverture** (clic sur « Menu », 0,9 s au total, `expo.out`) :
1. Le bouton devient « Fermer » (changement de texte avec un fondu court).
2. **Fond :** un panneau olive apparaît avec un fondu d'opacité (0 → 1, 0,5 s) accompagné d'un **balayage de dégradé** depuis le coin haut droit (radial-gradient dont le rayon grandit), pas de coupure sèche. Option plus riche : `clip-path: circle(0% at 96% 4%)` vers `circle(150% at 96% 4%)`.
3. Le **filet vertical central** se dessine du haut vers le bas (`scaleY: 0 → 1`, 0,8 s).
4. Les **liens de gauche** montent depuis un masque (`yPercent: 110 → 0`, stagger 0,07 s). Retours V8 : « Réalisations » n'a plus de compteur « (32) ».
5. Colonne de droite : titre (mots en cascade, title tag « votre espace » qui se remplit), photo N&B (clip-path `inset(100% 0 0 0)` → `inset(0)` avec `scale 1.15 → 1`), puis label, e-mail, téléphone en fondu montant, stagger 0,06.
- Le scroll de la page est bloqué pendant que le menu est ouvert (`lenis.stop()`), puis relancé.
- **Fermeture :** inverse, plus rapide (0,5 s). Échap ferme. Le focus est piégé dans le menu et revient au bouton à la fermeture.

**Survol des liens principaux** (Accueil, Services, Réalisations, Contact, Blog) :
- Un **point orange** apparaît à gauche (`scale 0 → 1`), le texte se **décale vers la droite d'environ 35 px**, un **soulignement orange épais** se dessine de gauche à droite sous le texte (0,45 s `power3.out`). Au départ du survol, l'animation s'inverse (le soulignement se rétracte vers la droite).
- Les autres liens restent inchangés (pas d'opacité réduite dans la maquette).

**Colonne de droite (états)** :
- État par défaut et survol d'Accueil, Réalisations, Contact, Blog : titre, photo, contact.
- **Survol de « Services »** : le titre, la photo et le contact **disparaissent** (fondu + léger glissement) et sont **remplacés** par le label « SERVICES » et la liste des 7 sous-liens (Végétalisation de bureaux, Design végétal sur mesure, Scénographie végétale, Terrasses, Décoration saisonnière, Entretien & abonnements, Décors de Noël), qui montent en cascade (stagger 0,05).
- Les sous-liens ont le même comportement de survol que les liens principaux (point orange, décalage, soulignement), à plus petite échelle.
- Quand la souris quitte « Services » **vers la colonne de droite**, la liste reste affichée. Elle ne revient à l'état par défaut que lorsque la souris survole un autre lien principal ou quitte la zone des deux colonnes (délai d'environ 250 ms pour éviter le clignotement).
- Tactile et clavier : « Services » se déplie au toucher ou avec Entrée/Espace (`aria-expanded`), la liste s'affiche sous le lien ou dans la colonne selon la largeur.

## 10. CTA : remplissage au survol

Frames : `references/frames/cta-hover-1.png` à `5.png`.
- Repos : pilule blanche, point orange à gauche, texte orange.
- Survol : le **petit point** à gauche **grossit en cercle** jusqu'à **remplir toute la pilule** (une couche orange avec `clip-path: circle(r at <position du point> 50%)` de `r = 6px` à `r = largeur totale`, 0,6 s, `power3.inOut`). Pendant le remplissage le texte passe de orange à blanc.
- Ensuite, le **texte réapparaît avec une petite animation** : montée depuis un masque avec léger fondu (`yPercent: 100 → 0`, 0,45 s, stagger par caractère 0,012).
- Sortie du survol : le cercle se rétracte vers le point (0,45 s), le texte repasse à sa couleur d'origine avec la même petite animation, plus discrète.
- Les trois variantes de couleurs (`on-olive`, `on-orange`, `on-cream`) sont décrites dans `DESIGN.md` §5.2. Le composant se déclare une seule fois (`<a class="cta" data-variant="on-olive">`) et la logique est partagée par tous les CTA du site, y compris le bouton « Menu ».
- Focus clavier : même état que le survol.

## 11. Thème du header selon la section

- Sur fond olive, orange ou photo sombre : logo crème, bouton « Menu » blanc/orange.
- Sur fond crème (services, chiffres clés) : logo olive, bouton `on-cream` (olive/crème).
- Pilotage par ScrollTrigger (`onToggle`) avec un changement de couleur de 0,3 s, sans clignotement. Pas de `mix-blend-mode` si le rendu est instable.
- **Dégradé de lisibilité sous le logo** (V2, `retours-v2/docs/01-CORRECTIFS-ACCUEIL.md` §5) : bande fixe de `--header-grad-h` sous le logo et le bouton, quatre calques (`cream`, `olive`, `orange`, `photo`) qui se fondent l'un dans l'autre en 0,35 s. Chaque section déclare `data-header-gradient="cream | olive | orange | photo | off"` ; la dernière section active dans le DOM l'emporte (une section qui en recouvre une autre épinglée), sans déclaration : rien. Masqué menu ouvert. Dans la scène épinglée de l'accueil, un voile orange (`.experience__top`) joue ce rôle pendant la section orange, jusqu'à ce que la photo plein écran la recouvre. Revue finale (prompt 07) : le dégradé `photo` (noir à 60 % vers transparent) couvre l'intervalle où le logo passe sur le ciel clair de la photo qui grandit, de 70 % de l'agrandissement à la fin du voile (posé par `stage.js` avec `setHeaderOverride`) ; le dégradé `orange` couvre le CTA final de la page Noël, dont le titre blanc passe sous le logo à l'approche du bas de page.

## 11 bis. Landing Noël (V2, flux vertical en V3)

Source : `retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md` §1 à §3 et `05-NOEL-ANIMATIONS.md` §A à §C, puis, depuis la V3, `retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md` et les frames `retours-v3/references/noel-vertical-frames/` (le défilement horizontal de la V2 est supprimé). Scripts : `noel-stage.js` (orchestrateur), `noel-volonte.js`, `noel-flux.js`, `noel-univers.js` (arrivée), `universes.js` (interactions), `process.js` (timeline), `testimonials.js` (carrousel), `faq.js` (accordéon), `mark.js` (soulignement partagé). Styles : `noel-stage.css`, `universes.css`, `process.css`, `testimonials.css`, `faq.css`, `underline.css`. Contenu : `src/data/noel.js`.
- **Une seule scène épinglée** (avec mouvement, `html.nstage-anim`), une timeline maîtresse où 1 unité = 1 écran, comme l'accueil. Ordinateur : 6,4 écrans, trois couches dans un seul écran (de bas en haut : le hero, « Notre volonté », le flux). Nos univers n'est pas dans la scène : elle la suit dans la page (voir plus bas). Sous 900 px : le hero reste hors de la scène, qui commence à « Notre volonté » (4,5 écrans, 450 vh) ; calendriers `DESKTOP` et `MOBILE` de `noel-stage.js`.
- **Photo qui monte** (0 à 1) : la photo plein écran monte du bas (`yPercent` 100 → 0) avec un zoom inverse (1,12 → 1) et le voile qui monte à 0,45 ; le contenu du hero s'estompe, monte de 40 px et se réduit à 0,96. Le hero est masqué dès que la photo le recouvre.
- **Texte** (0,8 à 1,55) : label, puis lignes sous masque (SplitText), tags en pilule avec rotation d'entrée de ±4° vers ±2°. Tenue d'environ 0,45 écran. Le texte reste ensuite en place : c'est le cercle qui le recouvre, il n'est plus effacé.
- **Cercle** (2 à 3,2) : un cercle orange centré sur l'écran (50 %, 50 %, comme celui de l'accueil) passe de l'échelle 0,02 à 1 (`scale`, linéaire) et recouvre la photo et le texte. À l'échelle 1, son diamètre est la diagonale de l'écran : l'orange est plein quand le cercle l'est. Le flux est au-dessus de « Notre volonté », fond transparent ; le cercle lui apporte l'orange.
- **Flux** (titre à 3, quand le cercle est à 80 % ; CTA à 3,45 ; photos de 2,8 à 5,5) : titre (mots sous masque, tag qui se remplit) et CTA (montée de 16 px) fixes au centre, au-dessus des photos. Cinq photos (trois sous 900 px) montent du bas par `translateY` linéaire, à des vitesses de 80 à 108 svh par écran de scroll, et sortent par le haut, sans jamais se recouvrir (la règle et les valeurs sont dans `src/data/noel.js`, la mesure dans `docs/POINTS-A-VALIDER.md`, lignes 128 à 130). Un voile orange (`.flux__top`) estompe celles qui passent sous le logo, une fois l'orange plein. `will-change: transform` seulement pendant la scène (classe `is-live`).
- **Arrivée des univers** (dernier écran de la scène) : la section crème suit la scène dans la page avec `margin-top: -100svh` : c'est le scroll qui la fait monter du bas, par-dessus l'orange, sans animation de déplacement. Le titre orange et le CTA s'effacent de « top bottom » à « top 30 % » (scrub). Sur ordinateur, le label, le titre (mots sous masque, tag qui se remplit) et la liste (montée de 16 px, cascade de 0,06) se révèlent à l'entrée de la section dans l'écran (`top 85 %`, réversible) ; sous 900 px, `universes.js` révèle chaque bloc. L'en-tête passe en olive avec le dégradé crème parce que la section déclare `data-header-theme="light"` et `data-header-gradient="cream"` : la page Noël n'utilise plus `setHeaderOverride`.
- **Interactions des univers** (`universes.js`, V3, `retours-v3/docs/03-UNIVERS-HOVER-FLUIDE.md` ; piloté par la souris, pas par le scroll) : un seul univers est toujours ouvert, « Noël immersif » au chargement sur ordinateur, le premier sur tactile et sous 900 px. Une timeline GSAP en pause par univers, créée après `document.fonts.ready`, décrit toute l'ouverture (environ 0,95 s) : hauteur du sous-titre de 0 à `auto` par GSAP (`power3.inOut`, 0,6 s, départ et arrivée doux), lignes du sous-titre découpées par SplitText (masque) qui montent de `yPercent` 100 à 0 (`expo.out`, 0,8 s, cascade de 0,06, dès 0,10), fondu du sous-titre (0,5 s, dès 0,15), et, en parallèle, la mise en avant du titre : couleur olive-muted vers olive-deep (GSAP, plus de transition CSS), glissement du texte de 1,4 vw, point orange (scale 0 à 1, `back.out(2)`), soulignement qui se dessine (`mark.into`). L'ouverture la joue, la fermeture la rejoue à l'envers à `timeScale(1.5)` : l'ancien se referme en même temps que le nouveau s'ouvre, une interruption repart de l'état en cours sans saut. Découpe en lignes une seule fois (jamais au survol), refaite à la largeur changée ou à l'arrivée tardive des polices (`revert()`, nouvelle découpe, timeline reconstruite, état gardé). Survol : seulement sur un vrai mouvement de la souris au-dessus du titre (`pointermove` avec des coordonnées différentes), jamais sur un changement de mise en page, avec 60 ms d'intention (`gsap.delayedCall`, annulée si la souris quitte le titre). La souris qui quitte la liste laisse l'univers ouvert. Clavier : `button` avec `aria-expanded` et `aria-controls`, sous-titre dans une `region` ; le `focus-visible` ouvre l'univers sans délai, flèches haut et bas, Début et Fin. Tactile et sous 900 px : tap = accordéon, un seul ouvert. Mouvement réduit : mêmes changements d'état en un fondu de 0,2 s, sans découpe ni mouvement. `will-change` seulement sur les lignes du sous-titre, le temps de l'animation. Photo-carte : toutes les images superposées dans le DOM, fondu croisé de 0,6 s avec zoom arrière 1,06 vers 1 (une seule photo pour l'instant : rien ne change à l'écran).
- **Notre fonctionnement** (`process.js`, V3 bis, `retours-v3/docs/02-FONCTIONNEMENT-TIMELINE.md` et la timeline de référence `retours-v3/references/timeline-relume/`, dont seul le mouvement est repris) : pas d'épinglage, le scroll est naturel. Sur ordinateur, deux colonnes : à gauche le label et le titre, en `position: sticky` (`top: 20svh`, ils s'arrêtent avec la dernière étape), à droite la timeline ; sous 900 px, une colonne et un titre non sticky. Les cinq étapes sont dans le flux, séparées par `max(10rem, 20svh)` (`clamp(6rem, 28svh, 12rem)` sous 900 px), chacune avec son point sur la ligne. Le centre de l'écran est le repère de tout. **Ligne** : piste sable du premier au dernier point (extrémités relues à chaque `refreshInit`), remplissage orange en `scaleY` (origine en haut), `scrub: true`, de « le premier point est au centre de l'écran » à « le dernier y est » : son bord bas suit donc le centre de l'écran. **Points** : un point sable avec, par-dessus, une couche orange ; un ScrollTrigger par point (`center 50%`, `end: "max"`) joue une timeline de 0,4 s en `power2.out` (point de 1 à 1,25, opacité de la couche de 0 à 1) et la rejoue à l'envers en remontant. **Étapes** : le titre, puis la description 0,06 plus tard, montent de `y` 48 à 0 en gagnant de l'opacité (0 à 1), en scrub de `top 85%` à `top 55%` ; une fois montée dans le tiers haut de l'écran (de `top 33%` à `top 10%`), l'enveloppe du texte passe à 0,3 d'opacité sans disparaître (le point reste plein). À l'entrée de la section : label, titre par mots, tag « échange » qui se remplit. `invalidateOnRefresh: true` ; nouveau recalcul si les polices arrivent après l'initialisation (`dbal:relayout`). Seuls `transform` et `opacity` bougent (la couleur du point est une opacité, pas une couleur animée). Mouvement réduit et sans JavaScript : aucune animation, ligne pleine, points orange, étapes affichées (le titre reste sticky : c'est de la mise en page).
- **Témoignages** (`testimonials.js`, frame 16) : section non épinglée. À l'entrée (70 % de l'écran, réversible) : l'icône de guillemets grandit en pivotant (0,7 → 1, -8° → 0°, 0,7 s, `back.out(1.6)`), la citation se révèle ligne par ligne, puis le nom et le poste en fondu et montée. Carrousel de 4 avis, sans lecture automatique, avec bouclage : au changement, la citation sortante part par lignes (montée de 16 px, opacité 0, décalage de 0,03 s), puis la suivante entre par lignes (0,06 s) ; le nom et le poste font un fondu croisé. Un clic pendant une transition la termine aussitôt avant d'en lancer une autre (7 clics rapides : un seul avis visible, aucun reste de découpage). La hauteur du plus haut des avis est réservée : ni le filet ni les flèches ne bougent. Accessibilité : région `carousel`, zone `aria-live="polite"`, seul l'avis courant est affiché (les autres ont `hidden`), position « Avis 2 sur 4 » lue dans chaque avis, boutons `aria-label`, flèches gauche et droite quand le focus est sur les boutons. Sans JavaScript, les quatre avis sont affichés, les flèches restent cachées.
- **FAQ** (`faq.js`, `reveal.js`, frame 17) : entrée par `data-reveal` : titre par mots et tag « fréquemment » qui se remplit, carte d'aide, cartes en cascade (0,07 s, montée de 24 px, réglés par `data-reveal-y` et `data-reveal-step`). Accordéon : un seul panneau ouvert à la fois, le premier d'emblée. Ouvrir une réponse referme l'autre, les deux hauteurs s'animent ensemble (0,5 s, `power3.inOut`, `height: auto` rendu au CSS) ; le chevron pivote de 180° et passe de l'orange pâle à l'orange plein (CSS). Le bouton resserre son bas à l'ouverture pour que l'anneau de focus n'écrase pas la réponse. `button` dans un `h3`, `aria-expanded`, `aria-controls`, panneau `role="region"`, flèches haut et bas, Début et Fin. JSON-LD `FAQPage` généré depuis les mêmes données. Sans JavaScript, toutes les réponses sont affichées.
- **CTA final** : inchangé (design et animation), sans lien téléphone.
- **Mouvement réduit et sans JavaScript** : pas d'épinglage. Sections empilées : hero, photo avec texte, titre et CTA avec les photos en grille (cinq sur ordinateur, trois sous 900 px), puis les univers (photo au-dessus, accordéon sous 900 px), la timeline statique, les témoignages (un avis à la fois, flèches sous l'avis) et la FAQ en une colonne. **Mobile avec mouvement** : le même flux vertical (cercle, photos qui montent, univers qui montent), trois photos, hero hors de la scène ; le reste est empilé.

## 11 ter. Frise de logos clients (pages secondaires)

Source : DESIGN.md §5.9 (décision du fondateur : marquee GSAP, statique en mouvement réduit). `src/scripts/logos.js`.
- **Défilement continu** vers la gauche, `ease: "none"`, boucle infinie, 40 px par seconde (constante `SPEED`). Seul `transform` est animé (`x` de la liste).
- **Boucle sans à-coup** : la liste est dupliquée (copies en `aria-hidden`, assez pour couvrir la largeur du cadre plus un cycle) et translatée d'un cycle exact (du premier logo à la place de sa copie, écart compris).
- **Cadre** : `.logos__frame` rogne et fond les bords (masque dégradé de 6 %). Sa hauteur est celle de la liste statique : aucun décalage de mise en page quand la liste passe sur une seule ligne.
- **Arrêt** : au survol et au focus du cadre (la vitesse tombe à 0 en 0,5 s et revient de même) ; hors écran, la tween est en pause (`ScrollTrigger.onToggle`) et `will-change: transform` n'est posé que pendant le défilement.
- **Refait** quand la largeur du cadre change (observateur de taille, 150 ms de délai).
- **Statique** : sous 900 px, avec `prefers-reduced-motion: reduce`, ou sans JavaScript, la liste reste centrée et passe à la ligne ; les logos sont de simples images (`ul` de `li`). Nettoyage par `gsap.matchMedia` (les copies et le cadre sont retirés).

## 11 quater. Curseur feuille (V8, `retours-v8/docs/01-CURSEUR-FEUILLE.md`)

Un seul élément DOM (`div.cursor` et son SVG, ajouté au body par `src/components/cursor.js`, importé par `main.js`), aucune dépendance. Seuls `transform` et `opacity` bougent.

- **Actif** seulement avec `(hover: hover) and (pointer: fine)`, au-dessus de 900 px, hors contraste forcé, hors iframe. Le curseur système est masqué (`html.has-cursor`) ; il revient à la touche Tab (la feuille s'efface jusqu'au prochain vrai mouvement). La feuille n'apparaît qu'au premier mouvement, posée sous le pointeur ; à la sortie de la fenêtre elle s'estompe (0,2 s) et revient sous le pointeur, sans glisser depuis un coin.
- **Suivi** : `gsap.quickTo` sur `x` et `y` (0,22 s, `power3`), une seule écoute `pointermove` passive. Rotation : -20° au repos, elle suit le sens du mouvement (0,9° par pixel, au plus 20°, amorti 0,45 s) puis revient. Le point actif est le **centre** de la feuille : le clic tombe sous son centre.
- **Thème**, lu une fois par frame sur l'élément sous le pointeur (celui du dernier `pointermove`, `elementFromPoint` quand la page défile sous un pointeur immobile) : `data-cursor-theme` s'il existe ; `.cta`, `.tag` et les photos (`img` et `video` d'au moins 20 000 px²) en `paper` ; le header suit son dégradé (menu ouvert : `paper`) ; sinon `data-header-gradient` puis `data-header-theme` de la section (les attributs du header, aucun de plus) ; la page nue (`html`, `body`, `main`) est crème ; tout le reste est sombre, comme pour le header.
- **États** (`data-state`) : repos ; lien (`a[href]`, `button`, `[data-cursor]`...) : x1,8 en `back.out` 0,35 s, contour, un quart de tour puis retour, un point central sur les CTA ; texte (`p`, titres, champs de saisie, `data-cursor="text"`) : x0,6 ; glisser (`[data-cursor="drag"]` et tout `[aria-roledescription="carousel"]`) : feuille horizontale allongée (x1,7 sur x0,8) et deux flèches ; clic : x0,8 puis retour (`back.out`). Le plus proche ancêtre interactif l'emporte ; le texte est le dernier recours.
- **Mouvement réduit** : aucun amorti, aucune rotation, aucune échelle, aucune impulsion ; la feuille suit directement la souris et ne change que de couleur et de forme (plein ou contour, point).

## 11 quinquies. Sliders, révélations, galeries et recouvrements (V8, `retours-v8/docs/02-SLIDERS-ET-SECTIONS-ORANGE.md` et G5)

Seuls `transform`, `opacity` et `clip-path` bougent (le `clip-path` et le masque de la galerie sont fixes).

**Slider « Trois matières »** (`scripts/bureaux-matieres.js`, une timeline scrubée, `scrub: 1`). Chaque glissement est une progression `t` de 0 à 1 :
- les titres glissent sur le rail de 0 à 0,6 (`power2.inOut`) ;
- le voile d'échange (`.mat__dim`) monte de 0 à 0,6 d'opacité de `t` = 0 à 0,45, tient jusqu'à 0,55 puis redescend (écran assombri à 78 % au pic) ;
- à `t` = 0,5 la photo suivante passe à l'opacité 1 et la précédente à 0 : jamais deux photos à mi-opacité (mesuré : au plus un fond visible à chaque pas de 50 px) ;
- la photo entrante se pose de l'échelle 1,06 à 1 de 0,5 à 1 ; le paragraphe sort de 0,4 à 0,5 et entre de 0,5 à 0,6 (jamais deux paragraphes lisibles ensemble) ;
- le rail est mesuré à chaque refresh (largeur de chaque titre) : le centre du titre actif tombe sur `clientWidth / 2` (écart mesuré 0,02 px au plus), les voisins sont séparés de lui par `RAIL_GAP` de chaque côté ; sous 900 px un titre occupe un écran. Le bloc titre et paragraphe est centré par une grille (`align-content: center`, sous-grille partagée par les trois slides).

**Révélation à l'entrée** (`scripts/reveal-on-enter.js`, `DESIGN.md` §5.12) : surtitre (0,5 s, 12 px), titre en lignes sous masque (`yPercent` 100 vers 0, décalage 0,08 s, `power3.out` 0,9 s), pastille par `clip-path` (0,6 s) après le texte voisin, paragraphe et bouton (0,7 s, 16 px, 0,15 s après le titre), photos par `clip-path` de bas en haut (1 s, `power3.inOut`, décalage 0,12 s) avec le média de 1,15 à 1. Déclenchée à `top 75%` ; se rejoue et se défait comme les autres révélations du site, ou une seule fois (`data-reveal-once`). Mouvement réduit : rien de caché.

**Galeries qui montent** (`components/gallery.js`, `DESIGN.md` §5.13). Photos en colonnes de chaque côté du texte, piles (`under`, `gap`) : celle du dessous ne monte jamais plus vite que celle du dessus, l'écart est en vw. Accueil : la carte du dessous attend sous celle du dessus (`photos-scroll.js`, `under` dans `stage.js`) et sa durée est allongée au besoin pour ne pas la rattraper. Plus de dérive horizontale sur Design. Rognage sous le header : `clip-path: inset(var(--gallery-top) 0 0 0)` et masque dégradé sur `--gallery-fade`.

**Arrivée d'une section par-dessus une autre** (`scripts/bureaux-scene.js`, `overlapOptions`, `markOverlap`). Durée : au moins 1 écran de scroll (100 % de la hauteur), `scrub: 1` ; la marge négative de la section qui arrive est `calc(var(--overlap, 1) * -100svh)`. Une page règle la durée et le lissage de l'arrivée de la section qui recouvre une autre par `overlapScreens` (en écrans, au moins 1) et `overlapScrub` dans les données de la section recouverte (`data-overlap-screens`, `data-overlap-scrub`, `components/page-sections.js`). Appliqué à la galerie de Bureaux et de Design, aux trois matières, à la tenue de l'avis et d'un écran (`bureaux-hold.js`) et à la section « styles » ; aucun réglage de page n'est posé par ce chantier (prompts 05 à 07).

## 12. Responsive et mouvement réduit

- `(max-width: 900px)` : cercle et photos simplifiés (cercle conservé, photos réduites à 2, pins ≤ 200 vh), menu en une colonne avec sous-liens en accordéon, chiffres clés en pile verticale, footer en révélation conservé si fluide, sinon statique.
- `prefers-reduced-motion: reduce` : aucun pin, aucune parallaxe, pas de cercle qui grandit (sections empilées avec fondu simple), CTA avec simple changement de couleur, menu avec fondu de 200 ms.
- Tester à 1280, 1440, 1728, 1920, 1024 et 390 px.
