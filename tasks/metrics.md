# Mesures : pages secondaires

Build de prod (`npm run build`, `vite preview`), Chrome 156 desktop, 2026-10-29. Outils hors dépôt (scratchpad) ; scripts dans `.baseline/` (ignoré) : `lighthouse.mjs`, `axe.mjs`.
Poids : chiffres `gzip` affichés par `vite build`.

## Départ (T00), code de `ed795e5`, avant tout changement des pages secondaires

| Page | Performance | Accessibilité | Bonnes pratiques | LCP | CLS | TBT |
|---|---|---|---|---|---|---|
| Accueil `/` | 97 (97, 98, 96) | 96 | 100 | 1178 ms | 0,001 | 0 ms |
| Noël `/decoration-noel-entreprises-paris/` | 98 (98, 98, 99) | 96 | 100 | 1088 ms | 0,001 | 0 ms |

Médiane de 3 passes. Seuil de non-régression des pages existantes (critère 4 du SPEC) : Performance ≥ 95 pour l'accueil, ≥ 96 pour Noël (et toujours ≥ 85).

| Bundle | Poids gzip de départ | Budget (+ SPEC) |
|---|---|---|
| `main-*.css` | 8,86 ko | ≤ 14,86 ko (+ 6 ko) |
| `main-*.js` | 67,30 ko | ≤ 71,30 ko (+ 4 ko) |

## axe-core au départ (WCAG 2.2 A et AA, bonnes pratiques)
- Accueil : 0 violation propre ; 1 violation **héritée** du header partagé : le texte orange du bouton « Menu » sur blanc (3,3:1), vue dans tous les états. Le design le veut ainsi (DESIGN.md §5.3) ; elle sera présente sur toutes les pages neuves et est comptée à part par `axe.mjs`.
- Noël : mêmes 0 violation propre au repos et menu ouvert. Dans l'état « FAQ et univers au focus » : 7 nœuds `color-contrast` (le label de « Nos univers » et un tag orange en cours d'animation). Existants, hors périmètre (page validée).
- Console : 0 erreur, 0 avertissement sur les deux pages (captures de référence).

## Suivi
Les mesures aux points de contrôle (A, C, F), à T29 et à T32 sont ajoutées ci-dessous.
