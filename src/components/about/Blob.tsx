import { createSignal, onMount } from "solid-js";

import gen from "./b"

const size = 450; // Size of the blob

export default function Blob(props: { href: string, class?: string }) {
  const [path, setPath] = createSignal("M391.5,302.5Q380,380,302.5,394Q225,408,162.5,379Q100,350,52.5,287.5Q5,225,46.5,156.5Q88,88,156.5,52Q225,16,300.5,45Q376,74,389.5,149.5Q403,225,391.5,302.5Z");


  function generate() {
    setPath(gen({
      size,
      growth: 7,
      edges: 8,
    }).path);
  }

  onMount(() => {
    updateScale()


    let timer = setInterval(() => {
      generate();
    }, 2100);

    window.addEventListener("resize", updateScale);

    return () => {
      clearInterval(timer);
      window.removeEventListener("resize", updateScale);
    }
  });

  let container: HTMLDivElement = undefined!;

  const [scale, setScale] = createSignal(1);
  const [width, setWidth] = createSignal(0);

  function updateScale() {
    setWidth(container.clientWidth);
    if (container.clientWidth < size) {
      setScale(container.clientWidth / size);
    } else {
      setScale(1);
    }
  }

  return (
    <div class={"w-max max-w-75vw h-max " + props.class} ref={container!}
      style={{
        height: `${width()}px`,

      }}
    >
      <svg width={size} height={size}
        style={{
          scale: scale(),
          transform: `translate(${((width() / 2) - size / 2) / scale()}px, ${((width() / 2) - size / 2) / scale()}px)`,
        }}
      >
        <mask id="blob-mask" >
          <rect width="100%" height="100%" fill="black" />
          <path d={path()} fill="white" style="transition: 2s;" />
        </mask>
        <image href={props.href}
          mask="url(#blob-mask)"
          width={size}
          height={size}
        />
      </svg>

    </div >
  );
};

