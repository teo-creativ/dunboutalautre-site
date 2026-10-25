// Image WebP responsive générée par scripts/optimize-images.js (npm run images, lancé avant dev et build).
// <!--@img src="home-scroll/bw-feuillage" alt="..." sizes="20vw" class="..." loading="lazy"-->
import { readFileSync } from "node:fs";

const base = "/assets/optimized";
const manifestUrl = new URL("../../public/assets/optimized/manifest.json", import.meta.url);

export default ({ src, alt = "", sizes = "100vw", class: className, loading = "lazy", fetchpriority }) => {
  const entry = JSON.parse(readFileSync(manifestUrl, "utf8"))[src];
  if (!entry) throw new Error(`img : « ${src} » absent du manifeste (lancer npm run images)`);

  const largest = entry.widths.at(-1);
  const height = Math.round((entry.h * largest) / entry.w);
  const srcset = entry.widths.map((w) => `${base}/${src}-${w}.webp ${w}w`).join(", ");

  return `<img${className ? ` class="${className}"` : ""} src="${base}/${src}-${largest}.webp" srcset="${srcset}" sizes="${sizes}" width="${largest}" height="${height}" alt="${alt}" loading="${loading}" decoding="async"${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ""} />`;
};
