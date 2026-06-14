// Renders a Mermaid diagram in the browser. Until mermaid loads (and for
// readers without JS) the raw chart source is shown as a code block instead.
//
// mermaid is ~1MB, so it is imported lazily and only on pages that use it.
//
// The theme mirrors latex.css: Latin Modern labels, --body-color text on the
// page background, and outlined (unfilled) boxes like a figure in a paper.

import { createSignal, createUniqueId, onMount, Show } from "solid-js";

const PAGE_BG = "rgb(24, 24, 27)"; // body background, entry-server.tsx
const TEXT = "hsl(0, 0%, 86%)"; // --body-color
const LINE = "hsl(0, 0%, 59%)"; // --footnotes-border-color
const FAINT = "hsl(0, 0%, 36%)";
const FONT = "'Latin Modern', Georgia, Cambria, 'Times New Roman', serif";

const themeCSS = `
  .node *, .cluster * { filter: none !important; }
  .node rect, .node polygon, .node circle { rx: 3px; ry: 3px; stroke-width: 1.2px; }
  .cluster rect { stroke-dasharray: 5 4; rx: 6px; ry: 6px; }
  .nodeLabel p, .edgeLabel p, .cluster-label p { margin: 0; text-indent: 0; }
  .edgeLabel, .edgeLabel p, .edgeLabel span { font-size: 15px; color: ${LINE}; }
  .labelBkg, .edgeLabel, .edgeLabel p { background-color: ${PAGE_BG} !important; opacity: 1; }
  .labelBkg { padding: 0 4px; }
  .flowchart-link { stroke-width: 1.2px; }
  path.edge-thickness-thick { stroke: ${TEXT} !important; stroke-width: 2.4px !important; }
  .marker { fill: ${LINE}; stroke: ${LINE}; }
`;

export default function Mermaid(props: { chart: string }) {
  const id = `mermaid-${createUniqueId()}`.replace(/[^\w-]/g, "");
  const [svg, setSvg] = createSignal<string>();

  onMount(async () => {
    const { default: mermaid } = await import("mermaid");
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      // The default "neo" look strokes boxes with a gradient that fades to black.
      look: "classic",
      darkMode: true,
      fontFamily: FONT,
      themeVariables: {
        fontFamily: FONT,
        fontSize: "18px",
        background: PAGE_BG,
        primaryColor: PAGE_BG,
        primaryTextColor: TEXT,
        primaryBorderColor: LINE,
        secondaryColor: PAGE_BG,
        tertiaryColor: PAGE_BG,
        lineColor: LINE,
        textColor: TEXT,
        edgeLabelBackground: PAGE_BG,
        clusterBkg: "transparent",
        clusterBorder: FAINT,
        titleColor: LINE,
      },
      themeCSS,
      flowchart: {
        curve: "basis",
        padding: 14,
        nodeSpacing: 40,
        rankSpacing: 50,
        wrappingWidth: 260,
      },
    });
    // Labels are measured at render time, so wait for Latin Modern to load.
    await document.fonts.ready;
    const { svg } = await mermaid.render(id, props.chart.trim());
    setSvg(svg);
  });

  return (
    <Show
      when={svg()}
      fallback={
        <pre>
          <code>{props.chart.trim()}</code>
        </pre>
      }
    >
      <figure class="my-8 mx-0 flex justify-center overflow-x-auto" innerHTML={svg()} />
    </Show>
  );
}
