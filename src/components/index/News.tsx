import Section from "../Section";
import BlogCard from "~/components/blog/BlogCard";
import { A, createAsync } from "@solidjs/router";

import { listBlogQuery } from "~/server";
import { For } from "solid-js";

export const route = {
  preload: () => listBlogQuery(),
}

export default function News() {
  const blog = createAsync(() => listBlogQuery())

  return (
    <div class="w-full bg-sky-9 pt-20 md:pb-15 sm:pb-40 pb-30">
      <Section>
        <h1 class="md:text-15 font-serif font-bold text-10 flex justify-between md:flex-row flex-col my-10">
          Recent Updates
          <A
            href="/blog"
            class="!text-sky-1 text-6 mt-3 decoration-none op-70 hover:op-100 active:scale-95 transition flex items-center"
          >
            View all posts
            <div class="i-mdi-arrow-right ml-2 mt-1"></div>
          </A>
        </h1>

        <div class="grid md:grid-cols-2 grid-cols-1 gap-5" id="blogs">
          <For each={blog()?.slice(0, 5)}>
            {(e) => <BlogCard {...e} class="!bg-sky-8" key={e.slug} />}
          </For>
        </div>
      </Section>
    </div>
  );
}
