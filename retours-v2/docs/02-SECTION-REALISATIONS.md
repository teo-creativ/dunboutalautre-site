# 02 : Nouvelle section « Réalisations » (accueil)

## Place dans la page
Ordre des sections de l'accueil : hero, section orange et photos, photo plein écran + « Notre approche », **Réalisations (nouvelle)**, Services, Chiffres clés, footer.

La section Réalisations **reprend le rôle** qu'avait Services à cet endroit : elle arrive par-dessus la section « Notre approche » en superposition. La section Services, elle, **garde exactement son animation d'apparition actuelle** : elle arrive par-dessus la section Réalisations à la fin, comme elle le faisait par-dessus « Notre approche ». Ne rien modifier à ce mécanisme, seulement changer la section qui se trouve en dessous.

## Références
- `references/realisations-frames/realisations-01.jpg` à `-10.jpg` : mécanisme image par image. **Les couleurs du PDF sont fausses** (fond noir, dégradés jaunes) : ignorer. Ne retenir que le mouvement, l'ordre et la mise en page.
- `references/design/realisations-etat-actif-couleurs.png` : **fait foi pour les couleurs et les proportions** (fond olive, titre actif blanc avec point orange et soulignement orange).
- `references/realisations-frames/realisations-animation.pdf` : même PDF (original).

## Couleurs et typographie
| Élément | Valeur |
|---|---|
| Fond de section | `--olive` #5E530E |
| Label « • RÉALISATIONS » | Poppins 400, majuscules, 14 px, blanc, point blanc devant |
| Titres de la liste | Poppins 300, blanc, ≈ 2,6 vw (≈ 45 px à 1728), interligne serré |
| Point actif | cercle `--orange` #FC4C00, diamètre ≈ 0,9 vw (16 px) |
| Soulignement actif | trait `--orange`, 3 px, sous le titre, de l'extrémité gauche à l'extrémité droite du texte |
| Photos | rayon 14 px |

## Mise en page (desktop, proportions mesurées sur la capture d'état actif, en % de la largeur du viewport)
- **Colonne gauche** : marge gauche **9,5 vw**. Label « • RÉALISATIONS » à ≈ 20 % de la hauteur du viewport. Liste de 5 titres, pas vertical ≈ 5,2 vw (≈ 90 px à 1728). **Le titre actif est sur la ligne centrale** (≈ 52 % de la hauteur du viewport).
- **Colonne droite** : pile verticale de photos, bord gauche à **56,7 vw**, qui **déborde jusqu'au bord droit** du viewport (rayon 14 px sur les coins gauches uniquement, les coins droits sont hors écran). Largeur 43,3 vw, ratio **5 / 4**. Espace entre deux photos ≈ 2,2 vw. La photo active est centrée verticalement dans le viewport, avec une bande de la photo précédente en haut et de la suivante en bas qui dépassent.
- **Masques** : la liste est dans une fenêtre dont le haut et le bas sont fondus vers l'olive (`mask-image: linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)`). C'est ce qui rend le premier et le dernier visibles titre pâles, comme sur la capture. Les voisins immédiats du titre actif restent blancs à 100 %.

## Données (une seule source, `src/data/realisations.js` ou équivalent)
L'ordre ci-dessous reprend **l'ordre du PDF** (lien texte / photo voulu par le fondateur). Les fichiers sont dans `assets/images/realisations/` (à copier dans `public/assets/images/realisations/`).

| # | Titre affiché | Photo | Texte alternatif |
|---|---|---|---|
| 1 | Floral Fashion Show | `real-floral-fashion-show.jpg` | Mannequin devant des arches de roses roses et rouges lors du Floral Fashion Show |
| 2 | Felicita, Halloween | `real-felicita-halloween.jpg` | Décor d'Halloween chez Felicita : citrouilles, chrysanthèmes et fausses toiles d'araignée |
| 3 | Eataly | `real-facade-fleurie-bleue.jpg` | Composition florale bleue, jaune et orange suspendue sur une façade, vue d'en bas |
| 4 | Saint-Tropez, BHV | `real-table-restaurant.jpg` | Table dressée avec bouquets d'oiseaux de paradis et verres en cristal |
| 5 | Atelier Du Geste à l’Emotion | `real-atelier-geste-emotion.jpg` | Enseigne de l'Atelier Du Geste à l'Emotion entourée de tournesols |

