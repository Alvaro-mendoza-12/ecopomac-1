"use client";

import "leaflet/dist/leaflet.css";

import { Circle, MapContainer, Marker, Polygon, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { LatLngTuple } from "leaflet";
import { cn } from "@/lib/cn";
import { ECO_POMAC } from "@/lib/constants";

type StableLeafletMapProps = {
  compact?: boolean;
  className?: string;
};

const center: LatLngTuple = [ECO_POMAC.coords.lat, ECO_POMAC.coords.lng];

const icon = L.divIcon({
  className: "",
  html: `<div style="width:14px;height:14px;border-radius:999px;background:rgba(15,118,110,0.95);border:2px solid rgba(255,255,255,0.9);box-shadow:0 8px 18px -10px rgba(0,0,0,0.6)"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const points: Array<{
  name: string;
  tag: "Flora" | "Fauna" | "Protección" | "Afectación";
  position: [number, number];
  detail: string;
}> = [
  {
    name: "Bosque de algarrobo",
    tag: "Flora",
    position: [-6.445, -79.86],
    detail: "Especie clave del bosque seco; soporte de biodiversidad.",
  },
  {
    name: "Zorro costeño (referencia)",
    tag: "Fauna",
    position: [-6.452, -79.866],
    detail: "Indicador ecológico; sensible a fragmentación de hábitat.",
  },
  {
    name: "Zona protegida (referencia)",
    tag: "Protección",
    position: [-6.447, -79.872],
    detail: "Área prioritaria para conservación y vigilancia.",
  },
  {
    name: "Zona afectada (referencia)",
    tag: "Afectación",
    position: [-6.456, -79.856],
    detail: "Pérdida de cobertura por presión antrópica (educativo).",
  },
];

const affectedPolygon: [number, number][][] = [
  [
    [-6.4585, -79.87],
    [-6.452, -79.875],
    [-6.4445, -79.868],
    [-6.448, -79.858],
    [-6.457, -79.861],
  ],
];

export function StableLeafletMap({ compact, className }: StableLeafletMapProps) {
  return (
    <div className={cn("overflow-hidden rounded-3xl border border-border bg-slate-200", className)}>
      <div
        className={cn(
          "w-full",
          compact ? "h-[300px] sm:h-[320px]" : "h-[420px] sm:h-[540px] lg:h-[600px]",
        )}
      >
        <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Circle
            center={center}
            radius={2600}
            pathOptions={{ color: "#0f766e", fillColor: "#34d399", fillOpacity: 0.16 }}
          />
          <Polygon
            positions={affectedPolygon}
            pathOptions={{ color: "#be123c", fillColor: "#fb7185", fillOpacity: 0.24 }}
          />
          {points.map((p) => (
            <Marker key={p.name} position={p.position} icon={icon}>
              <Popup>
                <div style={{ fontFamily: "system-ui" }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div style={{ opacity: 0.75, fontSize: 12 }}>{p.tag}</div>
                  <div style={{ marginTop: 6, fontSize: 12 }}>{p.detail}</div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
