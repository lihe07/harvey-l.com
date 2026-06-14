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
  const [duration, setDuration] = createSignal(300);

  const isRouting = useIsRouting();
  createEffect(() => {
    if (!isRouting()) {
      console.log("Transition: Page loaded. Let's display it");
      setTimeout(() => {
        props.onTransition(false);
        setShow(true);
      }, duration() + 50);
    }
  });

  useBeforeLeave((e) => {
    const fromPath = trimPathname(e.from.pathname);
    const toPath = trimPathname(e.to);

    console.log(`Transition: Navigating from ${fromPath} to ${toPath}`);

    // if (fromPath === toPath) {
    //   // Same page navigation. Quick transition
    //   setDuration(150);
    // } else {
    //   setDuration(300);
    // }

    setShow(false);
    e.preventDefault();
    props.onTransition(true);


    setTimeout(() => {
      if (fromPath !== toPath) {
        console.log("Transition: Different page. Scroll to top");

        const scroll = document.getElementById("scroll");
        scroll && (scroll.scrollTop = 0);
      }

      e.retry(true);
    }, duration());
  });

  return (
    <div
      class="transition-all"
      style={{
        "opacity": show() ? 1 : 0,
        "transform": show() ? "scale(1)" : "scale(1.01)",
        "transition-duration": `${duration()}ms`,
      }}
    >
      {props.children}
    </div>
  );
}
