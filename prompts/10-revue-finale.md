# 10 : Revue finale et démonstration

```
Fais une revue finale de la V1 comme le ferait un directeur artistique exigeant.

1. **Comparaison frame par frame** : pour chaque image de references/frames/ et references/menu/, capture l'état équivalent dans le site (Playwright, viewport 1728x1030) et note les écarts de couleur, de taille, d'espacement, de rythme d'animation. Corrige tout écart visible.
2. **Fluidité** : parcours la page entière à la molette, au trackpad, avec les touches Page suivante/précédente, puis scroll arrière rapide. Il ne doit y avoir aucun saut, aucun élément bloqué à moitié animé, aucun flash.
3. **Textes** : compare chaque texte du site avec docs/CONTENU-ACCUEIL.md et docs/CONTENU-NOEL.md. Vérifie l'absence de tiret long (le caractère em dash), de faute et de texte inventé.
4. **Contenu manquant** : liste tous les placeholders restants ([À compléter], photos provisoires, logos manquants) dans un tableau à envoyer au fondateur.
5. **Tests** : `npm run build` sans avertissement, `npm run preview` fonctionnel, Lighthouse desktop (Performance ≥ 85, Accessibilité ≥ 95, Bonnes pratiques ≥ 95, SEO ≥ 95).
6. **Démonstration** : mets à jour README.md avec les commandes et le déploiement sur Netlify ou Vercel (build `npm run build`, dossier `dist`), pour que le fondateur puisse partager un lien privé à la cliente. Ajoute une section « Ce que la cliente doit voir » (3 ou 4 moments clés à scroller) et une section « Prochaines étapes » (pages à intégrer, sections à designer, passage à Webflow).
7. Mets à jour docs/POINTS-A-VALIDER.md.

Termine par un compte rendu en 15 lignes maximum : ce qui est fait, ce qui reste, les trois améliorations les plus rentables.
```
