import { For, createEffect, createSignal, onMount } from "solid-js";

import style from "./ProfileContent.module.css";

export default (props) => {
  let paragraph;

  const [width, setWidth] = createSignal(10);

  function calculateWidth() {
    setWidth(Math.round(paragraph.offsetWidth / 9.6));
  }

  onMount(() => {
    window.addEventListener("resize", calculateWidth);
    calculateWidth();

    return () => {
      window.removeEventListener("resize", calculateWidth);
    };
  });

  function repeat(str, offset) {
    return str.repeat(width() + offset);
  }

  const SplitLine = () => <p class="m0">+{repeat("-", -2)}+</p>;
  const Line = (props) => (
    <p class="m0 flex justify-between" style={{ width: width() * 9.6 + "px" }}>
      <For each={props.items}>
        {(item) => <span class="flex-1">| {item}</span>}
      </For>
      <span>|</span>
    </p>
  );

  return (
    <div class="w-full max-w-300 ma h-full py-10 color-emerald font-sans leading-relaxed">
      <h1 class={"text-15 tracking-wider leading-15 " + style.fontPixel}>
        BASIC PROFILE
      </h1>
      <p class="transition font-mono">
        lihe07@server:~$ psql -U lihe -d profile
      </p>
      <p class="transition font-mono">
        psql (13.2 (Ubuntu 13.2-1.pgdg20.04+1))
        <br />
        Type "help" for help.
        <br />
        <br />
        profile=# SELECT * FROM profile WHERE NAME = "He Li";
      </p>
      <div class="transition font-mono" ref={paragraph}>
        <SplitLine></SplitLine>
        <Line items={["name", "birth", "school", "location"]}></Line>
        <SplitLine></SplitLine>
        <Line
          items={["He Li", "2007", "Beijing Academy", "Beijing, China"]}
        ></Line>
        <SplitLine></SplitLine>
        <br />
        <span>(1 row)</span>
      </div>

      <p class="transition font-mono">
        profile=# SELECT PLATFORM,ACCOUNT FROM socials WHERE NAME = "He Li";
      </p>

      <div class="transition font-mono">
        <SplitLine />
        <Line items={["platform", "account"]} />
        <SplitLine />

        <Line items={["Twitter (X)", "HeLi07784212"]} />
        <Line items={["Github", "lihe07"]} />
        <SplitLine />
      </div>
    </div>
  );
};
