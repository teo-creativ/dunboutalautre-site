# 04 : Header et menu plein écran

```
Lis docs/ANIMATIONS.md §9 et §11, DESIGN.md §5.3 et §5.7, regarde toutes les images de references/menu/ (menu-hover-*.png) et references/frames/home-animation-01.jpg (header).

Construis le header et le menu plein écran (src/components/header.js, menu.js, src/styles/header.css, menu.css, src/scripts/menu.js, header-theme.js).

Header : logo wordmark à gauche (SVG, public/assets/brand/logo-wordmark-cream.svg, recolore en #FEF1E0), bouton « • Menu » à droite (composant CTA, voir prompt 03). Fixe, au-dessus de tout, transparent.

Menu (deux colonnes, fond olive, filet vertical central) :
- Gauche : liens énormes Accueil, Services, Réalisations (avec « (32) » en petit italique, valeur lue dans src/data/site.js), Contact, Blog. Poppins Light ≈ 88 px à 1728.
- Droite, état par défaut : titre « Parlons de la transformation de [votre espace] ensemble. » (title tag orange), photo N&B arrondie (bandeau 16:5, `bw-lavande-tour-eiffel-large.png`), label CONTACT, e-mail, téléphone (voir src/data/site.js).
- Droite, au survol de « Services » : le titre, la photo et le contact sont REMPLACÉS par le label SERVICES et la liste des 7 sous-liens : Végétalisation de bureaux, Design végétal sur mesure, Scénographie végétale, Terrasses, Décoration saisonnière, Entretien & abonnements, Décors de Noël. La liste reste visible quand la souris passe de « Services » à la colonne de droite. Elle disparaît quand on survole un autre lien principal ou quand on quitte les colonnes (délai ≈ 250 ms).
- Survol de n'importe quel lien (principal ou sous-lien) : point orange qui apparaît à gauche, texte décalé vers la droite (~35 px à l'échelle principale), soulignement orange épais qui se dessine de gauche à droite (0,45 s power3.out) et se rétracte à la sortie.

Animations d'ouverture et de fermeture : suivre exactement docs/ANIMATIONS.md §9 (fond avec fondu et balayage de dégradé depuis le coin haut droit, filet vertical qui se dessine, liens qui montent depuis un masque en stagger, colonne de droite en cascade, photo avec clip-path). Le bouton devient « Fermer ». Scroll bloqué via lenis.stop() pendant l'ouverture. Fermeture inverse, plus rapide.

Accessibilité : `<nav aria-label>`, bouton avec aria-expanded et aria-controls, focus piégé dans le menu, Échap ferme, retour du focus au bouton, `inert` sur le reste de la page quand le menu est ouvert, « Services » utilisable au clavier (Entrée/Espace déplie la liste, aria-expanded).

Thème du header (§11) : sur fond crème, logo olive et bouton en variante on-cream. Pilote-le avec ScrollTrigger sur les sections (data-header-theme="dark|light").

Les liens sont fictifs : `href` vers les URLs finales de docs/CONTENU-ACCUEIL.md, mais ils ne doivent pas casser la démo (en dev, un clic sur un lien de service peut renvoyer vers `#`). Centralise la logique dans src/data/site.js.

Vérifie : captures des 5 états de references/menu/ (Accueil, Services, Réalisations, Blog survolés, sous-lien Terrasses survolé), comparaison avec les images de référence, test clavier complet, test de survol rapide (aucun clignotement, aucune animation bloquée).
```
