# 07 : Revue finale V2

```
Fais la revue finale de la V2 comme le ferait un directeur artistique exigeant.

Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

1. **Retours du fondateur** : reprends le tableau de retours-v2/docs/00-RETOURS-GLOBAUX.md et vérifie chaque ligne, avec une capture Playwright à l'appui (viewport 1728 x 1030), en comparaison avec les images de retours-v2/references/. Corrige tout écart visible.
2. **Title tags** : parcours toutes les pages et vérifie, avec des captures zoomées, que chaque tag est une pilule symétrique, jamais rognée, sans espace avant la ponctuation, avant, pendant et après l'animation.
3. **Fluidité** : parcours l'accueil entier puis la page Noël entière à la molette, au trackpad, avec Page suivante et Page précédente, puis scroll arrière rapide. Aucun saut, aucun élément coincé à moitié animé, aucun flash. Contrôle particulièrement : cercle orange, photo qui s'agrandit, Réalisations (entrée, sortie, synchronisation liste et photos), photo qui rétrécit sur la page Noël, flux horizontal, arrivée des univers, timeline.
4. **Header** : le logo est lisible à toutes les positions de scroll sur les deux pages.
5. **Textes** : compare chaque texte avec les docs du dossier retours-v2 (aucun tiret long, aucune faute, aucun texte inventé hors avis fictifs).
6. **Responsive et accessibilité** : teste 1280, 1440, 1728, 1920 et 390 px, mouvement réduit, navigation clavier (menu, univers, carrousel, FAQ). Aucun défilement horizontal de la page.
7. **Build** : npm run build sans avertissement, npm run preview fonctionnel.
8. **Points à valider** : mets à jour docs/POINTS-A-VALIDER.md avec les points de retours-v2/docs/06-POINTS-A-VALIDER-V2.md (en particulier : avis fictifs à remplacer, association titre et photo des réalisations Eataly et Saint-Tropez BHV).

Termine par un compte rendu de 15 lignes maximum : ce qui est fait, ce qui reste, les trois améliorations les plus rentables.
```
