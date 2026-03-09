import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";
import * as turf from "@turf/turf";

interface Props {
  onMapClick?: (lat: number, lng: number) => void;
  onParcelSelect?: (area: number, ref: string, cl: number) => void;
  locateMode?: boolean;
}

const MapPanel = ({ onMapClick, onParcelSelect, locateMode }: Props) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const geoLayerRef = useRef<L.GeoJSON | null>(null);
  const selectedParcelRef = useRef<L.Path | null>(null);
  const clDataRef = useRef<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const highlightStyle: L.PathOptions = {
    color: "#00ffff",
    weight: 3,
    fillColor: "#00ffff",
    fillOpacity: 0.5
  };

  useEffect(() => {
  if (!containerRef.current || mapRef.current) return;

  fetch("/data/cl_by_bairro.json")
  .then(res => res.json())
  .then((clData) => {

      clDataRef.current = clData;

      if (!containerRef.current) return;

      const MIN_ZOOM = 16;

      const loadParcels = async (map: L.Map) => {
  const zoom = map.getZoom();
  if (zoom < MIN_ZOOM) {
    geoLayerRef.current?.remove();
    geoLayerRef.current = null;
    selectedParcelRef.current = null;
    return;
  }

  const bounds = map.getBounds();
  const bbox = [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()].join(",");

  const res = await fetch(`http://127.0.0.1:8000/api/lotes?bbox=${bbox}`);
  const data = await res.json();
  setIsLoading(false);

  if (!geoLayerRef.current) {
    geoLayerRef.current = L.geoJSON(data, {
      coordsToLatLng: coords => new L.LatLng(coords[1], coords[0]),
      style: {
        color: "#ff7800",
        weight: 1,
        fillOpacity: 0.25,
      },
      onEachFeature: (feature, layer) => {
        layer.on("click", () => {
          if (!feature.geometry) return;

          // Reset previous selected parcel
          if (selectedParcelRef.current && geoLayerRef.current?.hasLayer(selectedParcelRef.current)) {
  geoLayerRef.current.resetStyle(selectedParcelRef.current);

  const prevEl = selectedParcelRef.current.getElement();
  if (prevEl) {
    prevEl.classList.remove("parcel-selected");
  }
}

          const path = layer as L.Path;

path.setStyle(highlightStyle);

// ADD animation class
const el = path.getElement();
if (el) {
  el.classList.add("parcel-selected");
}

selectedParcelRef.current = path;

          map.fitBounds((layer as L.Polygon).getBounds());

          const area = turf.area(feature);
          const lote = feature.properties?.cod_lote ?? "";
          const bairroRaw = feature.properties?.cod_bairro ?? "";
          const bairro = bairroRaw.toString().padStart(4, "0");
          const cadastralRef = `${bairro}-${lote}`;
          const cl = clDataRef.current[bairro] ?? 1.0;

          onParcelSelect?.(Math.round(area), cadastralRef, cl);
        });

        if (feature.properties) {
          layer.bindPopup(
            "Lote: " + feature.properties.cod_lote + "<br>Bairro: " + feature.properties.cod_bairro
          );
        }
      }
    }).addTo(map);
  } else {
    // Remove all unselected parcels
    geoLayerRef.current.eachLayer(layer => {
      if (layer !== selectedParcelRef.current) {
        geoLayerRef.current?.removeLayer(layer);
      }
    });
    geoLayerRef.current.addData(data);
  }
};

      const map = L.map(containerRef.current, {
  center: [14.933, -23.513],
  zoom: 16,
  zoomControl: true,
});

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      loadParcels(map);

map.on("moveend zoomend", () => {
  loadParcels(map);
});

      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng]).addTo(map);
        }

        onMapClick?.(lat, lng);
      });

      mapRef.current = map;

      setTimeout(() => map.invalidateSize(), 100);
    })
    .catch(err => {
      console.error("GeoJSON load error:", err);
      setIsLoading(false);
    });

  return () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }
  };

}, []);

  return (
    <div className="glass-panel rounded-xl overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="section-title">🗺 Mapa</h3>
        {locateMode && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium animate-pulse">
            Clique no mapa para selecionar
          </span>
        )}
      </div>
      <div className="relative flex-1 min-h-[400px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm animate-fade-in">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-muted" />
              <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-t-primary animate-spin" />
              <MapPin className="absolute inset-0 m-auto w-6 h-6 text-primary animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-medium text-foreground">A carregar mapa…</p>
              <p className="text-xs text-muted-foreground">Preparando camadas geográficas</p>
            </div>
          </div>
        )}
        <div ref={containerRef} className="absolute inset-0" />
      </div>
    </div>
  );
};

export default MapPanel;
