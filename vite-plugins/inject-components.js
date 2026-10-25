// Injecte les composants HTML partagés (src/components/*.js) dans les pages, au dev comme au build.
// Une page déclare `<!--@nom-->` et reçoit le résultat de `export default () => string` de src/components/nom.js.
// Le HTML est donc complet sans JavaScript, et header, menu et footer ont une seule source pour les deux pages.
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { normalizePath } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = resolve(root, "src/components");
const dataFile = normalizePath(resolve(root, "src/data/site.js"));

export default function injectComponents() {
  return {
    name: "inject-components",
    transformIndexHtml: {
      // "pre" : le HTML injecté passe ensuite par le traitement d'assets de Vite.
      order: "pre",
      async handler(html, ctx) {
        const names = new Set([...html.matchAll(/<!--@([\w-]+)-->/g)].map((m) => m[1]));
        for (const name of names) {
          const file = resolve(componentsDir, `${name}.js`);
          // En dev, ssrLoadModule suit les changements de fichier ; au build, un import natif suffit.
          const mod = ctx.server
            ? await ctx.server.ssrLoadModule(file)
            : await import(pathToFileURL(file).href);
          html = html.replaceAll(`<!--@${name}-->`, mod.default());
        }
        return html;
      },
    },
    // Un composant ou les données du site changent : le HTML des pages est à regénérer.
    handleHotUpdate({ file, server }) {
      const path = normalizePath(file);
      if (path.startsWith(normalizePath(componentsDir)) || path === dataFile) {
        server.ws.send({ type: "full-reload" });
        return [];
      }
    },
  };
}
