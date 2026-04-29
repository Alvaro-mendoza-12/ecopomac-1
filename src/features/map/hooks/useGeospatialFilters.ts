"use client";

import { useMemo, useState } from "react";
import type { ConservationStatus, LayerVisibility, TemporalFilter } from "@/features/map/types/geospatial";

const currentYear = new Date().getUTCFullYear();

export function useGeospatialFilters() {
  const [visibility, setVisibility] = useState<LayerVisibility>({
    fires: true,
    fireHeatmap: true,
    fireClusters: true,
    biodiversitySpecies: true,
    biodiversityHabitats: true,
    biodiversityProtectedAreas: true,
  });
  const [temporal, setTemporal] = useState<TemporalFilter>({
    fromYear: currentYear - 10,
    toYear: currentYear,
  });
  const [conservationStatuses, setConservationStatuses] = useState<ConservationStatus[]>([
    "stable",
    "vulnerable",
    "endangered",
    "critical",
  ]);

  const filterSummary = useMemo(
    () =>
      `${temporal.fromYear}-${temporal.toYear} · ${
        conservationStatuses.length
      } estados · ${Object.values(visibility).filter(Boolean).length} capas`,
    [conservationStatuses.length, temporal.fromYear, temporal.toYear, visibility],
  );

  return {
    visibility,
    setVisibility,
    temporal,
    setTemporal,
    conservationStatuses,
    setConservationStatuses,
    filterSummary,
  };
}

export type UseGeospatialFiltersResult = ReturnType<typeof useGeospatialFilters>;

