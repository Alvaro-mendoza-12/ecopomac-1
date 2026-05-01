"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import maplibregl, { type GeoJSONSource, type LngLatLike, type StyleSpecification } from "maplibre-gl";
import type { FeatureCollection, LineString, Point, Polygon } from "geojson";
import { LayerPanel } from "@/features/map/components/LayerPanel";
import { LegendPanel } from "@/features/map/components/LegendPanel";
import { MapStatsPanel } from "@/features/map/components/MapStatsPanel";
import { useGeospatialData } from "@/features/map/hooks/useGeospatialData";
import { useGeospatialFilters } from "@/features/map/hooks/useGeospatialFilters";
import {
  BIODIVERSITY_POINTS_LAYER_ID,
  addBiodiversityLayers,
  setBiodiversityVisibility,
  updateBiodiversityData,
} from "@/features/map/layers/biodiversityLayers";
import {
  FIRE_POINTS_LAYER_ID,
  addFireLayers,
  setFireVisibility,
  updateFireData,
} from "@/features/map/layers/fireLayers";
import { affectedBasePolygon, ecoMapPoints, infrastructureFeatures, yearPressure } from "@/features/map/map3dData";
import { cn } from "@/lib/cn";
import { ECO_POMAC } from "@/lib/constants";

type EcoMap3DProps = {
  className?: string;
  compact?: boolean;
  showControls?: boolean;
  defaultPanelsVisible?: boolean;
};

const mapCenter: LngLatLike = [ECO_POMAC.coords.lng, ECO_POMAC.coords.lat];
const customStyleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;
const customDemUrl = process.env.NEXT_PUBLIC_MAP_TERRAIN_DEM_URL_TEMPLATE;
const useCustomStyle = process.env.NEXT_PUBLIC_MAP_USE_CUSTOM_STYLE === "true";

const baseStyle: StyleSpecification = {
  version: 8,
  sources: {
    basemap: {
      type: "raster",
      tiles: [
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "base-bg",
      type: "background",
      paint: {
        "background-color": "#cbd5e1",
      },
    },
    { id: "basemap-raster", type: "raster", source: "basemap", minzoom: 0, maxzoom: 22 },
  ],
};

function buildAffectedFeature(pressure: number): FeatureCollection<Polygon, { height: number; pressure: number }> {
  const height = Math.round(20 + pressure * 110);
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { height, pressure },
        geometry: { type: "Polygon", coordinates: [affectedBasePolygon] },
      },
    ],
  };
}

function buildEcoPoints(): FeatureCollection<Point, { name: string; tag: string; detail: string }> {
  return {
    type: "FeatureCollection",
    features: ecoMapPoints.map((p) => ({
      type: "Feature" as const,
      properties: { name: p.name, tag: p.tag, detail: p.detail },
      geometry: { type: "Point", coordinates: [p.lng, p.lat] as [number, number] },
    })),
  };
}

function popupHtml(title: string, subtitle: string, body: string) {
  return `<div style="font-family:system-ui;min-width:190px"><strong>${title}</strong><br/><span style="opacity:.75">${subtitle}</span><p style="margin-top:6px;font-size:12px">${body}</p></div>`;
}

function buildContextGrid(): FeatureCollection<LineString, { kind: "lat" | "lng" }> {
  const features: FeatureCollection<LineString, { kind: "lat" | "lng" }>["features"] = [];
  for (let lat = -6.52; lat <= -6.36; lat += 0.02) {
    features.push({
      type: "Feature",
      properties: { kind: "lat" },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.95, Number(lat.toFixed(3))],
          [-79.74, Number(lat.toFixed(3))],
        ],
      },
    });
  }
  for (let lng = -79.95; lng <= -79.74; lng += 0.02) {
    features.push({
      type: "Feature",
      properties: { kind: "lng" },
      geometry: {
        type: "LineString",
        coordinates: [
          [Number(lng.toFixed(3)), -6.52],
          [Number(lng.toFixed(3)), -6.36],
        ],
      },
    });
  }
  return { type: "FeatureCollection", features };
}

