import { A } from "@solidjs/router";

import { tags } from "~/config";

export default function Tag(props: { id: string, class?: string }) {
  const tag = () => tags[props.id];
  return (
    <A
      class={
        "px-4 py-1 block rounded-lg font-sans op-70 decoration-none color-white transition hover:op-100 active:scale-95 " +
        props.class || ""
      }
      activeClass="!op-100 !scale-100 cursor-default"
      href={`/blog/?tag=${props.id}`}
      style={{ background: tag().color }}
    >
      {tag().name}
    </A>
  );
}
