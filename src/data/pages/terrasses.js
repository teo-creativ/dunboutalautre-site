// Page Terrasses : tous les textes viennent de docs/copywriting/05-terrasses.md (premier jet, à retravailler avec la cliente), le title
// et la meta de docs/arborescence-et-strategie.md. Une valeur inconnue est un todo(), jamais un texte inventé.
import { todo } from "../../components/placeholder.js";

export const terrasses = {
  id: "terrasses",
  path: "/amenagement-terrasse-paris/",
  source: "05-terrasses.md",
  title: "Aménagement de terrasse à Paris | D'un Bout À L'autre",
  description:
    "D'un Bout À L'autre aménage votre terrasse à Paris : conception, plantation et suivi, pour appartements, hôtels, restaurants et entreprises. Devis gratuit.",
  sections: [
    {
      type: "hero",
      title: "Aménagement de terrasse à Paris : votre espace extérieur, de la conception au suivi.",
      tag: "votre espace extérieur",
      lead: "Du choix des végétaux à l'installation, en passant par le suivi saisonnier : on s'occupe de tout. Appartement, hôtel, restaurant ou entreprise.",
      cta: "Demander un devis gratuit",
    },
    {
      type: "cta-final",
      title: "Votre terrasse mérite d'être aménagée.",
      tag: "d'être aménagée",
      cta: "Demander un devis",
      phone: { label: "Téléphone :", value: todo("téléphone") },
    },
  ],
};
