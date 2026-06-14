// This controls the layout of blog page
import { BlogLayout } from "~/components/blog/BlogLayout";
import { JSX, Show } from "solid-js";
import { useLocation } from "@solidjs/router";


export default function Blog(props: { children: JSX.Element }) {
  const location = useLocation();

  return (
    <Show
      when={location.pathname !== "/blog" && location.pathname !== "/blog/"}
      fallback={props.children}
    >
      <BlogLayout>{props.children}</BlogLayout>
    </Show>
  );
}

