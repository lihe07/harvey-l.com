import { BlogDescription } from "~/components/blog/BlogDescription";
import { A } from "@solidjs/router";
import Tag from "~/components/blog/Tag";
import { For } from "solid-js";
import type { Blog } from "~/config";
import { Motion } from "solid-motionone";


export default function Blog(props: { href: string, class?: string, key?: any } & Blog) {
  return (
    <Motion.div
      class={
        "flex md:flex-row md:h-60 h-unset flex-col color-white font-sans bg-zinc-8 rounded-2xl " +
        props.class || ""
      }

      initial={{ opacity: 0, y: 20 }}
      inView={{ opacity: 1, y: 0 }}
      inViewOptions={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <img
        src={props.cover}
        alt={props.title}
        class="rounded-2xl md:h-full h-60 md:w-40% w-full object-cover object-center"
      />
      <div class="py-7 flex flex-col justify-center md:w-60% w-full px-7 box-border">
        <h2 class="text-2xl leading-relaxed md:line-clamp-2 line-clamp-5 mb-3">
          <A
            href={props.href}
            class="color-white decoration-none op-70 hover:op-100 active:op-50 transition font-bold"
          >
            {props.title}
          </A>
        </h2>

        <div class="flex gap-2">
          <For each={props.tags}>{(e) => <Tag id={e} />}</For>
        </div>

        <p class="text-xl op-70 mt-3 md:line-clamp-1 line-clamp-5">
          <BlogDescription date={props.date} location={props.location} />
        </p>
      </div>
    </Motion.div>
  );
}
