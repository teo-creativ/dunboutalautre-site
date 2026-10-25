# CONTENU-ACCUEIL.md : textes exacts de la page d'accueil

Ces textes sont **alignés sur la maquette** (`references/frames/`). Ils prévalent sur `docs/copywriting/01-accueil.md` là où ils diffèrent (ce dernier contient aussi des sections qui ne sont pas encore designées : bandeau Noël, blog, réalisations, FAQ).
Notation : `[mot]` = title tag (voir `DESIGN.md` §5.1). Pas de tiret long dans les textes.

## Meta (voir arborescence)
- Title (59 car.) : `Design végétal & scénographie à Paris | D'un Bout À L'autre`
- Meta description (155 car.) : `D'un Bout À L'autre : design végétal et scénographie pour les entreprises à Paris. Bureaux végétalisés, décors sur mesure, événements, Noël. Devis gratuit.`
- `lang="fr"`.

## Header
- Logo : `public/assets/brand/logo-wordmark-cream.svg`
- Bouton : `• Menu` (devient `Fermer` quand le menu est ouvert)

## 1. Hero (fond olive + feuilles)
- Ligne de positionnement (majuscules, points orange entre les éléments) : `PLANTES NATURELLES • VÉGÉTAUX STABILISÉS • VÉGÉTAUX ARTIFICIELS • SCÉNOGRAPHIE`
- H1 : `Design [végétal] & [scénographie] pour les entreprises.`
  - « végétal » : title tag **clair** (fond crème, texte orange, rotation −2°)
  - « scénographie » : title tag **orange** (fond orange, texte crème, rotation +2°)
- CTA (`on-olive`) : `Discutons de votre projet` → `/contact` (fictif)

## 2. Section orange
- Titre : `On crée de véritables expériences [végétales].` (title tag clair)
- CTA (`on-orange`) : `Discutons de votre projet`
- Photos flottantes puis photo plein écran : voir `docs/ANIMATIONS.md` §4 et §5. Photos : `public/assets/images/home-scroll/`.

## 3. Notre approche (sur la photo plein écran)
- Label : `• NOTRE APPROCHE`
- Texte : `De la conception à l'entretien, [on s'occupe de tout]. Une relation directe, un interlocuteur unique, et un résultat qui [vous ressemble]. C'est notre volonté pour chaque projet.`
  - « on s'occupe de tout » : title tag **orange**
  - « vous ressemble » : title tag **clair**

## 4. Services (fond crème)
- Label : `• SERVICES`
- 6 lignes (numéro, titre, description). Chaque ligne est un lien.

| N° | Titre | Description | Lien (fictif) |
|---|---|---|---|
| 01 | Végétalisation de bureaux | Plantes, bacs, cloisons végétales, murs, espaces d'accueil… On installe le végétal là où vivent vos équipes. | `/vegetalisation-bureaux-paris` |
| 02 | Design végétal sur mesure | Tableaux, logos, murs végétaux, structures, suspensions… Des créations uniques, fabriquées pour votre espace. | `/design-vegetal-sur-mesure-paris` |
| 03 | Scénographie végétale | Lancements, soirées, salons, shootings. On transforme vos événements en décors végétaux sur mesure. | `/scenographie-vegetale-evenementiel-paris` |
| 04 | Terrasses | Du balcon parisien à la grande terrasse d'hôtel ou de restaurant : des extérieurs où l'on a envie de rester. | `/amenagement-terrasse-paris` |
| 05 | Décoration saisonnière | Noël, printemps, événements internes, vitrines… Un décor qui change avec les saisons, sans rien gérer de votre côté. | `/decoration-vegetale-saisonniere-paris` |
| 06 | Entretien & abonnements | Entretien, remplacement, renouvellement des décors. Vos plantes restent belles toute l'année. | `/entretien-abonnement-plantes-entreprise-paris` |

Note : la maquette affichait par erreur la description de l'entretien sur la ligne 05 et « Scénographie végétal » (faute). Les textes ci-dessus sont corrigés. Voir `docs/POINTS-A-VALIDER.md`.

## 5. Chiffres clés (fond crème)
- Label : `• CHIFFRES CLÉS`
- Titre : `Nous transformons vos idées en expérience [inoubliable].` (title tag orange)
- Cartes :
  1. `+70` : `projets réalisés à Paris et en Île-de-France`
  2. `+10 ans` : `d'expérience en végétalisation et en décoration végétale` (« ans » en plus petit)
  3. `100%` : `Entreprises, hôtels, restaurants, particuliers : tous types de clients accompagnés`
- Valeurs de la maquette, **à confirmer avec la cliente** (le copywriting indique `+X projets`).

## 6. Footer (fond olive, apparaît en dessous)
- Titre : `Parlons de votre espace [ensemble].` (title tag orange)
- CTA (`on-olive`) : `Parlons de votre projet`
- E-mail : `hello@dunboutalautre.co`
- Téléphone : voir `docs/POINTS-A-VALIDER.md` (valeur dans `src/data/site.js`)
- Liens : Accueil, Services, Réalisations, Contact, Blog (fictifs)
- `Paris & Île-de-France`
- Instagram : `@dunboutalautre.co` (lien externe)
- `© 2026 D'un bout à l'autre`
- Wordmark géant crème : `D'UN BØUT À L'AUTRE` (SVG `logo-wordmark-cream.svg`, pleine largeur, rogné en bas)

## 7. Menu plein écran
- Liens principaux : `Accueil`, `Services`, `Réalisations (32)`, `Contact`, `Blog`
- Colonne droite par défaut :
  - Titre : `Parlons de la transformation de [votre espace] ensemble.` (title tag orange)
  - Photo N&B arrondie : `public/assets/images/home-scroll/bw-lavande-tour-eiffel-large.png` (recadrée en bandeau 16:5)
  - Label `CONTACT`, `hello@dunboutalautre.co`, téléphone
- Colonne droite au survol de « Services » : label `SERVICES` puis :
  1. Végétalisation de bureaux
  2. Design végétal sur mesure
  3. Scénographie végétale
  4. Terrasses
  5. Décoration saisonnière
  6. Entretien & abonnements
  7. Décors de Noël (lien vers la landing `/decoration-noel-entreprises-paris/`)
- Boutons : `Menu` / `Fermer`
