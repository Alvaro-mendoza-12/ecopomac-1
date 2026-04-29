import type { FeatureCollection, Point, Polygon } from "geojson";

export type FireSeverity = "low" | "medium" | "high" | "critical";
export type FireStatus = "active" | "controlled" | "historical";
export type BiodiversityKind = "species" | "habitat" | "protected_area";
export type ConservationStatus = "stable" | "vulnerable" | "endangered" | "critical";

export type FireProperties = {
  id: string;
  name: string;
  severity: FireSeverity;
  status: FireStatus;
  observedAt: string;
  areaHa: number;
  confidence: number;
  source: "mock-firms";
};

export type BiodiversityPointProperties = {
  id: string;
  name: string;
  kind: BiodiversityKind;
  conservationStatus: ConservationStatus;
  speciesCount: number;
  source: "mock-gbif";
};

export type BiodiversityAreaProperties = {
  id: string;
  name: string;
  conservationStatus: ConservationStatus;
  protectedLevel: "regional" | "national";
  areaHa: number;
  source: "mock-protected-planet";
};

export type FireFeatureCollection = FeatureCollection<Point, FireProperties>;
export type BiodiversityPointCollection = FeatureCollection<Point, BiodiversityPointProperties>;
export type BiodiversityAreaCollection = FeatureCollection<Polygon, BiodiversityAreaProperties>;

export type LayerVisibility = {
  fires: boolean;
  fireHeatmap: boolean;
  fireClusters: boolean;
  biodiversitySpecies: boolean;
  biodiversityHabitats: boolean;
  biodiversityProtectedAreas: boolean;
};

export type TemporalFilter = {
  fromYear: number;
  toYear: number;
};

export type GeospatialStats = {
  activeFires: number;
  historicalFires: number;
  affectedAreaHa: number;
  protectedAreaHa: number;
  biodiversityPoints: number;
};

