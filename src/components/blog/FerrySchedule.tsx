// Live "when's the next ferry" board for the SF Bay Ferry Oakland/Alameda route,
// restricted to the two stops I actually use: Main Street Alameda and the
// Downtown SF Ferry Building.
//
// Timetable transcribed from https://sanfranciscobayferry.com/routes-schedules/oakland-alameda/
// (schedule effective March 9, 2026). Only trips that actually call at Main
// Street Alameda are listed -- the Oakland-only sailings are dropped, since
// boarding those does me no good.
//
// Holiday overrides come from https://sanfranciscobayferry.com/holiday-ferry-schedule/

import {
  createMemo,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";

const TZ = "America/Los_Angeles";

/** A single sailing: minutes-after-midnight for departure and arrival. */
type Trip = { dep: number; arr: number };

const hm = (h: number, m: number) => h * 60 + m;

// ---------------------------------------------------------------------------
// Timetable data
// ---------------------------------------------------------------------------

// Westbound: depart Main Street Alameda -> arrive Downtown SF (Ferry Building).
const WEEKDAY_WEST: Trip[] = [
  { dep: hm(10, 50), arr: hm(11, 30) },
  { dep: hm(11, 10), arr: hm(11, 55) },
  { dep: hm(11, 45), arr: hm(12, 30) },
  { dep: hm(15, 20), arr: hm(15, 40) },
  { dep: hm(18, 35), arr: hm(18, 55) },
  { dep: hm(19, 10), arr: hm(19, 30) },
  { dep: hm(20, 20), arr: hm(20, 40) },
  { dep: hm(22, 5), arr: hm(22, 25) },
];

// Eastbound: depart Downtown SF (Gate G1) -> arrive Main Street Alameda.
const WEEKDAY_EAST: Trip[] = [
  { dep: hm(6, 25), arr: hm(6, 45) },
  { dep: hm(10, 25), arr: hm(10, 45) },
  { dep: hm(10, 45), arr: hm(11, 5) },
  { dep: hm(11, 20), arr: hm(11, 40) },
  { dep: hm(14, 35), arr: hm(15, 15) },
  { dep: hm(17, 35), arr: hm(18, 15) },
  { dep: hm(18, 25), arr: hm(19, 5) },
  { dep: hm(19, 35), arr: hm(20, 15) },
  { dep: hm(20, 25), arr: hm(21, 5) },
  { dep: hm(21, 20), arr: hm(22, 0) },
];

const WEEKEND_WEST: Trip[] = [
  { dep: hm(8, 30), arr: hm(9, 15) },
  { dep: hm(9, 45), arr: hm(10, 30) },
  { dep: hm(11, 0), arr: hm(11, 45) },
  { dep: hm(11, 55), arr: hm(12, 40) },
  { dep: hm(13, 15), arr: hm(14, 0) },
  { dep: hm(14, 10), arr: hm(14, 55) },
  { dep: hm(14, 35), arr: hm(15, 20) },
  { dep: hm(14, 55), arr: hm(15, 40) },
  { dep: hm(15, 55), arr: hm(16, 40) },
  { dep: hm(16, 55), arr: hm(17, 40) },
  { dep: hm(17, 25), arr: hm(18, 10) },
  { dep: hm(18, 15), arr: hm(19, 0) },
  { dep: hm(19, 35), arr: hm(20, 20) },
  { dep: hm(20, 55), arr: hm(21, 35) },
];

const WEEKEND_EAST: Trip[] = [
  { dep: hm(9, 20), arr: hm(9, 40) },
  { dep: hm(10, 35), arr: hm(10, 55) },
  { dep: hm(11, 30), arr: hm(11, 50) },
  { dep: hm(12, 50), arr: hm(13, 10) },
  { dep: hm(13, 45), arr: hm(14, 5) },
  { dep: hm(14, 10), arr: hm(14, 30) },
  { dep: hm(14, 30), arr: hm(14, 50) },
  { dep: hm(15, 30), arr: hm(15, 50) },
  { dep: hm(16, 30), arr: hm(16, 50) },
  { dep: hm(17, 0), arr: hm(17, 20) },
  { dep: hm(17, 50), arr: hm(18, 10) },
  { dep: hm(19, 10), arr: hm(19, 30) },
  { dep: hm(20, 30), arr: hm(20, 50) },
  { dep: hm(22, 15), arr: hm(22, 35) },
];

type Dir = "west" | "east";
type Level = "weekday" | "weekend" | "none";

const TABLE: Record<Dir, { weekday: Trip[]; weekend: Trip[]; none: Trip[] }> = {
  west: { weekday: WEEKDAY_WEST, weekend: WEEKEND_WEST, none: [] },
  east: { weekday: WEEKDAY_EAST, weekend: WEEKEND_EAST, none: [] },
};

const DIRECTIONS: { id: Dir; from: string; to: string; hint: string }[] = [
  {
    id: "west",
    from: "Main St, Alameda",
    to: "Downtown SF",
    hint: "Westbound",
  },
  {
    id: "east",
    from: "Downtown SF",
    to: "Main St, Alameda",
    hint: "Eastbound · Gate G1",
  },
];

// ---------------------------------------------------------------------------
// Holidays
//
// SF Bay Ferry publishes these one year at a time, and they are NOT simply
// "holidays run the weekend schedule": Veterans' Day and New Year's Eve run the
// weekday grid, Thanksgiving and Christmas run nothing at all, and the
// Thanksgiving Friday runs weekend service on a weekday.
// ---------------------------------------------------------------------------

type Holiday = { name: string; level: Level; note?: string };

const HOLIDAYS: Record<string, Holiday> = {
  "2026-09-07": { name: "Labor Day", level: "weekend" },
  "2026-10-10": {
    name: "SF Fleet Weekend",
    level: "weekend",
    note: "extra unpublished trips run",
  },
  "2026-10-11": {
    name: "SF Fleet Weekend",
    level: "weekend",
    note: "extra unpublished trips run",
  },
  "2026-11-11": { name: "Veterans' Day", level: "weekday" },
  "2026-11-26": { name: "Thanksgiving Day", level: "none" },
  "2026-11-27": { name: "Thanksgiving Weekend", level: "weekend" },
  "2026-11-28": { name: "Thanksgiving Weekend", level: "weekend" },
  "2026-11-29": { name: "Thanksgiving Weekend", level: "weekend" },
  "2026-12-25": { name: "Christmas Day", level: "none" },
  "2026-12-31": { name: "New Year's Eve", level: "weekday" },
};

/** Past this date the holiday list is stale and the board says so. */
const HOLIDAYS_THROUGH = "2026-12-31";

// ---------------------------------------------------------------------------
// Pacific-time clock
//
// The board has to read the *Bay Area's* wall clock, not the visitor's, so
// every "now" goes through Intl with an explicit time zone instead of the local
// Date getters. Dates are carried as YYYY-MM-DD strings so holiday lookup and
// day-stepping share one representation.
// ---------------------------------------------------------------------------

const ptParts = new Intl.DateTimeFormat("en-CA", {
  timeZone: TZ,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type Now = { ymd: string; secondsOfDay: number };

function nowInPacific(): Now {
  const parts = ptParts.formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "0";
  // Intl renders midnight as "24" under hour12:false in some engines.
  const hour = Number(get("hour")) % 24;
  return {
    ymd: `${get("year")}-${get("month")}-${get("day")}`,
    secondsOfDay: hour * 3600 + Number(get("minute")) * 60 + Number(get("second")),
  };
}

/**
 * Step a calendar date by whole days. Anchoring at UTC noon keeps the
 * arithmetic clear of DST entirely -- these are calendar days, not durations.
 */
function addDays(ymd: string, days: number): string {
  const d = new Date(`${ymd}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const dayIndexOf = (ymd: string) => new Date(`${ymd}T12:00:00Z`).getUTCDay();

/** What's running on a given date, holiday overrides taking precedence. */
function serviceOn(ymd: string): { level: Level; holiday?: Holiday } {
  const holiday = HOLIDAYS[ymd];
  if (holiday) return { level: holiday.level, holiday };
  const d = dayIndexOf(ymd);
  return { level: d === 0 || d === 6 ? "weekend" : "weekday" };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

function fmtClock(minutes: number) {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h24 < 12 ? "AM" : "PM"}`;
}

/** "in 2h 14m" / "in 7 min" / "in 40s" -- coarser as the wait gets longer. */
function fmtCountdown(totalSeconds: number) {
  if (totalSeconds < 60) return `in ${totalSeconds}s`;
  const mins = Math.floor(totalSeconds / 60);
  if (mins < 60) return `in ${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `in ${h}h` : `in ${h}h ${m}m`;
}

// ---------------------------------------------------------------------------
// Upcoming-departure search
// ---------------------------------------------------------------------------

type Upcoming = Trip & {
  dayOffset: number;
  dayLabel: string;
  waitSeconds: number;
  holiday?: Holiday;
};

/**
 * The next `count` departures, rolling forward when the day's last boat has
 * gone. No-service days contribute nothing and are simply stepped over, so
 * Christmas correctly reports Boxing Day's first sailing. Two weeks of lookahead
 * is far more than the longest possible gap.
 */
function nextDepartures(dir: Dir, now: Now, count: number): Upcoming[] {
  const out: Upcoming[] = [];

  for (let offset = 0; offset < 14 && out.length < count; offset++) {
    const ymd = addDays(now.ymd, offset);
    const { level, holiday } = serviceOn(ymd);

    for (const trip of TABLE[dir][level]) {
      const depSeconds = offset * 86400 + trip.dep * 60;
      if (depSeconds <= now.secondsOfDay) continue; // already sailed
      out.push({
        ...trip,
        dayOffset: offset,
        dayLabel:
          offset === 0
            ? "today"
            : offset === 1
              ? "tomorrow"
              : DAY_NAMES[dayIndexOf(ymd)],
        waitSeconds: depSeconds - now.secondsOfDay,
        holiday,
      });
      if (out.length === count) break;
    }
  }

  return out;
}

// ---------------------------------------------------------------------------
// UI
// ---------------------------------------------------------------------------

function DirectionCard(props: {
  from: string;
  to: string;
  hint: string;
  upcoming: Upcoming[];
  ready: boolean;
}) {
  const next = () => props.upcoming[0];
  const then = () => props.upcoming[1];
  // Under 20 minutes is roughly "leave now if you're walking".
  const urgent = () => (next()?.waitSeconds ?? Infinity) < 20 * 60;

  const context = (t: Upcoming) =>
    [t.dayOffset > 0 ? t.dayLabel : "", t.holiday?.name]
      .filter(Boolean)
      .join(" · ");

  return (
    <div class="flex-1 min-w-0 rounded-2xl bg-white/4 border border-white/10 p-5">
      <div class="flex items-baseline gap-2 font-sans flex-wrap">
        <span class="font-semibold text-lg">{props.from}</span>
        <span class="op-50 text-sm">&rarr;</span>
        <span class="font-semibold text-lg">{props.to}</span>
        <span class="text-xs op-45">{props.hint}</span>
      </div>

      <Show
        when={props.ready && next()}
        fallback={
          <p class="font-sans op-50 mt-4 mb-0!">
            {props.ready ? "No sailings found." : "…"}
          </p>
        }
      >
        {(trip) => (
          <>
            <div class="font-sans mt-4">
              <div class="text-xs uppercase tracking-wider op-50">Next</div>
              <div class="flex items-baseline gap-3 flex-wrap">
                <span class="text-4xl font-bold tabular-nums">
                  {fmtClock(trip().dep)}
                </span>
                <span
                  class="text-lg font-medium"
                  classList={{
                    "text-amber-400": urgent(),
                    "op-70": !urgent(),
                  }}
                >
                  {fmtCountdown(trip().waitSeconds)}
                </span>
              </div>
              <div class="text-sm op-60 mt-1">
                {context(trip()) && `${context(trip())} · `}
                arrives {fmtClock(trip().arr)}
              </div>
            </div>

            <Show when={then()}>
              {(t2) => (
                <div class="font-sans mt-4 pt-4 border-t border-white/10">
                  <div class="text-xs uppercase tracking-wider op-50">Then</div>
                  <div class="flex items-baseline gap-3 flex-wrap">
                    <span class="text-2xl font-semibold tabular-nums op-90">
                      {fmtClock(t2().dep)}
                    </span>
                    <span class="op-60">{fmtCountdown(t2().waitSeconds)}</span>
                  </div>
                  <div class="text-sm op-60 mt-1">
                    {context(t2()) && `${context(t2())} · `}
                    arrives {fmtClock(t2().arr)}
                  </div>
                </div>
              )}
            </Show>
          </>
        )}
      </Show>
    </div>
  );
}

/** Every departure for one direction on the timetable being viewed. */
function DayColumn(props: {
  title: string;
  trips: Trip[];
  now: Now | null;
  live: boolean;
}) {
  const passed = (t: Trip) =>
    props.live && props.now !== null && t.dep * 60 <= props.now.secondsOfDay;

  return (
    <div class="flex-1 min-w-0">
      <div class="font-sans text-xs uppercase tracking-wider op-50 mb-2">
        {props.title}
      </div>
      <ul class="list-none! p0! m0! font-sans text-sm">
        <For each={props.trips}>
          {(t) => (
            <li
              class="flex justify-between gap-3 py-1 border-b border-white/6 tabular-nums"
              classList={{ "op-35": passed(t) }}
            >
              <span>{fmtClock(t.dep)}</span>
              <span class="op-60">{fmtClock(t.arr)}</span>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}

export default function FerrySchedule() {
  // `null` until mounted: the site prerenders to static HTML, so anything
  // time-dependent has to wait for the client or it hydrates into a mismatch.
  const [now, setNow] = createSignal<Now | null>(null);
  const [showTable, setShowTable] = createSignal(false);
  const [tableMode, setTableMode] = createSignal<"weekday" | "weekend" | null>(
    null
  );

  onMount(() => {
    const tick = () => setNow(nowInPacific());
    tick();
    const id = setInterval(tick, 1000);
    onCleanup(() => clearInterval(id));
  });

  const today = createMemo(() => {
    const n = now();
    return n === null ? null : serviceOn(n.ymd);
  });

  const mode = () => tableMode() ?? (today()?.level === "weekend" ? "weekend" : "weekday");

  const boards = createMemo(() => {
    const n = now();
    if (n === null) return null;
    return DIRECTIONS.map((d) => ({ ...d, upcoming: nextDepartures(d.id, n, 2) }));
  });

  const stale = () => {
    const n = now();
    return n !== null && n.ymd > HOLIDAYS_THROUGH;
  };

  const status = () => {
    const n = now();
    const t = today();
    if (n === null || t === null) return "";
    const clock = `${DAY_NAMES[dayIndexOf(n.ymd)]} ${fmtClock(
      Math.floor(n.secondsOfDay / 60)
    )} PT`;
    const level =
      t.level === "none"
        ? "no service today"
        : `${t.level} schedule`;
    return `${clock} · ${t.holiday ? `${t.holiday.name} · ` : ""}${level}`;
  };

  return (
    <div class="my-8">
      <div class="flex justify-between items-center gap-3 mb-3 font-sans text-sm op-60 flex-wrap">
        <span>
          <Show when={now()} fallback="…">
            {status()}
          </Show>
        </span>
        <button
          class="font-sans text-sm px-3 py-1 rounded-full bg-white/6 hover:bg-white/12 border border-white/10 cursor-pointer text-inherit transition active:scale-95"
          onClick={() => setShowTable(!showTable())}
        >
          {showTable() ? "Hide" : "Show"} timetable
        </button>
      </div>

      <Show when={today()?.level === "none"}>
        <div class="mb-3 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 font-sans text-sm">
          No ferries at all today ({today()!.holiday!.name}). Showing the next
          sailing after that.
        </div>
      </Show>

      <Show when={today()?.holiday?.note}>
        {(note) => (
          <div class="mb-3 rounded-xl border border-white/15 bg-white/5 px-4 py-2 font-sans text-sm op-80">
            {today()!.holiday!.name}: {note()}, not shown here.
          </div>
        )}
      </Show>

      <div class="flex md:flex-row flex-col gap-4">
        <Show
          when={boards()}
          fallback={
            <For each={DIRECTIONS}>
              {(d) => (
                <DirectionCard
                  from={d.from}
                  to={d.to}
                  hint={d.hint}
                  upcoming={[]}
                  ready={false}
                />
              )}
            </For>
          }
        >
          {(list) => (
            <For each={list()}>
              {(b) => (
                <DirectionCard
                  from={b.from}
                  to={b.to}
                  hint={b.hint}
                  upcoming={b.upcoming}
                  ready={true}
                />
              )}
            </For>
          )}
        </Show>
      </div>

      <Show when={showTable()}>
        <div class="mt-5 rounded-2xl bg-white/4 border border-white/10 p-5">
          <div class="flex gap-2 mb-4 font-sans text-sm">
            <For each={["weekday", "weekend"] as const}>
              {(m) => (
                <button
                  class="px-3 py-1 rounded-full border cursor-pointer text-inherit transition active:scale-95"
                  classList={{
                    "bg-white/15 border-white/25": mode() === m,
                    "bg-transparent border-white/10 hover:bg-white/8": mode() !== m,
                  }}
                  onClick={() => setTableMode(m)}
                >
                  {m === "weekday" ? "Mon–Fri" : "Sat–Sun"}
                </button>
              )}
            </For>
          </div>

          <div class="flex md:flex-row flex-col gap-8">
            <DayColumn
              title="Main St → SF"
              trips={TABLE.west[mode()]}
              now={now()}
              live={mode() === today()?.level}
            />
            <DayColumn
              title="SF → Main St"
              trips={TABLE.east[mode()]}
              now={now()}
              live={mode() === today()?.level}
            />
          </div>
        </div>
      </Show>

      <Show when={stale()}>
        <p class="font-sans text-xs text-amber-400/80 mt-3 mb-0!">
          Holiday list only covers 2026 — holidays after that are not applied.
        </p>
      </Show>
    </div>
  );
}
