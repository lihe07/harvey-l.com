import { createSignal, onMount, Show } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { Title } from "@solidjs/meta";

function calculateDistance(
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number {
  const R = 6371000; // Earth radius in meters

  const radLat1 = point1.lat * Math.PI / 180;
  const radLng1 = point1.lng * Math.PI / 180;
  const radLat2 = point2.lat * Math.PI / 180;
  const radLng2 = point2.lng * Math.PI / 180;

  const dLat = radLat2 - radLat1;
  const dLng = radLng2 - radLng1;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const GeoPicker = clientOnly(() => import("./GeoPicker"));

export default function Challenge(props: { children: any }) {
  const [locked, setLocked] = createSignal(true);
  const [solved, setSolved] = createSignal<boolean | null>(null);

  function onSelect(coords: { lat: number; lng: number }) {
    // Compare with ground truth (residence hall in London)
    const groundTruth = { lat: 51.505232138881624, lng: -0.11145476979900107 };
    let distance = calculateDistance(coords, groundTruth);

    setSolved(distance < 50);

    if (solved()) {
      localStorage.setItem("challenge-solved", "true");
      setTimeout(() => {
        setLocked(false);
      }, 2000)
    }
  }

  onMount(() => {
    // Check the localStorage
    if (localStorage.getItem("challenge-solved") === "true") {
      setLocked(false);
    }
  })


  return <div>
    <Title>harvey-l.com - Protected Page</Title>

    <div class="fixed t-0 l-0 w-full h-full min-h-screen z-20 bg-green-9 flex items-center justify-center transition-500 op-0 pointer-events-none"
      classList={{ "hidden!": !locked(), "op-100 pointer-events-all": !!solved() }}
    >
      <div>
        <div class=" w-20 h-20 ma" classList={{ "i-line-md:circle-to-confirm-circle-transition": !!solved() }}></div>
        <h1 class="text-2xl text-center font-bold mt-5">
          Correct! You may now access the page.
        </h1>
      </div>
    </div>

    <div class="fixed t-0 l-0 w-full h-full min-h-screen z-10 bg-slate-7 flex items-center justify-center transition-500 pt-10"
      classList={{ "hidden!": !locked() }}
    >

      <div>
        <h1 class="md:text-4xl text-2xl text-center mb-5 font-bold">
          Protected Page!
        </h1>
        <p class="text-center max-w-70% ma mb-5 text-slate-3 text-lg">
          Prove that you know the program by clicking on <span class="font-bold">our residence hall in London.</span>
        </p>

        <div class="w-md w-max max-w-[calc(100vw-5rem)] ma">
          <GeoPicker class="w-full" onSelect={onSelect} />
        </div>

        <Show when={solved() === false}>
          <p class="text-center mt-5 text-lg font-medium text-red" >
            Incorrect. Please try again.
          </p>
        </Show>
      </div>
    </div>

    <Show when={!locked()}>
      {props.children}
    </Show>
  </div >
}
