# D'un Bout À L'autre : prototype d'intégration V1

Accueil + landing Décors de Noël. Stack : Vite, JS vanilla, GSAP (ScrollTrigger, SplitText), Lenis.

## Démarrer
1. Ouvre ce dossier dans VS Code.
2. `npm install` puis `npm run dev` (http://localhost:5173).
3. Lance Claude Code à la racine, colle le contenu de `prompts/00-LANCEMENT.md`, puis suis `prompts/README.md`.

## Contenu du dossier
- `CLAUDE.md`, `DESIGN.md` : règles et design system
- `docs/` : animations, contenus exacts, points à valider, copywriting par page, arborescence
- `references/` : frames des animations, menu, PDF sources, anciennes maquettes
- `public/assets/` : logo, fonds, photos, logos clients
- `prompts/` : prompts d'intégration (00 à 10)

## Build et démo
`npm run build` produit `dist/` (Netlify ou Vercel : commande `npm run build`, dossier `dist`).
