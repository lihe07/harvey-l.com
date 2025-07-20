import { defineConfig } from "@solidjs/start/config";
import UnoCSS from "unocss/vite";
/* @ts-ignore */
import pkg from "@vinxi/plugin-mdx";
const { default: mdx } = pkg;

import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";

export default defineConfig({
  extensions: ["mdx", "md"],
  vite: {
    plugins: [
      mdx.withImports({})({
        jsx: true,
        jsxImportSource: "solid-js",
        providerImportSource: "solid-mdx",
        rehypePlugins: [rehypeHighlight, () => rehypeKatex({ output: "html" })],
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
