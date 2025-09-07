import {
  createSignal,
  createEffect,
  For,
  JSX,
  onCleanup,
  onMount,
  createMemo,
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";
import { Motion } from "solid-motionone";

// This is the new component for the fullscreen view.
function FullscreenViewer(props: {
  src: string;
  isVideo: boolean;
  caption?: string;
  onClose: () => void;
}) {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      props.onClose();
    }
  };

  onMount(() => {
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    onCleanup(() => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <Portal>
      <Motion.div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={props.onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, easing: "ease-out" }}
      >
        <div
          class="relative flex flex-col gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <div class="relative max-w-[95vw] max-h-[85vh] flex items-center justify-center">
            {props.isVideo ? (
              <video
                src={props.src}
                class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                autoplay
                controls
                loop
              />
            ) : (
              <img
                src={props.src}
                class="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                alt={props.caption || "Fullscreen view"}
              />
            )}
          </div>

          {props.caption && (
            <div class="text-center text-white/80 text-sm p-2 max-w-full">
              {props.caption}
            </div>
          )}
        </div>
      </Motion.div>
    </Portal>
  );
}


export type TilePhotographWallProps = {
  images: string[];          // Can now contain both image and video URLs (.mp4 / .webm)
  captions?: string[];
  gap?: number;              // default 8
  rounded?: string;          // e.g. "rounded-2xl"
  rowHeight?: number;        // optional: acts as a maximum cap (desktop)
  class?: string;
  style?: JSX.CSSProperties;
  minRowHeight?: number;     // default 80
  maxRowHeight?: number;     // default = rowHeight or 480
  // Optional behavior flags:
  autoplayVideos?: boolean;  // default true
  loopVideos?: boolean;      // default true
  muteVideos?: boolean;      // default true
  playInlineVideos?: boolean;// default true
  videoFallbackRatio?: number; // ratio used if metadata fails, default 16/9
};

