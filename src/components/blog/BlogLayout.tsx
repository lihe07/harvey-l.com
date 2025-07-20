import BlogArticle from "./BlogArticle";
import { createAsync, useLocation } from "@solidjs/router";

import "~/assets/styles/highlight.min.css";
import "~/assets/styles/katex.min.css";
import { Title } from "@solidjs/meta";
import { JSX } from "solid-js";
import { getBlogMetaQuery } from "~/server";

export function BlogLayout(props: { children: JSX.Element }) {
  const location = useLocation();
  // location.pathname is /blog/slug
  let slug = location.pathname.substring(6)
  if (slug.endsWith("/"))
    slug = slug.slice(0, -1); // Remove trailing slash if exists

  const meta = createAsync(() => getBlogMetaQuery(slug))

  return (
    <main>
      <Title>{`harvey-l.com - ${meta()?.title}`}</Title>
      <BlogArticle cover="" {...meta()!}>
        {props.children}
      </BlogArticle>
    </main>
  );
}