Chaque titre est un lien (`href="#"` pour l'instant, page réalisation fictive). **Point à valider** : les photos 3 et 4 (façade bleue et table) suivent l'ordre du PDF, mais le lien « Eataly » et « Saint-Tropez BHV » avec ces deux photos est à confirmer. L'inversion se fait en une ligne dans le fichier de données. Voir `06-POINTS-A-VALIDER-V2.md`.

## Mécanisme d'animation
Section **épinglée** (`ScrollTrigger` pin) avec une progression `p` de 0 à 1 en scrub (`scrub: 0.8`). Durée de scroll : **≈ 70 vh par réalisation**, soit ≈ 350 vh au total. `anticipatePin: 1`, `invalidateOnRefresh: true`.

1. **Entrée (superposition)** : la section olive monte depuis le bas **par-dessus** « Notre approche » (qui reste épinglée dessous : son texte baisse en opacité et rétrécit légèrement, comme pour l'ancienne transition vers Services). Pendant la montée, le label apparaît, la colonne de photos entre par le bas à droite avec la première photo, la liste apparaît avec le premier titre.
2. **Défilement synchronisé** : le contenu des deux colonnes avance **en même temps**, avec la même progression `p`. Le défilement est en **sens vertical montant** : les titres de la liste montent à gauche, les photos montent à droite. Position de la liste : `translateY = -p * (N - 1) * pas`. Position de la pile de photos : `translateY = -p * (N - 1) * (hauteurPhoto + espace)`. Ainsi, quand le titre `i` est sur la ligne centrale, la photo `i` est centrée à droite.
3. **Titre actif** : l'indice actif est le titre le plus proche de la ligne centrale. Quand il change :
   - le nouveau titre actif : **point orange** qui apparaît à gauche (scale 0 vers 1, 0,35 s, `back.out(2)`), texte qui glisse de ≈ 2 vw vers la droite, **soulignement orange qui se dessine** de gauche à droite (`scaleX` 0 vers 1, origine gauche, 0,45 s, `power3.out`) ;
   - l'ancien titre actif : point qui disparaît (scale vers 0), soulignement qui se retire vers la droite (origine droite, 0,35 s), texte qui revient à sa place.
   - Le souligné et le point sont **animés par GSAP** et jamais par `width`.
4. **Aimantation douce recommandée** (désactivable) : `snap` sur `1 / (N - 1)`, durée 0,5 s, `ease: "power2.inOut"`, délai 0,08 s, pour que chaque réalisation se « pose » au centre avant de passer à la suivante.
5. **Sortie** : quand la dernière réalisation (Atelier Du Geste à l’Emotion) est active et sa photo centrée, tenir un instant (≈ 30 vh), puis la section **Services arrive par-dessus** (mécanisme existant, inchangé). Pendant cette superposition, la section Réalisations baisse en opacité (1 vers 0,6) et la liste rétrécit de 4 %.
6. Retour arrière du scroll : tout est réversible, sans saut.

## Interactions
- Survol d'un titre non actif (desktop) : le titre passe à 100 % avec point et soulignement en aperçu (même geste que l'état actif), sans changer le scroll. Au départ de la souris, retour à l'état normal.
- Clic sur un titre ou sur une photo : lien vers la page de la réalisation (fictif).
- Focus clavier (`Tab`) : mêmes états que le survol, anneau de focus orange visible.

## Responsive et accessibilité
- **< 900 px** ou `prefers-reduced-motion` : pas de pin. Liste verticale de cartes : titre au-dessus, photo en dessous (ratio 16/10, rayon 14 px), le point et le soulignement orange visibles en permanence sous forme d'état actif discret ; apparition simple au scroll (fondu et montée de 24 px).
- Structure sémantique : `<section aria-labelledby>`, titre de section `h2` (le label visuel « Réalisations »), liste `<ul>` de liens, `alt` en français pour chaque photo, ordre de lecture = ordre des titres. Les masques de dégradé sont décoratifs (`aria-hidden`).
- Le header reçoit le dégradé olive sur cette section (`01-CORRECTIFS-ACCUEIL.md` §5).
