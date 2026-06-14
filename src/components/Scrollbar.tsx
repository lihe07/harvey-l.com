import { createEffect, createSignal, JSX, onMount } from "solid-js";

import style from "./Scrollbar.module.css";

export default (props: { children: JSX.Element, isDuringTransition: boolean }) => {
  const [percent, setPercent] = createSignal(0);
  let ele!: HTMLDivElement;

  function onScroll() {
    const { scrollTop, scrollHeight, clientHeight } = ele;
    const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setPercent(percent);
  }

  onMount(() => {
    ele.addEventListener("scroll", onScroll);
    onScroll(); // Initial call to set the scrollbar position
    window.addEventListener("resize", onScroll);
    return () => window.removeEventListener("resize", onScroll);
  });

  createEffect(() => {
    if (!props.isDuringTransition)
      onScroll();
  })

  return (
    <div class="w-full h-screen relative">
      <div
        class={"w-full h-screen overflow-scroll relative " + style.hide}
        id="scroll"
        ref={ele}
      >
        {props.children}
      </div>

      <div
        class="absolute w-2 right-0 bg-white bg-op-40 rounded-b-5 top-0 transition"
        classList={{
          "op-0": props.isDuringTransition,
        }}
        style={{
          height: `${percent()}%`,
        }}
      />
    </div>
  );
};
