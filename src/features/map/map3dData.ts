import type { FeatureCollection, Polygon } from "geojson";

export type EcoMapPoint = {
  name: string;
  tag: "Flora" | "Fauna" | "Protección" | "Afectación";
  lng: number;
  lat: number;
  detail: string;
};

type InfraFeatureProps = {
  name: string;
  kind: "centro-poblado" | "infraestructura";
  height: number;
  base: number;
};

export const ecoMapPoints: EcoMapPoint[] = [
  {
    name: "Bosque de algarrobo",
    tag: "Flora",
    lat: -6.445,
    lng: -79.86,
    detail: "Especie clave del bosque seco; soporte de biodiversidad.",
  },
  {
    name: "Zorro costeño (referencia)",
    tag: "Fauna",
    lat: -6.452,
    lng: -79.866,
    detail: "Indicador ecológico; sensible a fragmentación de hábitat.",
  },
  {
    name: "Zona protegida (referencia)",
    tag: "Protección",
    lat: -6.447,
    lng: -79.872,
    detail: "Área prioritaria para conservación y vigilancia.",
  },
  {
    name: "Zona afectada (referencia)",
    tag: "Afectación",
    lat: -6.456,
    lng: -79.856,
    detail: "Pérdida de cobertura por presión antrópica (educativo).",
  },
];

export const affectedBasePolygon: [number, number][] = [
  [-79.87, -6.4585],
  [-79.875, -6.452],
  [-79.868, -6.4445],
  [-79.858, -6.448],
  [-79.861, -6.457],
  [-79.87, -6.4585],
];

export const infrastructureFeatures: FeatureCollection<Polygon, InfraFeatureProps> = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Centro de interpretación",
        kind: "infraestructura",
        height: 16,
        base: 0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.8668, -6.4512],
            [-79.8661, -6.4512],
            [-79.8661, -6.4506],
            [-79.8668, -6.4506],
            [-79.8668, -6.4512],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Área de servicios",
        kind: "centro-poblado",
        height: 10,
        base: 0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.8628, -6.4465],
            [-79.8619, -6.4465],
            [-79.8619, -6.4459],
            [-79.8628, -6.4459],
            [-79.8628, -6.4465],
          ],
        ],
      },
    },
    {
      type: "Feature",
      properties: {
        name: "Módulo de vigilancia",
        kind: "infraestructura",
        height: 13,
        base: 0,
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-79.8705, -6.4478],
            [-79.8697, -6.4478],
            [-79.8697, -6.4472],
            [-79.8705, -6.4472],
            [-79.8705, -6.4478],
          ],
        ],
      },
    },
  ],
};

export const yearPressure = [0.2, 0.3, 0.42, 0.55] as const;

