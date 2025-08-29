// This controls the layout of blog page
import BlogArticle from "~/components/blog/BlogArticle";
import { createAsync, useLocation } from "@solidjs/router";
import "~/assets/styles/highlight.min.css";
import "~/assets/styles/katex.min.css";
import { Meta, Title } from "@solidjs/meta";
import { JSX, Show } from "solid-js";
import { getEnglMetaQuery } from "~/server";
import Challenge from "~/components/engl/Challenge";

function BlogLayout(props: { children: JSX.Element }) {
  const location = useLocation();
  // location.pathname is /blog/slug
  let slug = location.pathname.substring(6)
  if (slug.endsWith("/"))
    slug = slug.slice(0, -1); // Remove trailing slash if exists

  const meta = createAsync(() => getEnglMetaQuery(slug))

  return (
    <main>
      <Title>{`harvey-l.com - ${meta()?.title}`}</Title>
      <Meta name="description" content={meta()?.title} />
      <Meta property="og:title" content={meta()?.title} />
      <Meta property="og:image" content={meta()?.cover} />

      <BlogArticle cover="" {...meta()!}>
        {props.children}
      </BlogArticle>
    </main>
  );
}


export default function Blog(props: { children: JSX.Element }) {
  const location = useLocation();

  return (
    <Challenge>
      <Show
        when={location.pathname !== "/engl" && location.pathname !== "/engl/"}
        fallback={props.children}
      >
        <BlogLayout>{props.children}</BlogLayout>
      </Show>
    </Challenge>
  );
}

