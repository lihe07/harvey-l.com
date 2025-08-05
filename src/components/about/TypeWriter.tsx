import { createEffect, createSignal, For, onMount, Show } from "solid-js";
import { Motion } from "solid-motionone";

export default function TypeWriter(props: { text: string, intervalTime: number, progress: number }) {
  let characters: string[] = []
  for (let i = 0; i < props.text.length; i++) {
    characters.push(props.text[i]);
  }

  let reference: HTMLParagraphElement = undefined!;
  let typewriter: HTMLParagraphElement = undefined!;
  let content: HTMLSpanElement = undefined!;

  const [height, setHeight] = createSignal(25);
  const [words, setWords] = createSignal(0);

  function updateTypewriter() {
    let len = Math.floor(characters.length * props.progress);

    let innerHTML = "";
    for (let i = 0; i < len; i++) {
      if (characters[i] === "\n") {
        innerHTML += "<br>";
      } else {
        innerHTML += characters[i];
      }
    }
    content.innerHTML = innerHTML;

    if (Math.abs(reference.clientHeight - typewriter.clientHeight) < 5) {
      setHeight(typewriter.clientHeight);
    } else {
      setHeight(typewriter.clientHeight + 20);
    }

    setWords(props.text.substring(0, len).split(" ").length);
  }

  createEffect(updateTypewriter, props.progress);

  onMount(() => {
    window.addEventListener("resize", updateTypewriter);

    return () => {
      window.removeEventListener("resize", updateTypewriter);
    };
  })


  return (
    <div class="max-w-xl mt-7 pb-20 relative mx-3 font-mono ">
      <p class="op-0 select-none" ref={reference}>
        <For each={props.text.split("\n")}>
          {t => (
            <>
              <span>{t}</span>
              <br />
            </>
          )}
        </For>
      </p>
      <div class="absolute left--3 top--3 right--3">
        <Motion.div class="border-2 border-white/70 rounded-xl "
          animate={{
            "height": `calc(${height()}px + 1.5rem)`
          }}
          transition={{
            duration: 0.2
          }}
        >
        </Motion.div>
        <p class="op-70 mt-3">
          Words: {words()} / 150
        </p>
      </div>
      <p class="absolute top-0 left-0" ref={typewriter}>
        <span ref={content}></span>

        <Motion.span
          animate={{ opacity: [1, 0, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: characters.length * props.intervalTime / 1000, easing: "linear" }}
          class="inline-block w-0.5 h-1em rounded-xl bg-white ml-2 translate-y-1"></Motion.span>
      </p>
    </div>)

}
