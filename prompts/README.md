# Prompts d'intégration

À exécuter **dans l'ordre**, un par session ou par bloc de travail, dans Claude Code (VS Code). Chaque prompt est autonome : il dit quels fichiers lire, quoi construire et comment vérifier.

| # | Fichier | Contenu |
|---|---|---|
| 00 | `00-LANCEMENT.md` | Prompt maître à coller en premier : Claude lit tout et propose un plan |
| 01 | `01-setup-structure.md` | Projet Vite, dépendances, arborescence, données, mise en page de base |
| 02 | `02-design-system.md` | Tokens, typographie, title tags, feuilles de fond, composants statiques |
| 03 | `03-cta-hover.md` | Composant CTA et animation de remplissage au survol |
| 04 | `04-menu.md` | Header et menu plein écran animé (survol, états de la colonne de droite) |
| 05 | `05-hero-et-section-orange.md` | Hero, intro, cercle orange, photos en perspective, photo qui s'agrandit |
| 06 | `06-approche-et-services.md` | Texte « Notre approche », superposition, liste de services au survol |
| 07 | `07-chiffres-cles-et-footer.md` | Cartes qui se superposent, footer en révélation |
| 08 | `08-landing-noel.md` | Landing Décors de Noël |
| 09 | `09-polish-perf-a11y.md` | Performance, accessibilité, responsive, mouvement réduit |
| 10 | `10-revue-finale.md` | Revue frame par frame, Lighthouse, déploiement de démonstration |

Conseils : lance Claude Code à la racine du dossier. Active le mode plan pour chaque prompt (Claude propose, tu valides, il implémente). Après chaque étape, ouvre `npm run dev` et regarde le résultat avant de passer à la suivante. Fais un commit à chaque étape validée.
