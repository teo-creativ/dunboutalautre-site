# 05 : Page Noël, Nos univers et Notre fonctionnement

```
Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

Lis retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md (sections 4 et 5) et retours-v2/docs/05-NOEL-ANIMATIONS.md (sections F, G, H). Regarde noel-page-12.jpg à noel-page-15.jpg dans retours-v2/references/noel-frames/.

1. **Nos univers** : remplace le bloc provisoire du prompt 04 par la vraie section crème qui arrive par la droite par-dessus l'orange (l'orange reste visible en bande à gauche pendant l'arrivée, frame 13). Photo-carte à gauche (noel-salon-dore-couleur.jpg, rayon 14 px), label, titre avec title tag, liste des 5 univers dans un fichier de données (titre, sous-titre, photo).
   Interaction à la souris : repos en sable, état actif = olive-deep + point orange + soulignement orange qui se dessine + sous-titre qui se déploie. Quand la souris passe d'un univers à l'autre, l'ancien joue l'animation inverse EN MÊME TEMPS que le nouveau joue l'animation d'activation (une timeline par item, play et reverse, overwrite auto). Noël immersif actif au chargement, l'univers actif reste quand la souris quitte la liste. La hauteur de la liste s'anime sans saut. Tactile : accordéon. Clavier : boutons avec aria-expanded et aria-controls.

2. **Notre fonctionnement** : section crème épinglée, titre « Du premier [échange] au démontage. » à gauche, timeline verticale à droite avec ligne de progression orange qui se remplit au scroll (scrub), 5 étapes. L'opacité des étapes dépend de la progression : non atteinte ≈ 30 %, atteinte 100 %, étape courante avec soulignement orange. Design clair, aéré, moins brouillon que la V1. Mobile : timeline statique.

Vérification : captures Playwright de l'arrivée de la section (frames 12 et 13), de l'état actif des univers (survol de chaque univers, comparaison avec la frame 14), de la timeline à 0 %, 25 %, 50 %, 75 %, 100 % (comparaison avec la frame 15). Teste les survols rapides entre univers (aucun clignotement ni animation bloquée) et le clavier. Commit en français.
```
