# 00. Lancement V3

Copier-coller le texte ci-dessous dans Claude Code.

---

Nous passons à la V3 du site D'un Bout À L'autre. La V2 est déjà intégrée. Je ne veux rien coder pour l'instant : je veux que tu lises et que tu me confirmes ta compréhension.

À lire dans cet ordre :

1. `CLAUDE.md` à la racine (stack et conventions).
2. `retours-v3/README.md`
3. `retours-v3/docs/00-RETOURS-V3.md`
4. `retours-v3/docs/01-NOEL-SCROLL-VERTICAL.md`, `02-FONCTIONNEMENT-TIMELINE.md`, `03-UNIVERS-HOVER-FLUIDE.md`, `04-POINTS-A-VALIDER-V3.md`
5. Les images de `retours-v3/references/noel-vertical-frames/` (10 images, à regarder dans l'ordre) et de `retours-v3/references/etat-actuel-v2/` (8 captures de l'existant).

Règles à respecter pour toute la V3 :

- La stack ne change pas : Vite multi-page, JS vanilla en modules ES, CSS natif, GSAP (ScrollTrigger, SplitText), Lenis. N'ajoute aucune dépendance, ne change rien à la configuration ni à la structure technique du projet.
- Adapte-toi à la structure existante (noms de fichiers, classes, modules, tokens CSS). Les noms de classes des docs sont indicatifs : réutilise ceux qui existent déjà.
- Pas de tiret long (" — ") dans les textes ni dans le code commenté.
- Ne touche pas aux animations déjà validées : footer, animation du CTA, section CTA finale orange de la page Noël, overlap des Services, accueil.
- Les textes restent identiques, seule l'animation et la mise en scène changent.

Ensuite, réponds-moi avec :

1. Un résumé en 8 lignes maximum de ce que tu as compris des 3 changements.
2. La liste des fichiers du projet que tu penses modifier (HTML, CSS, JS de la page Noël).
3. Les questions que tu as, s'il y en a. Sinon écris "Pas de question".

Ne modifie aucun fichier à cette étape.
