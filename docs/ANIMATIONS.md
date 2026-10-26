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
- **Photos flottantes** (`public/assets/images/home-scroll/`) : `bw-graminees-sacre-coeur`, `bw-facade-fleurie`, `bw-ailes-floral-fashion-show`, `bw-feuillage` (+ optionnellement `bw-lavande-gros-plan`). Cartes de 280 à 360 px de large, ratio portrait, rayon 14 px, ombre nulle.
  - Conteneur avec `perspective: 1200px`.
  - Chaque carte démarre sous l'écran (`y: 120 vh`, `z: -300 à 0`, `rotateX` léger) et traverse l'écran vers le haut avec une **vitesse propre** (parallaxe : cartes plus « proches » plus rapides). Positions horizontales alternées gauche et droite, certaines **tronquées par le bord de l'écran** comme sur les frames (une carte à gauche à 104 px, une à droite coupée au bord, une en bas à gauche coupée, une en bas à droite).
  - Jamais plus de 3 à 4 cartes visibles en même temps. Aucune ne doit recouvrir le titre ni le CTA (zone centrale libre, ~40 % de la largeur).
  - Impression de **mouvement et de profondeur**, pas de vitesse excessive : `scrub: 1`.
  - Légère rotation individuelle (± 2°) et micro-décalage horizontal pendant la traversée.

## 5. Photo qui s'agrandit, dégradé noir, texte « Notre approche »

Frames : `home-animation-08` à `11`.
- La **dernière photo** est `bw-lavande-tour-eiffel-large.png` (version « extended »). Elle apparaît par le **bas** au centre, taille d'une carte (~280 × 190 px), puis **s'agrandit** au scroll jusqu'à couvrir **toute la section** et devenir son fond.
- Implémentation recommandée : une image `position: absolute; inset: 0` plein écran dont on anime `clip-path: inset(top right bottom left round 14px)` depuis un petit rectangle centré en bas vers `inset(0 round 0)`, plus un léger `scale: 1.15 → 1` sur l'image. Pas d'animation de `width`/`height`.
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
4. Les **liens de gauche** montent depuis un masque (`yPercent: 110 → 0`, stagger 0,07 s). « (32) » apparaît en fondu juste après « Réalisations ».
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
- **Dégradé de lisibilité sous le logo** (V2, `retours-v2/docs/01-CORRECTIFS-ACCUEIL.md` §5) : bande fixe de `--header-grad-h` sous le logo et le bouton, deux calques (`cream`, `olive`) qui se fondent l'un dans l'autre en 0,35 s. Chaque section déclare `data-header-gradient="cream | olive | off"` ; la dernière section active dans le DOM l'emporte (une section qui en recouvre une autre épinglée), sans déclaration : rien. Masqué menu ouvert. Dans la scène épinglée de l'accueil, un voile orange (`.experience__top`) joue ce rôle pendant la section orange, jusqu'à ce que la photo plein écran la recouvre.

## 12. Responsive et mouvement réduit

- `(max-width: 900px)` : cercle et photos simplifiés (cercle conservé, photos réduites à 2, pins ≤ 200 vh), menu en une colonne avec sous-liens en accordéon, chiffres clés en pile verticale, footer en révélation conservé si fluide, sinon statique.
- `prefers-reduced-motion: reduce` : aucun pin, aucune parallaxe, pas de cercle qui grandit (sections empilées avec fondu simple), CTA avec simple changement de couleur, menu avec fondu de 200 ms.
- Tester à 1280, 1440, 1728, 1920, 1024 et 390 px.
