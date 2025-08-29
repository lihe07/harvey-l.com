import { onMount, onCleanup, createSignal, type Component } from "solid-js";
import "leaflet/dist/leaflet.css";
import L, { Map as LMap, Marker as LMarker, LatLng, LeafletMouseEvent } from "leaflet";

// Fix marker icons for bundlers
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import Button from "../index/Button";
const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

type GeoPickerProps = {
  onSelect?: (coords: { lat: number; lng: number }) => void;
  height?: string;
  initialZoom?: number;
  initialCenter?: { lat: number; lng: number };
  class?: string;
};

const GeoPicker: Component<GeoPickerProps> = (props) => {
  const height = props.height ?? "h-[420px]";
  const initialZoom = props.initialZoom ?? 10;
  const initialCenter = props.initialCenter ?? { lat: 51.5074, lng: -0.1278 }; // London

  let mapEl!: HTMLDivElement;
  let map: LMap | null = null;

  const [marker, setMarker] = createSignal<LMarker | null>(null);
  const [coords, setCoords] = createSignal<{ lat: number; lng: number } | null>(null);

  const setOrMoveMarker = (latlng: LatLng) => {
    if (!map) return;
    const current = marker();
    if (current) {
      current.setLatLng(latlng);
    } else {
      const m = L.marker(latlng, { draggable: true }).addTo(map);
      m.on("dragend", () => {
        const ll = m.getLatLng();
        setCoords({ lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) });
      });
      setMarker(m);
    }
    setCoords({ lat: +latlng.lat.toFixed(6), lng: +latlng.lng.toFixed(6) });
  };

  const handleMapClick = (e: LeafletMouseEvent) => setOrMoveMarker(e.latlng);

  const clearSelection = () => {
    marker()?.remove();
    setMarker(null);
    setCoords(null);
  };

  const confirmSelection = () => {
    const c = coords();
    if (c && props.onSelect) props.onSelect(c);
  };

  onMount(() => {
    map = L.map(mapEl).setView([initialCenter.lat, initialCenter.lng], initialZoom);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.control.scale({ metric: true, imperial: false }).addTo(map);
    map.on("click", handleMapClick);
  });

  onCleanup(() => {
    if (!map) return;
    map.off("click", handleMapClick);
    map.remove();
    map = null;
  });

  return (
    <div class={`${props.class ?? ""}`}>
      <div ref={mapEl} class={`w-full rounded-xl shadow-md overflow-hidden ${height}`} />

      <div class="mt-5 flex items-center gap-2 px-5 py-3 rounded-lg shadow bg-dark/90 backdrop-blur">
        <span>
          {coords()
            ? `Lat: ${coords()!.lat.toFixed(3)} Lng: ${coords()!.lng.toFixed(3)}`
            : "Click the map to drop a pin"}
        </span>

        <div class="flex-1"></div>

        <Button
          onClick={clearSelection}
        >
          Clear
        </Button>
        <Button
          // disabled={!coords()}
          onClick={confirmSelection}
        >
          Confirm
        </Button>
      </div>


    </div>
  );
};

export default GeoPicker;
