# 02 : Footer V2

```
Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

Lis retours-v2/docs/03-FOOTER-V2.md et regarde retours-v2/references/design/footer-v2-design.png (le design à reproduire) et retours-v2/references/feedback-home/08-footer-actuel-a-remplacer.png (le footer actuel, à remplacer).

Remplace le footer par le nouveau design, sur l'accueil ET sur la page Noël (une seule source de HTML et de CSS pour toutes les pages, comme pour le header et le menu).

Conserve à l'identique le mécanisme de révélation en dessous : main au-dessus avec margin-bottom égal à la hauteur du footer, footer fixe, parallaxe douce. Mesure à nouveau --footer-h (le nouveau footer est moins haut) et recalcule-le au resize.

Reproduis fidèlement : fond olive, titre « Parlons de [votre espace] ensemble. » avec title tag pilule orange (voir prompt 01), CTA on-olive « Discutons de votre projet », wordmark blanc en bas à gauche (≈ 370 px, plus de wordmark géant), filet vertical à 50 %, trois colonnes SERVICES (7 liens), NAVIGATION (4 liens), RÉSEAUX (Instagram, Facebook avec icônes), barre basse avec filet, copyright et liens légaux. Ajoute le token --grey-label #B7B7B7. Survol des liens : soulignement orange fin dessiné de gauche à droite. Centralise les liens dans les données du site. Version mobile en une colonne.

Vérification : capture du footer à 1728 x 1030, compare avec footer-v2-design.png (positions, tailles, couleurs), teste la révélation au scroll (début, milieu, fin) et à 1280, 1440, 1920 de large. Commit en français.
```
