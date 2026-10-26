# 04 : Page Noël, hero, Notre volonté, flux horizontal

```
Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

La page Noël est entièrement refaite d'après les maquettes du fondateur. Le design de la première version (proposé par Claude) est abandonné. Lis retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md (sections 1 à 3) et retours-v2/docs/05-NOEL-ANIMATIONS.md (sections A à F et M). Regarde retours-v2/references/noel-frames/noel-page-01.jpg à noel-page-13.jpg, dans l'ordre.

Dans la page decoration-noel-entreprises-paris, supprime les sections de la V1 (bandeau de logos, promesse, références, galerie, anciennes cartes d'univers, ancienne timeline, ancienne FAQ). Garde la section CTA finale (elle sera ajustée au prompt 06) et le footer.

Construis, avec les textes exacts du doc :
1. **Hero** centré : même fond que l'accueil (réutilise l'asset bg-hero-leaves déjà dans le projet), ligne de positionnement, H1 « Décoration de [Noël] pour les entreprises à Paris. », sous-titre, CTA on-olive. Intro animée comme l'accueil.
2. **Notre volonté** : la photo noel-bw-eataly-plafond-large.jpg monte sur le hero épinglé (le hero s'estompe), voile noir, label, texte révélé par lignes avec les deux title tags pilules, disparition progressive au scroll.
3. **Transition** : la photo rétrécit (coins arrondis 14 px conservés) et glisse vers la gauche jusqu'à devenir une vignette dans le coin gauche, l'orange apparaît, le titre « Apportons [la magie de Noël] que méritent vos décors. » et le CTA on-orange apparaissent dynamiquement.
4. **Flux horizontal** : section orange épinglée, cinq photos défilent de la DROITE vers la GAUCHE (pas en vertical) à des vitesses différentes, en haut et en bas de l'écran avec zone centrale libre, certaines coupées par les bords, rayon 14 px. Titre et CTA fixes, au-dessus des photos. Positions de départ d'après le tableau du doc et les frames 07 à 11.
5. Fin du flux : le titre et le CTA baissent en opacité, la section Nos univers (prompt 05) arrivera par la droite. Prépare dès maintenant la structure (conteneur, ordre des couches, hauteurs de scroll), avec un simple bloc crème provisoire qui arrive par la droite par-dessus l'orange (translateX 100 vers 0).

Contraintes : transform, opacity et clip-path uniquement ; title tags en vraies pilules (composant .tag du prompt 01) ; réversible au scroll arrière ; pas de saut au resize ; header avec thème et dégradé selon le doc (section L) ; mobile et mouvement réduit selon la section M.

Vérification : captures Playwright (1728 x 1030) aux états des frames 01, 03, 04, 05, 06, 07, 09, 11, 12 et compare-les aux images de référence. Teste la fluidité (molette, trackpad, scroll rapide, retour arrière). Corrige les écarts, commit en français.
```
