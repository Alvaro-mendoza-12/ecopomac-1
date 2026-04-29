import type maplibregl from "maplibre-gl";
import type {
  BiodiversityAreaCollection,
  BiodiversityPointCollection,
  LayerVisibility,
} from "@/features/map/types/geospatial";

export const BIODIVERSITY_POINTS_SOURCE_ID = "layer-biodiversity-points";
export const BIODIVERSITY_AREAS_SOURCE_ID = "layer-biodiversity-areas";
export const BIODIVERSITY_POINTS_LAYER_ID = "layer-biodiversity-points-circle";
export const BIODIVERSITY_AREAS_FILL_LAYER_ID = "layer-biodiversity-areas-fill";
export const BIODIVERSITY_AREAS_LINE_LAYER_ID = "layer-biodiversity-areas-line";

export function addBiodiversityLayers(
  map: maplibregl.Map,
  points: BiodiversityPointCollection,
  areas: BiodiversityAreaCollection,
) {
  if (!map.getSource(BIODIVERSITY_POINTS_SOURCE_ID)) {
    map.addSource(BIODIVERSITY_POINTS_SOURCE_ID, {
      type: "geojson",
      data: points,
    });
  }
  if (!map.getSource(BIODIVERSITY_AREAS_SOURCE_ID)) {
    map.addSource(BIODIVERSITY_AREAS_SOURCE_ID, {
      type: "geojson",
      data: areas,
    });
  }

  if (!map.getLayer(BIODIVERSITY_AREAS_FILL_LAYER_ID)) {
    map.addLayer({
      id: BIODIVERSITY_AREAS_FILL_LAYER_ID,
      type: "fill-extrusion",
      source: BIODIVERSITY_AREAS_SOURCE_ID,
      paint: {
        "fill-extrusion-color": [
          "match",
          ["get", "conservationStatus"],
          "stable",
          "#4ade80",
          "vulnerable",
          "#a3e635",
          "endangered",
          "#f59e0b",
          "critical",
          "#ef4444",
          "#4ade80",
        ],
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "areaHa"], 0],
          0,
          6,
          1600,
          24,
        ],
        "fill-extrusion-opacity": 0.34,
      },
    });
  }

  if (!map.getLayer(BIODIVERSITY_AREAS_LINE_LAYER_ID)) {
    map.addLayer({
      id: BIODIVERSITY_AREAS_LINE_LAYER_ID,
      type: "line",
      source: BIODIVERSITY_AREAS_SOURCE_ID,
      paint: {
        "line-color": "#34d399",
        "line-width": 1.8,
        "line-opacity": 0.85,
      },
    });
  }

  if (!map.getLayer(BIODIVERSITY_POINTS_LAYER_ID)) {
    map.addLayer({
      id: BIODIVERSITY_POINTS_LAYER_ID,
      type: "circle",
      source: BIODIVERSITY_POINTS_SOURCE_ID,
      paint: {
        "circle-color": [
          "match",
          ["get", "kind"],
          "species",
          "#60a5fa",
          "habitat",
          "#2dd4bf",
          "protected_area",
          "#34d399",
          "#a3e635",
        ],
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["coalesce", ["get", "speciesCount"], 0],
          0,
          5,
          50,
          12,
        ],
        "circle-opacity": 0.95,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 1,
      },
    });
  }
}

export function updateBiodiversityData(
  map: maplibregl.Map,
  points: BiodiversityPointCollection,
  areas: BiodiversityAreaCollection,
) {
  const pointsSource = map.getSource(BIODIVERSITY_POINTS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
  const areasSource = map.getSource(BIODIVERSITY_AREAS_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
  if (pointsSource) pointsSource.setData(points);
  if (areasSource) areasSource.setData(areas);
}

export function setBiodiversityVisibility(map: maplibregl.Map, visibility: LayerVisibility) {
  const showPoints = visibility.biodiversitySpecies || visibility.biodiversityHabitats;
  const showAreas = visibility.biodiversityProtectedAreas;

  if (map.getLayer(BIODIVERSITY_POINTS_LAYER_ID)) {
    map.setLayoutProperty(BIODIVERSITY_POINTS_LAYER_ID, "visibility", showPoints ? "visible" : "none");
  }
  if (map.getLayer(BIODIVERSITY_AREAS_FILL_LAYER_ID)) {
    map.setLayoutProperty(BIODIVERSITY_AREAS_FILL_LAYER_ID, "visibility", showAreas ? "visible" : "none");
  }
  if (map.getLayer(BIODIVERSITY_AREAS_LINE_LAYER_ID)) {
    map.setLayoutProperty(BIODIVERSITY_AREAS_LINE_LAYER_ID, "visibility", showAreas ? "visible" : "none");
  }
}

