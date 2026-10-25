// Injecte les composants HTML partagés (src/components/*.js) dans les pages, au dev comme au build.
// Une page écrit `<!--@nom attr="valeur"-->` et reçoit `export default (props) => string` de src/components/nom.js.
// Le HTML est donc complet sans JavaScript, et header, menu et footer ont une seule source pour les deux pages.
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { normalizePath } from "vite";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = resolve(root, "src/components");
const dataFile = normalizePath(resolve(root, "src/data/site.js"));

const placeholder = /<!--@([\w-]+)((?:\s+[\w-]+="[^"]*")*)\s*-->/g;
const attribute = /([\w-]+)="([^"]*)"/g;

export default function injectComponents() {
  return {
    name: "inject-components",
    transformIndexHtml: {
      // "pre" : le HTML injecté passe ensuite par le traitement d'assets de Vite.
      order: "pre",
      async handler(html, ctx) {
        const modules = new Map();
        let out = "";
        let last = 0;
        for (const match of html.matchAll(placeholder)) {
          const [full, name, rawProps] = match;
          if (!modules.has(name)) {
            const file = resolve(componentsDir, `${name}.js`);
            // En dev, ssrLoadModule suit les changements de fichier ; au build, un import natif suffit.
            modules.set(
              name,
              ctx.server ? await ctx.server.ssrLoadModule(file) : await import(pathToFileURL(file).href),
            );
          }
          const props = Object.fromEntries([...rawProps.matchAll(attribute)].map(([, key, value]) => [key, value]));
          out += html.slice(last, match.index) + modules.get(name).default(props);
          last = match.index + full.length;
        }
        return out + html.slice(last);
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