export function EcoMap3D({
  className,
  compact = false,
  showControls = true,
  defaultPanelsVisible = false,
}: EcoMap3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [yearIndex, setYearIndex] = useState(2);
  const [terrainBoost, setTerrainBoost] = useState(1.45);
  const [isReady, setIsReady] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [panelsVisible, setPanelsVisible] = useState(defaultPanelsVisible);
  const filters = useGeospatialFilters();
  const geoData = useGeospatialData(filters);
  const pressure = useMemo(() => yearPressure[yearIndex] ?? yearPressure[2], [yearIndex]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: useCustomStyle && customStyleUrl ? customStyleUrl : baseStyle,
      center: mapCenter,
      zoom: compact ? 11.2 : 11.8,
      pitch: 0,
      bearing: 0,
      attributionControl: {},
      cooperativeGestures: true,
    });
    mapRef.current = map;
    popupRef.current = new maplibregl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");
    map.on("error", (e) => {
      const message = String((e as { error?: { message?: string } })?.error?.message ?? "");
      if (
        message.toLowerCase().includes("tile") ||
        message.toLowerCase().includes("source") ||
        message.toLowerCase().includes("request")
      ) {
        setMapError("No se pudo cargar cartografia remota. Mostrando respaldo local.");
      }
      if (useCustomStyle) {
        map.setStyle(baseStyle);
      }
    });

      map.on("load", () => {
        map.resize();
        let canUse3D = false;
      if (!map.getLayer("fallback-grid")) {
        map.addSource("fallback-grid-src", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                properties: {},
                geometry: {
                  type: "Polygon",
                  coordinates: [[
                    [-79.95, -6.52],
                    [-79.95, -6.36],
                    [-79.74, -6.36],
                    [-79.74, -6.52],
                    [-79.95, -6.52],
                  ]],
                },
              },
            ],
          },
        });
        map.addLayer({
          id: "fallback-grid",
          type: "line",
          source: "fallback-grid-src",
          paint: {
            "line-color": "#9ca3af",
            "line-width": 1.2,
            "line-opacity": 0.4,
          },
        });
      }

      map.addSource("eco-affected", { type: "geojson", data: buildAffectedFeature(pressure) });
      map.addSource("eco-infra", { type: "geojson", data: infrastructureFeatures });
      map.addSource("eco-points", { type: "geojson", data: buildEcoPoints() });
      map.addSource("eco-center-point", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: { type: "Point", coordinates: [ECO_POMAC.coords.lng, ECO_POMAC.coords.lat] },
            },
          ],
        },
      });
      map.addSource("eco-context-grid", {
        type: "geojson",
        data: buildContextGrid(),
      });

      map.addLayer({
        id: "eco-context-grid-layer",
        type: "line",
        source: "eco-context-grid",
        paint: {
          "line-color": "#94a3b8",
          "line-width": 1,
          "line-opacity": 0.35,
        },
      });
      map.addLayer({
        id: "eco-center-point-layer",
        type: "circle",
        source: "eco-center-point",
        paint: {
          "circle-color": "#0f766e",
          "circle-stroke-color": "#ffffff",
          "circle-stroke-width": 2,
          "circle-radius": 8,
          "circle-opacity": 0.95,
        },
      });

      if (canUse3D) {
        map.addLayer({
          id: "eco-affected-fill",
          type: "fill-extrusion",
          source: "eco-affected",
          paint: {
            "fill-extrusion-color": ["interpolate", ["linear"], ["get", "pressure"], 0.2, "#fbbf24", 0.6, "#fb7185"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-opacity": 0.7,
          },
        });
        map.addLayer({
          id: "eco-infra-fill",
          type: "fill-extrusion",
          source: "eco-infra",
          paint: {
            "fill-extrusion-color": ["match", ["get", "kind"], "infraestructura", "#67e8f9", "centro-poblado", "#a7f3d0", "#d1fae5"],
            "fill-extrusion-height": ["get", "height"],
            "fill-extrusion-opacity": 0.86,
          },
        });
      } else {
        map.addLayer({
          id: "eco-affected-fill-2d",
          type: "fill",
          source: "eco-affected",
          paint: {
            "fill-color": "#fb7185",
            "fill-opacity": 0.28,
          },
        });
        map.addLayer({
          id: "eco-affected-line-2d",
          type: "line",
          source: "eco-affected",
          paint: {
            "line-color": "#be123c",
            "line-width": 2,
            "line-opacity": 0.8,
          },
        });
        map.addLayer({
          id: "eco-infra-fill-2d",
          type: "fill",
          source: "eco-infra",
          paint: {
            "fill-color": "#67e8f9",
            "fill-opacity": 0.22,
          },
        });
        map.addLayer({
          id: "eco-infra-line-2d",
          type: "line",
          source: "eco-infra",
          paint: {
            "line-color": "#0891b2",
            "line-width": 1.5,
            "line-opacity": 0.7,
          },
        });
      }
      map.addLayer({
        id: "eco-points-layer",
        type: "circle",
        source: "eco-points",
        paint: {
          "circle-radius": 5,
          "circle-color": ["match", ["get", "tag"], "Flora", "#34d399", "Fauna", "#60a5fa", "Protección", "#2dd4bf", "#fb7185"],
          "circle-stroke-color": "#fff",
          "circle-stroke-width": 1.1,
        },
      });

      addFireLayers(map, geoData.fires);
      addBiodiversityLayers(map, geoData.biodiversityPoints, geoData.biodiversityAreas);

      map.on("mouseenter", "eco-points-layer", (e) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f || f.geometry.type !== "Point") return;
        const p = f.properties as Record<string, string> | undefined;
        popupRef.current
          ?.setLngLat(f.geometry.coordinates as [number, number])
          .setHTML(popupHtml(p?.name ?? "", p?.tag ?? "", p?.detail ?? ""))
          .addTo(map);
      });
      map.on("mouseleave", "eco-points-layer", () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      });

      map.on("mouseenter", FIRE_POINTS_LAYER_ID, (e) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f || f.geometry.type !== "Point") return;
        const p = f.properties as Record<string, string> | undefined;
        popupRef.current
          ?.setLngLat(f.geometry.coordinates as [number, number])
          .setHTML(
            popupHtml(
              p?.name ?? "Incendio",
              `${p?.status ?? ""} · severidad ${p?.severity ?? ""}`,
              `Fecha: ${(p?.observedAt ?? "").slice(0, 10)} · Superficie: ${p?.areaHa ?? "0"} ha`,
            ),
          )
          .addTo(map);
      });
      map.on("mouseleave", FIRE_POINTS_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      });

      map.on("mouseenter", BIODIVERSITY_POINTS_LAYER_ID, (e) => {
        map.getCanvas().style.cursor = "pointer";
        const f = e.features?.[0];
        if (!f || f.geometry.type !== "Point") return;
        const p = f.properties as Record<string, string> | undefined;
        popupRef.current
          ?.setLngLat(f.geometry.coordinates as [number, number])
          .setHTML(
            popupHtml(
              p?.name ?? "Biodiversidad",
              `${p?.kind ?? ""} · estado ${p?.conservationStatus ?? ""}`,
              `Especies asociadas: ${p?.speciesCount ?? "0"}`,
            ),
          )
          .addTo(map);
      });
      map.on("mouseleave", BIODIVERSITY_POINTS_LAYER_ID, () => {
        map.getCanvas().style.cursor = "";
        popupRef.current?.remove();
      });

      setIsReady(true);
    });

    return () => {
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      popupRef.current = null;
    };
  }, [compact, geoData.biodiversityAreas, geoData.biodiversityPoints, geoData.fires, pressure, terrainBoost]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(() => {
      mapRef.current?.resize();
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady) return;
    const src = map.getSource("eco-affected") as GeoJSONSource | undefined;
    if (src) src.setData(buildAffectedFeature(pressure));
  }, [isReady, pressure]);

  useEffect(() => {
    // Terrain 3D has been removed to match the stable 2D perspective
  }, [isReady, terrainBoost]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady) return;
    updateFireData(map, geoData.fires);
    updateBiodiversityData(map, geoData.biodiversityPoints, geoData.biodiversityAreas);
  }, [geoData.biodiversityAreas, geoData.biodiversityPoints, geoData.fires, isReady]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !isReady) return;
    setFireVisibility(map, {
      fires: filters.visibility.fires,
      fireHeatmap: filters.visibility.fireHeatmap,
      fireClusters: filters.visibility.fireClusters,
    });
    setBiodiversityVisibility(map, filters.visibility);
  }, [filters.visibility, isReady]);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border bg-slate-200 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)]", className)}>
      <link href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css" rel="stylesheet" />
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-3xl bg-slate-200",
          compact ? "h-[300px] sm:h-[320px]" : "h-[420px] sm:h-[540px] lg:h-[640px]",
        )}
      >
        <div ref={containerRef} className="absolute inset-0" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-transparent" />
        {mapError ? (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <LocalVisualFallback />
          </div>
        ) : null}
      </div>

      {showControls ? (
        <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="pointer-events-auto rounded-2xl border border-border/70 bg-background/85 px-3 py-2 backdrop-blur">
            <p className="text-[11px] text-muted-foreground">Escenario temporal base</p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
              {ECO_POMAC.years.map((y, idx) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYearIndex(idx)}
                  className={cn(
                    "rounded-full border border-border px-2 py-0.5 transition-colors",
                    idx === yearIndex ? "bg-emerald-300/20 text-foreground" : "text-muted-foreground hover:bg-white/7",
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div className="pointer-events-auto rounded-2xl border border-border/70 bg-background/85 px-3 py-2 backdrop-blur">
            <p className="text-[11px] text-muted-foreground">Perspectiva</p>
            <p className="mt-1 text-xs font-medium text-foreground">Mapa estable 2D</p>
          </div>
        </div>
      ) : null}

      {!compact ? (
        <div className="pointer-events-none absolute left-3 top-20 hidden flex-wrap gap-2 md:flex">
          <FloatingMetric label="Incendios activos" value={geoData.stats.activeFires} tone="rose" />
          <FloatingMetric label="Area afectada" value={`${geoData.stats.affectedAreaHa} ha`} tone="amber" />
          <FloatingMetric label="Biodiversidad" value={geoData.stats.biodiversityPoints} tone="emerald" />
        </div>
      ) : null}

      {!compact ? (
        <div className="grid gap-2 border-t border-border/70 bg-black/15 p-3 md:hidden">
          <div className="grid gap-2 sm:grid-cols-3">
            <FloatingMetric label="Incendios activos" value={geoData.stats.activeFires} tone="rose" />
            <FloatingMetric label="Area afectada" value={`${geoData.stats.affectedAreaHa} ha`} tone="amber" />
            <FloatingMetric label="Biodiversidad" value={geoData.stats.biodiversityPoints} tone="emerald" />
          </div>
        </div>
      ) : null}

      {!compact ? (
        <>
          <div className="pointer-events-none absolute bottom-3 right-3">
            <button
              type="button"
              className="pointer-events-auto rounded-full border border-border/70 bg-background/90 px-3 py-1.5 text-xs backdrop-blur transition-colors hover:bg-background"
              onClick={() => setPanelsVisible((prev) => !prev)}
            >
              {panelsVisible ? "Ocultar paneles" : "Mostrar paneles"}
            </button>
          </div>
          <AnimatePresence>
            {panelsVisible ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 14 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="pointer-events-none absolute inset-3 bottom-14 top-auto hidden gap-3 xl:grid xl:grid-cols-3"
                >
                  <LayerPanel filters={filters} className="pointer-events-auto" />
                  <LegendPanel className="pointer-events-auto" />
                  <MapStatsPanel stats={geoData.stats} summary={filters.filterSummary} className="pointer-events-auto" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="grid gap-3 border-t border-border/70 bg-black/15 p-3 xl:hidden"
                >
                  <LayerPanel filters={filters} />
                  <LegendPanel />
                  <MapStatsPanel stats={geoData.stats} summary={filters.filterSummary} />
                </motion.div>
              </>
            ) : null}
          </AnimatePresence>
        </>
      ) : null}

      <AnimatePresence>
        {!isReady ? (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
          >
            <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-center backdrop-blur">
              <p className="text-sm font-medium">Cargando escena 3D</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Inicializando relieve, capas geoespaciales y panel analitico.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {mapError ? (
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-xl border border-amber-300/40 bg-black/55 px-3 py-2 text-xs text-amber-100 backdrop-blur">
          {mapError}
        </div>
      ) : null}
    </div>
  );
}

function LocalVisualFallback() {
  return (
    <svg viewBox="0 0 1000 600" className="h-full w-full opacity-70">
      <defs>
        <pattern id="eco-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeOpacity="0.25" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="1000" height="600" fill="#dbe4db" />
      <rect x="0" y="0" width="1000" height="600" fill="url(#eco-grid)" />
      <ellipse cx="500" cy="300" rx="210" ry="130" fill="#34d399" fillOpacity="0.16" stroke="#0f766e" strokeOpacity="0.65" strokeWidth="2" />
      <polygon
        points="430,350 455,280 535,255 590,310 560,370 475,380"
        fill="#fb7185"
        fillOpacity="0.2"
        stroke="#be123c"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <circle cx="500" cy="300" r="8" fill="#0f766e" stroke="white" strokeWidth="2" />
      <circle cx="455" cy="275" r="5" fill="#60a5fa" />
      <circle cx="560" cy="355" r="5" fill="#22c55e" />
      <circle cx="540" cy="265" r="5" fill="#f97316" />
    </svg>
  );
}

function FloatingMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "emerald" | "rose" | "amber";
}) {
  const toneClasses =
    tone === "emerald"
      ? "border-emerald-300/35 bg-emerald-300/10"
      : tone === "rose"
        ? "border-rose-300/35 bg-rose-300/10"
        : "border-amber-300/35 bg-amber-300/10";

  return (
    <div className={cn("pointer-events-auto rounded-2xl border px-3 py-2 backdrop-blur", toneClasses)}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

