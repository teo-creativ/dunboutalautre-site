# 06 : Points à valider (V2)

Décisions prises par défaut dans cette session. À confirmer ou corriger. Quand un point est tranché, le noter dans `docs/POINTS-A-VALIDER.md` du projet.

| # | Sujet | Constat | Par défaut dans la V2 |
|---|---|---|---|
| 1 | **Réalisations : lien titre / photo** | Dans le PDF, « Eataly » est associé à la photo de façade fleurie bleue et « Saint-Tropez, BHV » à la photo de table dressée. La façade bleue ressemble plutôt à une réalisation « Saint-Tropez » et la table à un restaurant. | On suit l'ordre du PDF (voulu par le fondateur). L'inversion se fait en une ligne dans le fichier de données des réalisations. |
| 2 | **Avis fictifs** | Les 4 témoignages de la page Noël sont inventés (noms fictifs, entreprises de la liste de réalisations). | Marqués `fictif: true`. **À remplacer par de vrais avis avant toute mise en ligne** (ne jamais publier des citations inventées attribuées à de vraies entreprises). |
| 3 | **Univers par défaut** | La maquette montre « Noël immersif » actif. | « Noël immersif » actif au chargement, l'univers reste actif quand la souris quitte la liste. |
| 4 | **Photo des univers** | Une seule photo couleur disponible (salon doré). | Photo fixe pour les 5 univers, champ `photo` prévu dans les données pour un fondu par univers plus tard. |
| 5 | **Délai de contact Noël** | Copywriting : « dès septembre ou octobre ». Maquette : « octobre ou novembre ». | La maquette. |
| 6 | **Réalisations : textes** | Titres repris du PDF et de la capture : Floral Fashion Show, Felicita Halloween, Eataly, Saint-Tropez BHV, Atelier Du Geste à l’Emotion. | Titres tels quels, pages de réalisations fictives (`href="#"`). |
| 7 | **Couleurs du PDF Réalisations** | Le PDF a perdu les couleurs (fond noir). | Fond olive #5E530E d'après la capture d'état actif. |
| 8 | **Facebook** | Le footer V2 affiche Facebook. URL inconnue. | Lien `#` provisoire, Instagram déjà connu. |
| 9 | **Téléphone et e-mail** | Retirés du footer V2 (non présents dans le design), restent dans le menu. | Suivre le design. |
| 10 | **Section Services de l'accueil** | Numéros supprimés. La ligne « Décors de Noël » n'apparaît pas dans cette liste (6 lignes). | 6 lignes sans numéro. |
| 11 | **Bouton « Réserver un appel » (FAQ)** | Variante orange pleine non définie dans le design system. | Pilule orange, texte blanc, point blanc, remplissage au survol en olive. |
| 12 | **Footer : wordmark** | Le design V2 montre un wordmark de taille normale, plus le wordmark géant rogné de la V1. | Wordmark ≈ 370 px en bas à gauche. |
