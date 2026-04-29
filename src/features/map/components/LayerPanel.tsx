"use client";

import type { ConservationStatus } from "@/features/map/types/geospatial";
import type { UseGeospatialFiltersResult } from "@/features/map/hooks/useGeospatialFilters";
import { cn } from "@/lib/cn";

type LayerPanelProps = {
  filters: UseGeospatialFiltersResult;
  className?: string;
};

const conservationOptions: ConservationStatus[] = ["stable", "vulnerable", "endangered", "critical"];

function statusLabel(status: ConservationStatus) {
  if (status === "stable") return "Estable";
  if (status === "vulnerable") return "Vulnerable";
  if (status === "endangered") return "En peligro";
  return "Crítico";
}

export function LayerPanel({ filters, className }: LayerPanelProps) {
  const { visibility, setVisibility, temporal, setTemporal, conservationStatuses, setConservationStatuses } =
    filters;

  const toggleConservation = (status: ConservationStatus) => {
    if (conservationStatuses.includes(status)) {
      setConservationStatuses(conservationStatuses.filter((s) => s !== status));
      return;
    }
    setConservationStatuses([...conservationStatuses, status]);
  };

  return (
    <div className={cn("rounded-2xl border border-border/70 bg-background/85 p-3 backdrop-blur", className)}>
      <p className="text-xs font-medium">Panel de capas</p>
      <div className="mt-2 grid gap-2 text-[11px]">
        {(
          [
            ["fires", "Incendios"],
            ["fireHeatmap", "Heatmap incendios"],
            ["fireClusters", "Clusters incendios"],
            ["biodiversitySpecies", "Biodiversidad: especies"],
            ["biodiversityHabitats", "Biodiversidad: hábitats"],
            ["biodiversityProtectedAreas", "Zonas protegidas"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="flex items-center justify-between gap-3">
            <span>{label}</span>
            <input
              type="checkbox"
              checked={visibility[key]}
              onChange={(e) => setVisibility((prev) => ({ ...prev, [key]: e.target.checked }))}
            />
          </label>
        ))}
      </div>

      <div className="mt-3 border-t border-border/70 pt-3">
        <p className="text-[11px] text-muted-foreground">Filtro temporal</p>
        <div className="mt-1 grid grid-cols-2 gap-2 text-[11px]">
          <label className="grid gap-1">
            <span>Desde</span>
            <input
              className="rounded-md border border-border bg-background/70 px-2 py-1"
              type="number"
              value={temporal.fromYear}
              onChange={(e) => setTemporal((prev) => ({ ...prev, fromYear: Number(e.target.value) }))}
            />
          </label>
          <label className="grid gap-1">
            <span>Hasta</span>
            <input
              className="rounded-md border border-border bg-background/70 px-2 py-1"
              type="number"
              value={temporal.toYear}
              onChange={(e) => setTemporal((prev) => ({ ...prev, toYear: Number(e.target.value) }))}
            />
          </label>
        </div>
      </div>

      <div className="mt-3 border-t border-border/70 pt-3">
        <p className="text-[11px] text-muted-foreground">Estado de conservación</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {conservationOptions.map((status) => {
            const active = conservationStatuses.includes(status);
            return (
              <button
                key={status}
                type="button"
                onClick={() => toggleConservation(status)}
                className={cn(
                  "rounded-full border border-border px-2 py-0.5 text-[11px]",
                  active ? "bg-emerald-300/20 text-foreground" : "text-muted-foreground",
                )}
              >
                {statusLabel(status)}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

