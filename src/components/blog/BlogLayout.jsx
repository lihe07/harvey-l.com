import BlogArticle from "./BlogArticle";
import { useLocation } from "@solidjs/router";

import "~/assets/styles/highlight.min.css";
import "~/assets/styles/katex.min.css";
import blog from "~/blog";
import { tags } from "~/config";
import { Title } from "@solidjs/meta";

export function BlogLayout(props) {
  const location = useLocation();

  const meta = {
    ...blog.find(
      (post) =>
        post.href === location.pathname ||
        `${post.href}/` === location.pathname,
    ),
  };

  return (
    <main>
      <Title>{`lihe.dev - ${meta.title}`}</Title>
      <BlogArticle cover="" {...meta}>
        {props.children}
      </BlogArticle>
    </main>
  );
}
