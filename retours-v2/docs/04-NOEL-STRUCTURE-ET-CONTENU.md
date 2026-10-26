# 04 : Page Noël V2, structure, design et textes

URL finale : `/decoration-noel-entreprises-paris/`. Objectif unique de la page : obtenir une demande de devis Noël.

**Cette version remplace entièrement la V1 de la landing.** Le design initialement proposé par Claude est abandonné. On suit les maquettes du fondateur : `references/noel-frames/noel-page-01.jpg` à `noel-page-17.jpg` (PDF image par image). Le détail des animations est dans `05-NOEL-ANIMATIONS.md`.

Même design system que l'accueil (`DESIGN.md`, plus les corrections de `01-CORRECTIFS-ACCUEIL.md` : title tags en vraies pilules, dégradé du header, coins arrondis des photos). Même header, même menu, **nouveau footer** (`03-FOOTER-V2.md`).

## Supprimé par rapport à la V1
Bandeau de logos, section « La promesse », section « Références » en cartes, galerie, encarts « Idéal pour » des univers, CTA téléphone. Ne pas les recréer.

## SEO (inchangé)
- Title : `Décoration de Noël entreprise à Paris | D'un Bout À L'autre`
- Meta description : `Décoration de Noël pour entreprises à Paris : sapins, scénographies, décors aux couleurs de votre marque. Conception, fabrication, installation, démontage.`
- Un seul `h1` (celui du hero), hiérarchie `h2` pour chaque section, `canonical` vers l'URL finale, JSON-LD `FAQPage` généré depuis les données de la FAQ.

## Ordre des sections
1. Hero (olive, centré)
2. Notre volonté (photo plein écran + texte)
3. Flux horizontal (orange : « Apportons la magie de Noël… » + photos)
4. Nos univers (crème)
5. Notre fonctionnement (crème)
6. Témoignages (crème)
7. FAQ (crème)
8. CTA final (rouge/orange, **inchangé**, sans lien téléphone)
9. Footer V2

## 1. Hero
- Fond : celui du hero de l'accueil (olive + 4 feuilles en contours aux 4 coins). **Réutiliser le même asset** déjà dans le projet : `public/assets/brand/bg-hero-leaves.svg` (et `@2x.png`).
- **Tout le contenu est centré** (horizontalement), comme sur l'accueil :
  - Ligne de positionnement (majuscules, points orange entre les éléments) : `CONCEPTION • FABRICATION • INSTALLATION • DÉMONTAGE`
  - H1 : `Décoration de [Noël] pour les entreprises à Paris.` Title tag **orange** sur « Noël ». Deux lignes : « Décoration de [Noël] pour » puis « les entreprises à Paris. »
  - Sous-titre (centré, ≈ 18 px, blanc, largeur max ≈ 600 px) : `Du sapin à la scénographie complète : nous concevons, fabriquons, installons et démontons votre décor de Noël.`
  - CTA `on-olive` : `• Demander un devis Noël` → `/contact` (fictif). Aucun numéro de téléphone.
- Frame : `noel-page-01.jpg`.

## 2. Notre volonté (photo plein écran)
- Photo : `noel-bw-eataly-plafond-large.jpg` (plafond végétalisé Eataly, N&B grainé, 1847 x 1000), plein écran, voile noir ≈ 45 à 50 % (même traitement que « Notre approche » sur l'accueil).
- Label : `• NOTRE VOLONTÉ`
- Texte centré (≈ 44 px, Poppins 300/400, interligne 1,5), largeur max ≈ 70 %, blanc :
  `Lors des fêtes de fin d'année, la décoration passe souvent au second plan… Chez D'un Bout À L'autre, [on s'occupe de tout] : sélection du matériel en accord avec votre identité, fabrication, livraison, installation dans vos délais, et démontage après [les fêtes].`
  - « on s'occupe de tout » : title tag **orange** (−2° ou +2° selon l'alternance). « les fêtes » : title tag **clair** (fond crème, texte orange).
- Frames : `noel-page-02.jpg` à `noel-page-05.jpg`.

