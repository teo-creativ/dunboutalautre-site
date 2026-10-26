# 03 : Nouvelle section Réalisations

```
Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

Lis retours-v2/docs/02-SECTION-REALISATIONS.md en entier. Regarde retours-v2/references/realisations-frames/ (les 10 images du mécanisme, couleurs fausses à ignorer) et retours-v2/references/design/realisations-etat-actif-couleurs.png (fait foi pour les couleurs et les proportions).

Ajoute la section Réalisations dans l'accueil, entre « Notre approche » et « Services ». Elle arrive par-dessus « Notre approche » en superposition, et la section Services arrive ensuite par-dessus elle avec son animation actuelle, qui ne change pas (seule la section située dessous change).

À faire :
1. Données dans un fichier dédié (ex. src/data/realisations.js) : 5 réalisations, ordre, titres, photos, alt, liens fictifs, exactement selon le tableau du doc.
2. Section épinglée, deux colonnes : liste de titres à gauche (marge 9,5 vw, titre actif sur la ligne centrale), pile de photos à droite (bord gauche à 56,7 vw, débordant à droite, ratio 5/4, coins gauches arrondis de 14 px). Fond olive, masques en dégradé haut et bas sur la liste.
3. Défilement vertical synchronisé des deux colonnes en scrub (≈ 70 vh de scroll par réalisation) : quand le titre i est actif, la photo i est centrée.
4. Titre actif : point orange qui apparaît, texte qui glisse vers la droite, soulignement orange qui se dessine de gauche à droite ; l'ancien titre actif joue l'animation inverse en même temps. Animations GSAP uniquement, aucune animation de width.
5. Aimantation douce (snap) sur chaque réalisation, facile à désactiver.
6. Sortie : tenue sur la dernière réalisation, puis Services arrive par-dessus (mécanisme existant) pendant que la section Réalisations baisse légèrement en opacité.
7. Survol et focus d'un titre non actif : aperçu de l'état actif. Titres et photos sont des liens (href="#").
8. Responsive < 900 px et prefers-reduced-motion : pas de pin, liste verticale de cartes titre + photo.
9. Dégradé du header : data-header-gradient="olive" sur cette section.

Vérification : captures Playwright (1728 x 1030) à plusieurs paliers de scroll : entrée par-dessus l'approche, chaque réalisation active (5 captures), sortie vers Services. Compare avec les frames et la capture d'état actif. Teste le scroll rapide dans les deux sens (aucun titre bloqué à moitié animé, aucun décalage entre liste et photos). Commit en français.
```
