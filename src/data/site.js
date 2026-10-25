// Source unique des données du site. Voir docs/POINTS-A-VALIDER.md pour les valeurs à confirmer.
export const site = {
  name: "D'un Bout À L'autre",
  email: "hello@dunboutalautre.co",
  phone: { display: "+33 6 03 34 23 12", href: "tel:+33603342312" }, // à confirmer (copywriting : 07 70 44 77 59)
  instagram: { label: "@dunboutalautre.co", href: "https://www.instagram.com/dunboutalautre.co" },
  realisationsCount: 32, // provisoire, sera dynamique avec le CMS
  zone: "Paris & Île-de-France",
  nav: [
    { label: "Accueil", href: "/" },
    { label: "Services", href: "#", children: true },
    { label: "Réalisations", href: "#", count: true },
    { label: "Contact", href: "#" },
    { label: "Blog", href: "#" },
  ],
  services: [
    { n: "01", label: "Végétalisation de bureaux", href: "#" },
    { n: "02", label: "Design végétal sur mesure", href: "#" },
    { n: "03", label: "Scénographie végétale", href: "#" },
    { n: "04", label: "Terrasses", href: "#" },
    { n: "05", label: "Décoration saisonnière", href: "#" },
    { n: "06", label: "Entretien & abonnements", href: "#" },
    { n: "07", label: "Décors de Noël", href: "/decoration-noel-entreprises-paris/" },
  ],
  stats: [
    { value: 70, prefix: "+", suffix: "", text: "projets réalisés à Paris et en Île-de-France" },
    { value: 10, prefix: "+", suffix: " ans", text: "d'expérience en végétalisation et en décoration végétale" },
    { value: 100, prefix: "", suffix: "%", text: "Entreprises, hôtels, restaurants, particuliers : tous types de clients accompagnés" },
  ],
};
