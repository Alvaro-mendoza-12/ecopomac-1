import type {
  BiodiversityAreaCollection,
  BiodiversityPointCollection,
  FireFeatureCollection,
} from "@/features/map/types/geospatial";

export const fireEventsMock: FireFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "fire-001",
        name: "Queimada Estacional Norte",
        severity: "high",
        status: "active",
        observedAt: "2026-04-15T10:20:00.000Z",
        areaHa: 42,
        confidence: 0.91,
        source: "mock-firms",
      },
      geometry: { type: "Point", coordinates: [-79.852, -6.438] },
    },
    {
      type: "Feature",
      properties: {
        id: "fire-002",
        name: "Incidente Ribera Oeste",
        severity: "critical",
        status: "active",
        observedAt: "2026-03-28T16:40:00.000Z",
        areaHa: 117,
        confidence: 0.95,
        source: "mock-firms",
      },
      geometry: { type: "Point", coordinates: [-79.876, -6.463] },
    },
    {
      type: "Feature",
      properties: {
        id: "fire-003",
        name: "Foco Agrícola Este",
        severity: "medium",
        status: "controlled",
        observedAt: "2025-11-10T09:15:00.000Z",
        areaHa: 28,
        confidence: 0.84,
        source: "mock-firms",
      },
      geometry: { type: "Point", coordinates: [-79.842, -6.452] },
    },
    {
      type: "Feature",
      properties: {
        id: "fire-004",
        name: "Evento Histórico Sector Illimo",
        severity: "high",
        status: "historical",
        observedAt: "2020-08-23T13:00:00.000Z",
        areaHa: 260,
        confidence: 0.88,
        source: "mock-firms",
      },
      geometry: { type: "Point", coordinates: [-79.868, -6.478] },
    },
    {
      type: "Feature",
      properties: {
        id: "fire-005",
        name: "Incidente Histórico Pacora",
        severity: "low",
        status: "historical",
        observedAt: "2010-06-11T18:20:00.000Z",
        areaHa: 17,
        confidence: 0.77,
        source: "mock-firms",
      },
      geometry: { type: "Point", coordinates: [-79.89, -6.445] },
    },
    {
      type: "Feature",
      properties: {
        id: "fire-006",
        name: "Rebrote Zona Sur",
        severity: "medium",
        status: "active",
        observedAt: "2024-09-02T07:55:00.000Z",
        areaHa: 51,
        confidence: 0.86,
        source: "mock-firms",
      },
      geometry: { type: "Point", coordinates: [-79.858, -6.472] },
    },
  ],
};

export const biodiversityPointsMock: BiodiversityPointCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "bio-001",
        name: "Núcleo de algarrobo ancestral",
        kind: "habitat",
        conservationStatus: "vulnerable",
        speciesCount: 43,
        source: "mock-gbif",
      },
      geometry: { type: "Point", coordinates: [-79.86, -6.445] },
    },
    {
      type: "Feature",
      properties: {
        id: "bio-002",
        name: "Corredor de aves migratorias",
        kind: "species",
        conservationStatus: "endangered",
        speciesCount: 27,
        source: "mock-gbif",
      },
      geometry: { type: "Point", coordinates: [-79.873, -6.451] },
    },
    {
      type: "Feature",
      properties: {
        id: "bio-003",
        name: "Área de mamíferos menores",
        kind: "species",
        conservationStatus: "stable",
        speciesCount: 18,
        source: "mock-gbif",
      },
      geometry: { type: "Point", coordinates: [-79.848, -6.462] },
    },
    {
      type: "Feature",
      properties: {
        id: "bio-004",
        name: "Microhábitat de flora endémica",
        kind: "habitat",
        conservationStatus: "critical",
        speciesCount: 12,
        source: "mock-gbif",
      },
      geometry: { type: "Point", coordinates: [-79.866, -6.472] },
    },
  ],
};

export const biodiversityProtectedAreasMock: BiodiversityAreaCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "prot-001",
        name: "Zona Núcleo Pómac",
        conservationStatus: "vulnerable",
        protectedLevel: "national",
        areaHa: 1320,
        source: "mock-protected-planet",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.881, -6.459],
            [-79.874, -6.438],
            [-79.851, -6.437],
            [-79.842, -6.456],
            [-79.852, -6.474],
            [-79.876, -6.472],
            [-79.881, -6.459],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        id: "prot-002",
        name: "Franja de Restauración Oeste",
        conservationStatus: "endangered",
        protectedLevel: "regional",
        areaHa: 540,
        source: "mock-protected-planet",
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.892, -6.466],
            [-79.885, -6.446],
            [-79.874, -6.449],
            [-79.878, -6.468],
            [-79.892, -6.466],
          ],
        ],
      },
    },
  ],
};

