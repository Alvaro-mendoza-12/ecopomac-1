import type maplibregl from "maplibre-gl";
import type { FireFeatureCollection } from "@/features/map/types/geospatial";

export const FIRE_SOURCE_ID = "layer-fires";
export const FIRE_HEAT_LAYER_ID = "layer-fires-heat";
export const FIRE_CLUSTER_LAYER_ID = "layer-fires-clusters";
export const FIRE_CLUSTER_COUNT_LAYER_ID = "layer-fires-cluster-count";
export const FIRE_POINTS_LAYER_ID = "layer-fires-points";

export function addFireLayers(map: maplibregl.Map, data: FireFeatureCollection) {
  if (!map.getSource(FIRE_SOURCE_ID)) {
    map.addSource(FIRE_SOURCE_ID, {
      type: "geojson",
      data,
      cluster: true,
      clusterRadius: 48,
      clusterMaxZoom: 10,
    });
  }

  if (!map.getLayer(FIRE_HEAT_LAYER_ID)) {
    map.addLayer({
      id: FIRE_HEAT_LAYER_ID,
      type: "heatmap",
      source: FIRE_SOURCE_ID,
      maxzoom: 12,
      paint: {
        "heatmap-weight": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "areaHa"], 0],
          0,
          0,
          200,
          1,
        ],
        "heatmap-intensity": 1.1,
        "heatmap-color": [
          "interpolate",
          ["linear"],
          ["heatmap-density"],
          0,
          "rgba(34,197,94,0)",
          0.35,
          "#facc15",
          0.6,
          "#fb7185",
          1,
          "#b91c1c",
        ],
        "heatmap-radius": 22,
        "heatmap-opacity": 0.65,
      },
    });
  }

  if (!map.getLayer(FIRE_CLUSTER_LAYER_ID)) {
    map.addLayer({
      id: FIRE_CLUSTER_LAYER_ID,
      type: "circle",
      source: FIRE_SOURCE_ID,
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#f59e0b",
          12,
          "#f97316",
          24,
          "#ef4444",
        ],
        "circle-radius": ["step", ["get", "point_count"], 14, 12, 20, 24, 26],
        "circle-opacity": 0.88,
      },
    });
  }

  if (!map.getLayer(FIRE_CLUSTER_COUNT_LAYER_ID)) {
    map.addLayer({
      id: FIRE_CLUSTER_COUNT_LAYER_ID,
      type: "symbol",
      source: FIRE_SOURCE_ID,
      filter: ["has", "point_count"],
      layout: {
        "text-field": "{point_count_abbreviated}",
        "text-size": 11,
      },
      paint: {
        "text-color": "#111827",
      },
    });
  }

  if (!map.getLayer(FIRE_POINTS_LAYER_ID)) {
    map.addLayer({
      id: FIRE_POINTS_LAYER_ID,
      type: "circle",
      source: FIRE_SOURCE_ID,
      filter: ["!", ["has", "point_count"]],
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "areaHa"], 0],
          0,
          4,
          200,
          10,
        ],
        "circle-color": [
          "match",
          ["get", "severity"],
          "low",
          "#facc15",
          "medium",
          "#f97316",
          "high",
          "#ef4444",
          "critical",
          "#b91c1c",
          "#f59e0b",
        ],
        "circle-stroke-width": 1.1,
        "circle-stroke-color": "#fff",
        "circle-opacity": 0.95,
      },
    });
  }
}

export function updateFireData(map: maplibregl.Map, data: FireFeatureCollection) {
  const source = map.getSource(FIRE_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
  if (source) source.setData(data);
}

export function setFireVisibility(
  map: maplibregl.Map,
  opts: { fires: boolean; fireHeatmap: boolean; fireClusters: boolean },
) {
  const visibility = opts.fires ? "visible" : "none";
  const heatVisibility = opts.fires && opts.fireHeatmap ? "visible" : "none";
  const clusterVisibility = opts.fires && opts.fireClusters ? "visible" : "none";
  const pointsVisibility = opts.fires ? "visible" : "none";

  if (map.getLayer(FIRE_HEAT_LAYER_ID)) map.setLayoutProperty(FIRE_HEAT_LAYER_ID, "visibility", heatVisibility);
  if (map.getLayer(FIRE_CLUSTER_LAYER_ID)) {
    map.setLayoutProperty(FIRE_CLUSTER_LAYER_ID, "visibility", clusterVisibility);
  }
  if (map.getLayer(FIRE_CLUSTER_COUNT_LAYER_ID)) {
    map.setLayoutProperty(FIRE_CLUSTER_COUNT_LAYER_ID, "visibility", clusterVisibility);
  }
  if (map.getLayer(FIRE_POINTS_LAYER_ID)) {
    map.setLayoutProperty(FIRE_POINTS_LAYER_ID, "visibility", pointsVisibility);
  }
  if (!opts.fires) {
    if (map.getLayer(FIRE_HEAT_LAYER_ID)) map.setLayoutProperty(FIRE_HEAT_LAYER_ID, "visibility", "none");
    if (map.getLayer(FIRE_POINTS_LAYER_ID)) map.setLayoutProperty(FIRE_POINTS_LAYER_ID, "visibility", "none");
    if (map.getLayer(FIRE_CLUSTER_LAYER_ID)) map.setLayoutProperty(FIRE_CLUSTER_LAYER_ID, "visibility", "none");
    if (map.getLayer(FIRE_CLUSTER_COUNT_LAYER_ID)) {
      map.setLayoutProperty(FIRE_CLUSTER_COUNT_LAYER_ID, "visibility", "none");
    }
  } else if (visibility === "visible") {
    // Keep point rendering explicit when fires are active.
    if (map.getLayer(FIRE_POINTS_LAYER_ID)) map.setLayoutProperty(FIRE_POINTS_LAYER_ID, "visibility", "visible");
  }
}

