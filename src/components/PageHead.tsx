import defaultCover from "~/assets/images/cover.webp";
import Section from "./Section";
import { JSX, Show } from "solid-js";

export default function PageHead(props: { cover?: string, title: string, description?: string, children?: JSX.Element }) {
  return (
    <div class="relative">
      <img
        src={props.cover || defaultCover}
        alt="background"
        class="w-full h-full object-cover absolute z-1 top-0 left-0"
      />
      <div
        class={"relative top-0 bg-black/50 z-2 w-full pt-5 pb-10"}
      >
        <Section class="sm:mt-33 mt-25">
          <h1 class="font-serif !leading-snug md:text-6xl sm:text-5xl text-4xl font-light">
            {props.title}
          </h1>
          <Show when={props.description}>
            <p class="font-sans sm:text-3xl text-xl !leading-relaxed md:max-w-70% op-60 my-8">
              {props.description}
            </p>
          </Show>
          {props.children}
        </Section>
      </div>
    </div>
  );
}
