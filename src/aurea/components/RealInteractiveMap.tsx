import React, { useEffect, useRef, useState } from "react";
import { AureaProperty, CurrencyCode } from "../types";
import { formatSovereignCurrency } from "../storage/useAureaStorage";

interface LeafletMapInstance {
  setView: (center: [number, number], zoom: number) => void;
  flyTo: (
    center: [number, number],
    zoom: number,
    options?: { duration?: number }
  ) => void;
  fitBounds: (
    bounds: [number, number][],
    options?: { padding?: [number, number]; maxZoom?: number }
  ) => void;
  remove: () => void;
}

interface LeafletTileLayerInstance {
  addTo: (map: LeafletMapInstance) => LeafletTileLayerInstance;
  remove: () => void;
}

interface LeafletMarkerInstance {
  addTo: (map: LeafletMapInstance) => LeafletMarkerInstance;
  bindPopup: (html: string) => LeafletMarkerInstance;
  openPopup: () => void;
  on: (event: string, handler: () => void) => void;
  remove: () => void;
}

interface LeafletStatic {
  map: (
    el: HTMLElement,
    opts?: {
      center?: [number, number];
      zoom?: number;
      zoomControl?: boolean;
      scrollWheelZoom?: boolean;
    }
  ) => LeafletMapInstance;
  tileLayer: (
    url: string,
    opts?: { attribution?: string; maxZoom?: number }
  ) => LeafletTileLayerInstance;
  divIcon: (opts: {
    className?: string;
    html?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
  }) => unknown;
  marker: (
    coords: [number, number],
    opts?: { icon?: unknown }
  ) => LeafletMarkerInstance;
}

declare global {
  interface Window {
    L?: LeafletStatic;
  }
}

type MapTileMode = "VOYAGER" | "DARK" | "SATELLITE";

interface RealInteractiveMapProps {
  properties: AureaProperty[];
  selectedProperty: AureaProperty;
  currency: CurrencyCode;
  onSelectProperty: (property: AureaProperty) => void;
  onOpenDossier: (property: AureaProperty) => void;
}

const TILE_URLS: Record<MapTileMode, { url: string; attribution: string }> = {
  VOYAGER: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  DARK: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap &copy; CARTO",
  },
  SATELLITE: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics",
  },
};

