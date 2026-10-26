# 05 : Page Noël V2, animations image par image

Source : `references/noel-frames/noel-page-01.jpg` à `noel-page-17.jpg` (17 images, 1728 x 1024, extraites du PDF du fondateur). **Regarder toutes les images dans l'ordre avant d'implémenter.** Les animations réutilisent le moteur de l'accueil : GSAP, ScrollTrigger, SplitText, Lenis, mêmes easings, même révélation de texte par lignes et par mots, mêmes title tags animés. Le résultat doit être très fluide, sans saut, réversible au scroll arrière.

Principes communs (identiques à `docs/ANIMATIONS.md` de l'accueil) : uniquement `transform`, `opacity`, `clip-path` ; `scrub` de 0,6 à 1 ; `invalidateOnRefresh: true` ; `anticipatePin: 1` ; état initial défini en CSS (pas de flash) ; `prefers-reduced-motion` géré ; hauteur de page identique au chargement et au resize.

## Table des correspondances (frames)
| Frames | Étape |
|---|---|
| 01 | Hero au repos |
| 02, 03 | La photo « Notre volonté » monte sur le hero |
| 04, 05 | Texte « Notre volonté », puis disparition progressive |
| 06 | La photo rétrécit et glisse vers la gauche, l'orange apparaît |
| 07 à 11 | Flux horizontal : photos de droite à gauche, titre et CTA |
| 12, 13 | La section « Nos univers » arrive par la droite |
| 14 | Univers : état actif (Noël immersif) |
| 15 | Fonctionnement (timeline) |
| 16 | Témoignages |
| 17 | FAQ |

## A. Hero (frame 01)
- Intro au chargement comme l'accueil : ligne de positionnement, H1 par mots depuis un masque (SplitText), title tag « Noël » qui se remplit (clip-path pilule), sous-titre, CTA. Contenu centré.
- Feuilles de fond fixes (pas d'animation, éventuellement un très léger parallaxe).

## B. La photo monte sur le hero (frames 02 et 03)
- Le hero est **épinglé**. La section photo « Notre volonté » (plein écran) monte **depuis le bas** par-dessus (`translateY(100%)` vers `0`), en scrub (≈ 100 vh de scroll).
- Pendant la montée, le contenu du hero s'estompe (opacité 1 vers 0), monte légèrement (≈ -40 px) et rétrécit un peu (scale 1 vers 0,96). À frame 03, le texte du hero est déjà à ≈ 40 % d'opacité et la photo couvre la moitié basse de l'écran.
- La photo a un léger zoom inverse (scale 1,12 vers 1) pour de la profondeur.
- Dégradé noir du voile : monte de 0 à ≈ 0,5 pendant la montée.

## C. Texte « Notre volonté » (frames 04 et 05)
- Photo plein écran, voile noir ≈ 0,5. Le label `• NOTRE VOLONTÉ` apparaît (fondu + montée de 12 px), puis le texte révélé **ligne par ligne** (SplitText `lines`, masque, stagger 0,08 s, `power3.out`). Les title tags se remplissent (clip-path pilule de gauche à droite, avec légère rotation d'entrée de ±4° vers ±2°) puis leur texte apparaît.
- Un temps de lecture : tenir ≈ 60 vh de scroll.
- **Disparition progressive au scroll** (frame 05) : l'opacité du texte et du label baisse progressivement (1 vers 0) en scrub, avec une légère montée (-30 px). Les mots partent par ligne avec un léger décalage.
- Tags jamais rognés (voir `01-CORRECTIFS-ACCUEIL.md` §2).

## D. La photo rétrécit et glisse à gauche (frame 06, début de 07)
- Pendant que le texte disparaît, la photo plein écran **rétrécit** (`clip-path: inset(...)` animé avec coins arrondis 14 px, ou `scale` du conteneur avec `border-radius` compensé) et **glisse vers la gauche**, jusqu'à devenir une petite vignette dans le coin bas gauche de l'écran (frame 07 : vignette cadrée à gauche, coupée par le bord).
- Le fond **orange** apparaît derrière (c'est la section suivante, déjà en place sous la photo). À frame 06, la photo occupe ≈ 77 % de la largeur à gauche, marge haute et basse ≈ 5 %, l'orange est visible à droite et sur les bords.
- Coins de la photo **toujours arrondis (14 px)** pendant toute la réduction.
- La photo devient la **première photo du flux** de l'étape suivante (continuité visuelle : c'est le plafond Eataly qui sort à gauche).
- Pendant ce temps le titre « Apportons la magie de Noël que méritent vos décors. » apparaît dynamiquement : mots depuis un masque (stagger 0,06 s), title tag « la magie de Noël » qui se remplit, puis le CTA (fondu et montée de 16 px). Durée de cette étape : ≈ 100 vh de scroll.

## E. Flux horizontal de photos (frames 07 à 11)
Section orange **épinglée** (≈ 200 vh de scroll, `scrub: 1`). Les photos défilent **horizontalement, de la droite vers la gauche**, et disparaissent au fil du scroll sur le côté gauche. Ce n'est **pas** un défilement vertical.

- Le titre et le CTA sont **centrés et fixes** (ils ne bougent pas), toujours **au-dessus** des photos dans l'ordre d'empilement. Les photos passent derrière le texte (frames 10 et 11 : une photo passe sous « Apportons »).
- Photos (rayon 14 px, ombre nulle, N&B grainé tel que fourni) et positions de départ (en % du viewport 1728 x 1024, d'après la frame 07) :

| Photo | Fichier | Position de départ (x, y du coin haut gauche) | Taille (largeur x hauteur) | Vitesse |
|---|---|---|---|---|
| Plafond Eataly (vignette issue de l'étape D) | `noel-bw-eataly-plafond.jpg` | x ≈ -2 %, y ≈ 61 % (coupée par le bord gauche et le bas) | ≈ 20 % x 39 % | 1,0 |
| Branches givrées | `noel-bw-branches-givrees.jpg` | x ≈ 15 %, y ≈ -4 % (coupée en haut) | ≈ 16 % x 27 % | 1,25 |
| Salon doré N&B | `noel-bw-salon-dore.jpg` | x ≈ 47 %, y ≈ 74 % (coupée en bas) | ≈ 17 % x 33 % | 1,1 |
| Portail à couronne | `noel-bw-portail-couronne.jpg` | x ≈ 78 %, y ≈ -8 % (coupée en haut) | ≈ 21 % x 42 % | 1,5 |
| Sapins sous verrière | `noel-bw-sapins-verriere.jpg` | x ≈ 84 %, y ≈ 66 % (coupée en bas et à droite) | ≈ 17 % x 38 % | 1,3 |

  Ces positions sont indicatives : la référence est l'image. Placer les photos en haut et en bas de l'écran, **zone centrale libre** pour le titre et le CTA, 4 à 5 photos visibles à la fois, certaines coupées par les bords.
- Mouvement : chaque photo a une `translateX` de sa position de départ jusqu'à sortir entièrement par la gauche (`-(x + largeur + 10 %)`), multipliée par sa vitesse (effet de profondeur, vitesses de 1,0 à 1,5). Légère rotation optionnelle (±1,5°) et léger `translateY` de parallaxe (±3 %).
- Les photos qui sont à droite au départ (portail, sapins) **arrivent par la droite** : prévoir une ou deux photos supplémentaires en réserve à droite si le flux semble vide en fin de course (utiliser les mêmes fichiers recadrés différemment ou la photo `noel-bw-branches-givrees.jpg` en seconde instance).
- Fin du flux (frames 11 et 12) : le titre et le CTA baissent en opacité (1 vers 0,4) à mesure que la section suivante recouvre la scène.

## F. La section « Nos univers » arrive par la droite (frames 12 et 13)
- La section crème « Nos univers » arrive **depuis la droite**, **par-dessus** la section orange (`translateX(100%)` vers `0`, scrub ≈ 60 vh). À frame 12, la bande crème occupe les 30 % de droite avec la photo-carte visible dans la bande. À frame 13, la bande orange ne couvre plus que ≈ 20 % à gauche, avec la photo du portail qui sort.
- La section orange sous elle est épinglée et se décale légèrement vers la gauche (parallaxe ≈ -10 %) pendant la superposition.
- À l'arrivée, la photo-carte « salon doré couleur » finit sa mise en place (`scale` 0,94 vers 1, `opacity` 0,6 vers 1), puis le label, le titre (mots depuis un masque, title tag « votre Noël ») et la liste (stagger 0,06 s, montée de 16 px).
- Une fois la section en place, elle se désépingle et défile normalement.

## G. Nos univers : interaction au survol (frame 14)
Le comportement est **piloté par la souris** (pas par le scroll) :
- **Repos** : les 5 titres en `--sand` #C9BDA0, sans point ni soulignement, sans sous-titre.
- **État actif** (survol d'un titre, ou focus clavier, ou état par défaut) : sur le titre actif, en parallèle :
  - la couleur passe de `--sand` à `--olive-deep` #4C430B (0,35 s) ;
  - un **point orange** apparaît à gauche (scale 0 vers 1, 0,35 s, `back.out(2)`), le texte glisse de ≈ 24 px vers la droite ;
  - un **soulignement orange** (2 px) se dessine de gauche à droite (`scaleX`, origine gauche, 0,45 s, `power3.out`) ;
  - le **sous-titre** se déploie dessous (`height: auto` géré par GSAP, `autoAlpha`, montée de 6 px, 0,45 s, `power3.out`). Les titres suivants descendent en douceur (la hauteur de la liste s'anime, sans saut).
- **Changement d'univers** : quand la souris passe d'un titre à un autre, **en même temps** l'ancien titre actif joue l'animation inverse (point qui disparaît, soulignement qui se retire vers la droite, sous-titre qui se replie, couleur qui revient au sable) et le nouveau joue l'animation d'activation. Utiliser une timeline par item (`play()` / `reverse()`), `overwrite: "auto"`, pour supporter les passages rapides sans saccade.
- **Quand la souris quitte la liste** : l'univers actif reste (il y a toujours un univers ouvert).
- **État par défaut au chargement** : `Noël immersif` (c'est l'état de la maquette).
- Photo : une seule photo-carte fixe (le salon doré en couleur). Option pour plus tard : chaque univers a un champ `photo` dans les données ; si les photos diffèrent, fondu enchaîné de 0,5 s à chaque changement d'univers. En attendant, les 5 univers pointent vers la même photo.
- Tactile (< 900 px ou `hover: none`) : tap sur un titre = activation (accordéon), un seul ouvert à la fois, premier ouvert par défaut. Mêmes états au clavier (`Tab`, Entrée) avec `aria-expanded` et `aria-controls` sur chaque titre (boutons) et sous-titre dans une région associée.

## H. Notre fonctionnement : timeline (frame 15)
- Section crème **épinglée** (≈ 250 vh de scroll, `scrub: 1`). Colonne gauche : label et titre (titre fixe). Colonne droite : timeline verticale avec une **ligne de progression** (fond `--grey-line`, remplissage `--orange`) et 5 points.
- **Progression** : `p` de 0 à 1 remplit la ligne orange de haut en bas (`scaleY`, origine haut). L'**opacité de chaque étape dépend de la progression** :
  - étape pas encore atteinte : titre et description à ≈ 30 % d'opacité (couleur `--sand`), point gris ;
  - étape atteinte (la ligne a dépassé son point) : texte à 100 % d'opacité en `--olive`, point orange qui « pop » (scale 1,3 vers 1) ;
  - **étape courante** (la dernière atteinte) : titre en `--olive-deep`, **soulignement orange** qui se dessine (comme dans les univers), description visible en pleine opacité ; les étapes précédentes gardent le titre à 100 % sans soulignement et leur description à 70 %.
- Les transitions d'opacité sont adoucies (`gsap.to` rapide déclenché aux seuils, ou interpolation en scrub), pas de bascule brusque.
- Apparition de la section : titre par mots, tag « échange » qui se remplit, étapes en cascade.
- Mobile / mouvement réduit : pas de pin, étapes empilées avec ligne verticale statique et apparition au scroll.
- Objectif de la refonte : design **plus clair et moins brouillon** que la V1 (peu de couleurs, hiérarchie nette, marges généreuses).

## I. Témoignages (frame 16)
- Section crème **non épinglée**. À l'entrée dans le viewport (`ScrollTrigger` `start: "top 70%"`) : icône de guillemets (scale 0,7 et rotation -8° vers 1 et 0°, 0,7 s, `back.out(1.6)`), citation révélée **ligne par ligne**, nom puis poste en fondu et montée.
- **Carrousel** de 4 avis (voir `04-NOEL-STRUCTURE-ET-CONTENU.md` §6) : flèches suivant / précédent. Au changement, la citation sortante part par lignes (montée -16 px, opacité 0, stagger 0,03 s), puis la suivante entre par lignes. Nom et poste en fondu croisé. Les boutons-flèches ont un léger scale au survol (1,06) et l'animation de remplissage des CTA (cercle qui se remplit) est facultative.
- Pas d'autoplay. Navigation clavier (flèches, `Tab`). Région `aria-live="polite"`, `aria-roledescription="carousel"`, boutons avec `aria-label` (« Avis précédent », « Avis suivant »), indicateur de position pour les lecteurs d'écran (« Avis 2 sur 4 »).

## J. FAQ (frame 17)
- Entrée : titre par mots, tag « fréquemment » qui se remplit, carte d'aide (fondu et montée), cartes de l'accordéon en cascade (stagger 0,07 s, montée de 24 px).
- Accordéon : ouverture/fermeture fluide, `height: auto` géré par GSAP (0,5 s, `power3.inOut`), chevron qui pivote de 180° et change de fond (orange plein quand ouvert, orange pâle quand fermé). **Un seul ouvert à la fois**, le premier ouvert au chargement.
- Accessibilité : chaque question est un `<button>` avec `aria-expanded` et `aria-controls`, le panneau a `role="region"` et `aria-labelledby`. Touche `Entrée` et `Espace`.
- JSON-LD `FAQPage` généré depuis les mêmes données.

## K. CTA final et footer
Inchangés (animations validées). Le CTA final n'a plus de lien téléphone. Le footer prend le nouveau design.

## L. Header sur la page Noël
Thème logo et bouton piloté par section : clair (logo blanc) sur olive, photo, orange ; sombre (logo olive, bouton `on-cream`) sur les sections crème. Dégradé de lisibilité : `cream` sur univers, fonctionnement, témoignages, FAQ ; `off` ailleurs (voir `01-CORRECTIFS-ACCUEIL.md` §5).

## M. Responsive (< 900 px) et mouvement réduit
- Hero centré identique. Pas d'épinglage : « Notre volonté » devient une section photo avec texte (hauteur 100 svh), puis la section orange affiche le titre et le CTA avec **2 ou 3 photos** en ligne horizontale défilante simple (`overflow-x: auto`, `scroll-snap`) ou en grille, sans animation de flux.
- Univers : photo au-dessus, liste en accordéon. Fonctionnement : timeline statique. Témoignages : un avis à la fois avec flèches. FAQ : accordéon pleine largeur.
- `prefers-reduced-motion` : fondus courts de 200 ms, aucun pin, aucun défilement horizontal automatique, titre et CTA toujours visibles.
