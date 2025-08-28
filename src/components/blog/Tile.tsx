import { createSignal, createEffect, For, JSX } from "solid-js";

export type TileImage = {
  src: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
};

export type TilePhotographWallProps = {
  images: TileImage[];
  rowHeight?: number; // default 220
  gap?: number;       // default 8
  rounded?: string;   // tailwind class, e.g. "rounded-2xl"
  class?: string;
  style?: JSX.CSSProperties;
};

export default function TilePhotographWall(props: TilePhotographWallProps) {
  const rowHeight = () => props.rowHeight ?? 220;
  const gap = () => props.gap ?? 8;
  const rounded = () => props.rounded ?? "rounded-xl";

  const [ratios, setRatios] = createSignal<number[]>([]);
  const [activeIdx, setActiveIdx] = createSignal<number | null>(null);

  // compute aspect ratios
  createEffect(() => {
    const imgs = props.images ?? [];
    const initial = imgs.map((i) =>
      i.width && i.height ? i.width / i.height : NaN
    );

    const missing = initial
      .map((r, i) => (Number.isFinite(r) ? -1 : i))
      .filter((i) => i >= 0);

    if (missing.length === 0) {
      setRatios(initial as number[]);
      return;
    }

    const tmp = [...initial];
    let remaining = missing.length;
    missing.forEach((i) => {
      const img = new Image();
      img.src = props.images[i].src;
      img.onload = () => {
        tmp[i] = img.naturalWidth / img.naturalHeight || 1;
        if (--remaining === 0) setRatios(tmp.map((r) => (isNaN(r) ? 1 : r)));
      };
      img.onerror = () => {
        tmp[i] = 1;
        if (--remaining === 0) setRatios(tmp.map((r) => (isNaN(r) ? 1 : r)));
      };
    });

    if (missing.length < imgs.length) {
      setRatios(tmp.map((r) => (isNaN(r) ? 1 : r)));
    }
  });

  const shapeOf = (ratio: number) =>
    ratio > 1.05 ? "landscape" : ratio < 0.95 ? "portrait" : "square";

  return (
    <div
      class={`overflow-x-auto w-full ${props.class ?? ""}`}
      style={{ ...(props.style ?? {}) }}
    >
      <div
        class="flex flex-row items-stretch"
        style={{ gap: `${gap()}px`, padding: `${gap()}px` }}
      >
        <For each={props.images}>
          {(img, i) => {
            const r = () => ratios()[i()] ?? 1;
            const widthPx = () => Math.max(1, Math.round(r() * rowHeight()));
            const isActive = () => activeIdx() === i();

            const toggleActive: JSX.EventHandlerUnion<
              HTMLDivElement,
              MouseEvent
            > = () => {
              if (matchMedia("(hover: none)").matches) {
                setActiveIdx(isActive() ? null : i());
              }
            };

            return (
              <div
                class={`relative flex-shrink-0 overflow-hidden shadow-md bg-gray-100 ${rounded}`}
                style={{
                  width: `${widthPx()}px`,
                  height: `${rowHeight()}px`,
                }}
                data-shape={shapeOf(r())}
                onClick={toggleActive}
              >
                <img
                  src={img.src}
                  alt={img.alt ?? img.caption ?? "photo"}
                  class="w-full h-full object-cover select-none"
                  width={widthPx()}
                  height={rowHeight()}
                  loading="lazy"
                />

                {img.caption && (
                  <div
                    class={`absolute inset-x-0 bottom-0 h-12 flex items-end p-2 
                      bg-gradient-to-t from-black/60 to-transparent 
                      transition-all duration-200
                      ${isActive() ? "opacity-100" : "opacity-0"}
                      group-hover:opacity-100`}
                  >
                    <span class="text-white text-sm truncate">
                      {img.caption}
                    </span>
                  </div>
                )}
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
}
