# 04. Revue V3

Copier-coller le texte ci-dessous dans Claude Code une fois les prompts 01 à 03 faits.

---

Fais la revue finale de la V3 sans ajouter de nouvelle fonctionnalité.

1. **Nettoyage** : cherche dans le projet les restes du scroll horizontal de la page Noël (classes, variables, `xPercent`, calculs de largeur, CSS ou JS inutilisés) et supprime-les. Vérifie qu'aucun ScrollTrigger orphelin ne reste, et qu'il n'y a aucune erreur ni avertissement dans la console.
2. **Cohérence** : la page Noël s'enchaîne bien : Hero, Notre volonté, cercle orange, section orange avec photos, Nos univers, Notre fonctionnement, témoignages, FAQ, CTA final orange sans lien téléphone, footer. Rien d'autre n'a bougé.
3. **Captures Playwright** à 1728x1030, 1440x900, 1280x720, 768x1024 et 390x844 : 
   - la zone flux vertical à 6 moments (Notre volonté, cercle à 30 %, orange avec photos entrantes, photos en montée, sortie des photos, arrivée de Nos univers),
   - Notre fonctionnement à 3 moments,
   - Nos univers avec deux items survolés.
   Regarde chaque capture : aucun texte coupé, aucune photo qui gêne le titre ou le logo, aucun débordement horizontal.
4. **Régression** : l'accueil, le footer, l'animation du CTA, l'overlap des Services et la section Réalisations fonctionnent comme avant.
5. **Performance** : pas de `width`, `height`, `top` ou `left` animés dans les nouvelles animations. Seulement `transform`, `opacity`, `clip-path`. `prefers-reduced-motion` est géré partout où on a ajouté du mouvement.
6. **Écriture** : aucun tiret long (" — ") dans les fichiers modifiés.
7. Rappelle-moi que les avis de la page Noël sont fictifs (`fictif: true`) et à remplacer avant toute mise en ligne publique.

Termine par un court rapport : ce qui est conforme, ce que tu as corrigé pendant la revue, et les points que je dois valider à l'oeil (voir `retours-v3/docs/04-POINTS-A-VALIDER-V3.md`).
