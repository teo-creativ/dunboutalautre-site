# 01. Page Noël : le scroll vertical (remplace le scroll horizontal)

Références visuelles : `references/noel-vertical-frames/noel-vertical-01.jpg` à `10.jpg` (le PDF `Hero_merged_1`, page 11 exclue).
État actuel à remplacer : `references/etat-actuel-v2/01`, `03`, `04`, `05` (le flux horizontal et l'arrivée de "Nos univers" par la droite).

## 1. Principe

Le scroll horizontal (photos qui défilent de droite à gauche, "Nos univers" qui arrive par la droite) est **entièrement supprimé**. Il est remplacé par un enchaînement vertical où tout monte du bas vers le haut. Le visiteur scrolle normalement, rien ne glisse sur le côté.

Le fil de l'histoire, en 6 temps :

1. **Notre volonté** : texte sur photo de fond (inchangé).
2. Un **cercle orange apparaît progressivement** au scroll et recouvre la photo. C'est l'écho du cercle orange de l'accueil.
3. La **section orange** est pleine : titre "Apportons **la magie de Noël** que méritent vos décors." et CTA "Discutons de votre projet".
4. Les **photos montent du bas vers le haut**, à des vitesses différentes, derrière le titre.
5. Les photos sortent par le haut. Le titre s'efface.
6. **"Nos univers" arrive depuis le bas**, par-dessus l'orange (superposition), à la place de l'ancienne arrivée par la droite.

## 2. Lecture frame par frame

| Frame | Ce qu'on voit | Ce que ça demande |
|-------|---------------|-------------------|
| 01 | Notre volonté : texte centré sur la photo de fond, tags en pastilles | État de départ, identique à la V2 (animations de tags conservées). |
| 02 | Un cercle orange apparaît dans la partie haute, au centre, par-dessus le texte et la photo | Début du cercle : petit, centré horizontalement, vers 40 à 45 % de la hauteur. |
| 03 | Le cercle a grandi (environ 80 % de la largeur). Les premières photos pointent depuis le bas de l'écran | Le cercle continue de grandir. Les premières photos entrent par le bas. |
| 04 | Écran entièrement orange. Titre et CTA centrés. Photos à mi-hauteur : branches à gauche, portail à droite. D'autres photos plus bas : plafond en bas à gauche, salon au centre, sapins en bas à droite | Le titre et le CTA sont fixes au centre. Les 5 photos sont positionnées en quinconce, certaines déjà en bas de l'écran. |
| 05 à 08 | Les photos montent. Elles passent derrière le titre, vitesses différentes, et sortent par le haut | Effet parallaxe vertical. Titre et CTA restent fixes pendant tout ce temps. |
| 09 | Le titre s'efface. "Nos univers" (fond crème) arrive depuis le bas, carte photo à gauche, label et titre à droite | "Nos univers" monte par-dessus l'orange. |
| 10 | État final de "Nos univers" : "Noël immersif" actif avec son sous-titre | La section est en place, le scroll reprend normalement. |

## 3. Structure et mécanisme

Une seule zone "flux" qui contient la fin de Notre volonté, le cercle, la section orange et les photos. Elle est suivie de "Nos univers", qui la recouvre.

### Zone sticky avec progression au scroll

```
<section class="noel-flow">            hauteur = 600vh (valeur de départ)
  <div class="noel-flow__stage">       position: sticky; top: 0; height: 100vh; overflow: hidden
    .noel-flow__volonte                Notre volonté (photo + texte), z 1
    .noel-flow__circle                 cercle orange, z 2
    .noel-flow__orange                 fond orange + titre + CTA, z 3
    .noel-flow__photos                 5 photos en absolu, z 3 sous le titre
    .noel-flow__title                  titre + CTA, z 4 (au-dessus des photos)
  </div>
</section>
<section class="noel-univers">         margin-top: -100vh; position: relative; z-index: 5
```

- `.noel-flow` fait 600vh. `.noel-flow__stage` reste collé à l'écran pendant toute la progression.
- `margin-top: -100vh` sur "Nos univers" fait qu'il remonte naturellement par-dessus la zone sticky pendant les derniers 100vh de scroll. Aucun pin supplémentaire n'est nécessaire pour son arrivée.
- Si le projet utilise déjà `pin: true` de ScrollTrigger pour d'autres sections, c'est acceptable de faire pareil ici, à condition d'obtenir exactement le même rendu (et le même recouvrement de "Nos univers" par le bas).
- Une seule timeline GSAP **scrubée** pilote Notre volonté, le cercle, les photos. Déclencheur : `.noel-flow`, `start: "top top"`, `end` à la fin du sticky (hauteur de `.noel-flow` moins 2 écrans).
- Lenis reste branché sur ScrollTrigger comme partout ailleurs.

## 4. Découpage de la timeline (progression de 0 à 1)

| Plage | Phase | Détail |
|-------|-------|--------|
| 0 à 0,10 | Tenue | Notre volonté lisible, rien ne bouge. |
| 0,10 à 0,32 | Cercle | Le cercle passe de `scale(0.02)` à `scale(1)`. Il recouvre la photo. Le texte de Notre volonté reste dessous, il est simplement recouvert. |
| 0,24 à 0,40 | Entrée du titre | Quand le cercle est à environ 80 %, le titre apparaît ligne par ligne (masque, `yPercent` 100 vers 0), puis le CTA (opacité et léger `y`). |
| 0,30 à 0,45 | Entrée des photos | Les photos partent de `y: 110vh` (hors écran en bas) vers leur position de départ en quinconce. |
| 0,45 à 0,85 | Montée | Chaque photo monte avec sa vitesse propre (tableau ci-dessous) jusqu'à sortir par le haut. |
| 0,85 à 1 | Fin | Le titre et le CTA s'effacent (opacité 1 vers 0, `y` de 0 à -40px). "Nos univers" prend le relais (voir §6). |

### Le cercle

- Élément rond (`border-radius: 50%`), couleur `var(--orange)`.
- Diamètre : `calc(max(100vw, 100vh) * 1.9)`, de façon à couvrir tout l'écran, coins compris, quand `scale = 1`.
- Origine : centré horizontalement, vers `42%` de la hauteur (`transform-origin` au centre du cercle, cercle positionné pour que son centre soit à ce point).
- Animation : uniquement `transform: scale()`, de 0.02 à 1, `ease: "none"` (le scrub donne déjà la fluidité). Même technique que le cercle de l'accueil (V2) : s'y référer et réutiliser les mêmes réglages de ressenti.
- Au-dessus de la photo et du texte de Notre volonté, en dessous du titre orange et des photos.

### Les 5 photos (réutiliser `assets/images/noel-v2/`)

Positions en pourcentage de l'écran (1728 x 1030), valeurs de départ à affiner sur les frames 04 à 08 :

| Photo | Position horizontale | Largeur | Départ vertical | Vitesse (distance parcourue) |
|-------|----------------------|---------|-----------------|------------------------------|
| `noel-bw-branches-givrees` | gauche, x ≈ 6 % | ≈ 21 vw | haut de l'écran, y ≈ 30 % | 130 vh (rapide) |
| `noel-bw-portail-couronne` | droite, x ≈ 70 % | ≈ 24 vw | y ≈ 35 % | 150 vh |
| `noel-bw-eataly-plafond-large` | bas gauche, x ≈ 16 % | ≈ 32 vw | y ≈ 75 % | 190 vh (plus lente, grande) |
| `noel-bw-salon-dore` | bas centre, x ≈ 44 % | ≈ 18 vw | y ≈ 88 % | 220 vh |
| `noel-bw-sapins-verriere` | bas droite, x ≈ 72 % | ≈ 22 vw | y ≈ 80 % | 170 vh |

Règles :

- Les photos gardent le traitement de la V2 (noir et blanc teinté orange, coins arrondis). Rien ne change sur leur rendu.
- Elles passent **derrière** le titre et le CTA (titre au-dessus, avec `z-index` supérieur).
- Chaque photo doit sortir complètement par le haut avant le moment où "Nos univers" arrive.
- Lisibilité : le titre doit rester lisible quand une photo passe derrière. Si besoin, les photos passent légèrement sous le texte en se décalant horizontalement (vérifier avec les frames 05 à 08, le texte est centré et les photos sont sur les côtés et le bas).
- Zone du logo : ne pas laisser une photo passer sous le logo en haut à gauche sans le dégradé de lisibilité du header (`data-header-gradient`). Pour cette zone, utiliser `data-header-gradient="off"` si le fond est orange uni, et `olive` ou `cream` selon le fond de la section visible.

## 5. Le titre et le CTA

- Titre : "Apportons **la magie de Noël** que méritent vos décors." Le groupe "la magie de Noël" garde son traitement V2 (Playfair Display italique, en pastille inclinée de ±2° avec remplissage en `clip-path`, jamais en `scaleX`).
- CTA : "Discutons de votre projet". Même bouton et même animation que celle validée en V2. Pas de lien téléphone.
- Position : centrés dans l'écran, fixes pendant toute la montée des photos.

## 6. "Nos univers" arrive par le bas

- La section "Nos univers" (fond crème) ne vient plus de la droite. Elle monte depuis le bas de l'écran, par-dessus la section orange.
- Avec la structure en `margin-top: -100vh`, c'est le scroll naturel qui fait monter la section. Pas de translation horizontale.
- Pendant qu'elle arrive, le titre orange s'efface (déclencheur séparé : `start: "top bottom"`, `end: "top 30%"`, scrub, opacité 1 vers 0).
- Les photos sont déjà sorties : la section crème ne chevauche jamais de photo.
- État final : exactement le contenu actuel de "Nos univers" (carte photo à gauche, label, titre, liste des univers à droite, "Noël immersif" actif par défaut). On ne change pas la structure.
- Un petit arrondi en haut de la section crème (`border-radius: 32px 32px 0 0`) est bienvenu pour accentuer l'effet de plan qui recouvre. À valider (voir `04-POINTS-A-VALIDER-V3.md`).

## 7. À supprimer

- Tout le code du flux horizontal : conteneur à défilement horizontal, `xPercent`, `x` animés, pin horizontal, calcul de largeur totale.
- La transition d'arrivée de "Nos univers" par la droite.
- Toute animation qui faisait rétrécir la photo vers la gauche (captures V2 04 et 05).

Ne rien laisser de mort dans le JS ou le CSS : si une classe ou un module n'est plus utilisé, le retirer.

## 8. Mobile (moins de 900px)

- Même flux vertical, mêmes phases.
- 3 photos au lieu de 5 (branches, portail, salon), plus petites (largeur 38 à 46 vw), toutes avec la même logique de montée.
- Cercle identique. Titre un peu plus petit, centré.
- Hauteur de la zone : 450vh au lieu de 600vh.

## 9. Mouvement réduit (`prefers-reduced-motion`)

- Pas de cercle animé, pas de parallaxe.
- Affichage statique empilé : Notre volonté, puis section orange avec titre et CTA, puis les photos dans une grille simple, puis Nos univers.
- Aucune hauteur de scroll artificielle.

## 10. Performance

- Seulement `transform`, `opacity` et `clip-path`.
- `will-change: transform` uniquement sur le cercle et les photos.
- `invalidateOnRefresh: true` si les positions dépendent de la hauteur de l'écran.
- Images en `loading="lazy"` sauf la première, `decoding="async"`, dimensions explicites pour éviter les décalages.
