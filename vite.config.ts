import fs from "fs";
import path from "path";
import { defineConfig } from "vite";
import { nitro } from "nitro/vite";
import { solidStart } from "@solidjs/start/config";
import mdx from "@mdx-js/rollup";

import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import remarkMath from "remark-math";

// The site ships as a static bundle (Cloudflare Pages), so the dynamic metadata
// API routes (/server/meta/*, /server/listBlog, ...) have no server to run
// against at request time. Enumerate them here so the build prerenders each one
// to a static JSON file. Without this, client-side navigation fetches them and
// gets a 404. (crawlLinks alone misses them: /server/render renders its blog
// list asynchronously, so the <a> links aren't in the prerendered HTML.)
function postSlugs(dir: string): string[] {
  const full = path.join(process.cwd(), "src", "routes", dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.split(".")[0].toLowerCase());
}

const blogSlugs = postSlugs("blog");
const englSlugs = postSlugs("engl");

const prerenderRoutes = [
  "/",
  "/server/render",
  "/server/listBlog",
  ...blogSlugs.map((s) => `/server/meta/${s}`),
  ...(englSlugs.length
    ? ["/server/listEngl", ...englSlugs.map((s) => `/server/meta-engl/${s}`)]
    : []),
];

export default defineConfig({
  plugins: [
    // MDX has to compile before vite-plugin-solid sees the JSX it emits.
    { enforce: "pre", ...mdx({
      jsx: true,
      jsxImportSource: "solid-js",
      providerImportSource: "solid-mdx",
      rehypePlugins: [
        rehypeHighlight,
        [rehypeKatex, { output: "html" }],
        [rehypeExternalLinks, { rel: ["noopener"], target: "_blank" }],
      ],
      remarkPlugins: [remarkMath],
    }) },
    solidStart({
      extensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    }),
    nitro(),
  ],
  nitro: {
    // Pinned, and deliberately NOT "static". Nitro would otherwise pick a preset
    // from the build environment -- Cloudflare Pages resolves to `static`, which
    // dies with "rolldownOptions.input should not be an html file when building
    // for SSR": the server-less presets still trigger a nitro SSR environment
    // build that has no entry to give it. Pinning here also overrides a
    // NITRO_PRESET env var, so local and CI builds cannot diverge.
    //
    // Deploy target is the prerendered `.output/public` (same path as the old
    // vinxi build); the node server bundle this preset also emits goes unused.
    preset: "node-server",
    prerender: {
      routes: prerenderRoutes,
      crawlLinks: true,
    },
  },
});