export const RealInteractiveMap: React.FC<RealInteractiveMapProps> = ({
  properties,
  selectedProperty,
  currency,
  onSelectProperty,
  onOpenDossier,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const tileLayerRef = useRef<LeafletTileLayerInstance | null>(null);
  const markersRef = useRef<LeafletMarkerInstance[]>([]);
  const [tileMode, setTileMode] = useState<MapTileMode>("SATELLITE");

  // Inicializar instancia de Leaflet
  useEffect(() => {
    const L = window.L;
    if (!L || !mapContainerRef.current || mapInstanceRef.current) return;

    const initialCenter: [number, number] = [21.1325, -86.8242];

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    const cfg = TILE_URLS.SATELLITE;
    const layer = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    tileLayerRef.current = layer;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
    };
  }, []);

  // Cambiar capa de teselas (Satélite / Editorial / Nocturno)
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    if (tileLayerRef.current) {
      tileLayerRef.current.remove();
    }
    const cfg = TILE_URLS[tileMode];
    tileLayerRef.current = L.tileLayer(cfg.url, {
      attribution: cfg.attribution,
      maxZoom: 19,
    }).addTo(map);
  }, [tileMode]);

  // Renderizar marcadores interactivos cuando cambian las propiedades o la selección
  useEffect(() => {
    const L = window.L;
    const map = mapInstanceRef.current;
    if (!L || !map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    properties.forEach((prop) => {
      const isSelected = selectedProperty?.id === prop.id;
      const priceStr = formatSovereignCurrency(prop.priceUsd, currency, true);

      const iconHtml = `
        <div style="
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: ${isSelected ? "#755a34" : "#091e3a"};
          color: #ffffff;
          border: 2px solid ${isSelected ? "#faeedd" : "#00b4f5"};
          box-shadow: 0 8px 20px rgba(0,0,0,0.45);
          font-family: 'Outfit', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          white-space: nowrap;
          transform: translate(-50%, -100%) scale(${isSelected ? "1.1" : "1"});
          transition: all 0.2s ease;
          cursor: pointer;
        ">
          <span style="color: ${isSelected ? "#faeedd" : "#00b4f5"};">${prop.code.split("-")[0]}</span>
          <span>${prop.name.split("—")[0].split("(")[0].trim()}</span>
          <span style="background: rgba(255,255,255,0.15); padding: 1px 5px; font-size: 10px;">${priceStr}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: "atlas-leaflet-pin",
        html: iconHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = L.marker([prop.coordinates.lat, prop.coordinates.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.on("click", () => {
        onSelectProperty(prop);
        map.flyTo([prop.coordinates.lat, prop.coordinates.lng], 14, {
          duration: 1.1,
        });
      });

      markersRef.current.push(marker);
    });
  }, [properties, selectedProperty, currency, onSelectProperty]);

  // Volar suavemente cuando cambia la propiedad seleccionada desde la lista lateral
  const selectedLat = selectedProperty?.coordinates.lat;
  const selectedLng = selectedProperty?.coordinates.lng;
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || selectedLat === undefined || selectedLng === undefined) return;
    map.flyTo([selectedLat, selectedLng], 14, { duration: 1.1 });
  }, [selectedLat, selectedLng]);

  const handleFitAllCorridor = () => {
    const map = mapInstanceRef.current;
    if (!map || properties.length === 0) return;
    const bounds: [number, number][] = properties.map((p) => [
      p.coordinates.lat,
      p.coordinates.lng,
    ]);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
  };

  const handleFocusCancunLagoon = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([21.1325, -86.8242], 14, { duration: 1.1 });
  };

  return (
    <div className="space-y-3">
      {/* Barra de controles de capas y enfoque geográfico */}
      <div className="flex flex-wrap items-center justify-between gap-2 border border-white/15 bg-[#091322] px-3.5 py-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00b4f5]">
            CAPA CARTOGRÁFICA:
          </span>
          <button
            type="button"
            onClick={() => setTileMode("SATELLITE")}
            className={`px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider transition ${
              tileMode === "SATELLITE"
                ? "bg-[#0077cc] text-white"
                : "border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            Satélite Real HD
          </button>
          <button
            type="button"
            onClick={() => setTileMode("VOYAGER")}
            className={`px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider transition ${
              tileMode === "VOYAGER"
                ? "bg-[#0077cc] text-white"
                : "border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            Mapa Editorial
          </button>
          <button
            type="button"
            onClick={() => setTileMode("DARK")}
            className={`px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider transition ${
              tileMode === "DARK"
                ? "bg-[#0077cc] text-white"
                : "border border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            Modo Nocturno
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleFocusCancunLagoon}
            className="border border-[#755a34] bg-[#755a34]/20 px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-[#faeedd] hover:bg-[#755a34] hover:text-white"
          >
            Laguna Nichupté / Cancún
          </button>
          <button
            type="button"
            onClick={handleFitAllCorridor}
            className="border border-white/20 bg-white/5 px-2.5 py-1 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-white/15"
          >
            Ver Corredor Completo
          </button>
        </div>
      </div>

      {/* Contenedor del Mapa Real Leaflet */}
      <div className="relative h-[460px] w-full overflow-hidden border border-white/20 bg-[#07111e]">
        <div ref={mapContainerRef} className="z-10 h-full w-full" />

        {/* Tarjeta flotante interactiva de la propiedad activa sobre el mapa */}
        {selectedProperty && (
          <div className="pointer-events-auto absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 border border-white/20 bg-[#060f1d]/95 p-3.5 text-white shadow-2xl backdrop-blur-md sm:right-auto sm:max-w-md">
            <div>
              <div className="font-outfit text-[10px] font-semibold uppercase tracking-[0.2em] text-[#00b4f5]">
                {selectedProperty.zone} · GPS {selectedProperty.coordinates.lat.toFixed(4)}° N,{" "}
                {selectedProperty.coordinates.lng.toFixed(4)}° W
              </div>
              <div className="mt-0.5 font-outfit text-sm font-bold text-white">
                {selectedProperty.name}
              </div>
              <div className="mt-0.5 font-outfit text-xs text-[#faeedd]">
                Desde {formatSovereignCurrency(selectedProperty.priceUsd, currency)} ·{" "}
                {selectedProperty.availableUnits} unidades en inventario
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpenDossier(selectedProperty)}
              className="bg-[#755a34] px-3.5 py-2 font-outfit text-[10px] font-semibold uppercase tracking-wider text-white transition hover:bg-[#0077cc]"
            >
              Ver Expediente Drive →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
