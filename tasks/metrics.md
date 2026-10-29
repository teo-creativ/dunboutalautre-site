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

## Point A : page pilote Terrasses (2026-10-29, build de prod, après T10)

| Mesure | Résultat | Seuil |
|---|---|---|
| Lighthouse desktop `/amenagement-terrasse-paris/` (médiane de 3) | Performance 99 (99, 99, 97) · Accessibilité 96 · Bonnes pratiques 100 · LCP 991 ms · CLS 0,001 · TBT 0 ms | 85 · 95 · 95 |
| axe-core (repos, menu ouvert, FAQ et offres au focus) | 0 violation propre | 0 |
| `main-*.css` gzip | 9,35 ko (départ 8,86 ko, +0,49 ko) | ≤ 14,86 ko |
| `main-*.js` gzip | 67,30 ko (inchangé : aucun script ajouté) | ≤ 71,30 ko |
| Porte de non-régression (HTML octet pour octet, 16 captures) | identique | identique |
| Largeurs 1728, 1440, 1280, 768, 375 | aucun défilement horizontal, console vide, H1 en 3 lignes (5 à 375 px) | |

**Hérité du design, compté à part par `axe.mjs`.** Le texte orange (`#fc4c00`) sur blanc ou sur crème donne 3,0 à 3,4:1, sous les 4,5:1 du texte courant : bouton « Menu », texte des CTA `on-olive` et `on-orange`, labels de section (« • NOS STYLES D'AMÉNAGEMENT »). Même teinte et mêmes usages sur l'accueil et Noël, validés ; ils viennent de DESIGN.md §2, §5.2 et §5.3. Les pages neuves n'ajoutent pas d'autre usage. Décision de design à prendre par le fondateur (par exemple un texte olive foncé pour les labels et un orange plus sombre pour le texte des CTA) ; consigné dans `docs/POINTS-A-VALIDER.md` à T30.
Noël, dans l'état « FAQ et offres au focus », a en plus des nœuds `color-contrast` en cours d'animation (texte d'un tag crème sur orange, panneau d'une offre) : existants, hors périmètre.

## Point B : page Bureaux complète (après T15)

| Mesure | Résultat | Seuil |
|---|---|---|
| Lighthouse desktop `/vegetalisation-bureaux-paris/` (médiane de 3) | Performance 97 (97, 95, 97) · Accessibilité 96 · Bonnes pratiques 100 · LCP 1214 ms · CLS 0,001 · TBT 0 ms | 85 · 95 · 95 |
| axe-core (repos, menu ouvert, éléments ouverts) | 0 violation propre | 0 |
| `main-*.css` gzip | 9,83 ko (+0,97 ko depuis le départ) | ≤ 14,86 ko |
| `main-*.js` gzip | 67,80 ko (+0,50 ko, le défilement de la frise) | ≤ 71,30 ko |
| Porte de non-régression (HTML octet pour octet, 16 captures) | identique | identique |
| Frise de logos | 40,7 px/s (40 attendus), boucle sans à-coup sur 12 s, arrêt au survol et reprise, statique en mouvement réduit et à 390 px | |

**Méthode d'axe, précisée.** Les audits tournent en mouvement réduit (`reducedMotion: "reduce"`) : contenu entièrement visible et immobile, donc le contraste mesuré est celui du texte et non celui d'un élément à mi-fondu (révélations, étapes estompées). Sont comptés à part, comme hérités du design validé : le texte orange `#fc4c00` sur blanc ou crème (3,0 à 3,4:1) et les labels de colonnes du footer en gris `#B7B7B7` sur olive (3,85:1, `docs/POINTS-A-VALIDER.md` ligne 80). Sur l'accueil et Noël, l'audit donne désormais lui aussi 0 violation propre (les violations « en cours d'animation » relevées au départ n'existaient qu'à mi-fondu).

## Point C : 6 pages de service (après T19)

| Page | Performance | Accessibilité | Bonnes pratiques | LCP | CLS |
|---|---|---|---|---|---|
| Terrasses | 99 (3 passes, Point A) | 96 | 100 | 991 ms | 0,001 |
| Bureaux | 97 (3 passes, Point B) | 96 | 100 | 1214 ms | 0,001 |
| Design végétal | 97 (1 passe) | 96 | 100 | 1271 ms | 0,009 |
| Scénographie | 97 (1 passe) | 97 | 100 | 1205 ms | 0,010 |
| Décoration saisonnière | 94 (1 passe) | 96 | 100 | 1526 ms | 0,026 |
| Entretien | 98 (1 passe) | 96 | 100 | 1124 ms | 0,004 |

Seuils : Performance ≥ 85, Accessibilité ≥ 95, Bonnes pratiques ≥ 95 : tenus sur les 6 pages. axe-core : 0 violation propre sur les 6 pages (repos, menu ouvert, éléments ouverts). Poids : `main-*.css` 9,99 ko gzip (budget 14,86 ko), `main-*.js` 67,80 ko gzip (budget 71,30 ko). Porte de non-régression : HTML d'Accueil et de Noël identique octet pour octet, 16 captures à 0 écart. Largeurs 1728, 1280, 768 et 375 px : aucun défilement horizontal, console vide sur les 6 pages. Le H1 le plus long (Scénographie, 100 caractères) tient sur 4 lignes à 1728 px et sur 6 à 375 px.
Valeurs à compléter (`check-site.js --placeholders`) : 40 placeholder(s) dans 6 page(s)..

## Point D : page Contact (après T23)

| Mesure | Résultat | Seuil |
|---|---|---|
| Lighthouse desktop `/contact/` (médiane de 3) | Performance 97 (97, 90, 98) · Accessibilité 96 · Bonnes pratiques 100 · LCP 1324 ms · CLS 0,006 · TBT 0 ms | 85 · 95 · 95 |
| axe-core, 5 états (repos, menu ouvert, éléments ouverts, formulaire en erreur, formulaire envoyé) | 0 violation propre | 0 |
| `main-*.css` gzip | 10,60 ko (+1,74 ko depuis le départ) | ≤ 14,86 ko |
| `main-*.js` gzip | 68,67 ko (+1,37 ko : défilement de la frise et formulaire) | ≤ 71,30 ko |
| Formulaire (sonde CDP) | soumission vide : 7 erreurs, résumé et focus ; e-mail et téléphone invalides détectés puis corrigés à la volée ; confirmation exacte « Formulaire valide. Prototype : aucun message n'a été envoyé. » ; 0 requête réseau, 0 écriture de stockage, pas de navigation ; `?prestation=saisonniere` coche la prestation ; Espace coche une pilule | |
| Console | vide, sans avertissement GSAP (garde de `intro.js`, hero sans CTA) | |
| Porte de non-régression (HTML octet pour octet, 16 captures) | identique | identique |

## Point E : Réalisations et fiche projet (après T26)

| Mesure | Résultat | Seuil |
|---|---|---|
| Lighthouse desktop `/realisations/` (2 passes) | Performance 99 (98, 99) · Accessibilité 96 · Bonnes pratiques 100 · LCP 1073 ms · CLS 0,024 · TBT 19 ms | 85 · 95 · 95 |
| Lighthouse desktop `/realisations/floral-fashion-show/` | Performance 98 (98, 97 en dernière série) · Accessibilité 96 · Bonnes pratiques 100 · LCP 1227 ms · CLS 0,006 | 85 · 95 · 95 |
| axe-core (repos, menu ouvert, éléments ouverts) sur les deux pages | 0 violation propre | 0 |
| `main-*.css` gzip | 11,06 ko (+2,20 ko depuis le départ) | ≤ 14,86 ko |
| `main-*.js` gzip | 68,85 ko (+1,55 ko) | ≤ 71,30 ko |
| Filtres (sonde CDP) | 7 boutons, « Tous » 5 cartes, Scénographie 2, Terrasses 0 avec message annoncé, clavier (Espace, Entrée), un seul bouton pressé | |
| Porte de non-régression (HTML octet pour octet, 16 captures) | identique | identique |

**Instabilité réseau constatée.** Pendant cette séance, les polices Google (`fonts.googleapis.com`, feuille de style bloquante) ont par moments coupé la connexion (`ERR_CONNECTION_CLOSED`). Une première série Lighthouse sur la fiche a donné 96, 57 et 55 (LCP 5,3 s) pendant l'une de ces coupures ; la série suivante, réseau revenu, a donné 98 et 97 sur la fiche, 98 et 97 sur Contact, 96 et 97 sur l'accueil (même code). Les outils de `.baseline/` rechargent désormais la page (3 essais) et écartent ces coupures du compte d'erreurs de console. La dépendance de chargement aux polices Google existe déjà sur l'accueil et Noël (`head.js`) ; l'auto-hébergement des polices est une piste pour la mise en ligne, à décider.

## Points F et T29 : audit des 13 pages (build finale, après T28)

**Poids.** `main-*.css` 11,36 ko gzip (départ 8,86 ko, +2,50 ko, budget +6 ko) ; `main-*.js` 68,85 ko gzip (départ 67,30 ko, +1,55 ko, budget +4 ko).

**Lighthouse desktop, polices Google bloquées (poids du site seul, 1 passe).** Performance 100 sur les 13 pages ; Accessibilité 96 partout, 97 sur Scénographie, 95 sur le Blog ; Bonnes pratiques 100 ; CLS 0 (0,023 sur Réalisations) ; LCP de 434 à 632 ms.

**Lighthouse avec les polices Google (réseau réel de cet environnement).** Performance de 94 à 99 quand le réseau est stable (Terrasses 96-99, Bureaux 97, Design 98-99, Scénographie 97, Saisonnière 94-96, Entretien 97-98, Réalisations 98-99, fiche 97-98, Contact 97-98, Blog 98, article 97, accueil 95-97, Noël 95-98). Des passes isolées tombent à 52-69 quand `fonts.googleapis.com` coupe la connexion (`ERR_CONNECTION_CLOSED`), y compris sur l'accueil et Noël : bruit réseau, pas une régression.

**Comparaison A/B de l'accueil et de Noël** (commit `ed795e5` construit à part contre la build courante, passes alternées, 4 par côté, polices bloquées) : Performance 100 des deux côtés, FCP 400 ms contre 398 ms (accueil) et 399 contre 400 ms (Noël), LCP 580 contre 582 ms (accueil) et 579 contre 578 ms (Noël). Le bundle commun a grossi de 2,50 ko (CSS) et 1,55 ko (JS) gzip : aucun effet mesurable. Critère « pas plus de 2 points sous le départ » : tenu (écart nul à conditions égales).

**axe-core** (repos, menu ouvert, éléments ouverts ; états du formulaire pour Contact) : 0 violation propre sur les 11 pages neuves. Hérité du design, compté à part : texte orange `#fc4c00` sur blanc ou crème (3,0 à 3,4:1) et labels de colonnes du footer en gris sur olive (3,85:1). Sur Noël, un nœud existant : le texte du CTA `solid` de la carte d'aide de la FAQ (page validée, hors périmètre).

**Audit transversal (`audit.mjs`)** : aux 6 largeurs 390, 768, 1024, 1440, 1728 et 1920 px, aucun défilement horizontal, un seul `h1`, console vide, sur les 13 pages ; sans JavaScript, contenu complet (de 424 caractères pour l'article modèle à 7 979 pour Bureaux ; bouton d'envoi du formulaire désactivé) ; en mouvement réduit, après parcours de la page, aucun élément masqué et aucune frise défilante.

**Porte de non-régression** : HTML construit d'Accueil et de Noël identique octet pour octet (36 427 et 51 267 octets) et 16 captures sans écart, à chaque commit qui touche un fichier partagé.
