import type {
  BiodiversityAreaCollection,
  BiodiversityPointCollection,
  FireFeatureCollection,
} from "@/features/map/types/geospatial";

export type FirmsAdapter = {
  fetchFires: (args: { fromYear: number; toYear: number }) => Promise<FireFeatureCollection>;
};

export type GbifAdapter = {
  fetchBiodiversityPoints: (args: {
    conservationStatuses: string[];
  }) => Promise<BiodiversityPointCollection>;
};

export type ProtectedPlanetAdapter = {
  fetchProtectedAreas: () => Promise<BiodiversityAreaCollection>;
};

export type ExternalGeoAdapters = {
  firms?: FirmsAdapter;
  gbif?: GbifAdapter;
  protectedPlanet?: ProtectedPlanetAdapter;
};

// Placeholder for future production wiring with external APIs.
export function useExternalGeoAdapters(): ExternalGeoAdapters {
  return {};
}

