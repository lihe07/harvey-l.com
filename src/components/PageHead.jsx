import defaultCover from "~/assets/images/cover.webp";
import Section from "./Section";
import { Show } from "solid-js";
import style from "./PageHead.module.css";
export default function PageHead(props) {
  return (
    <div class="relative">
      <img
        src={props.cover || defaultCover}
        alt="background"
        class="w-full h-full object-cover absolute z-1 top-0 left-0"
      />
      <div
        class={"relative top-0 bg-black/50 z-2 w-full pt-5 pb-10 " + style.main}
      >
        <Section class="sm:mt-33 mt-25">
          <h1 class="font-serif !leading-snug md:text-6xl sm:text-5xl text-4xl font-light mb-0">
            {props.title}
          </h1>
          <Show when={props.description}>
            <p class="font-sans sm:text-3xl text-xl !leading-relaxed md:max-w-70% op-60">
              {props.description}
            </p>
          </Show>
          {props.children}
        </Section>
      </div>
    </div>
  );
}
