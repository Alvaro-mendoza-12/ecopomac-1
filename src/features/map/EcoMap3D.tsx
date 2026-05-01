"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { useGeospatialFilters } from "@/features/map/hooks/useGeospatialFilters";
import { useGeospatialData } from "@/features/map/hooks/useGeospatialData";

const StableLeafletMap = dynamic(
  () => import("@/features/map/StableLeafletMap").then((m) => m.StableLeafletMap),
  { ssr: false }
);

type EcoMap3DProps = {
  className?: string;
  compact?: boolean;
  showControls?: boolean;
  defaultPanelsVisible?: boolean;
};

export function EcoMap3D({
  className,
  compact = false,
}: EcoMap3DProps) {
  const filters = useGeospatialFilters();
  const geoData = useGeospatialData(filters);

  return (
    <div className={cn("relative overflow-hidden rounded-3xl border border-border bg-slate-200 shadow-[0_30px_80px_-45px_rgba(0,0,0,0.9)]", className)}>
      <StableLeafletMap compact={compact} className="border-0 shadow-none rounded-none" />

      {!compact ? (
        <div className="pointer-events-none absolute left-3 top-3 hidden flex-wrap gap-2 md:flex">
          <FloatingMetric label="Incendios activos" value={geoData.stats.activeFires} tone="rose" />
          <FloatingMetric label="Area afectada" value={`${geoData.stats.affectedAreaHa} ha`} tone="amber" />
          <FloatingMetric label="Biodiversidad" value={geoData.stats.biodiversityPoints} tone="emerald" />
        </div>
      ) : null}

      {!compact ? (
        <div className="grid gap-2 border-t border-border/70 bg-black/15 p-3 md:hidden">
          <div className="grid gap-2 sm:grid-cols-3">
            <FloatingMetric label="Incendios activos" value={geoData.stats.activeFires} tone="rose" />
            <FloatingMetric label="Area afectada" value={`${geoData.stats.affectedAreaHa} ha`} tone="amber" />
            <FloatingMetric label="Biodiversidad" value={geoData.stats.biodiversityPoints} tone="emerald" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FloatingMetric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: "emerald" | "rose" | "amber";
}) {
  const toneClasses =
    tone === "emerald"
      ? "border-emerald-300/35 bg-emerald-300/10 text-emerald-100"
      : tone === "rose"
        ? "border-rose-300/35 bg-rose-300/10 text-rose-100"
        : "border-amber-300/35 bg-amber-300/10 text-amber-100";

  return (
    <div className={cn("pointer-events-auto rounded-2xl border px-3 py-2 backdrop-blur", toneClasses)}>
      <p className="text-[10px] opacity-80">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}

