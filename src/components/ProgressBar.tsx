import { createEffect, createSignal, Show } from "solid-js";
import { Motion } from "solid-motionone";
import { useIsRouting } from "@solidjs/router";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default () => {
  const isRouting = useIsRouting();
  const [percent, setPercent] = createSignal(0);
  const [show, setShow] = createSignal(false);
  const [lazy, setLazy] = createSignal(false);

  createEffect(() => {
    console.log("isRouting", isRouting());
    if (isRouting()) {
      setShow(true);
      setLazy(true);
      setPercent(90);
    } else {
      (async () => {
        await sleep(100);
        setPercent(100);
        await sleep(600);
        setShow(false);
        await sleep(300);
        setLazy(false);
        setPercent(0);
      })();
    }
  });
  return (
    <Show when={lazy()}>
      <Motion.div
        class="fixed top-0 h-5 z-10 left-0 bg-white shadow-white op-0 w-0 transition"
        classList={{ "op-100": show() }}
        animate={{
          width: percent() + "%",
        }}
        transition={{
          duration: isRouting() ? 10 : 0.5,
        }}
      />
    </Show>
  );
};
