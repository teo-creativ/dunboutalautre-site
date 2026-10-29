// Page Contact & Devis : tous les textes viennent de docs/copywriting/10-contact-et-devis.md (premier jet, à retravailler avec la cliente),
// le title et la meta de docs/arborescence-et-strategie.md. Téléphone, e-mail et adresse ne sont pas confirmés : todo() (docs/POINTS-A-VALIDER.md,
// ligne 144). Instagram est connu (src/data/site.js). Le formulaire est ajouté à T22, sa validation à T23.
import { site } from "../site.js";
import { todo } from "../../components/placeholder.js";

export const contact = {
  id: "contact",
  path: "/contact/",
  source: "10-contact-et-devis.md",
  title: "Contact & devis gratuit | D'un Bout À L'autre Paris",
  description:
    "Demandez un devis gratuit à D'un Bout À L'autre : végétalisation de bureaux, design végétal, événement, terrasse ou Noël à Paris. Réponse sous 48h.",
  sections: [
    {
      type: "hero",
      compact: true,
      title: "Parlons de votre projet.",
      tag: "votre projet",
      lead: "Remplissez le formulaire. On revient vers vous sous 48h pour comprendre votre besoin et vous proposer un premier échange gratuit.",
    },
    {
      type: "cards",
      label: "COORDONNÉES DIRECTES",
      items: [
        { title: "Téléphone", text: todo("téléphone") },
        { title: "Email", text: todo("e-mail") },
        { title: "Adresse", text: todo("adresse") },
        { title: "Instagram", link: { label: "@dunboutalautre.co", href: site.instagram.href } },
      ],
    },
    {
      type: "logos",
      label: "RÉASSURANCE",
      items: [
        { name: "Eataly" },
        { name: "Inato", logo: "inato" },
        { name: "BHV", logo: "bhv-marais" },
        { name: "Hôtel Cluny Square", logo: "hotel-cluny-square" },
        { name: "Witbe", logo: "witbe" },
        { name: "Yves Rocher", logo: "yves-rocher" },
        { name: "Kéobiz", logo: "keobiz" },
        { name: "AtScale", logo: "atscale" },
        { name: "ONF" },
        { name: "Ambassade d'Italie" },
        { name: "Botimyst", logo: "botimyst" },
      ],
    },
  ],
};
