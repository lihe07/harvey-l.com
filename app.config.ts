import fs from "fs";
import path from "path";
import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
/* @ts-ignore */
import pkg from "@vinxi/plugin-mdx";
const { default: mdx } = pkg;

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
  extensions: ["mdx", "md"],
  vite: {
    plugins: [
      mdx.withImports({})({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        rehypePlugins: [
          rehypeHighlight,
          () => rehypeKatex({ output: "html" }),
          () => rehypeExternalLinks({ rel: "noopener", target: "_blank" })
        ],
        remarkPlugins: [remarkMath],
      }),
      UnoCSS()
    ]
  },
  server: {
    prerender: {
      routes: prerenderRoutes,
      crawlLinks: true,
    }
  }
});
