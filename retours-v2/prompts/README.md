# Prompts V2

À lancer **dans l'ordre**, un par session de Claude Code, à la racine du projet (là où se trouve `CLAUDE.md`). Chaque prompt est autonome. Active le mode plan, valide le plan, laisse Claude implémenter, regarde le résultat dans `npm run dev`, puis fais un commit avant de passer au suivant.

**Rappel : la stack ne change pas** (Vite, JS vanilla, CSS natif, GSAP, Lenis). Aucune de ces sessions ne touche à la technique.

| # | Fichier | Contenu |
|---|---|---|
| 00 | `00-LANCEMENT-V2.md` | Prompt maître : lecture des docs, copie des assets, plan |
| 01 | `01-correctifs-accueil.md` | Cercle au centre, title tags en pilules, photos arrondies et sous le texte, services sans numéros, dégradé du header |
| 02 | `02-footer-v2.md` | Nouveau footer pour toutes les pages (révélation conservée) |
| 03 | `03-section-realisations.md` | Nouvelle section Réalisations entre « Notre approche » et « Services » |
| 04 | `04-noel-hero-volonte-flux.md` | Page Noël : hero, Notre volonté, flux horizontal de photos |
| 05 | `05-noel-univers-fonctionnement.md` | Page Noël : Nos univers (survol), Notre fonctionnement (timeline) |
| 06 | `06-noel-temoignages-faq-cta.md` | Page Noël : témoignages, FAQ, CTA final, SEO |
| 07 | `07-revue-v2.md` | Revue finale image par image, build, récapitulatif |

Les prompts 04 à 06 réécrivent la page Noël : ne pas les lancer avant les prompts 01 et 02 (title tags et footer partagés).
