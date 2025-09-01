import Tag from "./Tag";
import PageHead from "../PageHead";
import "~/assets/styles/latex.css";
import { BlogDescription } from "./BlogDescription";
import { For, JSX } from "solid-js";
import { Blog } from "~/config";
import { Link } from "@solidjs/meta";

export default (props: Blog & { children: JSX.Element }) => {
  return (
    <div>
      <PageHead title={props.title} cover={props.wideCover || props.cover}>
        <p class="op-70 text-xl font-sans my-3">
          <BlogDescription {...props} />
        </p>
        <div class="flex gap-2 ">
          <For each={props.tags || []}>{(e) => <Tag id={e} />}</For>
        </div>
      </PageHead>
      <div class="px-10 my-10">
        <article class="markdown-body ma max-w-300 ">
          {props.children}
        </article>
      </div>
    </div>
  );
};