## 3. Flux horizontal (fond orange)
- Fond `--orange` #FC4C00.
- Titre centré (≈ 64 px, blanc, Poppins 300/400) : `Apportons [la magie de Noël] que méritent vos décors.` Title tag **clair** sur « la magie de Noël ». Deux lignes : « Apportons [la magie de Noël] » puis « que méritent vos décors. »
- CTA `on-orange` sous le titre : `• Discutons de votre projet` → `/contact` (fictif).
- Photos qui défilent **horizontalement de la droite vers la gauche** (voir animations) : `noel-bw-branches-givrees.jpg`, `noel-bw-portail-couronne.jpg`, `noel-bw-eataly-plafond.jpg`, `noel-bw-salon-dore.jpg`, `noel-bw-sapins-verriere.jpg`. Rayon 14 px, N&B grainé tel que fourni.
- Frames : `noel-page-06.jpg` à `noel-page-12.jpg`.

## 4. Nos univers (fond crème)
- Label : `• NOS UNIVERS`. Titre : `Choisissez l'univers de [votre Noël].` (title tag orange).
- Colonne gauche : **photo en carte** (`noel-salon-dore-couleur.jpg`, version couleur, ratio ≈ 8/9, rayon 14 px), colonne droite : label, titre, liste des 5 univers.
- Liste (Poppins 300, ≈ 40 px, couleur `--sand` #C9BDA0 au repos). Chaque univers a un sous-titre court qui n'apparaît que sur l'univers actif :

| Univers | Sous-titre (≈ 14 px, gris olive) |
|---|---|
| Noël naturel | Sapin, branches, pommes de pin et végétaux naturels. Une ambiance chaleureuse, qui sent la forêt. |
| Noël chic | Blanc, doré et végétal. Un Noël élégant et sobre, pour les lieux qui reçoivent une clientèle exigeante. |
| Noël immersif | Forêt, arche, plafond végétalisé, scénographie complète. On transforme le lieu entier : vos clients entrent dans un décor. |
| Noël corporate | Un décor aux couleurs de votre marque, avec votre logo. Votre Noël devient une extension de votre identité. |
| Noël responsable | Location, réutilisation d'une année sur l'autre, végétaux artificiels ou stabilisés. Un décor beau, sans gaspillage. |

- **État actif** (survol, focus, ou état par défaut) : texte en `--olive-deep` #4C430B à 100 %, **point orange** à gauche, **soulignement orange** sous le titre, sous-titre qui apparaît dessous. Voir `noel-page-14.jpg` (état « Noël immersif »).
- Aucun bouton sous la liste.
- Frames : `noel-page-13.jpg`, `noel-page-14.jpg`.

## 5. Notre fonctionnement (fond crème)
- Label : `• NOTRE FONCTIONNEMENT`. Titre à gauche : `Du premier [échange] au démontage.` (title tag orange sur « échange »).
- Colonne droite : **timeline verticale** avec ligne de progression, points et 5 étapes (titre Poppins 300 ≈ 32 px, description ≈ 14 px) :

| # | Étape | Description |
|---|---|---|
| 1 | Brief | Vous nous indiquez le lieu, la surface, le budget et l'univers qui vous plaît. On peut aussi passer sur place pour mesurer. |
| 2 | Proposition visuelle | On vous envoie un moodboard et un devis. On ajuste ensemble jusqu'à validation. |
| 3 | Fabrication | Les éléments du décor sont préparés en atelier : couronnes, compositions, structures, décors aux couleurs de votre marque. |
| 4 | Installation | Notre équipe installe sur site, dans vos délais, avec le moins de gêne possible pour votre activité. |
| 5 | Démontage | Après les fêtes, on revient tout démonter, au moment qui vous arrange. |

- Frame : `noel-page-15.jpg` (étape 1 active).

## 6. Témoignages (fond crème)
- Label : `• TÉMOIGNAGES`. Icône de guillemets : `assets/brand/icon-testimonial.svg` (orange #FC4C00, 70 x 57), en haut de la colonne gauche. Flèches précédent / suivant en bas de la colonne gauche (deux ronds : précédent fond orange pâle et chevron orange, suivant fond orange et chevron crème, diamètre ≈ 52 px).
- Filet vertical fin (`--grey-line` ou `--olive-line` à faible opacité) entre les deux colonnes.
- Colonne droite : citation (Poppins 300, ≈ 40 px, olive, interligne 1,5), nom (≈ 22 px, olive-deep), poste et entreprise (≈ 16 px, gris olive).
- Frame : `noel-page-16.jpg`.

### Avis fictifs (démonstration uniquement)
**Ces quatre avis sont inventés pour la démonstration.** À remplacer par de vrais avis de clients avant toute mise en ligne. Les marquer dans les données avec `fictif: true` et un commentaire `// FICTIF : à remplacer avant mise en ligne`. Les noms de personnes sont fictifs.

1. « Pour Noël, D'un Bout À L'autre a transformé notre plafond en véritable forêt suspendue. Les équipes comme les clients s'arrêtaient pour regarder. L'installation était soignée et le démontage impeccable en janvier. » : **Camille Laurent**, Responsable communication, Eataly Paris
2. « Elles ont su respecter l'élégance de notre établissement tout en apportant une vraie chaleur à l'accueil. Nos clients nous ont parlé de la décoration dès leur arrivée. » : **Julien Moreau**, Directeur d'exploitation, Hôtel Cluny Square
3. « Un interlocuteur unique, des délais tenus et un résultat qui nous ressemble. Nous renouvelons l'expérience cette année. » : **Sophie Garnier**, Cheffe de projet événementiel, BHV Marais
4. « La personnalisation aux couleurs de notre maison m'a bluffée. Tout était prêt le jour J, sans que nous ayons à coordonner quoi que ce soit. » : **Antoine Delmas**, Directeur, Hôtel des Grands Boulevards

## 7. FAQ (fond crème)
- Label : `• FAQ`. Titre à gauche : `Les questions qu'on nous pose [fréquemment].` (title tag orange).
- Sous le titre, en bas de la colonne gauche : **carte d'aide** (fond crème légèrement plus foncé, `color-mix(in srgb, var(--olive) 6%, var(--cream))`, rayon 28 px, padding ≈ 28 px) : titre `Toujours une question ?`, texte `Une question spécifique sur les normes de sécurité de votre lieu ou une contrainte de montage ? Nous vous répondons en moins de 24h.`, bouton orange (fond orange, texte blanc, point blanc, variante dédiée) `• Réserver un appel` → `/contact` (fictif).
- Colonne droite : **accordéon** de cartes blanches (rayon ≈ 20 px, espace ≈ 12 px, ombre très légère), question en Poppins 400 ≈ 18 px, bouton chevron rond à droite (ouvert : fond orange et chevron blanc orienté vers le haut ; fermé : fond orange pâle et chevron orange). Un seul panneau ouvert à la fois, **le premier ouvert par défaut**.
- Frame : `noel-page-17.jpg`.

| Question | Réponse |
|---|---|
| À partir de quand faut-il nous contacter pour Noël ? | Idéalement, prenez contact dès octobre ou novembre. La période de Noël est notre saison la plus chargée et les créneaux d'installation partent vite, surtout sur les premières semaines de décembre. Plus vous nous contactez tôt, plus on a de liberté pour concevoir quelque chose d'ambitieux. |
| Proposez-vous le démontage après les fêtes ? | Oui, c'est inclus dans toutes nos prestations de Noël. On vient récupérer tout le matériel après les fêtes, au moment qui vous arrange. |
| Peut-on personnaliser aux couleurs de notre marque ? | Absolument. C'est même ce qu'on préfère faire. Nous adaptons les couleurs des boules, des rubans, des guirlandes et de tous les éléments décoratifs à votre charte graphique. Votre décoration de Noël devient une extension cohérente de votre identité de marque. |
| Quel budget prévoir pour des décorations de Noël ? | Cela dépend de la surface, du type de décoration souhaité et du nombre d'espaces à habiller. Nos prestations commencent à quelques centaines d'euros pour une décoration simple et peuvent aller jusqu'à plusieurs milliers pour la décoration complète d'un hôtel ou d'un grand commerce. Contactez-nous pour un devis personnalisé. |
| Intervenez-vous en dehors de Paris ? | Oui, nous intervenons dans toute l'Île-de-France et en dehors pour les projets d'envergure. |

Note : le copywriting d'origine disait « dès septembre ou octobre » ; la maquette dit « octobre ou novembre ». La maquette prime (voir `06-POINTS-A-VALIDER-V2.md`).

## 8. CTA final
**Ne pas modifier le design ni l'animation d'apparition** (validés par le fondateur) : section de fond orange, titre `Les fêtes arrivent plus vite qu'on ne le croit. Planifiez votre décoration dès maintenant.` et bouton `Demander un devis Noël` → `/contact` (fictif).
**Seul changement : retirer le lien avec le numéro de téléphone.** Il ne reste que le bouton.

## 9. Footer
Footer V2, voir `03-FOOTER-V2.md`. La révélation en dessous est conservée.
