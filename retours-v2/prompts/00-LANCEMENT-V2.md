# 00 : Lancement de la session V2 (prompt maître)

Colle ce prompt tel quel au début de la première session.

```
Nous démarrons la deuxième session de travail sur le site "D'un Bout À L'autre". Un dossier retours-v2/ vient d'être ajouté à la racine du projet. Il contient les retours du fondateur, des spécifications détaillées, des assets, des références visuelles et les prompts de cette session.

Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

Lis dans cet ordre :
1. CLAUDE.md et DESIGN.md du projet, puis docs/ANIMATIONS.md (état actuel).
2. retours-v2/README.md, puis retours-v2/docs/00-RETOURS-GLOBAUX.md.
3. retours-v2/docs/01-CORRECTIFS-ACCUEIL.md, 02-SECTION-REALISATIONS.md, 03-FOOTER-V2.md, 04-NOEL-STRUCTURE-ET-CONTENU.md, 05-NOEL-ANIMATIONS.md, 06-POINTS-A-VALIDER-V2.md.
4. TOUTES les images de retours-v2/references/ : feedback-home/ (défauts à corriger, le nom de chaque fichier décrit le défaut), design/ (footer V2 et état actif de la section Réalisations), noel-frames/ (17 images, animation de la page Noël), realisations-frames/ (10 images, mécanisme de la section Réalisations ; les couleurs de ce PDF sont fausses).
5. Regarde l'état actuel du code du projet : structure des fichiers, composants et scripts existants (hero, title tags, services, header, footer, menu, page Noël).

Ensuite, fais ces deux actions :
- Copie les assets de retours-v2/assets/ dans public/assets/ en conservant les sous-dossiers (images/noel-v2/, images/realisations/, brand/icon-testimonial.svg). Ne supprime et n'écrase aucun fichier existant.
- Ajoute les nouveaux tokens de retours-v2/docs/00-RETOURS-GLOBAUX.md dans le fichier de tokens existant.

Ne commence PAS à coder les fonctionnalités. Réponds avec :
- ta compréhension de la session en 8 lignes maximum,
- un état des lieux du code existant concernant chaque retour (où se trouve le code concerné, ce qui sera modifié, ce qui sera créé),
- les contradictions ou points ambigus (ajoute-les à docs/POINTS-A-VALIDER.md),
- ton plan d'exécution en suivant les prompts 01 à 07 de retours-v2/prompts/,
- les risques techniques principaux (flux horizontal de photos, rétrécissement de la photo vers la gauche, section Réalisations épinglée, timeline en scrub) et comment tu les traites.

Attends ma validation avant de passer au prompt 01.
```
