"use client";

import dynamic from "next/dynamic";

const StatsDashboard = dynamic(
  () => import("@/features/stats/StatsDashboard").then((m) => m.StatsDashboard),
  { ssr: false },
);

export function EstadisticasClient() {
  return <StatsDashboard />;
}

