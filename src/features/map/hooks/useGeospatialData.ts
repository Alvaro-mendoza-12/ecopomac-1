"use client";

import { useMemo } from "react";
import {
  biodiversityPointsMock,
  biodiversityProtectedAreasMock,
  fireEventsMock,
} from "@/features/map/data/mockGeoData";
import type {
  BiodiversityAreaCollection,
  BiodiversityPointCollection,
  FireFeatureCollection,
  GeospatialStats,
} from "@/features/map/types/geospatial";
import type { UseGeospatialFiltersResult } from "./useGeospatialFilters";

type PreparedGeoData = {
  fires: FireFeatureCollection;
  biodiversityPoints: BiodiversityPointCollection;
  biodiversityAreas: BiodiversityAreaCollection;
  stats: GeospatialStats;
};

function inTemporalRange(iso: string, fromYear: number, toYear: number) {
  const year = new Date(iso).getUTCFullYear();
  return year >= fromYear && year <= toYear;
}

export function useGeospatialData(filters: UseGeospatialFiltersResult): PreparedGeoData {
  const { temporal, conservationStatuses, visibility } = filters;

  return useMemo(() => {
    const fires: FireFeatureCollection = {
      type: "FeatureCollection",
      features: fireEventsMock.features.filter((f) => {
        if (!visibility.fires) return false;
        return inTemporalRange(f.properties.observedAt, temporal.fromYear, temporal.toYear);
      }),
    };

    const biodiversityPoints: BiodiversityPointCollection = {
      type: "FeatureCollection",
      features: biodiversityPointsMock.features.filter((f) => {
        if (!conservationStatuses.includes(f.properties.conservationStatus)) return false;
        if (f.properties.kind === "species" && !visibility.biodiversitySpecies) return false;
        if (f.properties.kind === "habitat" && !visibility.biodiversityHabitats) return false;
        return true;
      }),
    };

    const biodiversityAreas: BiodiversityAreaCollection = {
      type: "FeatureCollection",
      features: biodiversityProtectedAreasMock.features.filter((f) => {
        if (!visibility.biodiversityProtectedAreas) return false;
        return conservationStatuses.includes(f.properties.conservationStatus);
      }),
    };

    const stats: GeospatialStats = {
      activeFires: fires.features.filter((f) => f.properties.status === "active").length,
      historicalFires: fires.features.filter((f) => f.properties.status === "historical").length,
      affectedAreaHa: Math.round(fires.features.reduce((acc, f) => acc + f.properties.areaHa, 0)),
      protectedAreaHa: Math.round(
        biodiversityAreas.features.reduce((acc, f) => acc + f.properties.areaHa, 0),
      ),
      biodiversityPoints: biodiversityPoints.features.length,
    };

    return { fires, biodiversityPoints, biodiversityAreas, stats };
  }, [conservationStatuses, temporal.fromYear, temporal.toYear, visibility]);
}

