# Dossier retours V2 : D'un Bout À L'autre

À déposer **à la racine du projet VS Code** (`dunboutalautre-site/`). Il contient tout ce qu'il faut pour la deuxième session de travail : les retours détaillés, les spécifications d'animation image par image, les assets, les références visuelles et les prompts à lancer dans Claude Code.

## Règle numéro 1 : la stack ne change pas
Le projet reste sur la stack définie dans `CLAUDE.md` : **Vite (multi-pages), JavaScript vanilla en modules ES, CSS natif, GSAP (ScrollTrigger, SplitText), Lenis**. Pas de Next.js, pas de React, pas de Tailwind. Cette session ne touche pas à la technique : elle corrige du design, ajoute une section (Réalisations) et refait la page Noël.

## Installation
1. Dépose le dossier `retours-v2/` à la racine du projet, à côté de `CLAUDE.md`.
2. Ouvre le projet dans VS Code et lance Claude Code à la racine.
3. Colle le contenu de `retours-v2/prompts/00-LANCEMENT-V2.md`. Il demande à Claude de lire les docs, de copier les assets dans `public/assets/` et de proposer un plan.
4. Enchaîne ensuite les prompts dans l'ordre (voir `prompts/README.md`), une session par prompt, avec un commit à chaque étape validée.

## Contenu
| Dossier | Contenu |
|---|---|
| `docs/` | Retours globaux, correctifs accueil, section Réalisations, footer V2, page Noël V2 (structure, textes, animations), points à valider |
| `assets/` | 7 photos Noël (N&B et couleur), 5 photos de réalisations, icône de témoignage |
| `references/noel-frames/` | 17 images extraites du PDF de la page Noël (animation image par image) |
| `references/realisations-frames/` | 10 images du PDF de la section Réalisations (couleurs fausses dans le PDF : voir la capture d'état actif) |
| `references/design/` | Design du footer V2 et capture de l'état actif de la section Réalisations (fait foi pour les couleurs) |
| `references/feedback-home/` | 10 captures annotées par nom des défauts à corriger sur l'accueil |
| `prompts/` | Prompts d'intégration V2 (00 à 07) |

## Ordre de lecture pour Claude Code
`docs/00-RETOURS-GLOBAUX.md`, puis le doc de la tâche en cours, puis les images de `references/` citées dans ce doc.
