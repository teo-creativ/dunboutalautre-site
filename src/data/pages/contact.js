// Page Contact & Devis : tous les textes viennent de docs/copywriting/10-contact-et-devis.md (premier jet, à retravailler avec la cliente),
// le title et la meta de docs/arborescence-et-strategie.md. Téléphone, e-mail et adresse ne sont pas confirmés : todo() (docs/POINTS-A-VALIDER.md,
// ligne 144). Instagram est connu (src/data/site.js). La microcopie fonctionnelle du formulaire (confirmation, messages d'erreur) n'est
// pas du copywriting : elle est sous `micro`, à valider (docs/POINTS-A-VALIDER.md).
import { site } from "../site.js";
import { todo } from "../../components/placeholder.js";

// Confirmation affichée quand le formulaire est valide. Constante unique, à remplacer ici quand l'envoi sera réel : elle ne doit jamais
// laisser croire qu'un message est parti tant que ce n'est pas vrai.
export const SUBMIT_NOTICE = "Formulaire valide. Prototype : aucun message n'a été envoyé.";

const messages = {
  required: "Ce champ est obligatoire.",
  checkbox: "Choisissez au moins une prestation.",
  radio: "Choisissez une option.",
  email: "Saisissez une adresse e-mail valide.",
  tel: "Saisissez un numéro de téléphone valide.",
  summary: "Le formulaire contient des erreurs à corriger :",
};

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
      type: "form",
      label: "FORMULAIRE GUIDÉ",
      optionalLabel: "optionnel",
      submit: "Envoyer ma demande",
      groups: [
        {
          field: "prestation",
          kind: "checkbox",
          legend: "Type de prestation",
          options: [
            { key: "bureaux", label: "Végétalisation de bureaux" },
            { key: "design-vegetal", label: "Design végétal sur mesure" },
            { key: "scenographie", label: "Scénographie végétale & événementiel" },
            { key: "terrasse", label: "Terrasse" },
            { key: "saisonniere", label: "Décoration saisonnière (Noël, printemps...)" },
            { key: "entretien", label: "Entretien & abonnement végétal" },
            { key: "autre", label: "Autre" },
          ],
        },
        {
          field: "projet",
          kind: "radio",
          legend: "Type de projet",
          options: [
            { key: "entreprise", label: "Entreprise" },
            { key: "hotel-restaurant", label: "Hôtel ou restaurant" },
            { key: "particulier", label: "Particulier" },
          ],
        },
        { field: "lieu", kind: "text", label: "Lieu d'intervention", optional: true, autocomplete: "street-address" },
        { field: "surface", kind: "text", label: "Surface approximative", optional: true },
        {
          field: "budget",
          kind: "radio",
          legend: "Budget indicatif",
          optional: true,
          options: [
            { key: "moins-2000", label: "Moins de 2000€" },
            { key: "2000-5000", label: "2 000 à 5 000 €" },
            { key: "plus-5000", label: "Plus de 5 000 €" },
          ],
        },
        { field: "delai", kind: "text", label: "Date ou délai souhaité", optional: true },
        { field: "message", kind: "textarea", label: "Message libre" },
        {
          kind: "fields",
          legend: "Vos coordonnées",
          fields: [
            { field: "prenom", kind: "text", label: "Prénom", autocomplete: "given-name" },
            { field: "nom", kind: "text", label: "Nom", autocomplete: "family-name" },
            { field: "email", kind: "text", type: "email", label: "Email", autocomplete: "email" },
            { field: "telephone", kind: "text", type: "tel", label: "Téléphone", autocomplete: "tel" },
          ],
        },
      ],
      micro: { notice: SUBMIT_NOTICE, messages },
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
