# 06 : Texte « Notre approche », superposition des services, survol

```
Lis docs/ANIMATIONS.md §5 (partie texte) et §6, DESIGN.md §5.5, et regarde references/frames/home-animation-11.jpg, references/frames/home-transition-1.jpg à 3.jpg et references/menu/services-rows-et-chiffres-cles.png.

Implémente (src/scripts/approach.js, services.js) :

1. **Texte « Notre approche »** sur la photo plein écran : label `• NOTRE APPROCHE`, puis le texte exact de docs/CONTENU-ACCUEIL.md avec les deux title tags (« on s'occupe de tout » orange, « vous ressemble » clair). Animation : lignes révélées une à une (SplitText en lignes, masque), fonds des title tags qui se remplissent de gauche à droite avec légère rotation, puis texte de la pilule. Les title tags ne doivent jamais couper une ligne de façon disgracieuse (white-space: nowrap sur les tags). Contraste AA garanti par le voile.
2. **Superposition** (§6) : la section est épinglée en arrière-plan pendant que la section Services (crème) remonte par-dessus. Pendant la superposition, la section de dessous fait opacity 1 → 0, scale 1 → 0.92 sur le texte (il « se réduit »), la photo s'assombrit légèrement avec un petit parallaxe. Bord supérieur de la section crème droit.
3. **Liste de services** : 6 lignes selon DESIGN.md §5.5. Entrée en cascade (filets qui se dessinent, texte qui monte). **Survol** : ligne survolée à 100 % avec titre olive-deep, soulignement orange qui se dessine de gauche à droite, filet du bas olive-deep ; autres lignes en sand, opacité réduite (~0,35). **Au repos**, toutes les lignes à une opacité intermédiaire lisible (~0,85). Transitions 0,35 s. Sur tactile, pas de survol, toutes à 100 %. États doublés en :focus-visible. Chaque ligne est un lien.

Vérifie : captures aux étapes de la transition et comparaison avec home-transition-1 à 3 ; survol de chaque ligne ; test clavier (Tab) ; test scroll rapide dans les deux sens (pas de texte coincé à moitié révélé).
```
