# 00 : Retours globaux de la V1 de démonstration

Objectif de cette session : améliorer le design et l'intégration de la V1 (accueil et landing Noël) avant de la montrer à la cliente, ajouter la section **Réalisations** à l'accueil, et refaire entièrement la **page Noël** d'après les nouvelles maquettes.

## Règles de la session
1. **Ne pas toucher à la stack ni à la technique** : Vite, JS vanilla, CSS natif, GSAP, Lenis (voir `CLAUDE.md`). Aucune migration, aucune dépendance de framework.
2. Respecter `CLAUDE.md` et `DESIGN.md` du projet. Les docs de ce dossier **complètent et corrigent** `DESIGN.md` et `docs/ANIMATIONS.md` là où ils divergent (en cas de conflit, ce dossier prime).
3. Aucun tiret long (em dash) dans les textes du site.
4. Les images de `references/` font foi pour le visuel. Avant d'implémenter, les regarder toutes.
5. S'adapter à la structure de code **déjà en place** dans le projet (noms de fichiers, découpage). Ne pas tout réécrire : modifier ce qui existe.
6. Ne pas modifier ce qui est validé : l'animation d'apparition du footer (révélation en dessous), l'animation du CTA et de la section finale rouge de la page Noël, l'animation d'apparition de la section Services par-dessus la précédente.

## Liste des retours

| # | Zone | Retour | Priorité | Doc |
|---|---|---|---|---|
| 1 | Hero accueil | Le cercle orange doit démarrer au **centre de l'écran**, pas décalé à droite (60 % / 45 %) | Haute | `01-CORRECTIFS-ACCUEIL.md` §1 |
| 2 | Tous les title tags (accueil, Noël, footer) | Vraies **pilules** (bords complètement arrondis, symétriques), jamais de rectangle ni de coin coupé, pas d'espace parasite avant le point | Haute | `01-CORRECTIFS-ACCUEIL.md` §2 |
| 3 | Photos flottantes de la section orange | Toutes les photos ont des **coins arrondis** (la photo de lavande a des coins carrés), et passent **derrière** le texte | Haute | `01-CORRECTIFS-ACCUEIL.md` §3 |
| 4 | Services | Supprimer les numéros 01 à 06, aligner le titre du service à gauche | Moyenne | `01-CORRECTIFS-ACCUEIL.md` §4 |
| 5 | Header (logo) | Logo illisible quand il passe sur du texte : ajouter un **dégradé sous le logo** sur les sections concernées | Haute | `01-CORRECTIFS-ACCUEIL.md` §5 |
| 6 | Footer (toutes les pages) | Nouveau design (PNG fourni), mêmes animations de révélation | Haute | `03-FOOTER-V2.md` |
| 7 | Accueil | **Nouvelle section Réalisations** entre « Notre approche » et « Services » | Haute | `02-SECTION-REALISATIONS.md` |
| 8 | Page Noël | **Refonte complète** d'après le PDF : hero centré, section photo « Notre volonté », flux horizontal de photos, univers, fonctionnement, témoignages, FAQ, CTA final conservé | Haute | `04-NOEL-STRUCTURE-ET-CONTENU.md`, `05-NOEL-ANIMATIONS.md` |
| 9 | Page Noël, CTA final | Garder le CTA et la section rouge tels quels, **retirer le lien téléphone** (garder uniquement le bouton) | Moyenne | `04-NOEL-STRUCTURE-ET-CONTENU.md` §8 |

## Ce qui est supprimé de la page Noël par rapport à la V1
Bandeau de logos, section « La promesse », section « Références » en cartes, galerie. Le design proposé initialement par Claude pour la landing est abandonné au profit des maquettes du fondateur.

## Nouveaux tokens à ajouter
| Token | Valeur | Usage |
|---|---|---|
| `--grey-label` | `#B7B7B7` | Labels de colonnes et textes secondaires du footer sur olive |
| `--radius-pill` | `999px` | Title tags, CTA, pilules |
| `--header-grad-cream` | `#FEF1E0` | Dégradé sous le header sur sections crème |
| `--header-grad-olive` | `#5E530E` | Dégradé sous le header sur sections olive |
