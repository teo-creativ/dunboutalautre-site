// Page Décoration saisonnière : tous les textes viennent de docs/copywriting/06-decoration-saisonniere.md (premier jet, à retravailler avec
// la cliente), le title et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
// Le client sans logo fourni (Eataly) a `logo: null` : [À compléter].
import { todo } from "../../components/placeholder.js";

export const saisonniere = {
  id: "saisonniere",
  path: "/decoration-vegetale-saisonniere-paris/",
  source: "06-decoration-saisonniere.md",
  title: "Décoration saisonnière en entreprise | D'un Bout À L'autre",
  description:
    "Décoration saisonnière pour entreprises, hôtels et commerces à Paris : Noël, printemps, événements internes, vitrines. Conception, installation, démontage.",
  sections: [
    {
      type: "hero",
      title: "Décoration saisonnière pour entreprises à Paris : un décor végétal qui change avec les saisons.",
      tag: "avec les saisons",
      lead: "Noël, printemps, événements internes, vitrines : nous concevons, fabriquons, installons et démontons. Vous n'avez rien à gérer.",
      cta: "Demander un devis gratuit",
    },
    {
      type: "intro",
      label: "L'AVANTAGE PRINCIPAL",
      title: "On s'occupe de tout le processus. Vous recevez vos clients dans un espace qui change avec l'année.",
      tag: "un espace qui change avec l'année",
      paragraphs: [
        "Les fêtes, les lancements de saison, les temps forts internes : la décoration passe souvent au second plan, et pourtant c'est ce que vos clients voient dès qu'ils poussent la porte.",
        "Chez D'un Bout À L'autre, on s'occupe de tout : sélection du matériel en accord avec votre identité, fabrication, livraison, installation dans vos délais, et démontage ensuite. Votre équipe n'a rien à coordonner, rien à stocker, rien à démonter. Vous récupérez vos locaux comme vous les avez laissés.",
      ],
    },
    {
      type: "cards",
      label: "NOS OCCASIONS",
      title: "Une décoration pour chaque moment de l'année.",
      tag: "chaque moment de l'année",
      items: [
        {
          title: "Noël",
          text: "Sapins, scénographies, décors aux couleurs de votre marque. Noël a sa propre page, avec cinq univers à choisir.",
          link: { label: "Décoration de Noël pour entreprises", to: "/decoration-noel-entreprises-paris/" },
        },
        {
          title: "Printemps",
          text: "Compositions fleuries, façades et halls qui se renouvellent avec les beaux jours. Un décor frais pour accueillir la nouvelle saison : branches fleuries, plantes en pleine floraison, couleurs douces.",
        },
        {
          title: "Événements internes",
          text: "Séminaire, fête de fin d'année, anniversaire d'entreprise, rentrée, remise de prix : un décor végétal pour marquer le moment et donner envie d'être là.",
        },
        {
          title: "Vitrines",
          text: "Un décor végétal de saison pour votre boutique, votre hôtel ou votre restaurant. La vitrine est la première rencontre avec le passant : on la soigne à chaque saison.",
        },
      ],
    },
    {
      type: "intro",
      label: "UN DÉCOR QUI ÉVOLUE",
      title: "Changez de saison sans y penser.",
      tag: "sans y penser",
      paragraphs: [
        "On peut aussi vous accompagner toute l'année : renouvellement du décor à chaque saison, stockage et réutilisation des éléments, entretien des végétaux. C'est le principe de notre abonnement.",
      ],
      more: { label: "Entretien & abonnements végétal", to: "/entretien-abonnement-plantes-entreprise-paris/" },
    },
    {
      type: "cards",
      label: "NOS RÉFÉRENCES",
      title: "Ils nous ont confié leurs saisons.",
      tag: "leurs saisons",
      items: [
        {
          logo: "hotel-cluny-square",
          title: "Hôtel Cluny Square",
          text: "Décoration complète de la façade et des espaces intérieurs, guirlandes, couronnes, compositions florales. Un projet qui demande discrétion, élégance et respect de l'identité de l'établissement.",
        },
        {
          logo: "grands-boulevards",
          title: "Hôtel des Grands Boulevards",
          text: "Décoration de Noël intérieure pour les espaces communs et le restaurant, une ambiance festive mais maîtrisée, en accord avec l'ADN de l'hôtel.",
        },
        {
          logo: null,
          title: "Eataly Paris",
          text: "Façade fleurie au printemps et à l'été, grand sapin et plafond végétalisé pour la période des fêtes.",
        },
        {
          logo: "bhv-marais",
          title: "BHV Marais",
          text: "Décoration de la terrasse du soleil du Marais, scénographie du réveillon du Nouvel An.",
        },
        {
          logo: "botimyst",
          title: "Botimyst",
          text: "Décoration de saison pour les espaces de l'enseigne, sapins, guirlandes et compositions florales.",
        },
      ],
    },
    {
      type: "gallery",
      label: "GALERIE",
      items: [
        { photo: { src: "photos/saison-facade-fleurie-bleue", alt: "Façade d'immeuble parisien couverte de fleurs bleues, jaunes et orange, vue d'en bas sous un ciel bleu" } },
        { photo: { src: "photos/saison-facade-tournesols-atelier", alt: "Enseigne de l'Atelier Du Geste à l'Emotion entourée de guirlandes de tournesols" } },
        { photo: { src: "photos/noel-eataly-plafond-vegetalise", alt: "Plafond d'un restaurant recouvert de feuillage, de fougères blanches, de fruits rouges et de suspensions en verre" } },
        { photo: { src: "photos/noel-salon-dore-arche-lustre", alt: "Grand salon aux dorures vu à travers une arche, avec un lustre en cristal et des branches blanches givrées" } },
        { photo: { src: "photos/noel-salon-dore-branches-givrees", alt: "Salon aux boiseries dorées décoré de branches blanches givrées, de bûches de bouleau et de sapin" } },
        { photo: null },
      ],
      cta: { label: "Voir toutes nos décorations", to: "/realisations/" },
    },
    {
      type: "faq",
      label: "FAQ",
      title: "Vos questions fréquentes",
      tag: "fréquentes",
      items: [
        {
          q: "À partir de quand faut-il nous contacter pour une décoration de saison ?",
          a: "Idéalement, 2 à 3 mois avant la période souhaitée. Pour Noël, prenez contact dès septembre ou octobre : les créneaux d'installation partent vite, surtout pour les premières semaines de décembre.",
        },
        {
          q: "Proposez-vous le démontage après la période ?",
          a: "Oui, il est prévu dans nos prestations. On vient récupérer tout le matériel au moment qui vous arrange.",
        },
        {
          q: "Peut-on personnaliser aux couleurs de notre marque ?",
          a: "Absolument. C'est même ce qu'on préfère faire. Nous adaptons les couleurs, les rubans, les guirlandes et tous les éléments décoratifs à votre charte graphique.",
        },
        {
          q: "Intervenez-vous en dehors de Paris ?",
          a: "Oui, nous intervenons dans toute l'Île-de-France et en dehors pour les projets d'envergure.",
        },
        {
          q: "Quel budget prévoir pour décorer nos locaux ?",
          a: "Cela dépend de la surface, du type de décoration et du nombre d'espaces à habiller. Nos prestations commencent à quelques centaines d'euros pour une décoration simple et peuvent aller jusqu'à plusieurs milliers pour la décoration complète d'un hôtel ou d'un grand commerce. Contactez-nous pour un devis personnalisé.",
        },
      ],
    },
    {
      type: "cta-final",
      title: "Une saison approche ? Préparons votre décor dès maintenant.",
      tag: "dès maintenant",
      cta: "Demander un devis",
      phone: { label: "Téléphone :", value: todo("téléphone") },
    },
  ],
};
