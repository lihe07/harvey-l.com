// A grouped "where the speed came from" table: one row per technique, with
// what it was measured on, before/after, and the gain. Rows marked `rejected`
// are shown muted with the gain struck through (tried, measured, not shipped).
//
// Styles live in latex.css under `table.speedup`. `borders-custom` opts out of
// latex.css's default table rules so they don't double up.

import { For, Show } from "solid-js";

export type SpeedupRow = {
  technique: string;
  measured: string;
  before?: string;
  after?: string;
  gain: string;
  rejected?: string;
};

export type SpeedupGroup = { group: string; rows: SpeedupRow[] };

export default function SpeedupTable(props: {
  groups: SpeedupGroup[];
  caption?: string;
}) {
  return (
    <figure class="my-8 mx-0 overflow-x-auto">
      <table class="speedup borders-custom">
        <thead>
          <tr>
            <th>Technique</th>
            <th>Measured on</th>
            <th class="num">Before</th>
            <th class="num">After</th>
            <th class="num">Gain</th>
          </tr>
        </thead>
        <For each={props.groups}>
          {(g) => (
            <tbody>
              <tr class="group">
                <th colspan={5}>{g.group}</th>
              </tr>
              <For each={g.rows}>
                {(r) => (
                  <tr classList={{ rejected: !!r.rejected }}>
                    <td>
                      {r.technique}
                      <Show when={r.rejected}>
                        <small>{r.rejected}</small>
                      </Show>
                    </td>
                    <td class="measured">{r.measured}</td>
                    <td class="num before">{r.before ?? "—"}</td>
                    <td class="num">{r.after ?? "—"}</td>
                    <td class="num gain">
                      <span>{r.gain}</span>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          )}
        </For>
      </table>
      <Show when={props.caption}>
        <p class="speedup-caption">{props.caption}</p>
      </Show>
    </figure>
  );
}
