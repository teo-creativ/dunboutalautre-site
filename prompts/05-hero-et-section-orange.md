# 05 : Hero, intro, cercle orange, photos en perspective, photo plein écran

```
Lis docs/ANIMATIONS.md §1 à §5 et regarde, dans l'ordre, references/frames/home-animation-01.jpg à 11.jpg. Ces frames sont issues de Figma où l'animation était « assez mal réalisée » : l'objectif est une version bien plus fluide et plus soignée, fidèle aux grandes lignes.

Implémente (src/scripts/intro.js, hero-circle.js, photos-scroll.js) :

1. **Intro au chargement** (§2) : header, ligne de positionnement, H1 par mots depuis un masque (SplitText), title tags qui apparaissent (scale, rotation, remplissage de gauche à droite), CTA.
2. **Hero épinglé et cercle orange** (§3) : le cercle part de (60 % largeur, 45 % hauteur), grandit jusqu'à couvrir le viewport (calcul de l'échelle à partir de la distance au coin le plus éloigné, recalculé au resize), pendant que le contenu du hero s'efface et monte légèrement. Fin : écran 100 % orange, sans flash de couleur au dégagement du pin.
3. **Section orange** (§4) : titre « On crée de véritables expériences [végétales]. » et CTA (on-orange) révélés après le cercle ; **photos flottantes** en perspective (graminées, façade fleurie, ailes, feuillage) qui traversent l'écran de bas en haut à des vitesses différentes, avec légère rotation, positions alternées gauche/droite comme sur les frames, certaines tronquées par le bord de l'écran, jamais plus de 3 à 4 visibles, zone centrale libre. Maximum 2 à 3 écrans de scroll au total pour cette section.
4. **Photo qui s'agrandit** (§5) : `bw-lavande-tour-eiffel-large.png` entre par le bas au centre, grandit par `clip-path: inset(... round 14px)` jusqu'à couvrir toute la section, avec léger scale de l'image. Pendant ce temps, le titre et le CTA s'effacent. Ensuite le **dégradé noir** apparaît en scrub (voile .45 à .55).

Ne fais pas encore le texte « Notre approche » (prompt 06). Laisse la section prête (conteneur, ordre des couches, hauteurs).

Contraintes :
- Aucune animation de width, height, top, left. Seulement transform, opacity, clip-path.
- Pin avec `pinSpacing` correct, `anticipatePin: 1`, `invalidateOnRefresh: true`, aucune variation de hauteur de page entre le chargement et le resize.
- Tout est réversible au scroll arrière.
- Les images ont leurs dimensions (width/height) pour éviter les décalages ; précharge l'image large.
- Mouvement réduit et < 900 px : voir §12.

Vérifie : enregistre une capture par palier de scroll (0, 10, 25, 40, 60, 80, 100 % du pin pour chaque section) avec Playwright et compare avec les frames 01 à 10. Teste la fluidité (aucune saccade au scroll rapide à la molette et au trackpad) et le scroll arrière. Liste les écarts et corrige-les.
```
