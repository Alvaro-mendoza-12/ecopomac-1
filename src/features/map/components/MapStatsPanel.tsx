"use client";

import type { GeospatialStats } from "@/features/map/types/geospatial";
import { cn } from "@/lib/cn";

type MapStatsPanelProps = {
  stats: GeospatialStats;
  summary: string;
  className?: string;
};

export function MapStatsPanel({ stats, summary, className }: MapStatsPanelProps) {
  return (
    <div className={cn("rounded-2xl border border-border/70 bg-background/85 p-3 backdrop-blur", className)}>
      <p className="text-xs font-medium">Estadísticas en tiempo real</p>
      <p className="mt-1 text-[11px] text-muted-foreground">{summary}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px]">
        <StatItem label="Activos" value={stats.activeFires} />
        <StatItem label="Históricos" value={stats.historicalFires} />
        <StatItem label="Área afectada" value={`${stats.affectedAreaHa} ha`} />
        <StatItem label="Área protegida" value={`${stats.protectedAreaHa} ha`} />
      </div>
      <div className="mt-2 rounded-lg border border-border/60 bg-background/70 px-2 py-1 text-[11px]">
        Puntos biodiversidad: <span className="font-medium">{stats.biodiversityPoints}</span>
      </div>
    </div>
  );
}

function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/70 px-2 py-1">
      <p className="text-muted-foreground">{label}</p>
      <p className="font-medium text-foreground">{value}</p>
    </div>
  );
}

