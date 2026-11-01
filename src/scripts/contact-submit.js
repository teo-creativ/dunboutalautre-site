// Envoi du formulaire de contact : SIMULÉ. Aucune requête réseau, aucun stockage, aucun e-mail : la fonction attend 0,8 s puis répond « ok »,
// pour que l'interface montre ses états (envoi en cours, confirmation). C'est le seul endroit à remplacer quand le vrai service sera choisi
// (e-mail, CRM, formulaire Webflow...) : le script du formulaire (contact-form.js) n'a besoin que d'une promesse qui se résout en { ok: true }
// ou qui se rejette. Tant que cette fonction est simulée, la confirmation ne doit jamais laisser croire qu'un message est parti
// (SUBMIT_NOTICE, src/data/pages/contact.js).
//
// payload : { prestation, projet, lieu, delai, budget, message, prenom, nom, email, telephone } (chaînes ; budget et champs optionnels
// vides valent "").
export function submitContactForm(payload) {
  void payload; // TODO: envoyer le payload au vrai service
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 800));
}
