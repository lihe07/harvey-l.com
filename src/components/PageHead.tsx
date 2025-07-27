import defaultCover from "~/assets/images/cover.webp";
import { JSX, Show } from "solid-js";

export default function PageHead(props: { cover?: string, title: string, description?: string, children?: JSX.Element, fullscreen?: boolean }) {
  return (
    <div class="relative"
      classList={{
        "h-screen": props.fullscreen,
      }}
    >
      <img
        src={props.cover || defaultCover}
        alt="background"
        class="w-full h-full object-cover absolute z-1 top-0 left-0"
      />
      <div
        class="relative top-0 bg-black/60 z-2 h-full w-full sm:pt-38 pt-30 pb-10 px-10 flex flex-col justify-center items-center"
      >
        <div class="max-w-300 w-full">
          <h1 class="font-serif !leading-snug md:text-6xl sm:text-5xl text-4xl font-light">
            {props.title}
          </h1>
          <Show when={props.description}>
            <p class="font-sans sm:text-3xl text-xl !leading-relaxed md:max-w-70% op-60 my-8">
              {props.description}
            </p>
          </Show>
          {props.children}
        </div>
      </div>
    </div>
  );
}