export default function TilePhotographWall(props: TilePhotographWallProps) {
  const gap = () => props.gap ?? 8;
  const rounded = () => props.rounded ?? "rounded-xl";
  const minRowH = () => props.minRowHeight ?? 80;
  const maxRowH = () => props.maxRowHeight ?? props.rowHeight ?? 480;

  const autoplayVideos = () => props.autoplayVideos ?? true;
  const loopVideos = () => props.loopVideos ?? true;
  const muteVideos = () => props.muteVideos ?? true;
  const playInlineVideos = () => props.playInlineVideos ?? true;
  const videoFallbackRatio = () => props.videoFallbackRatio ?? (16 / 9);

  const [ratios, setRatios] = createSignal<number[]>([]);
  const [containerWidth, setContainerWidth] = createSignal(0);
  const [isSmallScreen, setIsSmallScreen] = createSignal(false);
  const [fullscreen, setFullscreen] = createSignal<{ src: string, isVideo: boolean, caption?: string } | null>(null);


  let containerRef: HTMLDivElement | undefined;

  // Helpers
  const isVideo = (src: string) => /\.(mp4|webm)(\?|#|$)/i.test(src);

  // Observe breakpoint (Tailwind sm = 640px)
  onMount(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(min-width: 640px)");
    const update = () => setIsSmallScreen(!mql.matches);
    update();
    mql.addEventListener("change", update);
    onCleanup(() => mql.removeEventListener("change", update));
  });

  // Listen to resize (simpler than ResizeObserver for now)
  createEffect(() => {
    if (!containerRef) return;
    function onResize() {
      setContainerWidth(containerRef?.clientWidth ?? 0);
    }
    onResize();
    window.addEventListener("resize", onResize);
    onCleanup(() => window.removeEventListener("resize", onResize));
  });

  // Load aspect ratios (image natural sizes / video metadata)
  createEffect(() => {
    const sources = props.images ?? [];
    if (sources.length === 0) {
      setRatios([]);
      return;
    }
    if (typeof window === "undefined") {
      setRatios(sources.map(() => 1));
      return;
    }
    let cancelled = false;

    Promise.all(
      sources.map(
        (src) =>
          new Promise<number>((resolve) => {
            if (isVideo(src)) {
              const video = document.createElement("video");
              video.preload = "metadata";
              const cleanUp = () => {
                video.onloadedmetadata = null;
                video.onerror = null;
              };
              video.onloadedmetadata = () => {
                const w = video.videoWidth || 1;
                const h = video.videoHeight || 1;
                cleanUp();
                resolve(h ? w / h : videoFallbackRatio());
              };
              video.onerror = () => {
                cleanUp();
                resolve(videoFallbackRatio());
              };
              video.src = src;
            } else {
              const img = new Image();
              img.onload = () => {
                const w = img.naturalWidth || 1;
                const h = img.naturalHeight || 1;
                resolve(h ? w / h : 1);
              };
              img.onerror = () => resolve(1);
              img.src = src;
            }
          })
      )
    ).then((rs) => {
      if (!cancelled) setRatios(rs);
    });

    onCleanup(() => {
      cancelled = true;
    });
  });

  // Auto row height (justified single row desktop)
  const autoRowHeight = createMemo(() => {
    if (isSmallScreen()) return 0;
    const rs = ratios();
    const n = rs.length;
    if (n === 0) return 0;
    const outer = containerWidth();
    if (outer === 0) return 0;
    const innerWidth = Math.max(0, outer - gap() * 2);
    const sumRatios = rs.reduce((a, b) => a + b, 0) || 1;
    const totalGaps = gap() * (n - 1);
    const targetHeight = (innerWidth - totalGaps) / sumRatios;
    const clamped = Math.max(minRowH(), Math.min(targetHeight, maxRowH()));
    return Math.round(clamped);
  });

  const shapeOf = (ratio: number) =>
    ratio > 1.05 ? "landscape" : ratio < 0.95 ? "portrait" : "square";

  return (
    <>
      <div
        class={`w-full ${props.class ?? ""}`}
        style={{ ...(props.style ?? {}) }}
        ref={containerRef}
      >
        <div
          class={`flex ${isSmallScreen() ? "flex-col" : "flex-row"} items-stretch`}
          style={{
            gap: `${gap()}px`,
            padding: `${gap()}px`,
          }}
        >
          <For each={props.images}>
            {(src, i) => {
              const ratio = () => ratios()[i()] ?? 1;
              const caption = () => props.captions?.[i()] ?? "";

              const rowH = () => autoRowHeight();
              const widthPx = () =>
                isSmallScreen()
                  ? "100%"
                  : `${Math.max(1, Math.round(ratio() * rowH()))}px`;
              const heightPx = () =>
                isSmallScreen()
                  ? (() => {
                    const w = containerWidth()
                      ? containerWidth() - gap() * 2
                      : 0;
                    if (!w) return "auto";
                    return `${Math.round(w / ratio())}px`;
                  })()
                  : `${rowH()}px`;

              const openFullscreen = () => {
                setFullscreen({ src, isVideo: isVideo(src), caption: caption() });
              };

              const onKeyDown: JSX.EventHandlerUnion<
                HTMLDivElement,
                KeyboardEvent
              > = (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openFullscreen();
                }
              };

              const videoAttrs = {
                muted: muteVideos(),
                autoplay: autoplayVideos(),
                loop: loopVideos(),
                playsInline: playInlineVideos(),
              };

              return (
                <div
                  class={`group relative overflow-hidden shadow-md bg-gray-100 cursor-pointer flex-shrink-0 ${rounded()}`}
                  style={{
                    width: widthPx(),
                    height: heightPx(),
                    ...(isSmallScreen() ? { width: "100%" } : {}),
                  }}
                  data-shape={shapeOf(ratio())}
                  onClick={openFullscreen}
                  onKeyDown={onKeyDown}
                  tabIndex={0}
                  aria-label={
                    caption()
                      ? `${isVideo(src) ? "Video" : "Photo"}: ${caption()}`
                      : `${isVideo(src) ? "Video" : "Photo"} ${i() + 1}`
                  }
                >
                  {isVideo(src) ? (
                    <video
                      src={src}
                      class="w-full h-full object-cover select-none pointer-events-none m0!"
                      {...videoAttrs}
                    />
                  ) : (
                    <img
                      src={src}
                      alt={caption() || `Image ${i() + 1}`}
                      class="w-full h-full object-cover select-none pointer-events-none m0!"
                      draggable={false}
                      loading="lazy"
                      decoding="async"
                      width={
                        isSmallScreen()
                          ? containerWidth()
                          : Math.max(1, Math.round(ratio() * rowH()))
                      }
                      height={
                        isSmallScreen()
                          ? containerWidth()
                            ? Math.round(
                              (containerWidth() - gap() * 2) / ratio()
                            )
                            : undefined
                          : rowH()
                      }
                    />
                  )}

                  {caption() && (
                    <div
                      class={`absolute inset-x-0 bottom-0 flex items-end p-2
                        bg-gradient-to-t from-black/60 to-transparent
                        transition-opacity duration-200
                        opacity-0
                        group-hover:opacity-100`}
                    >
                      <span class="text-white text-sm font-sans w-full">
                        {caption()}
                      </span>
                    </div>
                  )}
                </div>
              );
            }}
          </For>
        </div>
      </div>
      <Show when={fullscreen()}>
        {(fs) => (
          <FullscreenViewer
            src={fs().src}
            isVideo={fs().isVideo}
            caption={fs().caption}
            onClose={() => setFullscreen(null)}
          />
        )}
      </Show>
    </>
  );
}
