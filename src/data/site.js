// Source unique des données du site. Voir docs/POINTS-A-VALIDER.md pour les valeurs à confirmer.
// Seules l'accueil et la landing Noël existent dans ce prototype. Les autres pages ont leur URL finale (`path`)
// mais pas `live: true` : `href()` renvoie alors "#" pour ne pas casser la démo.

const services = [
  { label: "Végétalisation de bureaux", path: "/vegetalisation-bureaux-paris/", text: "Plantes, bacs, cloisons végétales, murs, espaces d'accueil… On installe le végétal là où vivent vos équipes." },
  { label: "Design végétal sur mesure", path: "/design-vegetal-sur-mesure-paris/", text: "Tableaux, logos, murs végétaux, structures, suspensions… Des créations uniques, fabriquées pour votre espace." },
  { label: "Scénographie végétale", path: "/scenographie-vegetale-evenementiel-paris/", text: "Lancements, soirées, salons, shootings. On transforme vos événements en décors végétaux sur mesure." },
  { label: "Terrasses", path: "/amenagement-terrasse-paris/", text: "Du balcon parisien à la grande terrasse d'hôtel ou de restaurant : des extérieurs où l'on a envie de rester." },
  { label: "Décoration saisonnière", path: "/decoration-vegetale-saisonniere-paris/", text: "Noël, printemps, événements internes, vitrines… Un décor qui change avec les saisons, sans rien gérer de votre côté." },
  { label: "Entretien & abonnements", path: "/entretien-abonnement-plantes-entreprise-paris/", text: "Entretien, remplacement, renouvellement des décors. Vos plantes restent belles toute l'année." },
];

const contact = { path: "/contact/" };

export const site = {
  name: "D'un Bout À L'autre",
  contact,
  copyright: "© 2026 D'un bout à l'autre, Tous droits réservés",
  email: "hello@dunboutalautre.co",
  phone: { display: "+33 6 03 34 23 12", href: "tel:+33603342312" }, // à confirmer (copywriting : 07 70 44 77 59)
  instagram: { label: "@dunboutalautre.co", href: "https://www.instagram.com/dunboutalautre.co" },
  // Colonne RÉSEAUX du footer. Facebook : URL à confirmer (docs/POINTS-A-VALIDER.md, ligne 74).
  social: [
    { label: "Instagram", href: "https://www.instagram.com/dunboutalautre.co", icon: "instagram" },
    { label: "Facebook", href: "#", icon: "facebook" },
  ],
  // Barre basse du footer : pages légales pas encore créées (href() renvoie « # » tant qu'elles ne sont pas live).
  legal: [
    { label: "Mentions légales", path: "/mentions-legales" },
    { label: "Politique de confidentialité", path: "/politique-de-confidentialite" },
  ],
  realisationsCount: 32, // provisoire, sera dynamique avec le CMS
  zone: "Paris & Île-de-France",
  nav: [
    { label: "Accueil", path: "/", live: true },
    { label: "Services", children: true }, // parent sans page propre : ouvre la liste des services
    { label: "Réalisations", path: "/realisations/", count: true },
    { label: "Contact", ...contact },
    { label: "Blog", path: "/blog/" },
  ],
  // Lignes de la section Services de l'accueil (6).
  services,
  // Sous-liens du menu (7) : les 6 services puis la landing Noël.
  menuServices: [
    ...services,
    { label: "Décors de Noël", path: "/decoration-noel-entreprises-paris/", live: true },
  ],
  // Valeurs de la maquette, à confirmer avec la cliente.
  stats: [
    { value: 70, prefix: "+", suffix: "", text: "projets réalisés à Paris et en Île-de-France" },
    { value: 10, prefix: "+", suffix: " ans", text: "d'expérience en végétalisation et en décoration végétale" },
    { value: 100, prefix: "", suffix: "%", text: "Entreprises, hôtels, restaurants, particuliers : tous types de clients accompagnés" },
  ],
};

export const href = (item) => (item.live ? item.path : "#");

// Relecture : `npm run dev:liens` (vite --mode liens) rend cliquables toutes les pages qui existent, sans toucher à `live`. Réservé au
// serveur de dev : au build, les composants sont chargés par un import natif de Node où import.meta.env n'existe pas, donc la build
// garde les valeurs ci-dessus. Les pages légales (hors périmètre, aucune page) restent en « # ».
export const previewLinks = import.meta.env?.DEV === true && import.meta.env.MODE === "liens";
if (previewLinks) {
  for (const item of [site.contact, ...site.nav, ...site.services, ...site.menuServices]) {
    if (item.path) item.live = true;
  }
}
