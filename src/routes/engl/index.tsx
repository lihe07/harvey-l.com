import { For } from "solid-js";
import { Title } from "@solidjs/meta";
import Section from "~/components/Section";
import PageHead from "~/components/PageHead";
import BlogCard from "~/components/blog/BlogCard";
import { createAsync } from "@solidjs/router";
import { listEnglQuery } from "~/server";
import cover from "~/assets/images/cover-engl.jpg";

export const route = {
  preload: () => listEnglQuery(),
}

export default () => {
  const blog = createAsync(() => listEnglQuery())

  return (
    <main>
      <Title>harvey-l.com - ENGL1101</Title>

      <PageHead
        title={"English 1101"}
        cover={cover}
        description={"FYSA@Oxford. Taught by Dr. Jennifer Lux"}
      />

      <Section class="my-20">

        <div class="grid md:grid-cols-2 grid-cols-1 gap-5" id="blogs">
          <For each={blog()}>
            {(e) => <BlogCard {...e} key={e.slug} />}
          </For>
        </div>
      </Section>
    </main>
  );
};
