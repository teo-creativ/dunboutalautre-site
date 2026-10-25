# 09 : Finitions, performance, accessibilité, responsive

```
Fais un passage de finition complet sur les deux pages.

1. **Images** : convertis les photos en WebP (qualité ~80) avec des variantes responsives (srcset, 800/1400/2200 px) via un script npm (sharp) lancé avant le build ; garde les originaux dans public/assets/. Les PNG N&B grainés peuvent devenir des WebP à qualité 85 (le grain rend la compression moins efficace : vérifie le rendu). Dimensions explicites sur chaque image, lazy-loading sauf le hero et la première image visible, `fetchpriority="high"` sur l'image principale du hero si elle existe.
2. **Performance** : une seule instance de Lenis et de ScrollTrigger, pas de listener dupliqué, `will-change` uniquement pendant l'animation, pas de layout thrashing (lire puis écrire), `ScrollTrigger.refresh()` après chargement des images et des polices (`document.fonts.ready`), nettoyage propre. Mesure avec Lighthouse (desktop) et le panneau Performance de Chrome sur le scroll de l'accueil : aucune longue tâche > 50 ms pendant les animations.
3. **Accessibilité** : audit complet (landmarks, un seul h1, ordre de focus, contrastes AA sur toutes les surfaces et surtout sur les photos avec voile, noms accessibles, `alt`, `aria-hidden` sur le décoratif, menu et accordéon). Vérifie au clavier uniquement. Ajoute un lien d'évitement « Aller au contenu ».
4. **Mouvement réduit** : implémente `prefers-reduced-motion: reduce` selon docs/ANIMATIONS.md §12 (pas de pin, pas de parallaxe, pas de cercle qui grandit, fondus courts). Teste avec l'émulation de Chrome.
5. **Responsive** : teste 1024, 1280, 1440, 1728, 1920 et 390 px. Sous 900 px : menu une colonne avec sous-liens en accordéon, pins raccourcis, chiffres clés en pile, footer lisible. Aucun scroll horizontal. Corrige les débordements de title tags et de titres.
6. **Robustesse** : comportement correct au resize, au zoom navigateur 125 % et 150 %, au retour arrière du navigateur, au rechargement en milieu de page (les animations se positionnent sans saut), avec JavaScript désactivé (contenu lisible, pas de blanc).
7. **Qualité du code** : relis le code, supprime le code mort, ajoute des commentaires courts uniquement là où le « pourquoi » n'est pas évident, vérifie que chaque couleur passe par un token.

Rends compte avec un tableau avant/après des scores Lighthouse et la liste des problèmes restants.
```
