import { createAsync, query } from "@solidjs/router";
import { For } from "solid-js";
import PageHead from "~/components/PageHead";

import { listBlogQuery } from "~/server";


export const route = {
  preload: () => listBlogQuery(),
};

export default () => {
  const blogList = createAsync(() => listBlogQuery())

  return (
    <div>
      <PageHead title="Internal"
        description="This is an internal index page."
      />
      <a href="/server/listBlog">listBlog</a>
      <For each={blogList()}>
        {e => (
          <p>
            <a href={e.href}>
              {e.title} - {e.date}
            </a>
            <a href={`/server/meta/${e.slug}`}>
              server meta
            </a>
          </p>
        )}
      </For>
    </div >
  )
}
