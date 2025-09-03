import Tag from "./Tag";
import PageHead from "../PageHead";
import "~/assets/styles/latex.css";
import { BlogDescription } from "./BlogDescription";
import { createSignal, For, JSX, onMount } from "solid-js";
import { Blog } from "~/config";

interface TocItem {
  id: string;
  depth: number;
  name: string;
  element?: HTMLElement;
  viewed: boolean;
}

export default (props: Blog & { children: JSX.Element }) => {
  const [toc, setToc] = createSignal<TocItem[]>([]);

  function isElementViewed(ele: HTMLElement) {
    // Check if the bottom of the element is above the bottom of the viewport
    let rect = ele.getBoundingClientRect();
    return rect.top < window.innerHeight;
  }

  function onScrollOrResize() {
    setToc(
      toc().map((item) => ({
        ...item,
        viewed: isElementViewed(item.element!),
      }))
    )
  }

  onMount(() => {
    let article = document.querySelector("article.markdown-body");
    let list: TocItem[] = [];
    // Find all h2 and h3 elements
    article?.querySelectorAll("h2, h3").forEach((heading) => {
      // Give it an id if it doesn't have one
      heading.id = heading.id || heading.textContent?.toLowerCase().replace(/[^a-zA-Z\d]+/g, "-") || "";
      list.push({
        id: heading.id,
        name: heading.textContent || "",
        depth: heading.tagName === "H2" ? 2 : 3,
        element: heading as HTMLElement,
        viewed: isElementViewed(heading as HTMLElement),
      })
    })
    setToc(list)

    let interval = setInterval(onScrollOrResize, 300);
    // Debounce scroll and resize events

    return () => {
      clearInterval(interval);
    }
  })

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
      <div class="px-10 my-10 flex ma max-w-300 gap-10 box-content">
        <article class="markdown-body flex-shrink-1 min-w-0">
          {props.children}
        </article>

        <nav class="w-60 lg:block hidden sticky top-5 h-fit shrink-0">
          <h2 class="text-xl font-bold mt-5 mb-4 op-90">In this post</h2>


          <For each={toc()}>{(item) => (
            <a
              href={`#${item.id}`}
              class={`block mb-2 transition active:scale-98 hover:op-100 op-70`}
              classList={{
                "text-sm": item.depth === 3,
                "font-medium": item.depth === 2,
                "op-100!": item.viewed,
              }}
              onClick={(e) => {
                // Smooth scroll to the heading
                item.element?.scrollIntoView({ behavior: "smooth" });
                e.preventDefault();
              }}
            >
              {item.name}
            </a>
          )}</For>
        </nav>
      </div>
    </div>
  );
};
