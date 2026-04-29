"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/features/map/MapView").then((m) => m.MapView), {
  ssr: false,
});

export function MapaClient() {
  return <MapView />;
}

