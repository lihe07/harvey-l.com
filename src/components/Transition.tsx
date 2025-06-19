import { useBeforeLeave } from "@solidjs/router";
import { createEffect, createSignal, JSX } from "solid-js";
import { useIsRouting } from "@solidjs/router";

// Removes query string, hash and trailing slash from the pathname
function trimPathname(s: any): string {
  if (!s) return "";
  if (typeof s !== "string") {
    return ""
  }

  // 1. Remove query string
  s = s.split("?")[0];
  // 2. Remove hash
  s = s.split("#")[0];
  // 3. Remove trailing slash
  if (s.endsWith("/")) {
    s = s.slice(0, -1);
  }
  return s;
}
export default function Transition(props: { children: JSX.Element, onTransition: CallableFunction }) {
  const [show, setShow] = createSignal(false);

  const isRouting = useIsRouting();
  createEffect(() => {
    if (!isRouting()) {
      console.log("Transition: Page loaded. Let's display it");
      setTimeout(() => {
        props.onTransition(false);
        setShow(true);
      }, 500);
    }
  });

  useBeforeLeave((e) => {
    setShow(false);
    e.preventDefault();
    props.onTransition(true);

    const fromPath = trimPathname(e.from.pathname);
    const toPath = trimPathname(e.to);

    console.log(`Transition: Navigating from ${fromPath} to ${toPath}`);

    setTimeout(() => {
      if (fromPath !== toPath) {
        console.log("Transition: Different page. Scroll to top");

        const scroll = document.getElementById("scroll");
        scroll && (scroll.scrollTop = 0);
      }

      e.retry(true);
    }, 300);
  });

  return (
    <div
      style="opacity: 0; transform: scale(1.01)"
      class="transition-all-300"
      classList={{ "!op-100 !scale-100": show() }}
    >
      {props.children}
    </div>
  );
}
