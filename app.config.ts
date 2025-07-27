import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
/* @ts-ignore */
import pkg from "@vinxi/plugin-mdx";
const { default: mdx } = pkg;

import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import remarkMath from "remark-math";

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
      routes: [
        "/",
        "/server/render"
      ],
      crawlLinks: true,
    }
  }
});
