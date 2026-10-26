# 03 : Footer V2 (accueil, page Noël et toutes les futures pages)

Design de référence : `references/design/footer-v2-design.png` (1728 x 553). Le footer précédent (`references/feedback-home/08-footer-actuel-a-remplacer.png`) est **remplacé**. Les **animations de révélation** (footer fixe sous le contenu, parallaxe douce) sont validées et **ne changent pas**.

## Structure (desktop, canvas 1728)
Fond `--olive` #5E530E. Deux zones : le bloc principal, puis une barre basse séparée par un filet 1 px `--olive-line` #766C2F.

**Bloc principal** : deux moitiés séparées par un **filet vertical** `--olive-line` à 50 % de la largeur (de haut en bas du bloc principal).
- **Moitié gauche** (marge gauche 60 px) :
  - Titre « Parlons de [votre espace] ensemble. » Poppins Light ≈ 48 à 52 px, blanc. Title tag orange (variante pilule, voir `01-CORRECTIFS-ACCUEIL.md` §2) sur « votre espace », placé en fin de première ligne, « ensemble. » à la ligne.
  - CTA « • Discutons de votre projet » : variante `on-olive` (pilule blanche, point et texte orange), sous le titre. Animation de survol habituelle.
  - En bas de la moitié gauche : **wordmark** « D'UN BOUT À L'AUTRE » en blanc (SVG du logo), largeur ≈ 370 px, aligné à gauche. Il n'est plus géant ni rogné.
- **Moitié droite** : trois colonnes alignées en haut (x ≈ 918, 1263, 1517 à 1728) :

| Colonne | Label (majuscules, `--grey-label`, ≈ 20 px, 300) | Liens (blanc, Poppins 300, ≈ 20 px, interligne ≈ 45 px) |
|---|---|---|
| 1 | SERVICES | Végétalisation de bureaux, Design végétal sur mesure, Scénographie végétale, Terrasses, Décoration saisonnière, Entretien & abonnements, Décors de Noël |
| 2 | NAVIGATION | Accueil, Réalisations, Contact, Blog |
| 3 | RÉSEAUX | Instagram (icône + texte), Facebook (icône + texte) |

Les liens d'Instagram et de Facebook sont externes (`target="_blank"`, `rel="noopener noreferrer"`). Facebook : URL à confirmer (placeholder `#`). Icônes SVG simples (cercle, 16 px), en `currentColor`.

**Barre basse** (hauteur ≈ 50 px, texte `--grey-label` ≈ 16 px, 300) : à gauche « © 2026 D'un bout à l'autre, Tous droits réservés », à droite « Mentions légales » et « Politique de confidentialité » (liens fictifs `#`).

## Comportement
- Survol d'un lien : opacité 100 % + soulignement orange qui se dessine de gauche à droite (même geste que dans le menu, version fine, 2 px). Au repos, liens blancs.
- La révélation en dessous (`main` au-dessus avec `margin-bottom: var(--footer-h)`, footer fixe, parallaxe douce) est **conservée telle quelle**. Mesurer `--footer-h` à nouveau : la hauteur du footer change avec ce nouveau design.
- Le contenu textuel (e-mail et téléphone) n'apparaît plus dans le footer. Ils restent dans le menu.

## Mobile (< 900 px)
Une colonne : titre, CTA, puis les trois blocs de liens empilés (SERVICES, NAVIGATION, RÉSEAUX), wordmark, barre basse sur deux lignes. Filet vertical supprimé. La révélation peut être désactivée (footer statique) si elle n'est pas fluide.

## Données
Centraliser les liens du footer dans les données du site (même source que le menu). Textes exacts ci-dessus. Pas de tiret long.
