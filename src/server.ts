import fs from "fs";
import path from "path";
import { parse } from "yaml";
import { Blog } from "./config";
import { query } from "@solidjs/router";

// To be used in Server Components
export function listBlog() {
  const blogDir = path.join(process.cwd(), "src", "routes", "blog");
  const blogFiles = fs.readdirSync(blogDir);

  const blogMeta = [];

  for (const file of blogFiles) {
    if (!file.endsWith("md") && !file.endsWith("mdx")) continue;

    const filePath = path.join(blogDir, file);
    let fileContent = fs.readFileSync(filePath).toString();
    // Get the first code block
    const codeBlock = fileContent.split("```meta")[1].split("```")[0];

    const meta = parse(codeBlock);
    const slug = file.split(".")[0].toLowerCase();

    blogMeta.push({
      ...meta,
      slug,
      href: `/blog/${slug}`,
      tags: meta.tags,
    } as Blog);
  }

  return blogMeta

}

// To be used in Client Components
export const listBlogQuery = query(async () => {
  if (typeof window === "undefined") {
    return listBlog();
  } else {
    return await (await fetch("/server/listBlog")).json() as Blog[];
  }
}, "listBlog");

export const getBlogMetaQuery = query(async (slug: string) => {
  if (typeof window === "undefined") {
    return listBlog().find((e) => e.slug.toLowerCase() === slug.toLowerCase());
  }
  else {
    return await (await fetch(`/server/meta/${slug}`)).json() as Blog;
  }
}, "getBlogMeta");
