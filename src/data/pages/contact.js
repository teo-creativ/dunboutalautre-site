// Page Contact V4 (retours-v4/docs/03-CONTACT.md, contact-full.png et frames contact-01 à 10). Les textes viennent de
// docs/copywriting/10-contact-et-devis.md ; ce que la maquette change est écrit ici et déclaré dans `designTexts` (scripts/check-site.js
// les compte au lieu de les refuser) : l'étiquette CONTACT en majuscules et le libellé « Moins de 2 000 € » (espaces insécables, au lieu de
// « Moins de 2000€ »). La maquette n'a ni sous-titre, ni champ Surface, ni cartes de coordonnées, ni frise de logos : ils ne sont plus rendus
// (docs/POINTS-A-VALIDER.md). Les coordonnées du bloc photo ne sont pas dans ces données : le rendu les lit dans src/data/site.js.
// La microcopie fonctionnelle (messages d'erreur, envoi, confirmation) n'est pas du copywriting : elle est sous `micro`, à valider.
const NBSP = " ";

// Confirmation affichée quand le formulaire est valide. Constante unique, à remplacer ici quand l'envoi sera réel : elle ne doit jamais
// laisser croire qu'un message est parti tant que ce n'est pas vrai.
export const SUBMIT_NOTICE = "Formulaire valide. Prototype : aucun message n'a été envoyé.";

const messages = {
  required: "Ce champ est obligatoire.",
  radio: "Choisissez une option.",
  email: "Saisissez une adresse e-mail valide.",
  tel: "Saisissez un numéro de téléphone valide.",
  summary: "Le formulaire contient des erreurs à corriger.",
  failed: "L'envoi a échoué. Réessayez dans un instant.",
};

export const contact = {
  id: "contact",
  path: "/contact/",
  source: "10-contact-et-devis.md",
  title: "Contact & devis gratuit | D'un Bout À L'autre Paris",
  description:
    "Demandez un devis gratuit à D'un Bout À L'autre : végétalisation de bureaux, design végétal, événement, terrasse ou Noël à Paris. Réponse sous 48h.",
  designTexts: ["CONTACT", `Moins de 2${NBSP}000${NBSP}€`],
  sections: [
    {
      type: "form",
      label: "CONTACT",
      heading: "Parlons de votre projet.",
      tag: "votre projet",
      optionalLabel: "optionnel",
      submit: "Envoyer ma demande",
      groups: [
        {
          field: "prestation",
          kind: "radio",
          legend: "Type de prestation",
          selected: "bureaux", // « Végétalisation de bureaux » est cochée à l'ouverture (maquette)
          options: [
            { key: "bureaux", label: "Végétalisation de bureaux" },
            { key: "design-vegetal", label: "Design végétal sur mesure" },
            { key: "terrasse", label: "Terrasse" },
            { key: "scenographie", label: "Scénographie végétale & événementiel" },
            { key: "entretien", label: "Entretien & abonnement végétal" },
            { key: "saisonniere", label: "Décoration saisonnière (Noël, printemps...)" },
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
        { field: "delai", kind: "text", label: "Date ou délai souhaité", optional: true },
        {
          field: "budget",
          kind: "toggle", // puces désélectionnables : un second clic retire le choix
          legend: "Budget indicatif",
          optional: true,
          options: [
            { key: "moins-2000", label: `Moins de 2${NBSP}000${NBSP}€` },
            { key: "2000-5000", label: `2${NBSP}000 à 5${NBSP}000${NBSP}€` },
            { key: "plus-5000", label: `Plus de 5${NBSP}000${NBSP}€` },
          ],
        },
        { field: "message", kind: "textarea", label: "Message libre", optional: true },
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
      micro: { notice: SUBMIT_NOTICE, sending: "Envoi en cours...", messages },
    },
    {
      type: "contact-coordonnees",
      label: "CONTACT",
      photo: {
        src: "contact/contact-01",
        alt: "Terrasse de restaurant : rangée de tables rondes et de chaises en rotin sous un mur de bambou orné d'un soleil orange et de plantes retombantes.",
      },
    },
  ],
};
