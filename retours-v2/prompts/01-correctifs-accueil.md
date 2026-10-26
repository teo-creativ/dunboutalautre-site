# 01 : Correctifs de l'accueil et composants partagés

```
Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

Lis retours-v2/docs/01-CORRECTIFS-ACCUEIL.md en entier et regarde les captures de retours-v2/references/feedback-home/ (01 à 10).

Corrige, dans cet ordre :

1. **Cercle orange du hero** : l'origine du cercle est le centre exact du viewport (50 % / 50 %), plus à 60 % / 45 %. Le reste de l'animation ne change pas. Vérifie au resize.

2. **Title tags en vraies pilules** partout (hero, section orange, approche, chiffres clés, footer, menu) : border-radius 999px, symétriques, jamais rogné, padding suffisant pour les italiques de Playfair, fond animé en clip-path avec rayon pilule (pas de scaleX), aucun overflow hidden autour des tags (corriger les masques de SplitText si besoin), aucun espace entre le tag et la ponctuation qui suit. Crée ou corrige un seul composant CSS .tag partagé par toutes les occurrences. Vérifie chaque occurrence avec une capture zoomée, pendant l'animation et après.

3. **Photos flottantes de la section orange** : coins arrondis de 14 px sur TOUTES les photos (la photo de lavande a des coins carrés) et sur la photo qui s'agrandit (le rayon ne passe à 0 qu'à 100 % de l'écran). Le texte (titre et CTA) est toujours au-dessus des photos. Ajuste les trajectoires pour que les photos recouvrent le moins possible la zone du titre.

4. **Services sans numéros** : supprime les numéros, aligne le titre du service à gauche sur la marge de page. Les descriptions, les filets et les états de survol restent identiques.

5. **Dégradé de lisibilité sous le header** : implémente la bande dégradée et son pilotage par section (data-header-gradient cream, olive ou off) avec ScrollTrigger et une transition d'opacité de 0,35 s, selon le tableau du doc. Teste le logo à plusieurs positions de scroll, surtout pendant la superposition des services.

Vérification : avec Playwright (viewport 1728 x 1030), prends des captures du hero (début du cercle), de la section orange (photos et tags), des services (logo et texte) et compare-les avec les captures de feedback-home. Corrige les écarts. Fais un commit par correctif (messages en français). Résume ce qui a changé.
```
