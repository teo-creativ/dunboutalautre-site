# CONTENU-NOEL.md : landing « Décoration de Noël pour entreprises »

Page de campagne (URL finale `/decoration-noel-entreprises-paris/`, redirigée depuis `/decoration-noel-professionnels`). **Un seul objectif : obtenir une demande de devis Noël.** Texte source complet : `docs/copywriting/07-landing-noel.md` (la FAQ y est rédigée en entier, à reprendre mot pour mot).

**Cette page n'est pas encore designée.** Le design est à **proposer** en appliquant strictement `DESIGN.md` (même palette, mêmes title tags, mêmes CTA, mêmes animations de révélation) et en s'inspirant des sections de l'accueil. Il sera validé ensuite par le fondateur.

## SEO
- Title (59 car.) : `Décoration de Noël entreprise à Paris | D'un Bout À L'autre`
- Meta description (155 car.) : `Décoration de Noël pour entreprises à Paris : sapins, scénographies, décors aux couleurs de votre marque. Conception, fabrication, installation, démontage.`
- `<h1>` : « Décoration de Noël pour entreprises à Paris. »

## Structure, textes et composants suggérés

1. **Header** : identique à l'accueil, plus un CTA persistant « Demander un devis Noël » (pilule, variante selon le fond) et le téléphone.
2. **Hero** (fond olive + feuilles, ou photo plein écran du salon doré avec voile olive)
   - H1 : `Décoration de [Noël] pour entreprises à Paris.` (title tag orange sur « Noël »)
   - Sous-titre : `Du sapin à la scénographie complète : nous concevons, fabriquons, installons et démontons votre décor de Noël.`
   - CTA unique : `Demander un devis Noël` → `/contact` (fictif) + téléphone.
   - Photo : `public/assets/images/photos/noel-salon-dore-arche-lustre.jpg`.
3. **Bandeau de confiance** : frise défilante de logos en niveaux de gris : Hôtel Cluny Square, Hôtel des Grands Boulevards (`grands-boulevards.jpg`), Eataly (logo manquant : texte provisoire), Botimyst.
4. **La promesse** (fond crème)
   - Titre : `Conception · fabrication · installation · démontage.`
   - Deux paragraphes (texte dans `docs/copywriting/07-landing-noel.md`).
5. **Les 5 univers de Noël** : titre `Choisissez l'univers de votre Noël.` Cinq cartes avec photo, numéro `01` à `05`, titre, texte et « encarts » (petites pilules « Idéal pour ») : Noël naturel, Noël chic, Noël immersif, Noël corporate, Noël responsable. Texte exact dans le fichier source. Photos disponibles :
   - Noël chic → `noel-salon-dore-branches-givrees.jpg`
   - Noël immersif → `noel-eataly-plafond-vegetalise.jpg`
   - Noël naturel, corporate, responsable → **pas de photo**, utiliser un fond uni orange/olive avec la feuille décorative et un numéro, ou un visuel N&B existant, en attendant les photos de la cliente.
   - Bouton sous la liste : `Demander un devis Noël`.
6. **Comment ça se passe** (fond olive ou crème) : titre `Du premier échange au démontage.` Timeline en 5 étapes : Brief, Proposition visuelle, Fabrication, Installation, Démontage (textes dans le fichier source). Animation suggérée : ligne qui se dessine au scroll, étapes qui apparaissent une à une.
7. **Références** : titre `Ils nous ont confié leur Noël.` Hôtel Cluny Square, Hôtel des Grands Boulevards, Eataly Paris, Botimyst (textes dans le fichier source) + emplacement témoignage : `« [Citation client à intégrer] »` / `Prénom Nom, Poste, Entreprise`.
8. **Galerie** : 6 photos de Noël (utiliser les 3 photos `noel-*` disponibles, compléter avec des emplacements d'image provisoires). CTA `Demander un devis Noël`.
9. **FAQ** (accordéon accessible, schéma `FAQPage` en JSON-LD) : 6 questions et réponses du fichier source.
10. **CTA final** (fond orange, CTA `on-orange`) : `Les fêtes arrivent plus vite qu'on ne le croit. Planifiez votre décoration dès maintenant.` Bouton `Demander un devis Noël`.
11. **Footer** : identique à l'accueil (révélation).

## Données à ne pas inventer
Dates limites de commande de Noël, prix, formules : laisser des placeholders `[À compléter]`. Le copywriting cite : « Idéalement, prenez contact dès septembre ou octobre. »
