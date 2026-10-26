# 06 : Page Noël, témoignages, FAQ, CTA final, SEO

```
Règles de cette session : la stack ne change pas (Vite, JavaScript vanilla en modules ES, CSS natif, GSAP avec ScrollTrigger et SplitText, Lenis, voir CLAUDE.md). Aucune nouvelle dépendance, aucun framework. Pas de tiret long dans les textes. Adapte-toi à la structure de code DÉJÀ en place dans le projet (noms de fichiers, découpage) : modifie l'existant, ne réécris pas tout. Ne touche pas à ce qui est validé : révélation du footer en dessous, animation du CTA, section finale orange de la page Noël, apparition de la section Services par-dessus la précédente.

Lis retours-v2/docs/04-NOEL-STRUCTURE-ET-CONTENU.md (sections 6 à 9 et SEO) et retours-v2/docs/05-NOEL-ANIMATIONS.md (sections I, J, K). Regarde noel-page-16.jpg et noel-page-17.jpg dans retours-v2/references/noel-frames/.

1. **Témoignages** : section crème avec l'icône retours-v2/assets/brand/icon-testimonial.svg (déjà copiée dans public/assets/brand/), filet vertical, citation, nom, poste, flèches précédent et suivant. 4 avis FICTIFS dans un fichier de données avec fictif: true et le commentaire « FICTIF : à remplacer avant mise en ligne ». Animation d'entrée (icône, lignes de la citation) et changement d'avis par lignes. Accessible : aria-live polite, aria-roledescription carousel, boutons avec aria-label, indicateur « Avis 2 sur 4 » pour les lecteurs d'écran. Pas d'autoplay.

2. **FAQ** : titre avec title tag « fréquemment », carte d'aide « Toujours une question ? » avec bouton orange « Réserver un appel », accordéon de cartes blanches arrondies (5 questions du doc, un seul panneau ouvert, le premier ouvert par défaut), animation fluide de hauteur avec GSAP, chevron rond qui change de couleur. JSON-LD FAQPage généré depuis les mêmes données. Accessible : button, aria-expanded, aria-controls, region.

3. **CTA final** : NE PAS modifier le design ni l'animation d'apparition. Retire uniquement le lien du numéro de téléphone (il ne reste que le bouton « Demander un devis Noël »).

4. **SEO** : vérifie le title, la meta description, le canonical, un seul h1, la hiérarchie des h2.

5. **Header** : dégradé cream sur témoignages et FAQ, off sur le CTA final.

Vérification : captures Playwright des sections témoignages (3 avis différents) et FAQ (premier ouvert, puis un autre ouvert), comparaison avec les frames 16 et 17. Test clavier complet du carrousel et de l'accordéon. Vérifie que le JSON-LD est valide. Commit en français.
```
